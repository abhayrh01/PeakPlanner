import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert
} from '@mui/material';
import { COLORS } from '../theme';

const whiteTextFieldStyles = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: COLORS.surfaceLight,
    '& fieldset': {
      borderColor: COLORS.border,
    },
    '&:hover fieldset': {
      borderColor: COLORS.primary,
    },
    '&.Mui-focused fieldset': {
      borderColor: COLORS.primary,
    },
    '& input': {
      color: '#fff !important',
      '::placeholder': {
        color: '#fff !important',
        opacity: 1,
      },
    },
    '& input:-webkit-autofill': {
      WebkitTextFillColor: '#fff !important',
      transition: 'background-color 9999s ease-in-out 0s',
      WebkitBoxShadow: `0 0 0 100px ${COLORS.surfaceLight} inset !important`,
      boxShadow: `0 0 0 100px ${COLORS.surfaceLight} inset !important`,
    },
  },
  '& .MuiInputLabel-root': {
    color: '#fff !important',
    '&.Mui-focused': {
      color: '#fff !important',
    },
  },
};

const Login = ({ open, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'abhayrh01@gmail.com' && password === 'pass') {
      onLogin();
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <Dialog 
      open={open} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: COLORS.surface,
          borderRadius: 3,
          border: `1px solid ${COLORS.border}`,
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h5" sx={{ fontWeight: 600, textAlign: 'center', color: '#fff' }}>
          Welcome to PeakPlanner
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            sx={whiteTextFieldStyles}
            InputProps={{ style: { color: '#fff' } }}
            InputLabelProps={{ style: { color: '#fff' } }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            sx={whiteTextFieldStyles}
            InputProps={{ style: { color: '#fff' } }}
            InputLabelProps={{ style: { color: '#fff' } }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          sx={{
            py: 1.5,
            backgroundColor: COLORS.primary,
            color: '#fff',
            '&:hover': {
              backgroundColor: COLORS.primary,
              opacity: 0.9,
            }
          }}
        >
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Login;
