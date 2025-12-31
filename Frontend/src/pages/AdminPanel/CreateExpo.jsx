import React, { useState } from "react";
import { createExpo } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/Button";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Grid,
  InputAdornment,
  Alert,
  Fade,
  Card,
  CardContent,
  Divider,
  Avatar,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Tooltip
} from "@mui/material";
import {
  Event as EventIcon,
  Description as DescriptionIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Create as CreateIcon,
  CheckCircle as CheckCircleIcon,
  AutoAwesome as AutoAwesomeIcon,
  Refresh as RefreshIcon,
  ArrowForward as ArrowForwardIcon
} from "@mui/icons-material";

const steps = ['Basic Details', 'Dates & Location', 'Review & Create'];

export default function CreateExpo() {
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
  });

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (activeStep < steps.length - 1) {
      handleNext();
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await createExpo(formData, token);
      setSuccess(true);
      
      setTimeout(() => {
        setSuccess(false);
        setActiveStep(0);
        setFormData({
          title: "",
          description: "",
          location: "",
          startDate: "",
          endDate: "",
        });
      }, 2000);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create expo. Please try again.");
    } finally {
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

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      startDate: "",
      endDate: "",
    });
    setActiveStep(0);
    setError("");
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              name="title"
              label="Expo Title *"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a captivating title for your expo"
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
                    borderWidth: '2px',
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
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 500,
                },
              }}
            />

            <TextField
              fullWidth
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your expo in detail..."
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
                    borderWidth: '2px',
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
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 500,
                },
              }}
            />
          </Box>
        );
      
      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              name="location"
              label="Location *"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter venue address or virtual meeting link"
              required
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
                    borderWidth: '2px',
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
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 500,
                },
              }}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="startDate"
                  label="Start Date *"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
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
                        borderWidth: '2px',
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
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: 500,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="endDate"
                  label="End Date *"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
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
                        borderWidth: '2px',
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
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: 500,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );
      
      case 2:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.5) 0%, rgba(42, 82, 152, 0.5) 100%)',
                border: '1px solid rgba(79, 195, 247, 0.2)',
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#4fc3f7', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon /> Review Your Expo Details
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <EventIcon sx={{ color: '#4fc3f7' }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          Expo Title
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
                          {formData.title || "Not specified"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                      <DescriptionIcon sx={{ color: '#4fc3f7', mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          Description
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          {formData.description || "No description provided"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <LocationIcon sx={{ color: '#4fc3f7' }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          Location
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white' }}>
                          {formData.location || "Not specified"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <CalendarIcon sx={{ color: '#4fc3f7' }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          Date Range
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white' }}>
                          {formData.startDate && formData.endDate 
                            ? `${formData.startDate} to ${formData.endDate}`
                            : "Not specified"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        );
      
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', px: 2, pt: 1 }}>
      {/* Header - Reduced spacing */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 50,
              height: 50,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 26 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ 
              background: 'linear-gradient(45deg, #4fc3f7 30%, #29b6f6 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Create New Expo
            </Typography>
          </Box>
        </Box>
        
        <Tooltip title="Reset Form">
          <IconButton 
            onClick={resetForm}
            sx={{ 
              color: '#4fc3f7',
              '&:hover': {
                backgroundColor: 'rgba(79, 195, 247, 0.1)',
              }
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Alerts - Reduced spacing */}
      <Fade in={!!success}>
        <Alert 
          severity="success" 
          icon={<CheckCircleIcon />}
          sx={{ 
            mb: 2,
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.2) 0%, rgba(56, 142, 60, 0.2) 100%)',
            color: 'white',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            '& .MuiAlert-icon': {
              color: '#4caf50',
            }
          }}
        >
          <Typography variant="body1" fontWeight="medium">
            🎉 Expo created successfully! Redirecting...
          </Typography>
        </Alert>
      </Fade>

      <Fade in={!!error}>
        <Alert 
          severity="error"
          sx={{ 
            mb: 2,
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(211, 47, 47, 0.2) 0%, rgba(244, 67, 54, 0.2) 100%)',
            color: 'white',
            border: '1px solid rgba(244, 67, 54, 0.3)',
          }}
        >
          {error}
        </Alert>
      </Fade>

      {/* Stepper - Reduced spacing */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 3,
          background: 'rgba(20, 25, 40, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(79, 195, 247, 0.1)',
        }}
      >
        <Stepper activeStep={activeStep} sx={{ 
          '& .MuiStepLabel-root .Mui-completed': {
            color: '#4fc3f7',
          },
          '& .MuiStepLabel-root .Mui-active': {
            color: '#4fc3f7',
            fontWeight: 'bold',
          },
          '& .MuiStepLabel-label': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
        }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Main Form Card - Directly below header with reduced spacing */}
      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(79, 195, 247, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(79, 195, 247, 0.1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
          }
        }}
      >
        <form onSubmit={handleSubmit}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {getStepContent(activeStep)}
            
            {/* Navigation Buttons - Updated to pill style */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0 || loading}
                variant="outlined"
                sx={{
                  px: 4,
                  py: 1,
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: 50,
                  minWidth: 100,
                  '&:hover': {
                    borderColor: '#4fc3f7',
                    backgroundColor: 'rgba(79, 195, 247, 0.1)',
                    transform: 'translateY(-1px)',
                  },
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                Back
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  px: 5,
                  py: 1,
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  background: activeStep === steps.length - 1 
                    ? 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 50,
                  minWidth: 140,
                  '&:hover': {
                    background: activeStep === steps.length - 1
                      ? 'linear-gradient(135deg, #43a047 0%, #1b5e20 100%)'
                      : 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                  },
                  transition: 'all 0.3s ease-in-out',
                  textTransform: 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                    transform: 'translateX(-100%)',
                    transition: 'transform 0.6s',
                  },
                  '&:hover::after': {
                    transform: 'translateX(100%)',
                  }
                }}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : activeStep === steps.length - 1 ? (
                  'Create Expo'
                ) : (
                  'Continue'
                )}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>

      {/* Quick Tips - Reduced spacing */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mt: 2,
          borderRadius: 3,
          background: 'rgba(30, 41, 59, 0.5)',
          border: '1px solid rgba(79, 195, 247, 0.1)',
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#4fc3f7', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesomeIcon fontSize="small" /> Pro Tips
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EventIcon sx={{ color: '#4fc3f7', fontSize: 18 }} />
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                Clear, memorable title
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarIcon sx={{ color: '#4fc3f7', fontSize: 18 }} />
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                Realistic date ranges
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationIcon sx={{ color: '#4fc3f7', fontSize: 18 }} />
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                Exact location details
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}