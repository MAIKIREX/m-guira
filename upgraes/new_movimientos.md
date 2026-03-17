# Nueva especificacion de movimientos

## Objetivo

Redefinir las instrucciones de `Depositar` y `Enviar` para el nuevo sistema de movimientos sin romper la coherencia con:

- la tabla `suppliers`,
- la forma real en la que hoy se guardan los proveedores,
- la tabla `payment_orders`,
- y el comportamiento actual ya documentado en `depositar` y `enviar`.

Documentos base para esta version:

- `informacion/13-reporte-movimiento-depositar.md`
- `informacion/14-reporte-movimiento-enviar.md`
- `informacion/15-reporte-guardado-proveedores.md`

---

## Principio rector

El nuevo sistema **no debe crear tablas nuevas para movimientos**. Todo expediente debe seguir viviendo en `payment_orders`, usando:

- columnas base para el estado operativo,
- `supplier_id` para vincular proveedor o beneficiario,
- `support_document_url` para respaldo inicial,
- `evidence_url` para comprobante del deposito o fondeo,
- `metadata` para guardar variantes de UI que no existen como columnas.

---

## Contrato obligatorio de `payment_orders`

La orden en Supabase debe seguir usando exactamente estos campos:

- `id`
- `user_id`
- `order_type`
- `processing_rail`
- `amount_origin`
- `origin_currency`
- `amount_converted`
- `destination_currency`
- `exchange_rate_applied`
- `fee_total`
- `status`
- `beneficiary_id`
- `supplier_id`
- `metadata`
- `evidence_url`
- `support_document_url`
- `staff_comprobante_url`
- `created_at`
- `updated_at`

Regla:

- no agregar columnas nuevas a `payment_orders` para resolver variantes de movimiento,
- cualquier diferencia de UX debe modelarse dentro de `metadata`.

---

## Contrato obligatorio de `suppliers`

Segun `informacion/15-reporte-guardado-proveedores.md`, hoy los proveedores se guardan asi:

- `payment_method` solo puede ser `ach`, `swift` o `crypto` en las altas nuevas,
- los datos bancarios viven dentro de `bank_details`,
- los datos crypto viven dentro de `crypto_details`.

Estructura funcional actual:

```json
{
  "user_id": "uuid",
  "name": "string",
  "country": "string",
  "payment_method": "crypto | ach | swift",
  "bank_details": {
    "ach": {
      "bank_name": "string",
      "routing_number": "string",
      "account_number": "string",
      "bank_country": "string"
    },
    "swift": {
      "bank_name": "string",
      "swift_code": "string",
      "account_number": "string",
      "bank_country": "string",
      "iban": "string",
      "bank_address": "string"
    }
  },
  "crypto_details": {
    "address": "string",
    "network": "string"
  },
  "address": "string",
  "phone": "string",
  "email": "string",
  "tax_id": "string"
}
```

Regla:

- todas las validaciones de proveedor para movimientos deben leer esta estructura real,
- no asumir proveedores con formato viejo `bank | crypto`,
- no inventar campos separados como `ach_bank_name` dentro del proveedor fuera de `bank_details`.

---

## Matriz canonica de rutas

### Depositar

- `Exterior a Bolivia`
  - ruta UI: `us_to_bolivia`
  - `order_type`: `WORLD_TO_BO`
  - `processing_rail`: depende del metodo final elegido
    - `ACH`
    - `SWIFT`
    - `DIGITAL_NETWORK` solo si el destino final fuera digital
- `USA a wallet`
  - ruta UI: `us_to_wallet`
  - `order_type`: `US_TO_WALLET`
  - `processing_rail`: `PSAV`

### Enviar

- `Bolivia al exterior`
  - ruta UI: `bolivia_to_exterior`
  - `order_type`: `BO_TO_WORLD`
  - `processing_rail`: depende del metodo
    - `ACH`
    - `SWIFT`
    - `DIGITAL_NETWORK`
- `Crypto a crypto`
  - ruta UI: `crypto_to_crypto`
  - `order_type`: `CRYPTO_TO_CRYPTO`
  - `processing_rail`: `DIGITAL_NETWORK`

