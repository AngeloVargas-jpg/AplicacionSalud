import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// ─── Base de datos en memoria ────────────────────────────────────────────────
// Cuidadores registrados
const CUIDADORES_BD = {
  'c1': { id: 'c1', nombre: 'Juan', rut: '12.345.678-5', pass: '1234' },
};

// Pacientes iniciales de demo
const PACIENTES_INICIALES = {
  '1': {
    id: '1',
    cuidadorId: 'c1',
    nombre: 'Rosa Martínez',
    rut: '11.111.111-1',
    pin: '1234',
    edad: 72,
    tipoSangre: 'A+',
    alergias: 'Penicilina',
    cesfam: 'CESFAM Puerto Montt',
    iniciales: 'RM',
    color: '#d4edda',
    colorTexto: '#1a5c38',
    contactos: [
      { id: 'ct1', nombre: 'María Martínez (hija)', telefono: '+56 9 1234 5678' },
    ],
    medicamentos: [
      { id: 'm1', nombre: 'Losartán 50mg',    hora: '8:00 AM', frecuencia: 'Diario', tomado: true  },
      { id: 'm2', nombre: 'Metformina 500mg', hora: '9:00 AM', frecuencia: 'Diario', tomado: false },
    ],
    estado: 'pendiente',
  },
  '2': {
    id: '2',
    cuidadorId: 'c1',
    nombre: 'Pedro González',
    rut: '22.222.222-2',
    pin: '5678',
    edad: 68,
    tipoSangre: 'O+',
    alergias: 'Ninguna',
    cesfam: 'CESFAM Puerto Montt',
    iniciales: 'PG',
    color: '#d0e8f8',
    colorTexto: '#0c447c',
    contactos: [],
    medicamentos: [
      { id: 'm3', nombre: 'Atorvastatina 20mg', hora: '8:00 PM', frecuencia: 'Diario', tomado: true },
    ],
    estado: 'ok',
  },
};

export function AuthProvider({ children }) {
  const [usuario, setUsuario]     = useState(null);
  const [pacientes, setPacientes] = useState(PACIENTES_INICIALES);
  // Alertas de cambios hechos por el adulto mayor
  const [alertasCambio, setAlertasCambio] = useState([]);

  // ── Auth ──────────────────────────────────────────────────────────────────
  function loginCuidador(datos) { setUsuario({ rol: 'cuidador', ...datos }); }
  function logout()             { setUsuario(null); }

  // Login adulto: recibe rut + pin, busca en pacientes
  function loginAdulto(rut, pin) {
    const paciente = Object.values(pacientes).find(
      p => p.rut === rut && p.pin === pin
    );
    if (paciente) {
      setUsuario({ rol: 'adulto', pacienteId: paciente.id, nombre: paciente.nombre });
      return true;
    }
    return false;
  }

  // ── Pacientes ─────────────────────────────────────────────────────────────
  function getPacientesDeCuidador(cuidadorId) {
    return Object.values(pacientes).filter(p => p.cuidadorId === cuidadorId);
  }

  function getPaciente(id) {
    return pacientes[id] || null;
  }

  function agregarPaciente(datos, cuidadorId) {
    const id = Date.now().toString();
    const iniciales = datos.nombre.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const colores = [
      { color:'#d4edda', colorTexto:'#1a5c38' },
      { color:'#d0e8f8', colorTexto:'#0c447c' },
      { color:'#fff3cd', colorTexto:'#854f0b' },
    ];
    const c = colores[Object.keys(pacientes).length % colores.length];
    const nuevo = {
      id,
      cuidadorId,
      ...datos,
      iniciales,
      ...c,
      medicamentos: datos.medicamentos || [],
      contactos:    datos.contactos    || [],
      estado: 'ok',
    };
    setPacientes(prev => ({ ...prev, [id]: nuevo }));
    return id;
  }

  function actualizarPaciente(id, cambios, porAdulto = false) {
    setPacientes(prev => {
      const actual = prev[id];
      const actualizado = { ...actual, ...cambios };
      if (porAdulto) {
        // generar alerta para el cuidador
        setAlertasCambio(a => [...a, {
          id: Date.now().toString(),
          pacienteId: id,
          pacienteNombre: actual.nombre,
          mensaje: `${actual.nombre} editó su perfil`,
          hora: new Date().toLocaleTimeString('es-CL', { hour:'2-digit', minute:'2-digit' }),
          leida: false,
        }]);
      }
      return { ...prev, [id]: actualizado };
    });
  }

  function marcarAlertaLeida(alertaId) {
    setAlertasCambio(a => a.map(x => x.id === alertaId ? { ...x, leida: true } : x));
  }

  return (
    <AuthContext.Provider value={{
      usuario,
      loginCuidador, loginAdulto, logout,
      pacientes, getPacientesDeCuidador, getPaciente,
      agregarPaciente, actualizarPaciente,
      alertasCambio, marcarAlertaLeida,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
