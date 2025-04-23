import { useState, useEffect } from "react";
import { Container, TextField, Button, List, ListItem, ListItemText, IconButton, Typography, Paper, Select, MenuItem, FormControl, InputLabel, Chip, Box, Fade } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { COLORS } from "../theme";

const CATEGORIES = [
  { id: 'work', label: 'Work', color: COLORS.primary },
  { id: 'personal', label: 'Personal', color: COLORS.secondary },
  { id: 'ideas', label: 'Ideas', color: COLORS.warning },
  { id: 'study', label: 'Study', color: COLORS.success },
  { id: 'other', label: 'Other', color: COLORS.highlight }
];

function Notes() {
  const [notes, setNotes] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newNote, setNewNote] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('other');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Load saved notes from localStorage when the page loads
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem("peakplanner_notes");
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        // Ensure each note has an ID
        const notesWithIds = parsedNotes.map(note => ({
          ...note,
          id: note.id || Date.now() + Math.random().toString(36).substr(2, 9)
        }));
        setNotes(notesWithIds);
      }
    } catch (error) {
      console.error("Error loading notes from localStorage", error);
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      try {
        localStorage.setItem("peakplanner_notes", JSON.stringify(notes));
      } catch (error) {
        console.error("Error saving notes to localStorage", error);
      }
    } else {
      localStorage.removeItem("peakplanner_notes");
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
    <Fade in={true} timeout={800}>
      <Container maxWidth="sm" sx={{ mt: 3, mb: 3 }}>
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
              fontWeight: 600,
              mb: 3,
              background: `linear-gradient(45deg, ${COLORS.primary}, ${COLORS.secondary})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Your Notes
          </Typography>

          {/* Search Bar */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search notes..."
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

          {/* Category Filter */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="filter-category-label">Filter by Category</InputLabel>
            <Select
              labelId="filter-category-label"
              value={filterCategory}
              label="Filter by Category"
              onChange={(e) => setFilterCategory(e.target.value)}
              sx={{
                backgroundColor: '#2D2D2D',
                color: '#FFFFFF !important',
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

          {/* Category Selection */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={selectedCategory}
              label="Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
              sx={{
                backgroundColor: '#2D2D2D',
                color: '#FFFFFF !important',
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

          {/* Title Section */}
          <TextField
            label="Note Title"
            variant="outlined"
            fullWidth
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
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

          {/* Add/Update Button */}
          <Button 
            variant="contained" 
            fullWidth
            onClick={isEditing ? updateNote : addNote}
            sx={{ 
              mb: 3,
              background: `linear-gradient(45deg, ${COLORS.primary}, ${COLORS.secondary})`,
              '&:hover': {
                background: `linear-gradient(45deg, ${COLORS.secondary}, ${COLORS.primary})`,
              }
            }}
          >
            {isEditing ? "Update Note" : "Add Note"}
          </Button>

          {/* Display Notes */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="notes">
              {(provided) => (
                <List {...provided.droppableProps} ref={provided.innerRef}>
                  {filteredNotes.map((note, index) => {
                    const category = CATEGORIES.find(c => c.id === note.category);
                    return (
                      <Draggable key={note.id} draggableId={note.id} index={index}>
                        {(provided, snapshot) => (
                          <Fade in={true} timeout={300}>
                            <ListItem
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{ 
                                mb: 2,
                                borderRadius: 2,
                                border: `1px solid ${COLORS.border}`,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                  transform: 'translateY(-1px)',
                                },
                                transform: snapshot.isDragging ? "scale(1.02)" : "none",
                              }}
                              secondaryAction={
                                <Box sx={{ display: "flex", gap: 2 }}>
                                  <IconButton 
                                    edge="end" 
                                    onClick={() => editNote(index)}
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
                                    onClick={() => deleteNote(index)}
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
                              <ListItemText 
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography 
                                      variant="h6" 
                                      sx={{ 
                                        color: COLORS.text,
                                        fontWeight: 600,
                                      }}
                                    >
                                      {note.title}
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
                                  </Box>
                                }
                                secondary={
                                  <Typography 
                                    variant="body1" 
                                    sx={{ 
                                      color: COLORS.textSecondary,
                                      mt: 1,
                                      lineHeight: 1.6,
                                    }}
                                  >
                                    {note.text}
                                  </Typography>
                                }
                              />
                            </ListItem>
                          </Fade>
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
    </Fade>
  );
}

export default Notes;
