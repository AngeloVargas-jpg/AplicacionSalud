import React, { createContext, useContext, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario]         = useState(null);
  const [alertasCambio, setAlertasCambio] = useState([]);

  // ── Auth ─────────────────────────────────────────────────────────────────
  async function loginCuidador(rut, password) {
    const { data, error } = await supabase
      .from('cuidadores')
      .select('*')
      .eq('rut', rut)
      .eq('password', password)
      .single();

    if (error || !data) return false;
    setUsuario({ rol: 'cuidador', ...data });
    return true;
  }

  async function loginAdulto(rut, pin) {
    const { data, error } = await supabase
      .from('pacientes')
      .select('*')
      .eq('rut', rut)
      .eq('pin', pin)
      .single();

    if (error || !data) return false;
    setUsuario({ rol: 'adulto', pacienteId: data.id, nombre: data.nombre });
    return true;
  }

  function logout() { setUsuario(null); }

  // ── Pacientes ─────────────────────────────────────────────────────────────
  async function getPacientesDeCuidador(cuidadorId) {
    const { data } = await supabase
      .from('pacientes')
      .select('*, medicamentos(*), contactos(*)')
      .eq('cuidador_id', cuidadorId);
    return data || [];
  }

  async function getPaciente(id) {
    const { data } = await supabase
      .from('pacientes')
      .select('*, medicamentos(*), contactos(*)')
      .eq('id', id)
      .single();
    return data;
  }

  async function agregarPaciente(datos, cuidadorId) {
    // Insertar paciente
    const { data: paciente, error } = await supabase
      .from('pacientes')
      .insert({
        cuidador_id: cuidadorId,
        nombre:      datos.nombre,
        rut:         datos.rut,
        pin:         datos.pin,
        edad:        datos.edad,
        tipo_sangre: datos.tipoSangre,
        alergias:    datos.alergias,
        cesfam:      datos.cesfam,
      })
      .select()
      .single();

    if (error || !paciente) return null;

    // Insertar medicamentos
    if (datos.medicamentos?.length > 0) {
      await supabase.from('medicamentos').insert(
        datos.medicamentos.map(m => ({ paciente_id: paciente.id, ...m }))
      );
    }

    // Insertar contactos
    if (datos.contactos?.length > 0) {
      await supabase.from('contactos').insert(
        datos.contactos.map(c => ({ paciente_id: paciente.id, ...c }))
      );
    }

    return paciente.id;
  }

  async function actualizarPaciente(id, cambios, porAdulto = false) {
    await supabase.from('pacientes').update(cambios).eq('id', id);

    if (porAdulto) {
      const paciente = await getPaciente(id);
      await supabase.from('alertas').insert({
        cuidador_id:    paciente.cuidador_id,
        paciente_id:    id,
        mensaje:        `${paciente.nombre} editó su perfil`,
        leida:          false,
      });
    }
  }

  async function cargarAlertas(cuidadorId) {
    const { data } = await supabase
      .from('alertas')
      .select('*')
      .eq('cuidador_id', cuidadorId)
      .eq('leida', false)
      .order('created_at', { ascending: false });
    setAlertasCambio(data || []);
  }

  async function marcarAlertaLeida(alertaId) {
    await supabase.from('alertas').update({ leida: true }).eq('id', alertaId);
    setAlertasCambio(a => a.filter(x => x.id !== alertaId));
  }

  return (
    <AuthContext.Provider value={{
      usuario,
      loginCuidador, loginAdulto, logout,
      getPacientesDeCuidador, getPaciente,
      agregarPaciente, actualizarPaciente,
      alertasCambio, cargarAlertas, marcarAlertaLeida,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }