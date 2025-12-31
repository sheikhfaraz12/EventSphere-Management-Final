import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';

export default function AttendeeMessage() {
  return (
    <Box
      sx={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 3,
          background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
          color: 'white',
        }}
      >
        <BlockIcon sx={{ fontSize: 50, mb: 2 }} />
        <Typography variant="h5" fontWeight="bold" textAlign="center">
          Attendees cannot host events
        </Typography>
      </Paper>
    </Box>
  );
}
