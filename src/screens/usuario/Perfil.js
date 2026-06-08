import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView, TextInput, Alert
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';

export default function Perfil() {
  const { usuario, getPaciente, actualizarPaciente, logout } = useAuth();
  const paciente = getPaciente(usuario?.pacienteId);

  const [editando, setEditando] = useState(false);
  const [alergias, setAlergias] = useState(paciente?.alergias || '');
  const [cesfam,   setCesfam]   = useState(paciente?.cesfam   || '');

  if (!paciente) return null;

  function guardarCambios() {
    actualizarPaciente(paciente.id, { alergias, cesfam }, true /* porAdulto */);
    setEditando(false);
    Alert.alert('✅ Perfil actualizado', 'Se notificó a tu cuidador sobre los cambios.');
  }

  function cancelar() {
    setAlergias(paciente.alergias || '');
    setCesfam(paciente.cesfam || '');
    setEditando(false);
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.titulo}>Mi Perfil</Text>
        <Text style={s.sub}>👤 {paciente.nombre}</Text>
      </View>
      <ScrollView contentContainerStyle={s.body}>

        {/* Avatar */}
        <View style={s.avatarWrap}>
          <View style={[s.avatar, { backgroundColor: paciente.color }]}>
            <Text style={[s.avatarTexto, { color: paciente.colorTexto }]}>{paciente.iniciales}</Text>
          </View>
          <Text style={s.avatarNombre}>{paciente.nombre}</Text>
          <Text style={s.avatarRut}>RUT: {paciente.rut}</Text>
        </View>

        {/* Info personal (solo lectura) */}
        <Text style={s.seccion}>Información personal</Text>
        <View style={s.card}>
          <Fila label="Edad"          valor={`${paciente.edad} años`} borde />
          <Fila label="Tipo de sangre" valor={paciente.tipoSangre}     borde />
          <Fila label="CESFAM"        valor={paciente.cesfam}          borde={editando} />
          {editando ? (
            <View style={s.campoEdit}>
              <Text style={s.label}>CESFAM asignado</Text>
              <TextInput style={s.input} value={cesfam} onChangeText={setCesfam}
                placeholder="CESFAM..." placeholderTextColor={COLORS.textoSuave} />
            </View>
          ) : null}
          {!editando && <Fila label="Alergias" valor={paciente.alergias} />}
          {editando && (
            <View style={s.campoEdit}>
              <Text style={s.label}>Alergias</Text>
              <TextInput style={s.input} value={alergias} onChangeText={setAlergias}
                placeholder="Ej: Penicilina..." placeholderTextColor={COLORS.textoSuave} />
            </View>
          )}
        </View>

        {/* Medicamentos (solo lectura) */}
        <Text style={s.seccion}>Mis medicamentos</Text>
        <View style={s.card}>
          {paciente.medicamentos?.length === 0 && (
            <Text style={s.sinDatos}>Sin medicamentos registrados</Text>
          )}
          {paciente.medicamentos?.map((m, i) => (
            <View key={m.id} style={[s.fila, i < paciente.medicamentos.length - 1 && s.filaBorde]}>
              <View style={{ flex: 1 }}>
                <Text style={s.medNombre}>{m.nombre}</Text>
                <Text style={s.medHora}>{m.hora} · {m.frecuencia}</Text>
              </View>
              <View style={[s.badge, { backgroundColor: m.tomado ? COLORS.verdeClaro : COLORS.amarilloClaro }]}>
                <Text style={[s.badgeTexto, { color: m.tomado ? COLORS.verde : COLORS.amarillo }]}>
                  {m.tomado ? '✓' : '⏳'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Contactos (solo lectura) */}
        <Text style={s.seccion}>Contactos de emergencia</Text>
        <View style={s.card}>
          {paciente.contactos?.length === 0 && (
            <Text style={s.sinDatos}>Sin contactos registrados</Text>
          )}
          {paciente.contactos?.map((c, i) => (
            <View key={c.id} style={[s.fila, i < paciente.contactos.length - 1 && s.filaBorde]}>
              <View style={{ flex: 1 }}>
                <Text style={s.medNombre}>{c.nombre}</Text>
                <Text style={s.medHora}>{c.telefono}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Botones */}
        {!editando ? (
          <TouchableOpacity style={s.btnEditar} onPress={() => setEditando(true)} activeOpacity={0.8}>
            <Text style={s.btnEditarTexto}>✏️ Editar mis datos</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ gap: 10 }}>
            <View style={s.alertaEdit}>
              <Text style={{ fontSize: 16 }}>ℹ️</Text>
              <Text style={s.alertaEditTexto}>Al guardar, se notificará a tu cuidador sobre los cambios.</Text>
            </View>
            <TouchableOpacity style={s.btnGuardar} onPress={guardarCambios} activeOpacity={0.8}>
              <Text style={s.btnGuardarTexto}>✓ Guardar cambios</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.btnCancelar} onPress={cancelar} activeOpacity={0.8}>
              <Text style={s.btnCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={s.btnSalir} onPress={logout} activeOpacity={0.8}>
          <Text style={s.btnSalirTexto}>Cerrar sesión</Text>
        </TouchableOpacity>
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Fila({ label, valor, borde }) {
  return (
    <View style={[st.fila, borde && st.filaBorde]}>
      <Text style={st.label}>{label}</Text>
      <Text style={st.valor}>{valor}</Text>
    </View>
  );
}
const st = StyleSheet.create({
  fila:      { flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding: 14 },
  filaBorde: { borderBottomWidth: 0.5, borderBottomColor: COLORS.grisBorde },
  label:     { fontSize: 14, color: COLORS.textoSuave },
  valor:     { fontSize: 14, fontWeight: '500', color: COLORS.texto },
});

const s = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: COLORS.fondo },
  header:         { backgroundColor: COLORS.verde, paddingVertical: 18, paddingHorizontal: 20, alignItems: 'center' },
  titulo:         { fontSize: 22, fontWeight: '500', color: '#fff' },
  sub:            { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  body:           { padding: 20, gap: 12 },
  avatarWrap:     { alignItems: 'center', gap: 6, paddingVertical: 8 },
  avatar:         { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  avatarTexto:    { fontSize: 24, fontWeight: '500' },
  avatarNombre:   { fontSize: 20, fontWeight: '500', color: COLORS.texto },
  avatarRut:      { fontSize: 13, color: COLORS.textoSuave },
  seccion:        { fontSize: 13, color: COLORS.textoSuave, textTransform: 'uppercase', letterSpacing: 0.5 },
  card:           { backgroundColor: COLORS.blanco, borderRadius: 14, borderWidth: 0.5, borderColor: COLORS.grisBorde, overflow: 'hidden' },
  fila:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  filaBorde:      { borderBottomWidth: 0.5, borderBottomColor: COLORS.grisBorde },
  campoEdit:      { padding: 14, gap: 6, borderTopWidth: 0.5, borderTopColor: COLORS.grisBorde },
  label:          { fontSize: 13, color: COLORS.textoSuave },
  input:          { borderWidth: 1.5, borderColor: COLORS.grisBorde, borderRadius: 10, padding: 12, fontSize: 16, color: COLORS.texto },
  medNombre:      { fontSize: 15, fontWeight: '500', color: COLORS.texto },
  medHora:        { fontSize: 13, color: COLORS.textoSuave, marginTop: 2 },
  badge:          { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  badgeTexto:     { fontSize: 13 },
  sinDatos:       { padding: 16, fontSize: 14, color: COLORS.textoSuave, textAlign: 'center' },
  alertaEdit:     { flexDirection: 'row', gap: 8, backgroundColor: COLORS.azulClaro, borderRadius: 12, padding: 12, alignItems: 'flex-start' },
  alertaEditTexto:{ fontSize: 13, color: COLORS.azul, flex: 1, lineHeight: 18 },
  btnEditar:      { backgroundColor: COLORS.verde, borderRadius: 14, padding: 16, alignItems: 'center' },
  btnEditarTexto: { color: '#fff', fontSize: 16, fontWeight: '500' },
  btnGuardar:     { backgroundColor: COLORS.verde, borderRadius: 14, padding: 16, alignItems: 'center' },
  btnGuardarTexto:{ color: '#fff', fontSize: 16, fontWeight: '500' },
  btnCancelar:    { backgroundColor: COLORS.blanco, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.grisBorde },
  btnCancelarTexto:{ color: COLORS.textoSuave, fontSize: 16 },
  btnSalir:       { backgroundColor: COLORS.rojoClaro, borderRadius: 14, padding: 14, alignItems: 'center', marginTop: 4 },
  btnSalirTexto:  { color: COLORS.rojo, fontSize: 16, fontWeight: '500' },
});
