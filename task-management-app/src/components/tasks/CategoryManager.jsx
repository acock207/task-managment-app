import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Tooltip,
  Collapse,
  InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useTaskContext } from '../../contexts/TaskContext';
import { ChromePicker } from 'react-color';

const CategoryManager = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useTaskContext();
  const [expanded, setExpanded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryColor, setCategoryColor] = useState('#4caf50');
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [nameError, setNameError] = useState(false);

  // Toggle expanded state
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Open dialog to add a new category
  const openAddDialog = () => {
    setEditMode(false);
    setCurrentCategory(null);
    setCategoryName('');
    setCategoryColor('#4caf50');
    setNameError(false);
    setDialogOpen(true);
  };

  // Open dialog to edit an existing category
  const openEditDialog = (category) => {
    setEditMode(true);
    setCurrentCategory(category);
    setCategoryName(category.name);
    setCategoryColor(category.color);
    setNameError(false);
    setDialogOpen(true);
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setColorPickerOpen(false);
  };

  // Handle color change
  const handleColorChange = (color) => {
    setCategoryColor(color.hex);
  };

  // Toggle color picker
  const toggleColorPicker = () => {
    setColorPickerOpen(!colorPickerOpen);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!categoryName.trim()) {
      setNameError(true);
      return;
    }

    const categoryData = {
      name: categoryName.trim(),
      color: categoryColor,
    };

    if (editMode && currentCategory) {
      updateCategory({ ...categoryData, id: currentCategory.id });
    } else {
      addCategory(categoryData);
    }

    handleCloseDialog();
  };

  // Handle category deletion
  const handleDeleteCategory = (categoryId) => {
    deleteCategory(categoryId);
  };

  return (
    <Paper elevation={1} sx={{ mb: 3, p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h6" component="div">
          Categories
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={openAddDialog}
            size="small"
            sx={{ mr: 1 }}
          >
            Add
          </Button>
          <IconButton onClick={toggleExpanded} size="small">
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <List sx={{ mt: 1 }}>
          {categories.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
              No categories yet. Add one to get started!
            </Typography>
          ) : (
            categories.map((category) => (
              <ListItem key={category.id} sx={{ borderRadius: 1, mb: 1, bgcolor: 'background.default' }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    bgcolor: category.color,
                    mr: 2,
                    border: '1px solid rgba(0,0,0,0.1)'
                  }}
                />
                <ListItemText primary={category.name} />
                <ListItemSecondaryAction>
                  <Tooltip title="Edit">
                    <IconButton edge="end" onClick={() => openEditDialog(category)} size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton edge="end" onClick={() => handleDeleteCategory(category.id)} size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          )}
        </List>
      </Collapse>

      {/* Category Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{editMode ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              autoFocus
              label="Category Name"
              fullWidth
              value={categoryName}
              onChange={(e) => {
                setCategoryName(e.target.value);
                if (e.target.value.trim()) setNameError(false);
              }}
              error={nameError}
              helperText={nameError ? 'Category name is required' : ''}
            />

            <TextField
              label="Color"
              fullWidth
              value={categoryColor}
              onClick={toggleColorPicker}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '4px',
                        bgcolor: categoryColor,
                        border: '1px solid rgba(0,0,0,0.1)',
                        cursor: 'pointer'
                      }}
                      onClick={toggleColorPicker}
                    />
                  </InputAdornment>
                ),
                readOnly: true,
              }}
            />

            {colorPickerOpen && (
              <Box sx={{ mt: 1, mb: 2 }}>
                <ChromePicker
                  color={categoryColor}
                  onChange={handleColorChange}
                  disableAlpha
                  styles={{
                    default: {
                      picker: {
                        width: '100%',
                        boxShadow: 'none',
                        border: '1px solid rgba(0,0,0,0.1)',
                      },
                    },
                  }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CategoryManager;