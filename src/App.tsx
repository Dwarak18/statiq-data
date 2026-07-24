import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Dataset } from './pages/Dataset';
import { Company } from './pages/Company';
import { Industry } from './pages/Industry';
import { Country } from './pages/Country';
import { Search } from './pages/Search';
import { Statistics } from './pages/Statistics';
import { Workspace } from './pages/Workspace';
import { Pricing } from './pages/Pricing';
import { AuthPage } from './pages/Auth';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dataset" element={<Dataset />} />
          <Route path="/company" element={<Company />} />
          <Route path="/industry" element={<Industry />} />
          <Route path="/country" element={<Country />} />
          <Route path="/search" element={<Search />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/pricing" element={<Pricing />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
