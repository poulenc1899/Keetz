import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF0000', // Replace with Gumroad's primary color
    },
    secondary: {
      main: '#00FF00', // Replace with Gumroad's secondary color
    },
    error: {
      main: '#FFFF00', // Replace with Gumroad's error color
    },
    background: {
      default: '#E2E2E2', // Replace with Gumroad's background color
    },
  },
  typography: {
    // Define your typography here. For example:
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
});

export default theme;
