// ThemeProvider.js

import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';


const theme = {
    breakpoints: {
      small: '576px',
      medium: '768px',
      large: '991.50px',
      xlarge: '1200px',
    },
  };


const ThemeProvider = ({ children }) => (
  <StyledThemeProvider theme={theme}>
    {children}
  </StyledThemeProvider>
);

export default ThemeProvider;