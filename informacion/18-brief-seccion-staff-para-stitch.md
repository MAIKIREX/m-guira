# Guira - Brief detallado de la seccion Staff para Stitch

## Objetivo

Este documento describe con mucho detalle la seccion interna de staff y admin de Guira para que Stitch pueda generar un bosquejo visual coherente con el producto real.

La intencion no es crear pantallas decorativas ni inventar modulos fuera del sistema actual. La meta es traducir la operacion interna de Guira a una experiencia visual premium, clara, auditada y enfocada en control operacional.

---

## 1. Contexto funcional de la seccion staff

La seccion staff es el espacio interno donde el equipo operativo revisa expedientes, valida documentos, confirma pasos de una orden, atiende tickets, gestiona configuraciones criticas y deja trazabilidad formal.

Esta area no es un CRM generico ni un dashboard SaaS liviano. Debe sentirse como:

- una mesa de control operativo,
- una consola de verificacion,
- una bandeja de decisiones con trazabilidad,
- y un centro de gobierno interno para operaciones delicadas.

El usuario interno necesita responder muy rapido estas preguntas:

- Que casos requieren accion inmediata.
- Que expediente necesita verificacion o rechazo.
- Que orden ya tiene comprobante y puede avanzar.
- Que ticket de soporte debe moverse.
- Que cambio administrativo es sensible y debe quedar justificado.
- Que movimiento debe quedar reflejado en auditoria.

La experiencia debe priorizar:

- claridad de estado,
- densidad informativa media-alta,
- jerarquia visual fuerte,
- acciones criticas bien separadas,
- y mucha sensacion de control y responsabilidad.

---

## 2. Paleta visual obligatoria basada en el proyecto real

Stitch debe respetar el lenguaje visual que ya existe en la app.

### 2.1. Base del dark mode real

- Fondo principal: casi negro profundo
  - referencia aproximada: `#111111` a `#151515`
  - uso: canvas general, shell, fondo de escritorio interno

- Superficie secundaria: negro carbon / gris muy oscuro
  - referencia aproximada: `#1B1B1B` a `#262626`
  - uso: cards, tablas, modales, paneles

- Texto principal: gris claro frio
  - referencia aproximada: `#E8ECF4`
  - uso: titulos, valores, labels clave, datos importantes

- Texto secundario: gris azulado medio
  - referencia aproximada: `#AAB4C4`
  - uso: descripciones, helper text, metadata, fechas, notas

- Bordes y divisores: gris azulado translcido
  - referencia aproximada: `rgba(114, 132, 170, 0.35)` o similar
  - uso: separaciones, contornos suaves, tablas, cards

### 2.2. Colores de accion y acento

- Primario del sistema: azul electrico institucional
  - referencia aproximada desde el tema real: `#75B6FF`
  - uso: foco, ring, estados activos, acciones principales de shell

- Acento secundario: violeta fuerte
  - referencia aproximada desde el tema real: `#A855F7` a `#B066FF`
  - uso: tabs activas, enfasis secundario, zonas de revision, detalles del onboarding

- Cyan de apoyo: cian brillante
  - referencia aproximada: `#22D3EE` a `#67E8F9`
  - uso: highlights tecnicos, links de archivos, variables del sistema, datos de infraestructura

- Verde de confirmacion: emerald controlado
  - referencia aproximada: `#34D399`
  - uso: estados aprobados, casos completados, ordenes terminadas, usuarios activos, toggles activos

- Ambar de advertencia: ambar operativo
  - referencia aproximada: `#FBBF24`
  - uso: needs changes, estados pendientes, fees, alertas documentales, restricciones intermedias

- Rojo de riesgo: rojo controlado
  - referencia aproximada: `#F87171`
  - uso: rechazo, failed, delete, acciones irreversibles, cierres criticos

### 2.3. Reglas de uso visual

- El dark mode debe dominar toda la experiencia.
- El azul y el violeta son los acentos principales de identidad interna.
- El cyan debe usarse como tono tecnico, no como color de marca principal.
- El verde solo debe significar exito o confirmacion real.
- El ambar debe reservarse para warning, pendientes o ajustes delicados.
- El rojo debe quedar restringido a rechazo, fallas o acciones destructivas.
- No usar degradados exagerados. Si aparecen, deben ser sutiles y funcionales.
- Las cards deben sentirse profundas pero no glossy.
- Evitar glassmorphism fuerte o efectos juguetones.

