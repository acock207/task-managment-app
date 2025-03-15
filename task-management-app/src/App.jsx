import { useState, useCallback } from 'react';
import { CssBaseline, Container, Box, createTheme, ThemeProvider, Grid } from '@mui/material';
import { DragDropContext } from 'react-beautiful-dnd';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import TaskColumn from './components/tasks/TaskColumn';
import TaskDialog from './components/tasks/TaskDialog';
import FilterPanel from './components/tasks/FilterPanel';
import CategoryManager from './components/tasks/CategoryManager';
import DashboardPage from './pages/DashboardPage';
import { TaskProvider, useTaskContext } from './contexts/TaskContext';
import './App.css';

function TaskBoard() {
  const { filteredTasks, columns, columnOrder, reorderTasks } = useTaskContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Create theme based on dark mode preference
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#90caf9' : '#1976d2',
      },
      secondary: {
        main: darkMode ? '#f48fb1' : '#dc004e',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
  });

  // Toggle between light and dark mode
  const toggleTheme = useCallback(() => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  }, []);

  // Open dialog to add a new task
  const openTaskDialog = useCallback(() => {
    setCurrentTask(null);
    setDialogOpen(true);
  }, []);

  // Open dialog to edit an existing task
  const handleEditTask = useCallback((task) => {
    setCurrentTask(task);
    setDialogOpen(true);
  }, []);

  // Close the task dialog
  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setCurrentTask(null);
  }, []);

  // Handle drag and drop of tasks
  const handleDragEnd = useCallback((result) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or the item was dropped back in its original position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Create a copy of the columns to update
    const updatedColumns = { ...columns };
    
    // Remove the task from the source column
    const sourceColumn = updatedColumns[source.droppableId];
    const sourceTaskIds = [...sourceColumn.taskIds];
    sourceTaskIds.splice(source.index, 1);
    
    // Add the task to the destination column
    const destinationColumn = updatedColumns[destination.droppableId];
    const destinationTaskIds = [...destinationColumn.taskIds];
    destinationTaskIds.splice(destination.index, 0, draggableId);
    
    // Update the columns with the new task IDs
    updatedColumns[source.droppableId] = {
      ...sourceColumn,
      taskIds: sourceTaskIds,
    };
    
    updatedColumns[destination.droppableId] = {
      ...destinationColumn,
      taskIds: destinationTaskIds,
    };
    
    // Update the state with the new columns
    reorderTasks(updatedColumns);
  }, [columns, reorderTasks]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header 
          toggleTheme={toggleTheme} 
          darkMode={darkMode} 
          openTaskDialog={openTaskDialog} 
        />
        
        <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4 }}>
          <FilterPanel />
          <CategoryManager />
          <DragDropContext onDragEnd={handleDragEnd}>
            <Grid container spacing={2} sx={{ height: '100%' }}>
              {columnOrder.map((columnId) => {
                const column = columns[columnId];
                const columnTasks = column.taskIds.map(taskId => 
                  filteredTasks.find(task => task.id === taskId)
                ).filter(Boolean);
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={column.id}>
                    <TaskColumn 
                      column={column} 
                      tasks={columnTasks} 
                      onEditTask={handleEditTask} 
                    />
                  </Grid>
                );
              })}
            </Grid>
          </DragDropContext>
        </Container>
      </Box>
      
      <TaskDialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        task={currentTask} 
      />
    </ThemeProvider>
  );
}

function App() {
  return (
    <TaskProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TaskBoard />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </TaskProvider>
  );
}

export default App;
