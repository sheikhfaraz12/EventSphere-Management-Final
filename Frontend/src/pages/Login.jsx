import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Alert,
  Fade,
  Avatar,
  CircularProgress,
  Button
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Security
} from '@mui/icons-material';

export default function Login({ setCurrentPage }) {
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData);
      setCurrentPage('home');
    } catch {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 3,
          }}
        >
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Avatar
              sx={{
                mx: 'auto',
                mb: 1,
                bgcolor: 'primary.main',
                width: 56,
                height: 56,
              }}
            >
              <Security />
            </Avatar>

            <Typography variant="h5" fontWeight="bold">
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to continue
            </Typography>
          </Box>

          {/* Error */}
          <Fade in={!!error}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          </Fade>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={e =>
                  setFormData({ ...formData, email: e.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={e =>
                  setFormData({ ...formData, password: e.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
             
              </Box>

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.2,
                  fontWeight: 600,
                  background: 'linear-gradient(90deg, #1e3c72, #2a5298)',
                }}
              >
                {loading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </Box>
          </form>

          {/* Signup */}
          <Typography variant="body2" textAlign="center" mt={3}>
            Don’t have an account?{' '}
            <Typography
              component="span"
              color="primary"
              sx={{ cursor: 'pointer', fontWeight: 600 }}
              onClick={() => setCurrentPage('signup')}
            >
              Sign up
            </Typography>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