---

## 3. Lenguaje visual que Stitch debe construir

La seccion staff debe sentirse como una mezcla entre:

- terminal financiera moderna,
- panel interno de compliance,
- centro de control de operaciones,
- y consola administrativa de alto impacto.

Caracteristicas deseadas:

- dark mode dominante,
- cards profundas con bordes finos,
- tablas muy legibles,
- modales sobrios pero importantes,
- tipografia limpia y precisa,
- titulos firmes,
- muy buena lectura de badges,
- micro acentos de color en estados,
- y navegacion clara sin ruido visual.

Evitar:

- apariencia de producto de marketing,
- ilustraciones innecesarias,
- gradientes estridentes,
- demasiados colores a la vez,
- demasiado blanco,
- o componentes inflados sin sentido operativo.

---

## 4. Arquitectura general de la seccion staff

Antes de describir cada ventana, Stitch debe entender la estructura general.

### 4.1. Shell interno persistente

Toda la experiencia staff vive dentro de un layout persistente con:

- sidebar lateral izquierda,
- header superior sticky,
- area principal de trabajo,
- soporte para desktop y movil,
- opcion de colapsar sidebar.

### 4.2. Sidebar izquierda

Elementos obligatorios:

- marca `Guira`,
- subtitulo `Control interno`,
- texto de apoyo como `Vista operativa para staff y admin con foco en trazabilidad`,
- navegacion vertical.

Entradas visibles:

- `Panel`
- `Soporte`
- `Auditoria`

Comportamiento visual:

- item activo con superficie resaltada,
- barra vertical o borde de color,
- icono destacado,
- label clara,
- resto de items en tono apagado.

Estado recomendado:

- activo con mezcla de azul y violeta,
- hover suave con gris profundo,
- sidebar limpia y profesional.

### 4.3. Header superior

Elementos:

- acceso a menu movil,
- toggle de tema,
- campana de notificaciones,
- menu del usuario.

Estilo:

- sobrio,
- tecnico,
- limpio,
- con fondo semitransparente oscuro y blur leve.

---

## 5. Ventana 1: Shell general del staff

### 5.1. Proposito

Es la envolvente de toda la experiencia interna. Debe comunicar que el usuario entro a un espacio de operacion sensible y no a un dashboard casual.

### 5.2. Composicion visual

La pantalla base debe tener:

- sidebar fija en desktop,
- header superior delgado y firme,
- main con padding generoso,
- fondo oscuro uniforme,
- transiciones suaves al colapsar sidebar.

### 5.3. Sensacion visual

Debe sentirse como una consola de gobierno interno.

---

## 6. Ventana 2: Panel principal de staff/admin

Ruta real:

- `/admin`

Esta es la ventana mas importante de toda la seccion staff.

### 6.1. Proposito

Es el centro de control interno. Desde aqui el equipo ve el volumen operativo, detecta gaps, revisa auditoria reciente y entra a los modulos por tabs.

### 6.2. Estructura visual general

La pantalla debe dividirse en dos grandes franjas:

1. bloque superior con hero, metricas y radar de auditoria.
2. bloque inferior con tabs funcionales.

### 6.3. Encabezado principal del panel

Debe incluir:

- eyebrow o etiqueta como `Centro de control interno`,
- titulo grande como `Staff valida, ejecuta y admin gobierna`,
- descripcion corta del flujo interno,
- boton `Actualizar`.

Visualmente:

- esta zona debe verse como la entrada a una mesa operativa,
- con una card ancha principal,
- fondo oscuro enriquecido,
- y contraste fuerte entre titulo y descripcion.

### 6.4. Bloque de alertas operativas

Debe existir un espacio para mostrar gaps o limites documentales detectados.

Este bloque debe permitir:

- listar huecos o advertencias,
- comunicar que hay informacion pendiente,
- verse como un warning institucional y no como error fatal.

Usar:

- ambar como tono principal,
- borde punteado o dash,
- iconografia de alerta discreta.

### 6.5. Metricas principales

Mostrar 4 tarjetas:

- `Onboarding`
- `Orders`
- `Support`
- `Users`

Cada tarjeta debe incluir:

- icono,
- label,
- valor numerico,
- y sensacion de snapshot rapido.

