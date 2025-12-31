import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

export default function ExhibitorMessage() {
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
        <InfoIcon sx={{ fontSize: 50, mb: 2 }} />
        <Typography variant="h5" fontWeight="bold" textAlign="center">
          Exhibitors cannot explore events
        </Typography>
      </Paper>
    </Box>
  );
}
