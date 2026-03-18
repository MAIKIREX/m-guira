Objetivo

Corregir y cerrar el flujo `WORLD_TO_BO` (`route = us_to_bolivia`, etiqueta UI: `Exterior a Bolivia`) para que el comportamiento real de cliente y staff quede alineado con la logica actual del proyecto.

Contexto actual del proyecto

- La ruta `us_to_bolivia` se crea desde `Depositar`.
- El expediente se guarda como `order_type = WORLD_TO_BO`.
- El formulario precarga:
  - `origin_currency = USD`
  - `destination_currency = Bs`
  - `receive_variant = bank_account`
- El calculo automatico de `amount_converted`, `exchange_rate_applied` y `fee_total` se hace en `features/payments/lib/deposit-instructions.ts`.
- La publicacion de cotizacion final por parte de staff actualmente actualiza solo campos ya existentes:
  - `exchange_rate_applied`
  - `amount_converted`
  - `fee_total`
  - `metadata.quote_prepared_at`
  - `metadata.quote_prepared_by`
- El paso de `deposit_received` a `processing` debe ocurrir solo cuando el cliente acepta la cotizacion final.

Problemas detectados

1. Staff puede mover una orden `WORLD_TO_BO` a `deposit_received` aunque el cliente no haya subido el comprobante del deposito.
2. La logica visual del cliente no diferencia bien entre:
   - orden en `deposit_received` pero sin cotizacion final publicada
   - orden en `deposit_received` con cotizacion final ya publicada
3. El boton `Aceptar cotizacion` no debe mostrarse mientras la cotizacion final aun no exista realmente.
4. La instruccion funcional debe dejar claro que publicar cotizacion no mueve el estado a `processing`; ese cambio ocurre solo cuando el cliente acepta.

Comportamiento esperado

Paso 1. Creacion del expediente

- El cliente llena sus datos para `Exterior a Bolivia`.
- Se crea la orden en `payment_orders` con estado `created`.
- Esto ya funciona y no debe romperse.

Paso 2. Carga de comprobante del deposito

- El cliente debe subir el comprobante del deposito antes de que staff pueda validar el deposito.
- Para `WORLD_TO_BO`, staff no debe poder ejecutar la accion `Validar deposito del cliente` si falta el archivo del cliente.
- La validacion debe exigir al menos `evidence_url`.
- Si el negocio requiere tambien respaldo adicional, dejarlo explicitamente documentado y validado. Si no, la regla minima obligatoria es `evidence_url`.

Paso 3. Validacion de deposito por staff

- Solo cuando el comprobante del cliente exista, staff puede mover la orden a `deposit_received`.
- Si falta el comprobante, la accion debe bloquearse con mensaje claro.
- Esta restriccion aplica especialmente a `WORLD_TO_BO`.

Paso 4. Publicacion de cotizacion final

- Estando la orden en `deposit_received`, staff puede abrir `Preparar cotizacion`.
- Al publicar, se debe actualizar la base de datos con los valores ya soportados por el proyecto:
  - `exchange_rate_applied`
  - `amount_converted`
  - `fee_total`
  - `metadata.quote_prepared_at`
  - `metadata.quote_prepared_by`
- Estos cambios deben verse reflejados de inmediato en la seccion `Transacciones` del cliente.
- Publicar la cotizacion no debe cambiar el estado a `processing`.
- El estado correcto debe seguir siendo `deposit_received` hasta que el cliente acepte.

Paso 5. Aceptacion de cotizacion por el cliente

- El boton `Aceptar cotizacion` solo debe mostrarse cuando la cotizacion final ya esta completa y publicada por staff.
- No basta con que la orden este en `deposit_received`.
- Si la orden esta en `deposit_received` pero la cotizacion aun no fue publicada, el usuario debe ver un mensaje informativo, no el boton de aceptacion.
- Cuando el cliente acepta:
  - la orden pasa a `processing`
  - se registra `metadata.client_quote_accepted_at`

Cambios funcionales que Codex debe implementar

1. Endurecer la accion de staff que mueve la orden a `deposit_received`.
2. Restringir esa accion para `WORLD_TO_BO` cuando falte `evidence_url`.
3. Asegurar que la UI de cliente muestre el boton `Aceptar cotizacion` solo si la cotizacion esta realmente lista.
4. Mantener la separacion correcta entre:
   - `deposit_received`: deposito validado, esperando cotizacion o aprobacion del cliente
   - `processing`: cliente ya acepto la cotizacion final
5. Confirmar que al publicar la cotizacion se refresque la informacion del historial/transacciones del cliente y se vean los nuevos valores.

Archivos a revisar primero

- `services/staff.service.ts`
- `features/staff/components/staff-action-dialogs.tsx`
- `services/payments.service.ts`
- `features/payments/components/payments-history-table.tsx`
- `features/payments/components/create-payment-order-form.tsx`
- `features/payments/lib/deposit-instructions.ts`

Notas de implementacion

- No cambiar la regla existente donde la aceptacion del cliente es la que mueve la orden a `processing`.
- No introducir un estado nuevo si no es estrictamente necesario.
- No agregar campos nuevos en `metadata`.
- Reutilizar unicamente los campos de `metadata` que ya existen hoy en el proyecto.
- Si ya existe una funcion tipo `hasReadyQuote(order)`, reutilizarla para decidir visibilidad del boton, no solo para deshabilitarlo.
- La validacion del comprobante para `WORLD_TO_BO` debe hacerse tanto en backend/logica de servicio como en la UI de staff para evitar acciones inconsistentes.
- Si se cambia la validacion, cuidar que no rompa `US_TO_WALLET`.

Criterios de aceptacion

- No se puede pasar una orden `WORLD_TO_BO` a `deposit_received` sin comprobante de deposito del cliente.
- Cuando staff publica cotizacion final, los valores nuevos quedan persistidos en `payment_orders`.
- En la vista del cliente, esos valores actualizados se reflejan en `Transacciones`.
- El boton `Aceptar cotizacion` no aparece antes de que la cotizacion final exista.
- Al aceptar la cotizacion, la orden pasa a `processing`.
- El flujo `US_TO_WALLET` sigue funcionando.