### 6.6. Tarjetas de roles

Debe existir una fila de cards explicativas para:

- `Staff`
- `Cliente`
- `Admin`

Objetivo:

- explicar el rol de cada actor,
- reforzar el mapa mental del sistema,
- y ayudar a Stitch a dar contexto al panel.

### 6.7. Radar de auditoria

En el lateral o columna secundaria debe aparecer una card de auditoria reciente.

Cada item debe mostrar:

- tabla afectada,
- accion,
- motivo,
- fecha.

Debe sentirse como:

- feed de eventos criticos,
- resumen de trazabilidad,
- lectura rapida para decisiones.

Visualmente:

- cards compactas,
- badges sobrios,
- metadata pequeña,
- tono frio y serio.

---

## 7. Ventana 3: Tab `Overview`

### 7.1. Proposito

Es una vista orientativa. Resume como esta dividido el trabajo interno.

### 7.2. Contenido

Debe mostrar tarjetas o bloques que expliquen:

- Onboarding
- Orders
- Audit
- Support
- Admin tools
- Rieles no cerrados

### 7.3. Objetivo visual

No debe parecer una tab vacia. Debe sentirse como:

- mapa del sistema,
- manual visual operativo,
- o landing interna de uso del panel.

### 7.4. Sensacion

Muy clara, ordenada y pedagógica, pero siempre dentro del lenguaje premium y oscuro.

---

## 8. Ventana 4: Tab `Onboarding`

### 8.1. Proposito

Es la bandeja de expedientes KYC/KYB.

### 8.2. Estructura

Debe resolverse como tabla operativa con columnas:

- Cliente
- Tipo
- Estado
- Actualizado
- Observaciones
- Acciones

### 8.3. Lectura esperada

Cada fila debe permitir leer rapidamente:

- nombre del cliente,
- email o identificador secundario,
- si es persona o empresa,
- estado del expediente,
- ultima actualizacion,
- comentario visible,
- CTA `Ver detalles`.

### 8.4. Tratamiento visual del estado

Estados relevantes:

- `verified`
- `needs_changes`
- `rejected`
- otros estados de revision

Reglas:

- `verified` en verde,
- `needs_changes` en ambar,
- `rejected` en rojo,
- estados neutros en gris o outline.

### 8.5. Sensacion visual

Debe verse como una bandeja de compliance o verificacion, no como una simple lista.

---

## 9. Ventana 5: Detalle completo de onboarding

Ruta real:

- `/admin/onboarding/[id]`

Esta es una de las ventanas mas importantes para Stitch.

### 9.1. Proposito

Es la pantalla dedicada al expediente KYC/KYB. Reemplaza la revision superficial por una vista profunda y estructurada.

### 9.2. Estructura general

La pantalla debe tener 4 zonas:

1. hero del expediente,
2. resumen superior con metricas y acciones,
3. tabs internas del expediente,
4. area de evidencia documental y contexto de revision.

### 9.3. Hero del expediente

Debe incluir:

- link `Volver a onboarding`,
- etiqueta como `Mesa de verificacion`,
- nombre principal del expediente,
- badge de estado,
- metricas de tipo, ultima actualizacion y cantidad de documentos.

Visualmente:

- puede tener una superficie mas expresiva que el resto,
- con un degradado oscuro muy sutil entre azul y cyan o azul y violeta,
- sin perder sobriedad.

### 9.4. Resumen superior

Debe mostrar tarjetas con:

- nombre,
- apellido,
- nacimiento.

Y al lado:

- un bloque de `Accion visible`,
- botones para aprobar, pedir cambios o rechazar.

### 9.5. Tab `Informacion personal`

Debe tener dos columnas o dos grandes bloques:

- `Informacion principal`
- `Campos adicionales`

Contenido esperado:

- datos base del perfil,
- email,
- documento,
- fecha de creacion,
- tipo de onboarding,
- y todos los campos relevantes del payload.

Visualmente:

- cards de lectura,
- sin edicion,
- con apariencia de expediente institucional.

### 9.6. Tab `Documentos`

Esta tab debe ser una de las mas importantes del bosquejo.

Cada documento debe verse como un bloque completo con:

- tipo de documento,
- fuente del documento,
- numero de documento,
- fecha de carga,
- mime/origen,
- ruta de storage,
- vista previa si existe,
- boton `Abrir archivo`,
- acciones de onboarding visibles.

