import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './context/ProtectedRoute';
import { Toaster } from './components/ui/sonner';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CaptureMemory from './pages/CaptureMemory';
import Timeline from './pages/Timeline';
import MemoryDetail from './pages/MemoryDetail';
import StoryMode from './pages/StoryMode';
import EmotionReplay from './pages/EmotionReplay';
import Search from './pages/Search';
import EmotionGraphs from './pages/EmotionGraphs';
import Insights from './pages/Insights';
import BrainMap from './pages/BrainMap';
import WhatIf from './pages/WhatIf';
import SharedMemories from './pages/SharedMemories';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/capture" element={<ProtectedRoute><CaptureMemory /></ProtectedRoute>} />
          <Route path="/timeline" element={<ProtectedRoute><Timeline /></ProtectedRoute>} />
          <Route path="/story-mode" element={<ProtectedRoute><StoryMode /></ProtectedRoute>} />
          <Route path="/emotion-replay" element={<ProtectedRoute><EmotionReplay /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/emotions" element={<ProtectedRoute><EmotionGraphs /></ProtectedRoute>} />
          <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
          <Route path="/brain-map" element={<ProtectedRoute><BrainMap /></ProtectedRoute>} />
          <Route path="/what-if/:id" element={<ProtectedRoute><WhatIf /></ProtectedRoute>} />
          <Route path="/shared" element={<ProtectedRoute><SharedMemories /></ProtectedRoute>} />
          <Route path="/memory/:id" element={<ProtectedRoute><MemoryDetail /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Toaster position="top-right" theme="dark" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
