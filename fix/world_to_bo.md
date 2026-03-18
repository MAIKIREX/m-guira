vamos a revisar el flujo de trabajo del envio de dinero desde el exterior a bolivia

Paso 1: Declaración y Datos Locales

Tú haces: Indicas cuánto envías desde el exterior. Obligatorio: Subes la imagen de tu QR Bancario de Bolivia o datos de cuenta.

el paso uno se cumple actualmente no hay inconveniente se crea el expediente y se pone el estado a "created"

paso 2

    esto se peude completar desde la etapa 5 de seccion de "Depositar" o desde la pantalla de "Transacciones"

    aqui hay la observacion por parte del admin o staff este me permite en el modal accionar el boton de "validar deposito del cliente" sin que este aya subido el respaldo del deposito esto ne deberia de permitirse esto me llev aal estado "DEPOSIT_RECEIVED"

paso 3

    ahora continuemos con admin o staff este se encarga de "preparar la cotizacion" en el que me permite modificar la tasa de cambio y el monto convertido y fee total

    y luego publicarlo esto deveria de actualizar la base de datos cuando lo publique si hubo algun cambio y deveria de verse reflejado en la seccion de "transacciones" del usuario

    el usuario tendria que aceptar la cotizacion realizada y pasar al estado de "processing"

    pero aqui es donde no pasa esto no se actualiza el estado cuando el admin publica la cotizacion

    tambien otra observacion es que el boton de Aceptar cotizacion solo deveria de salir cuando el admin o staff subio la cotizacion es decir actualizo los datos en la base de datos, recien tenria que permitirle al usuario aceptar la cotizacion ya que  ahora apenas paso a ese estado ya me sale el boton y esto no deberia de ser asi.