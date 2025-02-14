import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  return (
    <Box 
      sx={{ 
        height: 'calc(100vh - 100px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        px: 3
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            mb: 4,
            maxWidth: '600px'
          }}
        >
          Streamline your scheduling with our intuitive slot booking system
        </Typography>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowRight />}
            onClick={() => navigate('/dashboard')}
            sx={{ 
              py: 1.5,
              px: 4,
              fontSize: '1.1rem'
            }}
          >
            Get Started
          </Button>
        </motion.div>
      </motion.div>
    </Box>
  );
}

export default Home;