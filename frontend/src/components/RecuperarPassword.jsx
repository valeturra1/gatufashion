import { useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { Mail, PawPrint } from 'lucide-react'
import tituloImg from '../assets/gaturro.png'
import fondoImg from '../assets/mg_register_bg.jpg'
import gaturroImg from '../assets/gatusherlock.png'

function RecuperarPassword() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(false)
    const [correoEnviado, setCorreoEnviado] = useState(false)
    const navigate = useNavigate()
  
    const handleSubmit = async (e) => {
      e.preventDefault()
      setError('')
  
      setCargando(true)
  
      try {
        const respuesta = await axios.post('http://127.0.0.1:8000/api/recuperar-password/', {
          email,
        })

        setCorreoEnviado(true)
        setCargando(false)

      } catch (err) {
        const datos = err.response?.data
  
        if (datos?.email) {
          setError('No existe una cuenta con ese correo electrónico')
        } else {
          setError('No se pudo enviar un correo de recuperación. Revisa los datos e intenta de nuevo.')
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

        {correoEnviado ? (
           <div className="relative z-10 bg-white rounded-3xl shadow-2xl px-8 pt-20 pb-16 w-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-orange-500 text-center -mt-3 mb-2">
              Correo de recuperación enviado 
            </h1>
            <div className="flex justify-between items-center gap-2">
                 <img
                src={gaturroImg}
                alt="GatuSherlock"
                className="relative z-20 w-full max-w-[80px]"
                />

                <p className="text-center text-gray-600">
                Revisa tu bandeja de entrada o spam para continuar con la recuperación de tu contraseña.
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
            Recuperar contraseña
          </h1>

          <div>
            <h2 className="text-lg font-bold text-gray-600 text-left mb-2">Ingresa el correo electrónico asociado a tu cuenta</h2>
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
              Enviando correo de recuperación...
            </div>
          ) : (
            'Recuperar contraseña'
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

export default RecuperarPassword