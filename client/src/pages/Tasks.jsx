import { useState, useEffect } from "react";
import { 
  Container, Button, List, ListItem, ListItemText, IconButton, Typography, Paper, Checkbox, TextField, Box, Chip, FormControl, InputLabel, Select, MenuItem, Grid, ToggleButton, ToggleButtonGroup, Tooltip
} from "@mui/material";
import { Delete, Edit, CalendarToday, PriorityHigh, ViewList, GridView } from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import LoadingSkeleton from '../components/LoadingSkeleton';

const CATEGORIES = [
  { id: 'work', label: 'Work', color: '#FF6B6B' },
  { id: 'personal', label: 'Personal', color: '#4ECDC4' },
  { id: 'ideas', label: 'Ideas', color: '#FFD166' },
  { id: 'study', label: 'Study', color: '#06D6A0' },
  { id: 'other', label: 'Other', color: '#A78BFA' }
];

const PRIORITIES = [
  { id: 'high', label: 'High', color: '#FF6B6B', icon: <PriorityHigh /> },
  { id: 'medium', label: 'Medium', color: '#FFD166', icon: <PriorityHigh /> },
  { id: 'low', label: 'Low', color: '#06D6A0', icon: <PriorityHigh /> }
];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newTask, setNewTask] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('other');
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [sortBy, setSortBy] = useState('none'); // Changed default to 'none'
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // Changed default to 'grid'

  useEffect(() => {
    const savedTasks = localStorage.getItem("peakplanner_tasks");
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks);
      } catch (error) {
        console.error("Error parsing tasks:", error);
      }
    }
    setLoading(false);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("peakplanner_tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { 
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        title: newTitle.trim() || "Untitled", 
        body: newTask.trim(),
        completed: false,
        category: selectedCategory,
        priority: selectedPriority,
        dueDate: dueDate ? dueDate.toISOString() : null
      }]);
      setNewTitle("");
      setNewTask("");
      setDueDate(null);
    }
  };

  const editTask = (taskId) => {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;
    
    setNewTitle(tasks[taskIndex].title);
    setNewTask(tasks[taskIndex].body);
    setSelectedCategory(tasks[taskIndex].category);
    setSelectedPriority(tasks[taskIndex].priority);
    setDueDate(tasks[taskIndex].dueDate ? new Date(tasks[taskIndex].dueDate) : null);
    setIsEditing(true);
    setEditIndex(taskIndex);
  };

  const updateTask = () => {
    const updatedTasks = [...tasks];
    updatedTasks[editIndex] = { 
      ...updatedTasks[editIndex],
      title: newTitle.trim() || "Untitled", 
      body: newTask.trim(),
      category: selectedCategory,
      priority: selectedPriority,
      dueDate: dueDate ? dueDate.toISOString() : null
    };
    setTasks(updatedTasks);
    setNewTitle("");
    setNewTask("");
    setDueDate(null);
    setIsEditing(false);
    setEditIndex(null);
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { label: 'Overdue', color: '#FF6B6B' };
    if (diffDays === 0) return { label: 'Due Today', color: '#FFD166' };
    if (diffDays <= 3) return { label: 'Due Soon', color: '#FFD166' };
    return { label: 'On Track', color: '#06D6A0' };
  };

  const sortedAndFilteredTasks = [...tasks]
    .filter(task => {
      const matchesCategory = filterCategory === 'all' || filterCategory === 'none' || task.category === filterCategory;
      const matchesPriority = filterPriority === 'all' || filterPriority === 'none' || task.priority === filterPriority;
      const matchesSearch = searchQuery === '' || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.body.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesPriority && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'none') return 0;
      if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === 'date') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    });

  const renderTaskItem = (task, index) => {
    const category = CATEGORIES.find(c => c.id === task.category);
    const priority = PRIORITIES.find(p => p.id === task.priority);
    const dueDateStatus = getDueDateStatus(task.dueDate);

    const taskContent = (
      <Box
        sx={{
          p: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#2D2D2D',
          borderRadius: '8px',
          borderLeft: `4px solid ${category?.color || '#A78BFA'}`,
          position: 'relative'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Checkbox
            checked={task.completed}
            onChange={() => toggleTaskCompletion(task.id)}
            sx={{ color: '#EAEAEA' }}
          />
          <Typography 
            variant="h6" 
            sx={{ 
              color: "#FFD700",
              textDecoration: task.completed ? "line-through" : "none",
              opacity: task.completed ? 0.7 : 1,
              flexGrow: 1
            }}
          >
            {task.title}
          </Typography>
        </Box>

        <Typography 
          variant="body2" 
          sx={{ 
            color: "#EAEAEA",
            textDecoration: task.completed ? "line-through" : "none",
            opacity: task.completed ? 0.7 : 1,
            mb: 2,
            flexGrow: 1
          }}
        >
          {task.body}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {priority && (
            <Chip 
              label={priority.label} 
              size="small"
              sx={{ 
                bgcolor: priority.color,
                color: '#121212',
                fontWeight: 'bold',
                opacity: task.completed ? 0.7 : 1
              }}
            />
          )}
          {dueDateStatus && (
            <Chip 
              label={dueDateStatus.label} 
              size="small"
              sx={{ 
                bgcolor: dueDateStatus.color,
                color: '#121212',
                fontWeight: 'bold',
                opacity: task.completed ? 0.7 : 1
              }}
            />
          )}
        </Box>

        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          <IconButton 
            size="small" 
            onClick={() => editTask(task.id)}
            sx={{ color: '#EAEAEA' }}
          >
            <Edit />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => deleteTask(task.id)}
            sx={{ color: '#EAEAEA' }}
          >
            <Delete />
          </IconButton>
        </Box>
      </Box>
    );

    if (viewMode === 'list') {
      return (
        <Draggable key={task.id} draggableId={task.id} index={index}>
          {(provided, snapshot) => (
            <ListItem
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              sx={{ 
                mb: 2, 
                p: 0,
                cursor: "grab",
                "&:active": {
                  cursor: "grabbing"
                },
                transform: snapshot.isDragging ? "scale(1.02)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              {taskContent}
            </ListItem>
          )}
        </Draggable>
      );
    } else {
      return (
        <Grid item xs={12} sm={6} md={4}>
          <Draggable key={task.id} draggableId={task.id} index={index}>
            {(provided, snapshot) => (
              <Box
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                sx={{
                  cursor: "grab",
                  "&:active": {
                    cursor: "grabbing"
                  },
                  transform: snapshot.isDragging ? "scale(1.02)" : "none",
                  transition: "all 0.2s ease",
                  height: '100%'
                }}
              >
                {taskContent}
              </Box>
            )}
          </Draggable>
        </Grid>
      );
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Paper elevation={3} sx={{ p: 3, bgcolor: "#1F1F1F", color: "#EAEAEA" }}>
          <Typography variant="h5" gutterBottom>Your Tasks</Typography>

          {/* Search Bar */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              mb: 2,
              backgroundColor: "#fff", 
              borderRadius: "5px", 
              input: { color: "#121212" },
              border: "none",
              '& .MuiOutlinedInput-root': {
                backgroundColor: "#fff",
                '& fieldset': {
                  border: 'none',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#666666',
                opacity: 1,
              },
            }}
            InputProps={{
              startAdornment: (
                <Box sx={{ color: '#121212', mr: 1, fontSize: '1.2rem' }}>
                  🔍
                </Box>
              ),
            }}
          />

          {/* Category Filter */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="filter-category-label" sx={{ color: '#EAEAEA' }}>Filter by Category</InputLabel>
            <Select
              labelId="filter-category-label"
              value={filterCategory}
              label="Filter by Category"
              onChange={(e) => setFilterCategory(e.target.value)}
              sx={{ 
                color: '#EAEAEA',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#EAEAEA',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FFD700',
                },
              }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="none">No Filter</MenuItem>
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

          {/* Priority Filter */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="filter-priority-label" sx={{ color: '#EAEAEA' }}>Filter by Priority</InputLabel>
            <Select
              labelId="filter-priority-label"
              value={filterPriority}
              label="Filter by Priority"
              onChange={(e) => setFilterPriority(e.target.value)}
              sx={{ 
                color: '#EAEAEA',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#EAEAEA',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FFD700',
                },
              }}
            >
              <MenuItem value="all">All Priorities</MenuItem>
              <MenuItem value="none">No Filter</MenuItem>
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

          {/* Sort By */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="sort-by-label" sx={{ color: '#EAEAEA' }}>Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
              sx={{ 
                color: '#EAEAEA',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#EAEAEA',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FFD700',
                },
              }}
            >
              <MenuItem value="none">Default Order</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
              <MenuItem value="date">Due Date</MenuItem>
            </Select>
          </FormControl>

          {/* Task Title */}
          <input
            type="text"
            placeholder="Task Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
          />

          {/* Task Body */}
          <textarea
            placeholder="Task Description"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            style={{
              width: "100%",
              minHeight: "80px",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "16px",
              backgroundColor: "#fff",
              color: "#121212",
              outline: "none",
              resize: "none",
              boxSizing: "border-box"
            }}
          ></textarea>

          {/* Due Date Picker */}
          <DatePicker
            label="Due Date"
            value={dueDate}
            onChange={(newValue) => setDueDate(newValue)}
            sx={{
              width: '100%',
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: "#fff",
                '& fieldset': {
                  borderColor: '#ccc',
                },
              },
            }}
          />

          {/* Category Selection */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="category-label" sx={{ color: '#EAEAEA' }}>Category</InputLabel>
            <Select
              labelId="category-label"
              value={selectedCategory}
              label="Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
              sx={{ 
                color: '#EAEAEA',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#EAEAEA',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FFD700',
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

          {/* Priority Selection */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="priority-label" sx={{ color: '#EAEAEA' }}>Priority</InputLabel>
            <Select
              labelId="priority-label"
              value={selectedPriority}
              label="Priority"
              onChange={(e) => setSelectedPriority(e.target.value)}
              sx={{ 
                color: '#EAEAEA',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#EAEAEA',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FFD700',
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

          {/* Add/Update Button */}
          <Button 
            variant="contained" 
            sx={{ backgroundColor: "#D4A373", color: "#2D2D2D", '&:hover': { backgroundColor: "#C48B65" } }}
            onClick={isEditing ? updateTask : addTask}
          >
            {isEditing ? "Update Task" : "Add Task"}
          </Button>

          {/* View Toggle Buttons */}
          <Box 
            sx={{ 
              display: 'flex',
              justifyContent: 'flex-end',
              mb: 2,
              mt: 3
            }}
          >
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newView) => newView && setViewMode(newView)}
              size="small"
              sx={{
                bgcolor: '#2D2D2D',
                borderRadius: '8px',
                p: 0.5,
                '& .MuiToggleButton-root': {
                  color: '#EAEAEA',
                  '&.Mui-selected': {
                    bgcolor: '#D4A373',
                    color: '#121212',
                    '&:hover': {
                      bgcolor: '#C48B65',
                    }
                  },
                  '&:hover': {
                    bgcolor: '#3D3D3D',
                  }
                }
              }}
            >
              <Tooltip title="List View">
                <ToggleButton value="list">
                  <ViewList />
                </ToggleButton>
              </Tooltip>
              <Tooltip title="Grid View">
                <ToggleButton value="grid">
                  <GridView />
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>
          </Box>

          {/* Tasks List/Grid */}
          {loading ? (
            <LoadingSkeleton type="task" count={5} />
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              {viewMode === 'list' ? (
                <List>
                  <Droppable droppableId="tasks">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {sortedAndFilteredTasks.map((task, index) => renderTaskItem(task, index))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </List>
              ) : (
                <Grid container spacing={2}>
                  <Droppable droppableId="tasks">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} style={{ width: '100%' }}>
                        {sortedAndFilteredTasks.map((task, index) => renderTaskItem(task, index))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </Grid>
              )}
            </DragDropContext>
          )}
        </Paper>
      </Container>
    </LocalizationProvider>
  );
}
