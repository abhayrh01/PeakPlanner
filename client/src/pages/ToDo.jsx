import { useState } from "react";
import { Container, TextField, Button, List, ListItem, ListItemText, IconButton, Checkbox, Typography, Paper } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { Link } from "react-router-dom";

function Todo() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const toggleTask = (index) => {
    setTasks(tasks.map((task, i) => (i === index ? { ...task, completed: !task.completed } : task)));
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <Container maxWidth="sm" className="container">
      <Paper elevation={3} className="paper">
        <Typography variant="h5" gutterBottom>To-Do List</Typography>
        <TextField
          label="New Task"
          variant="outlined"
          fullWidth
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTask()}
          sx={{ marginBottom: "10px", backgroundColor: "#333", borderRadius: "5px", input: { color: "#EAEAEA" } }}
        />
        <Button 
          variant="contained" 
          sx={{ backgroundColor: "#D4A373", color: "#2D2D2D", '&:hover': { backgroundColor: "#C48B65" } }}
          onClick={addTask}
        >
          Add Task
        </Button>

        <List>
          {tasks.map((task, index) => (
            <ListItem key={index} secondaryAction={
              <IconButton edge="end" color="secondary" onClick={() => deleteTask(index)}>
                <Delete />
              </IconButton>
            }>
              <Checkbox checked={task.completed} onChange={() => toggleTask(index)} />
              <ListItemText primary={task.text} style={{ textDecoration: task.completed ? "line-through" : "none", color: "#EAEAEA" }} />
            </ListItem>
          ))}
        </List>

        <Button component={Link} to="/" sx={{ marginTop: "20px", backgroundColor: "#58A6FF", color: "#121212", '&:hover': { backgroundColor: "#8AC7FF" } }}>
          Go Home
        </Button>
      </Paper>
    </Container>
  );
}

export default Todo;
