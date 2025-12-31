import React, { useState, useEffect } from "react";
import { getAllExpos, createSession } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  alpha
} from "@mui/material";
import {
  Add as AddIcon,
  Event as EventIcon,
  Title as TitleIcon,
  Description as DescriptionIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon
} from "@mui/icons-material";

export default function CreateSession() {
  const { token } = useAuth();
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [formData, setFormData] = useState({
    expoId: "",
    title: "",
    description: "",
    startTime: "",
    endTime: "",
  });
  const [errors, setErrors] = useState({
    expoId: "",
    title: "",
    startTime: "",
    endTime: "",
    description: ""
  });

  // Fetch all expos on mount
  useEffect(() => {
    fetchExpos();
  }, []);

  const fetchExpos = async () => {
    setLoading(true);
    try {
      const res = await getAllExpos(token);
      setExpos(res.data || []);
    } catch (err) {
      console.error("Error fetching expos:", err);
      setSnackbar({
        open: true,
        message: "Failed to load expos. Please try again.",
        severity: "error"
      });
    } finally {
      setLoading(false);
      setRefreshLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshLoading(true);
    fetchExpos();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.expoId.trim()) {
      newErrors.expoId = "Please select an expo";
      isValid = false;
    }

    if (!formData.title.trim()) {
      newErrors.title = "Session title is required";
      isValid = false;
    }

    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
      isValid = false;
    }

    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
      isValid = false;
    }

    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      if (end <= start) {
        newErrors.endTime = "End time must be after start time";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setCreating(true);
    try {
      // Prepare data for API
      const sessionData = {
        expoId: formData.expoId.trim(),
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        startTime: formData.startTime,
        endTime: formData.endTime,
      };

      console.log("Creating session with data:", sessionData);
      
      await createSession(sessionData, token);
      
      setSnackbar({
        open: true,
        message: "Session created successfully!",
        severity: "success"
      });

      // Reset form
      setFormData({
        expoId: "",
        title: "",
        description: "",
        startTime: "",
        endTime: "",
      });

      setErrors({
        expoId: "",
        title: "",
        startTime: "",
        endTime: "",
        description: ""
      });

    } catch (err) {
      console.error("Session creation failed:", err);
      
      let errorMessage = "Failed to create session. ";
      if (err.response?.data?.message) {
        errorMessage += err.response.data.message;
      } else if (err.message) {
        errorMessage += err.message;
      } else if (err.response?.data?.error) {
        errorMessage += err.response.data.error;
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error"
      });
    } finally {
      setCreating(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const resetForm = () => {
    setFormData({
      expoId: "",
      title: "",
      description: "",
      startTime: "",
      endTime: "",
    });
    setErrors({
      expoId: "",
      title: "",
      startTime: "",
      endTime: "",
      description: ""
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return "Invalid Date";
    }
  };

  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      
      // Convert to local datetime string in YYYY-MM-DDTHH:mm format
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return "";
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          background: "linear-gradient(135deg, rgba(30, 60, 114, 0.9) 0%, rgba(42, 82, 152, 0.9) 100%)",
          border: "1px solid rgba(79, 195, 247, 0.2)"
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ 
              width: 48, 
              height: 48, 
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <EventIcon sx={{ fontSize: 26, color: "white" }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold" sx={{ color: "white", mb: 0.5 }}>
                Create New Session
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Schedule sessions for your exhibitions
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Refresh expos list">
              <IconButton
                onClick={handleRefresh}
                disabled={refreshLoading}
                sx={{
                  color: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)"
                  }
                }}
              >
                {refreshLoading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
            Select an expo and schedule your session
          </Typography>
        </Box>
      </Paper>

      {/* Main Form */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={4}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 2,
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)",
              border: "1px solid rgba(79, 195, 247, 0.15)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            }}
          >
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {/* Expo Selection */}
                <FormControl fullWidth error={!!errors.expoId}>
                  <InputLabel 
                    sx={{ 
                      color: "rgba(255, 255, 255, 0.6)",
                      "&.Mui-focused": {
                        color: "#4fc3f7"
                      }
                    }}
                  >
                    Select Expo *
                  </InputLabel>
                  <Select
                    name="expoId"
                    value={formData.expoId}
                    onChange={handleChange}
                    label="Select Expo *"
                    disabled={loading || creating}
                    sx={{
                      color: 'white !important',
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      '& .MuiSelect-select': {
                        color: 'white !important',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: errors.expoId ? '#f44336' : 'rgba(255, 255, 255, 0.1)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: errors.expoId ? '#f44336' : '#4fc3f7',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: errors.expoId ? '#f44336' : '#4fc3f7',
                        boxShadow: errors.expoId 
                          ? '0 0 0 2px rgba(244, 67, 54, 0.2)'
                          : '0 0 0 2px rgba(79, 195, 247, 0.2)',
                      },
                      '& .MuiSelect-icon': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(79, 195, 247, 0.2)',
                          '& .MuiMenuItem-root': {
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'rgba(79, 195, 247, 0.1)',
                            },
                            '&.Mui-selected': {
                              backgroundColor: 'rgba(79, 195, 247, 0.2)',
                              '&:hover': {
                                backgroundColor: 'rgba(79, 195, 247, 0.3)',
                              }
                            }
                          }
                        }
                      }
                    }}
                  >
                    <MenuItem value="">
                      <Typography sx={{ color: "rgba(255, 255, 255, 0.7)", fontStyle: "italic" }}>
                        Select an expo
                      </Typography>
                    </MenuItem>
                    {loading ? (
                      <MenuItem disabled>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={20} color="inherit" />
                          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                            Loading expos...
                          </Typography>
                        </Box>
                      </MenuItem>
                    ) : (
                      expos.map((ex) => (
                        <MenuItem key={ex._id} value={ex._id}>
                          <Box sx={{ width: "100%" }}>
                            <Typography variant="body1" sx={{ color: "white", fontWeight: 500 }}>
                              {ex.title}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
                              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LocationIcon fontSize="inherit" />
                                {ex.location || "No location"}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                {formatDate(ex.startDate)}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  {errors.expoId && (
                    <Typography variant="caption" sx={{ color: "#f44336", ml: 2, mt: 0.5, display: 'block' }}>
                      {errors.expoId}
                    </Typography>
                  )}
                </FormControl>

                {/* Session Title */}
                <TextField
                  fullWidth
                  name="title"
                  label="Session Title *"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Opening Ceremony, Keynote Speech"
                  disabled={creating}
                  error={!!errors.title}
                  helperText={errors.title}
                  InputProps={{
                    startAdornment: (
                      <TitleIcon sx={{ color: '#4fc3f7', mr: 1 }} />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      '& fieldset': {
                        borderColor: errors.title ? '#f44336' : 'rgba(255, 255, 255, 0.1)',
                      },
                      '&:hover fieldset': {
                        borderColor: errors.title ? '#f44336' : '#4fc3f7',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: errors.title ? '#f44336' : '#4fc3f7',
                        boxShadow: errors.title 
                          ? '0 0 0 2px rgba(244, 67, 54, 0.2)'
                          : '0 0 0 2px rgba(79, 195, 247, 0.2)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.6)',
                    },
                    '& .MuiFormHelperText-root': {
                      color: errors.title ? '#f44336' : 'rgba(255, 255, 255, 0.5)',
                    },
                  }}
                />

                {/* Description */}
                <TextField
                  fullWidth
                  name="description"
                  label="Description (Optional)"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the session agenda, speakers, or topics..."
                  multiline
                  rows={4}
                  disabled={creating}
                  InputProps={{
                    startAdornment: (
                      <DescriptionIcon sx={{ color: '#4fc3f7', mr: 1, mt: 1.5 }} />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#4fc3f7',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4fc3f7',
                        boxShadow: '0 0 0 2px rgba(79, 195, 247, 0.2)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.6)',
                    },
                  }}
                />

                {/* Time Grid */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="startTime"
                      label="Start Time *"
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={handleChange}
                      disabled={creating}
                      error={!!errors.startTime}
                      helperText={errors.startTime}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <TimeIcon sx={{ color: '#4fc3f7', mr: 1 }} />
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          backgroundColor: 'rgba(0, 0, 0, 0.2)',
                          '& fieldset': {
                            borderColor: errors.startTime ? '#f44336' : 'rgba(255, 255, 255, 0.1)',
                          },
                          '&:hover fieldset': {
                            borderColor: errors.startTime ? '#f44336' : '#4fc3f7',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: errors.startTime ? '#f44336' : '#4fc3f7',
                            boxShadow: errors.startTime 
                              ? '0 0 0 2px rgba(244, 67, 54, 0.2)'
                              : '0 0 0 2px rgba(79, 195, 247, 0.2)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.6)',
                        },
                        '& .MuiFormHelperText-root': {
                          color: errors.startTime ? '#f44336' : 'rgba(255, 255, 255, 0.5)',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="endTime"
                      label="End Time *"
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={handleChange}
                      disabled={creating}
                      error={!!errors.endTime}
                      helperText={errors.endTime}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <TimeIcon sx={{ color: '#4fc3f7', mr: 1 }} />
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          backgroundColor: 'rgba(0, 0, 0, 0.2)',
                          '& fieldset': {
                            borderColor: errors.endTime ? '#f44336' : 'rgba(255, 255, 255, 0.1)',
                          },
                          '&:hover fieldset': {
                            borderColor: errors.endTime ? '#f44336' : '#4fc3f7',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: errors.endTime ? '#f44336' : '#4fc3f7',
                            boxShadow: errors.endTime 
                              ? '0 0 0 2px rgba(244, 67, 54, 0.2)'
                              : '0 0 0 2px rgba(79, 195, 247, 0.2)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.6)',
                        },
                        '& .MuiFormHelperText-root': {
                          color: errors.endTime ? '#f44336' : 'rgba(255, 255, 255, 0.5)',
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 1 }} />

                {/* Action Buttons */}
                <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between", mt: 2 }}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      onClick={resetForm}
                      disabled={creating}
                      variant="outlined"
                      sx={{
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'rgba(255, 255, 255, 0.7)',
                        px: 3,
                        py: 1,
                        borderRadius: 1,
                        textTransform: 'none',
                        fontWeight: 500,
                        '&:hover': {
                          borderColor: '#4fc3f7',
                          backgroundColor: 'rgba(79, 195, 247, 0.1)',
                        },
                      }}
                    >
                      Reset
                    </Button>
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={creating || !formData.expoId || !formData.title || !formData.startTime || !formData.endTime}
                    startIcon={creating ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                    sx={{
                      background: !formData.expoId || !formData.title || !formData.startTime || !formData.endTime
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      px: 4,
                      py: 1,
                      borderRadius: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                      minWidth: 160,
                      '&:hover': {
                        background: !formData.expoId || !formData.title || !formData.startTime || !formData.endTime
                          ? 'rgba(255, 255, 255, 0.1)'
                          : 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                        transform: (formData.expoId && formData.title && formData.startTime && formData.endTime) ? 'translateY(-2px)' : 'none',
                        boxShadow: (formData.expoId && formData.title && formData.startTime && formData.endTime) ? '0 6px 20px rgba(102, 126, 234, 0.4)' : 'none',
                      },
                      transition: 'all 0.3s ease-in-out',
                    }}
                  >
                    {creating ? 'Creating...' : 'Create Session'}
                  </Button>
                </Box>
              </Box>
            </form>
          </Paper>
        </Grid>

        {/* Info Card */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: "100%",
              background: "rgba(30, 41, 59, 0.5)",
              border: "1px solid rgba(79, 195, 247, 0.1)",
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: "#4fc3f7", mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <CheckCircleIcon /> Tips
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: "rgba(255, 255, 255, 0.5)", mb: 0.5 }}>
                  Session Timing
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  Ensure sessions fit within expo dates and don't overlap with other sessions
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: "rgba(255, 255, 255, 0.5)", mb: 0.5 }}>
                  Title Best Practices
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  Use clear titles like "Opening Ceremony" or "Panel: Future of Tech"
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: "rgba(255, 255, 255, 0.5)", mb: 0.5 }}>
                  Description
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  Include agenda, speakers, topics, and any special requirements
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ color: "rgba(255, 255, 255, 0.5)", mb: 0.5 }}>
                  Required Fields
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  • Expo selection<br />
                  • Session title<br />
                  • Start time<br />
                  • End time
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}