Regla:

- la ruta de UI puede seguir existiendo como selector visual,
- pero para trazabilidad debe guardarse tambien dentro de `metadata.route`.

---

## Estructura canonica de `metadata`

El sistema nuevo debe mantener estos campos ya usados por el frontend actual:

```json
{
  "route": "us_to_bolivia | us_to_wallet | bolivia_to_exterior | crypto_to_crypto",
  "delivery_method": "swift | ach | crypto",
  "payment_reason": "string",
  "intended_amount": 0,
  "destination_address": "string",
  "stablecoin": "USDC",
  "funding_method": "bs | crypto | ach | wallet",
  "swift_details": {
    "bankName": "string",
    "swiftCode": "string",
    "iban": "string",
    "bankAddress": "string",
    "country": "string"
  },
  "ach_details": {
    "routingNumber": "string",
    "accountNumber": "string",
    "bankName": "string"
  },
  "crypto_destination": {
    "address": "string",
    "network": "string"
  }
}
```

Adicionalmente, para el nuevo sistema se permite sumar claves de UI dentro de `metadata` cuando no exista columna dedicada:

```json
{
  "receive_variant": "bank_account | bank_qr | wallet",
  "ui_method_group": "bank | crypto",
  "instructions_source": "psav | guira_hardcoded | supplier",
  "supplier_validation_note": "string"
}
```

Regla:

- `delivery_method` sigue siendo el metodo tecnico canonico,
- `receive_variant` o `ui_method_group` sirven para distinguir la experiencia visual sin romper el contrato actual.

---

## Flujo canonico de estados

### Etapa revisar

Cuando el cliente acepta el resumen:

- se crea la orden en `payment_orders`,
- `status` debe quedar en `created`.

### Etapa finalizar

En esta etapa el cliente sube el comprobante de deposito o fondeo:

- el archivo se guarda en `evidence_url`,
- cuando el archivo se sube y la orden esta en `created`, el sistema puede moverla a `waiting_deposit`.

### Respaldo inicial

Si la ruta pide documento de respaldo:

- el archivo se guarda en `support_document_url`,
- esto puede ocurrir al momento de crear la orden.

---

## Especificacion nueva de Depositar

## 1. Ruta: Exterior a Bolivia

### Paso 1. Ruta

Mostrar:

- `Exterior a Bolivia`
- `USA a wallet`

### Paso 2. Seleccionar metodo

Para `Exterior a Bolivia` mostrar dos variantes de recepcion:

- `Recibir en cuenta bancaria`
- `Recibir por QR`

Importante:

- estas opciones son de UI,
- no son columnas nuevas,
- deben resolverse en `metadata.receive_variant`.

### Paso 3. Detalle

#### Variante `Recibir en cuenta bancaria`

Campos visibles:

- `amount_origin`
- selector `supplier_id`

Texto de ayuda debajo del selector:

- "Debes crear un proveedor con la cuenta de destino antes de usar esta opcion. Si aun no existe, puedes crearlo en Proveedores."

Accion visible:

- boton que navega a `Proveedores`.

Cuando el usuario elige proveedor:
recien mostrar los otros campos antes de eso no tieneen que ser visibles:

- mostrar `origin_currency`,
- mostrar `destination_currency`,
- mostrar `delivery_method`,
- mostrar bloque de metadata autocompletada segun el proveedor.

Reglas de autocompletado:

- si el proveedor tiene `bank_details.ach`, se puede usar `delivery_method = ach`,
- si el proveedor tiene `bank_details.swift`, se puede usar `delivery_method = swift`,
- si no tiene ninguna de las dos, bloquear la seleccion para esta variante.

Regla de negocio pedida para esta ruta:

- si se usa cuenta bancaria para `Exterior a Bolivia`, validar que la cuenta del proveedor represente destino local en Bolivia,
- usar `bank_country` del detalle bancario como base de validacion,
- si `bank_country !== Bolivia`, mostrar alerta bloqueante y no permitir continuar.

Metadata esperada:

