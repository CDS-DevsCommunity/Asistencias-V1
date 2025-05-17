import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Registrarse from './pages/registrarse/registrarse'


const AppLayout = () => {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registrarse />} />
      </Routes>
    </div>
  )
}


function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

export default App
