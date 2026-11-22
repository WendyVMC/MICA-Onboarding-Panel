'use strict';
let data;const $=id=>document.getElementById(id);
const labels=['Folio','Departamento','Estado','Versión','Actividades'];
function text(tag,value){const e=document.createElement(tag);e.textContent=String(value);return e;}
function pintarKPI(){const mes=$('month').value;let k;try{k=MicaMetricas.calcular(data,mes)}catch{$('message').textContent='Selecciona un mes válido para los indicadores.';return;}
 for(const id of ['preparacion','completitud','aprobacion']){$(id).textContent=k[id].valor===null?'Sin datos':new Intl.NumberFormat('es-MX',{maximumFractionDigits:2}).format(k[id].valor)+(id==='preparacion'?' h':' %');}
 $('preparacion-contexto').textContent=k.preparacion.denominador+' caso(s) con ambas marcas temporales en el periodo.';
 $('completitud-contexto').textContent=k.completitud.cobertura_completa?k.completitud.numerador+' de '+k.completitud.denominador+' solicitudes completas.':'Cobertura incompleta de solicitudes; no se calcula el porcentaje.';
 $('aprobacion-contexto').textContent=k.aprobacion.numerador+' de '+k.aprobacion.denominador+' primeras revisiones humanas documentadas.';
}
function render(){
 const cases=data.casos.filter(c=>c.caso_id.toLowerCase().includes($('q').value.trim().toLowerCase())&&(!$('state').value||c.estado===$('state').value));
 $('scope').textContent=cases.length+' de '+data.casos.length+' casos · '+cases.reduce((n,c)=>n+c.actividades.length,0)+' actividades propuestas en esta selección. Los KPI usan su propio periodo mensual.';
 const desactualizado=Date.now()-Date.parse(data.actualizado+'T00:00:00Z')>7*86400000;
 $('message').textContent=!data.casos.length?'Sin datos: la instantánea todavía no contiene casos.':!cases.length?'No hay casos que coincidan. Restablece los filtros.':desactualizado?'Datos desactualizados: la instantánea tiene más de 7 días. Consulta Telegram para el estado actual.':'Piloto simulado: '+data.casos.length+' caso(s). Revisa la procedencia y cobertura al pie; las métricas reconstruidas incluyen intervención manual y no prueban el rendimiento de la empresa.';
 $('rows').replaceChildren();$('chart').replaceChildren();$('detail').replaceChildren();const counts={};
 for(const c of cases){const tr=document.createElement('tr');[c.caso_id,c.departamento,c.estado.replaceAll('_',' '),c.version,c.actividades.length].forEach((v,i)=>{const td=text('td',v);td.dataset.label=labels[i];tr.append(td)});$('rows').append(tr);const det=document.createElement('details');det.append(text('summary','Ver actividades de '+c.caso_id));const list=document.createElement('ul');list.className='detail-list';for(const a of c.actividades){counts[a.responsable_id]=(counts[a.responsable_id]||0)+1;list.append(text('li',a.fecha+' · '+a.titulo+' · '+a.responsable_id+' · '+a.regla_id+(a.vencida_al_recibir?' · Vencida al recibir: requiere RH':'')))}if(!c.actividades.length)list.append(text('li','Este caso todavía no tiene una propuesta.'));det.append(list);$('detail').append(det);}
 const max=Math.max(1,...Object.values(counts));for(const [r,n]of Object.entries(counts).sort((a,b)=>b[1]-a[1])){const row=text('div','');row.className='barrow';row.append(text('span',r));const track=text('div','');track.className='track';const bar=text('div','');bar.className='bar';bar.style.width=n/max*100+'%';track.append(bar);row.append(track,text('b',n));$('chart').append(row);}
 $('chart').setAttribute('aria-label',Object.entries(counts).map(([r,n])=>r+': '+n+' actividades').join('; ')||'Sin actividades');$('chart-empty').hidden=Object.keys(counts).length!==0;
}
async function cargar(){try{const r=await fetch('datos.json',{cache:'no-store'});if(!r.ok)throw Error('LECTURA');const d=await r.json();if(d.version_esquema!=='2.0.0'||d.zona_horaria!==MicaMetricas.ZONA||!Array.isArray(d.casos)||!Array.isArray(d.solicitudes)||!d.cobertura||d.casos.some(c=>!c.metricas||!Array.isArray(c.actividades)))throw Error('FORMATO');data=d;$('month').value=d.periodo_default;$('source').textContent='Corte: '+d.actualizado+' · '+d.zona_horaria+'. '+d.fuente;$('coverage').textContent=d.cobertura.nota;pintarKPI();render();for(const id of ['q','state'])$(id).addEventListener('input',render);$('month').addEventListener('input',pintarKPI);$('reset').addEventListener('click',()=>{$('q').value='';$('state').value='';render()});}catch{$('message').textContent='No fue posible cargar los datos. Intenta recargar la página o usa Telegram; no se muestran mediciones como si fueran cero.';for(const id of ['preparacion','completitud','aprobacion'])$(id).textContent='Sin datos';}}
cargar();

// Consentimiento por visita: sin cookies, claves privadas ni inicio automático.
(function configurarVoz(){
 const consent=$('voice-consent'),enable=$('voice-enable'),status=$('voice-status'),revoke=$('voice-revoke');
 consent.addEventListener('change',()=>{enable.disabled=!consent.checked;});
 revoke.addEventListener('click',()=>{window.location.reload();});
 enable.addEventListener('click',()=>{
  if(!consent.checked)return;
  enable.disabled=true;consent.disabled=true;revoke.hidden=false;
  status.textContent='Cargando ElevenLabs. Esto todavía no inicia una llamada ni activa el micrófono.';
  const script=document.createElement('script');
  script.src='https://unpkg.com/@elevenlabs/convai-widget-embed';script.async=true;
  const timer=setTimeout(()=>{status.textContent='ElevenLabs tarda en responder. Si no aparece el asistente, cierra esta conexión y usa Telegram.';},15000);
  script.onload=()=>{clearTimeout(timer);const widget=document.createElement('elevenlabs-convai');widget.setAttribute('agent-id','agent_3701m7kv9ss6fy6ts7w4ep73j911');widget.setAttribute('language','es');$('voice-widget').append(widget);enable.hidden=true;status.textContent='Asistente habilitado. Pulsa su botón para iniciar una llamada y autoriza el micrófono solo si deseas hablar. Si se deniega o falla, usa Telegram. Para terminar, cuelga en el widget o retira tu consentimiento.';};
  script.onerror=()=>{clearTimeout(timer);status.textContent='No se pudo cargar ElevenLabs. Usa Telegram o cierra esta conexión antes de intentar de nuevo.';};
  document.head.append(script);
 });
})();
