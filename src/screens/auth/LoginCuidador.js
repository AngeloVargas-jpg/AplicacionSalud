import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS } from '../../constants/colors';
import { formatearRut, validarRut } from '../../utils/rut';
import { useAuth } from '../../context/AuthContext';

export default function LoginCuidador({ navigation }) {
  const [rut, setRut]         = useState('');
  const [pass, setPass]       = useState('');
  const [verPass, setVerPass] = useState(false);
  const [error, setError]     = useState('');
  const { loginCuidador }     = useAuth();

  const rutValido   = validarRut(rut);
  const puedeEntrar = rutValido && pass.length >= 4;

  function manejarRut(texto) {
    const soloNum = texto.replace(/[^0-9kK]/g, '').toUpperCase();
    if (soloNum.length > 9) return;
    setRut(formatearRut(soloNum));
    setError('');
  }

  function ingresar() {
    if (rut === '12.345.678-5' && pass === '1234') loginCuidador({ nombre: 'Juan', rut, id: 'c1' });
    else setError('RUT o contraseña incorrectos');
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.volver}>
          <Text style={s.volverTexto}>‹ Volver</Text>
        </TouchableOpacity>
        <Text style={s.titulo}>Acceso cuidador</Text>
        <Text style={s.sub}>CESFAM Puerto Montt</Text>
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.body}>
        <View style={s.card}>
          <View style={s.campo}>
            <Text style={s.label}>RUT</Text>
            <View style={s.inputWrap}>
              <TextInput
                style={[s.input, rutValido && s.inputValido, rut.length > 8 && !rutValido && s.inputInvalido]}
                value={rut} onChangeText={manejarRut}
                placeholder="Escribe tu RUT" placeholderTextColor={COLORS.textoSuave}
                keyboardType="numeric" autoCapitalize="none" maxLength={12}
              />
              {rut.length > 3 && <Text style={[s.icono, { color: rutValido ? COLORS.verde : COLORS.rojo }]}>{rutValido ? '✓' : '✗'}</Text>}
            </View>
            <Text style={[s.pista, rutValido && { color: COLORS.verde }]}>
              {rut.length === 0 ? 'Solo escribe los números, el formato es automático'
                : rutValido ? 'RUT válido ✓'
                : 'Escribe todos los números de tu RUT'}
            </Text>
          </View>
          <View style={s.campo}>
            <Text style={s.label}>Contraseña</Text>
            <View style={s.inputWrap}>
              <TextInput
                style={[s.input, { paddingRight: 48 }]}
                value={pass} onChangeText={t => { setPass(t); setError(''); }}
                placeholder="••••••••" placeholderTextColor={COLORS.textoSuave}
                secureTextEntry={!verPass} autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setVerPass(v => !v)} style={s.ojito}>
                <Text style={{ fontSize: 18 }}>{verPass ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          {error ? <Text style={s.error}>{error}</Text> : null}
          <Text style={s.demo}>Prueba: RUT 12.345.678-5 / Clave 1234</Text>
          <TouchableOpacity style={[s.btn, !puedeEntrar && s.btnDeshabilitado]} onPress={ingresar} disabled={!puedeEntrar} activeOpacity={0.8}>
            <Text style={s.btnTexto}>Ingresar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: COLORS.fondo },
  header:           { backgroundColor: COLORS.azul, paddingVertical: 24, paddingHorizontal: 20, alignItems: 'center' },
  volver:           { position: 'absolute', left: 16, top: 26 },
  volverTexto:      { color: '#fff', fontSize: 18 },
  titulo:           { fontSize: 22, fontWeight: '500', color: '#fff' },
  sub:              { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  body:             { flex: 1, padding: 20, justifyContent: 'center' },
  card:             { backgroundColor: COLORS.blanco, borderRadius: 16, padding: 20, gap: 16, borderWidth: 0.5, borderColor: COLORS.grisBorde },
  campo:            { gap: 6 },
  label:            { fontSize: 13, color: COLORS.textoSuave },
  inputWrap:        { position: 'relative', justifyContent: 'center' },
  input:            { borderWidth: 1.5, borderColor: COLORS.grisBorde, borderRadius: 10, padding: 14, fontSize: 18, color: COLORS.texto },
  inputValido:      { borderColor: COLORS.verde },
  inputInvalido:    { borderColor: COLORS.rojo },
  icono:            { position: 'absolute', right: 14, fontSize: 20 },
  ojito:            { position: 'absolute', right: 12 },
  pista:            { fontSize: 12, color: COLORS.textoSuave },
  error:            { fontSize: 13, color: COLORS.rojo, textAlign: 'center' },
  demo:             { fontSize: 12, color: COLORS.textoSuave, textAlign: 'center' },
  btn:              { backgroundColor: COLORS.azul, borderRadius: 14, padding: 16, alignItems: 'center' },
  btnDeshabilitado: { opacity: 0.4 },
  btnTexto:         { color: '#fff', fontSize: 18, fontWeight: '500' },
});
