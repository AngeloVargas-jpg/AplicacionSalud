import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';

export default function DetallePaciente({ navigation, route }) {
  const { pacienteId } = route.params;
  const { getPaciente } = useAuth();
  const p = getPaciente(pacienteId);

  if (!p) return null;

  return (
    <SafeAreaView style={s.safe}>
      <View style={[s.header, { backgroundColor: COLORS.azul }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.volver}>
          <Text style={s.volverTexto}>‹ Volver</Text>
        </TouchableOpacity>
        <Text style={s.titulo}>{p.nombre}</Text>
        <Text style={s.sub}>{p.edad} años — {p.cesfam}</Text>
      </View>
      <ScrollView contentContainerStyle={s.body}>
        {p.estado === 'pendiente' && (
          <View style={s.alerta}>
            <Text style={{ fontSize: 18 }}>💊</Text>
            <Text style={s.alertaTexto}>Tiene medicamentos pendientes hoy</Text>
          </View>
        )}

        {/* Info básica */}
        <Text style={s.seccion}>Información personal</Text>
        <View style={s.card}>
          <Fila label="RUT" valor={p.rut} borde />
          <Fila label="Edad" valor={`${p.edad} años`} borde />
          <Fila label="Tipo de sangre" valor={p.tipoSangre} borde />
          <Fila label="Alergias" valor={p.alergias} />
        </View>

        {/* Medicamentos */}
        <Text style={s.seccion}>Medicamentos de hoy</Text>
        <View style={s.card}>
          {p.medicamentos?.length === 0 && (
            <Text style={s.sinDatos}>Sin medicamentos registrados</Text>
          )}
          {p.medicamentos?.map((m, i) => (
            <View key={m.id} style={[s.fila, i < p.medicamentos.length - 1 && s.filaBorde]}>
              <View style={s.medInfo}>
                <Text style={s.medNombre}>{m.nombre}</Text>
                <Text style={s.medHora}>{m.hora} · {m.frecuencia}</Text>
              </View>
              <View style={[s.badge, { backgroundColor: m.tomado ? COLORS.verdeClaro : COLORS.amarilloClaro }]}>
                <Text style={[s.badgeTexto, { color: m.tomado ? COLORS.verde : COLORS.amarillo }]}>
                  {m.tomado ? 'Tomado ✓' : 'Pendiente'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Contactos */}
        <Text style={s.seccion}>Contactos de emergencia</Text>
        <View style={s.card}>
          {p.contactos?.length === 0 && (
            <Text style={s.sinDatos}>Sin contactos registrados</Text>
          )}
          {p.contactos?.map((c, i) => (
            <View key={c.id} style={[s.fila, i < p.contactos.length - 1 && s.filaBorde]}>
              <View style={{ flex: 1 }}>
                <Text style={s.medNombre}>{c.nombre}</Text>
                <Text style={s.medHora}>{c.telefono}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={s.btnEditar} activeOpacity={0.8}
          onPress={() => navigation.navigate('RegistrarPaciente')}>
          <Text style={s.btnEditarTexto}>✏️ Editar medicamentos</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Fila({ label, valor, borde }) {
  return (
    <View style={[s.fila, borde && s.filaBorde]}>
      <Text style={s.saludLabel}>{label}</Text>
      <Text style={s.saludValor}>{valor}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: COLORS.fondo },
  header:         { paddingVertical: 18, paddingHorizontal: 20, alignItems: 'center' },
  volver:         { position: 'absolute', left: 16, top: 20 },
  volverTexto:    { color: '#fff', fontSize: 18 },
  titulo:         { fontSize: 22, fontWeight: '500', color: '#fff' },
  sub:            { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  body:           { padding: 20, gap: 12 },
  alerta:         { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.rojoClaro, borderRadius: 12, padding: 14 },
  alertaTexto:    { fontSize: 14, color: COLORS.rojo, flex: 1 },
  seccion:        { fontSize: 13, color: COLORS.textoSuave, textTransform: 'uppercase', letterSpacing: 0.5 },
  card:           { backgroundColor: COLORS.blanco, borderRadius: 14, borderWidth: 0.5, borderColor: COLORS.grisBorde, overflow: 'hidden' },
  fila:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  filaBorde:      { borderBottomWidth: 0.5, borderBottomColor: COLORS.grisBorde },
  medInfo:        { flex: 1 },
  medNombre:      { fontSize: 15, fontWeight: '500', color: COLORS.texto },
  medHora:        { fontSize: 13, color: COLORS.textoSuave, marginTop: 2 },
  badge:          { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  badgeTexto:     { fontSize: 13 },
  saludLabel:     { fontSize: 14, color: COLORS.textoSuave },
  saludValor:     { fontSize: 14, fontWeight: '500', color: COLORS.texto },
  sinDatos:       { padding: 16, fontSize: 14, color: COLORS.textoSuave, textAlign: 'center' },
  btnEditar:      { backgroundColor: COLORS.azul, borderRadius: 14, padding: 16, alignItems: 'center' },
  btnEditarTexto: { color: '#fff', fontSize: 18, fontWeight: '500' },
});
