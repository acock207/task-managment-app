import { useState, useEffect } from 'react';
import { Box, Paper, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useTaskContext } from '../../contexts/TaskContext';

const TaskProgressChart = () => {
  const { tasks, columns } = useTaskContext();
  const [chartType, setChartType] = useState('bar');
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    completionRate: 0,
  });

  useEffect(() => {
    const todoTasks = columns['column-1']?.taskIds.length || 0;
    const inProgressTasks = columns['column-2']?.taskIds.length || 0;
    const doneTasks = columns['column-3']?.taskIds.length || 0;
    const totalTasks = todoTasks + inProgressTasks + doneTasks;
    
    const completionRate = totalTasks > 0 
      ? Math.round((doneTasks / totalTasks) * 100) 
      : 0;

    setStats({
      total: totalTasks,
      todo: todoTasks,
      inProgress: inProgressTasks,
      done: doneTasks,
      completionRate,
    });
  }, [tasks, columns]);

  const handleChartTypeChange = (event, newType) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  const getBarWidth = (count) => {
    return stats.total > 0 ? `${(count / stats.total) * 100}%` : '0%';
  };

  const renderBarChart = () => (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2">To Do</Typography>
        <Typography variant="body2">{stats.todo}</Typography>
      </Box>
      <Box 
        sx={{ 
          height: 20, 
          bgcolor: '#e0e0e0', 
          borderRadius: 1, 
          mb: 2,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            height: '100%', 
            width: getBarWidth(stats.todo), 
            bgcolor: '#90caf9',
            position: 'absolute',
            left: 0,
            top: 0,
            transition: 'width 0.8s ease-in-out'
          }}
        />
      </Box>

      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2">In Progress</Typography>
        <Typography variant="body2">{stats.inProgress}</Typography>
      </Box>
      <Box 
        sx={{ 
          height: 20, 
          bgcolor: '#e0e0e0', 
          borderRadius: 1, 
          mb: 2,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            height: '100%', 
            width: getBarWidth(stats.inProgress), 
            bgcolor: '#ffb74d',
            position: 'absolute',
            left: 0,
            top: 0,
            transition: 'width 0.8s ease-in-out'
          }}
        />
      </Box>

      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2">Done</Typography>
        <Typography variant="body2">{stats.done}</Typography>
      </Box>
      <Box 
        sx={{ 
          height: 20, 
          bgcolor: '#e0e0e0', 
          borderRadius: 1, 
          mb: 2,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            height: '100%', 
            width: getBarWidth(stats.done), 
            bgcolor: '#66bb6a',
            position: 'absolute',
            left: 0,
            top: 0,
            transition: 'width 0.8s ease-in-out'
          }}
        />
      </Box>
    </Box>
  );

  const renderPieChart = () => {
    const todoAngle = stats.total > 0 ? (stats.todo / stats.total) * 360 : 0;
    const inProgressAngle = stats.total > 0 ? (stats.inProgress / stats.total) * 360 : 0;
    const doneAngle = stats.total > 0 ? (stats.done / stats.total) * 360 : 0;
    
    return (
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box 
          sx={{ 
            width: 150, 
            height: 150, 
            borderRadius: '50%',
            background: stats.total === 0
              ? '#e0e0e0'
              : `conic-gradient(
                  #66bb6a 0deg ${doneAngle}deg, 
                  #ffb74d ${doneAngle}deg ${doneAngle + inProgressAngle}deg, 
                  #90caf9 ${doneAngle + inProgressAngle}deg 360deg
                )`,
            mb: 2,
            transition: 'transform 0.8s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-2px)' }
            }}
          >
            <Box sx={{ width: 12, height: 12, bgcolor: '#90caf9', mr: 1, borderRadius: 1 }} />
            <Typography variant="body2">To Do ({stats.todo})</Typography>
          </Box>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-2px)' }
            }}
          >
            <Box sx={{ width: 12, height: 12, bgcolor: '#ffb74d', mr: 1, borderRadius: 1 }} />
            <Typography variant="body2">In Progress ({stats.inProgress})</Typography>
          </Box>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-2px)' }
            }}
          >
            <Box sx={{ width: 12, height: 12, bgcolor: '#66bb6a', mr: 1, borderRadius: 1 }} />
            <Typography variant="body2">Done ({stats.done})</Typography>
          </Box>
        </Box>
      </Box>
    );
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
        <Typography variant="h6">Task Progress</Typography>
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          size="small"
        >
          <ToggleButton value="bar">Bar</ToggleButton>
          <ToggleButton value="pie">Pie</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="body1">Total Tasks: {stats.total}</Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: stats.completionRate > 75 ? 'success.main' : 
                  stats.completionRate > 25 ? 'warning.main' : 'error.main',
            transition: 'color 0.3s ease'
          }}
        >
          Completion: {stats.completionRate}%
        </Typography>
      </Box>

      {chartType === 'bar' ? renderBarChart() : renderPieChart()}
    </Paper>
  );
};

export default TaskProgressChart;