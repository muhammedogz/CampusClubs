import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ProSidebarProvider } from 'react-pro-sidebar';
import App from './App';
import theme from './utils/theme';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ProSidebarProvider>
        <App />
      </ProSidebarProvider>
    </ThemeProvider>
  </React.StrictMode>
);
