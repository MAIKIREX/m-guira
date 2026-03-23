# Reporte detallado de login y registro en Guira

## Objetivo

Este documento explica, paso por paso y sin asumir conocimiento previo, como estan configurados el login y el registro en Guira, que datos pide cada formulario, a que servicios llaman, que datos se envian a Supabase Auth, que datos terminan en las tablas de negocio y como se encadena todo con el onboarding.

La idea clave es esta:

- `login` valida una identidad ya existente.
- `registro` crea una cuenta base.
- despues del registro, el usuario cliente normalmente debe completar `onboarding`.
- la aplicacion no funciona solo con `auth.users`; tambien necesita una fila en `profiles`.

---

## 1. Resumen ejecutivo

Hoy el sistema tiene dos niveles de registro:

### 1.1. Registro de cuenta

Ruta publica:

- `/registro`

Este formulario solo pide:

- nombre completo,
- correo electronico,
- contrasena,
- aceptacion de terminos.

Ese formulario llama a:

- `supabase.auth.signUp(...)`

No inserta directamente una fila desde el frontend en la tabla `profiles`.

### 1.2. Registro operativo o onboarding

Ruta:

- `/onboarding`

Despues del alta de cuenta, el usuario cliente debe completar un onboarding para poder operar.

Ese onboarding puede ser:

- `personal`
- `company`

Y ahi si se guardan muchos mas datos en la tabla:

- `onboarding`

Ademas se suben documentos a Storage y se registran referencias en:

- `documents`

### 1.3. Login

Ruta publica:

- `/login`

Pide:

- email
- password

Y llama a:

- `supabase.auth.signInWithPassword(...)`

No crea registros nuevos en tablas de negocio. Lo que hace es abrir una sesion y luego la app busca la fila del usuario en `profiles`.

---

## 2. Archivos relevantes del flujo

Estos son los archivos principales que controlan login, registro y acceso:

- `app/(public)/login/page.tsx`
- `app/(public)/registro/page.tsx`
- `features/auth/components/login-form.tsx`
- `features/auth/components/register-form.tsx`
- `features/auth/schemas/login.schema.ts`
- `features/auth/schemas/register.schema.ts`
- `services/auth.service.ts`
- `components/shared/auth-guard.tsx`
- `services/profile.service.ts`
- `features/onboarding/components/onboarding-wizard.tsx`
- `features/onboarding/components/personal-form.tsx`
- `features/onboarding/components/company-form.tsx`
- `services/onboarding.service.ts`

---

## 3. Como esta configurado el login

## 3.1. Ruta de entrada

La pantalla de login publica esta en:

- `/login`

El archivo de pagina solo monta el componente:

- `LoginForm`

## 3.2. Que informacion pide el formulario de login

El formulario pide exactamente dos campos:

- `email`
- `password`

No pide:

- nombre,
- rol,
- codigo de verificacion,
- telefono,
- captcha,
- ni terminos.

## 3.3. Validaciones del login

La validacion se hace con Zod.

### Campo `email`

Regla:

- debe ser un correo electronico valido.

Si no cumple, el formulario muestra el error:

- `Debe ser un correo electrónico válido`

### Campo `password`

Regla:

- debe existir,
- no puede venir vacio.

Si no cumple, el error es:

- `La contraseña es requerida`

## 3.4. Que servicio usa el login

Cuando el usuario hace submit, el formulario llama:

- `AuthService.login(data)`

Ese servicio ejecuta:

```ts
supabase.auth.signInWithPassword({ email, password })
```

## 3.5. Que se envia realmente en login

### Payload que sale del frontend al servicio de auth

```json
{
  "email": "usuario@ejemplo.com",
  "password": "MiPasswordSegura123!"
}
```

### Que hace Supabase con eso

Supabase Auth valida si:

- el usuario existe,
- la contrasena coincide,
- la cuenta puede autenticarse.

Si todo sale bien, Supabase devuelve:

- `session`
- `user`

## 3.6. Que NO hace el login

El login no:

- inserta filas en `profiles`,
- inserta filas en `onboarding`,
- actualiza `documents`,
- crea `payment_orders`,
- ni registra directamente nuevas filas de negocio.

Lo que hace es abrir sesion.

## 3.7. Que pasa despues del login

Una vez que la sesion existe, entra el `AuthGuard`.

