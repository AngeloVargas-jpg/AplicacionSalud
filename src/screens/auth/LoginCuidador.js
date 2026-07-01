import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, TextInput, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { formatearRut, validarRut } from '../../utils/rut';

export default function LoginCuidador({ navigation }) {
  const [rut,      setRut]      = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const { loginCuidador } = useAuth();

  const rutValido = validarRut(rut);

  function manejarRut(t) {
    const s = t.replace(/[^0-9kK]/g, '').toUpperCase();
    if (s.length > 9) return;
    setRut(formatearRut(s));
  }

  async function entrar() {
    if (!rutValido || !password) return;
    setCargando(true);
    const ok = await loginCuidador(rut, password);
    setCargando(false);
    if (!ok) Alert.alert('Error', 'RUT o contraseña incorrectos');
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.volver}>
          <Text style={s.volverTexto}>‹ Volver</Text>
        </TouchableOpacity>
        <Text style={s.titulo}>Soy cuidador</Text>
        <Text style={s.sub}>Ingresa tus datos para continuar</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={s.body}>
          <View style={s.card}>
            <Text style={s.label}>RUT</Text>
            <TextInput
              style={[s.input, rutValido && s.inputValido]}
              value={rut} onChangeText={manejarRut}
              placeholder="Ej: 12.345.678-5"
              placeholderTextColor={COLORS.textoSuave}
              keyboardType="numeric" autoFocus
            />
            <Text style={s.label}>Contraseña</Text>
            <TextInput
              style={s.input}
              value={password} onChangeText={setPassword}
              placeholder="Tu contraseña"
              placeholderTextColor={COLORS.textoSuave}
              secureTextEntry
            />
            <TouchableOpacity
              style={[s.btn, (!rutValido || !password || cargando) && s.btnDeshabilitado]}
              onPress={entrar}
              disabled={!rutValido || !password || cargando}
              activeOpacity={0.8}
            >
              <Text style={s.btnTexto}>{cargando ? 'Entrando...' : 'Entrar →'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={s.demo}>Demo — RUT: 12.345.678-5 / Clave: 1234</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: COLORS.fondo },
  header:          { backgroundColor: COLORS.azul, paddingVertical: 24, paddingHorizontal: 20, alignItems: 'center' },
  volver:          { position: 'absolute', left: 16, top: 26 },
  volverTexto:     { color: '#fff', fontSize: 18 },
  titulo:          { fontSize: 22, fontWeight: '500', color: '#fff' },
  sub:             { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  body:            { flex: 1, padding: 20, justifyContent: 'center', gap: 12 },
  card:            { backgroundColor: COLORS.blanco, borderRadius: 16, padding: 20, gap: 12, borderWidth: 0.5, borderColor: COLORS.grisBorde },
  label:           { fontSize: 13, color: COLORS.textoSuave },
  input:           { borderWidth: 1.5, borderColor: COLORS.grisBorde, borderRadius: 10, padding: 14, fontSize: 16, color: COLORS.texto },
  inputValido:     { borderColor: COLORS.azul },
  btn:             { backgroundColor: COLORS.azul, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 4 },
  btnDeshabilitado:{ opacity: 0.4 },
  btnTexto:        { color: '#fff', fontSize: 18, fontWeight: '500' },
  demo:            { fontSize: 12, color: COLORS.textoSuave, textAlign: 'center' },
});