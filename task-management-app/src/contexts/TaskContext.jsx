import { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Create the context
const TaskContext = createContext();

// Initial state for the task reducer
const initialState = {
  tasks: JSON.parse(localStorage.getItem('tasks')) || [],
  columns: JSON.parse(localStorage.getItem('columns')) || {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: [],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: [],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: [],
    },
  },
  columnOrder: JSON.parse(localStorage.getItem('columnOrder')) || ['column-1', 'column-2', 'column-3'],
  categories: JSON.parse(localStorage.getItem('categories')) || [
    { id: 'cat-1', name: 'Work', color: '#4caf50' },
    { id: 'cat-2', name: 'Personal', color: '#2196f3' },
    { id: 'cat-3', name: 'Study', color: '#ff9800' },
    { id: 'cat-4', name: 'Health', color: '#f44336' },
  ],
  filters: JSON.parse(localStorage.getItem('filters')) || {
    searchTerm: '',
    priority: [],
    category: [],
    dueDate: null,
  },
  sortBy: JSON.parse(localStorage.getItem('sortBy')) || { field: 'dueDate', direction: 'asc' },
};

// Task reducer function
function taskReducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK': {
      const newTask = {
        id: uuidv4(),
        title: action.payload.title,
        description: action.payload.description,
        priority: action.payload.priority || 'medium',
        dueDate: action.payload.dueDate || null,
        category: action.payload.category || null,
        tags: action.payload.tags || [],
        createdAt: new Date().toISOString(),
        completed: false,
      };
      
      // Add the task to the "To Do" column by default
      const column = state.columns['column-1'];
      const newTaskIds = [...column.taskIds, newTask.id];
      
      return {
        ...state,
        tasks: [...state.tasks, newTask],
        columns: {
          ...state.columns,
          'column-1': {
            ...column,
            taskIds: newTaskIds,
          },
        },
      };
    }
    
    case 'UPDATE_TASK': {
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        ),
      };
    }
    
    case 'DELETE_TASK': {
      // Find which column contains the task
      let updatedColumns = { ...state.columns };
      
      // Remove the task ID from the column that contains it
      Object.keys(updatedColumns).forEach(columnId => {
        const column = updatedColumns[columnId];
        if (column.taskIds.includes(action.payload.id)) {
          updatedColumns[columnId] = {
            ...column,
            taskIds: column.taskIds.filter(id => id !== action.payload.id),
          };
        }
      });
      
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload.id),
        columns: updatedColumns,
      };
    }
    
    case 'REORDER_TASKS': {
      return {
        ...state,
        columns: action.payload.columns,
      };
    }
    
    case 'ADD_CATEGORY': {
      const newCategory = {
        id: `cat-${uuidv4()}`,
        name: action.payload.name,
        color: action.payload.color,
      };
      
      return {
        ...state,
        categories: [...state.categories, newCategory],
      };
    }
    
    case 'UPDATE_CATEGORY': {
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id === action.payload.id ? { ...category, ...action.payload } : category
        ),
      };
    }
    
    case 'DELETE_CATEGORY': {
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload.id),
        // Remove the category from tasks that have it
        tasks: state.tasks.map(task =>
          task.category === action.payload.id ? { ...task, category: null } : task
        ),
      };
    }
    
    case 'SET_FILTERS': {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    }
    
    case 'CLEAR_FILTERS': {
      return {
        ...state,
        filters: {
          searchTerm: '',
          priority: [],
          category: [],
          dueDate: null,
        },
      };
    }
    
    case 'SET_SORT': {
      return {
        ...state,
        sortBy: action.payload,
      };
    }
    
    default:
      return state;
  }
}

// Provider component
export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    localStorage.setItem('columns', JSON.stringify(state.columns));
    localStorage.setItem('columnOrder', JSON.stringify(state.columnOrder));
    localStorage.setItem('categories', JSON.stringify(state.categories));
    localStorage.setItem('filters', JSON.stringify(state.filters));
    localStorage.setItem('sortBy', JSON.stringify(state.sortBy));
  }, [state]);
  
  // Task actions
  const addTask = (task) => {
    dispatch({ type: 'ADD_TASK', payload: task });
  };
  
  const updateTask = (task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
  };
  
  const deleteTask = (id) => {
    dispatch({ type: 'DELETE_TASK', payload: { id } });
  };
  
  const reorderTasks = (columns) => {
    dispatch({ type: 'REORDER_TASKS', payload: { columns } });
  };
  
  const addCategory = (category) => {
    dispatch({ type: 'ADD_CATEGORY', payload: category });
  };
  
  const updateCategory = (category) => {
    dispatch({ type: 'UPDATE_CATEGORY', payload: category });
  };
  
  const deleteCategory = (id) => {
    dispatch({ type: 'DELETE_CATEGORY', payload: { id } });
  };
  
  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };
  
  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };
  
  const setSort = (sortBy) => {
    dispatch({ type: 'SET_SORT', payload: sortBy });
  };
  
  // Apply filters and sorting to tasks
  const getFilteredAndSortedTasks = () => {
    let filteredTasks = [...state.tasks];
    const { searchTerm, priority, category, dueDate } = state.filters;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(term) || 
        (task.description && task.description.toLowerCase().includes(term))
      );
    }
    
    // Apply priority filter
    if (priority && priority.length > 0) {
      filteredTasks = filteredTasks.filter(task => priority.includes(task.priority));
    }
    
    // Apply category filter
    if (category && category.length > 0) {
      filteredTasks = filteredTasks.filter(task => category.includes(task.category));
    }
    
    // Apply due date filter
    if (dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate === 'today') {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        filteredTasks = filteredTasks.filter(task => {
          if (!task.dueDate) return false;
          const taskDate = new Date(task.dueDate);
          return taskDate >= today && taskDate < tomorrow;
        });
      } else if (dueDate === 'week') {
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        filteredTasks = filteredTasks.filter(task => {
          if (!task.dueDate) return false;
          const taskDate = new Date(task.dueDate);
          return taskDate >= today && taskDate < nextWeek;
        });
      } else if (dueDate === 'overdue') {
        filteredTasks = filteredTasks.filter(task => {
          if (!task.dueDate) return false;
          const taskDate = new Date(task.dueDate);
          return taskDate < today;
        });
      }
    }
    
    // Apply sorting
    if (state.sortBy) {
      const { field, direction } = state.sortBy;
      
      filteredTasks.sort((a, b) => {
        // Handle null values
        if (a[field] === null && b[field] === null) return 0;
        if (a[field] === null) return 1;
        if (b[field] === null) return -1;
        
        let comparison = 0;
        
        if (field === 'dueDate' || field === 'createdAt') {
          // Date comparison
          comparison = new Date(a[field]) - new Date(b[field]);
        } else if (field === 'priority') {
          // Priority comparison (high > medium > low)
          const priorityValues = { high: 3, medium: 2, low: 1 };
          comparison = priorityValues[a[field]] - priorityValues[b[field]];
        } else {
          // String comparison
          comparison = a[field].localeCompare(b[field]);
        }
        
        return direction === 'asc' ? comparison : -comparison;
      });
    }
    
    return filteredTasks;
  };
  
  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        filteredTasks: getFilteredAndSortedTasks(),
        columns: state.columns,
        columnOrder: state.columnOrder,
        categories: state.categories,
        filters: state.filters,
        sortBy: state.sortBy,
        addTask,
        updateTask,
        deleteTask,
        reorderTasks,
        addCategory,
        updateCategory,
        deleteCategory,
        setFilters,
        clearFilters,
        setSort,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

// Custom hook to use the task context
export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}