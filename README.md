# MICA · Entrega final de AI Tools

Wendy Miranda · 21/11/2026 · empresa y datos de negocio ficticios.

## Archivos de entrega

- [Descargar el proyecto completo](Miranda_Wendy_AI_Tools_ProyectoFinal.zip): código organizado, workflows n8n, bases sintéticas, dos skills, dos loops, evidencias, pruebas, costos, informe y video de **6:55**.
- [Informe técnico y empresarial](MICA_Informe_Final.pdf): **10 páginas**.
- [Costos](costos.csv) · [Pruebas P01–P14](pruebas.csv) · [Recibo y SHA-256](RECIBO_ENTREGA.json).
- [Abrir panel público](https://wendyvmc.github.io/MICA-Onboarding-Panel/).

El **código completo y el manual reproducible están dentro del ZIP**, en una carpeta única. Los archivos desplegados del panel también están descomprimidos en este repositorio. El ZIP publicado es el mismo de la entrega local, comprobable por SHA-256; no se afirma que la raíz descomprimida del repositorio contenga todas las carpetas del proyecto. Para reconstruir el sistema completo, extraer el ZIP y abrir README.md y docs/MANUAL_REPRODUCCION.md.

## Resultado verificado

Tres casos completos con cinco roles trazables: Tecnología remota (8 actividades), Comercial híbrido (9) y Administración presencial (8), todos aprobados explícitamente y registrados como simulados. Dos skills y dos loops integrados; corrección V1→V2 y reutilización demostradas. Una conversación real de ElevenLabs en español consultó el mismo folio y solicitó revisión mediante herramientas autenticadas.

Tres KPI con denominadores visibles: preparación media 0.098030 h/caso (incluye espera), completitud **3/4 = 75%** y aprobación inicial **3/3 = 100%**. Dos casos tienen marcas directas; Tecnología conserva reconstrucciones auditadas. Instantánea manual sanitizada, sin datos en vivo; muestra pequeña, sin evidencia de ROI.

34 llamadas Gateway medidas, USD 0.00503595 calculados; voz 831 créditos (667 plataforma y 164 LLM), con USD 0.0154 mostrado para su componente LLM. **Recarga reportada de USD 5 no equivale a consumo**; proveedor y facturación final sin conciliar. No sumar créditos como dinero ni duplicar el componente LLM.

## Validación y límites

11 grupos locales de comprobaciones pasaron desde la carpeta de entrega, sin APIs. Pruebas reales, mixtas y simuladas están identificadas en pruebas.csv. Denegación de micrófono, timeout y caída de servicio se prueban mediante fallos controlados del código, no se presentan como incidentes reales del proveedor. El video es un recorrido narrado de evidencias existentes con voz local, no una nueva ejecución continua.

- [Actions final correcto](https://github.com/WendyVMC/MICA-Onboarding-Panel/actions/runs/44983672821).
- [Bloqueo real por validación](https://github.com/WendyVMC/MICA-Onboarding-Panel/actions/runs/44666974987).
- [Corrección y recuperación](https://github.com/WendyVMC/MICA-Onboarding-Panel/actions/runs/44667092748).

Node 22 recomendado; Python 3.9+ para exportación. Pruebas sin pago: node tests/panel.test.js y node tools/validar_panel.js. Vista local: python3 -m http.server 8765 --bind 127.0.0.1 --directory panel. El ZIP incluye todas las instrucciones para importar y volver a vincular credenciales.

No se publican claves, tokens, chats personales, tablas privadas ni audio/transcripción personal. El ID del agente es público y no es una API key. El servicio de voz solo admite un folio ficticio; no aprueba planes ni toma decisiones laborales. Bot: https://t.me/mica_wvmc_onboarding_bot, acceso operativo restringido a la cuenta autorizada. No ampliar permisos sin revisión.

IA desactivada al cerrar los ensayos. Voz limitada a 60 s, tres llamadas diarias y una simultánea. Mantener n8n y ElevenLabs disponibles para evaluar; no se recargan ni contratan planes automáticamente. No se demuestra atomicidad concurrente. La estudiante debe revisar el informe y hacer su defensa individual de máximo 12 minutos; se incluye guion.

Código y bases sintéticas propios con apoyo de IA, declarado en docs/DECLARACION_IA_Y_FUENTES.md dentro del ZIP. Identidad ColoresPasteles. No se declara una licencia abierta no elegida.