Ese guard:

1. obtiene la sesion actual,
2. toma el `user.id` de Supabase Auth,
3. busca la fila correspondiente en la tabla `profiles`,
4. guarda `session`, `user` y `profile` en stores locales,
5. decide a donde redirigir.

## 3.8. Tabla consultada despues del login

El login como tal no inserta en base, pero si dispara esta lectura:

```sql
select * from profiles where id = userId
```

## 3.9. Logica de redireccion despues del login

La app toma la fila en `profiles` y revisa:

- `role`
- `onboarding_status`
- `is_archived`

### Si `is_archived = true`

La app cierra la sesion y manda a:

- `/login?archived=true`

### Si `role = staff` o `role = admin`

Redirige a:

- `/admin`

### Si `role = client` y `onboarding_status = verified`

Redirige a:

- `/panel`

### Si `role = client` y `onboarding_status != verified`

Redirige a:

- `/onboarding`

## 3.10. Login con Google

El formulario tambien ofrece login con Google.

Usa:

```ts
supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/panel`
  }
})
```

### Que significa esto

- la autenticacion la resuelve Google,
- Supabase crea o reutiliza el usuario de auth,
- despues la app vuelve a depender de que exista una fila usable en `profiles`.

---

## 4. Como esta configurado el registro de cuenta

## 4.1. Ruta de entrada

La pantalla publica de registro esta en:

- `/registro`

El archivo de pagina monta el componente:

- `RegisterForm`

## 4.2. Que informacion pide el formulario de registro

El registro base de cuenta pide exactamente estos campos:

- `fullName`
- `email`
- `password`
- `acceptTerms`

En lenguaje de negocio eso significa:

- nombre completo del usuario,
- correo con el que se va a autenticar,
- contrasena fuerte,
- aceptacion obligatoria de terminos.

## 4.3. Validaciones del registro

La validacion se hace con Zod.

### Campo `fullName`

Reglas:

- minimo 2 caracteres,
- se hace `trim()`,
- no puede venir vacio realmente.

Error:

- `El nombre debe tener al menos 2 caracteres`

### Campo `email`

Regla:

- debe ser email valido.

Error:

- `Debe ser un correo electrónico válido`

### Campo `password`

Reglas:

- minimo 12 caracteres,
- debe incluir al menos un numero,
- debe incluir al menos un caracter especial.

Errores posibles:

- `La contraseña debe tener al menos 12 caracteres`
- `Debe contener al menos un número`
- `Debe contener al menos un carácter especial`

### Campo `acceptTerms`

Regla:

- solo acepta el valor booleano `true`

Error:

- `Debes aceptar los términos y condiciones`

## 4.4. Que servicio usa el registro

Cuando el usuario envia el formulario, el frontend llama:

- `AuthService.signup(data)`

Y ese servicio hace:

```ts
supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      full_name: fullName,
    },
  },
})
```

## 4.5. Que se envia realmente en el registro

Esto es importante:

- el frontend no manda `acceptTerms` a Supabase,
- `acceptTerms` solo se usa para validar localmente el formulario,
- el frontend manda a Supabase Auth solo `email`, `password` y `options.data.full_name`.

### Payload real hacia Supabase Auth

```json
{
  "email": "maria.rios@empresa.com",
  "password": "GuiraSegura2026!",
  "options": {
    "data": {
      "full_name": "Maria Rios"
    }
  }
}
```

## 4.6. Que devuelve el registro

Supabase puede devolver:

- `user`
- `session`

Dependiendo de la configuracion de confirmacion por email, la cuenta puede:

- quedar pendiente de verificacion,
- o iniciar sesion de inmediato.

El texto actual del frontend asume confirmacion por correo, porque muestra:

- `Cuenta creada. Revisa tu correo para verificar.`

## 4.7. Que NO hace directamente el registro publico

El registro publico no inserta desde frontend en:

- `profiles`
- `onboarding`
- `documents`
- `activity_logs`

Tampoco asigna desde frontend:

- `role`
- `onboarding_status`
- `is_archived`

Eso significa que esos valores deben nacer o sincronizarse en backend.

---

## 5. Diferencia entre Auth y tablas de negocio

Esta es la parte mas importante si no vienes siguiendo Supabase de cerca.

## 5.1. `auth.users`

Cuando haces:

```ts
supabase.auth.signUp(...)
```

la cuenta nace en el sistema de autenticacion de Supabase.

Ese mundo guarda cosas como:

- identificador del usuario,
- email,
- password hasheada,
- metadata del usuario,
- confirmacion del correo,
- sesiones.

## 5.2. `profiles`

Pero la app de Guira no trabaja solo con `auth.users`.

Toda la logica de negocio depende de la tabla:

- `profiles`

Campos detectados:

```json
{
  "id": "uuid",
  "email": "string",
  "role": "client | staff | admin",
  "full_name": "string",
  "onboarding_status": "string",
  "bridge_customer_id": "string|null",
  "created_at": "ISO8601",
  "is_archived": false,
  "metadata": {}
}
```

## 5.3. Lo que esto implica

Para que la app funcione bien, despues del registro debe existir una fila valida en `profiles`.

El frontend no la crea manualmente en el flujo publico, por lo tanto hay dos posibilidades:

1. existe un trigger o proceso backend que copia el usuario nuevo desde Auth hacia `profiles`,
2. o existe una automation del backend fuera del frontend que hace esa sincronizacion.

## 5.4. Que evidencia tenemos en el codigo

La evidencia fuerte es esta:

- despues de iniciar sesion, el `AuthGuard` intenta leer `profiles` con el `user.id`,
- si no encuentra perfil, considera que el login no esta sano y termina cerrando sesion.

Por lo tanto, la existencia de `profiles` no es opcional.

---

## 6. Que datos parece tener un perfil nuevo

El frontend no contiene el trigger de creacion de `profiles`, asi que aqui hay que ser muy preciso:

- **esto ya no sale directamente del frontend**,
- **esto es una inferencia basada en el contrato de la app y en los campos obligatorios que luego usa el sistema**.

Lo mas razonable para un perfil nuevo creado desde registro publico seria algo parecido a esto:

```json
{
  "id": "mismo_uuid_que_auth_user",
  "email": "maria.rios@empresa.com",
  "role": "client",
  "full_name": "Maria Rios",
  "onboarding_status": "draft",
  "bridge_customer_id": null,
  "created_at": "2026-03-23T12:00:00Z",
  "is_archived": false,
  "metadata": {}
}
```

### Importante

Esto no aparece como `insert` explícito en el frontend.

Lo que si sabemos es:

- la app necesita `role`,
- necesita `full_name`,
- necesita `onboarding_status`,
- y trata al usuario normal como `client` hasta que el backend diga otra cosa.

---

## 7. El verdadero registro operativo: onboarding

Despues del registro de cuenta, el usuario cliente es empujado a:

- `/onboarding`

Esto ocurre porque el `AuthGuard` revisa `profiles.onboarding_status`.

Si no esta en:

- `verified`

el cliente no entra al panel principal y es redirigido al onboarding.

## 7.1. Tipos de onboarding

Hay dos tipos:

- `personal`
- `company`

## 7.2. Estados del onboarding

La tabla `onboarding` trabaja con estos estados:

- `draft`
- `submitted`
- `under_review`
- `waiting_ubo_kyc`
- `verified`
- `rejected`
- `needs_changes`

## 7.3. Que tablas y buckets toca el onboarding

Durante el onboarding ya si se usan varios recursos:

- tabla `onboarding`
- tabla `documents`
- bucket `onboarding_docs`
- tabla `profiles` para sincronizar `onboarding_status`
- tabla `activity_logs`

---

## 8. Registro personal: que informacion pide

El onboarding personal pide informacion en varias etapas.

## 8.1. Etapa 1 de onboarding personal: identidad

Campos:

- `first_names`
- `last_names`
- `dob`
- `nationality`
- `id_document_type`
- `id_number`
- `id_expiry`

## 8.2. Etapa 2: direccion

Campos:

- `street`
- `city`
- `state_province`
- `country`

Campo definido en schema pero no visible en UI actual:

- `postal_code`

## 8.3. Etapa 3: informacion financiera

Campos:

- `occupation`
- `purpose`
- `source_of_funds`
- `estimated_monthly_volume`

## 8.4. Etapa 4: documentos

Sube y persiste referencias para:

- `id_front`
- `id_back`
- `selfie`
- `proof_of_address`

---

## 9. Registro empresarial: que informacion pide

El onboarding company es mas amplio.

## 9.1. Etapa 1: datos de empresa

Campos:

- `company_legal_name`
- `registration_number`
- `tax_id`
- `country_of_incorporation`
- `entity_type`
- `incorporation_date`
- `business_description`

## 9.2. Etapa 2: direccion y representante

Campos:

- `business_street`
- `business_city`
- `business_country`
- `legal_rep_first_names`
- `legal_rep_last_names`
- `legal_rep_position`
- `legal_rep_id_number`

## 9.3. Etapa 3: informacion financiera

Campos:

- `purpose`
- `source_of_funds`
- `estimated_monthly_volume`

## 9.4. Etapa 4: documentos de empresa

Subidas principales:

- `company_cert`
- `legal_rep_id`
- `proof_of_address`

## 9.5. Etapa 5: UBOs

Cada UBO puede incluir:

- `first_names`
- `last_names`
- `percentage`
- `nationality`
- `passport` opcional
- `id_front` opcional

---

## 10. JSON reales y explicados del flujo

En esta seccion separo muy bien cada nivel para que no se mezclen conceptos.

## 10.1. JSON del login

### Lo que envia el frontend

```json
{
  "email": "cliente@guira.com",
  "password": "ClaveSegura2026!"
}
```

### A donde va

- a `supabase.auth.signInWithPassword(...)`

### Que busca despues la app

Despues del login la app busca en `profiles` algo como esto:

```json
{
  "id": "f0a13d2a-1111-4444-9999-20d4f0cbbe11",
  "email": "cliente@guira.com",
  "role": "client",
  "full_name": "Carlos Perez",
  "onboarding_status": "submitted",
  "bridge_customer_id": null,
  "created_at": "2026-03-20T10:11:12Z",
  "is_archived": false,
  "metadata": {}
}
```

### Como se usa ese perfil

- si `role=client` y `onboarding_status=submitted`, el usuario va a `/onboarding`
- si `onboarding_status=verified`, el usuario va a `/panel`
- si `role=staff`, va a `/admin`

## 10.2. JSON del registro publico de cuenta

### Lo que el formulario captura

```json
{
  "fullName": "Carlos Perez",
  "email": "cliente@guira.com",
  "password": "ClaveSegura2026!",
  "acceptTerms": true
}
```

### Lo que realmente envia el frontend a Supabase Auth

```json
{
  "email": "cliente@guira.com",
  "password": "ClaveSegura2026!",
  "options": {
    "data": {
      "full_name": "Carlos Perez"
    }
  }
}
```

### Lo que NO se manda a Auth

- `acceptTerms`

Ese dato solo valida la UI; no viaja en el payload final a Supabase Auth.

## 10.3. Ejemplo probable de fila en `profiles` despues del registro

### Importante

Esto representa lo que **deberia existir** en la base operativa para que la app funcione.

```json
{
  "id": "f0a13d2a-1111-4444-9999-20d4f0cbbe11",
  "email": "cliente@guira.com",
  "role": "client",
  "full_name": "Carlos Perez",
  "onboarding_status": "draft",
  "bridge_customer_id": null,
  "created_at": "2026-03-23T14:00:00Z",
  "is_archived": false,
  "metadata": {}
}
```

### Explicacion campo por campo

- `id`: debe coincidir con el `user.id` de Supabase Auth
- `email`: copia operativa del correo
- `role`: rol de negocio, normalmente `client` para registro publico
- `full_name`: nombre inicial capturado en el registro
- `onboarding_status`: controla si el cliente puede operar
- `bridge_customer_id`: aun no existe al inicio
- `created_at`: fecha de creacion del perfil
- `is_archived`: bloqueo administrativo
- `metadata`: espacio para datos extra

## 10.4. JSON de borrador de onboarding personal

Cuando el usuario avanza por pasos, el frontend guarda borradores con `saveDraft(...)`.

```json
{
  "id": "onb-uuid-opcional",
  "user_id": "f0a13d2a-1111-4444-9999-20d4f0cbbe11",
  "type": "personal",
  "data": {
    "first_names": "Carlos",
    "last_names": "Perez",
    "dob": "1992-05-14",
    "nationality": "Boliviana",
    "occupation": "Consultor",
    "purpose": "Pagos internacionales",
    "source_of_funds": "Servicios profesionales",
    "estimated_monthly_volume": "2500",
    "street": "Av. Principal 123",
    "city": "Santa Cruz",
    "state_province": "Santa Cruz",
    "country": "Bolivia",
    "id_number": "1234567",
    "id_expiry": "2031-05-14",
    "id_document_type": "CI"
  },
  "status": "draft",
  "updated_at": "2026-03-23T14:30:00Z"
}
```

### Que hace el frontend al guardar borrador

- hace `upsert` en `onboarding`
- fuerza `status = draft`
- actualiza `updated_at`
- registra actividad `guardar_borrador`

## 10.5. JSON de subida de documento personal

Cuando sube un archivo, primero va al bucket y luego se guarda la referencia en `documents`.

### Path de storage devuelto por upload

```json
{
  "storage_path": "f0a13d2a-1111-4444-9999-20d4f0cbbe11/id_front_draft_1760000000000.jpg"
}
```

### Referencia que se guarda en `documents`

```json
{
  "onboarding_id": "onb-uuid-opcional",
  "user_id": "f0a13d2a-1111-4444-9999-20d4f0cbbe11",
  "doc_type": "id_front",
  "storage_path": "f0a13d2a-1111-4444-9999-20d4f0cbbe11/id_front_draft_1760000000000.jpg",
  "mime_type": "image/jpeg",
  "file_size": 245001
}
```

## 10.6. JSON final de envio de onboarding personal

Cuando el usuario termina y pulsa enviar:

```json
{
  "id": "onb-uuid-opcional",
  "user_id": "f0a13d2a-1111-4444-9999-20d4f0cbbe11",
  "type": "personal",
  "data": {
    "first_names": "Carlos",
    "last_names": "Perez",
    "dob": "1992-05-14",
    "nationality": "Boliviana",
    "occupation": "Consultor",
    "purpose": "Pagos internacionales",
    "source_of_funds": "Servicios profesionales",
    "estimated_monthly_volume": "2500",
    "street": "Av. Principal 123",
    "city": "Santa Cruz",
    "state_province": "Santa Cruz",
    "country": "Bolivia",
    "id_number": "1234567",
    "id_expiry": "2031-05-14",
    "id_document_type": "CI",
    "id_front": "f0a13d2a-1111-4444-9999-20d4f0cbbe11/id_front_draft_1760000000000.jpg",
    "id_back": "f0a13d2a-1111-4444-9999-20d4f0cbbe11/id_back_draft_1760000001000.jpg",
    "selfie": "f0a13d2a-1111-4444-9999-20d4f0cbbe11/selfie_draft_1760000002000.jpg",
    "proof_of_address": "f0a13d2a-1111-4444-9999-20d4f0cbbe11/proof_of_address_draft_1760000003000.pdf"
  },
  "status": "submitted",
  "updated_at": "2026-03-23T15:00:00Z"
}
```

### Efectos adicionales del submit personal

Ademas del `upsert` en `onboarding`, el frontend hace o espera:

- registrar actividad `enviar_onboarding`
- actualizar `profiles.full_name` con `first_names + last_names`
- actualizar `profiles.onboarding_status = submitted`

### Ejemplo de update a `profiles` despues del submit personal

```json
{
  "full_name": "Carlos Perez",
  "onboarding_status": "submitted"
}
```

## 10.7. JSON de borrador de onboarding empresa

```json
{
  "id": "onb-company-uuid",
  "user_id": "f0a13d2a-1111-4444-9999-20d4f0cbbe11",
  "type": "company",
  "data": {
    "company_legal_name": "Exportadora Andina SRL",
    "registration_number": "FUNDEMP-77812",
    "country_of_incorporation": "Bolivia",
    "entity_type": "SRL",
    "incorporation_date": "2019-08-01",
    "business_description": "Importacion y exportacion de insumos",
    "business_street": "Av. Busch 400",
    "business_city": "Santa Cruz",
    "business_country": "Bolivia",
    "legal_rep_first_names": "Maria",
    "legal_rep_last_names": "Rios",
    "legal_rep_position": "Gerente General",
    "legal_rep_id_number": "9876543",
    "purpose": "Pagos a proveedores internacionales",
    "source_of_funds": "Ventas comerciales",
    "estimated_monthly_volume": "15000",
    "tax_id": "1029384011"
  },
  "status": "draft",
  "updated_at": "2026-03-23T16:00:00Z"
}
```

## 10.8. JSON de submit empresa antes de UBOs

Cuando la empresa completa sus datos base y documentos principales:

```json
{
  "id": "onb-company-uuid",
  "user_id": "f0a13d2a-1111-4444-9999-20d4f0cbbe11",
  "type": "company",
  "data": {
    "company_legal_name": "Exportadora Andina SRL",
    "registration_number": "FUNDEMP-77812",
    "country_of_incorporation": "Bolivia",
    "entity_type": "SRL",
    "incorporation_date": "2019-08-01",
    "business_description": "Importacion y exportacion de insumos",
    "business_street": "Av. Busch 400",
    "business_city": "Santa Cruz",
    "business_country": "Bolivia",
    "legal_rep_first_names": "Maria",
    "legal_rep_last_names": "Rios",
    "legal_rep_position": "Gerente General",
    "legal_rep_id_number": "9876543",
    "purpose": "Pagos a proveedores internacionales",
    "source_of_funds": "Ventas comerciales",
    "estimated_monthly_volume": "15000",
    "tax_id": "1029384011",
    "company_cert": "f0a13d2a-1111-4444-9999-20d4f0cbbe11/company_cert_draft_1760005000000.pdf",
    "legal_rep_id": "f0a13d2a-1111-4444-9999-20d4f0cbbe11/legal_rep_id_draft_1760005001000.pdf",
    "proof_of_address": "f0a13d2a-1111-4444-9999-20d4f0cbbe11/proof_of_address_draft_1760005002000.pdf"
  },
  "status": "submitted",
  "updated_at": "2026-03-23T16:30:00Z"
}
```

### Que cambia en `profiles` aqui

En este caso el frontend al menos asegura:

```json
{
  "onboarding_status": "submitted"
}
```

## 10.9. JSON final de UBOs empresariales

Cuando termina la declaracion de beneficiarios finales:

```json
{
  "id": "onb-company-uuid",
  "user_id": "f0a13d2a-1111-4444-9999-20d4f0cbbe11",
  "type": "company",
  "data": {
    "company_legal_name": "Exportadora Andina SRL",
    "registration_number": "FUNDEMP-77812",
    "country_of_incorporation": "Bolivia",
    "entity_type": "SRL",
    "incorporation_date": "2019-08-01",
    "business_description": "Importacion y exportacion de insumos",
    "business_street": "Av. Busch 400",
    "business_city": "Santa Cruz",
    "business_country": "Bolivia",
    "legal_rep_first_names": "Maria",
    "legal_rep_last_names": "Rios",
    "legal_rep_position": "Gerente General",
    "legal_rep_id_number": "9876543",
    "purpose": "Pagos a proveedores internacionales",
    "source_of_funds": "Ventas comerciales",
    "estimated_monthly_volume": "15000",
    "tax_id": "1029384011",
    "company_cert": "f0a13d2a-1111-4444-9999-20d4f0cbbe11/company_cert_draft_1760005000000.pdf",
    "legal_rep_id": "f0a13d2a-1111-4444-9999-20d4f0cbbe11/legal_rep_id_draft_1760005001000.pdf",
    "proof_of_address": "f0a13d2a-1111-4444-9999-20d4f0cbbe11/proof_of_address_draft_1760005002000.pdf",
    "ubos": [
      {
        "first_names": "Jorge",
        "last_names": "Velasco",
        "percentage": "60",
        "nationality": "Boliviana",
        "id_front": "f0a13d2a-1111-4444-9999-20d4f0cbbe11/ubo_0_id_front_draft_1760006000000.jpg"
      },
      {
        "first_names": "Ana",
        "last_names": "Suarez",
        "percentage": "40",
        "nationality": "Boliviana",
        "passport": "f0a13d2a-1111-4444-9999-20d4f0cbbe11/ubo_1_passport_draft_1760006001000.pdf"
      }
    ]
  },
  "status": "under_review",
  "updated_at": "2026-03-23T17:00:00Z"
}
```

### Efecto adicional esperado

Se actualiza:

```json
{
  "onboarding_status": "under_review"
}
```

en la tabla:

- `profiles`

---

## 11. Flujo completo de un usuario nuevo

Aqui lo explico en orden cronologico.

### Paso 1. El usuario entra a `/registro`

Ve campos:

- nombre completo
- correo
- contrasena
- terminos

### Paso 2. El frontend valida

Revisa:

- que el nombre tenga 2+ caracteres,
- que el email sea valido,
- que la contrasena tenga 12+ caracteres,
- que tenga numero,
- que tenga caracter especial,
- que se acepten los terminos.

### Paso 3. El frontend llama a Supabase Auth

Envia:

```json
{
  "email": "cliente@guira.com",
  "password": "ClaveSegura2026!",
  "options": {
    "data": {
      "full_name": "Carlos Perez"
    }
  }
}
```

### Paso 4. Debe existir un perfil en `profiles`

La app necesita luego algo como:

```json
{
  "id": "auth-user-id",
  "email": "cliente@guira.com",
  "role": "client",
  "full_name": "Carlos Perez",
  "onboarding_status": "draft",
  "is_archived": false
}
```

### Paso 5. El usuario inicia sesion

El login manda:

```json
{
  "email": "cliente@guira.com",
  "password": "ClaveSegura2026!"
}
```

### Paso 6. `AuthGuard` busca el perfil

Si no encuentra `profiles`, el flujo queda roto y la app saca al usuario.

### Paso 7. Como todavia no esta verificado

La app lo manda a:

- `/onboarding`

### Paso 8. El usuario completa onboarding

Aqui si empieza a poblar datos de negocio:

- `onboarding`
- `documents`
- `profiles.onboarding_status`

### Paso 9. Staff revisa

Staff puede mover el onboarding a:

- `verified`
- `rejected`
- `needs_changes`

### Paso 10. Si queda `verified`

El cliente ya puede entrar al panel y operar.

---

## 12. Cosas importantes que conviene saber

## 12.1. `acceptTerms` no se persiste desde este frontend

Aunque el checkbox es obligatorio para registrarse, en este codigo no se ve un guardado explicito en una tabla de negocio ni en metadata del usuario desde el frontend.

## 12.2. El registro publico no asigna rol desde el formulario

El usuario normal no elige:

- `client`
- `staff`
- `admin`

Eso debe venir configurado por backend, y lo normal es que el alta publica sea:

- `client`

## 12.3. El sistema depende muchisimo de `profiles`

Si existe `auth.users` pero no existe `profiles`, la app no se considera utilizable.

## 12.4. El onboarding cambia datos del perfil

El onboarding personal puede actualizar:

- `profiles.full_name`
- `profiles.onboarding_status`

El onboarding company actualiza al menos:

- `profiles.onboarding_status`

## 12.5. El login no parece registrar actividad en `activity_logs`

En este codigo no vi una llamada desde `AuthService.login(...)` a `activity_logs`.

En la documentacion historica aparece `login` como accion observada, pero en el frontend actual no se ve escrita manualmente en este flujo.

---

## 13. Conclusiones

La autenticacion en Guira esta montada sobre Supabase Auth, pero el producto real depende de dos capas:

1. capa de identidad:
   - `supabase.auth.signUp`
   - `supabase.auth.signInWithPassword`

2. capa operativa:
   - `profiles`
   - `onboarding`
   - `documents`

En otras palabras:

- el registro publico crea la cuenta base,
- el login abre sesion,
- pero el verdadero alta funcional del cliente se completa con `profiles` y `onboarding`.

Si alguien te pregunta "que pide el registro", la respuesta correcta es:

- el registro base pide muy poco,
- pero el registro operativo real de Guira ocurre en el onboarding.

---

## 14. Resumen ultra corto

### Login

Pide:

- email
- password

Envia:

```json
{
  "email": "cliente@guira.com",
  "password": "ClaveSegura2026!"
}
```

### Registro publico

Pide:

- fullName
- email
- password
- acceptTerms

Envia realmente a Supabase Auth:

```json
{
  "email": "cliente@guira.com",
  "password": "ClaveSegura2026!",
  "options": {
    "data": {
      "full_name": "Carlos Perez"
    }
  }
}
```

### Registro operativo posterior

Se guarda luego en:

- `onboarding`
- `documents`
- `profiles`

con datos KYC/KYB, direccion, finanzas y documentos.
