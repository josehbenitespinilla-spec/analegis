"use client"

import { useState } from "react"

export default function FormularioPoder({ cerrar }: any) {

  const [form, setForm] = useState<any>({
    ciudad: "",
    fecha: "",
    juzgado: "",
    abogado_nombre: "",
    abogado_identificacion: "",
    abogado_ciudad: "",
    abogado_direccion: "",
    abogado_correo: "",
    abogado_celular: "",
    abogado_tarjeta: "",
    tipo_proceso: ""
  })

  const [loading, setLoading] = useState(false)

  const cambiar = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const generarPoder = async () => {
    try {

      setLoading(true)

      console.log("FORM:", form) // 🔥 DEBUG

      const payload = {
        ...form,

        poderdantes: [
          {
            tipo: "natural",
            nombre: form.abogado_nombre || "",
            identificacion: form.abogado_identificacion || "",
            ciudad: form.ciudad || "",
            direccion: form.abogado_direccion || "",
            correo: form.abogado_correo || "",
            celular: form.abogado_celular || ""
          }
        ],

        demandados: [],

        herederos_indeterminados: false,
        causantes: []
      }

      const response = await fetch(
        "http://127.0.0.1:8000/generar/familia/poderes/poder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error("ERROR BACKEND:", errorText)
        alert("Error generando el documento")
        return
      }

      const blob = await response.blob()

      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = "poder.docx"
      a.click()

      window.URL.revokeObjectURL(url)

    } catch (error) {
      console.error(error)
      alert("Error generando el documento")
    } finally {
      setLoading(false)
    }
  }

  return (

    <div className="p-4">

      <h2 className="text-2xl font-bold mb-6">
        Formulario Poder
      </h2>

      <input
        name="ciudad"
        value={form.ciudad}
        placeholder="Ciudad"
        onChange={cambiar}
        className="border p-2 w-full mb-3"
      />

      <input
        name="fecha"
        value={form.fecha}
        placeholder="Fecha"
        onChange={cambiar}
        className="border p-2 w-full mb-3"
      />

      <input
        name="juzgado"
        value={form.juzgado}
        placeholder="Juzgado"
        onChange={cambiar}
        className="border p-2 w-full mb-6"
      />

      <input
        name="tipo_proceso"
        value={form.tipo_proceso}
        placeholder="Tipo de proceso"
        onChange={cambiar}
        className="border p-2 w-full mb-6"
      />

      <input
        name="abogado_nombre"
        value={form.abogado_nombre}
        placeholder="Nombre abogado"
        onChange={cambiar}
        className="border p-2 w-full mb-3"
      />

      <input
        name="abogado_identificacion"
        value={form.abogado_identificacion}
        placeholder="Identificación abogado"
        onChange={cambiar}
        className="border p-2 w-full mb-3"
      />

      <input
        name="abogado_ciudad"
        value={form.abogado_ciudad}
        placeholder="Ciudad abogado"
        onChange={cambiar}
        className="border p-2 w-full mb-3"
      />

      <input
        name="abogado_direccion"
        value={form.abogado_direccion}
        placeholder="Dirección abogado"
        onChange={cambiar}
        className="border p-2 w-full mb-3"
      />

      <input
        name="abogado_correo"
        value={form.abogado_correo}
        placeholder="Correo abogado"
        onChange={cambiar}
        className="border p-2 w-full mb-3"
      />

      <input
        name="abogado_celular"
        value={form.abogado_celular}
        placeholder="Celular abogado"
        onChange={cambiar}
        className="border p-2 w-full mb-3"
      />

      <input
        name="abogado_tarjeta"
        value={form.abogado_tarjeta}
        placeholder="Tarjeta profesional"
        onChange={cambiar}
        className="border p-2 w-full mb-6"
      />

      <div className="flex gap-4">

        <button
          onClick={generarPoder}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-3 rounded"
        >
          {loading ? "Generando..." : "Generar Poder"}
        </button>

        <button
          onClick={cerrar}
          className="bg-gray-500 text-white px-6 py-3 rounded"
        >
          Cerrar
        </button>

      </div>

    </div>

  )

}