import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogOut, Shirt, ShelvingUnit } from 'lucide-react'
import { mustache } from '@lucide/lab';
import { HugeiconsIcon } from "@hugeicons/react";
import { BabyBoyDressIcon, ShortsPantsIcon, RunningShoesIcon, KeffiyehIcon, AnonymousIcon } from "@hugeicons/core-free-icons";
import axios from 'axios'

const CATEGORIAS = [
    { id: 'camisa', label: 'Camisas', icono: BabyBoyDressIcon, lib: 'hugeicons' },
    { id: 'pantalon', label: 'Pantalones', icono: ShortsPantsIcon, lib: 'hugeicons' },
    { id: 'zapato', label: 'Zapatos', icono: RunningShoesIcon, lib: 'hugeicons' },
    { id: 'pelo', label: 'Pelo', icono: KeffiyehIcon, lib: 'hugeicons' },
    { id: 'accesorios', label: 'Accesorios', icono: AnonymousIcon, lib: 'hugeicons' },
    { id: 'cara', label: 'Cara', icono: mustache, lib: 'lucide-lab' },
]

function MiArmario() {
    const navigate = useNavigate()
    const nombreUsuario = localStorage.getItem('username')

    const handleCerrarSesion = () => {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        localStorage.removeItem('username')
        navigate('/login')
    }

    const itemsVisibles = prendas.filter(p =>
        p.tipo === categoriaActiva &&
        (p.genero === 'unisex' || p.genero === generoFiltro)
    )

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
                <div className="flex h-screen w-full gap-4 p-4">
                    {/* Panel izquierdo: preview del gaturro */}
                    <div className="w-[25%] bg-stone-900 rounded-xl">
                        <GaturroPreview equipado={equipado} prendas={prendas} />
                    </div>

                    {/* Panel central: grid de items de la categoría activa */}
                    <div className="flex-1 bg-green-700 rounded-xl p-4 overflow-y-auto">
                        <div className="grid grid-cols-7 gap-3">
                            {itemsVisibles.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setEquipado(prev => ({
                                        ...prev,
                                        [categoriaActiva]: prev[categoriaActiva] === item.id ? null : item.id
                                    }))}
                                    className={`bg-yellow-300 rounded-lg aspect-square hover:bg-yellow-200 transition-colors ${
                                        equipado[categoriaActiva] === item.id ? 'ring-4 ring-orange-500' : ''
                                    }`}
                                >
                                    <img src={item.preview} className="w-full h-full object-contain p-2" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Panel derecho: tabs de categorías */}
                    <div className="w-16 flex flex-col gap-2">
                        {CATEGORIAS.map(cat => (
                            <button key={cat.id} onClick={() => setCategoriaActiva(cat.id)} className="...">
                                {cat.lib === 'hugeicons' && <HugeiconsIcon icon={cat.icono} size={24} />}
                                {cat.lib === 'lucide-lab' && <Icon iconNode={cat.icono} size={24} />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default MiArmario