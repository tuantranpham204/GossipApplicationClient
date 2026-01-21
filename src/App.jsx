import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import AnimatedBackground from './components/ui/AnimatedBackground';
import SignUpPage from './pages/auth/SignUpPage';
import SignInPage from './pages/auth/SignInPage';
import ActivationInstructionsPage from './pages/auth/ActivationInstructionsPage';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AnimatedBackground />
      <Toaster position="top-center" richColors theme="dark" />
      <Routes>
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/activation-instructions" element={<ActivationInstructionsPage />} />
        
        {/* Redirect root to sign-in for now, or dashboard if we had one */}
        <Route path="/" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
