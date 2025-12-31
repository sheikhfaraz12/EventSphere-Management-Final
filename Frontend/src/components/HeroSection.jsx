import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Button';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Fade,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Explore as ExploreIcon,
  Event as EventIcon,
  AutoAwesome as AutoAwesomeIcon,
  RocketLaunch as RocketLaunchIcon,
  Groups as GroupsIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

export const HeroSection = ({ setCurrentPage }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleExploreEvents = () => {
    if (!user) {
      alert('Please login first');
      return;
    }
    if (user.role !== 'attendee') {
      alert('You are not allowed to perform this action');
      return;
    }
    setCurrentPage('events');
  };

  const handleHostEvent = () => {
    if (!user) {
      alert('Please login first');
      return;
    }
    if (user.role !== 'exhibitor') {
      alert('You are not allowed to perform this action');
      return;
    }
    setCurrentPage('bookings');
  };

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 8, md: 0 },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(79, 195, 247, 0.1) 0%, transparent 50%)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 80% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 50%)',
        }
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
          background: 'radial-gradient(circle, rgba(79, 195, 247, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 20s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
            '50%': { transform: 'translate(-30px, -30px) scale(1.1)' }
          }
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '30%',
          right: '15%',
          width: 200,
          height: 200,
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(30px)',
          animation: 'float2 15s ease-in-out infinite',
          '@keyframes float2': {
            '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
            '50%': { transform: 'translate(30px, 30px) scale(1.2)' }
          }
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Fade in timeout={1000}>
              <Box>
                {/* Main Title */}
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                    fontWeight: 900,
                    mb: 2,
                    background: 'linear-gradient(45deg, #4fc3f7 30%, #667eea 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.2
                  }}
                >
                  Welcome to
                  <Box component="span" sx={{ display: 'block', color: 'white', mt: 1 }}>
                    Event Sphere
                  </Box>
                </Typography>

                {/* Subtitle */}
                <Typography
                  variant="h5"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    mb: 4,
                    fontWeight: 400,
                    fontSize: { xs: '1.1rem', md: '1.25rem' }
                  }}
                >
                  The ultimate platform for immersive exhibitions, seamless event management, and meaningful connections.
                </Typography>

                {/* Features List */}
                <Stack spacing={2} sx={{ mb: 4 }}>
                  {[
                    '🎯 Discover curated exhibitions worldwide',
                    '🚀 Streamline your exhibition management',
                    '🤝 Connect with industry professionals',
                    '📈 Showcase your products to targeted audiences'
                  ].map((feature, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        color: 'rgba(255, 255, 255, 0.9)'
                      }}
                    >
                      <CheckCircleIcon sx={{ color: '#4fc3f7', fontSize: 20 }} />
                      <Typography variant="body1">{feature}</Typography>
                    </Box>
                  ))}
                </Stack>

                {/* Action Buttons */}
                <Stack 
                  direction={isMobile ? 'column' : 'row'} 
                  spacing={2} 
                  sx={{ 
                    mb: 6,
                    '& .MuiButton-root': {
                      py: 1.5,
                      px: 4,
                      borderRadius: 2,
                      fontWeight: 600,
                      fontSize: '1rem',
                      textTransform: 'none',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                        transition: 'left 0.5s'
                      },
                      '&:hover::before': {
                        left: '100%'
                      }
                    }
                  }}
                >
                  <Button
                    onClick={handleExploreEvents}
                    disabled={!user || user.role !== 'attendee'}
                    startIcon={<ExploreIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                      color: 'white',
                      minWidth: 200,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #43a047 0%, #1b5e20 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)'
                      },
                      '&:disabled': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    Explore Events
                  </Button>
                  <Button
                    onClick={handleHostEvent}
                    disabled={!user || user.role !== 'exhibitor'}
                    startIcon={<EventIcon />}
                    variant="outlined"
                    sx={{
                      borderColor: 'rgba(79, 195, 247, 0.5)',
                      color: '#4fc3f7',
                      minWidth: 200,
                      '&:hover': {
                        borderColor: '#4fc3f7',
                        background: 'rgba(79, 195, 247, 0.1)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(79, 195, 247, 0.2)'
                      },
                      '&:disabled': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.3)'
                      }
                    }}
                  >
                    Host an Event
                  </Button>
                </Stack>

                {/* Stats */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
                    gap: 2,
                    mt: 4
                  }}
                >
                  {[
                    { value: '500+', label: 'Active Events', icon: <EventIcon /> },
                    { value: '10K+', label: 'Exhibitors', icon: <GroupsIcon /> },
                    { value: '50K+', label: 'Attendees', icon: <RocketLaunchIcon /> },
                    { value: '99%', label: 'Satisfaction', icon: <AutoAwesomeIcon /> }
                  ].map((stat, index) => (
                    <Paper
                      key={index}
                      sx={{
                        p: 2,
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                        textAlign: 'center'
                      }}
                    >
                      <Box sx={{ color: '#4fc3f7', mb: 1 }}>{stat.icon}</Box>
                      <Typography
                        variant="h4"
                        sx={{
                          color: 'white',
                          fontWeight: 700,
                          mb: 0.5
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </Box>
            </Fade>
          </Grid>

          <Grid item xs={12} md={6}>
            <Fade in timeout={1500}>
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: 400, md: 600 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* Main 3D Sphere */}
                <Box
                  sx={{
                    width: { xs: 250, md: 350 },
                    height: { xs: 250, md: 350 },
                    background: 'radial-gradient(circle at 30% 30%, #4fc3f7, #667eea, #764ba2)',
                    borderRadius: '50%',
                    position: 'relative',
                    boxShadow: `
                      0 0 60px rgba(79, 195, 247, 0.5),
                      0 0 100px rgba(102, 126, 234, 0.3),
                      0 0 140px rgba(118, 75, 162, 0.2)
                    `,
                    animation: 'rotate 20s linear infinite',
                    '@keyframes rotate': {
                      from: { transform: 'rotate(0deg)' },
                      to: { transform: 'rotate(360deg)' }
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '-10px',
                      left: '-10px',
                      right: '-10px',
                      bottom: '-10px',
                      background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                      borderRadius: '50%',
                      zIndex: -1,
                      animation: 'pulse 2s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 0.5 },
                        '50%': { opacity: 0.8 }
                      }
                    }
                  }}
                >
                  {/* Orbiting Elements */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: 'absolute',
                        width: 40,
                        height: 40,
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        top: '50%',
                        left: '50%',
                        transform: `rotate(${angle}deg) translateX(200px) rotate(-${angle}deg)`,
                        animation: `orbit ${10 + index * 2}s linear infinite`,
                        '@keyframes orbit': {
                          from: { transform: `rotate(${angle}deg) translateX(200px) rotate(-${angle}deg)` },
                          to: { transform: `rotate(${angle + 360}deg) translateX(200px) rotate(-${angle + 360}deg)` }
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          width: 20,
                          height: 20,
                          background: index % 2 === 0 ? '#4fc3f7' : '#667eea',
                          borderRadius: '50%',
                          transform: 'translate(-50%, -50%)'
                        }
                      }}
                    />
                  ))}

                  {/* Inner Glow */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '70%',
                      height: '70%',
                      background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                      borderRadius: '50%',
                      transform: 'translate(-50%, -50%)',
                      filter: 'blur(20px)'
                    }}
                  />
                </Box>

                {/* Floating Particles */}
                {Array.from({ length: 20 }).map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      position: 'absolute',
                      width: Math.random() * 8 + 2,
                      height: Math.random() * 8 + 2,
                      background: `rgba(79, 195, 247, ${Math.random() * 0.5 + 0.2})`,
                      borderRadius: '50%',
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animation: `floatParticle ${Math.random() * 10 + 5}s ease-in-out infinite`,
                      animationDelay: `${Math.random() * 5}s`,
                      '@keyframes floatParticle': {
                        '0%, 100%': {
                          transform: 'translate(0, 0) scale(1)',
                          opacity: 0.3
                        },
                        '50%': {
                          transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.5)`,
                          opacity: 0.8
                        }
                      }
                    }}
                  />
                ))}
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};