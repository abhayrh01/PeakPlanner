import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useState } from 'react';
import theme from './theme';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Notes from './pages/Notes';
import Login from './components/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check if user has logged in before using a specific key for PeakPlanner
    return localStorage.getItem('peakplanner_logged_in') === 'true';
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('peakplanner_logged_in', 'true');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Login open={!isLoggedIn} onLogin={handleLogin} />
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default
        }}>
          <AppBar position="static" elevation={0}>
            <Toolbar>
              <Typography 
                variant="h6" 
                component={Link} 
                to="/" 
                sx={{ 
                  flexGrow: 1, 
                  textDecoration: 'none',
                  color: 'inherit',
                  fontWeight: 600
                }}
              >
                PeakPlanner
              </Typography>
              <Button 
                component={Link} 
                to="/tasks" 
                color="inherit"
                sx={{ mx: 1 }}
              >
                Tasks
              </Button>
              <Button 
                component={Link} 
                to="/notes" 
                color="inherit"
                sx={{ mx: 1 }}
              >
                Notes
              </Button>
            </Toolbar>
          </AppBar>

          <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
            <Container maxWidth="lg">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/notes" element={<Notes />} />
              </Routes>
            </Container>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
