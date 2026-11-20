// Funciones deterministas reutilizables en Code nodes y Code Tools de n8n.
function validarSolicitud(datos, bases) {
  const campos=['departamento_id','puesto_id','fecha_ingreso','modalidad','tipo_incorporacion','responsable_rh_id'];
  if(!datos||typeof datos!=='object'||Array.isArray(datos))throw Error('SOLICITUD_INVALIDA');
  if(Object.keys(datos).some(k=>!campos.includes(k)))throw Error('CAMPO_NO_PERMITIDO');
  if(campos.some(k=>typeof datos[k]!=='string'||!datos[k].trim()))throw Error('DATOS_INCOMPLETOS');
  const c=bases.catalogos,puesto=c.puestos.find(x=>x.puesto_id===datos.puesto_id);
  if(!puesto||puesto.departamento_id!==datos.departamento_id)throw Error('PUESTO_DEPARTAMENTO_INVALIDO');
  if(!c.modalidades.includes(datos.modalidad)||!c.tipos_incorporacion.includes(datos.tipo_incorporacion))throw Error('FUERA_DE_CATALOGO');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(datos.fecha_ingreso))throw Error('FECHA_INVALIDA');
  const fecha=new Date(datos.fecha_ingreso+'T12:00:00Z');
  if(!Number.isFinite(fecha.getTime())||fecha.toISOString().slice(0,10)!==datos.fecha_ingreso)throw Error('FECHA_INVALIDA');
  const r=bases.responsables.registros.find(x=>x.responsable_id===datos.responsable_rh_id);
  if(!r||!r.activo||r.rol!=='Coordinación People & Culture')throw Error('RESPONSABLE_RH_INVALIDO');
  return {...datos};
}
function recuperarFuentes(c) {
  const d=c.datos,b=c.bases;
  const a=b.actividades.registros.filter(x=>(x.departamento_id===null||x.departamento_id===d.departamento_id)&&(x.puesto_id===null||x.puesto_id===d.puesto_id)&&x.modalidades.includes(d.modalidad));
  if(!a.length)throw Error('FUENTES_INSUFICIENTES');
  for(const x of a){
    if(!b.politicas.registros.some(r=>r.regla_id===x.regla_id)||x.fuente_version!=='1.0.0')throw Error('REFERENCIA_INVALIDA');
    const r=b.responsables.registros.find(r=>r.responsable_id===x.responsable_id);
    if(!r||!r.activo||!['TRANSVERSAL',d.departamento_id].includes(r.departamento_id))throw Error('RESPONSABLE_ACTIVIDAD_INVALIDO');
  }
  return {version_fuentes:'1.0.0',actividades:a.map(x=>({actividad_id:x.actividad_id,titulo:x.titulo,desfase_dias:x.desfase_dias,responsable_id:x.responsable_id,regla_id:x.regla_id}))};
}
function calcularPlan(c) {
  const fuente=recuperarFuentes(c);
  const day=new Date(c.datos.fecha_ingreso+'T12:00:00Z');
  return {version_propuesta:1,modo:'SIMULADO',actividades:fuente.actividades.map(a=>{
    const d=new Date(day);d.setUTCDate(d.getUTCDate()+a.desfase_dias);const fecha=d.toISOString().slice(0,10);
    return {actividad_id:a.actividad_id,fecha,responsable_id:a.responsable_id,regla_id:a.regla_id,fuente_version:fuente.version_fuentes,vencida_al_recibir:fecha<c.fecha_recepcion_local};
  }),requiere_revision_fechas:fuente.actividades.some(a=>{const d=new Date(day);d.setUTCDate(d.getUTCDate()+a.desfase_dias);return d.toISOString().slice(0,10)<c.fecha_recepcion_local;})};
}
function equivalente(a,b){
  if(a===b)return true;
  if(a===null||b===null||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;
  const ka=Object.keys(a).sort(),kb=Object.keys(b).sort();
  return JSON.stringify(ka)===JSON.stringify(kb)&&ka.every(k=>equivalente(a[k],b[k]));
}
function resultadoRol(rol,c){
  if(rol==='A1')return {solicitud_validada:validarSolicitud(c.datos,c.bases),campos_faltantes:[]};
  if(rol==='A2')return recuperarFuentes(c);
  if(rol==='A3')return calcularPlan(c);
  if(rol==='A4'){
    const plan=calcularPlan(c);const observado=c.resultados?.A3;
    if(!equivalente(observado,plan))throw Error('PLAN_NO_CONFORME');
    return {dictamen:'conforme',requiere_revision_fechas:plan.requiere_revision_fechas,aprobacion_humana_requerida:true,registro_definitivo_permitido:false};
  }
  throw Error('ROL_NO_PERMITIDO');
}
function validarSalida(rol,raw,c){
  let o=raw;if(typeof o==='string')o=JSON.parse(o.replace(/^```(?:json)?\s*/,'').replace(/\s*```$/,''));
  // Some agent versions wrap a single tool result in [{response: JSON}].
  if(Array.isArray(o)&&o.length===1&&o[0]&&Object.keys(o[0]).length===1&&typeof o[0].response==='string')o=JSON.parse(o[0].response);
  const keys=Object.keys(o||{}).sort();
  if(JSON.stringify(keys)!==JSON.stringify(['caso_id','agente','estado','resultado'].sort()))throw Error('CONTRATO_SALIDA_INVALIDO');
  if(o.caso_id!==c.caso_id||o.agente!==rol||o.estado!=='ok')throw Error('IDENTIDAD_SALIDA_INVALIDA');
  if(!equivalente(o.resultado,resultadoRol(rol,c)))throw Error('RESULTADO_NO_VERIFICADO_'+rol);
  return o;
}
if(typeof module!=='undefined')module.exports={validarSolicitud,recuperarFuentes,calcularPlan,equivalente,resultadoRol,validarSalida};
