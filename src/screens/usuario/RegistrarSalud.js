import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function RegistrarSalud() {
  const [arriba, setArriba]     = useState(120);
  const [abajo, setAbajo]       = useState(80);
  const [feel, setFeel]         = useState(null);
  const [guardado, setGuardado] = useState(false);

  function cambiar(campo, delta) {
    if (campo === 'arriba') setArriba(v => Math.max(60, Math.min(220, v + delta)));
    else setAbajo(v => Math.max(40, Math.min(140, v + delta)));
  }

  if (guardado) return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}><Text style={s.titulo}>Mi salud</Text></View>
      <View style={s.exito}>
        <Text style={{ fontSize: 60 }}>✅</Text>
        <Text style={s.exitoTitulo}>¡Registro guardado!</Text>
        <Text style={s.exitoSub}>Tu presión de hoy quedó anotada</Text>
        <View style={s.resumen}>
          {[['Presión alta', String(arriba)], ['Presión baja', String(abajo)], ['Cómo me siento', feel || 'Sin indicar']].map(([k,v]) => (
            <View key={k} style={s.filaResumen}>
              <Text style={s.filaLabel}>{k}</Text>
              <Text style={s.filaValor}>{v}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={s.btnVolver} onPress={() => { setGuardado(false); setFeel(null); }}>
          <Text style={s.btnVolverTexto}>Nuevo registro</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.titulo}>Registrar presión</Text>
        <Text style={s.sub}>Mira los números del tensiómetro</Text>
      </View>
      <ScrollView contentContainerStyle={s.body}>
        {[
          ['arriba', arriba, 'Presión alta',  'El número más grande (ej. 120)'],
          ['abajo',  abajo,  'Presión baja',  'El número más pequeño (ej. 80)'],
        ].map(([campo, val, lbl, sub]) => (
          <View key={campo} style={s.card}>
            <Text style={s.label}>{lbl}</Text>
            <Text style={s.labelSub}>{sub}</Text>
            <View style={s.contador}>
              <TouchableOpacity style={s.btnNum} onPress={() => cambiar(campo, -1)}>
                <Text style={s.btnNumTexto}>−</Text>
              </TouchableOpacity>
              <Text style={s.numGrande}>{val}</Text>
              <TouchableOpacity style={s.btnNum} onPress={() => cambiar(campo, 1)}>
                <Text style={s.btnNumTexto}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={s.card}>
          <Text style={s.label}>¿Cómo te sientes ahora?</Text>
          <View style={s.feels}>
            {[['Bien','😊'],['Regular','😐'],['Mal','😞']].map(([txt, emoji]) => (
              <TouchableOpacity key={txt} style={[s.feelBtn, feel === txt && s.feelBtnActivo]} onPress={() => setFeel(txt)} activeOpacity={0.7}>
                <Text style={{ fontSize: 28 }}>{emoji}</Text>
                <Text style={[s.feelTexto, feel === txt && { color: COLORS.verde }]}>{txt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity style={s.btnGuardar} onPress={() => setGuardado(true)} activeOpacity={0.8}>
          <Text style={s.btnGuardarTexto}>💾 Guardar registro</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: COLORS.fondo },
  header:          { backgroundColor: COLORS.verde, paddingVertical: 18, paddingHorizontal: 20, alignItems: 'center' },
  titulo:          { fontSize: 22, fontWeight: '500', color: '#fff' },
  sub:             { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  body:            { padding: 20, gap: 14 },
  card:            { backgroundColor: COLORS.blanco, borderRadius: 16, padding: 18, borderWidth: 0.5, borderColor: COLORS.grisBorde, gap: 8 },
  label:           { fontSize: 17, fontWeight: '500', color: COLORS.texto },
  labelSub:        { fontSize: 13, color: COLORS.textoSuave },
  contador:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  btnNum:          { width: 56, height: 56, borderRadius: 28, borderWidth: 0.5, borderColor: COLORS.grisBorde, backgroundColor: COLORS.fondo, alignItems: 'center', justifyContent: 'center' },
  btnNumTexto:     { fontSize: 32, color: COLORS.texto },
  numGrande:       { fontSize: 48, fontWeight: '500', color: COLORS.verde, minWidth: 80, textAlign: 'center' },
  feels:           { flexDirection: 'row', gap: 10, marginTop: 4 },
  feelBtn:         { flex: 1, alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1.5, borderColor: COLORS.grisBorde, backgroundColor: COLORS.fondo, gap: 6 },
  feelBtnActivo:   { borderColor: COLORS.verde, backgroundColor: COLORS.verdeClaro },
  feelTexto:       { fontSize: 14, color: COLORS.textoSuave },
  btnGuardar:      { backgroundColor: COLORS.verde, borderRadius: 14, padding: 18, alignItems: 'center' },
  btnGuardarTexto: { color: '#fff', fontSize: 20, fontWeight: '500' },
  exito:           { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30, gap: 14 },
  exitoTitulo:     { fontSize: 24, fontWeight: '500', color: COLORS.texto },
  exitoSub:        { fontSize: 15, color: COLORS.textoSuave },
  resumen:         { width: '100%', gap: 8 },
  filaResumen:     { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: COLORS.blanco, borderRadius: 10, padding: 14, borderWidth: 0.5, borderColor: COLORS.grisBorde },
  filaLabel:       { fontSize: 14, color: COLORS.textoSuave },
  filaValor:       { fontSize: 14, fontWeight: '500', color: COLORS.verde },
  btnVolver:       { backgroundColor: COLORS.verde, borderRadius: 14, padding: 16, alignItems: 'center', width: '100%', marginTop: 8 },
  btnVolverTexto:  { color: '#fff', fontSize: 18, fontWeight: '500' },
});