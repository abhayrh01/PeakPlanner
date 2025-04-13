import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box, CircularProgress } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Notes from "./pages/Notes";
import PageTransition from "./components/PageTransition";
import theme from "./theme";
import { Suspense } from "react";

function AppContent() {
  const location = useLocation();

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
