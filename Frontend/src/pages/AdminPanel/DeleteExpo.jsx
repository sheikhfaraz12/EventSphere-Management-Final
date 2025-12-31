import React, { useEffect, useState } from "react";
import { getSingleExpo, deleteExpo } from "../../services/api"; // Make sure this is imported
import { useAuth } from "../../contexts/AuthContext";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Divider,
  Chip,
  CircularProgress,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@mui/material";
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Info as InfoIcon
} from "@mui/icons-material";

export default function DeleteExpo({ expoId, onDone }) {
  const { token } = useAuth();
  const [expo, setExpo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (expoId) {
      fetchExpo();
    }
  }, [expoId]);

  const fetchExpo = async () => {
    setLoading(true);
    try {
      const res = await getSingleExpo(expoId, token);
      setExpo(res.data);
      setError("");
    } catch (err) {
      console.error("Failed to load expo:", err);
      setError("Failed to load expo details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setConfirmOpen(true);
    setConfirmText(""); // Reset confirmation text
  };

  const confirmDelete = async () => {
    if (confirmText !== "DELETE") {
      setError("Please type 'DELETE' to confirm");
      return;
    }

    setDeleting(true);
    setError("");

    try {
      // DEBUG: Log before API call
      console.log("Deleting expo with ID:", expoId);
      console.log("Using token:", token ? "Token exists" : "No token");

      await deleteExpo(expoId, token);
      
      // DEBUG: Log success
      console.log("Expo deleted successfully");
      
      setConfirmOpen(false);
      
      // Show success message
      setError("success"); // Special value for success
      
      // Wait a moment then call onDone
      setTimeout(() => {
        onDone();
      }, 1500);
      
    } catch (err) {
      console.error("Delete failed:", err);
      console.error("Error details:", err.response?.data);
      
      let errorMessage = "Failed to delete expo. ";
      if (err.response?.data?.message) {
        errorMessage += err.response.data.message;
      } else if (err.message) {
        errorMessage += err.message;
      }
      
      setError(errorMessage);
    } finally {
      setDeleting(false);
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !expo) {
    return (
      <Alert severity="error" sx={{ maxWidth: 600, mx: "auto", mt: 3 }}>
        {error}
      </Alert>
    );
  }

  if (!expo) {
    return null;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      {/* Success Alert */}
      {error === "success" && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 3,
            background: "rgba(76, 175, 80, 0.1)",
            border: "1px solid rgba(76, 175, 80, 0.3)",
            color: "#4caf50"
          }}
        >
          Expo deleted successfully! Redirecting...
        </Alert>
      )}

      {/* Error Alert */}
      {error && error !== "success" && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            background: "rgba(244, 67, 54, 0.1)",
            border: "1px solid rgba(244, 67, 54, 0.3)",
            color: "#f44336"
          }}
        >
          {error}
        </Alert>
      )}

      {/* Warning Header */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 2,
          background: "linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(211, 47, 47, 0.1) 100%)",
          border: "2px solid rgba(244, 67, 54, 0.3)"
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgba(244, 67, 54, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <WarningIcon sx={{ fontSize: 28, color: "#f44336" }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ color: "#f44336" }}>
                Delete Expo
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                This action cannot be undone. All related data will be permanently removed.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Expo Details Card */}
      <Card
        sx={{
          mb: 3,
          background: "rgba(15, 23, 42, 0.8)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 2,
          position: "relative",
          overflow: "hidden"
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ color: "white", mb: 3 }}>
            {expo.title}
          </Typography>

          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", mb: 3 }} />

          <Stack spacing={2.5}>
            {expo.description && (
              <Box>
                <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)", display: "block", mb: 0.5 }}>
                  Description
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  {expo.description}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <LocationIcon sx={{ color: "#4fc3f7", fontSize: 20 }} />
              <Box>
                <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                  Location
                </Typography>
                <Typography variant="body1" sx={{ color: "white" }}>
                  {expo.location || "Not specified"}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <CalendarIcon sx={{ color: "#4fc3f7", fontSize: 20 }} />
              <Box>
                <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                  Event Dates
                </Typography>
                <Typography variant="body1" sx={{ color: "white" }}>
                  {formatDate(expo.startDate)} → {formatDate(expo.endDate)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <InfoIcon sx={{ color: "#4fc3f7", fontSize: 20 }} />
              <Box>
                <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                  Expo ID
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)", fontFamily: "monospace" }}>
                  {expo._id}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 4 }}>
        <Button
          variant="outlined"
          onClick={onDone}
          startIcon={<CloseIcon />}
          disabled={deleting || error === "success"}
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
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleDelete}
          disabled={deleting || error === "success"}
          startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
          sx={{
            background: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
            color: "white",
            px: 4,
            py: 1,
            borderRadius: 1,
            textTransform: "none",
            fontWeight: 600,
            minWidth: 160,
            "&:hover": {
              background: "linear-gradient(135deg, #e53935 0%, #c62828 100%)",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 20px rgba(244, 67, 54, 0.4)"
            },
            "&:disabled": {
              background: "rgba(255, 255, 255, 0.1)",
              color: "rgba(255, 255, 255, 0.3)"
            }
          }}
        >
          {deleting ? "Deleting..." : "Delete Expo"}
        </Button>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => !deleting && setConfirmOpen(false)}
        PaperProps={{
          sx: {
            background: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(244, 67, 54, 0.3)",
            borderRadius: 2,
            minWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ color: "#f44336", display: "flex", alignItems: "center", gap: 1, pb: 1 }}>
          <WarningIcon /> Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: "white", mb: 2 }}>
            Are you absolutely sure you want to delete <strong>"{expo.title}"</strong>?
          </Typography>
          <Alert severity="error" sx={{ mb: 2 }}>
            This action cannot be undone. All associated data will be permanently deleted.
          </Alert>
          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 1 }}>
            To confirm, type <strong style={{ color: "#f44336" }}>DELETE</strong> below:
          </Typography>
          <TextField
            fullWidth
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE to confirm"
            sx={{
              mt: 1,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                '& fieldset': {
                  borderColor: confirmText === "DELETE" ? "#4caf50" : 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: confirmText === "DELETE" ? "#4caf50" : '#f44336',
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => {
              setConfirmOpen(false);
              setConfirmText("");
            }}
            disabled={deleting}
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.05)"
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            disabled={deleting || confirmText !== "DELETE"}
            variant="contained"
            startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
            sx={{
              background: confirmText === "DELETE" 
                ? "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)"
                : "rgba(255, 255, 255, 0.1)",
              color: "white",
              "&:hover": {
                background: confirmText === "DELETE"
                  ? "linear-gradient(135deg, #e53935 0%, #c62828 100%)"
                  : "rgba(255, 255, 255, 0.1)"
              }
            }}
          >
            {deleting ? "Deleting..." : "Confirm Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}