Idealmente el layout debe ser:

- columna izquierda con metadata y acciones,
- columna derecha con preview.

Ademas debe existir una card lateral de `Contexto de revision` con reglas como:

- aprobar documento,
- solicitar cambios,
- rechazar documento.

### 9.7. Tab `Verificacion`

Debe mostrar:

- estado actual KYC/KYB,
- fecha de envio,
- fecha de revision,
- comentarios del revisor,
- bridge customer id.

Y una card secundaria de `Lectura operativa` con notas sobre:

- historial disponible,
- secuencia recomendada de revision,
- visibilidad de comentarios.

### 9.8. Sensacion visual

Esta pantalla debe sentirse como:

- una sala de revision,
- un expediente premium,
- una herramienta seria para tomar una decision de compliance.

No debe parecer un modal grande ni una ficha comun.

---

## 10. Ventana 6: Tab `Orders`

### 10.1. Proposito

Es la bandeja de ordenes de pago que staff debe llevar por estados.

### 10.2. Tabla principal

Columnas:

- ID
- Tipo
- Rail
- Monto
- Estado
- Archivos
- Acciones

### 10.3. Informacion por fila

Cada fila debe comunicar:

- identificador corto,
- fecha de creacion,
- tipo de orden,
- rail de procesamiento,
- monto origen,
- estado actual,
- si tiene support document,
- si tiene comprobante del cliente,
- si tiene comprobante final del staff,
- boton `Gestionar orden`.

### 10.4. Estados importantes

Stitch debe contemplar visualmente:

- `created`
- `waiting_deposit`
- `deposit_received`
- `processing`
- `sent`
- `completed`
- `failed`

Sugerencia:

- `created` y `waiting_deposit`: ambar,
- `deposit_received`, `processing`, `sent`: azul/cyan,
- `completed`: verde,
- `failed`: rojo.

### 10.5. Sensacion visual

Debe verse como cola de expedientes monetarios con control documental.

---

## 11. Ventana 7: Modal `Gestionar Orden`

### 11.1. Proposito

Es el modal maestro de una orden. Desde aqui staff entiende el expediente y acciona el siguiente paso.

### 11.2. Estructura del modal

Debe incluir:

- titulo `Gestion de Orden #XXXX`,
- badge de estado,
- descripcion operativa,
- bloque `Detalle Transaccional`,
- bloque `Informacion de Destino`,
- bloque `Respaldo y comprobantes`,
- footer con `Acciones Habilitadas`.

### 11.3. Bloque `Detalle Transaccional`

Mostrar:

- tipo de orden,
- riel de procesamiento,
- monto origen,
- monto convertido si existe.

### 11.4. Bloque `Informacion de Destino`

Puede mostrar segun metadata:

- ruta,
- metodo de entrega,
- variante de recepcion,
- canal de salida,
- destino declarado,
- motivo del pago,
- stablecoin,
- wallet,
- red,
- banco,
- cuenta o IBAN,
- routing,
- codigo SWIFT,
- pais del banco,
- direccion del banco.

### 11.5. Bloque `Respaldo y comprobantes`

Debe listar links o indicadores para:

- comprobante de deposito del cliente,
- documento de respaldo,
- comprobante final del staff.

### 11.6. Sensacion visual

Este modal debe sentirse como una cabina de control puntual.

---

## 12. Ventanas 8 a 12: Modales de accion sobre orden

Stitch debe considerar estos submodales como piezas importantes del flujo.

### 12.1. Modal `Validar deposito del cliente`

Objetivo:

- mover la orden a `deposit_received`
- con motivo obligatorio.

Campos:

- motivo

Condicion visual importante:

- si el cliente no subio comprobante, el CTA debe verse bloqueado o deshabilitado.

### 12.2. Modal `Preparar cotizacion`

Objetivo:

- definir tipo de cambio,
- fee total,
- monto convertido calculado,
- y mover la orden a `processing`.

Campos:

- tipo de cambio,
- monto convertido solo lectura,
- fee total,
- motivo.

Sensacion:

- modal financiero de precision.

### 12.3. Modal `Registrar sent`

Objetivo:

- registrar referencia o hash,
- mover la orden a `sent`.

Campos:

- referencia,
- motivo.

### 12.4. Modal `Completar orden`

