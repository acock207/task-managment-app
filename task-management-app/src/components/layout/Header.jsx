import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, useTheme, useMediaQuery, Tabs, Tab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useTaskContext } from '../../contexts/TaskContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = ({ toggleTheme, darkMode, openTaskDialog }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(location.pathname === '/dashboard' ? 1 : 0);
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue === 0 ? '/' : '/dashboard');
  };

  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ mr: 2 }}>
          Task Manager
        </Typography>
        
        <Tabs 
          value={value} 
          onChange={handleChange} 
          sx={{ flexGrow: 1 }}
          textColor="inherit"
          indicatorColor="secondary"
        >
          <Tab icon={<ListAltIcon />} label={isMobile ? '' : 'Tasks'} iconPosition="start" />
          <Tab icon={<DashboardIcon />} label={isMobile ? '' : 'Dashboard'} iconPosition="start" />
        </Tabs>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {location.pathname !== '/dashboard' && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={openTaskDialog}
              size={isMobile ? 'small' : 'medium'}
            >
              {isMobile ? 'Add' : 'Add Task'}
            </Button>
          )}
          
          <IconButton onClick={toggleTheme} color="inherit">
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;