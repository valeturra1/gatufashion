import { useState } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { Lock, Eye, EyeOff, PawPrint } from 'lucide-react'
import tituloImg from '../assets/gaturro.png'
import fondoImg from '../assets/mg_register_bg.jpg'
import gaturroImg from '../assets/gatucompu.png'

function CambiarPassword() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmarPassword, setConfirmarPassword] = useState('')
    const [mostrarPassword, setMostrarPassword] = useState(false)
    const [cargando, setCargando] = useState(false)
    const [contraseñaCambiada, setContraseñaCambiada] = useState(false)
    const [error, setError] = useState('')
    const { uid, token } = useParams() /* esto lo hacemos para poder mandar el uid y el token de la ursl al backend */
    const navigate = useNavigate()
  
    const handleSubmit = async (e) => {
      e.preventDefault()
      setError('')

      if (password !== confirmarPassword) {
        setError('Las contraseñas no coinciden')
        return
      }
  
      setCargando(true)
  
      try {
        const respuesta = await axios.post('http://127.0.0.1:8000/api/cambiar-password/', {
            uid,
            token,
            password,
        })

        setContraseñaCambiada(true)
        setCargando(false)

      } catch (err) {
        const datos = err.response?.data
  
        if (datos?.password) {
          setError('La contraseña debe ser de mínimo 6 caracteres.')
        } else {
          setError('No se pudo cambiar la contraseña. Revisa los datos e intenta de nuevo.')
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

      <div className="relative z-10 flex flex-col items-center w-full max-w-xl">

        <img
          src={tituloImg}
          alt="GatuFashion"
          className="relative z-20 w-full max-w-[260px] -mb-13 titulo-flotante hover:scale-[1.05] transition-transform cursor-pointer"
          onClick={() => navigate('/')}
        />

        {contraseñaCambiada ? (
           <div className="relative z-10 bg-white rounded-3xl shadow-2xl px-8 pt-20 pb-16 w-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-orange-500 text-center -mt-3 mb-2">
              Contraseña cambiada exitosamente 
            </h1>
            <div className="flex justify-between items-center gap-2">
                 <img
                src={gaturroImg}
                alt="GatuCompu"
                className="relative z-20 w-full max-w-[80px]"
                />

                <p className="text-center text-gray-600">
                Tu contraseña ha sido cambiada exitosamente. Puedes ingresar con tu nueva contraseña ahora.
                </p>
            </div>
            
                <p className="text-center text-sm text-gray-500">
                    <Link to="/login" className="text-orange-500 font-semibold hover:underline">
                    Volver al inicio de sesión
                    </Link>
                </p>
          </div>
        ) : (

        <form
          onSubmit={handleSubmit}
          className="relative z-10 bg-white rounded-3xl shadow-2xl px-8 pt-20 pb-16 w-full flex flex-col gap-4"
        >

          <h1 className="text-2xl font-bold text-orange-500 text-center -mt-3 mb-2">
            Cambiar contraseña
          </h1>
        
            <div>
                <h2 className="text-lg font-bold text-gray-600 text-left mb-2">Ingresa tu nueva contraseña</h2>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type={mostrarPassword ? 'text' : 'password'}
                        placeholder="Nueva contraseña"
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
              Cambiando contraseña...
            </div>
          ) : (
            'Cambiar contraseña'
          )}
          </button>

          <p className="text-center text-sm text-gray-500">
            <Link to="/login" className="text-orange-500 font-semibold hover:underline">
              Volver al inicio de sesión
            </Link>
          </p>
        </form>
        )}
      </div>
    </div>
  )
}

export default CambiarPassword