Objetivo:

- subir comprobante final,
- cerrar expediente,
- mover a `completed`.

Campos:

- upload de comprobante,
- motivo.

### 12.5. Modal `Marcar failed`

Objetivo:

- cerrar la orden como fallida.

Campos:

- motivo.

### 12.6. Lineamiento visual comun

Todos estos modales deben:

- verse serios,
- dejar claro el impacto de la accion,
- tener un footer con CTA fuerte,
- y usar el color de estado correcto segun riesgo.

---

## 13. Ventana 13: Tab `Support`

### 13.1. Proposito

Es la bandeja interna de tickets.

### 13.2. Tabla

Columnas:

- Cliente
- Asunto
- Estado
- Contacto
- Fecha
- Acciones

### 13.3. Contenido por fila

- nombre o email del cliente,
- asunto del ticket,
- estado del caso,
- telefono o correo de contacto,
- fecha,
- boton `Cambiar estado`.

### 13.4. Estado visual

Estados:

- `open`
- `in_progress`
- `resolved`
- `closed`

Sugerencia:

- `open`: outline o neutro,
- `in_progress`: azul o violeta,
- `resolved`: verde,
- `closed`: rojo sobrio o gris oscuro segun criterio de cierre.

### 13.5. Sensacion visual

Debe parecer una bandeja de atencion operativa seria, no un helpdesk informal.

---

## 14. Ventana 14: Modal `Cambiar estado` de ticket

### 14.1. Proposito

Permite mover el caso con trazabilidad y notificacion.

### 14.2. Campos

- nuevo estado,
- motivo.

### 14.3. Enfoque visual

Debe ser directo, compacto y muy claro. El usuario no esta conversando; esta dejando una decision operativa.

---

## 15. Ventana 15: Tab `Audit`

### 15.1. Proposito

Muestra la trazabilidad completa de cambios internos.

### 15.2. Tabla

Columnas:

- Tabla
- Accion
- Motivo
- Fuente
- Fecha

### 15.3. Sensacion visual

Debe ser una vista extremadamente legible, casi forense.

Ideal:

- tipografia monoespaciada o semi-mono para algunos campos,
- fuerte jerarquia para tabla y accion,
- y look de bitacora institucional.

---

## 16. Ventana 16: Tab `Payins`

### 16.1. Proposito

Es una vista de solo lectura para registros de `payin_routes`.

### 16.2. Recomendacion para Stitch

Como hoy es una lectura generica, puede representarse como:

- panel de registros serializados,
- cards tipo inspector de datos,
- o tabla tecnica de lectura.

### 16.3. Sensacion visual

Debe sentirse como una zona tecnica provisional, todavia no tan refinada como onboarding u orders.

---

## 17. Ventana 17: Tab `Transfers`

### 17.1. Proposito

Es la vista de `bridge_transfers` en solo lectura.

### 17.2. Tabla esperada

Columnas:

- ID
- Kind
- Business purpose
- Monto
- Estado
- Fecha

### 17.3. Sensacion

Debe sentirse como una consola operativa de transferencias, aunque sin acciones activas.

---

## 18. Ventana 18: Tab `Users`

### 18.1. Proposito

Es la bandeja de administracion de usuarios.

### 18.2. Tabla

Columnas:

- Usuario
- Rol
- Onboarding
- Archivado
- Alta
- Acciones

### 18.3. Contenido por fila

- nombre,
- email,
- rol,
- estado de onboarding,
- si esta archivado,
- fecha de alta,
- boton `Administrar` o aviso `Solo admin`.

### 18.4. Estado visual importante

- si el viewer no es admin, debe existir una nota visual de restriccion,
- los privilegios deben verse claros,
- la experiencia debe comunicar control de acceso.

---

## 19. Ventanas 19 a 23: Modales de usuarios

### 19.1. Modal `Crear usuario`

Campos:

- email,
- password,
- nombre completo,
- rol,
- motivo.

Sensacion:

- alta administrativa con responsabilidad y trazabilidad.

### 19.2. Modal `Administrar usuario`

Debe mostrar:

- nombre,
- email,
- rol,
- archivado,
- acciones disponibles.

Es un modal resumen con acceso a acciones hijas.

### 19.3. Modal `Archivar usuario`

Campo:

- motivo.

Tono:

- ambar o neutro serio.

