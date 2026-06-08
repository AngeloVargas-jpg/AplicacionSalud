import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';

export default function HomeAdulto({ navigation }) {
  const { usuario, logout } = useAuth();
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.logo}>🌿 SaludSur</Text>
        <Text style={s.fecha}>Martes, 3 de junio</Text>
        <TouchableOpacity onPress={logout} style={s.salir}><Text style={s.salirTexto}>Salir</Text></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={s.body}>
        <Text style={s.saludo}>¡Hola, {usuario?.nombre}!</Text>
        <Text style={s.pregunta}>¿Qué necesitas hacer hoy?</Text>
        <View style={s.alerta}>
          <Text style={s.alertaEmoji}>🔔</Text>
          <Text style={s.alertaTexto}>Tienes 2 medicamentos pendientes hoy</Text>
        </View>
        <TouchableOpacity style={[s.btn, { backgroundColor: COLORS.verdeClaro }]} onPress={() => navigation.navigate('Medicamentos')} activeOpacity={0.75}>
          <Text style={s.btnEmoji}>💊</Text>
          <Text style={[s.btnTexto, { color: COLORS.verde }]}>Tomar medicamento</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.btn, { backgroundColor: COLORS.azulClaro }]} onPress={() => navigation.navigate('Salud')} activeOpacity={0.75}>
          <Text style={s.btnEmoji}>❤️</Text>
          <Text style={[s.btnTexto, { color: COLORS.azul }]}>Registrar salud</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.btn, { backgroundColor: COLORS.rojoClaro }]} onPress={() => navigation.navigate('Emergencia')} activeOpacity={0.75}>
          <Text style={s.btnEmoji}>🚨</Text>
          <Text style={[s.btnTexto, { color: COLORS.rojo }]}>SOS Emergencia</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: COLORS.fondo },
  header:      { backgroundColor: COLORS.verde, paddingVertical: 18, paddingHorizontal: 20, alignItems: 'center' },
  logo:        { fontSize: 24, fontWeight: '500', color: '#fff' },
  fecha:       { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  salir:       { position: 'absolute', right: 16, top: 20 },
  salirTexto:  { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  body:        { padding: 20, gap: 12 },
  saludo:      { fontSize: 26, fontWeight: '500', color: COLORS.texto, textAlign: 'center', marginTop: 8 },
  pregunta:    { fontSize: 15, color: COLORS.textoSuave, textAlign: 'center', marginBottom: 4 },
  alerta:      { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.amarilloClaro, borderRadius: 12, padding: 14 },
  alertaEmoji: { fontSize: 20 },
  alertaTexto: { fontSize: 14, color: COLORS.amarillo, flex: 1 },
  btn:         { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 22, borderRadius: 16 },
  btnEmoji:    { fontSize: 30 },
  btnTexto:    { fontSize: 20, fontWeight: '500' },
});
