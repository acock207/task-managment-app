import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Divider,
  LinearProgress,
  Chip,
  Grid,
  Tooltip,
  Fade
} from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import { useTaskContext } from '../../contexts/TaskContext';
import { differenceInDays, addDays } from 'date-fns';

const ProductivityMetrics = () => {
  const { tasks } = useTaskContext();
  const [metrics, setMetrics] = useState({
    avgCompletionTime: 0,
    taskCompletionRate: 0,
    taskEfficiency: 0,
    productivityScore: 0,
    highPriorityCompletion: 0,
    forecastedCompletion: 0
  });

  useEffect(() => {
    if (tasks.length === 0) return;

    // Calculate metrics
    const completedTasks = tasks.filter(task => task.completed);
    const highPriorityTasks = tasks.filter(task => task.priority === 'high');
    const completedHighPriorityTasks = highPriorityTasks.filter(task => task.completed);
    
    // Task completion rate
    const completionRate = Math.round((completedTasks.length / tasks.length) * 100);
    
    // High priority completion rate
    const highPriorityRate = highPriorityTasks.length > 0 ?
      Math.round((completedHighPriorityTasks.length / highPriorityTasks.length) * 100) : 0;
    
    // Average completion time (in days)
    let avgTime = 0;
    if (completedTasks.length > 0) {
      const completionTimes = completedTasks.map(task => {
        if (!task.createdAt) return 0;
        const createdDate = new Date(task.createdAt);
        const completedDate = task.completedAt ? new Date(task.completedAt) : new Date();
        return Math.max(0, differenceInDays(completedDate, createdDate));
      });
      avgTime = Math.round(completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length);
    }
    
    // Task efficiency (tasks completed per day over the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentlyCompletedTasks = completedTasks.filter(task => {
      if (!task.completedAt) return false;
      const completedDate = new Date(task.completedAt);
      return completedDate >= thirtyDaysAgo;
    });
    
    const efficiency = Math.round((recentlyCompletedTasks.length / 30) * 10) / 10;
    
    // Calculate forecasted completion date for remaining tasks
    const remainingTasks = tasks.filter(task => !task.completed).length;
    const forecastedDays = efficiency > 0 ? Math.ceil(remainingTasks / efficiency) : 0;
    const forecastedDate = addDays(new Date(), forecastedDays);
    
    // Overall productivity score (weighted average of other metrics)
    const productivityScore = Math.round(
      (completionRate * 0.4) + 
      (highPriorityRate * 0.3) + 
      (Math.min(100, efficiency * 20) * 0.3)
    );
    
    setMetrics({
      avgCompletionTime: avgTime,
      taskCompletionRate: completionRate,
      taskEfficiency: efficiency,
      productivityScore: productivityScore,
      highPriorityCompletion: highPriorityRate,
      forecastedCompletion: forecastedDays
    });
  }, [tasks]);

  // Get color based on score
  const getScoreColor = (score) => {
    if (score >= 75) return 'success';
    if (score >= 50) return 'warning';
    return 'error';
  };

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <SpeedIcon sx={{ mr: 1 }} />
        Productivity Metrics
      </Typography>
      
      {/* Productivity Score with Animation */}
      <Fade in={true} timeout={1000}>
        <Box sx={{ mb: 3, mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Overall Productivity Score
          </Typography>
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <Box
              sx={{
                position: 'relative',
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: `conic-gradient(
                  ${metrics.productivityScore >= 75 ? '#4caf50' : 
                    metrics.productivityScore >= 50 ? '#ff9800' : '#f44336'} 
                    ${metrics.productivityScore * 3.6}deg, 
                  #e0e0e0 ${metrics.productivityScore * 3.6}deg 360deg
                )`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'all 0.8s ease-in-out',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'background.paper',
                }
              }}
            >
              <Typography 
                variant="h4" 
                component="div" 
                sx={{ 
                  position: 'relative', 
                  fontWeight: 'bold',
                  color: metrics.productivityScore >= 75 ? 'success.main' : 
                        metrics.productivityScore >= 50 ? 'warning.main' : 'error.main'
                }}
              >
                {metrics.productivityScore}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Fade>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Detailed Metrics with Animations */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Tooltip title="Percentage of all tasks that have been completed" arrow>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Task Completion</Typography>
                <Typography variant="body2">{metrics.taskCompletionRate}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={metrics.taskCompletionRate} 
                color={getScoreColor(metrics.taskCompletionRate)}
                sx={{ 
                  height: 8, 
                  borderRadius: 1,
                  '& .MuiLinearProgress-bar': {
                    transition: 'transform 1.5s ease-in-out'
                  }
                }}
              />
            </Box>
          </Tooltip>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Tooltip title="Percentage of high priority tasks that have been completed" arrow>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">High Priority Completion</Typography>
                <Typography variant="body2">{metrics.highPriorityCompletion}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={metrics.highPriorityCompletion} 
                color={getScoreColor(metrics.highPriorityCompletion)}
                sx={{ 
                  height: 8, 
                  borderRadius: 1,
                  '& .MuiLinearProgress-bar': {
                    transition: 'transform 1.5s ease-in-out'
                  }
                }}
              />
            </Box>
          </Tooltip>
        </Grid>
      </Grid>
      
      {/* Additional Metrics with Forecast */}
      <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', mt: 2 }}>
        <Tooltip title="Average number of days to complete a task" arrow>
          <Chip 
            label={`Avg. Completion: ${metrics.avgCompletionTime} days`} 
            color={metrics.avgCompletionTime <= 3 ? 'success' : metrics.avgCompletionTime <= 7 ? 'warning' : 'error'}
            sx={{ m: 0.5 }}
          />
        </Tooltip>
        
        <Tooltip title="Average number of tasks completed per day (last 30 days)" arrow>
          <Chip 
            label={`Efficiency: ${metrics.taskEfficiency} tasks/day`} 
            color={metrics.taskEfficiency >= 1 ? 'success' : metrics.taskEfficiency >= 0.5 ? 'warning' : 'error'}
            sx={{ m: 0.5 }}
          />
        </Tooltip>

        <Tooltip title="Estimated days to complete all remaining tasks at current efficiency" arrow>
          <Chip 
            label={`Forecast: ${metrics.forecastedCompletion} days remaining`}
            color={metrics.forecastedCompletion <= 7 ? 'success' : metrics.forecastedCompletion <= 14 ? 'warning' : 'error'}
            sx={{ m: 0.5 }}
          />
        </Tooltip>
      </Box>
    </Paper>
  );
};

export default ProductivityMetrics;