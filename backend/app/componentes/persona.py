class Persona:

    def __init__(self, tipo_persona):

        self.tipo_persona = tipo_persona

        # CONTROL INTERNO
        self.id_persona = None
        self.rol = None
        self.tipo_documento = None

        # ------------------------------------
        # PERSONA NATURAL
        # ------------------------------------

        self.nombre = None
        self.numero_identificacion = None
        self.ciudad_expedicion = None
        self.direccion_domicilio = None
        self.correo_electronico = None
        self.celular_telefono = None
        self.tarjeta_profesional = None

        # ------------------------------------
        # PERSONA JURIDICA
        # ------------------------------------

        self.razon_social = None
        self.nit = None
        self.representante_legal = None
        self.direccion_domicilio = None
        self.correo_electronico = None
        self.celular_telefono = None

        # ------------------------------------
        # ENTIDAD PUBLICA
        # ------------------------------------

        self.razon_social = None
        self.representante_legal = None
        self.direccion = None
        self.correo_electronico = None
        self.telefono = None