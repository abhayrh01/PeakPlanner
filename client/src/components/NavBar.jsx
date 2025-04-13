import { AppBar, Toolbar, Typography, Button, Box, useTheme, Container } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { TaskAlt, Notes, Home } from "@mui/icons-material";

function NavBar() {
  const theme = useTheme();
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/", icon: <Home /> },
    { label: "Tasks", path: "/tasks", icon: <TaskAlt /> },
    { label: "Notes", path: "/notes", icon: <Notes /> },
  ];

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "primary.main",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 1,
              letterSpacing: '-0.025em',
            }}
          >
            PEAKPLANNER
          </Typography>
          <Box sx={{ 
            display: "flex", 
            gap: 2,
            '& .MuiButton-root': {
              minWidth: '100px',
            }
          }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                component={RouterLink}
                to={item.path}
                startIcon={item.icon}
                variant={location.pathname === item.path ? "contained" : "text"}
                sx={{
                  color: location.pathname === item.path ? "primary.contrastText" : "text.primary",
                  '&:hover': {
                    backgroundColor: location.pathname === item.path ? 'primary.dark' : 'rgba(99, 102, 241, 0.08)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavBar;
