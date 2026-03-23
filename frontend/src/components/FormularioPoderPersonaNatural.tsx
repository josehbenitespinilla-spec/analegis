"use client"

import { useEffect, useState } from "react"

export default function FormularioPoderPersonaNatural({ cerrar }: any) {

  const API = "https://analegis-backend.onrender.com"

  const [departamentos, setDepartamentos] = useState<string[]>([])
  const [municipios, setMunicipios] = useState<string[]>([])

  const [form, setForm] = useState<any>({
    ciudad: "",
    departamento: "",
    fecha: "",
    poderdante: "",
    apoderado: ""
  })

  useEffect(() => {
    fetch(`${API}/departamentos`)
      .then(res => res.json())
      .then(setDepartamentos)
  }, [])

  const cargarMunicipios = async (dep: string) => {
    const res = await fetch(`${API}/municipios/${dep}`)
    const data = await res.json()

    setMunicipios(data)

    setForm((prev:any)=>({
      ...prev,
      departamento: dep
    }))
  }

  const cambiar = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const generar = async () => {
    try {

      const res = await fetch(
        `${API}/generar/poderes_base/persona_natural/poder_persona_natural`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        }
      )

      if (!res.ok) {
        const errorText = await res.text()
        console.error("ERROR BACKEND:", errorText)
        alert("Error generando documento")
        return
      }

      const blob = await res.blob()

      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = "poder_persona_natural.docx"
      document.body.appendChild(a)
      a.click()

      setTimeout(() => {
        a.remove()
        window.URL.revokeObjectURL(url)
      }, 1000)

    } catch (err) {
      console.error("ERROR:", err)
      alert("Error de conexión con el servidor")
    }
  }

  return (
    <div className="p-6 space-y-3">

      <h2 className="text-xl font-bold">Poder Persona Natural</h2>

      <select onChange={(e)=>cargarMunicipios(e.target.value)} className="border p-2 w-full">
        <option value="">Departamento</option>
        {departamentos.map((d,i)=><option key={i} value={d}>{d}</option>)}
      </select>

      <select name="ciudad" onChange={cambiar} className="border p-2 w-full">
        <option value="">Ciudad</option>
        {municipios.map((m,i)=><option key={i} value={m}>{m}</option>)}
      </select>

      <input name="fecha" placeholder="Fecha" onChange={cambiar} className="border p-2 w-full"/>

      <input name="poderdante" placeholder="Nombre poderdante" onChange={cambiar} className="border p-2 w-full"/>

      <input name="apoderado" placeholder="Nombre apoderado" onChange={cambiar} className="border p-2 w-full"/>

      <button onClick={generar} className="bg-green-600 text-white px-4 py-2">
        Generar
      </button>

    </div>
  )
}