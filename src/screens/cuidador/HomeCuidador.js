import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';

export default function HomeCuidador({ navigation }) {
  const { usuario, logout, getPacientesDeCuidador, alertasCambio } = useAuth();
  const pacientes = getPacientesDeCuidador(usuario?.id);

  const alertasPendientes = alertasCambio.filter(a => !a.leida);
  const alertasMeds = pacientes.filter(p => p.estado === 'pendiente');

  const BADGES = {
    ok:       { bg: COLORS.verdeClaro,    texto: COLORS.verde },
    pendiente:{ bg: COLORS.amarilloClaro, texto: COLORS.amarillo },
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.titulo}>Hola, {usuario?.nombre} 👋</Text>
        <Text style={s.sub}>Cuidador CESFAM</Text>
        <TouchableOpacity onPress={logout} style={s.salir}><Text style={s.salirTexto}>Salir</Text></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={s.body}>

        {/* Alertas medicamentos */}
        {alertasMeds.map(p => (
          <View key={p.id} style={s.alerta}>
            <Text style={{ fontSize: 18 }}>⚠️</Text>
            <Text style={s.alertaTexto}>{p.nombre} tiene medicamentos pendientes</Text>
          </View>
        ))}

        {/* Alertas de cambios por adulto mayor */}
        {alertasPendientes.map(a => (
          <View key={a.id} style={[s.alerta, { backgroundColor: COLORS.azulClaro }]}>
            <Text style={{ fontSize: 18 }}>✏️</Text>
            <Text style={[s.alertaTexto, { color: COLORS.azul }]}>{a.mensaje} ({a.hora})</Text>
          </View>
        ))}

        {/* Stats */}
        <View style={s.stats}>
          <View style={s.stat}>
            <Text style={s.statNum}>{pacientes.length}</Text>
            <Text style={s.statLabel}>Pacientes</Text>
          </View>
          <View style={s.stat}>
            <Text style={[s.statNum, { color: COLORS.rojo }]}>
              {alertasMeds.length + alertasPendientes.length}
            </Text>
            <Text style={s.statLabel}>Alertas activas</Text>
          </View>
        </View>

        {/* Cabecera pacientes */}
        <View style={s.filaHeader}>
          <Text style={s.seccion}>Mis pacientes</Text>
          <TouchableOpacity
            style={s.btnNuevo}
            onPress={() => navigation.navigate('RegistrarPaciente')}
          >
            <Text style={s.btnNuevoTexto}>+ Nuevo</Text>
          </TouchableOpacity>
        </View>

        {pacientes.length === 0 && (
          <View style={s.vacio}>
            <Text style={s.vacioEmoji}>👥</Text>
            <Text style={s.vacioTexto}>Aún no tienes pacientes registrados</Text>
            <TouchableOpacity style={s.btnVacio} onPress={() => navigation.navigate('RegistrarPaciente')}>
              <Text style={s.btnVacioTexto}>Registrar primer paciente</Text>
            </TouchableOpacity>
          </View>
        )}

        {pacientes.map(p => (
          <TouchableOpacity key={p.id} style={s.tarjeta}
            onPress={() => navigation.navigate('DetallePaciente', { pacienteId: p.id })} activeOpacity={0.75}>
            <View style={[s.avatar, { backgroundColor: p.color }]}>
              <Text style={[s.avatarTexto, { color: p.colorTexto }]}>{p.iniciales}</Text>
            </View>
            <View style={s.info}>
              <Text style={s.nombre}>{p.nombre}</Text>
              <Text style={s.detalle}>{p.edad} años — {p.medicamentos?.map(m=>m.nombre).join(', ') || 'Sin medicamentos'}</Text>
              <View style={[s.badge, { backgroundColor: BADGES[p.estado]?.bg || COLORS.verdeClaro }]}>
                <Text style={[s.badgeTexto, { color: BADGES[p.estado]?.texto || COLORS.verde }]}>
                  {p.estado === 'ok' ? 'Al día' : 'Pendiente'}
                </Text>
              </View>
            </View>
            <Text style={{ fontSize: 22, color: COLORS.textoSuave }}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: COLORS.fondo },
  header:      { backgroundColor: COLORS.azul, paddingVertical: 18, paddingHorizontal: 20, alignItems: 'center' },
  titulo:      { fontSize: 22, fontWeight: '500', color: '#fff' },
  sub:         { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  salir:       { position: 'absolute', right: 16, top: 20 },
  salirTexto:  { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  body:        { padding: 20, gap: 12 },
  alerta:      { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.rojoClaro, borderRadius: 12, padding: 14 },
  alertaTexto: { fontSize: 14, color: COLORS.rojo, flex: 1 },
  stats:       { flexDirection: 'row', gap: 12 },
  stat:        { flex: 1, backgroundColor: COLORS.blanco, borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 0.5, borderColor: COLORS.grisBorde },
  statNum:     { fontSize: 34, fontWeight: '500', color: COLORS.verde },
  statLabel:   { fontSize: 12, color: COLORS.textoSuave, marginTop: 2 },
  filaHeader:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  seccion:     { fontSize: 13, color: COLORS.textoSuave, textTransform: 'uppercase', letterSpacing: 0.5 },
  btnNuevo:    { backgroundColor: COLORS.azul, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  btnNuevoTexto:{ color: '#fff', fontSize: 13, fontWeight: '500' },
  vacio:       { backgroundColor: COLORS.blanco, borderRadius: 14, padding: 30, alignItems: 'center', gap: 10, borderWidth: 0.5, borderColor: COLORS.grisBorde },
  vacioEmoji:  { fontSize: 40 },
  vacioTexto:  { fontSize: 15, color: COLORS.textoSuave, textAlign: 'center' },
  btnVacio:    { backgroundColor: COLORS.azul, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10, marginTop: 4 },
  btnVacioTexto:{ color: '#fff', fontSize: 14, fontWeight: '500' },
  tarjeta:     { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.blanco, borderRadius: 14, padding: 14, borderWidth: 0.5, borderColor: COLORS.grisBorde },
  avatar:      { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  avatarTexto: { fontSize: 16, fontWeight: '500' },
  info:        { flex: 1, gap: 3 },
  nombre:      { fontSize: 16, fontWeight: '500', color: COLORS.texto },
  detalle:     { fontSize: 13, color: COLORS.textoSuave },
  badge:       { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  badgeTexto:  { fontSize: 12 },
});
