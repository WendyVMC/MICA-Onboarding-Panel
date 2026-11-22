# MICA · Panel público de demostración

Empresa ficticia; datos de negocio sintéticos. Panel: https://wendyvmc.github.io/MICA-Onboarding-Panel/

## Estado verificado al 21/11/2026

- Tres casos piloto aprobados por la usuaria en n8n y consultados por Telegram: Tecnología remota (8 actividades), Comercial híbrido (9) y Administración presencial (8), todos versión 3. Instantánea manual sanitizada; no conexión de datos en vivo.
- Tres KPIs del piloto con n=3 y denominadores visibles. Dos casos tienen marcas directas; el caso legado de Tecnología contiene reconstrucciones auditadas de propuesta y completitud. Procedencia y límites visibles en el panel. No representan el mes completo, ahorro ni rendimiento empresarial.
- Agente de ElevenLabs publicado en español, con fuentes sintéticas y dos herramientas autenticadas. Consulta y solicitud de revisión probadas desde formularios manuales, con respuestas reales de n8n; sin modelos ni audio en esas pruebas.
- Widget integrado con aceptación previa. No carga el script de ElevenLabs antes de aceptar. Cargarlo no inicia la conversación: el visitante debe pulsar Iniciar llamada y autorizar su micrófono. Retirar consentimiento recarga la página y cierra las conexiones de esa página. Conversación real en español verificada: ambas herramientas exitosas antes del cierre por duración máxima; 61 s en metadatos y 831 créditos (667 plataforma + 164 LLM). La prueba específica de micrófono denegado sigue pendiente.
- Límites del agente: 60 s por conversación, 20 s de silencio, tres llamadas diarias, una simultánea, sin ráfagas, cola ni archivos. Dominio permitido: wendyvmc.github.io. Las llamadas consumen créditos de ElevenLabs; no se compran recargas desde este panel.

## Reproducción y publicación

Node 22. Desde raíz: `node tests/panel.test.js` y `node tools/validar_panel.js`. Vista local: `python3 -m http.server 8765 --bind 127.0.0.1 --directory panel`; parar con Ctrl+C. La voz publicada solo admite el host autorizado.

GitHub Pages usa Actions. Solo publica si pasan las reglas y fórmulas. Evidencia de bloqueo deliberado: https://github.com/WendyVMC/MICA-Onboarding-Panel/actions/runs/44666974987 ; recuperación: https://github.com/WendyVMC/MICA-Onboarding-Panel/actions/runs/44667092748 . La actualización de voz pasó: https://github.com/WendyVMC/MICA-Onboarding-Panel/actions/runs/44979306898 . No repetir la falla para cada cambio.

## Datos, seguridad y límites

El repositorio contiene solo fuentes públicas y datos por lista blanca. No contiene contraseñas, tokens, usuarios/chats de Telegram, exportaciones privadas ni conversaciones. El identificador público del agente no es una clave API. La contraseña compartida permanece en los almacenes de credenciales de n8n y secretos de ElevenLabs; no se entrega al navegador.

La aprobación permanece humana en Telegram. La voz solo consulta el único folio ficticio autorizado o solicita revisión; no aprueba, contrata ni asigna accesos. Backend n8n y voz se alojan por separado. El dominio permitido restringe hosts, pero no es autenticación individual del visitante; el piloto expone únicamente ese caso ficticio. No se presentan pruebas manuales de herramientas como si fueran una conversación de voz.

Código de Wendy Miranda con apoyo de IA, revisado por componentes. Identidad visual ColoresPasteles. Fuentes de negocio sintéticas elaboradas para la actividad: no son políticas reales. Proyecto principal privado: WendyVMC/MICA-Onboarding-Assistant; acceso docente por canal privado. No se afirma una licencia de distribución que todavía no se haya elegido. Integración del widget conforme a https://elevenlabs.io/docs/eleven-agents/customization/widget ; límites conforme a https://elevenlabs.io/docs/eleven-agents/customization/conversation-flow .
