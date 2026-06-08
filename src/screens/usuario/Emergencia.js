import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Linking, Alert } from 'react-native';
import { COLORS } from '../../constants/colors';

const CONTACTOS = [
  { id:'1', nombre:'María Gómez',     relacion:'Hija',            telefono:'+56912345678', iniciales:'MG', color:COLORS.verdeClaro,    colorTexto:COLORS.verde },
  { id:'2', nombre:'Juan Pérez',      relacion:'Cuidador CESFAM', telefono:'+56987654321', iniciales:'JP', color:COLORS.azulClaro,     colorTexto:COLORS.azul },
  { id:'3', nombre:'Carlos Rodríguez',relacion:'Hijo',            telefono:'+56911223344', iniciales:'CR', color:COLORS.amarilloClaro, colorTexto:COLORS.amarillo },
];

function llamar(numero) {
  Linking.openURL(`tel:${numero}`).catch(() => Alert.alert('Error', 'No se pudo realizar la llamada'));
}

export default function Emergencia({ navigation }) {
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.volver}>
          <Text style={s.volverTexto}>‹ Volver</Text>
        </TouchableOpacity>
        <Text style={s.titulo}>Emergencia</Text>
        <Text style={s.sub}>Contacto rápido</Text>
      </View>
      <ScrollView contentContainerStyle={s.body}>
        <TouchableOpacity style={s.btnSOS} onPress={() => llamar('131')} activeOpacity={0.8}>
          <Text style={{ fontSize: 34 }}>📞</Text>
          <Text style={s.btnSOSTexto}>Llamar al 131</Text>
          <Text style={s.btnSOSSub}>Servicio de emergencia SAMU</Text>
        </TouchableOpacity>
        <Text style={s.seccion}>Mis contactos de confianza</Text>
        {CONTACTOS.map(c => (
          <TouchableOpacity key={c.id} style={s.contacto} onPress={() => llamar(c.telefono)} activeOpacity={0.75}>
            <View style={[s.avatar, { backgroundColor: c.color }]}>
              <Text style={[s.avatarTexto, { color: c.colorTexto }]}>{c.iniciales}</Text>
            </View>
            <View style={s.info}>
              <Text style={s.nombre}>{c.nombre}</Text>
              <Text style={s.relacion}>{c.relacion}</Text>
            </View>
            <View style={[s.llamarBtn, { backgroundColor: COLORS.verdeClaro }]}>
              <Text style={{ fontSize: 20 }}>📞</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: COLORS.fondo },
  header:      { backgroundColor: '#a32d2d', paddingVertical: 18, paddingHorizontal: 20, alignItems: 'center' },
  volver:      { position: 'absolute', left: 16, top: 20 },
  volverTexto: { color: '#fff', fontSize: 18 },
  titulo:      { fontSize: 22, fontWeight: '500', color: '#fff' },
  sub:         { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  body:        { padding: 20, gap: 12 },
  btnSOS:      { backgroundColor: '#e24b4a', borderRadius: 16, padding: 26, alignItems: 'center', gap: 6 },
  btnSOSTexto: { fontSize: 28, fontWeight: '500', color: '#fff' },
  btnSOSSub:   { fontSize: 13, color: 'rgba(255,255,255,0.85)' },
  seccion:     { fontSize: 13, color: COLORS.textoSuave, textTransform: 'uppercase', letterSpacing: 0.5 },
  contacto:    { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.blanco, borderRadius: 14, padding: 14, borderWidth: 0.5, borderColor: COLORS.grisBorde },
  avatar:      { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  avatarTexto: { fontSize: 15, fontWeight: '500' },
  info:        { flex: 1 },
  nombre:      { fontSize: 16, fontWeight: '500', color: COLORS.texto },
  relacion:    { fontSize: 13, color: COLORS.textoSuave, marginTop: 2 },
  llamarBtn:   { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
