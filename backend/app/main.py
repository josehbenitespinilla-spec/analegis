from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from fastapi.responses import FileResponse
import importlib.util
import uuid
import json

app = FastAPI()

# -------------------------
# CORS (CORREGIDO PRODUCCIÓN REAL)
# -------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔥 CLAVE: permite TODO (evita bloqueo CORS)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# RUTAS BASE DEL PROYECTO
# -------------------------

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DOCUMENTOS_DIR = BASE_DIR / "documentos"
OUTPUT_DIR = BASE_DIR / "output"
OUTPUT_DIR.mkdir(exist_ok=True)

GEOGRAFIA_PATH = BASE_DIR / "backend" / "app" / "data" / "geografia.json"

# -------------------------
# CARGAR GEOGRAFIA
# -------------------------

def cargar_geografia():
    try:
        with open(GEOGRAFIA_PATH, encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print("Error cargando geografia:", e)
        return []

# -------------------------
# ENDPOINT INICIO
# -------------------------

@app.get("/")
def inicio():
    return {"mensaje": "ANALEGIS funcionando"}

# -------------------------
# AREAS
# -------------------------

@app.get("/areas")
def obtener_areas():

    if not DOCUMENTOS_DIR.exists():
        return []

    return [carpeta.name for carpeta in DOCUMENTOS_DIR.iterdir() if carpeta.is_dir()]

# -------------------------
# CATEGORIAS
# -------------------------

@app.get("/categorias/{area}")
def obtener_categorias(area: str):

    area_path = DOCUMENTOS_DIR / area

    if not area_path.exists():
        return []

    return [carpeta.name for carpeta in area_path.iterdir() if carpeta.is_dir()]

# -------------------------
# DOCUMENTOS
# -------------------------

@app.get("/documentos/{area}/{categoria}")
def obtener_documentos(area: str, categoria: str):

    categoria_path = DOCUMENTOS_DIR / area / categoria

    if not categoria_path.exists():
        return []

    return [archivo.stem for archivo in categoria_path.iterdir() if archivo.suffix == ".py"]

# -------------------------
# CAMPOS DEL DOCUMENTO
# -------------------------

@app.get("/campos/{area}/{categoria}/{documento}")
def obtener_campos(area: str, categoria: str, documento: str):

    archivo = DOCUMENTOS_DIR / area / categoria / f"{documento}.py"

    if not archivo.exists():
        return []

    spec = importlib.util.spec_from_file_location("modulo", archivo)
    modulo = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(modulo)

    return getattr(modulo, "campos", [])

# -------------------------
# GENERAR DOCUMENTO (MEJORADO)
# -------------------------

@app.post("/generar/{area}/{categoria}/{documento}")
async def generar_documento(area: str, categoria: str, documento: str, datos: dict):

    try:

        archivo = DOCUMENTOS_DIR / area / categoria / f"{documento}.py"

        if not archivo.exists():
            raise HTTPException(status_code=404, detail="Documento no encontrado")

        spec = importlib.util.spec_from_file_location("modulo", archivo)
        modulo = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(modulo)

        print("DATOS RECIBIDOS:", datos)

        doc = modulo.generar(datos)

        nombre = f"{uuid.uuid4()}.docx"
        ruta = OUTPUT_DIR / nombre

        doc.save(ruta)

        return FileResponse(
            ruta,
            filename="poder.docx",
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )

    except Exception as e:
        print("ERROR GENERANDO DOCUMENTO:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

# -------------------------
# GEOGRAFIA
# -------------------------

@app.get("/departamentos")
def obtener_departamentos():

    data = cargar_geografia()

    return [d["departamento"] for d in data]


@app.get("/municipios/{departamento}")
def obtener_municipios(departamento: str):

    data = cargar_geografia()

    for d in data:
        if d["departamento"] == departamento:
            return d["ciudades"]

    return []


@app.get("/geografia")
def obtener_geografia():
    return cargar_geografia()
