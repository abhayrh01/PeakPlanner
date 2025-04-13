import { useState, useEffect } from "react";
import { 
  Container, Typography, Button, Paper, Box, Grid, Card, CardContent, 
  List, ListItem, ListItemText, ListItemIcon, Divider, Chip, IconButton
} from "@mui/material";
import { Link } from "react-router-dom";
import { 
  TaskAlt, Notes, TrendingUp, AccessTime, 
  Work, School, Lightbulb, Person, Category
} from "@mui/icons-material";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // Load tasks and notes from localStorage
    const savedTasks = localStorage.getItem("peakplanner_tasks");
    const savedNotes = localStorage.getItem("peakplanner_notes");
    
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const getTaskStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return { totalTasks, completedTasks, pendingTasks, completionRate };
  };

  const getRecentActivity = () => {
    const recentTasks = [...tasks]
      .sort((a, b) => new Date(b.dueDate || 0) - new Date(a.dueDate || 0))
      .slice(0, 3);
    
    const recentNotes = [...notes]
      .sort((a, b) => b.id - a.id)
      .slice(0, 3);
    
    return { recentTasks, recentNotes };
  };

  const { totalTasks, completedTasks, pendingTasks, completionRate } = getTaskStats();
  const { recentTasks, recentNotes } = getRecentActivity();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ color: "#FFD700" }}>
          PEAKPLANNER 🚀
        </Typography>
        <Typography variant="h6" color="#BDBDBD" gutterBottom>
          Stay organized. Stay productive.
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Button 
            component={Link} 
            to="/tasks" 
            variant="contained" 
            fullWidth
            sx={{ 
              height: '100px',
              backgroundColor: "#58A6FF", 
              color: "#121212", 
              "&:hover": { backgroundColor: "#8AC7FF" },
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            <TaskAlt sx={{ fontSize: 40 }} />
            <Typography variant="h6">Manage Tasks</Typography>
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button 
            component={Link} 
            to="/notes" 
            variant="contained" 
            fullWidth
            sx={{ 
              height: '100px',
              backgroundColor: "#FFD700", 
              color: "#121212", 
              "&:hover": { backgroundColor: "#FFC107" },
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            <Notes sx={{ fontSize: 40 }} />
            <Typography variant="h6">Take Notes</Typography>
          </Button>
        </Grid>
      </Grid>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#2D2D2D", color: "#EAEAEA" }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TaskAlt sx={{ color: "#58A6FF" }} />
                <Typography variant="h6">Total Tasks</Typography>
              </Box>
              <Typography variant="h4" sx={{ color: "#FFD700" }}>{totalTasks}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#2D2D2D", color: "#EAEAEA" }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingUp sx={{ color: "#06D6A0" }} />
                <Typography variant="h6">Completion Rate</Typography>
              </Box>
              <Typography variant="h4" sx={{ color: "#FFD700" }}>{completionRate}%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#2D2D2D", color: "#EAEAEA" }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AccessTime sx={{ color: "#FF6B6B" }} />
                <Typography variant="h6">Pending Tasks</Typography>
              </Box>
              <Typography variant="h4" sx={{ color: "#FFD700" }}>{pendingTasks}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#2D2D2D", color: "#EAEAEA" }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Notes sx={{ color: "#FFD700" }} />
                <Typography variant="h6">Total Notes</Typography>
              </Box>
              <Typography variant="h4" sx={{ color: "#FFD700" }}>{notes.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: "#2D2D2D", color: "#EAEAEA" }}>
            <Typography variant="h6" gutterBottom sx={{ color: "#FFD700" }}>
              Recent Tasks
            </Typography>
            <List>
              {recentTasks.map((task, index) => (
                <ListItem key={index} sx={{ 
                  bgcolor: "#3D3D3D", 
                  mb: 1, 
                  borderRadius: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <TaskAlt sx={{ color: task.completed ? "#06D6A0" : "#FF6B6B" }} />
                    <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                      {task.title}
                    </Typography>
                    {task.dueDate && (
                      <Chip 
                        label={new Date(task.dueDate).toLocaleDateString()} 
                        size="small"
                        sx={{ bgcolor: "#4D4D4D" }}
                      />
                    )}
                  </Box>
                  <Typography variant="body2" color="#BDBDBD" sx={{ ml: 4 }}>
                    {task.body}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: "#2D2D2D", color: "#EAEAEA" }}>
            <Typography variant="h6" gutterBottom sx={{ color: "#FFD700" }}>
              Recent Notes
            </Typography>
            <List>
              {recentNotes.map((note, index) => (
                <ListItem key={index} sx={{ 
                  bgcolor: "#3D3D3D", 
                  mb: 1, 
                  borderRadius: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <Notes sx={{ color: "#FFD700" }} />
                    <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                      {note.title}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body2" 
                    color="#BDBDBD" 
                    sx={{ 
                      ml: 4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {note.text}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
