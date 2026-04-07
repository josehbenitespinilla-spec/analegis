"use client"

import { useEffect, useState } from "react"

export default function FormularioPoderBaseSimple({ cerrar }: any) {

  // 🔥 CAMBIO: usar backend local (NO Render)
  const API = "http://127.0.0.1:8000"

  const [departamentos, setDepartamentos] = useState<string[]>([])

  const [municipios, setMunicipios] = useState<string[]>([])
  const [municipiosPod, setMunicipiosPod] = useState<string[]>([])
  const [municipiosDem, setMunicipiosDem] = useState<string[]>([])
  const [municipiosAbo, setMunicipiosAbo] = useState<string[]>([])

  const [form, setForm] = useState<any>({
    ciudad: "",
    departamento: "",
    fecha: "",
    juzgado: "",
    tipo_proceso: "",

    abogado_nombre: "",
    abogado_identificacion: "",
    abogado_departamento: "",
    abogado_ciudad: "",
    abogado_direccion: "",
    abogado_correo: "",
    abogado_celular: "",
    abogado_tarjeta: "",

    poderdante: {
      nombre: "",
      identificacion: "",
      departamento: "",
      ciudad: "",
      direccion: "",
      correo: "",
      celular: ""
    },

    demandado: {
      nombre: "",
      identificacion: "",
      departamento: "",
      ciudad: "",
      direccion: "",
      correo: "",
      celular: ""
    }
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

  const cargarMunicipiosPersona = async (dep: string, tipo: string) => {
    const res = await fetch(`${API}/municipios/${dep}`)
    const data = await res.json()

    if (tipo === "poderdante") setMunicipiosPod(data)
    if (tipo === "demandado") setMunicipiosDem(data)
    if (tipo === "abogado") setMunicipiosAbo(data)
  }

  const cambiar = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const cambiarPersona = (tipo: string, campo: string, valor: string) => {
    setForm({
      ...form,
      [tipo]: {
        ...form[tipo],
        [campo]: valor
      }
    })
  }

  const generar = async () => {
    try {

      const res = await fetch(
        // 🔥 FIX REAL AQUÍ
        `${API}/generar/poderes_base/persona_natural/poder_base_simple`,
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
      a.download = "poder_base_simple.docx"
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

      <h2 className="text-xl font-bold">Poder Base Simple</h2>

      <select onChange={(e)=>cargarMunicipios(e.target.value)} className="border p-2 w-full">
        <option value="">Departamento</option>
        {departamentos.map((d,i)=><option key={i} value={d}>{d}</option>)}
      </select>

      <select name="ciudad" onChange={cambiar} className="border p-2 w-full">
        <option value="">Ciudad</option>
        {municipios.map((m,i)=><option key={i} value={m}>{m}</option>)}
      </select>

      <input name="fecha" placeholder="Fecha" onChange={cambiar} className="border p-2 w-full"/>
      <input name="juzgado" placeholder="Juzgado" onChange={cambiar} className="border p-2 w-full"/>
      <input name="tipo_proceso" placeholder="Tipo proceso" onChange={cambiar} className="border p-2 w-full"/>

      <h3 className="font-bold">Poderdante</h3>

      <input placeholder="Nombre" onChange={(e)=>cambiarPersona("poderdante","nombre",e.target.value)} className="border p-2 w-full"/>
      <input placeholder="Cédula" onChange={(e)=>cambiarPersona("poderdante","identificacion",e.target.value)} className="border p-2 w-full"/>

      <select
        onChange={(e)=>{
          cambiarPersona("poderdante","departamento",e.target.value)
          cargarMunicipiosPersona(e.target.value,"poderdante")
        }}
        className="border p-2 w-full"
      >
        <option value="">Departamento</option>
        {departamentos.map((d,i)=><option key={i} value={d}>{d}</option>)}
      </select>

      <select className="border p-2 w-full"
        onChange={(e)=>cambiarPersona("poderdante","ciudad",e.target.value)}>
        <option value="">Ciudad</option>
        {municipiosPod.map((m,i)=><option key={i} value={m}>{m}</option>)}
      </select>

      <input placeholder="Dirección" onChange={(e)=>cambiarPersona("poderdante","direccion",e.target.value)} className="border p-2 w-full"/>
      <input placeholder="Correo" onChange={(e)=>cambiarPersona("poderdante","correo",e.target.value)} className="border p-2 w-full"/>
      <input placeholder="Celular" onChange={(e)=>cambiarPersona("poderdante","celular",e.target.value)} className="border p-2 w-full"/>

      <h3 className="font-bold">Demandado</h3>

      <input placeholder="Nombre" onChange={(e)=>cambiarPersona("demandado","nombre",e.target.value)} className="border p-2 w-full"/>
      <input placeholder="Cédula" onChange={(e)=>cambiarPersona("demandado","identificacion",e.target.value)} className="border p-2 w-full"/>

      <select
        onChange={(e)=>{
          cambiarPersona("demandado","departamento",e.target.value)
          cargarMunicipiosPersona(e.target.value,"demandado")
        }}
        className="border p-2 w-full"
      >
        <option value="">Departamento</option>
        {departamentos.map((d,i)=><option key={i} value={d}>{d}</option>)}
      </select>

      <select className="border p-2 w-full"
        onChange={(e)=>cambiarPersona("demandado","ciudad",e.target.value)}>
        <option value="">Ciudad</option>
        {municipiosDem.map((m,i)=><option key={i} value={m}>{m}</option>)}
      </select>

      <input placeholder="Dirección" onChange={(e)=>cambiarPersona("demandado","direccion",e.target.value)} className="border p-2 w-full"/>
      <input placeholder="Correo" onChange={(e)=>cambiarPersona("demandado","correo",e.target.value)} className="border p-2 w-full"/>
      <input placeholder="Celular" onChange={(e)=>cambiarPersona("demandado","celular",e.target.value)} className="border p-2 w-full"/>

      <h3 className="font-bold">Abogado</h3>

      <input name="abogado_nombre" placeholder="Nombre abogado" onChange={cambiar} className="border p-2 w-full"/>
      <input name="abogado_identificacion" placeholder="Cédula abogado" onChange={cambiar} className="border p-2 w-full"/>

      <select
        onChange={(e)=>{
          setForm({...form, abogado_departamento: e.target.value})
          cargarMunicipiosPersona(e.target.value,"abogado")
        }}
        className="border p-2 w-full"
      >
        <option value="">Departamento</option>
        {departamentos.map((d,i)=><option key={i} value={d}>{d}</option>)}
      </select>

      <select name="abogado_ciudad" onChange={cambiar} className="border p-2 w-full">
        <option value="">Ciudad abogado</option>
        {municipiosAbo.map((m,i)=><option key={i} value={m}>{m}</option>)}
      </select>

      <input name="abogado_direccion" placeholder="Dirección abogado" onChange={cambiar} className="border p-2 w-full"/>
      <input name="abogado_correo" placeholder="Correo abogado" onChange={cambiar} className="border p-2 w-full"/>
      <input name="abogado_celular" placeholder="Celular abogado" onChange={cambiar} className="border p-2 w-full"/>
      <input name="abogado_tarjeta" placeholder="Tarjeta profesional" onChange={cambiar} className="border p-2 w-full"/>

      <button onClick={generar} className="bg-green-600 text-white px-4 py-2">
        Generar
      </button>

    </div>
  )
}