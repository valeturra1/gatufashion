import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogOut, Shirt, ShelvingUnit } from 'lucide-react'
import axios from 'axios'

function MiArmario() {
    const navigate = useNavigate()
    const nombreUsuario = localStorage.getItem('username')

    const handleCerrarSesion = () => {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        localStorage.removeItem('username')
        navigate('/login')
    }

    return (
        <div className="flex flex-col md:flex-row h-screen w-full">

            {/* Panel izquierdo */}
            <div className="w-full h-[30vh] md:w-[20%] md:h-auto flex flex-col fondo">
                <div className="bg-[#A92929] h-[7vh]">
                    <h1 className="text-white text-2xl font-bold mx-6 mt-4 uppercase">{nombreUsuario}</h1>
                </div>
                
                <hr className="border-t border-gray-800 mb-4" />

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => navigate('/mi-armario')}
                        className="group flex items-center cursor-pointer mx-6"
                    >
                        <ShelvingUnit className="text-[#781414] group-hover:text-[#be2f2f] transition-colors" size={20} />
                        <h2 className="text-[#781414] mt-1 group-hover:text-[#be2f2f] font-semibold text-lg transition-colors ml-2">
                            MI ARMARIO
                        </h2>
                    </button>

                    <hr className="border-t border-[#5C3A3A]" />

                    <button
                        onClick={() => navigate('/mi-armario')}
                        className="group flex items-center cursor-pointer mx-6"
                    >
                        <Shirt className="text-[#781414] group-hover:text-[#be2f2f] transition-colors" size={20} />
                        <h2 className="text-[#781414] mt-1 group-hover:text-[#be2f2f] font-semibold text-lg transition-colors ml-2">
                            MIS OUTIFTS
                        </h2>
                    </button>

                    <hr className="border-t border-[#5C3A3A]" />
                </div>

                <hr className="border-t border-[#5C3A3A] mb-4 mt-auto" />

                <button
                    onClick={handleCerrarSesion}
                    className="group flex items-center mx-6 mb-4 cursor-pointer"
                >
                    <LogOut className="text-[#781414] group-hover:text-[#be2f2f] transition-colors" size={24} />
                    <h2 className="text-[#781414] group-hover:text-[#be2f2f] font-semibold text-lg transition-colors ml-2">
                        CERRAR SESIÓN
                    </h2>
                </button>
            </div>

            {/* Panel derecho */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden">
                
            </div>

        </div>
    )
}

export default MiArmario