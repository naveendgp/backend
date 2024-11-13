import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProjectDashboard from './components/ProjectDashboard';
import ScheduleProjects from './components/ScheduleProjects';

// Define your routes using createBrowserRouter
const router = createBrowserRouter(
  [
    { path: "/", element: <Home /> },
    { path: "/register", element: <Register /> },
    { path: "/login", element: <Login /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/project-dashboard", element: <ProjectDashboard /> },
    { path: "/schedule/:projectId", element: <ScheduleProjects /> },
  ],
  {
    future: {
      v7_startTransition: true,             // Opt-in to startTransition behavior
      v7_relativeSplatPath: true,           // Opt-in to relative splat path behavior
      v7_fetcherPersist: true,              // Opt-in to fetcher persistence behavior
      v7_normalizeFormMethod: true,         // Opt-in to normalize formMethod casing
      v7_partialHydration: true,            // Opt-in to partial hydration behavior
      v7_skipActionErrorRevalidation: true,
       // Opt-in to skip action error revalidation behavior
    },
  }
);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} /> {/* Use RouterProvider to provide the router */}
    </AuthProvider>
  );
}

export default App;
