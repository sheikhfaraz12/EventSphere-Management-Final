import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  TextField,
  Typography,
  MenuItem,
  Button,
  Paper,
  Avatar,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

const steps = ['Personal Info', 'Security', 'Role'];

export default function Signup({ setCurrentPage }) {
  const { register } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'attendee'
  });

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      alert('Signup success! Login now.');
      setCurrentPage('login');
    } catch {
      alert('Signup failed');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e3c72, #2a5298)'
      }}
    >
      <Paper sx={{ p: 4, width: '100%', maxWidth: 480, borderRadius: 3 }}>
        {/* Header */}
        <Box textAlign="center" mb={3}>
          <Avatar sx={{ mx: 'auto', mb: 1, bgcolor: 'primary.main' }}>
            <PersonAddAltIcon />
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            Create Account
          </Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* FORM */}
        <Box component="form" onSubmit={handleSubmit}>
          {activeStep === 0 && (
            <>
              <TextField
                label="Full Name"
                fullWidth
                required
                margin="normal"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                required
                margin="normal"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </>
          )}

          {activeStep === 1 && (
            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              margin="normal"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          )}

          {activeStep === 2 && (
            <TextField
              select
              label="Select Role"
              fullWidth
              margin="normal"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <MenuItem value="attendee">Attendee</MenuItem>
              <MenuItem value="exhibitor">Exhibitor</MenuItem>
            </TextField>
          )}

          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                sx={{
                  px: 4,
                  background: 'linear-gradient(90deg, #1e3c72, #2a5298)'
                }}
              >
                Finish Signup
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>

          <Typography variant="body2" textAlign="center" mt={3}>
            Already have an account?{' '}
            <Typography
              component="span"
              color="primary"
              sx={{ cursor: 'pointer', fontWeight: 600 }}
              onClick={() => setCurrentPage('login')}
            >
              Login
            </Typography>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
