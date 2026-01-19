import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import OwnerRegister from './pages/OwnerRegister';
import Contact from './pages/Contact';
import Register from './pages/Register';
import Careers from './pages/Careers';
import Platform from './pages/Platform';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/owner-register' element={<OwnerRegister />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/careers' element={<Careers />} />
        <Route path='/platform' element={<Platform />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
