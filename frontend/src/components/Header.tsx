export default function Header() {
  return (
    <header className="w-full bg-blue-900 text-white">

      <div className="w-full h-[220px] flex items-center px-16">

        {/* Lado izquierdo */}
        <div>
          <h1 className="text-4xl font-bold tracking-wide">
            ANALEGIS
          </h1>

          <p className="text-lg opacity-80">
            Asistente Jurídico Inteligente
          </p>
        </div>

        {/* Lado derecho */}
        <div className="ml-auto flex gap-4">

          <button className="bg-white text-blue-900 px-4 py-2 rounded-md font-semibold">
            Iniciar sesión
          </button>

          <button className="border border-white px-4 py-2 rounded-md font-semibold">
            Crear cuenta
          </button>

        </div>

      </div>

    </header>
  )
}