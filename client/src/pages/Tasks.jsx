import { useState, useEffect } from "react";
import { Container, TextField, Button, List, ListItem, ListItemText, IconButton, Typography, Paper, Select, MenuItem, FormControl, InputLabel, Chip, Box, Fade, Checkbox, Grid, ButtonGroup } from "@mui/material";
import { Delete, Edit, CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { COLORS } from "../theme";

const CATEGORIES = [
  { id: 'work', label: 'Work', color: '#4285F4' },
  { id: 'personal', label: 'Personal', color: '#EA4335' },
  { id: 'ideas', label: 'Ideas', color: '#FBBC05' },
  { id: 'study', label: 'Study', color: '#34A853' },
  { id: 'other', label: 'Other', color: '#7B61FF' }
];

const PRIORITIES = [
  { id: 'high', label: 'High', color: '#EA4335' },
  { id: 'medium', label: 'Medium', color: '#FBBC05' },
  { id: 'low', label: 'Low', color: '#34A853' }
];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('other');
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [sortBy, setSortBy] = useState('none');

  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem("peakplanner_tasks");
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.error("Error loading tasks from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("peakplanner_tasks", JSON.stringify(tasks));
    } else {
      localStorage.removeItem("peakplanner_tasks");
    }
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      const newTaskObject = { 
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        text: newTask.trim(),
        completed: false,
        category: selectedCategory,
        priority: selectedPriority,
        dueDate: dueDate ? dueDate.toISOString() : null
      };
      setTasks([...tasks, newTaskObject]);
      setNewTask("");
      setDueDate(null);
    }
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const editTask = (index) => {
    setNewTask(tasks[index].text);
    setSelectedCategory(tasks[index].category);
    setSelectedPriority(tasks[index].priority);
    setDueDate(tasks[index].dueDate ? new Date(tasks[index].dueDate) : null);
    setIsEditing(true);
    setEditIndex(index);
  };

  const updateTask = () => {
    const updatedTasks = [...tasks];
    updatedTasks[editIndex] = { 
      ...updatedTasks[editIndex],
      text: newTask.trim(),
      category: selectedCategory,
      priority: selectedPriority,
      dueDate: dueDate ? dueDate.toISOString() : null
    };
    setTasks(updatedTasks);
    setNewTask("");
    setDueDate(null);
    setIsEditing(false);
    setEditIndex(null);
  };

  const toggleTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      completed: !updatedTasks[index].completed
    };
    setTasks(updatedTasks);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTasks(items);
  };

  const sortTasks = (tasksToSort) => {
    return [...tasksToSort].sort((a, b) => {
      if (sortBy === 'category') {
        return a.category.localeCompare(b.category);
      } else if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });
  };

  const filteredTasks = sortTasks(
    tasks.filter(task => {
      const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      const matchesSearch = searchQuery === '' || 
        task.text.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesPriority && matchesSearch;
    })
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            bgcolor: '#1E1E1E',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Typography 
            variant="h5" 
            sx={{
              mb: 3,
              color: '#4285F4',
              fontWeight: 600
            }}
          >
            Your Tasks
          </Typography>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#2D2D2D',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: '#4285F4',
                },
                '& input': {
                  color: '#FFFFFF !important',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#FFFFFF',
              },
            }}
          />

          <TextField
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#2D2D2D',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: '#4285F4',
                },
                '& textarea': {
                  color: '#FFFFFF !important',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#FFFFFF',
              },
            }}
          />

          <DatePicker
            label="Due Date"
            value={dueDate}
            onChange={(newValue) => setDueDate(newValue)}
            sx={{
              width: '100%',
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#2D2D2D',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: '#4285F4',
                },
                '& input': {
                  color: '#FFFFFF !important',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#FFFFFF',
              },
              '& .MuiSvgIcon-root': {
                color: '#FFFFFF',
              },
            }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: '#FFFFFF' }}>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
              sx={{
                backgroundColor: '#2D2D2D',
                color: '#FFFFFF',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4285F4',
                },
              }}
            >
              {CATEGORIES.map(category => (
                <MenuItem key={category.id} value={category.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: category.color }} />
                    {category.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel sx={{ color: '#FFFFFF' }}>Priority</InputLabel>
            <Select
              value={selectedPriority}
              label="Priority"
              onChange={(e) => setSelectedPriority(e.target.value)}
              sx={{
                backgroundColor: '#2D2D2D',
                color: '#FFFFFF',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4285F4',
                },
              }}
            >
              {PRIORITIES.map(priority => (
                <MenuItem key={priority.id} value={priority.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: priority.color }} />
                    {priority.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button 
            variant="contained" 
            fullWidth
            onClick={isEditing ? updateTask : addTask}
            sx={{ 
              mb: 3,
              bgcolor: '#4285F4',
              '&:hover': {
                bgcolor: '#1967D2',
              }
            }}
          >
            {isEditing ? "Update Task" : "Add Task"}
          </Button>

          {/* Filter Section */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#FFFFFF' }}>Filter by Category</InputLabel>
                  <Select
                    value={filterCategory}
                    label="Filter by Category"
                    onChange={(e) => setFilterCategory(e.target.value)}
                    sx={{
                      backgroundColor: '#2D2D2D',
                      color: '#FFFFFF',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4285F4',
                      },
                    }}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    {CATEGORIES.map(category => (
                      <MenuItem key={category.id} value={category.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: category.color }} />
                          {category.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#FFFFFF' }}>Filter by Priority</InputLabel>
                  <Select
                    value={filterPriority}
                    label="Filter by Priority"
                    onChange={(e) => setFilterPriority(e.target.value)}
                    sx={{
                      backgroundColor: '#2D2D2D',
                      color: '#FFFFFF',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4285F4',
                      },
                    }}
                  >
                    <MenuItem value="all">All Priorities</MenuItem>
                    {PRIORITIES.map(priority => (
                      <MenuItem key={priority.id} value={priority.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: priority.color }} />
                          {priority.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tasks">
              {(provided) => (
                <List {...provided.droppableProps} ref={provided.innerRef}>
                  {filteredTasks.map((task, index) => {
                    const category = CATEGORIES.find(c => c.id === task.category);
                    const priority = PRIORITIES.find(p => p.id === task.priority);
                    return (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <ListItem
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{ 
                              mb: 2,
                              p: 2,
                              borderRadius: 2,
                              bgcolor: '#2D2D2D',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                bgcolor: '#363636',
                                transform: 'translateY(-2px)',
                              },
                              transform: snapshot.isDragging ? "scale(1.02)" : "none",
                              opacity: task.completed ? 0.7 : 1,
                            }}
                            secondaryAction={
                              <Box sx={{ display: "flex", gap: 2 }}>
                                <IconButton 
                                  edge="end" 
                                  onClick={() => editTask(index)}
                                  sx={{ 
                                    color: '#4285F4',
                                    '&:hover': {
                                      color: '#1967D2',
                                    }
                                  }}
                                >
                                  <Edit />
                                </IconButton>
                                <IconButton 
                                  edge="end" 
                                  onClick={() => deleteTask(index)}
                                  sx={{ 
                                    color: '#4285F4',
                                    '&:hover': {
                                      color: '#1967D2',
                                    }
                                  }}
                                >
                                  <Delete />
                                </IconButton>
                              </Box>
                            }
                          >
                            <Checkbox
                              edge="start"
                              checked={task.completed}
                              onChange={() => toggleTask(index)}
                              icon={<RadioButtonUnchecked />}
                              checkedIcon={<CheckCircle />}
                              sx={{ 
                                color: '#4285F4',
                                '&.Mui-checked': {
                                  color: '#34A853',
                                },
                              }}
                            />
                            <ListItemText 
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                  <Typography 
                                    variant="body1" 
                                    sx={{ 
                                      color: task.completed ? 'rgba(255, 255, 255, 0.5)' : '#FFFFFF',
                                      textDecoration: task.completed ? 'line-through' : 'none',
                                      fontWeight: 500,
                                    }}
                                  >
                                    {task.text}
                                  </Typography>
                                  <Chip 
                                    label={category?.label || 'Other'} 
                                    size="small"
                                    sx={{ 
                                      bgcolor: `${category?.color}20`,
                                      color: category?.color,
                                      fontWeight: 500,
                                    }}
                                  />
                                  <Chip 
                                    label={priority?.label || 'Medium'} 
                                    size="small"
                                    sx={{ 
                                      bgcolor: `${priority?.color}20`,
                                      color: priority?.color,
                                      fontWeight: 500,
                                    }}
                                  />
                                  {task.dueDate && (
                                    <Chip 
                                      label={new Date(task.dueDate).toLocaleDateString()}
                                      size="small"
                                      sx={{ 
                                        bgcolor: 'rgba(66, 133, 244, 0.1)',
                                        color: '#4285F4',
                                        fontWeight: 500,
                                      }}
                                    />
                                  )}
                                </Box>
                              }
                            />
                          </ListItem>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
}
