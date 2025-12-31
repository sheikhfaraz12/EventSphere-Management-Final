import React, { useEffect, useState } from "react";
import {
  getAllExpos,
  applyExhibitor,
  getAvailableBooths,
  selectBooth,
  getExhibitorsByUser,
} from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Divider,
  Stack,
  IconButton,
  Tooltip,
  Paper,
  alpha
} from "@mui/material";
import {
  Event as EventIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  ConfirmationNumber as BoothIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from "@mui/icons-material";

export default function ExhibitorDashboard() {
  const { token, user } = useAuth();
  const [expos, setExpos] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedExpo, setSelectedExpo] = useState(null);
  const [booths, setBooths] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingBooths, setLoadingBooths] = useState(false);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedExpoForApply, setSelectedExpoForApply] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);

  // Fetch expos and user's current applications
  useEffect(() => {
    if (!token) return;
    fetchExpos();
    fetchUserApplications();
  }, [token]);

  // Auto-refresh applications every 30 seconds
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      fetchUserApplications();
    }, 30000);

    return () => clearInterval(interval);
  }, [token]);

  // Get all expos
  const fetchExpos = async () => {
    try {
      const res = await getAllExpos(token);
      setExpos(res.data || []);
    } catch (err) {
      console.error("Error fetching expos:", err);
    }
  };

  // Get current exhibitor applications
  const fetchUserApplications = async () => {
    if (!token) return;
    try {
      const res = await getExhibitorsByUser(token);
      setApplications(res.data || []);
    } catch (err) {
      console.error("Error fetching applications:", err.response?.data?.message || err.message);
      setApplications([]);
    }
  };

  // Open apply dialog
  const openApplyDialog = (expoId) => {
    setSelectedExpoForApply(expoId);
    setCompanyName("");
    setDialogOpen(true);
  };

  // Apply as exhibitor
  const handleApply = async () => {
    if (!companyName.trim()) {
      alert("Company name is required");
      return;
    }

    setApplyLoading(true);
    try {
      await applyExhibitor({ expoId: selectedExpoForApply, companyName }, token);
      setDialogOpen(false);
      
      // Show success message
      setError({ type: "success", message: "Application submitted successfully!" });
      
      // Refresh applications
      await fetchUserApplications();
    } catch (err) {
      console.error(err);
      setError({ 
        type: "error", 
        message: "Error applying: " + (err.response?.data?.message || err.message) 
      });
    } finally {
      setApplyLoading(false);
    }
  };

  // Fetch available booths for approved application
  const handleViewBooths = async (expoId) => {
    setSelectedExpo(expoId);
    setLoadingBooths(true);
    setError(null);
    setBooths([]);

    try {
      const res = await getAvailableBooths(expoId, token);
      
      if (res.data && Array.isArray(res.data)) {
        setBooths(res.data);
        if (res.data.length === 0) {
          setError({ 
            type: "info", 
            message: "No booths have been created for this expo yet. Please contact the admin." 
          });
        }
      } else {
        setBooths([]);
        setError({ type: "error", message: "Invalid response from server" });
      }
    } catch (err) {
      console.error("Error fetching booths:", err);
      
      let errorMessage = "Unable to fetch booths. ";
      if (err.response?.status === 404) {
        errorMessage = "No booths available for this expo yet. Please check back later or contact the admin.";
      } else {
        errorMessage += err.response?.data?.message || err.message || "Unknown error occurred";
      }

      setError({ type: "error", message: errorMessage });
      setBooths([]);
    } finally {
      setLoadingBooths(false);
    }
  };

  // Select a booth
  const handleSelectBooth = async (boothId) => {
    if (!window.confirm("Are you sure you want to select this booth?")) {
      return;
    }

    setLoading(true);
    try {
      await selectBooth(boothId, token);
      alert("Booth selected successfully!");
      await handleViewBooths(selectedExpo);
      await fetchUserApplications();
    } catch (err) {
      console.error("Error selecting booth:", err);
      alert("Error selecting booth: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Manual refresh
  const handleRefresh = async () => {
    setLoading(true);
    await fetchUserApplications();
    await fetchExpos();
    setLoading(false);
  };

  // Helper to get application for an expo
  const getApplication = (expoId) => {
    return applications.find(
      (a) => a.expoId?._id?.toString() === expoId.toString() ||
        a.expoId?.toString() === expoId.toString()
    );
  };

  // Get application status
  const getApplicationStatus = (expoId) => {
    const app = getApplication(expoId);
    return app ? app.status : "Not applied";
  };

  // Get expo title from application
  const getExpoTitle = (app) => {
    if (app.expoId && typeof app.expoId === 'object' && app.expoId.title) {
      return app.expoId.title;
    }
    const expo = expos.find(e => e._id === app.expoId);
    return expo ? expo.title : "Unknown Expo";
  };

  // Get selected booth info
  const getSelectedBooth = (app) => {
    if (app.boothId) {
      return `Booth #${app.boothId.boothNumber ?? app.boothId}`;
    }
    return "No booth selected";
  };

  // Get status chip props
  const getStatusChipProps = (status) => {
    switch (status) {
      case "approved":
        return { 
          icon: <CheckCircleIcon />, 
          color: "success", 
          label: "Approved" 
        };
      case "pending":
        return { 
          icon: <PendingIcon />, 
          color: "warning", 
          label: "Pending" 
        };
      case "rejected":
        return { 
          icon: <CancelIcon />, 
          color: "error", 
          label: "Rejected" 
        };
      default:
        return { 
          icon: <InfoIcon />, 
          color: "default", 
          label: "Not Applied" 
        };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
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
    <Box sx={{ maxWidth: 1400, mx: "auto", p: 3 }}>
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
              <BusinessIcon sx={{ fontSize: 26, color: "white" }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold" sx={{ color: "white", mb: 0.5 }}>
                Exhibitor Dashboard
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Manage your exhibition applications and booth selections
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Refresh">
              <IconButton
                onClick={handleRefresh}
                disabled={loading}
                sx={{
                  color: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)"
                  }
                }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Chip
            icon={<EventIcon />}
            label={`${expos.length} Expos`}
            sx={{
              backgroundColor: "rgba(79, 195, 247, 0.15)",
              color: "#4fc3f7",
              fontWeight: 600,
              border: "1px solid rgba(79, 195, 247, 0.3)"
            }}
          />
          <Chip
            icon={<BusinessIcon />}
            label={`${applications.length} Applications`}
            sx={{
              backgroundColor: "rgba(102, 126, 234, 0.15)",
              color: "#667eea",
              fontWeight: 600,
              border: "1px solid rgba(102, 126, 234, 0.3)"
            }}
          />
        </Box>
      </Paper>

      {/* Error/Success Alert */}
      {error && (
        <Alert 
          severity={error.type} 
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setError(null)}
        >
          {error.message}
        </Alert>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            background: "rgba(15, 23, 42, 0.8)",
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.6)',
              '&.Mui-selected': {
                color: '#4fc3f7',
                fontWeight: 600,
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#4fc3f7',
            }
          }}
        >
          <Tab label="All Expos" />
          <Tab label={`My Applications (${applications.length})`} />
        </Tabs>
      </Paper>

      {/* All Expos Tab */}
      {activeTab === 0 && (
        <Box>
          <Typography variant="h3" sx={{ color: "black", mb: 3 }}>
            Available Exhibitions
          </Typography>
          
          {expos.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: "center", background: "rgba(30, 41, 59, 0.5)" }}>
              <EventIcon sx={{ fontSize: 64, color: "rgba(255, 255, 255, 0.2)", mb: 2 }} />
              <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
                No Exhibitions Available
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                There are no active exhibitions at the moment.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {expos.map((expo) => {
                const status = getApplicationStatus(expo._id);
                const app = getApplication(expo._id);
                const chipProps = getStatusChipProps(status);

                return (
                  <Grid item xs={12} md={6} lg={4} key={expo._id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        background: "rgba(15, 23, 42, 0.8)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: 2,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: "#4fc3f7",
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)"
                        }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        {/* Status Badge */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                          <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
                            {expo.title}
                          </Typography>
                          <Chip
                            icon={chipProps.icon}
                            label={chipProps.label}
                            size="small"
                            color={chipProps.color}
                            sx={{
                              backgroundColor: `${chipProps.color}15`,
                              border: `1px solid ${chipProps.color}30`,
                              fontWeight: 500
                            }}
                          />
                        </Box>

                        {/* Expo Details */}
                        <Stack spacing={1.5} sx={{ mb: 3 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <LocationIcon sx={{ color: "#4fc3f7", fontSize: 18 }} />
                            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                              {expo.location || "Location not specified"}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CalendarIcon sx={{ color: "#4fc3f7", fontSize: 18 }} />
                            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                              {formatDate(expo.startDate)} → {formatDate(expo.endDate)}
                            </Typography>
                          </Box>
                        </Stack>

                        {expo.description && (
                          <Typography variant="body2" sx={{ 
                            color: "rgba(255, 255, 255, 0.6)", 
                            mb: 3,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden"
                          }}>
                            {expo.description}
                          </Typography>
                        )}

                        {/* Application Info */}
                        {app && (
                          <Box sx={{ mb: 2, p: 2, background: "rgba(255, 255, 255, 0.05)", borderRadius: 1 }}>
                            <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                              Company: {app.companyName}
                            </Typography>
                            {app.boothId && (
                              <Typography variant="caption" sx={{ 
                                color: "#4caf50", 
                                display: "block", 
                                mt: 0.5,
                                fontWeight: 500
                              }}>
                                ✓ Booth Selected: {getSelectedBooth(app)}
                              </Typography>
                            )}
                          </Box>
                        )}

                        {/* Action Buttons */}
                        <Box sx={{ mt: "auto" }}>
                          {status === "Not applied" ? (
                            <Button
                              fullWidth
                              variant="contained"
                              onClick={() => openApplyDialog(expo._id)}
                              disabled={loading}
                              startIcon={<BusinessIcon />}
                              sx={{
                                background: "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
                                color: "white",
                                py: 1,
                                borderRadius: 1,
                                "&:hover": {
                                  background: "linear-gradient(135deg, #43a047 0%, #1b5e20 100%)",
                                }
                              }}
                            >
                              Apply as Exhibitor
                            </Button>
                          ) : status === "pending" ? (
                            <Button
                              fullWidth
                              variant="outlined"
                              disabled
                              startIcon={<PendingIcon />}
                              sx={{
                                borderColor: "rgba(255, 193, 7, 0.3)",
                                color: "#ffb300",
                                py: 1,
                                borderRadius: 1,
                              }}
                            >
                              Pending Approval
                            </Button>
                          ) : status === "approved" ? (
                            <Button
                              fullWidth
                              variant="contained"
                              onClick={() => handleViewBooths(expo._id)}
                              disabled={loading || !!app?.boothId}
                              startIcon={app?.boothId ? <CheckCircleIcon /> : <BoothIcon />}
                              sx={{
                                background: app?.boothId 
                                  ? "rgba(76, 175, 80, 0.2)"
                                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                color: app?.boothId ? "#4caf50" : "white",
                                py: 1,
                                borderRadius: 1,
                                "&:hover": {
                                  background: app?.boothId 
                                    ? "rgba(76, 175, 80, 0.3)"
                                    : "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                                }
                              }}
                            >
                              {app?.boothId ? "Booth Selected ✓" : "View Available Booths"}
                            </Button>
                          ) : status === "rejected" ? (
                            <Button
                              fullWidth
                              variant="outlined"
                              disabled
                              startIcon={<CancelIcon />}
                              sx={{
                                borderColor: "rgba(244, 67, 54, 0.3)",
                                color: "#f44336",
                                py: 1,
                                borderRadius: 1,
                              }}
                            >
                              Application Rejected
                            </Button>
                          ) : null}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      )}

      {/* My Applications Tab */}
      {activeTab === 1 && (
        <Box>
          <Typography variant="h3" sx={{ color: "black", mb: 3 }}>
            My Applications
          </Typography>
          
          {applications.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: "center", background: "rgba(30, 41, 59, 0.5)" }}>
              <BusinessIcon sx={{ fontSize: 64, color: "rgba(255, 255, 255, 0.2)", mb: 2 }} />
              <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
                No Applications Found
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.5)", mb: 3 }}>
                You haven't applied to any exhibitions yet.
              </Typography>
              <Button
                variant="contained"
                onClick={() => setActiveTab(0)}
                startIcon={<EventIcon />}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                  }
                }}
              >
                Browse Exhibitions
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {applications.map((app) => {
                const chipProps = getStatusChipProps(app.status);
                const expo = expos.find(e => e._id === app.expoId?._id || e._id === app.expoId);
                
                return (
                  <Grid item xs={12} md={6} key={app._id}>
                    <Card
                      sx={{
                        height: "100%",
                        background: "rgba(15, 23, 42, 0.8)",
                        border: `1px solid ${chipProps.color}30`,
                        borderRadius: 2,
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
                          <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
                            {getExpoTitle(app)}
                          </Typography>
                          <Chip
                            icon={chipProps.icon}
                            label={chipProps.label}
                            color={chipProps.color}
                            sx={{
                              backgroundColor: `${chipProps.color}15`,
                              border: `1px solid ${chipProps.color}30`,
                              fontWeight: 600
                            }}
                          />
                        </Box>

                        <Stack spacing={2}>
                          <Box>
                            <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                              Company Name
                            </Typography>
                            <Typography variant="body1" sx={{ color: "white", fontWeight: 500 }}>
                              {app.companyName}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                              Booth Status
                            </Typography>
                            <Typography variant="body1" sx={{ 
                              color: app.boothId ? "#4caf50" : "rgba(255, 255, 255, 0.8)",
                              fontWeight: app.boothId ? 600 : 400
                            }}>
                              {getSelectedBooth(app)}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                              Applied Date
                            </Typography>
                            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                              {formatDate(app.createdAt)}
                            </Typography>
                          </Box>

                          {expo && (
                            <Box sx={{ display: "flex", gap: 2 }}>
                              <Typography variant="caption" sx={{ 
                                color: "rgba(255, 255, 255, 0.5)",
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5
                              }}>
                                <LocationIcon fontSize="inherit" />
                                {expo.location}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                                {formatDate(expo.startDate)}
                              </Typography>
                            </Box>
                          )}
                        </Stack>

                        {/* Action Button for Approved Applications without Booth */}
                        {app.status === "approved" && !app.boothId && (
                          <Box sx={{ mt: 3 }}>
                            <Button
                              fullWidth
                              variant="contained"
                              onClick={() => {
                                const expoId = app.expoId?._id ?? app.expoId;
                                handleViewBooths(expoId);
                                setActiveTab(0);
                              }}
                              startIcon={<BoothIcon />}
                              sx={{
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                color: "white",
                                py: 1,
                                borderRadius: 1,
                                "&:hover": {
                                  background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                                }
                              }}
                            >
                              Select Booth Now
                            </Button>
                            <Typography variant="caption" sx={{ 
                              color: "rgba(255, 255, 255, 0.5)", 
                              display: "block", 
                              textAlign: "center", 
                              mt: 1 
                            }}>
                              Note: If no booths appear, the admin hasn't created booths yet.
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      )}

      {/* Booths Modal */}
      {selectedExpo && activeTab === 0 && (
        <Paper
          elevation={4}
          sx={{
            mt: 4,
            p: 3,
            borderRadius: 2,
            background: "rgba(15, 23, 42, 0.9)",
            border: "1px solid rgba(79, 195, 247, 0.2)",
            position: "relative"
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" sx={{ color: "white", display: "flex", alignItems: "center", gap: 1 }}>
              <BoothIcon /> Available Booths
            </Typography>
            <IconButton
              onClick={() => setSelectedExpo(null)}
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Box>

          <Typography variant="body1" sx={{ color: "#4fc3f7", mb: 3 }}>
            {expos.find((e) => e._id === selectedExpo)?.title}
          </Typography>

          {loadingBooths ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 6 }}>
              <CircularProgress />
            </Box>
          ) : booths.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: "center", background: "rgba(30, 41, 59, 0.5)" }}>
              <WarningIcon sx={{ fontSize: 48, color: "rgba(255, 193, 7, 0.5)", mb: 2 }} />
              <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
                No Booths Available
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                The admin hasn't created any booths for this exhibition yet.
                Please check back later or contact the exhibition administrator.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={2}>
              {booths.map((booth) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={booth._id}>
                  <Card
                    sx={{
                      height: "100%",
                      background: booth.selectedBy 
                        ? "rgba(244, 67, 54, 0.1)" 
                        : "rgba(76, 175, 80, 0.1)",
                      border: booth.selectedBy 
                        ? "1px solid rgba(244, 67, 54, 0.3)" 
                        : "1px solid rgba(76, 175, 80, 0.3)",
                      borderRadius: 2,
                      position: "relative",
                      overflow: "hidden"
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ textAlign: "center" }}>
                        <BoothIcon sx={{ 
                          fontSize: 32, 
                          color: booth.selectedBy ? "#f44336" : "#4caf50",
                          mb: 1 
                        }} />
                        <Typography variant="h5" sx={{ 
                          color: booth.selectedBy ? "#f44336" : "#4caf50",
                          fontWeight: 700,
                          mb: 1
                        }}>
                          {booth.number || booth.boothNumber}
                        </Typography>
                        
                        {booth.description && (
                          <Typography variant="body2" sx={{ 
                            color: "rgba(255, 255, 255, 0.7)",
                            mb: 2,
                            fontSize: "0.875rem"
                          }}>
                            {booth.description}
                          </Typography>
                        )}

                        {booth.selectedBy ? (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="caption" sx={{ 
                              color: "#f44336", 
                              display: "block",
                              fontWeight: 500
                            }}>
                              Already Selected
                            </Typography>
                            <Typography variant="caption" sx={{ 
                              color: "rgba(255, 255, 255, 0.5)",
                              fontSize: "0.75rem"
                            }}>
                              by {booth.selectedBy.email}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="caption" sx={{ 
                            color: "#4caf50", 
                            display: "block",
                            fontWeight: 500
                          }}>
                            Available
                          </Typography>
                        )}
                      </Box>

                      <Button
                        fullWidth
                        variant="contained"
                        disabled={!!booth.selectedBy || loading}
                        onClick={() => handleSelectBooth(booth._id)}
                        sx={{
                          mt: 2,
                          background: booth.selectedBy 
                            ? "rgba(255, 255, 255, 0.1)" 
                            : "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
                          color: booth.selectedBy ? "rgba(255, 255, 255, 0.3)" : "white",
                          py: 1,
                          borderRadius: 1,
                          "&:hover": {
                            background: booth.selectedBy 
                              ? "rgba(255, 255, 255, 0.1)" 
                              : "linear-gradient(135deg, #43a047 0%, #1b5e20 100%)",
                          }
                        }}
                      >
                        {booth.selectedBy ? "Unavailable" : loading ? "Selecting..." : "Select Booth"}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      )}

      {/* Apply Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        PaperProps={{
          sx: {
            background: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(79, 195, 247, 0.3)",
            borderRadius: 2,
            minWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ color: "#4fc3f7" }}>
          Apply as Exhibitor
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 3 }}>
            Please enter your company name to apply for this exhibition.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Company Name *"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter your company name"
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
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.6)',
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={applyLoading || !companyName.trim()}
            variant="contained"
            startIcon={applyLoading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
            sx={{
              background: "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(135deg, #43a047 0%, #1b5e20 100%)",
              }
            }}
          >
            {applyLoading ? "Applying..." : "Apply"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}