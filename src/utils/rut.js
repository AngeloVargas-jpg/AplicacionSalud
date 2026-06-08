export function formatearRut(valor) {
  let limpio = valor.replace(/[^0-9kK]/g, '').toUpperCase();
  if (limpio.length === 0) return '';
  const dv = limpio.slice(-1);
  let cuerpo = limpio.slice(0, -1);
  if (cuerpo.length === 0) return dv;
  let formateado = '';
  while (cuerpo.length > 3) {
    formateado = '.' + cuerpo.slice(-3) + formateado;
    cuerpo = cuerpo.slice(0, -3);
  }
  return cuerpo + formateado + '-' + dv;
}

export function validarRut(rut) {
  let limpio = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  if (limpio.length < 2) return false;
  const dv = limpio.slice(-1);
  const cuerpo = limpio.slice(0, -1);
  let suma = 0, mul = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  const calc = 11 - (suma % 11);
  const esperado = calc === 11 ? '0' : calc === 10 ? 'K' : String(calc);
  return dv === esperado;
}