```json
{
  "route": "us_to_bolivia",
  "receive_variant": "bank_account",
  "delivery_method": "ach | swift",
  "destination_address": "Cuenta destino en Bolivia",
  "ach_details": {
    "bankName": "desde supplier.bank_details.ach.bank_name",
    "routingNumber": "desde supplier.bank_details.ach.routing_number",
    "accountNumber": "desde supplier.bank_details.ach.account_number"
  },
  "swift_details": {
    "bankName": "desde supplier.bank_details.swift.bank_name",
    "swiftCode": "desde supplier.bank_details.swift.swift_code",
    "iban": "desde supplier.bank_details.swift.iban",
    "bankAddress": "desde supplier.bank_details.swift.bank_address",
    "country": "desde supplier.bank_details.swift.bank_country"
  }
}
```

#### Variante `Recibir por QR`

Campos visibles (solo se tieneen que mostrar estos datos y no otrs):

- `amount_origin`
- adjuntar QR bancario o respaldo

Persistencia:

- el archivo se guarda como `support_document_url`,
- no necesita crear columna nueva para QR.

Regla de modelado:

- `supplier_id = null`,
- `metadata.receive_variant = "bank_qr"`,
- `metadata.destination_address = "QR Bolivia"`,
- `metadata.instructions_source = "guira_hardcoded"` mientras los datos no salgan de base.

### Paso 4. Revisar

Mostrar resumen completo de:

- ruta,
- variante elegida,
- monto,
- proveedor si existe,
- metodo tecnico derivado,
- metadata autocompletada,
- respaldo adjunto si existe.

Al aceptar:

- crear la orden con `status = "created"`.

### Paso 5. Finalizar

Mostrar:

- campo para subir comprobante del deposito,
- texto aclarando que puede subirse ahora o despues,
- datos de la cuenta exterior de Guira.

Regla temporal:

- los datos de Guira pueden ser hardcodeados por ahora,
- luego deben venir de configuracion o `app_settings`.

---

## 2. Ruta: USA a wallet

### Paso 2. Seleccionar metodo

Mostrar solo:

- `Recibir en tu billetera cripto`

### Paso 3. Detalle

Campos:

- `amount_origin` en USD
- `origin_currency = USD`
- `destination_currency = USD`
- direccion de la billetera
- red de recepcion

Regla:

- esta ruta no necesita `supplier_id` en la implementacion actual,
- si en el futuro se permite autocompletar desde proveedores crypto, debe ser opcional.

Modelado canonico:

- `order_type = US_TO_WALLET`
- `processing_rail = PSAV`
- `supplier_id = null`

Metadata esperada:

```json
{
  "route": "us_to_wallet",
  "receive_variant": "wallet",
  "delivery_method": "ach",
  "destination_address": "wallet del cliente",
  "stablecoin": "USDC",
  "crypto_destination": {
    "address": "wallet del cliente",
    "network": "red elegida"
  }
}
```

Nota importante:

- `delivery_method = ach` se mantiene por coherencia con el flujo tecnico actual de fondeo/PSAV,
- el destino final cripto vive en `metadata.crypto_destination`.

### Paso 4. Revisar

Mostrar resumen de:

- monto,
- wallet destino,
- red,
- rail tecnico `PSAV`.

Al aceptar:

- crear orden en `created`.

### Paso 5. Finalizar

Mostrar:

- campo para subir comprobante del fondeo,
- aclaracion de que puede hacerse ahora o despues,
- instrucciones PSAV disponibles en el sistema.

Regla:

- primero intentar leer `psav_configs`,
- si no hay configuracion suficiente, usar fallback temporal hardcodeado.

---

## Especificacion nueva de Enviar

## 1. Ruta: Bolivia al exterior

### Paso 1. Ruta

Mostrar:

- `Bolivia al exterior`
- `Crypto a crypto`

### Paso 2. Seleccionar metodo

Para `Bolivia al exterior` mostrar dos grupos:

- `ACH o SWIFT`
- `Crypto`

Regla:

- este selector es de UX,
- el valor tecnico final se guarda en `metadata.delivery_method`.

### Paso 3. Detalle

#### Grupo `ACH o SWIFT`

