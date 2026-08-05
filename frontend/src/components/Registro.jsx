import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import tituloImg from '../assets/gaturro.png'
import fondoImg from '../assets/fondoRegistro.png'

function Registro() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [error, setError] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmarPassword) {
        setError('Las contraseñas no coinciden')
        return
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/registro/', {
        username,
        email,
        password,
      })
      navigate('/login')
    } catch (err) {
      setError('No se pudo registrar. Revisa los datos e intenta de nuevo.')
      console.log(err.response?.data)
    }
  }

  return (
    <div
      className="relative flex items-center justify-center h-screen w-full overflow-hidden px-4"
      style={{
        backgroundImage: `url(${fondoImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >

      <div className="relative z-10 flex flex-col items-center w-full max-w-lg">

        <img
          src={tituloImg}
          alt="GatuFashion"
          className="relative z-20 w-full max-w-[260px] -mb-12 titulo-flotante hover:scale-[1.05] transition-transform cursor-pointer"
          onClick={() => navigate('/')}
        />

        <form
          onSubmit={handleSubmit}
          className="relative z-10 bg-white rounded-3xl shadow-2xl px-8 pt-16 pb-10 w-full flex flex-col gap-4"
        >
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <h1 className="text-2xl font-bold text-orange-500 text-center -mt-3 mb-2">
            Crea tu cuenta
          </h1>

          <div>
            <h2 className="text-lg font-bold text-gray-600 text-left mb-1">Usuario</h2>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-full pl-11 pr-4 py-2 outline-none focus:border-orange-500 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-600 text-left mb-1">Correo electrónico</h2>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-full pl-11 pr-4 py-2 outline-none focus:border-orange-500 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-600 text-left mb-1">Contraseña</h2>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={mostrarPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-full pl-11 pr-11 py-2 outline-none focus:border-orange-500 transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-600 text-left mb-1">Repite tu contraseña</h2>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={mostrarPassword ? 'text' : 'password'}
                placeholder="Repetir contraseña"
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-full pl-11 pr-11 py-2 outline-none focus:border-orange-500 transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg transition-colors cursor-pointer mt-2"
          >
            Registrarme
          </button>

          <p className="text-center text-sm text-gray-500">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-orange-500 font-semibold hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Registro