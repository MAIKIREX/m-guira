Aquí tienes el archivo en **formato Markdown (.md)** listo para usar con Codex.

```markdown
# Reestructuración del Dashboard del Cliente

## Objetivo

Modificar la navegación del **dashboard del cliente**, específicamente el **menú lateral izquierdo (aside)**, reorganizando las secciones existentes y redistribuyendo la lógica actual dentro de nuevos módulos.

El objetivo es mejorar la estructura funcional separando **depósitos, envíos, proveedores, transacciones y configuración**.

---

# 1. Modificación del Aside (menú lateral)

Actualmente el menú lateral contiene **4 opciones**:

1. Dashboard  
2. Pagos  
3. Actividad  
4. Soporte  

Debe modificarse para contener **7 opciones** en el siguiente orden:

1. **Panel**
2. **Depositar**
3. **Enviar**
4. **Proveedores**
5. **Transacciones**
6. **Configuración**
7. **Soporte**

---

# 2. Redistribución de la lógica existente

No se deben eliminar funcionalidades existentes.  
Solo **reorganizar las vistas actuales dentro de las nuevas secciones**.

---

# 3. Panel

La sección **Panel** debe contener exactamente lo que actualmente existe en:

```

Dashboard

```

No se deben modificar los componentes ni la lógica, solo **renombrar y mover la ruta**.

---

# 4. Secciones de operación financiera

Actualmente la aplicación trabaja con **4 modos de operación**:

1. **Bolivia → Exterior**
2. **EE.UU. → Wallet**
3. **Cripto → Cripto**
4. **Exterior → Bolivia**

Estos modos deben redistribuirse en dos secciones:

---

## Depositar

En esta sección deben incluirse los siguientes flujos:

- **EE.UU. → Wallet (Cripto)**
- **Exterior → Bolivia**

---

## Enviar

En esta sección deben incluirse los siguientes flujos:

- **Bolivia → Exterior**
- **Cripto → Cripto**

---

# 5. Proveedores

Crear una sección llamada **Proveedores**.

Aquí debe moverse toda la lógica existente de **gestión de beneficiarios** que actualmente se encuentra en:

```

Pagos → Proveedores

```

Debe incluir:

- creación de beneficiarios
- edición
- listado
- eliminación
- selección de beneficiario para pagos

No modificar la lógica existente, solo reorganizar la ubicación.

---

# 6. Transacciones

Crear una sección llamada **Transacciones**.

Aquí debe moverse la funcionalidad actual de:

```

Pagos → seguimiento de órdenes

```

Debe incluir:

- historial de transacciones
- estado de órdenes
- seguimiento de transferencias
- detalles de cada operación

---

# 7. Configuración

Crear una sección llamada **Configuración**.

Debe contener la lógica de:

- configuración del usuario
- ajustes de perfil
- preferencias de cuenta

---

# 8. Soporte

La sección **Soporte** debe mantenerse igual.

Debe contener la lógica actual de soporte sin cambios.

---

# 9. Requisitos técnicos

Al implementar estos cambios:

- actualizar **rutas**
- actualizar **navegación del aside**
- mantener **componentes reutilizados**
- evitar duplicación de lógica
- mover componentes existentes en lugar de recrearlos

Si el proyecto usa **Next.js App Router**, reorganizar también las carpetas de `app/` para reflejar las nuevas rutas.

Ejemplo esperado:

```

app/dashboard/
panel/
depositar/
enviar/
proveedores/
transacciones/
configuracion/
soporte/

```

---

# Resultado esperado

El dashboard del cliente debe quedar organizado en **7 secciones claras**, donde cada funcionalidad existente esté correctamente redistribuida sin romper la lógica actual del sistema.
```
