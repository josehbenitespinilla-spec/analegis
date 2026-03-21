"use client"

import { useState, useEffect } from "react"
import GestorVentanas from "../components/GestorVentanas"

let contador = 0

export default function Home() {

  const [areas, setAreas] = useState<string[]>([])
  const [areaActiva, setAreaActiva] = useState<string>("")

  const [categorias, setCategorias] = useState<string[]>([])
  const [documentos, setDocumentos] = useState<string[]>([])
  const [ventanas, setVentanas] = useState<any[]>([])

  // 🔥 URL BACKEND (NUEVO)
  const API = "https://analegis-backend.onrender.com"

  // 🔥 CARGAR AREAS DINÁMICAS
  useEffect(() => {
    fetch(`${API}/areas`)
      .then(res => res.json())
      .then(setAreas)
  }, [])

  const cargarCategorias = async (area: string) => {
    setAreaActiva(area)

    const res = await fetch(`${API}/categorias/${area}`)
    const data = await res.json()

    setCategorias(data)
    setDocumentos([])
  }

  const cargarDocumentos = async (categoria: string) => {
    const res = await fetch(`${API}/documentos/${areaActiva}/${categoria}`)
    const data = await res.json()

    setDocumentos(data)
  }

  // 🔥 ABRIR VENTANA REAL (AJUSTADO SOLO PARA LOGIN/REGISTRO)
  const abrirVentana = (tipo: string) => {

    contador++

    const nueva = {
      id: contador,
      tipo
    }

    setVentanas(prev => [...prev, nueva])
  }

  const cerrarVentana = (id: number) => {
    setVentanas(prev => prev.filter(v => v.id !== id))
  }

  return (

    <>
      {/* 🔥 CAPA GLOBAL DE VENTANAS */}
      <div className="fixed inset-0 z-[9999] pointer-events-none">
        <GestorVentanas
          ventanas={ventanas}
          cerrarVentana={cerrarVentana}
        />
      </div>

      {/* INTERFAZ PRINCIPAL */}
      <main className="flex flex-col min-h-screen">

        {/* HEADER (AJUSTE SOLO EN BOTONES) */}
        <div className="bg-blue-800 text-white p-10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">ANALEGIS</h1>
            <p className="text-blue-200">Asistente Jurídico Inteligente</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => abrirVentana("login")}
              className="bg-white text-blue-900 px-4 py-2 rounded"
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => abrirVentana("registro")}
              className="border border-white px-4 py-2 rounded"
            >
              Crear cuenta
            </button>
          </div>
        </div>

        {/* 🔥 AREAS DINÁMICAS */}
        <div className="bg-gray-200 p-4 flex justify-center gap-4 border-b">

          {areas.map((area, i) => (
            <button
              key={i}
              onClick={() => cargarCategorias(area)}
              className="bg-white px-4 py-2 rounded shadow"
            >
              {area}
            </button>
          ))}

        </div>

        {/* CONTENIDO */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6">

          {categorias.length === 0 && (
            <>
              <h2 className="text-4xl font-bold">
                Seleccione un área del derecho
              </h2>
              <p className="text-gray-500 mt-4">
                Los documentos aparecerán aquí cuando seleccione un área jurídica.
              </p>
            </>
          )}

          {categorias.length > 0 && documentos.length === 0 && (
            <div className="flex gap-4">
              {categorias.map((item, i) => (
                <button
                  key={i}
                  onClick={() => cargarDocumentos(item)}
                  className="bg-blue-600 text-white px-6 py-3 rounded shadow"
                >
                  {item}
                </button>
              ))}
            </div>
          )}

          {documentos.length > 0 && (
            <div className="flex gap-4">
              {documentos.map((doc, i) => (
                <button
                  key={i}
                  onClick={() => abrirVentana(doc)}
                  className="bg-green-600 text-white px-6 py-3 rounded shadow"
                >
                  {doc}
                </button>
              ))}
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="bg-gray-900 text-white text-center p-6">
          <p className="text-lg">ANALEGIS - Plataforma Legaltech</p>
          <p className="text-gray-400 text-sm">
            Generación automática de documentos jurídicos
          </p>
        </div>

      </main>
    </>
  )
}