### 19.4. Modal `Eliminar usuario`

Campo:

- motivo.

Tono:

- rojo controlado,
- confirmacion fuerte,
- sensacion de accion irreversible.

### 19.5. Modal `Desarchivar usuario`

Campo:

- motivo.

Tono:

- verde o azul sobrio.

### 19.6. Modal `Reset password`

Campo:

- motivo.

Tono:

- tecnico y claro, sin drama visual excesivo.

---

## 20. Ventana 24: Tab `Config`

### 20.1. Proposito

Centraliza configuraciones criticas del negocio y del sistema.

### 20.2. Estructura

Debe resolverse como dos grandes cards lado a lado:

- `Estructura de Comisiones`
- `Variables del Sistema`

### 20.3. Card `Estructura de Comisiones`

Debe tener:

- encabezado con icono de dinero,
- descripcion corta,
- tabla interna de conceptos,
- valor,
- accion `Editar`.

Tipos detectados:

- `route_creation`
- `supplier_payment`

Visual:

- acento ambar,
- sensacion de modulo financiero delicado.

### 20.4. Card `Variables del Sistema`

Debe tener:

- encabezado con icono tecnico,
- tabla de variables,
- valor actual,
- accion `Editar`.

Visual:

- acento cyan,
- sensacion de infraestructura y ajustes globales.

---

## 21. Ventanas 25 y 26: Modales de configuracion

### 21.1. Modal `Ajustar Comision`

Campos:

- valor numerico,
- divisa,
- justificacion del cambio.

Visual:

- acento ambar,
- importante pero elegante,
- tono de precision economica.

### 21.2. Modal `Editar Variable del Sistema`

Campos:

- valor,
- bitacora operativa.

Comportamiento que Stitch debe reflejar:

- puede editar boolean,
- number,
- string,
- o JSON.

Visual:

- acento cyan,
- sensacion de cambio critico de plataforma.

---

## 22. Ventana 27: Tab `PSAV`

### 22.1. Proposito

Gestiona canales de pago visibles para usuarios.

### 22.2. Tabla principal

Columnas:

- QR
- Canal
- Banco y Cuenta
- Moneda
- Estado
- Acciones

### 22.3. Contenido por fila

- preview del QR,
- nombre del canal,
- banco,
- cuenta,
- moneda,
- estado activo o inactivo,
- acciones de editar o eliminar.

### 22.4. Sensacion visual

Debe sentirse como una mesa de rieles operativos, mas tangible que otras tabs.

Puede tener:

- previews reales,
- chips de moneda,
- badges de estado,
- acciones compactas.

---

## 23. Ventanas 28 a 30: Modales PSAV

### 23.1. Modal `Nuevo PSAV`

### 23.2. Modal `Editar PSAV`

Ambos comparten estructura:

- lado izquierdo con formulario,
- lado derecho con preview.

Campos:

- nombre del canal,
- entidad bancaria,
- numero de cuenta,
- divisa,
- carga de QR,
- visibilidad operativa,
- bitacora de cambio.

Preview lateral:

- imagen QR,
- nombre,
- banco,
- cuenta,
- aviso de legibilidad.

Visual:

- uno de los modales mas ricos del sistema,
- con look premium,
- mezcla de control operativo y representacion tangible del canal.

### 23.3. Modal `Eliminar PSAV`

Campos:

- motivo.

Debe verse como:

- confirmacion critica,
- roja pero elegante,
- con mensaje claro de irreversibilidad.

---

## 24. Ventana 31: Pagina dedicada de soporte

Ruta real:

- `/admin/soporte`

### 24.1. Proposito

Es la version independiente de la bandeja de soporte.

### 24.2. Diferencia frente a la tab

- la tab vive dentro del panel general,
- la pagina dedicada debe sentirse mas enfocada y menos mezclada con otras areas.

### 24.3. Recomendacion para Stitch

Puede conservar:

- una tabla central limpia,
- filtros simples,
- mayor aire visual,
- y foco absoluto en la atencion de casos.

---

## 25. Ventana 32: Pagina dedicada de auditoria

Ruta real:

- `/auditoria`

### 25.1. Proposito

Es la vista exclusiva para eventos de auditoria.

### 25.2. Enfoque visual

Debe sentirse como:

- consola de trazabilidad,
- libro mayor de acciones internas,
- historial confiable y serio.

