import { Paper, Typography, Box } from '@mui/material';
import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';

const TaskColumn = ({ column, tasks, onEditTask }) => {
  return (
    <Box sx={{ width: '100%', minWidth: 280, maxWidth: { xs: '100%', sm: 350 } }}>
      <Paper 
        elevation={1} 
        sx={{ 
          p: 2, 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          bgcolor: 'background.paper'
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2, 
            fontWeight: 'bold',
            textAlign: 'center',
            pb: 1,
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          {column.title}
        </Typography>
        
        <Droppable droppableId={column.id}>
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{ 
                flexGrow: 1,
                minHeight: 100,
                overflowY: 'auto',
                px: 0.5
              }}
            >
              {tasks.map((task, index) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  index={index} 
                  onEdit={onEditTask}
                />
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </Paper>
    </Box>
  );
};

export default TaskColumn;