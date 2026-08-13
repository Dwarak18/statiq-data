import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
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
import { Advertising } from './pages/Advertising';
import { AboutNexDatalytix } from './pages/AboutNexDatalytix';

export default function App() {
  // Subdomain detection: check exact hostname matches for nexdatalytix domain or subdomain parameter
  const hostname = typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : '';
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const isNexDatalytixSubdomain =
    hostname === 'nexdatalytix.com' ||
    hostname === 'www.nexdatalytix.com' ||
    hostname.endsWith('.nexdatalytix.com') ||
    hostname.startsWith('nexdatalytix.') ||
    searchParams.get('subdomain') === 'nexdatalytix';

  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={isNexDatalytixSubdomain ? <AboutNexDatalytix /> : <Home />}
            />
            <Route path="/nexdatalytix" element={<AboutNexDatalytix />} />
            <Route path="/about-nexdatalytix" element={<AboutNexDatalytix />} />
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
            <Route path="/advertising" element={<Advertising />} />
            <Route path="*" element={isNexDatalytixSubdomain ? <AboutNexDatalytix /> : <Home />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}

