import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import fondoImg from '../assets/fondo.jpg'

function Principal() {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col md:flex-row h-screen w-full">

            {/* Panel izquierdo */}
            <Sidebar />

            {/* Panel derecho */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden">

                {/* Capa 1: la imagen */}
                <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `url(${fondoImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
                />

                {/* Capa 2: oscurece la imagen */}
                <div className="absolute inset-0 overlay-oscuro" />

                {/* Capa 3: la tarjeta blanca con los botones */}
                <div className="relative z-10 bg-white rounded-3xl shadow-2xl px-8 py-10 w-full max-w-sm mx-6 flex flex-col items-center gap-3">

                <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">
                    ¡Bienvenido a GatuFashion!
                </h2>
                <p className="text-gray-500 text-sm mb-4 text-center">
                    Viste a tu gaturro bien guabaloso
                </p>

                <button 
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg shadow-md transition-all hover:scale-[1.02] cursor-pointer">
                    Iniciar sesión
                </button>

                <button 
                onClick={() => navigate('/registro')}
                className="w-full py-3 rounded-full bg-yellow-50 hover:bg-yellow-100 text-orange-600 font-semibold text-lg border-2 border-orange-500 transition-all hover:scale-[1.02] cursor-pointer">
                    Registrarse
                </button>

                </div>

            </div>

        </div>
    )
}

export default Principal