import { useState, useEffect } from "react";
import { Container, TextField, Button, List, ListItem, ListItemText, IconButton, Typography, Paper, Select, MenuItem, FormControl, InputLabel, Chip, Box } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import LoadingSkeleton from '../components/LoadingSkeleton';

const CATEGORIES = [
  { id: 'work', label: 'Work', color: '#FF6B6B' },
  { id: 'personal', label: 'Personal', color: '#4ECDC4' },
  { id: 'ideas', label: 'Ideas', color: '#FFD166' },
  { id: 'study', label: 'Study', color: '#06D6A0' },
  { id: 'other', label: 'Other', color: '#A78BFA' }
];

function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newNote, setNewNote] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('other');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const savedNotes = localStorage.getItem("peakplanner_notes");
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
      } catch (error) {
        console.error("Error parsing notes:", error);
      }
    }
    setLoading(false);
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("peakplanner_notes", JSON.stringify(notes));
    }
  }, [notes]);

  const addNote = () => {
    if (newNote.trim()) {
      const newNoteObject = { 
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        title: newTitle.trim() || "Untitled", 
        text: newNote.trim(),
        category: selectedCategory
      };
      setNotes([...notes, newNoteObject]);
      setNewTitle("");
      setNewNote("");
      setIsTyping(false); // Reset typing state after saving
    }
  };

  const deleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

  const handleTyping = (e) => {
    setNewNote(e.target.value);
    setIsTyping(e.target.value.trim() !== "");
  };

  const editNote = (index) => {
    setNewTitle(notes[index].title);
    setNewNote(notes[index].text);
    setSelectedCategory(notes[index].category);
    setIsEditing(true);
    setEditIndex(index);
  };

  const updateNote = () => {
    const updatedNotes = [...notes];
    updatedNotes[editIndex] = { 
      ...updatedNotes[editIndex],
      title: newTitle.trim() || "Untitled", 
      text: newNote.trim(),
      category: selectedCategory
    };
    setNotes(updatedNotes);
    setNewTitle("");
    setNewNote("");
    setIsEditing(false);
    setEditIndex(null);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(notes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setNotes(items);
  };

  const filteredNotes = notes.filter(note => {
    const matchesCategory = filterCategory === 'all' || note.category === filterCategory;
    const matchesSearch = searchQuery === '' || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Notes
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Capture your thoughts and ideas
        </Typography>
      </Box>

      {/* Note Input Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search notes..."
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

        {/* Title Section */}
        <TextField
          label="Note Title"
          variant="outlined"
          fullWidth
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          sx={{
            marginBottom: "10px", 
            backgroundColor: "#fff", 
            borderRadius: "5px", 
            input: { 
              color: "#121212",
              fontSize: "1.1rem",
              fontWeight: "500"
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#ccc',
              },
              '&:hover fieldset': {
                borderColor: '#FFD700',
              },
            },
          }}
        />

        {/* Note Content */}
        <TextField
          label="Note Content"
          variant="outlined"
          multiline
          rows={6}
          fullWidth
          value={newNote}
          onChange={handleTyping}
          sx={{
            marginBottom: "10px", 
            backgroundColor: "#fff", 
            borderRadius: "5px", 
            textarea: { 
              color: "#121212"
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#ccc',
              },
              '&:hover fieldset': {
                borderColor: '#FFD700',
              },
            },
          }}
        />

        {/* Add/Update Button */}
        <Button 
          variant="contained" 
          sx={{ backgroundColor: "#D4A373", color: "#2D2D2D", '&:hover': { backgroundColor: "#C48B65" } }}
          onClick={isEditing ? updateNote : addNote}
        >
          {isEditing ? "Update Note" : "Add Note"}
        </Button>
      </Paper>

      {/* Notes List */}
      {loading ? (
        <LoadingSkeleton type="note" count={5} />
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="notes">
            {(provided) => (
              <List {...provided.droppableProps} ref={provided.innerRef}>
                {filteredNotes.map((note, index) => {
                  const category = CATEGORIES.find(c => c.id === note.category);
                  return (
                    <Draggable key={note.id} draggableId={note.id} index={index}>
                      {(provided, snapshot) => (
                        <ListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{ 
                            mb: 2, 
                            bgcolor: snapshot.isDragging ? "#3D3D3D" : "#2D2D2D", 
                            p: 2, 
                            borderRadius: "8px",
                            cursor: "grab",
                            "&:active": {
                              cursor: "grabbing"
                            },
                            transform: snapshot.isDragging ? "scale(1.02)" : "none",
                            transition: "all 0.2s ease",
                            borderLeft: `4px solid ${category?.color || '#A78BFA'}`
                          }}
                          secondaryAction={
                            <div style={{ display: "flex", gap: "16px" }}>
                              <IconButton edge="end" color="primary" onClick={() => editNote(index)}>
                                <Edit />
                              </IconButton>
                              <IconButton edge="end" color="error" onClick={() => deleteNote(index)}>
                                <Delete />
                              </IconButton>
                            </div>
                          }
                        >
                          <ListItemText 
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="h6" sx={{ color: "#FFD700" }}>
                                  {note.title}
                                </Typography>
                                <Chip 
                                  label={category?.label || 'Other'} 
                                  size="small"
                                  sx={{ 
                                    bgcolor: category?.color || '#A78BFA',
                                    color: '#121212',
                                    fontWeight: 'bold'
                                  }}
                                />
                              </Box>
                            }
                            secondary={
                              <Typography variant="body1" sx={{ color: "#EAEAEA" }}>
                                {note.text}
                              </Typography>
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
      )}
    </Container>
  );
}

export default Notes;
