import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField
} from '@mui/material';
import { motion } from 'framer-motion';
import { getCurrentUser, saveUser } from '../utils/storage';
import { User } from '../types';

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Dubai',
  'Australia/Sydney',
  'Pacific/Auckland'
];

function Profile() {
  const currentUser = getCurrentUser();
  const [timezone, setTimezone] = useState(currentUser?.timezone || '');

  // If there's no logged-in user, show a message (or redirect)
  if (!currentUser) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error">
          No user found. Please log in first.
        </Typography>
      </Box>
    );
  }

  const handleSave = () => {
    const updatedUser: User = {
      ...currentUser,
      timezone
    };
    saveUser(updatedUser);
    window.location.reload();
  };

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', pt: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Cinzel, serif' }}>
            Profile Settings
          </Typography>
          <Box sx={{ mt: 4 }}>
            {/* Username (read-only) */}
            <TextField
              fullWidth
              label="Username"
              value={currentUser.username}
              disabled
              sx={{ mb: 3 }}
            />

            {/* Timezone (editable) */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Timezone</InputLabel>
              <Select
                value={timezone}
                label="Timezone"
                onChange={(e) => setTimezone(e.target.value)}
              >
                {TIMEZONES.map((tz) => (
                  <MenuItem key={tz} value={tz}>
                    {tz}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>
              Save Changes
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}

export default Profile;
