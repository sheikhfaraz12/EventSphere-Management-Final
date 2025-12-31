import React, { useEffect, useState } from "react";
import { getAllExpos, getAvailableBooths } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import {
  Box,
  Paper,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Divider,
  Stack,
  alpha
} from "@mui/material";
import {
  Event as EventIcon,
  ConfirmationNumber as BoothIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon,
  Add as AddIcon,
  Warning as WarningIcon
} from "@mui/icons-material";

export default function BoothList({ setActivePage }) {
  const { token } = useAuth();
  const [expos, setExpos] = useState([]);
  const [selectedExpo, setSelectedExpo] = useState("");
  const [selectedExpoData, setSelectedExpoData] = useState(null);
  const [booths, setBooths] = useState([]);
  const [loadingExpos, setLoadingExpos] = useState(true);
  const [loadingBooths, setLoadingBooths] = useState(false);
  const [error, setError] = useState("");

  // Fetch expos for dropdown
  useEffect(() => {
    fetchExpos();
  }, []);

  const fetchExpos = async () => {
    setLoadingExpos(true);
    try {
      const res = await getAllExpos(token);
      setExpos(res.data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching expos:", err);
      setError("Failed to load expos. Please try again.");
    } finally {
      setLoadingExpos(false);
    }
  };

  const fetchBooths = async (expoId) => {
    if (!expoId) return;
    
    setLoadingBooths(true);
    setError("");
    setBooths([]); // Clear previous booths
    setSelectedExpoData(null);
    
    try {
      // Find expo data first
      const expo = expos.find(e => e._id === expoId);
      if (!expo) {
        setError("Expo not found");
        return;
      }
      setSelectedExpoData(expo);
      
      // Then fetch booths
      const res = await getAvailableBooths(expoId, token);
      setBooths(res.data || []);
      
    } catch (err) {
      console.error("Error fetching booths:", err);
      // Check if it's a 404 (no booths found) vs other error
      if (err.response?.status === 404) {
        setBooths([]); // Empty array for no booths
      } else {
        setError("Failed to load booths. Please try again.");
        setBooths([]);
      }
    } finally {
      setLoadingBooths(false);
    }
  };

  const handleExpoChange = (e) => {
    const expoId = e.target.value;
    setSelectedExpo(expoId);
    fetchBooths(expoId);
  };

  const handleRefresh = () => {
    if (selectedExpo) {
      fetchBooths(selectedExpo);
    }
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

  const getStats = () => {
    const total = booths.length;
    const available = booths.filter(b => b.isAvailable).length;
    const booked = total - available;
    return { total, available, booked };
  };

  const stats = getStats();

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
              <BoothIcon sx={{ fontSize: 26, color: "white" }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold" sx={{ color: "white", mb: 0.5 }}>
                Booth Management
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                View and manage all booth spaces
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: "flex", gap: 1 }}>
            {selectedExpo && (
              <Tooltip title="Refresh booth list">
                <IconButton
                  onClick={handleRefresh}
                  disabled={loadingBooths}
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)"
                    }
                  }}
                >
                  {loadingBooths ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
                </IconButton>
              </Tooltip>
            )}
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
          {selectedExpoData && (
            <Chip
              icon={<BoothIcon />}
              label={`${stats.total} Booths`}
              sx={{
                backgroundColor: "rgba(102, 126, 234, 0.15)",
                color: "#667eea",
                fontWeight: 600,
                border: "1px solid rgba(102, 126, 234, 0.3)"
              }}
            />
          )}
        </Box>
      </Paper>

      {/* Error Alert */}
      {error && error !== "No booths found" && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={fetchExpos}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Expo Selection */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          background: "rgba(15, 23, 42, 0.8)",
          border: "1px solid rgba(79, 195, 247, 0.15)",
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel 
                sx={{ 
                  color: "rgba(255, 255, 255, 0.6)",
                  "&.Mui-focused": {
                    color: "#4fc3f7"
                  }
                }}
              >
                Select Expo
              </InputLabel>
              <Select
                value={selectedExpo}
                onChange={handleExpoChange}
                label="Select Expo"
                startAdornment={<EventIcon sx={{ color: '#4fc3f7', mr: 1 }} />}
                disabled={loadingExpos}
                sx={{
                  color: 'white !important',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  '& .MuiSelect-select': {
                    color: 'white !important',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4fc3f7',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4fc3f7',
                    boxShadow: '0 0 0 2px rgba(79, 195, 247, 0.2)',
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
                      color: 'white',
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
                    Select an expo to view booths
                  </Typography>
                </MenuItem>
                {loadingExpos ? (
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
            </FormControl>
          </Grid>

          {/* Stats */}
          {selectedExpoData && (
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Card sx={{ 
                    background: alpha("#4fc3f7", 0.1), 
                    textAlign: "center", 
                    p: 1.5,
                    border: "1px solid rgba(79, 195, 247, 0.3)"
                  }}>
                    <Typography variant="h6" sx={{ color: "#4fc3f7", fontWeight: 600 }}>
                      {stats.total}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                      Total Booths
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card sx={{ 
                    background: alpha("#4caf50", 0.1), 
                    textAlign: "center", 
                    p: 1.5,
                    border: "1px solid rgba(76, 175, 80, 0.3)"
                  }}>
                    <Typography variant="h6" sx={{ color: "#4caf50", fontWeight: 600 }}>
                      {stats.available}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                      Available
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card sx={{ 
                    background: alpha("#f44336", 0.1), 
                    textAlign: "center", 
                    p: 1.5,
                    border: "1px solid rgba(244, 67, 54, 0.3)"
                  }}>
                    <Typography variant="h6" sx={{ color: "#f44336", fontWeight: 600 }}>
                      {stats.booked}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                      Booked
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Expo Details - Only show if expo is selected */}
      {selectedExpoData && (
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            background: "rgba(30, 41, 59, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Typography variant="h6" sx={{ color: "#4fc3f7", mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <EventIcon /> Expo Details
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={1.5}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <EventIcon sx={{ color: "#4fc3f7", fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                      Expo Title
                    </Typography>
                    <Typography variant="body1" sx={{ color: "white", fontWeight: 500 }}>
                      {selectedExpoData.title}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <LocationIcon sx={{ color: "#4fc3f7", fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                      Location
                    </Typography>
                    <Typography variant="body1" sx={{ color: "white" }}>
                      {selectedExpoData.location || "Not specified"}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={1.5}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <CalendarIcon sx={{ color: "#4fc3f7", fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                      Event Dates
                    </Typography>
                    <Typography variant="body1" sx={{ color: "white" }}>
                      {formatDate(selectedExpoData.startDate)} → {formatDate(selectedExpoData.endDate)}
                    </Typography>
                  </Box>
                </Box>
                {selectedExpoData.description && (
                  <Box>
                    <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                      Description
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                      {selectedExpoData.description}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Booths Table - Only show if expo is selected */}
      {selectedExpo && (
        <Paper
          elevation={4}
          sx={{
            borderRadius: 2,
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(79, 195, 247, 0.15)",
            overflow: "hidden"
          }}
        >
          {loadingBooths ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 6 }}>
              <CircularProgress />
            </Box>
          ) : booths.length === 0 ? (
            <Box sx={{ textAlign: "center", p: 6 }}>
              <WarningIcon sx={{ fontSize: 64, color: "rgba(255, 193, 7, 0.5)", mb: 2 }} />
              <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
                No Booths Found
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.5)", mb: 3 }}>
                No booth spaces have been created for "{selectedExpoData?.title}" yet.
              </Typography>
              <Button
                variant="contained"
                onClick={() => setActivePage("create-booth")}
                startIcon={<AddIcon />}
                sx={{
                  background: "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
                  color: "white",
                  "&:hover": {
                    background: "linear-gradient(135deg, #43a047 0%, #1b5e20 100%)",
                  }
                }}
              >
                Create First Booth
              </Button>
            </Box>
          ) : (
            <>
              <Box sx={{ p: 3, borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                <Typography variant="h6" sx={{ color: "white", display: "flex", alignItems: "center", gap: 1 }}>
                  <BoothIcon /> Booths List
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                  Showing {booths.length} booth{booths.length !== 1 ? "s" : ""} for "{selectedExpoData?.title}"
                </Typography>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: "rgba(30, 41, 59, 0.5)" }}>
                      <TableCell sx={{ color: "#4fc3f7", fontWeight: 600, borderColor: "rgba(255, 255, 255, 0.1)" }}>
                        Booth Number
                      </TableCell>
                      <TableCell sx={{ color: "#4fc3f7", fontWeight: 600, borderColor: "rgba(255, 255, 255, 0.1)" }}>
                        Status
                      </TableCell>
                      <TableCell sx={{ color: "#4fc3f7", fontWeight: 600, borderColor: "rgba(255, 255, 255, 0.1)" }}>
                        Exhibitor Email
                      </TableCell>
                      <TableCell sx={{ color: "#4fc3f7", fontWeight: 600, borderColor: "rgba(255, 255, 255, 0.1)" }}>
                        Company Name
                      </TableCell>
                      <TableCell sx={{ color: "#4fc3f7", fontWeight: 600, borderColor: "rgba(255, 255, 255, 0.1)" }}>
                        Created Date
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {booths.map((b) => (
                      <TableRow 
                        key={b._id}
                        sx={{ 
                          '&:hover': {
                            backgroundColor: 'rgba(79, 195, 247, 0.05)'
                          }
                        }}
                      >
                        <TableCell sx={{ color: "white", borderColor: "rgba(255, 255, 255, 0.1)" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <BoothIcon sx={{ color: "#4fc3f7", fontSize: 18 }} />
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {b.number || b.boothNumber || "N/A"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
                          <Chip
                            icon={b.isAvailable ? <CheckCircleIcon /> : <CancelIcon />}
                            label={b.isAvailable ? "Available" : "Booked"}
                            size="small"
                            sx={{
                              backgroundColor: b.isAvailable 
                                ? "rgba(76, 175, 80, 0.15)" 
                                : "rgba(244, 67, 54, 0.15)",
                              color: b.isAvailable ? "#4caf50" : "#f44336",
                              border: `1px solid ${b.isAvailable ? "#4caf5030" : "#f4433630"}`,
                              fontWeight: 500
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: "white", borderColor: "rgba(255, 255, 255, 0.1)" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <EmailIcon sx={{ color: "#4fc3f7", fontSize: 18 }} />
                            <Typography variant="body2">
                              {b.exhibitorEmail || b.exhibitor?.email || "-"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: "white", borderColor: "rgba(255, 255, 255, 0.1)" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <BusinessIcon sx={{ color: "#4fc3f7", fontSize: 18 }} />
                            <Typography variant="body2">
                              {b.companyName || b.exhibitor?.companyName || "-"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: "rgba(255, 255, 255, 0.7)", borderColor: "rgba(255, 255, 255, 0.1)" }}>
                          {b.createdAt ? formatDate(b.createdAt) : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Paper>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button
          onClick={() => setActivePage("create-booth")}
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          sx={{
            borderColor: "rgba(255, 255, 255, 0.2)",
            color: "white",
            px: 4,
            py: 1,
            borderRadius: 1,
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              borderColor: "#4fc3f7",
              backgroundColor: "rgba(79, 195, 247, 0.1)"
            }
          }}
        >
          Back to Create Booth
        </Button>

        {selectedExpo && (
          <Button
            onClick={handleRefresh}
            startIcon={<RefreshIcon />}
            disabled={loadingBooths}
            variant="outlined"
            sx={{
              borderColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              px: 4,
              py: 1,
              borderRadius: 1,
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                borderColor: "#4fc3f7",
                backgroundColor: "rgba(79, 195, 247, 0.1)"
              }
            }}
          >
            {loadingBooths ? "Refreshing..." : "Refresh List"}
          </Button>
        )}
      </Box>
    </Box>
  );
}