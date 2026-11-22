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
if(typeof document!=='undefined')cargar();

// El preflight detiene la captura antes de cargar ElevenLabs; no transmite audio.
async function comprobarMicrofono(mediaDevices){
 if(!mediaDevices||typeof mediaDevices.getUserMedia!=='function')return {ok:false,codigo:'NO_COMPATIBLE',mensaje:'Este navegador no permite comprobar el micrófono. Usa Telegram como alternativa.'};
 try{const stream=await mediaDevices.getUserMedia({audio:true});for(const track of stream.getTracks())track.stop();return {ok:true};}
 catch(error){const codigo=['NotAllowedError','SecurityError'].includes(error.name)?'MICROFONO_DENEGADO':['NotFoundError','NotReadableError'].includes(error.name)?'MICROFONO_NO_DISPONIBLE':'MICROFONO_ERROR';return {ok:false,codigo,mensaje:codigo==='MICROFONO_DENEGADO'?'No se autorizó el micrófono. No se inició una llamada; puedes usar Telegram.':'No se pudo abrir el micrófono. No se inició una llamada; puedes usar Telegram.'};}
}
async function habilitarVoz(ui,mediaDevices,cargarWidget){
 if(!ui.consent.checked)return 'sin_consentimiento';
 ui.enable.disabled=true;ui.consent.disabled=true;ui.revoke.hidden=false;
 ui.status.textContent='Comprobando el permiso del micrófono. Todavía no se inicia una llamada.';
 const permiso=await comprobarMicrofono(mediaDevices);
 if(!permiso.ok){ui.status.textContent=permiso.mensaje;return permiso.codigo;}
 ui.status.textContent='Micrófono comprobado y captura detenida. Cargando ElevenLabs; todavía no se inicia una llamada.';
 try{await cargarWidget();ui.enable.hidden=true;ui.status.textContent='Asistente habilitado. Pulsa Iniciar llamada para conversar. Para terminar, cuelga en el widget o retira tu consentimiento. Si falla la conexión, usa Telegram.';return 'widget_listo';}
 catch{ui.status.textContent='No se pudo cargar ElevenLabs. No se inició una llamada; usa Telegram o retira el consentimiento antes de intentar de nuevo.';return 'SERVICIO_NO_DISPONIBLE';}
}
function cargarWidgetVoz(){return new Promise((resolve,reject)=>{
 const script=document.createElement('script');script.src='https://unpkg.com/@elevenlabs/convai-widget-embed';script.async=true;
 const timer=setTimeout(()=>reject(Error('TIMEOUT_WIDGET')),15000);
 script.onload=()=>{clearTimeout(timer);const widget=document.createElement('elevenlabs-convai');widget.setAttribute('agent-id','agent_3701m7kv9ss6fy6ts7w4ep73j911');widget.setAttribute('language','es');$('voice-widget').append(widget);resolve();};
 script.onerror=()=>{clearTimeout(timer);reject(Error('WIDGET_NO_DISPONIBLE'));};document.head.append(script);
});}
function configurarVoz(){
 const ui={consent:$('voice-consent'),enable:$('voice-enable'),status:$('voice-status'),revoke:$('voice-revoke')};
 ui.consent.addEventListener('change',()=>{ui.enable.disabled=!ui.consent.checked;});
 ui.revoke.addEventListener('click',()=>{window.location.reload();});
 ui.enable.addEventListener('click',()=>habilitarVoz(ui,navigator.mediaDevices,cargarWidgetVoz));
}
if(typeof document!=='undefined'){configurarVoz();}
if(typeof module!=='undefined'&&module.exports)module.exports={comprobarMicrofono,habilitarVoz};
