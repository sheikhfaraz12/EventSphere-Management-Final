import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ExhibitorDashboard from './ExhibitorDashboard';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Fade,
  Container,
  Avatar,
  Grid,
  alpha
} from '@mui/material';
import {
  Lock as LockIcon,
  Block as BlockIcon,
  EventAvailable as EventIcon,
  Login as LoginIcon,
  ArrowForward as ArrowForwardIcon,
  Stars as StarsIcon,
  RocketLaunch as RocketLaunchIcon
} from '@mui/icons-material';

export default function BookingsPage({ setCurrentPage }) {
  const { user, logout } = useAuth();

  const handleLoginRedirect = () => {
    setCurrentPage('login');
  };

  const handleExploreEvents = () => {
    setCurrentPage('events');
  };

  if (!user) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, md: 4 },
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: 300,
            height: 300,
            background: 'radial-gradient(circle, rgba(79, 195, 247, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            animation: 'float 20s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '30%',
            right: '15%',
            width: 200,
            height: 200,
            background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(30px)',
            animation: 'float2 15s ease-in-out infinite',
          }}
        />

        <Container maxWidth="md">
          <Fade in timeout={800}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 6 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                borderRadius: 4,
                background: 'rgba(15, 23, 42, 0.7)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #4fc3f7, #667eea)',
                }
              }}
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mb: 3,
                  background: 'linear-gradient(135deg, rgba(79, 195, 247, 0.2), rgba(102, 126, 234, 0.2))',
                  border: '2px solid rgba(79, 195, 247, 0.3)',
                }}
              >
                <LockIcon sx={{ fontSize: 50, color: '#4fc3f7' }} />
              </Avatar>

              <Typography
                variant="h3"
                sx={{
                  color: 'white',
                  fontWeight: 800,
                  mb: 2,
                  background: 'linear-gradient(45deg, #4fc3f7 30%, #667eea 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Access Required
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  mb: 4,
                  fontWeight: 400,
                  maxWidth: 600,
                  lineHeight: 1.6,
                }}
              >
                Please login to access the booking dashboard and manage your exhibition spaces.
              </Typography>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                {[
                  {
                    icon: <EventIcon />,
                    title: 'Manage Bookings',
                    description: 'View and manage all your exhibition bookings'
                  },
                  {
                    icon: <StarsIcon />,
                    title: 'Track Analytics',
                    description: 'Monitor your exhibition performance'
                  },
                  {
                    icon: <RocketLaunchIcon />,
                    title: 'Grow Your Reach',
                    description: 'Expand your audience with smart booking'
                  }
                ].map((feature, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Paper
                      sx={{
                        p: 3,
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                      }}
                    >
                      <Box sx={{ color: '#4fc3f7', mb: 2 }}>{feature.icon}</Box>
                      <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        {feature.description}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%', maxWidth: 400 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleLoginRedirect}
                  startIcon={<LoginIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                    color: 'white',
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '1rem',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #43a047 0%, #1b5e20 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)',
                    },
                  }}
                >
                  Login to Continue
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleExploreEvents}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    borderColor: 'rgba(79, 195, 247, 0.5)',
                    color: '#4fc3f7',
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '1rem',
                    '&:hover': {
                      borderColor: '#4fc3f7',
                      background: 'rgba(79, 195, 247, 0.1)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(79, 195, 247, 0.2)',
                    },
                  }}
                >
                  Explore Events
                </Button>
              </Stack>
            </Paper>
          </Fade>
        </Container>
      </Box>
    );
  }

  if (user.role === 'exhibitor') {
    return <ExhibitorDashboard />;
  }

  // Non-exhibitor users
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 4 },
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(244, 67, 54, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 20s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '30%',
          right: '15%',
          width: 200,
          height: 200,
          background: 'radial-gradient(circle, rgba(255, 193, 7, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(30px)',
          animation: 'float2 15s ease-in-out infinite',
        }}
      />

      <Container maxWidth="md">
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              borderRadius: 4,
              background: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #ff9800, #f44336)',
              }
            }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mb: 3,
                background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.2), rgba(244, 67, 54, 0.2))',
                border: '2px solid rgba(255, 193, 7, 0.3)',
              }}
            >
              <BlockIcon sx={{ fontSize: 50, color: '#ff9800' }} />
            </Avatar>

            <Typography
              variant="h3"
              sx={{
                color: 'white',
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(45deg, #ff9800 30%, #f44336 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Permission Required
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: 'white',
                mb: 2,
                fontWeight: 600,
              }}
            >
              Hello, {user.name}!
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                mb: 4,
                fontWeight: 400,
                maxWidth: 600,
                lineHeight: 1.6,
              }}
            >
              As an <strong style={{ color: '#4fc3f7' }}>{user.role}</strong>, you don't have permission to host events.
              Exhibitor privileges are required to access the booking dashboard.
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center' }}>
  {[
    {
      icon: <EventIcon sx={{ color: '#4fc3f7' }} />,
      title: 'Explore Events',
      description: 'Browse and attend exhibitions as an attendee',
      action: () => setCurrentPage('events')
    },
    {
      icon: <StarsIcon sx={{ color: '#4fc3f7' }} />,
      title: 'View Profile',
      description: 'Check your profile and account settings',
      action: () => setCurrentPage('profile')
    }
  ].map((option, index) => (
    <Grid item xs={12} sm={6} md={5} key={index}>
      <Paper
        onClick={option.action}
        sx={{
          p: 3,
          height: '100%',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: '#4fc3f7',
            background: 'rgba(79, 195, 247, 0.1)',
          }
        }}
      >
        <Box sx={{ mb: 2 }}>{option.icon}</Box>
        <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
          {option.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          {option.description}
        </Typography>
      </Paper>
    </Grid>
  ))}
  
  {/* Third card centered on its own row */}
  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
    <Paper
      onClick={() => alert('Contact admin@exposphere.com for exhibitor access')}
      sx={{
        p: 3,
        width: '100%',
        maxWidth: 400,
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: '#4fc3f7',
          background: 'rgba(79, 195, 247, 0.1)',
        }
      }}
    >
      <Box sx={{ mb: 2, textAlign: 'center' }}>
        <RocketLaunchIcon sx={{ color: '#4fc3f7', fontSize: 40 }} />
      </Box>
      <Typography variant="h5" sx={{ color: 'white', mb: 1, textAlign: 'center' }}>
        Contact Admin
      </Typography>
      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center' }}>
        Request exhibitor privileges
      </Typography>
    </Paper>
  </Grid>
</Grid>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%', maxWidth: 400 }}>
              {/* <Button
                fullWidth
                variant="contained"
                onClick={() => setCurrentPage('events')}
                startIcon={<ArrowForwardIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: '1rem',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                  },
                }}
              >
                Browse Events
              </Button> */}
              {/* <Button
                fullWidth
                variant="outlined"
                onClick={logout}
                sx={{
                  borderColor: 'rgba(255, 193, 7, 0.5)',
                  color: '#ffb300',
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: '1rem',
                  '&:hover': {
                    borderColor: '#ffb300',
                    background: 'rgba(255, 193, 7, 0.1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(255, 193, 7, 0.2)',
                  },
                }}
              >
                Switch Account
              </Button> */}
            </Stack>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}