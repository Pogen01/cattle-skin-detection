import React from 'react'
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider
} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import Dashboard from './pages/Dashboard'

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    )
  )

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
