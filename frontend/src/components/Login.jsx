import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { User, Lock, Eye, EyeOff, PawPrint } from 'lucide-react'
import tituloImg from '../assets/gaturro.png'
import fondoImg from '../assets/mg-portada_2.png'

function Login() {
  const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [mostrarPassword, setMostrarPassword] = useState(false)
    const [cargando, setCargando] = useState(false)
    const navigate = useNavigate()
  
    const handleSubmit = async (e) => {
      e.preventDefault()
      setError('')
  
      setCargando(true)
  
      try {
        const respuesta = await axios.post('http://127.0.0.1:8000/api/login/', {
          username,
          password,
        })

        localStorage.setItem('access', respuesta.data.access)
        localStorage.setItem('refresh', respuesta.data.refresh)
        localStorage.setItem('username', username)

        navigate('/mi-armario')

      } catch (err) {
        const datos = err.response?.data
  
        if (datos?.username) {
          setError('No existe una cuenta con ese nombre de usuario')
        } else if (datos?.password) {
          setError('La contraseña es incorrecta')
        } else {
          setError('No se pudo iniciar sesión. Revisa los datos e intenta de nuevo.')
        }
        console.log(datos)
        setCargando(false)
      }
    }

  return (
    <div
      className="relative flex items-center justify-center h-screen w-full overflow-hidden"
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

          <h1 className="text-2xl font-bold text-orange-500 text-center -mt-3 mb-2">
            Inicia sesión
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
            <div className="flex justify-between mb-1">
              <h2 className="text-lg font-bold text-gray-600 text-left">Contraseña</h2>
              <Link to="/recuperar-password" className="text-sm text-orange-500 font-semibold hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

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

          {error && (
            <p className="text-red-500 text-md text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg transition-colors cursor-pointer mt-2
            disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {cargando ? (
            <div className="flex items-center justify-center gap-2">
              <PawPrint className="animate-spin" size={20} />
              Iniciando sesión...
            </div>
          ) : (
            'Iniciar sesión'
          )}
          </button>

          <p className="text-center text-sm text-gray-500">
            ¿No tienes una cuenta?{' '}
            <Link to="/registro" className="text-orange-500 font-semibold hover:underline">
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login