(function(root){
 'use strict';
 const ZONA='America/Mexico_City';
 function fechaISO(x){if(typeof x!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(x))return false;const n=Date.parse(x);return Number.isFinite(n)&&new Date(n).toISOString()===(x.includes('.')?x:x.replace('Z','.000Z'));}
 function mesLocal(x){if(!fechaISO(x))return null;const p=new Intl.DateTimeFormat('en-CA',{timeZone:ZONA,year:'numeric',month:'2-digit'}).formatToParts(new Date(x));return p.find(x=>x.type==='year').value+'-'+p.find(x=>x.type==='month').value;}
 function calcular(d,mes){
  if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(mes))throw Error('PERIODO_INVALIDO');
  const preparados=d.casos.filter(c=>fechaISO(c.metricas.recibido_en)&&mesLocal(c.metricas.primera_propuesta_revisada_en)===mes);
  const horas=preparados.map(c=>(Date.parse(c.metricas.primera_propuesta_revisada_en)-Date.parse(c.metricas.recibido_en))/3600000);
  const solicitudes=d.solicitudes.filter(s=>mesLocal(s.recibido_en)===mes);
  const revisiones=d.casos.filter(c=>mesLocal(c.metricas.primera_revision_humana_en)===mes&&typeof c.metricas.aprobado_primera_revision_sin_cambios==='boolean');
  const completos=solicitudes.filter(s=>s.completa_al_recibir===true).length,aprobados=revisiones.filter(c=>c.metricas.aprobado_primera_revision_sin_cambios).length;
  return {preparacion:{valor:horas.length?horas.reduce((a,b)=>a+b,0)/horas.length:null,unidad:'h/caso',numerador:horas.reduce((a,b)=>a+b,0),denominador:horas.length},completitud:{valor:d.cobertura.solicitudes_completa&&solicitudes.length?100*completos/solicitudes.length:null,unidad:'%',numerador:completos,denominador:solicitudes.length,cobertura_completa:d.cobertura.solicitudes_completa},aprobacion:{valor:revisiones.length?100*aprobados/revisiones.length:null,unidad:'%',numerador:aprobados,denominador:revisiones.length}};
 }
 const api={calcular,fechaISO,mesLocal,ZONA};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MicaMetricas=api;
})(typeof window==='undefined'?{}:window);
