import { Box, Grid, Typography, Container, Paper } from '@mui/material';
import TaskProgressChart from './TaskProgressChart';
import TaskReminder from './TaskReminder';
import TaskCompletionTrend from './TaskCompletionTrend';
import ProductivityMetrics from './ProductivityMetrics';
import { useTaskContext } from '../../contexts/TaskContext';

const Dashboard = () => {
  const { tasks, categories } = useTaskContext();
  
  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
  const upcomingDeadlines = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);
    return dueDate >= today && dueDate <= threeDaysFromNow;
  }).length;

  // Calculate category distribution
  const categoryDistribution = categories.map(category => {
    const tasksInCategory = tasks.filter(task => task.category === category.id).length;
    return {
      ...category,
      taskCount: tasksInCategory,
      percentage: totalTasks > 0 ? Math.round((tasksInCategory / totalTasks) * 100) : 0
    };
  });

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Dashboard Overview
      </Typography>
      
      {/* Task Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}
          >
            <Typography variant="h3" color="primary.main" sx={{ fontWeight: 'bold' }}>{totalTasks}</Typography>
            <Typography variant="body1" color="text.secondary">Total Tasks</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}
          >
            <Typography variant="h3" color="success.main" sx={{ fontWeight: 'bold' }}>{completedTasks}</Typography>
            <Typography variant="body1" color="text.secondary">Completed Tasks</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}
          >
            <Typography variant="h3" color="error.main" sx={{ fontWeight: 'bold' }}>{highPriorityTasks}</Typography>
            <Typography variant="body1" color="text.secondary">High Priority</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}
          >
            <Typography variant="h3" color="warning.main" sx={{ fontWeight: 'bold' }}>{upcomingDeadlines}</Typography>
            <Typography variant="body1" color="text.secondary">Upcoming Deadlines</Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Task Progress and Productivity Metrics */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Task Progress Chart */}
            <TaskProgressChart />
            
            {/* Task Completion Trend */}
            <TaskCompletionTrend />
            
            {/* Productivity Metrics */}
            <ProductivityMetrics />
            
            {/* Task Reminders Section */}
            <TaskReminder />
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3,
              borderRadius: 2,
              height: '100%'
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Category Distribution
            </Typography>
            
            {categoryDistribution.map(category => (
              <Box key={category.id} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box 
                      sx={{ 
                        width: 16, 
                        height: 16, 
                        bgcolor: category.color, 
                        mr: 1.5, 
                        borderRadius: '50%',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Typography variant="subtitle2">{category.name}</Typography>
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                    {category.taskCount} ({category.percentage}%)
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    height: 10, 
                    bgcolor: 'background.default', 
                    borderRadius: 2,
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                  }}
                >
                  <Box 
                    sx={{ 
                      height: '100%', 
                      width: `${category.percentage}%`, 
                      bgcolor: category.color,
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      transition: 'width 0.3s ease-in-out'
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;