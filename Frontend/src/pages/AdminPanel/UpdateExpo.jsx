import React, { useEffect, useState } from "react";
import { getSingleExpo, updateExpo } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Grid,
  InputAdornment,
  Alert,
  Fade,
  CircularProgress,
  Divider,
  Snackbar
} from "@mui/material";
import {
  Event as EventIcon,
  Description as DescriptionIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon
} from "@mui/icons-material";

export default function UpdateExpo({ expoId, onDone }) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: ""
  });

  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    if (expoId) {
      fetchExpo();
    }
  }, [expoId]);

  const fetchExpo = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getSingleExpo(expoId, token);
      const expo = res.data;

      const formattedData = {
        title: expo.title || "",
        description: expo.description || "",
        location: expo.location || "",
        startDate: expo.startDate ? expo.startDate.split("T")[0] : "",
        endDate: expo.endDate ? expo.endDate.split("T")[0] : "",
      };

      setFormData(formattedData);
      setOriginalData(formattedData);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch expo:", err);
      setError("Failed to load expo details. Please try again.");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        setError("End date cannot be earlier than start date");
        return;
      }
    }

    setUpdating(true);
    setError("");

    try {
      // Prepare data for API
      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
      };

      console.log("Updating expo with data:", updateData);
      
      await updateExpo(expoId, updateData, token);
      
      setSuccess(true);
      setSnackbar({
        open: true,
        message: "Expo updated successfully!",
        severity: "success"
      });

      // Wait a moment then close
      setTimeout(() => {
        onDone();
      }, 1500);

    } catch (err) {
      console.error("Update failed:", err);
      
      let errorMessage = "Update failed. ";
      if (err.response?.data?.message) {
        errorMessage += err.response.data.message;
      } else if (err.message) {
        errorMessage += err.message;
      }
      
      setError(errorMessage);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error"
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setFormData(originalData);
    }
    onDone();
  };

  const hasChanges = () => {
    if (!originalData) return false;
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !formData.title) {
    return (
      <Alert 
        severity="error" 
        sx={{ maxWidth: 600, mx: "auto", mt: 3 }}
        action={
          <Button color="inherit" size="small" onClick={fetchExpo}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Box sx={{ 
            width: 40, 
            height: 40, 
            background: "linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%)",
            borderRadius: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <EventIcon sx={{ fontSize: 22, color: "white" }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ color: "white", mb: 0.5 }}>
              Update Expo
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
              Edit the details of your exhibition
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Success Alert */}
      <Fade in={success}>
        <Alert 
          severity="success" 
          icon={<CheckCircleIcon />}
          sx={{ 
            mb: 2,
            borderRadius: 2,
            background: "linear-gradient(135deg, rgba(46, 125, 50, 0.2) 0%, rgba(56, 142, 60, 0.2) 100%)",
            color: "white",
            border: "1px solid rgba(76, 175, 80, 0.3)",
            '& .MuiAlert-icon': {
              color: '#4caf50',
            }
          }}
        >
          <Typography variant="body1" fontWeight="medium">
            ✓ Expo updated successfully! Redirecting...
          </Typography>
        </Alert>
      </Fade>

      {/* Error Alert */}
      <Fade in={!!error && !success}>
        <Alert 
          severity="error"
          sx={{ 
            mb: 2,
            borderRadius: 2,
            background: "linear-gradient(135deg, rgba(211, 47, 47, 0.2) 0%, rgba(244, 67, 54, 0.2) 100%)",
            color: "white",
            border: "1px solid rgba(244, 67, 54, 0.3)",
          }}
        >
          {error}
        </Alert>
      </Fade>

      {/* Main Form */}
      <Paper
        elevation={4}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          background: "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(79, 195, 247, 0.15)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {/* Title */}
            <TextField
              fullWidth
              name="title"
              label="Expo Title *"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter expo title"
              required
              variant="outlined"
              size="medium"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EventIcon sx={{ color: '#4fc3f7' }} />
                  </InputAdornment>
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
                  fontWeight: 500,
                },
              }}
            />

            {/* Description */}
            <TextField
              fullWidth
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your expo..."
              multiline
              rows={4}
              variant="outlined"
              size="medium"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                    <DescriptionIcon sx={{ color: '#4fc3f7' }} />
                  </InputAdornment>
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
                  fontWeight: 500,
                },
              }}
            />

            {/* Location */}
            <TextField
              fullWidth
              name="location"
              label="Location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter venue or virtual location"
              variant="outlined"
              size="medium"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon sx={{ color: '#4fc3f7' }} />
                  </InputAdornment>
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
                  fontWeight: 500,
                },
              }}
            />

            {/* Dates */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="startDate"
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  variant="outlined"
                  size="medium"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarIcon sx={{ color: '#4fc3f7' }} />
                      </InputAdornment>
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
                      fontWeight: 500,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="endDate"
                  label="End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  variant="outlined"
                  size="medium"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarIcon sx={{ color: '#4fc3f7' }} />
                      </InputAdornment>
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
                      fontWeight: 500,
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 1 }} />

            {/* Action Buttons */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Button
                onClick={handleCancel}
                startIcon={<ArrowBackIcon />}
                disabled={updating || success}
                variant="outlined"
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'rgba(255, 255, 255, 0.7)',
                  px: 4,
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
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={updating || success || !hasChanges()}
                startIcon={updating ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                sx={{
                  background: !hasChanges() 
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
                    background: !hasChanges()
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                    transform: hasChanges() ? 'translateY(-2px)' : 'none',
                    boxShadow: hasChanges() ? '0 6px 20px rgba(102, 126, 234, 0.4)' : 'none',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                {updating ? 'Updating...' : 'Update Expo'}
              </Button>
            </Box>

            {/* Hint Text */}
            {!hasChanges() && !success && (
              <Typography variant="caption" sx={{ 
                color: 'rgba(255, 255, 255, 0.4)', 
                textAlign: 'center', 
                display: 'block',
                mt: 1
              }}>
                Make changes to enable the update button
              </Typography>
            )}
          </Box>
        </form>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
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