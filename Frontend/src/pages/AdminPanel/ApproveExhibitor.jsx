import React, { useEffect, useState } from "react";
import { getPendingExhibitors, approveExhibitor } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Stack,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  IconButton,
  Tooltip,
  Paper,
  Grid
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Pending as PendingIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon
} from "@mui/icons-material";

export default function ApproveExhibitor() {
  const { token } = useAuth();
  const [exhibitors, setExhibitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Fetch pending exhibitors on mount
  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await getPendingExhibitors(token);
      setExhibitors(res.data || []);
    } catch (err) {
      console.error("Failed to fetch pending exhibitors:", err);
      setSnackbar({
        open: true,
        message: "Failed to load pending exhibitors",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setApprovingId(id);
    try {
      await approveExhibitor(id, token);
      setExhibitors(prev => prev.filter(e => e._id !== id));
      setSnackbar({
        open: true,
        message: "Exhibitor approved successfully!",
        severity: "success"
      });
    } catch (err) {
      console.error("Approval failed:", err);
      setSnackbar({
        open: true,
        message: "Approval failed. Please try again.",
        severity: "error"
      });
    } finally {
      setApprovingId(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
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
              Pending Exhibitors
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
              Review and approve new exhibitor applications
            </Typography>
          </Box>
          <Tooltip title="Refresh list">
            <IconButton
              onClick={fetchPending}
              sx={{
                color: "white",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)"
                }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip
            icon={<PendingIcon />}
            label={`${exhibitors.length} Pending`}
            sx={{
              backgroundColor: "rgba(255, 193, 7, 0.15)",
              color: "#ffb300",
              fontWeight: 600,
              border: "1px solid rgba(255, 193, 7, 0.3)"
            }}
          />
          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
            Click approve to activate exhibitor accounts
          </Typography>
        </Box>
      </Paper>

      {/* Empty State */}
      {exhibitors.length === 0 && (
        <Card
          sx={{
            textAlign: "center",
            p: 6,
            background: "rgba(30, 41, 59, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}
        >
          <Box sx={{ mb: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: "rgba(255, 255, 255, 0.2)" }} />
          </Box>
          <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
            No Pending Applications
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.5)", mb: 3 }}>
            All exhibitor applications have been processed
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchPending}
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

      {/* Exhibitors Grid */}
      <Grid container spacing={2}>
        {exhibitors.map((ex) => {
          const name = ex.userId?.name || "Unknown";
          const email = ex.userId?.email || "N/A";
          const company = ex.companyName || "No company name";
          const userId = ex.userId?._id || "";

          return (
            <Grid item xs={12} md={6} lg={4} key={ex._id}>
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
                    borderColor: "rgba(79, 195, 247, 0.3)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)"
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* Company Info */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      }}
                    >
                      <BusinessIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
                        {company}
                      </Typography>
                      <Chip
                        label="Pending Approval"
                        size="small"
                        icon={<WarningIcon />}
                        sx={{
                          backgroundColor: "rgba(255, 193, 7, 0.1)",
                          color: "#ffb300",
                          border: "1px solid rgba(255, 193, 7, 0.2)",
                          fontSize: "0.75rem",
                          height: 22
                        }}
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 2 }} />

                  {/* User Details */}
                  <Stack spacing={1.5}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <PersonIcon sx={{ color: "#4fc3f7", fontSize: 18 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                          Contact Person
                        </Typography>
                        <Typography variant="body2" sx={{ color: "white" }}>
                          {name}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <EmailIcon sx={{ color: "#4fc3f7", fontSize: 18 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                          Email
                        </Typography>
                        <Typography variant="body2" sx={{ color: "white" }}>
                          {email}
                        </Typography>
                      </Box>
                    </Box>

                    {ex.createdAt && (
                      <Box>
                        <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                          Applied on
                        </Typography>
                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                          {new Date(ex.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>

                {/* Action Button */}
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleApprove(ex._id)}
                    disabled={approvingId === ex._id}
                    startIcon={
                      approvingId === ex._id ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <CheckCircleIcon />
                      )
                    }
                    sx={{
                      background: "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
                      color: "white",
                      fontWeight: 600,
                      py: 1,
                      borderRadius: 1,
                      textTransform: "none",
                      "&:hover": {
                        background: "linear-gradient(135deg, #43a047 0%, #1b5e20 100%)",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)"
                      },
                      "&:disabled": {
                        background: "rgba(255, 255, 255, 0.1)",
                        color: "rgba(255, 255, 255, 0.3)"
                      }
                    }}
                  >
                    {approvingId === ex._id ? "Approving..." : "Approve Exhibitor"}
                  </Button>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Quick Stats */}
      {exhibitors.length > 0 && (
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
          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)", textAlign: "center" }}>
            💡 Review each application carefully before approval. Approved exhibitors will gain full access to the platform.
          </Typography>
        </Paper>
      )}

      {/* Snackbar for notifications */}
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