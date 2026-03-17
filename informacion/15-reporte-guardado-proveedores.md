# Reporte: guardado actual de nuevo proveedor

## Objetivo

Este documento resume como se esta guardando hoy un nuevo proveedor en la app, que campos envia el frontend a Supabase y un ejemplo JSON consistente con la implementacion actual.

## Ruta funcional

- Pantalla: `/(client)/proveedores`
- Entrada visual: [`app/(client)/proveedores/page.tsx`](/C:/Users/WitronVentas/Desktop/Aplicaciones/Guira/m-guira/app/(client)/proveedores/page.tsx)
- Workspace: [`features/client/components/client-operations-workspace.tsx`](/C:/Users/WitronVentas/Desktop/Aplicaciones/Guira/m-guira/features/client/components/client-operations-workspace.tsx)
- Seccion proveedores: [`features/payments/components/suppliers-section.tsx`](/C:/Users/WitronVentas/Desktop/Aplicaciones/Guira/m-guira/features/payments/components/suppliers-section.tsx)
- Formulario: [`features/payments/components/supplier-form.tsx`](/C:/Users/WitronVentas/Desktop/Aplicaciones/Guira/m-guira/features/payments/components/supplier-form.tsx)
- Validacion: [`features/payments/schemas/supplier.schema.ts`](/C:/Users/WitronVentas/Desktop/Aplicaciones/Guira/m-guira/features/payments/schemas/supplier.schema.ts)
- Persistencia: [`services/payments.service.ts`](/C:/Users/WitronVentas/Desktop/Aplicaciones/Guira/m-guira/services/payments.service.ts)

## Flujo actual de guardado

### 1. El usuario llena el formulario

El formulario siempre pide estos campos base:

- `name`
- `country`
- `payment_method`
- `address`
- `phone`
- `email`
- `tax_id`

Segun `payment_method`, se habilitan campos adicionales:

- `ach`
  - `ach_bank_name`
  - `ach_routing_number`
  - `ach_account_number`
  - `ach_bank_country`
- `swift`
  - `swift_bank_name`
  - `swift_code`
  - `swift_account_number`
  - `swift_bank_country`
  - `swift_iban`
  - `swift_bank_address`
- `crypto`
  - `crypto_address`
  - `crypto_network`

### 2. Zod valida el formulario

La validacion actual obliga:

- ACH: banco, routing number y cuenta
- SWIFT: banco, codigo SWIFT, cuenta y pais del banco
- Crypto: direccion y red

No existe transformacion compleja antes de guardar. El frontend solo arma el objeto final segun el metodo elegido.

### 3. El frontend construye el payload

En [`features/payments/components/supplier-form.tsx`](/C:/Users/WitronVentas/Desktop/Aplicaciones/Guira/m-guira/features/payments/components/supplier-form.tsx), al enviar se construye un `SupplierUpsertInput` con esta logica:

- Siempre envia:
  - `user_id`
  - `name`
  - `country`
  - `payment_method`
  - `address`
  - `phone`
  - `email`
  - `tax_id`
- Si el metodo es `ach` o `swift`, agrega `bank_details`
- Si el metodo es `crypto`, agrega `crypto_details`

### 4. Supabase hace insert directo

En [`services/payments.service.ts`](/C:/Users/WitronVentas/Desktop/Aplicaciones/Guira/m-guira/services/payments.service.ts) el alta actual es:

```ts
supabase.from('suppliers').insert(input).select('*').single()
```

Esto significa:

- no hay normalizacion extra en backend desde este servicio,
- no hay `upsert`,
- no hay auditoria adicional para proveedores,
- no hay soft delete,
- se inserta exactamente el payload que arma el formulario.

### 5. La UI actual solo permite un metodo por proveedor

Aunque el tipo `Supplier.payment_method` tolera strings o listas historicas, el formulario actual solo deja elegir uno:

- `crypto`
- `ach`
- `swift`

Entonces, al crear un proveedor nuevo hoy, `payment_method` se guarda como string simple, no como arreglo ni CSV multiple.

## Estructura actual esperada en Supabase

