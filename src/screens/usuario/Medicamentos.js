import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { COLORS } from '../../constants/colors';

const MEDS = [
  { id:'1', nombre:'Losartán 50mg',     dosis:'1 pastilla', hora:'8:00 AM',  tomado:true  },
  { id:'2', nombre:'Metformina 500mg',  dosis:'1 pastilla', hora:'9:00 AM',  tomado:false },
  { id:'3', nombre:'Atorvastatina 20mg',dosis:'1 pastilla', hora:'8:00 PM',  tomado:false },
];

function FilaMed({ med, onToggle }) {
  return (
    <View style={s.fila}>
      <View style={s.medIcono}><Text style={{ fontSize: 22 }}>💊</Text></View>
      <View style={s.medInfo}>
        <Text style={s.medNombre}>{med.nombre}</Text>
        <Text style={s.medDetalle}>⏰ {med.hora} — {med.dosis}</Text>
      </View>
      <TouchableOpacity style={[s.check, med.tomado && s.checkListo]} onPress={() => onToggle(med.id)} activeOpacity={0.7}>
        {med.tomado && <Text style={{ color: '#fff', fontSize: 18 }}>✓</Text>}
      </TouchableOpacity>
    </View>
  );
}

export default function Medicamentos() {
  const [meds, setMeds] = useState(MEDS);
  function toggleTomado(id) { setMeds(prev => prev.map(m => m.id === id ? { ...m, tomado: !m.tomado } : m)); }
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.titulo}>Mis medicamentos</Text>
        <Text style={s.sub}>Hoy, martes 3 de junio</Text>
      </View>
      <ScrollView contentContainerStyle={s.body}>
        <Text style={s.seccion}>☀️ Mañana</Text>
        <View style={s.card}>{meds.filter(m => m.hora.includes('AM')).map(m => <FilaMed key={m.id} med={m} onToggle={toggleTomado} />)}</View>
        <Text style={s.seccion}>🌙 Tarde / Noche</Text>
        <View style={s.card}>{meds.filter(m => m.hora.includes('PM')).map(m => <FilaMed key={m.id} med={m} onToggle={toggleTomado} />)}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: COLORS.fondo },
  header:     { backgroundColor: COLORS.verde, paddingVertical: 18, paddingHorizontal: 20, alignItems: 'center' },
  titulo:     { fontSize: 22, fontWeight: '500', color: '#fff' },
  sub:        { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  body:       { padding: 20, gap: 10 },
  seccion:    { fontSize: 13, color: COLORS.textoSuave, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 8 },
  card:       { backgroundColor: COLORS.blanco, borderRadius: 16, borderWidth: 0.5, borderColor: COLORS.grisBorde, overflow: 'hidden' },
  fila:       { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 0.5, borderBottomColor: COLORS.grisBorde },
  medIcono:   { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.verdeClaro, alignItems: 'center', justifyContent: 'center' },
  medInfo:    { flex: 1 },
  medNombre:  { fontSize: 16, fontWeight: '500', color: COLORS.texto },
  medDetalle: { fontSize: 13, color: COLORS.textoSuave, marginTop: 2 },
  check:      { width: 38, height: 38, borderRadius: 19, borderWidth: 2, borderColor: COLORS.verde, alignItems: 'center', justifyContent: 'center' },
  checkListo: { backgroundColor: COLORS.verde },
});
