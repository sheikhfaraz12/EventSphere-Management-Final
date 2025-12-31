import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Avatar,
  Card,
  CardContent,
  CardActions,
  Stack,
  Alert,
  Snackbar,
  Fade,
  Container,
  alpha,
  IconButton,
  Collapse,
  Tooltip
} from "@mui/material";
import {
  Event as EventIcon,
  HowToReg as HowToRegIcon,
  Schedule as ScheduleIcon,
  Visibility as VisibilityIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  ChevronRight as ChevronRightIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  Group as GroupIcon,
  Star as StarIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Info as InfoIcon
} from "@mui/icons-material";

import {
  getAllExpos,
  registerExpo,
  getUserRegistrations,
  getSessionsByExpo
} from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

export default function AttendeeDashboard({ setCurrentPage }) {
  const { user, token } = useAuth();

  const [expos, setExpos] = useState([]);
  const [registeredExpos, setRegisteredExpos] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [sessions, setSessions] = useState({});
  const [expandedExpo, setExpandedExpo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [loadingSessions, setLoadingSessions] = useState({});

  useEffect(() => {
    if (user && token) {
      fetchExpos();
      fetchUserRegistrations();
    }
  }, [user, token]);

  const fetchExpos = async () => {
    try {
      const res = await getAllExpos(token);
      setExpos(res.data || []);
    } catch (err) {
      console.error("Failed to fetch expos:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRegistrations = async () => {
    try {
      const res = await getUserRegistrations(token);
      const registeredIds = res.data.map(r => r.expoId?._id || r.expoId);
      setRegisteredExpos(registeredIds);
      setRegistrations(res.data || []);
    } catch (err) {
      console.error("Failed to fetch registrations:", err);
    }
  };

  const handleRegister = async (expoId) => {
    setRegistering(prev => ({ ...prev, [expoId]: true }));
    try {
      await registerExpo({ expoId }, token);
      
      // Update state
      await fetchUserRegistrations();
      
      setSnackbar({
        open: true,
        message: "Successfully registered for this expo!",
        severity: "success"
      });
    } catch (err) {
      console.error("Registration failed:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Registration failed",
        severity: "error"
      });
    } finally {
      setRegistering(prev => ({ ...prev, [expoId]: false }));
    }
  };

  const handleViewSessions = async (expoId) => {
    if (sessions[expoId]) {
      setExpandedExpo(expandedExpo === expoId ? null : expoId);
      return;
    }

    setLoadingSessions(prev => ({ ...prev, [expoId]: true }));
    try {
      const res = await getSessionsByExpo(expoId, token);
      const sorted = (res.data || []).sort(
        (a, b) => new Date(a.startTime || a.date) - new Date(b.startTime || b.date)
      );
      setSessions(prev => ({ ...prev, [expoId]: sorted }));
      setExpandedExpo(expoId);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
      setSnackbar({
        open: true,
        message: "Failed to load sessions",
        severity: "error"
      });
    } finally {
      setLoadingSessions(prev => ({ ...prev, [expoId]: false }));
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return "Invalid Date";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "Invalid Date";
    }
  };

  const isExpoRegistered = (expoId) => registeredExpos.includes(expoId);

  const getRegistrationDate = (expoId) => {
    const registration = registrations.find(r => 
      (r.expoId?._id || r.expoId) === expoId
    );
    return registration ? formatDate(registration.createdAt) : null;
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#4fc3f7" }} />
      </Box>
    );
  }

  const upcomingExpos = expos.filter(e => isExpoRegistered(e._id));
  const availableExpos = expos.filter(e => !isExpoRegistered(e._id));

  const ExpoCard = ({ expo, registered = false }) => {
    const isRegistered = isExpoRegistered(expo._id);
    const isExpanded = expandedExpo === expo._id;
    const expoSessions = sessions[expo._id] || [];
    const isLoadingSessions = loadingSessions[expo._id];

    return (
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "rgba(15, 23, 42, 0.8)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 3,
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden",
          "&:hover": {
            borderColor: isRegistered ? "#4caf50" : "#4fc3f7",
            transform: "translateY(-4px)",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)",
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: isRegistered 
              ? "linear-gradient(90deg, #4caf50, #2e7d32)" 
              : "linear-gradient(90deg, #4fc3f7, #667eea)",
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  background: isRegistered 
                    ? "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                <EventIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ color: "white", fontWeight: 700, lineHeight: 1.2 }}>
                  {expo.title}
                </Typography>
                {isRegistered && (
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Registered"
                    size="small"
                    sx={{
                      backgroundColor: "rgba(76, 175, 80, 0.15)",
                      color: "#4caf50",
                      border: "1px solid rgba(76, 175, 80, 0.3)",
                      fontWeight: 600,
                      mt: 0.5
                    }}
                  />
                )}
              </Box>
            </Box>
            
            <Tooltip title={expo.description || "No description"}>
              <IconButton size="small" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Description */}
          {expo.description && (
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                mb: 3,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {expo.description}
            </Typography>
          )}

          {/* Details */}
          <Stack spacing={1.5} sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationIcon sx={{ color: "#4fc3f7", fontSize: 18 }} />
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                {expo.location || "Location not specified"}
              </Typography>
            </Box>
            
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarIcon sx={{ color: "#4fc3f7", fontSize: 18 }} />
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                {formatDate(expo.startDate)} → {formatDate(expo.endDate)}
              </Typography>
            </Box>

            {isRegistered && getRegistrationDate(expo._id) && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <HowToRegIcon sx={{ color: "#4caf50", fontSize: 18 }} />
                <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                  Registered on {getRegistrationDate(expo._id)}
                </Typography>
              </Box>
            )}
          </Stack>

          {/* Sessions Preview */}
          {expoSessions.length > 0 && !isExpanded && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)", display: "block", mb: 0.5 }}>
                Upcoming Sessions
              </Typography>
              {expoSessions.slice(0, 2).map((session, index) => (
                <Box
                  key={session._id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 0.5,
                    color: "rgba(255, 255, 255, 0.7)"
                  }}
                >
                  <ScheduleIcon sx={{ fontSize: 14 }} />
                  <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
                    {session.title}
                  </Typography>
                </Box>
              ))}
              {expoSessions.length > 2 && (
                <Typography variant="caption" sx={{ color: "#4fc3f7" }}>
                  +{expoSessions.length - 2} more sessions
                </Typography>
              )}
            </Box>
          )}
        </CardContent>

        <CardActions sx={{ p: 3, pt: 0 }}>
          <Box sx={{ width: "100%" }}>
            {!isRegistered ? (
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleRegister(expo._id)}
                disabled={registering[expo._id]}
                startIcon={registering[expo._id] ? <CircularProgress size={20} color="inherit" /> : <HowToRegIcon />}
                sx={{
                  background: "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
                  color: "white",
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 600,
                  mb: 2,
                  "&:hover": {
                    background: "linear-gradient(135deg, #43a047 0%, #1b5e20 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(76, 175, 80, 0.3)",
                  },
                }}
              >
                {registering[expo._id] ? "Registering..." : "Register Now"}
              </Button>
            ) : (
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleViewSessions(expo._id)}
                disabled={isLoadingSessions}
                startIcon={<VisibilityIcon />}
                endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                sx={{
                  borderColor: "rgba(79, 195, 247, 0.3)",
                  color: "#4fc3f7",
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 600,
                  mb: 2,
                  "&:hover": {
                    borderColor: "#4fc3f7",
                    background: "rgba(79, 195, 247, 0.1)",
                  },
                }}
              >
                {isLoadingSessions ? "Loading..." : "View Sessions"}
              </Button>
            )}

            {/* Sessions Details */}
            <Collapse in={isExpanded}>
              <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 2 }} />
              
              {isLoadingSessions ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                  <CircularProgress size={30} sx={{ color: "#4fc3f7" }} />
                </Box>
              ) : expoSessions.length > 0 ? (
                <Box>
                  <Typography variant="subtitle2" sx={{ color: "#4fc3f7", mb: 2, fontWeight: 600 }}>
                    Schedule
                  </Typography>
                  <Stack spacing={1.5}>
                    {expoSessions.map((session) => (
                      <Paper
                        key={session._id}
                        sx={{
                          p: 1.5,
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: 1.5,
                        }}
                      >
                        <Typography variant="body2" sx={{ color: "white", fontWeight: 500, mb: 0.5 }}>
                          {session.title}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <ScheduleIcon sx={{ fontSize: 14, color: "#4fc3f7" }} />
                          <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                            {formatDateTime(session.startTime || session.date)}
                          </Typography>
                        </Box>
                        {session.description && (
                          <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)", display: "block", mt: 0.5 }}>
                            {session.description}
                          </Typography>
                        )}
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              ) : (
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <ScheduleIcon sx={{ fontSize: 40, color: "rgba(255, 255, 255, 0.2)", mb: 1 }} />
                  <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                    No sessions scheduled yet
                  </Typography>
                </Box>
              )}
            </Collapse>
          </Box>
        </CardActions>
      </Card>
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 20% 80%, rgba(79, 195, 247, 0.1) 0%, transparent 50%)",
        },
      }}
    >
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              color: "white",
              fontWeight: 900,
              mb: 1,
              background: "linear-gradient(45deg, #4fc3f7 30%, #667eea 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Attendee Dashboard
          </Typography>
          <Typography variant="h6" sx={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: 400 }}>
            Discover and register for amazing exhibitions
          </Typography>
        </Box>

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Paper
              sx={{
                p: 2,
                background: "rgba(30, 41, 59, 0.5)",
                border: "1px solid rgba(79, 195, 247, 0.2)",
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="h4" sx={{ color: "#4fc3f7", fontWeight: 700 }}>
                {expos.length}
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                Total Exhibitions
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              sx={{
                p: 2,
                background: "rgba(30, 41, 59, 0.5)",
                border: "1px solid rgba(76, 175, 80, 0.2)",
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="h4" sx={{ color: "#4caf50", fontWeight: 700 }}>
                {upcomingExpos.length}
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                Registered Events
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              sx={{
                p: 2,
                background: "rgba(30, 41, 59, 0.5)",
                border: "1px solid rgba(102, 126, 234, 0.2)",
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="h4" sx={{ color: "#667eea", fontWeight: 700 }}>
                {availableExpos.length}
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                Available to Register
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* My Upcoming Events */}
        {upcomingExpos.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
                My Upcoming Events
              </Typography>
              <Chip
                icon={<CheckCircleIcon />}
                label={`${upcomingExpos.length} Registered`}
                sx={{
                  backgroundColor: "rgba(76, 175, 80, 0.15)",
                  color: "#4caf50",
                  border: "1px solid rgba(76, 175, 80, 0.3)",
                  fontWeight: 600,
                }}
              />
            </Box>
            <Grid container spacing={3}>
              {upcomingExpos.map((expo) => (
                <Grid item xs={12} md={6} lg={4} key={expo._id}>
                  <ExpoCard expo={expo} registered />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Available Expos */}
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
              Available Exhibitions
            </Typography>
            <Chip
              icon={<EventIcon />}
              label={`${availableExpos.length} Available`}
              sx={{
                backgroundColor: "rgba(102, 126, 234, 0.15)",
                color: "#667eea",
                border: "1px solid rgba(102, 126, 234, 0.3)",
                fontWeight: 600,
              }}
            />
          </Box>

          {availableExpos.length === 0 ? (
            <Paper
              sx={{
                p: 6,
                textAlign: "center",
                background: "rgba(30, 41, 59, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 3,
              }}
            >
              <EventIcon sx={{ fontSize: 64, color: "rgba(255, 255, 255, 0.2)", mb: 2 }} />
              <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
                No Exhibitions Available
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.5)", mb: 3 }}>
                All exhibitions are currently full or registration is closed.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => fetchExpos()}
                startIcon={<RefreshIcon />}
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  "&:hover": {
                    borderColor: "#4fc3f7",
                    background: "rgba(79, 195, 247, 0.1)",
                  }
                }}
              >
                Refresh List
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {availableExpos.map((expo) => (
                <Grid item xs={12} md={6} lg={4} key={expo._id}>
                  <ExpoCard expo={expo} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>

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