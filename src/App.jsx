import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import SignUpPage from './pages/auth/SignUpPage';
import SignInPage from './pages/auth/SignInPage';
import ActivationInstructionsPage from './pages/auth/ActivationInstructionsPage';
import ActivationStatusPage from './pages/auth/ActivationStatusPage';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors theme="light" />
      <Routes>
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/activation-instructions" element={<ActivationInstructionsPage />} />
        <Route path="/activation-status" element={<ActivationStatusPage />} />
        
        {/* Redirect root to sign-in for now, or dashboard if we had one */}
        <Route path="/" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
