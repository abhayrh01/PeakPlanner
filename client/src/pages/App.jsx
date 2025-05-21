import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box, CircularProgress } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import { Suspense, useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Home from "./Home";
import Tasks from "./Tasks";
import Notes from "./Notes";
import PageTransition from "../components/PageTransition";
import Login from '../components/Login';
import theme from "./themes";

function AppContent() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem('peakplanner_logged_in');
    setIsLoggedIn(loginStatus === 'true');
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('peakplanner_logged_in', 'true');
  };

  if (!isLoggedIn) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
        }}
      >
        <Login open={true} onLogin={handleLogin} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <NavBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <Suspense
                  fallback={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  }
                >
                  <PageTransition>
                    <Home />
                  </PageTransition>
                </Suspense>
              }
            />
            <Route
              path="/tasks"
              element={
                <Suspense
                  fallback={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  }
                >
                  <PageTransition>
                    <Tasks />
                  </PageTransition>
                </Suspense>
              }
            />
            <Route
              path="/notes"
              element={
                <Suspense
                  fallback={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  }
                >
                  <PageTransition>
                    <Notes />
                  </PageTransition>
                </Suspense>
              }
            />
          </Routes>
        </AnimatePresence>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
