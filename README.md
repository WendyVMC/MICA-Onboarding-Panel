# MICA · Panel público de demostración

Empresa ficticia; seguimiento de onboarding con una instantánea sanitizada. Sin datos personales, credenciales, conversaciones o backend. Muestra parcial de un caso; tres KPI definidos, «Sin datos» hasta disponer de mediciones completas. La voz está pendiente de integrar.

Código local de Wendy Miranda con apoyo de IA, revisado y probado por componentes. Fuentes de negocio sintéticas creadas para la actividad; no son políticas reales. Proyecto principal privado: WendyVMC/MICA-Onboarding-Assistant; acceso docente por canal privado.

## Reproducción
Node 22 para validación. Desde raíz ejecutar `node tests/panel.test.js` y `node tools/validar_panel.js`. Vista local: `python3 -m http.server 8765 --bind 127.0.0.1 --directory panel`; parar con Ctrl+C. Publicación estática mediante GitHub Actions en rama main, solo si valida. Ajustar Settings → Pages → GitHub Actions antes de desplegar.

El input manual fallo_deliberado introduce un campo faltante en el artefacto: debe bloquear publicación; desactivarlo restaura el artefacto válido. No usar una falla de hosting como evidencia de validación. Los enlaces de ejecuciones reales se añadirán cuando existan.

## Datos e indicadores
Fuente: exportación manual del entorno de pruebas n8n por lista blanca; archivos privados no forman parte de este repositorio. Actualizar antes de cada commit/demostración; retraso hasta siguiente exportación/Actions. Las marcas faltantes son null y el censo incompleto se declara. No completar mediciones por invención. Las fórmulas y exclusiones están en el panel y metricas.js.

HTML en Pages no ejecuta n8n; el bot y el servidor se alojan por separado. Este repositorio no concede acceso al estado privado ni aprueba planes. Las acciones estándar se usan para validar/publicar archivos públicos, sin compras ni recargas.
