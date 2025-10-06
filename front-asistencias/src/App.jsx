/* import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css' 
import Home from './pages/home/Home'
import Login from './modules/auth/pages/login/Login'
import Registrarse from './modules/auth/pages/registro/registrarse' 
*/
import IndexRoutes from './modules/routes/indexRoutes';

/* const AppLayout = () => {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registrarse />} />
      </Routes>
    </div>
  )
} */


/* function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
} */
function App() {
  return (
    <IndexRoutes />
  )
}

export default App
