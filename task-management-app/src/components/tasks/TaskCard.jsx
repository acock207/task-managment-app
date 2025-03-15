import { useState } from 'react';
import { Card, CardContent, CardActions, Typography, Chip, IconButton, Box, Menu, MenuItem, ListItemIcon, ListItemText, Stack } from '@mui/material';
import { format } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LabelIcon from '@mui/icons-material/Label';
import { useTaskContext } from '../../contexts/TaskContext';
import { Draggable } from 'react-beautiful-dnd';

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'success';
    default:
      return 'default';
  }
};

const TaskCard = ({ task, index, onEdit }) => {
  const { deleteTask, categories } = useTaskContext();
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleEdit = () => {
    handleMenuClose();
    onEdit(task);
  };
  
  const handleDelete = () => {
    handleMenuClose();
    deleteTask(task.id);
  };
  
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <Card 
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{ 
            mb: 2, 
            position: 'relative',
            '&:hover': { boxShadow: 3 }
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                {task.title}
              </Typography>
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {task.description}
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Chip 
                  label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} 
                  color={getPriorityColor(task.priority)} 
                  size="small" 
                  sx={{ mr: 1 }}
                />
                
                {task.dueDate && (
                  <Typography variant="caption" color="text.secondary">
                    Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                  </Typography>
                )}
              </Box>
              
              {task.category && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  {categories.map(cat => {
                    if (cat.id === task.category) {
                      return (
                        <Chip
                          key={cat.id}
                          label={cat.name}
                          size="small"
                          sx={{ 
                            backgroundColor: `${cat.color}20`, // Add transparency
                            color: cat.color,
                            borderColor: cat.color,
                            borderWidth: 1,
                            borderStyle: 'solid'
                          }}
                          icon={<LabelIcon style={{ color: cat.color }} />}
                        />
                      );
                    }
                    return null;
                  }).filter(Boolean)}
                </Box>
              )}
              
              {task.tags && task.tags.length > 0 && (
                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
                  {task.tags.map((tag, i) => (
                    <Chip
                      key={i}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        height: 20, 
                        '& .MuiChip-label': { 
                          px: 1,
                          fontSize: '0.625rem'
                        } 
                      }}
                    />
                  ))}
                </Stack>
              )}
            </Box>
          </CardContent>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleDelete}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu>
        </Card>
      )}
    </Draggable>
  );
};

export default TaskCard;