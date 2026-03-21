class ListaPersonas:

    def __init__(self):

        self.personas = []


    # ---------------------------------------
    # AGREGAR PERSONA
    # ---------------------------------------

    def agregar(self, persona):

        self.personas.append(persona)


    # ---------------------------------------
    # OBTENER TODAS
    # ---------------------------------------

    def obtener_todas(self):

        return self.personas


    # ---------------------------------------
    # CONTAR PERSONAS
    # ---------------------------------------

    def cantidad(self):

        return len(self.personas)