import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Box, Button, Typography, Divider, Stack } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Sidebar({ activePage, setActivePage }) {
  const { logout } = useAuth();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { id: "create-expo", label: "Create Expo", icon: <AddBoxIcon /> },
    { id: "expo-list", label: "View Expo", icon: <ListAltIcon /> },
    { id: "approve-exhibitor", label: "Approve Exhibitor", icon: <CheckCircleIcon /> },
    { id: "create-booth", label: "Create Booth", icon: <EventSeatIcon /> },
    { id: "create-session", label: "Create Session", icon: <ScheduleIcon /> },
  ];

  return (
    <Box
      sx={{
        width: 260,
        minHeight: "100vh",
        bgcolor: "#0a1929",
        color: "white",
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={2} sx={{ textAlign: "center" }}>
        Admin Panel
      </Typography>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      <Stack spacing={1} mt={2}>
        {menuItems.map((item) => (
          <Button
            key={item.id}
            startIcon={item.icon}
            fullWidth
            onClick={() => setActivePage(item.id)}
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              fontWeight: 600,
              color: "white",
              borderRadius: 2,
              px: 2,
              py: 1.5,
              background:
                activePage === item.id
                  ? "linear-gradient(90deg, #1e3c72, #2a5298)"
                  : "transparent",
              "&:hover": {
                background: "linear-gradient(90deg, #1e3c72, #2a5298)",
              },
            }}
          >
            {item.label}
          </Button>
        ))}

        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mt: 2 }} />

        <Button
          startIcon={<LogoutIcon />}
          fullWidth
          onClick={logout}
          sx={{
            justifyContent: "flex-start",
            textTransform: "none",
            fontWeight: 600,
            color: "white",
            borderRadius: 2,
            px: 2,
            py: 1.5,
            mt: 2,
            background: "linear-gradient(90deg, #ff4d4f, #e33d3f)",
            "&:hover": {
              background: "linear-gradient(90deg, #e33d3f, #c12e2e)",
            },
          }}
        >
          Logout
        </Button>
      </Stack>
    </Box>
  );
}
