import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Divider,
  Button,
  InputAdornment,
  Collapse,
  Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useTaskContext } from '../../contexts/TaskContext';

const FilterPanel = () => {
  const { filters, setFilters, clearFilters, sortBy, setSort, categories } = useTaskContext();
  const [expanded, setExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [localSort, setLocalSort] = useState(sortBy);

  // Update local state when context changes
  useEffect(() => {
    setLocalFilters(filters);
    setLocalSort(sortBy);
  }, [filters, sortBy]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setLocalFilters(prev => ({ ...prev, searchTerm }));
    setFilters({ ...filters, searchTerm });
  };

  // Handle priority selection change
  const handlePriorityChange = (e) => {
    const priority = e.target.value;
    setLocalFilters(prev => ({ ...prev, priority }));
  };

  // Handle category selection change
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setLocalFilters(prev => ({ ...prev, category }));
  };

  // Handle due date filter change
  const handleDueDateChange = (e) => {
    const dueDate = e.target.value;
    setLocalFilters(prev => ({ ...prev, dueDate }));
  };

  // Handle sort field change
  const handleSortFieldChange = (e) => {
    const field = e.target.value;
    setLocalSort(prev => ({ ...prev, field }));
  };

  // Handle sort direction change
  const handleSortDirectionChange = (e) => {
    const direction = e.target.value;
    setLocalSort(prev => ({ ...prev, direction }));
  };

  // Apply filters and sort
  const applyFiltersAndSort = () => {
    setFilters(localFilters);
    setSort(localSort);
  };

  // Clear all filters and reset sort
  const handleClearAll = () => {
    clearFilters();
    setSort({ field: 'dueDate', direction: 'asc' });
  };

  // Toggle expanded state
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Paper elevation={1} sx={{ mb: 3, p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h6" component="div">
          <FilterListIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Filters & Sort
        </Typography>
        <IconButton onClick={toggleExpanded} size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* Search field - always visible */}
      <TextField
        fullWidth
        placeholder="Search tasks..."
        value={localFilters.searchTerm}
        onChange={handleSearchChange}
        margin="normal"
        variant="outlined"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: localFilters.searchTerm ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => {
                  setLocalFilters(prev => ({ ...prev, searchTerm: '' }));
                  setFilters({ ...filters, searchTerm: '' });
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null
        }}
      />

      {/* Expanded filter options */}
      <Collapse in={expanded}>
        <Box sx={{ mt: 2 }}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            <FilterListIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
            Filter Options
          </Typography>

          <Stack spacing={2} sx={{ mt: 1 }}>
            {/* Priority filter */}
            <FormControl fullWidth size="small">
              <InputLabel>Priority</InputLabel>
              <Select
                multiple
                value={localFilters.priority}
                onChange={handlePriorityChange}
                label="Priority"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip 
                        key={value} 
                        label={value.charAt(0).toUpperCase() + value.slice(1)} 
                        size="small" 
                      />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>

            {/* Category filter */}
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                multiple
                value={localFilters.category}
                onChange={handleCategoryChange}
                label="Category"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const category = categories.find(cat => cat.id === value);
                      return (
                        <Chip 
                          key={value} 
                          label={category ? category.name : value}
                          size="small"
                          sx={category ? { 
                            backgroundColor: `${category.color}20`,
                            color: category.color,
                            borderColor: category.color,
                            borderWidth: 1,
                            borderStyle: 'solid'
                          } : {}}
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          bgcolor: category.color,
                          mr: 1 
                        }} 
                      />
                      {category.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Due date filter */}
            <FormControl fullWidth size="small">
              <InputLabel>Due Date</InputLabel>
              <Select
                value={localFilters.dueDate || ''}
                onChange={handleDueDateChange}
                label="Due Date"
              >
                <MenuItem value="">Any time</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">This week</MenuItem>
                <MenuItem value="overdue">Overdue</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* Sort options */}
          <Typography variant="subtitle1" gutterBottom>
            <SortIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
            Sort Options
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={localSort.field}
                onChange={handleSortFieldChange}
                label="Sort By"
              >
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="dueDate">Due Date</MenuItem>
                <MenuItem value="priority">Priority</MenuItem>
                <MenuItem value="createdAt">Creation Date</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Direction</InputLabel>
              <Select
                value={localSort.direction}
                onChange={handleSortDirectionChange}
                label="Direction"
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
            <Button variant="outlined" onClick={handleClearAll}>
              Clear All
            </Button>
            <Button variant="contained" onClick={applyFiltersAndSort}>
              Apply
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default FilterPanel;