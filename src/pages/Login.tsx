import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { saveUser, setCurrentUser, getUsers } from '../utils/storage';
import { User } from '../types';

function Login() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    // Check if this user already exists
    const users = getUsers();
    let user = users.find(u => u.username === username);

    // If not found, create and save new user
    if (!user) {
      user = {
        username,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        availability: {}
      } as User;
      saveUser(user);
    }

    // Set this user as the current user
    setCurrentUser(username);
    // Navigate to home or profile (your choice)
    navigate('/');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
            borderRadius: 2
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Welcome
          </Typography>
          <Typography variant="body1" gutterBottom align="center" color="text.secondary">
            Enter your username to continue
          </Typography>
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!error}
              helperText={error}
              sx={{ mb: 3 }}
            />
            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              sx={{ mb: 2 }}
            >
              Continue
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}

export default Login;
