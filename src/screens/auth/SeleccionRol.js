import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function SeleccionRol({ navigation }) {
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.logo}>🌿 SaludSur</Text>
        <Text style={s.sub}>¿Quién eres tú?</Text>
      </View>
      <View style={s.body}>
        <Text style={s.pregunta}>Elige cómo ingresar</Text>
        <TouchableOpacity style={s.tarjeta} onPress={() => navigation.navigate('LoginAdulto')} activeOpacity={0.75}>
          <View style={[s.icono, { backgroundColor: COLORS.verdeClaro }]}>
            <Text style={s.emoji}>👴</Text>
          </View>
          <View style={s.textos}>
            <Text style={s.titulo}>Soy adulto mayor</Text>
            <Text style={s.desc}>Entro con mi PIN personal</Text>
          </View>
          <Text style={s.flecha}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.tarjeta} onPress={() => navigation.navigate('LoginCuidador')} activeOpacity={0.75}>
          <View style={[s.icono, { backgroundColor: COLORS.azulClaro }]}>
            <Text style={s.emoji}>🩺</Text>
          </View>
          <View style={s.textos}>
            <Text style={s.titulo}>Soy cuidador</Text>
            <Text style={s.desc}>Entro con RUT y contraseña</Text>
          </View>
          <Text style={s.flecha}>›</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:     { flex: 1, backgroundColor: COLORS.fondo },
  header:   { backgroundColor: COLORS.verde, paddingVertical: 48, alignItems: 'center' },
  logo:     { fontSize: 30, fontWeight: '500', color: '#fff' },
  sub:      { fontSize: 15, color: 'rgba(255,255,255,0.85)', marginTop: 6 },
  body:     { flex: 1, padding: 20, justifyContent: 'center', gap: 16 },
  pregunta: { fontSize: 16, color: COLORS.textoSuave, textAlign: 'center', marginBottom: 8 },
  tarjeta:  { backgroundColor: COLORS.blanco, borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 0.5, borderColor: COLORS.grisBorde },
  icono:    { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  emoji:    { fontSize: 26 },
  textos:   { flex: 1 },
  titulo:   { fontSize: 18, fontWeight: '500', color: COLORS.texto },
  desc:     { fontSize: 13, color: COLORS.textoSuave, marginTop: 3 },
  flecha:   { fontSize: 28, color: COLORS.textoSuave },
});
