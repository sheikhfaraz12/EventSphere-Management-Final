import React, { useEffect, useState } from "react";
import { getAllExpos } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  Avatar,
  Stack,
  Divider,
  Grid,
  Paper,
  CircularProgress,
  Tooltip,
  Alert,
  Fade
} from "@mui/material";
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  ArrowForward as ArrowForwardIcon,
  Business as BusinessIcon
} from "@mui/icons-material";

export default function ExpoList({ onEdit, onDelete }) {
  const { token } = useAuth();
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [refreshLoading, setRefreshLoading] = useState(false);

  useEffect(() => {
    fetchExpos();
  }, []);

  const fetchExpos = async () => {
    try {
      setLoading(true);
      const res = await getAllExpos(token);
      setExpos(res.data || []);
    } catch {
      // Error handled in UI
    } finally {
      setLoading(false);
      setRefreshLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshLoading(true);
    fetchExpos();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expo? This action cannot be undone.")) {
      setDeletingId(id);
      try {
        await onDelete(id);
        // Filter out the deleted expo from state
        setExpos(prev => prev.filter(expo => expo._id !== id));
      } catch (error) {
        console.error("Delete failed:", error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return "#4fc3f7"; // Upcoming - Blue
    if (now >= start && now <= end) return "#4caf50"; // Ongoing - Green
    return "#9e9e9e"; // Past - Gray
  };

  const getStatusText = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return "Upcoming";
    if (now >= start && now <= end) return "Ongoing";
    return "Completed";
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress />
      </Box>
    );
  }

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
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ color: "white", mb: 0.5 }}>
              All Expos
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
              Manage and monitor all exhibition events
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Refresh list">
              <IconButton
                onClick={handleRefresh}
                disabled={refreshLoading}
                sx={{
                  color: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)"
                  }
                }}
              >
                {refreshLoading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Chip
            icon={<EventIcon />}
            label={`${expos.length} Total Expos`}
            sx={{
              backgroundColor: "rgba(79, 195, 247, 0.15)",
              color: "#4fc3f7",
              fontWeight: 600,
              border: "1px solid rgba(79, 195, 247, 0.3)"
            }}
          />
          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
            Click on expo cards to manage details
          </Typography>
        </Box>
      </Paper>

      {/* Empty State */}
      {expos.length === 0 && (
        <Card
          sx={{
            textAlign: "center",
            p: 6,
            background: "rgba(30, 41, 59, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 2
          }}
        >
          <Box sx={{ mb: 2 }}>
            <EventIcon sx={{ fontSize: 64, color: "rgba(255, 255, 255, 0.2)" }} />
          </Box>
          <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
            No Expos Found
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.5)", mb: 3 }}>
            Create your first expo to get started
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{
              borderColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              "&:hover": {
                borderColor: "#4fc3f7",
                backgroundColor: "rgba(79, 195, 247, 0.1)"
              }
            }}
          >
            Refresh
          </Button>
        </Card>
      )}

      {/* Expos Grid */}
      <Grid container spacing={3}>
        {expos.map((expo) => {
          const statusColor = getStatusColor(expo.startDate, expo.endDate);
          const statusText = getStatusText(expo.startDate, expo.endDate);

          return (
            <Grid item xs={12} md={6} lg={4} key={expo._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "2px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": {
                    borderColor: statusColor,
                    transform: "translateY(-4px)",
                    boxShadow: `0 12px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px ${statusColor}40`
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: `linear-gradient(90deg, ${statusColor} 0%, ${statusColor}80 100%)`
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* Status Badge */}
                  <Box sx={{ position: "absolute", top: 12, right: 12 }}>
                    <Chip
                      label={statusText}
                      size="small"
                      sx={{
                        backgroundColor: `${statusColor}15`,
                        color: statusColor,
                        border: `1px solid ${statusColor}30`,
                        fontWeight: 600,
                        fontSize: "0.75rem"
                      }}
                    />
                  </Box>

                  {/* Title and Description */}
                  <Box sx={{ mb: 2, pr: 6 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "white",
                        fontWeight: 700,
                        mb: 1,
                        lineHeight: 1.3,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}
                    >
                      {expo.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        fontSize: "0.875rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}
                    >
                      {expo.description || "No description provided"}
                    </Typography>
                  </Box>

                  <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 2 }} />

                  {/* Details */}
                  <Stack spacing={2}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <LocationIcon sx={{ color: "#4fc3f7", fontSize: 18, flexShrink: 0 }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "white",
                          fontSize: "0.875rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {expo.location || "Location not specified"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <CalendarIcon sx={{ color: "#4fc3f7", fontSize: 18, flexShrink: 0 }} />
                      <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                        {formatDate(expo.startDate)} → {formatDate(expo.endDate)}
                      </Typography>
                    </Box>

                    {/* Optional Stats */}
                    <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <BusinessIcon sx={{ color: "rgba(255, 255, 255, 0.5)", fontSize: 16 }} />
                        <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                          ID: {expo._id?.slice(-6) || "N/A"}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>

                {/* Action Buttons */}
                <Box sx={{ p: 2, pt: 0 }}>
                  <Stack direction="row" spacing={1}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => onEdit(expo._id)}
                      sx={{
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        color: "white",
                        py: 0.75,
                        borderRadius: 1,
                        textTransform: "none",
                        fontWeight: 500,
                        "&:hover": {
                          borderColor: "#4fc3f7",
                          backgroundColor: "rgba(79, 195, 247, 0.1)"
                        }
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={deletingId === expo._id ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
                      onClick={() => handleDelete(expo._id)}
                      disabled={deletingId === expo._id}
                      sx={{
                        background: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
                        color: "white",
                        fontWeight: 600,
                        py: 0.75,
                        borderRadius: 1,
                        textTransform: "none",
                        "&:hover": {
                          background: "linear-gradient(135deg, #e53935 0%, #c62828 100%)",
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 12px rgba(244, 67, 54, 0.3)"
                        },
                        "&:disabled": {
                          background: "rgba(255, 255, 255, 0.1)",
                          color: "rgba(255, 255, 255, 0.3)"
                        }
                      }}
                    >
                      {deletingId === expo._id ? "Deleting..." : "Delete"}
                    </Button>
                  </Stack>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Footer Stats */}
      {expos.length > 0 && (
        <Fade in={true}>
          <Paper
            elevation={0}
            sx={{
              mt: 4,
              p: 2,
              background: "rgba(30, 41, 59, 0.3)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 2
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Showing {expos.length} expo{expos.length !== 1 ? "s" : ""}
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                💡 Click edit to modify expo details or delete to remove permanently
              </Typography>
            </Box>
          </Paper>
        </Fade>
      )}
    </Box>
  );
}