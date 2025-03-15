/**
 * Utility functions for task management
 */

import { format, isToday, isTomorrow, isThisWeek, isPast } from 'date-fns';

/**
 * Format a date string into a human-readable format
 * @param {string} dateString - ISO date string
 * @param {string} formatStr - Format string for date-fns
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, formatStr = 'MMM d, yyyy') => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return format(date, formatStr);
};

/**
 * Get a relative date description (Today, Tomorrow, etc.)
 * @param {string} dateString - ISO date string
 * @returns {string} Relative date description
 */
export const getRelativeDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isThisWeek(date)) return format(date, 'EEEE'); // Day name
  
  return format(date, 'MMM d, yyyy');
};

/**
 * Check if a task is overdue
 * @param {Object} task - Task object
 * @returns {boolean} True if task is overdue
 */
export const isTaskOverdue = (task) => {
  if (!task.dueDate || task.completed) return false;
  
  const dueDate = new Date(task.dueDate);
  return isPast(dueDate) && !isToday(dueDate);
};

/**
 * Get a numeric value for priority for sorting
 * @param {string} priority - Priority level (low, medium, high)
 * @returns {number} Numeric priority value
 */
export const getPriorityValue = (priority) => {
  switch (priority) {
    case 'high': return 3;
    case 'medium': return 2;
    case 'low': return 1;
    default: return 0;
  }
};

/**
 * Sort tasks by various criteria
 * @param {Array} tasks - Array of task objects
 * @param {Object} sortBy - Sort configuration { field, direction }
 * @returns {Array} Sorted tasks array
 */
export const sortTasks = (tasks, sortBy) => {
  if (!tasks || !sortBy) return tasks;
  
  const { field, direction } = sortBy;
  const multiplier = direction === 'asc' ? 1 : -1;
  
  return [...tasks].sort((a, b) => {
    switch (field) {
      case 'dueDate':
        // Handle null dates
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return multiplier;
        if (!b.dueDate) return -multiplier;
        return multiplier * (new Date(a.dueDate) - new Date(b.dueDate));
        
      case 'priority':
        return multiplier * (getPriorityValue(a.priority) - getPriorityValue(b.priority));
        
      case 'title':
        return multiplier * a.title.localeCompare(b.title);
        
      case 'createdAt':
        return multiplier * (new Date(a.createdAt) - new Date(b.createdAt));
        
      default:
        return 0;
    }
  });
};

/**
 * Filter tasks based on filter criteria
 * @param {Array} tasks - Array of task objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered tasks array
 */
export const filterTasks = (tasks, filters) => {
  if (!tasks || !filters) return tasks;
  
  return tasks.filter(task => {
    // Search term filter
    if (filters.searchTerm && !task.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) && 
        !task.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    // Priority filter
    if (filters.priority && filters.priority.length > 0 && 
        !filters.priority.includes(task.priority)) {
      return false;
    }
    
    // Category filter
    if (filters.category && filters.category.length > 0 && 
        !filters.category.includes(task.category)) {
      return false;
    }
    
    // Due date filter
    if (filters.dueDate) {
      if (!task.dueDate) return false;
      
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      switch (filters.dueDate) {
        case 'today':
          return isToday(dueDate);
        case 'tomorrow':
          return isTomorrow(dueDate);
        case 'thisWeek':
          return isThisWeek(dueDate);
        case 'overdue':
          return isPast(dueDate) && !isToday(dueDate);
        default:
          return true;
      }
    }
    
    return true;
  });
};