import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AttendeeDashboard from './AttendeeDashboard';
import {
  Box,
  Typography,
  Paper,
  Container,
  Button,
  Avatar,
  Stack,
  Grid,
  Fade,
  alpha
} from '@mui/material';
import {
  Lock as LockIcon,
  Info as InfoIcon,
  EventAvailable as EventIcon,
  Login as LoginIcon,
  ArrowForward as ArrowForwardIcon,
  RocketLaunch as RocketLaunchIcon,
  Groups as GroupsIcon,
  Explore as ExploreIcon
} from '@mui/icons-material';

export default function EventsPage({ setCurrentPage }) {
  const { user, logout } = useAuth();

  const handleLoginRedirect = () => {
    setCurrentPage('login');
  };

  const handleExploreDashboard = () => {
    if (user?.role === 'exhibitor') {
      setCurrentPage('bookings');
    } else if (user?.role === 'admin') {
      setCurrentPage('admin-dashboard');
    }
  };

  const handleViewAllExpos = () => {
    setCurrentPage('expos');
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
                Login to explore exhibitions, register for events, and discover amazing experiences waiting for you.
              </Typography>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                {[
                  {
                    icon: <EventIcon />,
                    title: 'Discover Events',
                    description: 'Find exhibitions matching your interests'
                  },
                  {
                    icon: <GroupsIcon />,
                    title: 'Network',
                    description: 'Connect with industry professionals'
                  },
                  {
                    icon: <RocketLaunchIcon />,
                    title: 'Grow',
                    description: 'Learn from expert sessions and workshops'
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
                  Login to Explore
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleViewAllExpos}
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
                  View Public Expos
                </Button>
              </Stack>
            </Paper>
          </Fade>
        </Container>
      </Box>
    );
  }

  if (user.role === 'attendee') {
    return <AttendeeDashboard />;
  }

  // Non-attendee users (exhibitors or admins)
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
          background: 'radial-gradient(circle, rgba(255, 193, 7, 0.1) 0%, transparent 70%)',
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
                background: 'linear-gradient(90deg, #ff9800, #667eea)',
              }
            }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mb: 3,
                background: user.role === 'exhibitor' 
                  ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))'
                  : 'linear-gradient(135deg, rgba(244, 67, 54, 0.2), rgba(255, 193, 7, 0.2))',
                border: '2px solid',
                borderColor: user.role === 'exhibitor' ? '#667eea' : '#f44336',
              }}
            >
              <InfoIcon sx={{ 
                fontSize: 50, 
                color: user.role === 'exhibitor' ? '#667eea' : '#f44336' 
              }} />
            </Avatar>

            <Typography
              variant="h3"
              sx={{
                color: 'white',
                fontWeight: 800,
                mb: 2,
                background: user.role === 'exhibitor'
                  ? 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)'
                  : 'linear-gradient(45deg, #f44336 30%, #ff9800 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Role Restriction
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
              As an <strong style={{ color: user.role === 'exhibitor' ? '#667eea' : '#f44336' }}>
                {user.role}
              </strong>, you don't have permission to browse events as an attendee.
              {user.role === 'exhibitor' 
                ? ' Use your exhibitor dashboard to manage your exhibitions.'
                : ' Use your admin dashboard to manage the platform.'
              }
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center' }}>
              {[
                {
                  icon: user.role === 'exhibitor' 
                    ? <EventIcon sx={{ color: '#667eea' }} /> 
                    : <ExploreIcon sx={{ color: '#f44336' }} />,
                  title: user.role === 'exhibitor' ? 'Manage Exhibitions' : 'Admin Dashboard',
                  description: user.role === 'exhibitor' 
                    ? 'Create and manage your exhibition spaces' 
                    : 'Manage platform settings and users',
                  action: handleExploreDashboard
                },
                {
                  icon: <RocketLaunchIcon sx={{ color: '#4fc3f7' }} />,
                  title: 'View Profile',
                  description: 'Check your profile and account settings',
                  action: () => setCurrentPage('profile')
                },
                {
                  icon: <GroupsIcon sx={{ color: '#4caf50' }} />,
                  title: 'Switch Role',
                  description: 'Logout and login with attendee account',
                  action: logout
                }
              ].map((option, index) => (
                <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Paper
                    onClick={option.action}
                    sx={{
                      p: 3,
                      width: '100%',
                      maxWidth: 300,
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        borderColor: option.icon.props.sx.color,
                        background: alpha(option.icon.props.sx.color, 0.1),
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
            </Grid>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%', maxWidth: 400 }}>
            </Stack>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}