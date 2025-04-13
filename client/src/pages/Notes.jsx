import { useState, useEffect } from "react";
import { Container, TextField, Button, List, ListItem, ListItemText, IconButton, Typography, Paper, Select, MenuItem, FormControl, InputLabel, Chip, Box, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import { Delete, Edit, FormatBold, FormatItalic, FormatUnderlined, FormatListBulleted, FormatListNumbered, FormatQuote, Code, Link, Title, FormatAlignLeft, FormatAlignCenter, FormatAlignRight, FormatColorText, FormatSize } from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const CATEGORIES = [
  { id: 'work', label: 'Work', color: '#FF6B6B' },
  { id: 'personal', label: 'Personal', color: '#4ECDC4' },
  { id: 'ideas', label: 'Ideas', color: '#FFD166' },
  { id: 'study', label: 'Study', color: '#06D6A0' },
  { id: 'other', label: 'Other', color: '#A78BFA' }
];

function Notes() {
  const [notes, setNotes] = useState([]);
  const [newTitle, setNewTitle] = useState(""); // Title for new note
  const [newNote, setNewNote] = useState(""); // Body for new note
  const [selectedCategory, setSelectedCategory] = useState('other');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false); // Track if user is typing
  const [isEditing, setIsEditing] = useState(false); // Track if editing an existing note
  const [editIndex, setEditIndex] = useState(null); // Track which note is being edited
  const [formatting, setFormatting] = useState({
    bold: false,
    italic: false,
    underline: false,
    list: 'none', // 'none', 'bullet', 'number'
    align: 'left', // 'left', 'center', 'right'
    size: 'normal', // 'small', 'normal', 'large'
    color: '#000000'
  });

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

  const handleFormatChange = (format, value) => {
    setFormatting(prev => ({
      ...prev,
      [format]: value
    }));
  };

  const getTextStyle = () => {
    return {
      fontWeight: formatting.bold ? 'bold' : 'normal',
      fontStyle: formatting.italic ? 'italic' : 'normal',
      textDecoration: formatting.underline ? 'underline' : 'none',
      textAlign: formatting.align,
      fontSize: formatting.size === 'small' ? '0.875rem' : 
               formatting.size === 'large' ? '1.25rem' : '1rem',
      color: formatting.color
    };
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
    <Container maxWidth="sm" sx={{ mt: 3 }}>
      <Paper elevation={3} sx={{ p: 3, bgcolor: "#121212", color: "#EAEAEA" }}>
        <Typography variant="h5" gutterBottom>Your Notes</Typography>

        {/* Search Bar */}
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
              color: "#121212",
              ...getTextStyle()
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

        {/* Formatting Toolbar */}
        <Paper 
          elevation={1} 
          sx={{ 
            p: 1, 
            mb: 2, 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1,
            bgcolor: '#2D2D2D',
            borderRadius: '4px'
          }}
        >
          <ToggleButtonGroup size="small" exclusive>
            <Tooltip title="Bold">
              <ToggleButton 
                value="bold" 
                selected={formatting.bold}
                onClick={() => handleFormatChange('bold', !formatting.bold)}
                sx={{ color: '#EAEAEA' }}
              >
                <FormatBold />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Italic">
              <ToggleButton 
                value="italic" 
                selected={formatting.italic}
                onClick={() => handleFormatChange('italic', !formatting.italic)}
                sx={{ color: '#EAEAEA' }}
              >
                <FormatItalic />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Underline">
              <ToggleButton 
                value="underline" 
                selected={formatting.underline}
                onClick={() => handleFormatChange('underline', !formatting.underline)}
                sx={{ color: '#EAEAEA' }}
              >
                <FormatUnderlined />
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>

          <ToggleButtonGroup size="small" exclusive>
            <Tooltip title="Bullet List">
              <ToggleButton 
                value="bullet" 
                selected={formatting.list === 'bullet'}
                onClick={() => handleFormatChange('list', formatting.list === 'bullet' ? 'none' : 'bullet')}
                sx={{ color: '#EAEAEA' }}
              >
                <FormatListBulleted />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Numbered List">
              <ToggleButton 
                value="number" 
                selected={formatting.list === 'number'}
                onClick={() => handleFormatChange('list', formatting.list === 'number' ? 'none' : 'number')}
                sx={{ color: '#EAEAEA' }}
              >
                <FormatListNumbered />
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>

          <ToggleButtonGroup size="small" exclusive>
            <Tooltip title="Align Left">
              <ToggleButton 
                value="left" 
                selected={formatting.align === 'left'}
                onClick={() => handleFormatChange('align', 'left')}
                sx={{ color: '#EAEAEA' }}
              >
                <FormatAlignLeft />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Align Center">
              <ToggleButton 
                value="center" 
                selected={formatting.align === 'center'}
                onClick={() => handleFormatChange('align', 'center')}
                sx={{ color: '#EAEAEA' }}
              >
                <FormatAlignCenter />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Align Right">
              <ToggleButton 
                value="right" 
                selected={formatting.align === 'right'}
                onClick={() => handleFormatChange('align', 'right')}
                sx={{ color: '#EAEAEA' }}
              >
                <FormatAlignRight />
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>

          <ToggleButtonGroup size="small" exclusive>
            <Tooltip title="Small Text">
              <ToggleButton 
                value="small" 
                selected={formatting.size === 'small'}
                onClick={() => handleFormatChange('size', 'small')}
                sx={{ color: '#EAEAEA' }}
              >
                <FormatSize />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Normal Text">
              <ToggleButton 
                value="normal" 
                selected={formatting.size === 'normal'}
                onClick={() => handleFormatChange('size', 'normal')}
                sx={{ color: '#EAEAEA' }}
              >
                <Title />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Large Text">
              <ToggleButton 
                value="large" 
                selected={formatting.size === 'large'}
                onClick={() => handleFormatChange('size', 'large')}
                sx={{ color: '#EAEAEA' }}
              >
                <FormatSize />
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>
        </Paper>

        {/* Add/Update Button */}
        <Button 
          variant="contained" 
          sx={{ backgroundColor: "#D4A373", color: "#2D2D2D", '&:hover': { backgroundColor: "#C48B65" } }}
          onClick={isEditing ? updateNote : addNote}
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
      </Paper>
    </Container>
  );
}

export default Notes;