Segun el codigo actual, la tabla `suppliers` se usa con este contrato funcional:

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

## Ejemplo JSON realista de registro nuevo en Supabase

Este ejemplo refleja como quedaria un proveedor SWIFT despues del `insert`:

```json
{
  "id": "9b1e5c3a-6b11-4d7e-9c31-f7b3a2d1e908",
  "user_id": "1a4f6f7e-2e4d-45cb-91a4-1d2d9a58c001",
  "name": "Acme Imports LLC",
  "country": "United States",
  "payment_method": "swift",
  "bank_details": {
    "swift": {
      "bank_name": "JPMorgan Chase Bank",
      "swift_code": "CHASUS33",
      "account_number": "1234567890",
      "bank_country": "United States",
      "iban": "",
      "bank_address": "383 Madison Ave, New York, NY 10179"
    }
  },
  "crypto_details": null,
  "address": "501 Lexington Ave, New York, NY 10017",
  "phone": "+1 212 555 0187",
  "email": "payments@acmeimports.com",
  "tax_id": "98-7654321",
  "created_at": "2026-03-17T15:20:11.402Z",
  "updated_at": "2026-03-17T15:20:11.402Z"
}
```

## Ejemplo del payload exacto que envia el frontend

Antes del insert, el objeto construido por el formulario para ese mismo caso seria:

```json
{
  "user_id": "1a4f6f7e-2e4d-45cb-91a4-1d2d9a58c001",
  "name": "Acme Imports LLC",
  "country": "United States",
  "payment_method": "swift",
  "bank_details": {
    "swift": {
      "bank_name": "JPMorgan Chase Bank",
      "swift_code": "CHASUS33",
      "account_number": "1234567890",
      "bank_country": "United States",
      "iban": "",
      "bank_address": "383 Madison Ave, New York, NY 10179"
    }
  },
  "address": "501 Lexington Ave, New York, NY 10017",
  "phone": "+1 212 555 0187",
  "email": "payments@acmeimports.com",
  "tax_id": "98-7654321"
}
```

## Variantes por metodo de pago

### Proveedor ACH

```json
{
  "user_id": "uuid",
  "name": "North River Services",
  "country": "United States",
  "payment_method": "ach",
  "bank_details": {
    "ach": {
      "bank_name": "Bank of America",
      "routing_number": "026009593",
      "account_number": "000123456789",
      "bank_country": "United States"
    }
  },
  "address": "Miami, Florida",
  "phone": "+1 305 555 1020",
  "email": "treasury@northriver.com",
  "tax_id": "11-2223333"
}
```

### Proveedor crypto

```json
{
  "user_id": "uuid",
  "name": "Digital Settlement Desk",
  "country": "Panama",
  "payment_method": "crypto",
  "crypto_details": {
    "address": "0x8ba1f109551bd432803012645ac136ddd64dba72",
    "network": "Polygon"
  },
  "address": "Ciudad de Panama",
  "phone": "+507 6000 1000",
  "email": "ops@digitalsettlement.io",
  "tax_id": "RUC-778899"
}
```

## Observaciones importantes

- El alta de proveedor hoy no adjunta documentos.
- No se registra actividad en `activity_logs` al crear, editar o eliminar proveedor.
- La eliminacion actual es hard delete:

```ts
supabase.from('suppliers').delete().eq('id', id)
```

- El frontend asume que la tabla `suppliers` acepta columnas JSON como `bank_details` y `crypto_details`.
- El contrato historico en [`informacion/06-contratos-backend-supabase.md`](/C:/Users/WitronVentas/Desktop/Aplicaciones/Guira/m-guira/informacion/06-contratos-backend-supabase.md) hablaba de `bank | crypto`, pero la implementacion actual ya trabaja con `ach | swift | crypto`.

## Conclusion

Actualmente un nuevo proveedor se guarda con insert directo sobre `suppliers`, usando un payload armado 100% desde el formulario y con un solo metodo de pago por alta nueva. El formato actual mas preciso para Supabase ya no es `bank`, sino `ach`, `swift` o `crypto`, con detalles bancarios anidados dentro de `bank_details`.