Campos:

- `amount_origin` en bolivianos
- `supplier_id`

Al elegir proveedor:
recien mostrar los otros campos antes de eso no tieneen que ser visibles:

- mostrar `origin_currency`,
- mostrar `destination_currency`,
- mostrar selector `delivery_method` con opciones permitidas por el proveedor:
  - `ach` si existe `bank_details.ach`
  - `swift` si existe `bank_details.swift`

Bloqueos obligatorios:

- si el proveedor no tiene ni `ach` ni `swift`, mostrar alerta bloqueante,
- si el usuario elige `ach` y el proveedor no tiene `bank_details.ach`, bloquear,
- si el usuario elige `swift` y el proveedor no tiene `bank_details.swift`, bloquear.

Metadata autocompletada:

- ACH:

```json
{
  "delivery_method": "ach",
  "ach_details": {
    "bankName": "supplier.bank_details.ach.bank_name",
    "routingNumber": "supplier.bank_details.ach.routing_number",
    "accountNumber": "supplier.bank_details.ach.account_number"
  }
}
```

- SWIFT:

```json
{
  "delivery_method": "swift",
  "swift_details": {
    "bankName": "supplier.bank_details.swift.bank_name",
    "swiftCode": "supplier.bank_details.swift.swift_code",
    "iban": "supplier.bank_details.swift.iban",
    "bankAddress": "supplier.bank_details.swift.bank_address",
    "country": "supplier.bank_details.swift.bank_country"
  }
}
```

#### Grupo `Crypto`

Campos:

- `amount_origin` en bolivianos
- `supplier_id`

Al elegir proveedor:
recien mostrar los otros campos antes de eso no tieneen que ser visibles:

- mostrar `origin_currency`,
- mostrar `destination_currency`,
- fijar `delivery_method = crypto`,
- mostrar metadata crypto autocompletada.

Bloqueo obligatorio:

- si el proveedor no tiene `crypto_details.address`, mostrar alerta y no dejar continuar.

Metadata esperada:

```json
{
  "delivery_method": "crypto",
  "crypto_destination": {
    "address": "supplier.crypto_details.address",
    "network": "supplier.crypto_details.network"
  }
}
```

Campos extra obligatorios para toda la ruta `Bolivia al exterior`:

- `payment_reason`
- `support_document_url` opcional pero recomendado segun flujo actual

Modelado canonico:

- `order_type = BO_TO_WORLD`
- `processing_rail` depende de `delivery_method`
- `funding_method = bs`

### Paso 4. Revisar

Mostrar:

- ruta,
- grupo de metodo,
- proveedor,
- monto,
- metodo tecnico final,
- motivo de pago,
- metadata autocompletada,
- respaldo si se adjunto.

Al aceptar:

- crear orden en `created`.

### Paso 5. Finalizar

Mostrar:

- campo para subir comprobante del deposito,
- explicacion de que puede completarse luego,
- datos PSAV o instrucciones de Guira para que el cliente realice el deposito.

Regla:

- priorizar configuracion desde `psav_configs`,
- usar hardcode solo como fallback temporal.

---

## 2. Ruta: Crypto a crypto

### Paso 2. Seleccionar metodo

Mostrar solo:

- `Crypto`

### Paso 3. Detalle

Campos:

- `amount_origin` en USDC
- `supplier_id`
- `payment_reason` obligatorio
- documento de respaldo obligatorio

Reglas de proveedor:

- el proveedor debe tener `crypto_details.address`,
- si no existe, mostrar alerta bloqueante y no permitir continuar.

Reglas de persistencia:

- el documento de respaldo se guarda en `support_document_url` al crear la orden,
- `delivery_method = crypto`,
- `processing_rail = DIGITAL_NETWORK`,
- `order_type = CRYPTO_TO_CRYPTO`.

Metadata esperada:

```json
{
  "route": "crypto_to_crypto",
  "ui_method_group": "crypto",
  "delivery_method": "crypto",
  "payment_reason": "obligatorio",
  "destination_address": "wallet del proveedor o beneficiario",
  "stablecoin": "USDC",
  "crypto_destination": {
    "address": "supplier.crypto_details.address",
    "network": "supplier.crypto_details.network"
  }
}
```

