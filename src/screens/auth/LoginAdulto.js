import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { formatearRut, validarRut } from '../../utils/rut';

export default function LoginAdulto({ navigation }) {
  const [paso, setPaso]   = useState('rut'); // 'rut' | 'pin'
  const [rut, setRut]     = useState('');
  const [pin, setPin]     = useState('');
  const [error, setError] = useState('');
  const { loginAdulto }   = useAuth();

  // ── Paso 1: RUT ─────────────────────────────────────────────────────────
  const rutValido = validarRut(rut);

  function manejarRut(texto) {
    const soloNum = texto.replace(/[^0-9kK]/g, '').toUpperCase();
    if (soloNum.length > 9) return;
    setRut(formatearRut(soloNum));
    setError('');
  }

  function confirmarRut() {
    if (!rutValido) { setError('RUT inválido'); return; }
    setError('');
    setPaso('pin');
    setPin('');
  }

  // ── Paso 2: PIN ─────────────────────────────────────────────────────────
  function presionar(digito) {
    if (pin.length >= 4) return;
    const nuevo = pin + digito;
    setPin(nuevo);
    setError('');
    if (nuevo.length === 4) {
      setTimeout(() => {
        const ok = loginAdulto(rut, nuevo);
        if (!ok) { setPin(''); setError('RUT o PIN incorrecto, intenta de nuevo'); }
      }, 300);
    }
  }

  function borrar() { setPin(p => p.slice(0, -1)); setError(''); }

  const teclas = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => paso === 'pin' ? (setPaso('rut'), setPin(''), setError('')) : navigation.goBack()}
          style={s.volver}
        >
          <Text style={s.volverTexto}>‹ Volver</Text>
        </TouchableOpacity>
        <Text style={s.titulo}>{paso === 'rut' ? 'Ingresa tu RUT' : 'Ingresa tu PIN'}</Text>
        <Text style={s.sub}>{paso === 'rut' ? 'Escribe tu número de RUT' : 'Tu número secreto de 4 dígitos'}</Text>
      </View>

      {paso === 'rut' ? (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.body}>
          <View style={s.card}>
            <Text style={s.label}>RUT</Text>
            <View style={s.inputWrap}>
              <TextInput
                style={[s.input, rutValido && s.inputValido, rut.length > 8 && !rutValido && s.inputInvalido]}
                value={rut} onChangeText={manejarRut}
                placeholder="Escribe tu RUT" placeholderTextColor={COLORS.textoSuave}
                keyboardType="numeric" autoCapitalize="none" maxLength={12}
                autoFocus
              />
              {rut.length > 3 && (
                <Text style={[s.icono, { color: rutValido ? COLORS.verde : COLORS.rojo }]}>
                  {rutValido ? '✓' : '✗'}
                </Text>
              )}
            </View>
            <Text style={[s.pista, rutValido && { color: COLORS.verde }]}>
              {rut.length === 0 ? 'Solo escribe los números, el formato es automático'
                : rutValido ? 'RUT válido ✓'
                : 'Escribe todos los números de tu RUT'}
            </Text>
            {error ? <Text style={s.error}>{error}</Text> : null}
            <Text style={s.demo}>Demo: 11.111.111-1</Text>
            <TouchableOpacity
              style={[s.btn, !rutValido && s.btnDeshabilitado]}
              onPress={confirmarRut} disabled={!rutValido} activeOpacity={0.8}
            >
              <Text style={s.btnTexto}>Continuar →</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <View style={s.body}>
          <View style={s.rutChip}>
            <Text style={s.rutChipTexto}>👤 {rut}</Text>
          </View>
          <View style={s.puntos}>
            {[0,1,2,3].map(i => (
              <View key={i} style={[s.punto, pin.length > i && s.puntoLleno]} />
            ))}
          </View>
          {error
            ? <Text style={s.error}>{error}</Text>
            : <Text style={s.ayuda}>Demo PIN: 1234</Text>
          }
          <View style={s.teclado}>
            {teclas.map((t, i) => (
              t === '' ? <View key={i} style={s.teclaVacia} /> :
              <TouchableOpacity key={i} style={s.tecla} onPress={() => t === '⌫' ? borrar() : presionar(t)} activeOpacity={0.6}>
                <Text style={t === '⌫' ? s.teclaTextoSuave : s.teclaTexto}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: COLORS.fondo },
  header:           { backgroundColor: COLORS.verde, paddingVertical: 24, paddingHorizontal: 20, alignItems: 'center' },
  volver:           { position: 'absolute', left: 16, top: 26 },
  volverTexto:      { color: '#fff', fontSize: 18 },
  titulo:           { fontSize: 22, fontWeight: '500', color: '#fff' },
  sub:              { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  body:             { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', gap: 20 },
  // RUT
  card:             { backgroundColor: COLORS.blanco, borderRadius: 16, padding: 20, gap: 12, borderWidth: 0.5, borderColor: COLORS.grisBorde, width: '100%' },
  label:            { fontSize: 13, color: COLORS.textoSuave },
  inputWrap:        { position: 'relative', justifyContent: 'center' },
  input:            { borderWidth: 1.5, borderColor: COLORS.grisBorde, borderRadius: 10, padding: 14, fontSize: 22, color: COLORS.texto },
  inputValido:      { borderColor: COLORS.verde },
  inputInvalido:    { borderColor: COLORS.rojo },
  icono:            { position: 'absolute', right: 14, fontSize: 20 },
  pista:            { fontSize: 12, color: COLORS.textoSuave },
  demo:             { fontSize: 12, color: COLORS.textoSuave, textAlign: 'center' },
  btn:              { backgroundColor: COLORS.verde, borderRadius: 14, padding: 16, alignItems: 'center' },
  btnDeshabilitado: { opacity: 0.4 },
  btnTexto:         { color: '#fff', fontSize: 18, fontWeight: '500' },
  // PIN
  rutChip:          { backgroundColor: COLORS.verdeClaro, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8 },
  rutChipTexto:     { fontSize: 15, color: COLORS.verde, fontWeight: '500' },
  puntos:           { flexDirection: 'row', gap: 16 },
  punto:            { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: COLORS.verde, backgroundColor: '#fff' },
  puntoLleno:       { backgroundColor: COLORS.verde },
  error:            { fontSize: 14, color: COLORS.rojo },
  ayuda:            { fontSize: 13, color: COLORS.textoSuave },
  teclado:          { flexDirection: 'row', flexWrap: 'wrap', width: 280, gap: 10 },
  tecla:            { width: 82, height: 72, borderRadius: 14, backgroundColor: COLORS.blanco, borderWidth: 0.5, borderColor: COLORS.grisBorde, alignItems: 'center', justifyContent: 'center' },
  teclaVacia:       { width: 82, height: 72 },
  teclaTexto:       { fontSize: 28, fontWeight: '500', color: COLORS.texto },
  teclaTextoSuave:  { fontSize: 22, color: COLORS.textoSuave },
});
