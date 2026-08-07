import { Routes, Route } from 'react-router-dom'
import Principal from './components/Principal'
import Login from './components/Login'
import Registro from './components/Registro'
import RecuperarPassword from './components/RecuperarPassword'
import CambiarPassword from './components/CambiarPassword'
import MiArmario from './components/MiArmario'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Principal />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/recuperar-password" element={<RecuperarPassword />} />
      <Route path="/cambiar-password/:uid/:token" element={<CambiarPassword />} />
      <Route path="/mi-armario" element={<MiArmario />} />
    </Routes>
  )
}

export default App