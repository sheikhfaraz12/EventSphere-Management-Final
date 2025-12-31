import React, { useState, useEffect } from "react";
import { getAllExpos, createBooths } from "../../services/api";
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
  ArrowBack as ArrowBackIcon,
  Event as EventIcon,
  ConfirmationNumber as BoothIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationIcon
} from "@mui/icons-material";

export default function CreateBooth({ setActivePage }) {
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
    boothNumber: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    expoId: "",
    boothNumber: "",
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

    if (!formData.boothNumber.trim()) {
      newErrors.boothNumber = "Booth number is required";
      isValid = false;
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
      const boothData = {
        expoId: formData.expoId.trim(),
        boothNumber: formData.boothNumber.trim(),
        description: formData.description.trim() || undefined
      };

      console.log("Creating booth with data:", boothData);
      
      await createBooths(boothData, token);
      
      setSnackbar({
        open: true,
        message: "Booth created successfully!",
        severity: "success"
      });

      // Reset form
      setFormData({
        expoId: "",
        boothNumber: "",
        description: "",
      });

      setErrors({
        expoId: "",
        boothNumber: "",
        description: ""
      });

    } catch (err) {
      console.error("Booth creation failed:", err);
      
      let errorMessage = "Failed to create booth. ";
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
      boothNumber: "",
      description: "",
    });
    setErrors({
      expoId: "",
      boothNumber: "",
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
              background: "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <AddIcon sx={{ fontSize: 26, color: "white" }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold" sx={{ color: "white", mb: 0.5 }}>
                Create New Booth
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Add booth spaces to your exhibitions
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
            Select an expo and fill booth details below
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
                {/* Expo Selection - FIXED DROPDOWN */}
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

                {/* Booth Number */}
                <TextField
                  fullWidth
                  name="boothNumber"
                  label="Booth Number *"
                  value={formData.boothNumber}
                  onChange={handleChange}
                  placeholder="e.g., A-101, B-205"
                  disabled={creating}
                  error={!!errors.boothNumber}
                  helperText={errors.boothNumber}
                  InputProps={{
                    startAdornment: (
                      <BoothIcon sx={{ color: '#4fc3f7', mr: 1 }} />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      '& fieldset': {
                        borderColor: errors.boothNumber ? '#f44336' : 'rgba(255, 255, 255, 0.1)',
                      },
                      '&:hover fieldset': {
                        borderColor: errors.boothNumber ? '#f44336' : '#4fc3f7',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: errors.boothNumber ? '#f44336' : '#4fc3f7',
                        boxShadow: errors.boothNumber 
                          ? '0 0 0 2px rgba(244, 67, 54, 0.2)'
                          : '0 0 0 2px rgba(79, 195, 247, 0.2)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.6)',
                    },
                    '& .MuiFormHelperText-root': {
                      color: errors.boothNumber ? '#f44336' : 'rgba(255, 255, 255, 0.5)',
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
                  placeholder="Enter booth features, size, amenities..."
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
                    <Button
                      onClick={() => setActivePage("booth-list")}
                      startIcon={<ArrowBackIcon />}
                      variant="outlined"
                      sx={{
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
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
                      View Booths
                    </Button>
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={creating || !formData.expoId || !formData.boothNumber}
                    startIcon={creating ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                    sx={{
                      background: !formData.expoId || !formData.boothNumber
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                      color: 'white',
                      px: 4,
                      py: 1,
                      borderRadius: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                      minWidth: 160,
                      '&:hover': {
                        background: !formData.expoId || !formData.boothNumber
                          ? 'rgba(255, 255, 255, 0.1)'
                          : 'linear-gradient(135deg, #43a047 0%, #1b5e20 100%)',
                        transform: (formData.expoId && formData.boothNumber) ? 'translateY(-2px)' : 'none',
                        boxShadow: (formData.expoId && formData.boothNumber) ? '0 6px 20px rgba(76, 175, 80, 0.4)' : 'none',
                      },
                      transition: 'all 0.3s ease-in-out',
                    }}
                  >
                    {creating ? 'Creating...' : 'Create Booth'}
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
                  Booth Number Format
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  Use clear numbering like A-101, B-205, or Floor-Section-Number
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: "rgba(255, 255, 255, 0.5)", mb: 0.5 }}>
                  Description Best Practices
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  Include size, amenities, power outlets, internet access, etc.
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ color: "rgba(255, 255, 255, 0.5)", mb: 0.5 }}>
                  Required Fields
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  • Expo selection<br />
                  • Booth number
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