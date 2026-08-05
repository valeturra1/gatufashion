import tituloImg from '../assets/gaturro.png'

function Sidebar() {
  return (
    <div className="w-full h-[30vh] md:w-[30%] md:h-auto flex items-center justify-center fondo-animado">
      <img src={tituloImg} alt="GatuFashion" className="w-full max-w-[450px] titulo-flotante" />
    </div>
  )
}

export default Sidebar