import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  Fade
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useTaskContext } from '../../contexts/TaskContext';
import { format, subDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

const TaskCompletionTrend = () => {
  const { tasks } = useTaskContext();
  const [timeRange, setTimeRange] = useState('week');
  const [trendData, setTrendData] = useState([]);
  const [completionRate, setCompletionRate] = useState(0);

  const handleTimeRangeChange = (event, newRange) => {
    if (newRange !== null) {
      setTimeRange(newRange);
    }
  };

  useEffect(() => {
    const today = new Date();
    let days = 7;
    let dateFormat = 'EEE';
    
    if (timeRange === 'month') {
      days = 30;
      dateFormat = 'MMM d';
    } else if (timeRange === 'twoWeeks') {
      days = 14;
      dateFormat = 'MMM d';
    }

    const dates = Array.from({ length: days }, (_, i) => {
      const date = subDays(today, days - i - 1);
      return {
        date,
        label: format(date, dateFormat),
        completed: 0,
        created: 0
      };
    });

    tasks.forEach(task => {
      if (task.createdAt) {
        const createdDate = new Date(task.createdAt);
        const dateIndex = dates.findIndex(d => 
          isWithinInterval(createdDate, { 
            start: startOfDay(d.date), 
            end: endOfDay(d.date) 
          })
        );
        if (dateIndex !== -1) {
          dates[dateIndex].created++;
        }
      }

      if (task.completed) {
        const completedDate = task.completedAt ? new Date(task.completedAt) : new Date();
        const dateIndex = dates.findIndex(d => 
          isWithinInterval(completedDate, { 
            start: startOfDay(d.date), 
            end: endOfDay(d.date) 
          })
        );
        if (dateIndex !== -1) {
          dates[dateIndex].completed++;
        }
      }
    });

    const totalCreated = dates.reduce((sum, date) => sum + date.created, 0);
    const totalCompleted = dates.reduce((sum, date) => sum + date.completed, 0);
    const rate = totalCreated > 0 ? Math.round((totalCompleted / totalCreated) * 100) : 0;
    
    setTrendData(dates);
    setCompletionRate(rate);
  }, [tasks, timeRange]);

  const maxValue = Math.max(
    ...trendData.map(d => Math.max(d.completed, d.created)),
    1
  );

  const getBarHeight = (value) => {
    return `${(value / maxValue) * 100}%`;
  };

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 2, 
        mb: 3,
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <TrendingUpIcon sx={{ mr: 1 }} />
          Task Completion Trend
        </Typography>
        <ToggleButtonGroup
          value={timeRange}
          exclusive
          onChange={handleTimeRangeChange}
          size="small"
        >
          <ToggleButton value="week">Week</ToggleButton>
          <ToggleButton value="twoWeeks">2 Weeks</ToggleButton>
          <ToggleButton value="month">Month</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Fade in={true} timeout={800}>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body1">Time Period: {timeRange === 'week' ? 'Last 7 days' : timeRange === 'twoWeeks' ? 'Last 14 days' : 'Last 30 days'}</Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: completionRate > 75 ? 'success.main' : 
                      completionRate > 25 ? 'warning.main' : 'error.main',
                transition: 'color 0.3s ease'
              }}
            >
              Completion Rate: {completionRate}%
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 2 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-2px)' }
              }}
            >
              <Box sx={{ width: 12, height: 12, bgcolor: '#4caf50', mr: 1, borderRadius: 1 }} />
              <Typography variant="body2">Completed</Typography>
            </Box>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-2px)' }
              }}
            >
              <Box sx={{ width: 12, height: 12, bgcolor: '#2196f3', mr: 1, borderRadius: 1 }} />
              <Typography variant="body2">Created</Typography>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            height: 200, 
            justifyContent: 'space-between', 
            alignItems: 'flex-end',
            borderBottom: 1,
            borderColor: 'divider',
            pt: 2
          }}>
            {trendData.map((day, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  width: `${100 / trendData.length}%`,
                  opacity: 0,
                  animation: 'fadeIn 0.5s ease-out forwards',
                  animationDelay: `${index * 0.1}s`,
                  '@keyframes fadeIn': {
                    from: { opacity: 0, transform: 'translateY(20px)' },
                    to: { opacity: 1, transform: 'translateY(0)' }
                  }
                }}
              >
                <Box sx={{ display: 'flex', width: '100%', height: '100%', justifyContent: 'center', position: 'relative' }}>
                  <Tooltip title={`${day.completed} completed`} arrow placement="top">
                    <Box 
                      sx={{ 
                        width: '30%', 
                        height: getBarHeight(day.completed), 
                        bgcolor: '#4caf50',
                        borderTopLeftRadius: 2,
                        borderTopRightRadius: 2,
                        mr: 0.5,
                        transition: 'height 0.8s ease-in-out'
                      }} 
                    />
                  </Tooltip>
                  
                  <Tooltip title={`${day.created} created`} arrow placement="top">
                    <Box 
                      sx={{ 
                        width: '30%', 
                        height: getBarHeight(day.created), 
                        bgcolor: '#2196f3',
                        borderTopLeftRadius: 2,
                        borderTopRightRadius: 2,
                        ml: 0.5,
                        transition: 'height 0.8s ease-in-out'
                      }} 
                    />
                  </Tooltip>
                </Box>
                <Typography variant="caption" sx={{ mt: 0.5, fontSize: '0.7rem' }}>
                  {day.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Fade>
    </Paper>
  );
};

export default TaskCompletionTrend;