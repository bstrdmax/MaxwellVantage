import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './src/contexts/AuthContext';

// Find the root DOM element where the React app will be mounted.
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Create a React root for concurrent rendering.
const root = ReactDOM.createRoot(rootElement);

// Render the application.
// React.StrictMode is a wrapper that helps with highlighting potential problems in an application.
// AuthProvider wraps the entire app, making authentication state available to all components.
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);