### Paso 4. Revisar

Mostrar:

- monto,
- proveedor,
- wallet destino,
- red,
- motivo,
- documento de respaldo adjunto.

Al aceptar:

- crear orden en `created`.

### Paso 5. Finalizar

Mostrar:

- campo para subir comprobante del deposito,
- explicacion de que puede hacerse ahora o despues,
- datos de la wallet cripto de Guira.

Regla temporal:

- si aun no hay fuente de configuracion, permitir hardcode,
- luego mover esas wallets a configuracion central.

---

## Validaciones transversales obligatorias

### Proveedor

- si el flujo requiere proveedor, `supplier_id` es obligatorio,
- si el metodo tecnico elegido no existe dentro del proveedor, bloquear,
- las validaciones deben leer desde:
  - `bank_details.ach`
  - `bank_details.swift`
  - `crypto_details`

### Archivos

- `support_document_url`
  - obligatorio en `crypto_to_crypto`,
  - opcional en `us_to_bolivia`,
  - recomendado en `bolivia_to_exterior`
- `evidence_url`
  - se carga en `finalizar`,
  - puede completarse despues.

### Rutas y monedas

- `bolivia_to_exterior`
  - `origin_currency = Bs`
  - `destination_currency = USD`
- `us_to_bolivia`
  - `origin_currency = USD`
  - `destination_currency = Bs`
- `us_to_wallet`
  - `origin_currency = USD`
  - `destination_currency = USD`
- `crypto_to_crypto`
  - `origin_currency = USDC`
  - `destination_currency = USDC`

---

## Ejemplos canonicos de payload

### Ejemplo `Exterior a Bolivia` con cuenta bancaria

```json
{
  "user_id": "uuid",
  "order_type": "WORLD_TO_BO",
  "processing_rail": "ACH",
  "amount_origin": 1200,
  "origin_currency": "USD",
  "amount_converted": 8352,
  "destination_currency": "Bs",
  "exchange_rate_applied": 6.96,
  "fee_total": 12,
  "beneficiary_id": null,
  "supplier_id": "uuid-proveedor",
  "metadata": {
    "route": "us_to_bolivia",
    "receive_variant": "bank_account",
    "delivery_method": "ach",
    "payment_reason": "",
    "intended_amount": 8352,
    "destination_address": "Cuenta bancaria en Bolivia",
    "stablecoin": "USDC",
    "ach_details": {
      "bankName": "Banco local",
      "routingNumber": "026009593",
      "accountNumber": "000123456789"
    }
  }
}
```

### Ejemplo `Bolivia al exterior` con crypto

```json
{
  "user_id": "uuid",
  "order_type": "BO_TO_WORLD",
  "processing_rail": "DIGITAL_NETWORK",
  "amount_origin": 10000,
  "origin_currency": "Bs",
  "amount_converted": 1434.63,
  "destination_currency": "USD",
  "exchange_rate_applied": 6.96,
  "fee_total": 15,
  "beneficiary_id": null,
  "supplier_id": "uuid-proveedor-crypto",
  "metadata": {
    "route": "bolivia_to_exterior",
    "ui_method_group": "crypto",
    "delivery_method": "crypto",
    "payment_reason": "Pago internacional a partner",
    "intended_amount": 1434.63,
    "destination_address": "0x8ba1f109551bd432803012645ac136ddd64dba72",
    "stablecoin": "USDC",
    "funding_method": "bs",
    "crypto_destination": {
      "address": "0x8ba1f109551bd432803012645ac136ddd64dba72",
      "network": "Polygon"
    }
  }
}
```

---

## Cierre

Esta especificacion mejora el documento original porque:

- separa claramente UI de persistencia,
- reutiliza el contrato real de `suppliers`,
- respeta el contrato obligatorio de `payment_orders`,
- y deja claro donde deben vivir las nuevas variantes: dentro de `metadata`, no en columnas nuevas.

La implementacion nueva de movimientos debe seguir este documento como contrato funcional.


