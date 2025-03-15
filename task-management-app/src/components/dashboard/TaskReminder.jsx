import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Box,
  Alert,
  Collapse,
  IconButton
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CloseIcon from '@mui/icons-material/Close';
import { useTaskContext } from '../../contexts/TaskContext';
import { formatDate, isTaskOverdue } from '../../utils/taskUtils';

const TaskReminder = () => {
  const { tasks, categories } = useTaskContext();
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [showAlert, setShowAlert] = useState(true);

  // Find upcoming and overdue tasks
  useEffect(() => {
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);
    
    // Get upcoming tasks (due within the next 3 days)
    const upcoming = tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate <= threeDaysFromNow;
    });
    
    // Get overdue tasks
    const overdue = tasks.filter(task => {
      return isTaskOverdue(task);
    });
    
    setUpcomingTasks(upcoming);
    setOverdueTasks(overdue);
  }, [tasks]);

  // Get category color for a task
  const getCategoryColor = (categoryId) => {
    if (!categoryId) return '#757575';
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#757575';
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <NotificationsActiveIcon sx={{ mr: 1 }} />
        Task Reminders
      </Typography>
      
      {/* Alert for overdue tasks */}
      {overdueTasks.length > 0 && (
        <Collapse in={showAlert}>
          <Alert 
            severity="error"
            sx={{ mb: 2 }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setShowAlert(false)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            You have {overdueTasks.length} overdue {overdueTasks.length === 1 ? 'task' : 'tasks'}
          </Alert>
        </Collapse>
      )}
      
      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" color="error" gutterBottom>
            Overdue
          </Typography>
          <List dense disablePadding>
            {overdueTasks.map(task => (
              <ListItem 
                key={task.id}
                sx={{ 
                  mb: 1, 
                  bgcolor: 'background.default', 
                  borderRadius: 1,
                  borderLeft: 3,
                  borderColor: getCategoryColor(task.category)
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <AccessTimeIcon color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary={task.title}
                  secondary={formatDate(task.dueDate)}
                />
                <Chip 
                  label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  color={getPriorityColor(task.priority)}
                  size="small"
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      
      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 ? (
        <Box>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            Due Soon
          </Typography>
          <List dense disablePadding>
            {upcomingTasks.map(task => (
              <ListItem 
                key={task.id}
                sx={{ 
                  mb: 1, 
                  bgcolor: 'background.default', 
                  borderRadius: 1,
                  borderLeft: 3,
                  borderColor: getCategoryColor(task.category)
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <AccessTimeIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={task.title}
                  secondary={formatDate(task.dueDate)}
                />
                <Chip 
                  label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  color={getPriorityColor(task.priority)}
                  size="small"
                />
              </ListItem>
            ))}
          </List>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          No upcoming tasks due soon
        </Typography>
      )}
    </Paper>
  );
};

export default TaskReminder;