import React from 'react';
import { useSelector } from 'react-redux';
import { Route as RouterRoute, Routes as RouterRoutes, Navigate as RouterNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';

// Lazy loading pages for clean architecture and code splitting
const Home = React.lazy(() => import('../pages/Home'));
const Login = React.lazy(() => import('../pages/Login'));
const Signup = React.lazy(() => import('../pages/Signup'));
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const Books = React.lazy(() => import('../pages/Books'));
const BookDetails = React.lazy(() => import('../pages/BookDetails'));
const ChapterReading = React.lazy(() => import('../pages/ChapterReading'));
const Notes = React.lazy(() => import('../pages/Notes'));
const Bookmarks = React.lazy(() => import('../pages/Bookmarks'));
const Profile = React.lazy(() => import('../pages/Profile'));
const Settings = React.lazy(() => import('../pages/Settings'));
const NotFound = React.lazy(() => import('../pages/NotFound'));

export const AppRoutes = () => {
  return (
    <RouterRoutes>
      {/* Auth Routes */}
      <RouterRoute element={<AuthLayout />}>
        <RouterRoute path="/login" element={<Login />} />
        <RouterRoute path="/signup" element={<Signup />} />
      </RouterRoute>

      {/* Main App Routes */}
      <RouterRoute element={<MainLayout />}>
        <RouterRoute path="/" element={<Home />} />
        
        {/* Protected Routes */}
        <RouterRoute path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <RouterRoute path="/notes" element={
          <ProtectedRoute>
            <Notes />
          </ProtectedRoute>
        } />
        <RouterRoute path="/bookmarks" element={
          <ProtectedRoute>
            <Bookmarks />
          </ProtectedRoute>
        } />
        <RouterRoute path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Public/Semi-protected reading routes */}
        <RouterRoute path="/books" element={<Books />} />
        <RouterRoute path="/books/:id" element={<BookDetails />} />
        <RouterRoute path="/books/:id/chapter/:chapterId" element={<ChapterReading />} />
        
        <RouterRoute path="/settings" element={<Settings />} />
        
        {/* 404 Route */}
        <RouterRoute path="/404" element={<NotFound />} />
        <RouterRoute path="*" element={<RouterNavigate to="/404" replace />} />
      </RouterRoute>
    </RouterRoutes>
  );
};

export default AppRoutes;