### 25.3. Elementos sugeridos

- tabla extensa,
- filtros o fecha si Stitch quiere enriquecer el bosquejo,
- badges de accion,
- enfasis en motivo,
- y metadata temporal muy clara.

---

## 26. Estados transversales que Stitch debe contemplar

Estas condiciones deben existir a nivel visual en casi todas las pantallas:

### 26.1. Estado de carga

- skeletons,
- loaders discretos,
- placeholders de tabla y card.

### 26.2. Estado vacio

Ejemplos:

- sin onboards,
- sin tickets,
- sin transferencias,
- sin usuarios,
- sin PSAV,
- sin auditoria reciente.

### 26.3. Estado restringido

Especialmente para acciones solo admin:

- notices visuales,
- CTAs ocultos o deshabilitados,
- texto contextual claro.

### 26.4. Estado de riesgo

Para delete, reject o failed:

- rojo controlado,
- copy firme,
- confirmacion clara,
- nada de humor ni tono liviano.

---

## 27. Reglas de copy para Stitch

La interfaz interna debe usar un lenguaje:

- directo,
- profesional,
- tecnico,
- operativo,
- y con sentido de responsabilidad.

Preferir expresiones como:

- `Centro de control interno`
- `Mesa de verificacion`
- `Contexto de revision`
- `Motivo obligatorio`
- `Actualizar ticket`
- `Publicar cotizacion`
- `Completar orden`
- `Bitacora operativa`
- `Variables del sistema`
- `Trazabilidad activa`

Evitar:

- tono promocional,
- mensajes juguetones,
- copy demasiado comercial,
- o lenguaje ambiguo.

---

## 28. Prompt consolidado sugerido para Stitch

Usa este prompt como base:

> Diseña la seccion interna de staff y admin de una plataforma financiera llamada Guira. No debe verse como un dashboard SaaS generico. Debe sentirse como una mesa operativa moderna para revision, trazabilidad, soporte y gobierno interno.
>
> La experiencia vive en dark mode y usa una paleta sobria con:
> - fondo casi negro
> - superficies gris oscuro profundas
> - texto principal gris claro frio
> - azul electrico institucional para foco y estados activos
> - violeta como acento secundario
> - cyan para elementos tecnicos y sistema
> - verde para aprobados y completados
> - ambar para pendientes y warnings
> - rojo controlado para rechazos, fallas o acciones destructivas
>
> Diseña estas ventanas del staff:
> 1. Shell general interno con sidebar y header
> 2. Panel principal
> 3. Tab Overview
> 4. Tab Onboarding
> 5. Pagina de detalle de onboarding
> 6. Tab Orders
> 7. Modal Gestionar Orden
> 8. Modales Validar deposito, Preparar cotizacion, Registrar sent, Completar orden y Marcar failed
> 9. Tab Support
> 10. Modal Cambiar estado de ticket
> 11. Tab Audit
> 12. Tab Payins
> 13. Tab Transfers
> 14. Tab Users
> 15. Modales Crear usuario, Administrar, Archivar, Eliminar, Desarchivar y Reset password
> 16. Tab Config
> 17. Modales Ajustar Comision y Editar Variable del Sistema
> 18. Tab PSAV
> 19. Modales Nuevo PSAV, Editar PSAV y Eliminar PSAV
> 20. Pagina dedicada de Soporte
> 21. Pagina dedicada de Auditoria
>
> El sistema debe comunicar control operativo, estados claros, evidencia documental, decisiones auditables y acciones criticas con motivo obligatorio. Usa tablas elegantes, cards profundas, badges de estado, modales serios y una jerarquia visual muy clara. Evita un look de marketing o un look SaaS generico. Debe sentirse como una consola financiera interna premium.

---

## 29. Recomendacion practica de uso

Si vas a usar este documento con Stitch, lo ideal es:

1. pedir primero el shell y el panel principal,
2. luego pedir onboarding detail y orders, porque son las vistas mas ricas,
3. despues bajar a config, users y PSAV,
4. y por ultimo pedir una familia visual coherente de modales.

Las vistas mas importantes para empezar son:

1. `Panel principal`
2. `Detalle de onboarding`
3. `Orders + Gestionar orden`
4. `PSAV`

Porque resumen mejor el valor y la complejidad interna de Guira.
