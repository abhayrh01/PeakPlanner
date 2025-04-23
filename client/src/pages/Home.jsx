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
import { COLORS } from '../theme';

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
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h2" 
          sx={{ 
            mb: 2,
            color: '#4285F4',
            fontWeight: 700,
          }}
        >
          PeakPlanner
        </Typography>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            mb: 4,
            color: '#AAAAAA',
            maxWidth: '800px',
            mx: 'auto',
            fontSize: '1.1rem',
          }}
        >
          Your all-in-one productivity companion. Organize tasks, take notes, and stay on top of your goals with a beautiful, intuitive interface.
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
        gap: 3,
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 16px',
        mb: 4
      }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            bgcolor: '#1E1E1E',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              bgcolor: '#242424',
            }
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#FFFFFF' }}>
            Tasks
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 3,
              color: '#AAAAAA',
            }}
          >
            Manage your to-do list with ease. Create, organize, and track your tasks with our intuitive interface.
          </Typography>
          <Button
            component={Link}
            to="/tasks"
            variant="contained"
            size="large"
            sx={{ 
              mt: 'auto',
              bgcolor: '#4285F4',
              '&:hover': {
                bgcolor: '#1967D2',
              }
            }}
          >
            Go to Tasks
          </Button>
        </Paper>

        <Paper 
          elevation={0}
          sx={{ 
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            bgcolor: '#1E1E1E',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              bgcolor: '#242424',
            }
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#FFFFFF' }}>
            Notes
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 3,
              color: '#AAAAAA',
            }}
          >
            Capture your thoughts and ideas. Create, edit, and organize your notes with our simple yet powerful interface.
          </Typography>
          <Button
            component={Link}
            to="/notes"
            variant="contained"
            size="large"
            sx={{ 
              mt: 'auto',
              bgcolor: '#4285F4',
              '&:hover': {
                bgcolor: '#1967D2',
              }
            }}
          >
            Go to Notes
          </Button>
        </Paper>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
        gap: 2,
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 16px',
        mb: 4
      }}>
        <Paper sx={{ 
          p: 2, 
          bgcolor: '#1E1E1E',
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <TaskAlt sx={{ color: "#4285F4" }} />
            <Typography variant="subtitle1" sx={{ color: '#FFFFFF' }}>Total Tasks</Typography>
          </Box>
          <Typography variant="h4" sx={{ color: "#FFD700" }}>{totalTasks}</Typography>
        </Paper>

        <Paper sx={{ 
          p: 2, 
          bgcolor: '#1E1E1E',
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <TrendingUp sx={{ color: "#34A853" }} />
            <Typography variant="subtitle1" sx={{ color: '#FFFFFF' }}>Completion Rate</Typography>
          </Box>
          <Typography variant="h4" sx={{ color: "#FFD700" }}>{completionRate}%</Typography>
        </Paper>

        <Paper sx={{ 
          p: 2, 
          bgcolor: '#1E1E1E',
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <AccessTime sx={{ color: "#EA4335" }} />
            <Typography variant="subtitle1" sx={{ color: '#FFFFFF' }}>Pending Tasks</Typography>
          </Box>
          <Typography variant="h4" sx={{ color: "#FFD700" }}>{pendingTasks}</Typography>
        </Paper>

        <Paper sx={{ 
          p: 2, 
          bgcolor: '#1E1E1E',
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Notes sx={{ color: "#FBBC05" }} />
            <Typography variant="subtitle1" sx={{ color: '#FFFFFF' }}>Total Notes</Typography>
          </Box>
          <Typography variant="h4" sx={{ color: "#FFD700" }}>{notes.length}</Typography>
        </Paper>
      </Box>

      {/* Recent Activity */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
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
