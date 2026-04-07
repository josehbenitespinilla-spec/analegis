"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"

import FormularioPoderSimple from "./FormularioPoderSimple"
import FormularioPoderPersonaNatural from "./FormularioPoderPersonaNatural"
import FormularioPoderBaseSimple from "./FormularioPoderBaseSimple"

export default function GestorVentanas({ ventanas, cerrarVentana }: any) {

  const [mounted, setMounted] = useState(false)
  const [posiciones, setPosiciones] = useState<any>({})
  const [minimizadas, setMinimizadas] = useState<any>({})
  const [maximizadas, setMaximizadas] = useState<any>({})
  const [activa, setActiva] = useState<number | null>(null)
  const [drag, setDrag] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const iniciarDrag = (e: any, id: number) => {
    if (maximizadas[id]) return

    setActiva(id)

    const rect = e.currentTarget.parentElement.getBoundingClientRect()

    setDrag({
      id,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top
    })
  }

  const mover = (e: any) => {
    if (!drag) return

    setPosiciones((prev: any) => ({
      ...prev,
      [drag.id]: {
        x: e.clientX - drag.offsetX,
        y: e.clientY - drag.offsetY
      }
    }))
  }

  const soltar = () => setDrag(null)

  if (!mounted) return null

  const root = document.getElementById("desktop-root")
  if (!root) return null

  return createPortal(

    <>
      <div
        onMouseMove={mover}
        onMouseUp={soltar}
        className="fixed inset-0 pointer-events-none"
      >

        {ventanas.map((v: any, index: number) => {

          const tipo = v.tipo?.trim().toLowerCase() // 🔥 FIX CLAVE

          const minimizada = minimizadas[v.id] === true
          const maximizada = maximizadas[v.id] === true

          if (minimizada) return null

          const pos = posiciones[v.id] || {
            x: window.innerWidth * 0.2,
            y: 60
          }

          let titulo = "VENTANA"
          if (tipo === "poder_simple") titulo = "PODER SIMPLE"
          if (tipo === "poder_persona_natural") titulo = "PODER PERSONA NATURAL"
          if (tipo === "poder_base_simple") titulo = "PODER BASE SIMPLE"
          if (tipo === "login") titulo = "INICIAR SESIÓN"
          if (tipo === "registro") titulo = "CREAR CUENTA"

          return (
            <div
              key={v.id + "-" + v.tipo}
              onMouseDown={() => setActiva(v.id)}
              className="bg-white border shadow-2xl flex flex-col pointer-events-auto"
              style={{
                position: "fixed",
                top: maximizada ? 0 : pos.y,
                left: maximizada ? 0 : pos.x,
                width: maximizada ? "100vw" : "70vw",
                height: maximizada ? "100vh" : "90vh",
                zIndex: activa === v.id ? 2000 : 1000 + index
              }}
            >

              <div
                onMouseDown={(e) => iniciarDrag(e, v.id)}
                className="flex justify-between items-center bg-gray-200 px-4 py-2 cursor-move border-b"
              >
                <strong>{titulo} #{v.id}</strong>

                <div className="flex gap-2">

                  <button onClick={() =>
                    setMinimizadas((prev: any) => ({
                      ...prev,
                      [v.id]: true
                    }))
                  }>
                    _
                  </button>

                  <button onClick={() =>
                    setMaximizadas((prev: any) => ({
                      ...prev,
                      [v.id]: !prev[v.id]
                    }))
                  }>
                    {maximizada ? "🗗" : "🗖"}
                  </button>

                  <button onClick={() => cerrarVentana(v.id)}>
                    X
                  </button>

                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">

                {tipo === "poder_simple" && (
                  <FormularioPoderSimple cerrar={() => cerrarVentana(v.id)} />
                )}

                {tipo === "poder_persona_natural" && (
                  <FormularioPoderPersonaNatural cerrar={() => cerrarVentana(v.id)} />
                )}

                {tipo === "poder_base_simple" && (
                  <FormularioPoderBaseSimple cerrar={() => cerrarVentana(v.id)} />
                )}

                {tipo === "login" && (
                  <div className="flex flex-col gap-3 max-w-md">
                    <input placeholder="Correo" className="border p-2" />
                    <input placeholder="Contraseña" type="password" className="border p-2" />
                    <button className="bg-blue-600 text-white p-2 rounded">
                      Iniciar sesión
                    </button>
                  </div>
                )}

                {tipo === "registro" && (
                  <div className="flex flex-col gap-3 max-w-md">
                    <input placeholder="Nombre" className="border p-2" />
                    <input placeholder="Correo" className="border p-2" />
                    <input placeholder="Contraseña" type="password" className="border p-2" />
                    <button className="bg-green-600 text-white p-2 rounded">
                      Crear cuenta
                    </button>
                  </div>
                )}

              </div>

            </div>
          )
        })}

      </div>

      <div className="fixed bottom-0 left-0 w-full h-12 bg-gray-900 flex items-center px-3 gap-2 z-[99999]">

        <div className="text-white font-bold mr-4">
          ANALEGIS
        </div>

        {ventanas.map((v: any) => {

          const tipo = v.tipo?.trim().toLowerCase() // 🔥 FIX TAMBIÉN AQUÍ

          let titulo = "VENTANA"
          if (tipo === "poder_simple") titulo = "PODER"
          if (tipo === "poder_persona_natural") titulo = "PODER PN"
          if (tipo === "poder_base_simple") titulo = "PODER BASE"
          if (tipo === "login") titulo = "LOGIN"
          if (tipo === "registro") titulo = "REGISTRO"

          return (
            <button
              key={v.id}
              onClick={() => {
                setMinimizadas((prev: any) => ({
                  ...prev,
                  [v.id]: false
                }))
                setActiva(v.id)
              }}
              className={`px-4 py-1 rounded text-sm ${
                activa === v.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-white"
              }`}
            >
              {titulo} #{v.id}
            </button>
          )
        })}

      </div>

    </>,
    root
  )
}