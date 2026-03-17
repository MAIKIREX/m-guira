# Nuevas modificaciones para `Depositar` y `Enviar`

## Objetivo

Este documento redefine ajustes puntuales sobre la especificacion de movimientos ya documentada en `upgraes/new_movimientos.md`.

Estas modificaciones no cambian el contrato base de `payment_orders`, pero si cambian la UX y la forma en la que ciertos datos deben pedirse al cliente.

Documentos de referencia:

- `upgraes/new_movimientos.md`
- `informacion/13-reporte-movimiento-depositar.md`
- `informacion/14-reporte-movimiento-enviar.md`

---

## Regla general de interfaz

En las vistas de `Depositar` y `Enviar`, debajo del campo de monto ya no se debe mostrar el bloque anterior con:

- `monto origen`
- `fee total`
- `tipo de cambio`
- `monto destino`

A partir de esta modificacion, ese resumen compacto debe mostrar solo:

- `tipo de cambio`

Y adicionalmente debe mostrar una linea de apoyo con la conversion visible segun la ruta:

- de `USD -> Bs` cuando la operacion vaya de dolares a bolivianos,
- de `Bs -> USD` cuando la operacion vaya de bolivianos a dolares,
- o la conversion equivalente segun la ruta activa.

Reglas:

- no mostrar `fee total` en esta zona,
- no mostrar `monto destino` en esta zona,
- no repetir informacion que luego aparecera en la seccion `Expediente`,
- el bloque debe seguir siendo discreto, compacto y facil de leer.

---

## Modificacion especifica para `Depositar`

## Ruta: `Exterior a Bolivia`

### Metodo: `Recibir en cuenta bancaria`

Esta variante cambia respecto a la especificacion anterior.

### Campos visibles

En esta variante deben mostrarse solo estos campos operativos:

- `monto a recibir`
  - se guarda en `amount_origin`
- `Banco`
  - se guarda en `metadata.ach_details.bankName`
- `Cuenta bancaria`
  - se guarda en `metadata.ach_details.accountNumber`

### Regla importante

En esta variante ya no debe aparecer la logica de seleccionar banco o cuenta desde la lista de `proveedores`.

Esto significa:

- no mostrar `supplier_id`,
- no depender de `suppliers` para autocompletar banco o cuenta,
- no obligar al usuario a crear proveedor para esta ruta y este metodo,
- no reutilizar la validacion anterior basada en `bank_details` del proveedor para esta variante especifica.

### Persistencia esperada

Los datos deben seguir guardandose dentro de `metadata`, usando `ach_details`:

```json
{
  "route": "us_to_bolivia",
  "receive_variant": "bank_account",
  "delivery_method": "ach",
  "ach_details": {
    "routingNumber": "",
    "accountNumber": "valor ingresado por el usuario",
    "bankName": "valor ingresado por el usuario"
  }
}
```

Reglas:

- `routingNumber` debe guardarse como string vacio en este caso,
- no pedir `routingNumber` al usuario,
- `delivery_method` para esta variante debe modelarse como `ach`,
- no inventar columnas nuevas fuera de `metadata`.

### Implicacion operativa

Aunque la forma de captura cambia, la orden debe seguir usando:

- `order_type = WORLD_TO_BO`
- `processing_rail = ACH`

salvo que en una version futura se documente otra regla tecnica distinta.

---

### Metodo: `Recibir por QR`

Esta variante tambien se simplifica.

### Campos visibles

Solo deben mostrarse:

- `monto a recibir`
  - se guarda en `amount_origin`
- campo para adjuntar `QR bancario o respaldo`
  - se guarda en `support_document_url`

### Campos que no deben mostrarse

En esta variante no deben mostrarse ni pedirse:

- `routingNumber`
- `accountNumber`
- `bankName`

Justificacion:

- cuando el cliente envia un QR, la informacion bancaria ya esta contenida en el propio QR o en el respaldo,
- por lo tanto no tiene sentido duplicar esa captura manualmente.

### Persistencia esperada

```json
{
  "route": "us_to_bolivia",
  "receive_variant": "bank_qr",
  "delivery_method": "ach",
  "destination_address": "QR Bolivia",
  "instructions_source": "guira_hardcoded"
}
```

Y el archivo adjunto debe guardarse en:

- `support_document_url`

Reglas:

- `supplier_id = null`,
- no crear columna nueva para QR,
- no pedir campos bancarios manuales en esta variante.

---

## Impacto en `Enviar`

Estas modificaciones no cambian la estructura principal de rutas de `Enviar`, pero si impactan la lectura visual compartida con `Depositar`.

### Cambio obligatorio en el bloque debajo del monto

En todas las variantes de `Enviar`, el bloque compacto debajo del monto debe seguir la misma regla nueva:

- mostrar solo `tipo de cambio`,
- mostrar debajo una lectura simple de conversion segun la ruta,
- no mostrar `fee total`,
- no mostrar `monto destino`.

Esto aplica al menos a:

- `Bolivia al exterior`
- `Crypto a crypto`, si existiera una lectura equivalente de conversion o paridad visible

Regla:

- si una ruta no necesita una conversion cambiaria real, mostrar solo el dato que tenga sentido para esa operacion,
- evitar llenar ese bloque con metricas redundantes solo por mantener simetria visual.

---

## Resumen ejecutivo para implementacion

### En `Depositar > Exterior a Bolivia > Recibir en cuenta bancaria`

- eliminar seleccion por proveedor,
- pedir manualmente `Banco` y `Cuenta bancaria`,
- guardar ambos en `metadata.ach_details`,
- fijar `routingNumber = ""`,
- no pedir `routingNumber`.

### En `Depositar > Exterior a Bolivia > Recibir por QR`

- mostrar solo `amount_origin`,
- mostrar solo carga de `QR bancario o respaldo`,
- no mostrar `routingNumber`, `accountNumber` ni `bankName`,
- guardar el archivo en `support_document_url`.

### En `Depositar` y `Enviar`

- el bloque debajo de monto debe mostrar solo `tipo de cambio`,
- debajo debe mostrarse la conversion visible de una moneda a otra,
- quitar `fee total`,
- quitar `monto destino`.
