import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { formatearRut, validarRut } from '../../utils/rut';

const TIPOS_SANGRE = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

export default function RegistrarPaciente({ navigation }) {
  const { usuario, agregarPaciente } = useAuth();

  const [nombre,     setNombre]     = useState('');
  const [rut,        setRut]        = useState('');
  const [edad,       setEdad]       = useState('');
  const [tipoSangre, setTipoSangre] = useState('');
  const [alergias,   setAlergias]   = useState('');
  const [cesfam,     setCesfam]     = useState('');
  const [pin,        setPin]        = useState('');
  const [pinConf,    setPinConf]    = useState('');
  const [meds,       setMeds]       = useState([{ nombre:'', hora:'', frecuencia:'Diario' }]);
  const [contactos,  setContactos]  = useState([{ nombre:'', telefono:'' }]);
  const [cargando,   setCargando]   = useState(false);

  const rutValido    = validarRut(rut);
  const pinOk        = pin.length === 4 && pin === pinConf;
  const puedeGuardar = nombre.trim() && rutValido && edad && tipoSangre && pinOk && !cargando;

  function manejarRut(t) {
    const s = t.replace(/[^0-9kK]/g, '').toUpperCase();
    if (s.length > 9) return;
    setRut(formatearRut(s));
  }

  function addMed()           { setMeds(m => [...m, { nombre:'', hora:'', frecuencia:'Diario' }]); }
  function removeMed(i)       { setMeds(m => m.filter((_,j) => j !== i)); }
  function updateMed(i, k, v) { setMeds(m => m.map((x,j) => j===i ? { ...x, [k]:v } : x)); }

  function addContacto()           { setContactos(c => [...c, { nombre:'', telefono:'' }]); }
  function removeContacto(i)       { setContactos(c => c.filter((_,j) => j !== i)); }
  function updateContacto(i, k, v) { setContactos(c => c.map((x,j) => j===i ? { ...x, [k]:v } : x)); }

  async function guardar() {
    setCargando(true);
    const medsLimpios = meds.filter(m => m.nombre.trim());
    const contactosLimpios = contactos.filter(c => c.nombre.trim());

    const id = await agregarPaciente({
      nombre:      nombre.trim(),
      rut,
      pin,
      edad:        parseInt(edad),
      tipoSangre,
      alergias:    alergias.trim() || 'Ninguna',
      cesfam:      cesfam.trim()   || 'Sin asignar',
      medicamentos: medsLimpios,
      contactos:    contactosLimpios,
    }, usuario.id);

    setCargando(false);

    if (id) {
      Alert.alert('✅ Paciente registrado', `${nombre} fue guardado en la base de datos.\n\nRUT: ${rut}\nPIN: ${pin}`, [
        { text: 'Listo', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('Error', 'No se pudo registrar el paciente. Verifica que el RUT no esté duplicado.');
    }
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.volver}>
          <Text style={s.volverTexto}>‹ Volver</Text>
        </TouchableOpacity>
        <Text style={s.titulo}>Nuevo paciente</Text>
        <Text style={s.sub}>Ingresa los datos del adulto mayor</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">

          <Text style={s.seccion}>📋 Datos personales</Text>
          <View style={s.card}>
            <Campo label="Nombre completo" valor={nombre} onChange={setNombre} placeholder="Ej: Rosa Martínez" />
            <View style={s.sep} />
            <Text style={s.label}>RUT</Text>
            <View style={s.inputWrap}>
              <TextInput
                style={[s.input, rutValido && s.inputValido, rut.length > 8 && !rutValido && s.inputInvalido]}
                value={rut} onChangeText={manejarRut}
                placeholder="Solo números" placeholderTextColor={COLORS.textoSuave}
                keyboardType="numeric" maxLength={12}
              />
              {rut.length > 3 && (
                <Text style={[s.validIcon, { color: rutValido ? COLORS.verde : COLORS.rojo }]}>
                  {rutValido ? '✓' : '✗'}
                </Text>
              )}
            </View>
            <View style={s.sep} />
            <Campo label="Edad" valor={edad} onChange={setEdad} placeholder="Ej: 72" keyboardType="numeric" />
            <View style={s.sep} />
            <Text style={s.label}>Tipo de sangre</Text>
            <View style={s.chips}>
              {TIPOS_SANGRE.map(t => (
                <TouchableOpacity key={t} style={[s.chip, tipoSangre===t && s.chipActivo]} onPress={() => setTipoSangre(t)}>
                  <Text style={[s.chipTexto, tipoSangre===t && s.chipTextoActivo]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={s.sep} />
            <Campo label="Alergias (opcional)" valor={alergias} onChange={setAlergias} placeholder="Ej: Penicilina" />
            <View style={s.sep} />
            <Campo label="CESFAM (opcional)" valor={cesfam} onChange={setCesfam} placeholder="Ej: CESFAM Puerto Montt" />
          </View>

          <Text style={s.seccion}>🔐 PIN de acceso</Text>
          <View style={s.card}>
            <Text style={s.hint}>El paciente usará este PIN junto a su RUT para entrar.</Text>
            <View style={s.sep} />
            <Campo label="PIN (4 dígitos)" valor={pin} onChange={t => setPin(t.replace(/\D/g,'').slice(0,4))}
              placeholder="••••" keyboardType="numeric" secureTextEntry maxLength={4} />
            <View style={s.sep} />
            <Campo label="Confirmar PIN" valor={pinConf} onChange={t => setPinConf(t.replace(/\D/g,'').slice(0,4))}
              placeholder="••••" keyboardType="numeric" secureTextEntry maxLength={4} />
            {pin.length === 4 && pinConf.length === 4 && !pinOk && (
              <Text style={s.errorTexto}>Los PIN no coinciden</Text>
            )}
            {pinOk && <Text style={s.okTexto}>✓ PIN confirmado</Text>}
          </View>

          <Text style={s.seccion}>💊 Medicamentos</Text>
          <View style={s.card}>
            {meds.map((m, i) => (
              <View key={i}>
                {i > 0 && <View style={s.sep} />}
                <View style={s.filaHeader}>
                  <Text style={s.label}>Medicamento {i+1}</Text>
                  {i > 0 && <TouchableOpacity onPress={() => removeMed(i)}><Text style={s.eliminar}>✕ Eliminar</Text></TouchableOpacity>}
                </View>
                <TextInput style={s.input} value={m.nombre} onChangeText={v => updateMed(i,'nombre',v)}
                  placeholder="Nombre y dosis — Ej: Losartán 50mg" placeholderTextColor={COLORS.textoSuave} />
                <View style={{ height: 8 }} />
                <View style={s.fila2}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.label}>Hora</Text>
                    <TextInput style={s.input} value={m.hora} onChangeText={v => updateMed(i,'hora',v)}
                      placeholder="Ej: 8:00 AM" placeholderTextColor={COLORS.textoSuave} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.label}>Frecuencia</Text>
                    <TextInput style={s.input} value={m.frecuencia} onChangeText={v => updateMed(i,'frecuencia',v)}
                      placeholder="Diario" placeholderTextColor={COLORS.textoSuave} />
                  </View>
                </View>
              </View>
            ))}
            <TouchableOpacity style={s.btnAgregar} onPress={addMed}>
              <Text style={s.btnAgregarTexto}>+ Agregar medicamento</Text>
            </TouchableOpacity>
          </View>

          <Text style={s.seccion}>📞 Contactos de emergencia</Text>
          <View style={s.card}>
            {contactos.map((c, i) => (
              <View key={i}>
                {i > 0 && <View style={s.sep} />}
                <View style={s.filaHeader}>
                  <Text style={s.label}>Contacto {i+1}</Text>
                  {i > 0 && <TouchableOpacity onPress={() => removeContacto(i)}><Text style={s.eliminar}>✕ Eliminar</Text></TouchableOpacity>}
                </View>
                <TextInput style={s.input} value={c.nombre} onChangeText={v => updateContacto(i,'nombre',v)}
                  placeholder="Nombre y relación" placeholderTextColor={COLORS.textoSuave} />
                <View style={{ height: 8 }} />
                <TextInput style={s.input} value={c.telefono} onChangeText={v => updateContacto(i,'telefono',v)}
                  placeholder="+56 9 xxxx xxxx" placeholderTextColor={COLORS.textoSuave} keyboardType="phone-pad" />
              </View>
            ))}
            <TouchableOpacity style={s.btnAgregar} onPress={addContacto}>
              <Text style={s.btnAgregarTexto}>+ Agregar contacto</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[s.btnGuardar, !puedeGuardar && s.btnDeshabilitado]}
            onPress={guardar} disabled={!puedeGuardar} activeOpacity={0.8}
          >
            {cargando
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.btnGuardarTexto}>✓ Registrar paciente</Text>
            }
          </TouchableOpacity>
          <View style={{ height: 32 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Campo({ label, valor, onChange, placeholder, keyboardType, secureTextEntry, maxLength }) {
  return (
    <View>
      <Text style={s.label}>{label}</Text>
      <TextInput style={s.input} value={valor} onChangeText={onChange}
        placeholder={placeholder} placeholderTextColor={COLORS.textoSuave}
        keyboardType={keyboardType} secureTextEntry={secureTextEntry} maxLength={maxLength} />
    </View>
  );
}

const s = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: COLORS.fondo },
  header:           { backgroundColor: COLORS.azul, paddingVertical: 24, paddingHorizontal: 20, alignItems: 'center' },
  volver:           { position: 'absolute', left: 16, top: 26 },
  volverTexto:      { color: '#fff', fontSize: 18 },
  titulo:           { fontSize: 22, fontWeight: '500', color: '#fff' },
  sub:              { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  body:             { padding: 20, gap: 8 },
  seccion:          { fontSize: 13, color: COLORS.textoSuave, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 8 },
  card:             { backgroundColor: COLORS.blanco, borderRadius: 14, padding: 16, gap: 8, borderWidth: 0.5, borderColor: COLORS.grisBorde },
  sep:              { height: 0.5, backgroundColor: COLORS.grisBorde },
  label:            { fontSize: 13, color: COLORS.textoSuave },
  hint:             { fontSize: 13, color: COLORS.textoSuave, lineHeight: 19 },
  input:            { borderWidth: 1.5, borderColor: COLORS.grisBorde, borderRadius: 10, padding: 12, fontSize: 16, color: COLORS.texto },
  inputWrap:        { position: 'relative', justifyContent: 'center' },
  inputValido:      { borderColor: COLORS.verde },
  inputInvalido:    { borderColor: COLORS.rojo },
  validIcon:        { position: 'absolute', right: 12, fontSize: 18 },
  chips:            { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:             { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1.5, borderColor: COLORS.grisBorde, backgroundColor: COLORS.fondo },
  chipActivo:       { borderColor: COLORS.azul, backgroundColor: COLORS.azulClaro },
  chipTexto:        { fontSize: 14, color: COLORS.texto },
  chipTextoActivo:  { color: COLORS.azul, fontWeight: '500' },
  filaHeader:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fila2:            { flexDirection: 'row', gap: 10 },
  eliminar:         { fontSize: 13, color: COLORS.rojo },
  btnAgregar:       { paddingVertical: 10, alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.azul, borderRadius: 10, borderStyle: 'dashed' },
  btnAgregarTexto:  { fontSize: 14, color: COLORS.azul, fontWeight: '500' },
  errorTexto:       { fontSize: 13, color: COLORS.rojo, textAlign: 'center' },
  okTexto:          { fontSize: 13, color: COLORS.verde, textAlign: 'center' },
  btnGuardar:       { backgroundColor: COLORS.azul, borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 8 },
  btnDeshabilitado: { opacity: 0.4 },
  btnGuardarTexto:  { color: '#fff', fontSize: 18, fontWeight: '500' },
});