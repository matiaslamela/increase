# Test de increase Matias Lamela

Como stack utilice node.js como lenguaje, para la base de datos postgresql y sequelize como ORM.

## Instalación

Para poder iniciar el proyecto, es necesario tener instalado postgresql.

1) Crear la base de datos increase en postgresql.
2) Crear un archivo .env en la carpeta raiz del proyecto que contenga los siguientes datos:
POSTGRESS_USER=usuarioDePostresql
POSTGRESS_PASSWORD=contraseña
PORT=puerto
TOKEN=1234567890qwertyuiopasdfghjklzxcvbnm
3) npm install
4) npm start

## Base de datos relacional

Se utilizaron 3 entidades: Payment, transaction y discount.
Payment tiene una relacion de 1:M con transaction y discount a través del FK 'paymentId'
Payment tiene los siguientes campos:

> id: String de 32 bytes. Preferi dejarlo como string porque no sé si es un uuid o un numero hexadecimal.
coin: String 3 bytes. Representa el tipo de moneda.
totalAmount: String 13 bytes. Preferi dejarlo como string y no como number porque no sé como se va a utlizar esta informacion, si se necesita en este formato o como number.
totalDiscount: Lo mismo que el anterior.
totalWithDiscounts: Este campo podria no haber sido necesario y calcularlo cada vez que se hace una peticion. Preferi guardarlo.
paymentDate: Date.
isPaid: Boolean, un flag para diferenciar si ya se pagó o no.
clientId: String de 32 bytes, el id del cliente, como el id del pago, preferi dejarlo como string.

Discount tiene los siguientes campos:

> id: String de 32 bytes. Preferi dejarlo como string porque no sé si es un uuid o un numero hexadecimal.
amount: String 13 bytes. El monto.
type: String 1 bytes. El tipo de descuento. Solo se pueden ingresar los valores 0, 1, 2, 3 o 4. En el email decian que los valores podian ser del 1 al 5, pero la informacion llegaba de 0 a 4, entonces lo cambie.

Transaction tiene los siguientes campos

> id: String de 32 bytes. Preferi dejarlo como string porque no sé si es un uuid o un numero hexadecimal.
amount: String 13 bytes. El monto.
type: String 1 bytes. Representa si esta aprobada o no la transacccion. Solo se pueden ingresar los valores 1 o 2.


# API

## Funcionamiento

A penas inicia el servidor, va a hacer un fetch al servicio https://increase-transactions.herokuapp.com/file.txt, guardar en la base de datos la informacion y dejar un intervalo esperando cada 10 minutos para volver a hacer un fetch.
Igualmente puede pararse el fetch o volver a comenzar.


### init

>/init/fetch-file

Inicializa el fetch y genera un intervalo cada 10 minutos para volver a realizar el fetch. Este endpoint podria tener una mejora. Cuando hago la peticion a su servicio, me retorna el txt como plain/text, en node es posible realizarlo como un stream. Entonces, mientras va llegando, se puede ir realizando el resto del código. Esto mejoraria muchisimo el performance, pero no llegue a implementarlo.
En este momento realiza estas acciones: 

1) Fetch a los datos.
2) Parto el txt por cada salto de linea y lo guardo en un array
3) Acomodo en un array para cada tabla, es decir, pagos, descuentos y transacciones.
4) Agrego todos los pagos, despues todos los descuentos y despues todas las transacciones.
5) Inicializo el intervalo

```
curl --location --request POST 'http://localhost:3001/init/fetch-file' \

--data-raw ''
```

### end

>/init/fetch-end

Desactiva el intervalo.

```
curl --location --request POST 'http://localhost:3001/init/fetch-end' \

--data-raw ''
```

### Client info

>/clients/:clientId

@params: clientId, el id del cliente, type: string.

Hace un fetch al servicio de increase, obtiene los datos del cliente y los retorna.
```
{
"id": "437e1802a77746898fc7c1f7a44141a6",
"email": "lorita@swaniawski.name",
"first_name": "Alva",
"last_name": "Maggio",
"job": "Principal Marketing Executive",
"country": "Western Sahara",
"address": "12380 Schaefer Glen",
"zip_code": "25484-2174",
"phone": "398-122-4237"
}
```

```
curl --location --request GET 'http://localhost:3001/clients/437e1802a77746898fc7c1f7a44141a6' \

--data-raw ''
```
### Discounts

>/discounts

Este servicio devuelve un array con todos los descuentos

```
curl --location --request GET 'http://localhost:3001/discounts/' \

--data-raw ''
```

```
[
	{
	"id": "d9c10ca7ad8043ffa6cf20ab222ff913",
	"amount": "0000000642789",
	"type": "0",
	"createdAt": "2021-02-03T08:09:49.433Z",
	"updatedAt": "2021-02-03T08:09:49.433Z",
	"paymentId": "6dea3caacc874336ad94a01714e80164"
	}
]
```

### Discount by Id

>/discounts/:discountId/id

Este servicio devuelve un objeto con un descuento

```
curl --location --request GET 'http://localhost:3001/discounts/d9c10ca7ad8043ffa6cf20ab222ff913/id' \

--data-raw ''
```
Ejemplo de respuesta:
```
{
	"id": "d9c10ca7ad8043ffa6cf20ab222ff913",
	"amount": "0000000642789",
	"type": "0",
	"createdAt": "2021-02-03T08:09:49.433Z",
	"updatedAt": "2021-02-03T08:09:49.433Z",
	"paymentId": "6dea3caacc874336ad94a01714e80164"
	}
```

### Discount by paymentId

>/discounts/:paymentId/payment

Este servicio devuelve un array con los descuentos de ese pago.

```
curl --location --request GET 'http://localhost:3001/discounts/166a6085e247403a8c36f73f518982e8/id' \

--data-raw ''
```
Ejemplo de respuesta:
```
[
	{
		"id": "809b96e9e7324e93869831916b5a2153",
		"amount": "0000000659783",
		"type": "0",
		"createdAt": "2021-02-03T08:09:49.433Z",
		"updatedAt": "2021-02-03T08:09:49.433Z",
		"paymentId": "166a6085e247403a8c36f73f518982e8"
	},
	{
		"id": "34a97876472644739d7ae111da07e64e",
		"amount": "0000000179818",
		"type": "1",
		"createdAt": "2021-02-03T08:09:49.433Z",
		"updatedAt": "2021-02-03T08:09:49.433Z",
		"paymentId": "166a6085e247403a8c36f73f518982e8"
	}
]
```

### Transactions
>/transactions
>
Este servicio devuelve un array con todas las transacciones.

```
curl --location --request GET 'http://localhost:3001/transactions/' \

--data-raw ''
```
Ejemplo de respuesta:
```
[
	{
		"id": "d9c10ca7ad8043ffa6cf20ab222ff913",
		"amount": "0000000642789",
		"type": "0",
		"createdAt": "2021-02-03T08:09:49.433Z",
		"updatedAt": "2021-02-03T08:09:49.433Z",
		"paymentId": "6dea3caacc874336ad94a01714e80164"
	},
	{
		"id": "fbb0cb71443f44e3904151b5070331ff",
		"amount": "0000000078610",
		"type": "1",
		"createdAt": "2021-02-03T08:09:49.433Z",
		"updatedAt": "2021-02-03T08:09:49.433Z",
		"paymentId": "6dea3caacc874336ad94a01714e80164"
	}
]
```

### Transaction by Id

>/transactions/:transactionId/id

Este servicio devuelve un objeto con una transaccion.

```
curl --location --request GET 'http://localhost:3001/transactions/d9c10ca7ad8043ffa6cf20ab222ff913/id' \

--data-raw ''
```
Ejemplo de respuesta:
```
{
	"id": "d9c10ca7ad8043ffa6cf20ab222ff913",
	"amount": "0000000642789",
	"type": "0",
	"createdAt": "2021-02-03T08:09:49.433Z",
	"updatedAt": "2021-02-03T08:09:49.433Z",
	"paymentId": "6dea3caacc874336ad94a01714e80164"
}
```

### Transaction by paymentId

> /transactions/:paymentId/payment

Este servicio devuelve un array con las transacciones de ese pago.

```
curl --location --request GET 'http://localhost:3001/dtransactions/6dea3caacc874336ad94a01714e80164/payment' \

--data-raw ''
```
Ejemplo de respuesta:
```
[
	{
		"id": "d9c10ca7ad8043ffa6cf20ab222ff913",
		"amount": "0000000642789",
		"type": "0",
		"createdAt": "2021-02-03T08:09:49.433Z",
		"updatedAt": "2021-02-03T08:09:49.433Z",
		"paymentId": "6dea3caacc874336ad94a01714e80164"
	},
	{
		"id": "fbb0cb71443f44e3904151b5070331ff",
		"amount": "0000000078610",
		"type": "1",
		"createdAt": "2021-02-03T08:09:49.433Z",
		"updatedAt": "2021-02-03T08:09:49.433Z",
		"paymentId": "6dea3caacc874336ad94a01714e80164"
	}
]
```

### Payments

> /payments

Este servicio devuelve un array con todos los pagos.

```
curl --location --request GET 'http://localhost:3001/payments/' \

--data-raw ''
```
Ejemplo de respuesta:
```
[
	{
		"id": "6dea3caacc874336ad94a01714e80164",
		"coin": "001",
		"totalAmount": "0000084301482",
		"totalDiscount": "0000001370588",
		"totalWithDiscounts": "0000082930894",
		"paymentDate": "2001-02-18T03:00:00.000Z",
		"isPaid": true,
		"clientId": "437e1802a77746898fc7c1f7a44141a6",
		"createdAt": "2021-02-03T08:09:49.178Z",
		"updatedAt": "2021-02-03T08:09:49.178Z"
	},
	{
		"id": "9f4f2b4a4df641878b2dc1892405cd3b",
		"coin": "001",
		"totalAmount": "0000235600121",
		"totalDiscount": "0000000112873",
		"totalWithDiscounts": "0000235487248",
		"paymentDate": "2001-02-18T03:00:00.000Z",
		"isPaid": true,
		"clientId": "6c5cf7a7f0a24beb952b833efc663507",
		"createdAt": "2021-02-03T08:09:49.178Z",
		"updatedAt": "2021-02-03T08:09:49.178Z"
	}
]
```

### Payments y descuentos

> /payments/discounts

Este servicio devuelve un array con todos los pagos y sus descuentos.

```
curl --location --request GET 'http://localhost:3001/payments/discounts' \

--data-raw ''
```
Ejemplo de respuesta:
```
[
	{
		"id": "6dea3caacc874336ad94a01714e80164",
		"coin": "001",
		"totalAmount": "0000084301482",
		"totalDiscount": "0000001370588",
		"totalWithDiscounts": "0000082930894",
		"paymentDate": "2001-02-18T03:00:00.000Z",
		"isPaid": true,
		"clientId": "437e1802a77746898fc7c1f7a44141a6",
		"createdAt": "2021-02-03T08:09:49.178Z",
		"updatedAt": "2021-02-03T08:09:49.178Z"
		"discounts": [
			{
			"id": "d9c10ca7ad8043ffa6cf20ab222ff913",
			"amount": "0000000642789",
			"type": "0",
			"createdAt": "2021-02-03T08:09:49.433Z",
			"updatedAt": "2021-02-03T08:09:49.433Z",
			"paymentId": "6dea3caacc874336ad94a01714e80164"
			}
		]
	},
	{
		"id": "9f4f2b4a4df641878b2dc1892405cd3b",
		"coin": "001",
		"totalAmount": "0000235600121",
		"totalDiscount": "0000000112873",
		"totalWithDiscounts": "0000235487248",
		"paymentDate": "2001-02-18T03:00:00.000Z",
		"isPaid": true,
		"clientId": "6c5cf7a7f0a24beb952b833efc663507",
		"createdAt": "2021-02-03T08:09:49.178Z",
		"updatedAt": "2021-02-03T08:09:49.178Z"
		"discounts": [
			{
			"id": "d9c10ca7ad8043ffa6cf20ab222ff913",
			"amount": "0000000642789",
			"type": "0",
			"createdAt": "2021-02-03T08:09:49.433Z",
			"updatedAt": "2021-02-03T08:09:49.433Z",
			"paymentId": "6dea3caacc874336ad94a01714e80164"
			}
		]
	}
]
```

### Payments  y transactions

> /payments/transactions

Este servicio devuelve un array con todos los pagos y sus transacciones.

```
curl --location --request GET 'http://localhost:3001/transactions/' \

--data-raw ''
```
Ejemplo de respuesta:
```
[
	{
		"id": "6dea3caacc874336ad94a01714e80164",
		"coin": "001",
		"totalAmount": "0000084301482",
		"totalDiscount": "0000001370588",
		"totalWithDiscounts": "0000082930894",
		"paymentDate": "2001-02-18T03:00:00.000Z",
		"isPaid": true,
		"clientId": "437e1802a77746898fc7c1f7a44141a6",
		"createdAt": "2021-02-03T08:09:49.178Z",
		"updatedAt": "2021-02-03T08:09:49.178Z",
		"transactions": [
			{
			"id": "c91b726ebe0e4c84a87575346478d60b",
			"amount": "0000009937064",
			"type": "2",
			"createdAt": "2021-02-03T08:53:37.605Z",
			"updatedAt": "2021-02-03T08:53:37.605Z",
			"paymentId": "c2a8caff0c00475b826ba36aa8448c3a"
			},
		]
	},
	{
		"id": "9f4f2b4a4df641878b2dc1892405cd3b",
		"coin": "001",
		"totalAmount": "0000235600121",
		"totalDiscount": "0000000112873",
		"totalWithDiscounts": "0000235487248",
		"paymentDate": "2001-02-18T03:00:00.000Z",
		"isPaid": true,
		"clientId": "6c5cf7a7f0a24beb952b833efc663507",
		"createdAt": "2021-02-03T08:09:49.178Z",
		"updatedAt": "2021-02-03T08:09:49.178Z",
		"transactions": [
			{
			"id": "c91b726ebe0e4c84a87575346478d60b",
			"amount": "0000009937064",
			"type": "2",
			"createdAt": "2021-02-03T08:53:37.605Z",
			"updatedAt": "2021-02-03T08:53:37.605Z",
			"paymentId": "c2a8caff0c00475b826ba36aa8448c3a"
			},
		]
	}
]
```

### Payments con discounts y transactions

> /payments/discounts/transactions

Este servicio devuelve un array con todos los pagos, con sus descuentos y transacciones.

```
curl --location --request GET 'http://localhost:3001/payments/discounts/transactions' \

--data-raw ''
```
Ejemplo de respuesta:
```
[
	{
		"id": "6dea3caacc874336ad94a01714e80164",
		"coin": "001",
		"totalAmount": "0000084301482",
		"totalDiscount": "0000001370588",
		"totalWithDiscounts": "0000082930894",
		"paymentDate": "2001-02-18T03:00:00.000Z",
		"isPaid": true,
		"clientId": "437e1802a77746898fc7c1f7a44141a6",
		"createdAt": "2021-02-03T08:09:49.178Z",
		"updatedAt": "2021-02-03T08:09:49.178Z",
		"transactions": [
			{
			"id": "c91b726ebe0e4c84a87575346478d60b",
			"amount": "0000009937064",
			"type": "2",
			"createdAt": "2021-02-03T08:53:37.605Z",
			"updatedAt": "2021-02-03T08:53:37.605Z",
			"paymentId": "c2a8caff0c00475b826ba36aa8448c3a"
			},
		],
		"discounts": [
			{
			"id": "d9c10ca7ad8043ffa6cf20ab222ff913",
			"amount": "0000000642789",
			"type": "0",
			"createdAt": "2021-02-03T08:09:49.433Z",
			"updatedAt": "2021-02-03T08:09:49.433Z",
			"paymentId": "6dea3caacc874336ad94a01714e80164"
			}
		]
	},
	{
		"id": "9f4f2b4a4df641878b2dc1892405cd3b",
		"coin": "001",
		"totalAmount": "0000235600121",
		"totalDiscount": "0000000112873",
		"totalWithDiscounts": "0000235487248",
		"paymentDate": "2001-02-18T03:00:00.000Z",
		"isPaid": true,
		"clientId": "6c5cf7a7f0a24beb952b833efc663507",
		"createdAt": "2021-02-03T08:09:49.178Z",
		"updatedAt": "2021-02-03T08:09:49.178Z",
		"transactions": [
			{
			"id": "c91b726ebe0e4c84a87575346478d60b",
			"amount": "0000009937064",
			"type": "2",
			"createdAt": "2021-02-03T08:53:37.605Z",
			"updatedAt": "2021-02-03T08:53:37.605Z",
			"paymentId": "c2a8caff0c00475b826ba36aa8448c3a"
			},
		],
		"discounts": [
			{
			"id": "d9c10ca7ad8043ffa6cf20ab222ff913",
			"amount": "0000000642789",
			"type": "0",
			"createdAt": "2021-02-03T08:09:49.433Z",
			"updatedAt": "2021-02-03T08:09:49.433Z",
			"paymentId": "6dea3caacc874336ad94a01714e80164"
			}
		]
	}
]
```

### Payments de un cliente

> /payments

Este servicio devuelve un array con todos los pagos.

```
curl --location --request GET 'http://localhost:3001/payments/:clientId/client/discounts/transactions' \

--data-raw ''
```
Ejemplo de respuesta:
```
[
	{
		"id": "6dea3caacc874336ad94a01714e80164",
		"coin": "001",
		"totalAmount": "0000084301482",
		"totalDiscount": "0000001370588",
		"totalWithDiscounts": "0000082930894",
		"paymentDate": "2001-02-18T03:00:00.000Z",
		"isPaid": true,
		"clientId": "437e1802a77746898fc7c1f7a44141a6",
		"createdAt": "2021-02-03T08:09:49.178Z",
		"updatedAt": "2021-02-03T08:09:49.178Z"
	},
	{
		"id": "9f4f2b4a4df641878b2dc1892405cd3b",
		"coin": "001",
		"totalAmount": "0000235600121",
		"totalDiscount": "0000000112873",
		"totalWithDiscounts": "0000235487248",
		"paymentDate": "2001-02-18T03:00:00.000Z",
		"isPaid": true,
		"clientId": "6c5cf7a7f0a24beb952b833efc663507",
		"createdAt": "2021-02-03T08:09:49.178Z",
		"updatedAt": "2021-02-03T08:09:49.178Z"
	}
]
```

### Payments de un cliente

> /:clientId/client/payments/discounts/:clientId/client/discounts/transactions

Este servicio devuelve un array con los pagos de un cilente y sus descuentos.

```
curl --location --request GET 'http://localhost:3001/payments/:clientId/client/discounts/transactions' \

--data-raw ''
```
Ejemplo de respuesta:
```
[
	{
		"id": "6dea3caacc874336ad94a01714e80164",
		"coin": "001",
		"totalAmount": "0000084301482",
		"totalDiscount": "0000001370588",
		"totalWithDiscounts": "0000082930894",
		"paymentDate": "2001-02-18T03:00:00.000Z",
		"isPaid": true,
		"clientId": "437e1802a77746898fc7c1f7a44141a6",
		"createdAt": "2021-02-03T08:09:49.178Z",
		"updatedAt": "2021-02-03T08:09:49.178Z"
		"discounts": [
			{
			"id": "d9c10ca7ad8043ffa6cf20ab222ff913",
			"amount": "0000000642789",
			"type": "0",
			"createdAt": "2021-02-03T08:09:49.433Z",
			"updatedAt": "2021-02-03T08:09:49.433Z",
			"paymentId": "6dea3caacc874336ad94a01714e80164"
			}
		]
	},
	{
		"id": "9f4f2b4a4df641878b2dc1892405cd3b",
		"coin": "001",
		"totalAmount": "0000235600121",
		"totalDiscount": "0000000112873",
		"totalWithDiscounts": "0000235487248",
		"paymentDate": "2001-02-18T03:00:00.000Z",
		"isPaid": true,
		"clientId": "6c5cf7a7f0a24beb952b833efc663507",
		"createdAt": "2021-02-03T08:09:49.178Z",
		"updatedAt": "2021-02-03T08:09:49.178Z"
		"discounts": [
			{
			"id": "d9c10ca7ad8043ffa6cf20ab222ff913",
			"amount": "0000000642789",
			"type": "0",
			"createdAt": "2021-02-03T08:09:49.433Z",
			"updatedAt": "2021-02-03T08:09:49.433Z",
			"paymentId": "6dea3caacc874336ad94a01714e80164"
			}
		]
	}
]
```

### Payments  y transactions

> /payments/transactions

Este servicio devuelve un array con todos los pagos de un cliente y sus transacciones.

```
curl --location --request GET 'http://localhost:3001/:clientId/client/transactions/' \

--data-raw ''
```
Ejemplo de respuesta:
```
[
	{
		"id": "6dea3caacc874336ad94a01714e80164",
		"coin": "001",
		"totalAmount": "0000084301482",
		"totalDiscount": "0000001370588",
		"totalWithDiscounts": "0000082930894",
		"paymentDate": "2001-02-18T03:00:00.000Z",
		"isPaid": true,
		"clientId": "437e1802a77746898fc7c1f7a44141a6",
		"createdAt": "2021-02-03T08:09:49.178Z",
		"updatedAt": "2021-02-03T08:09:49.178Z",
		"transactions": [
			{
			"id": "c91b726ebe0e4c84a87575346478d60b",
			"amount": "0000009937064",
			"type": "2",
			"createdAt": "2021-02-03T08:53:37.605Z",
			"updatedAt": "2021-02-03T08:53:37.605Z",
			"paymentId": "c2a8caff0c00475b826ba36aa8448c3a"
			},
		]
	},
	{
		"id": "9f4f2b4a4df641878b2dc1892405cd3b",
		"coin": "001",
		"totalAmount": "0000235600121",
		"totalDiscount": "0000000112873",
		"totalWithDiscounts": "0000235487248",
		"paymentDate": "2001-02-18T03:00:00.000Z",
		"isPaid": true,
		"clientId": "6c5cf7a7f0a24beb952b833efc663507",
		"createdAt": "2021-02-03T08:09:49.178Z",
		"updatedAt": "2021-02-03T08:09:49.178Z",
		"transactions": [
			{
			"id": "c91b726ebe0e4c84a87575346478d60b",
			"amount": "0000009937064",
			"type": "2",
			"createdAt": "2021-02-03T08:53:37.605Z",
			"updatedAt": "2021-02-03T08:53:37.605Z",
			"paymentId": "c2a8caff0c00475b826ba36aa8448c3a"
			},
		]
	}
]
```

### Payments con discounts y transactions

> /payments/discounts/transactions

Este servicio devuelve un array con todos los pagos de un cliente, con sus descuentos y transacciones.

```
curl --location --request GET 'http://localhost:3001/payments/:clientId/client/discounts/transactionsdiscounts/transactions' \

--data-raw ''
```
Ejemplo de respuesta:
```
[
	{
		"id": "6dea3caacc874336ad94a01714e80164",
		"coin": "001",
		"totalAmount": "0000084301482",
		"totalDiscount": "0000001370588",
		"totalWithDiscounts": "0000082930894",
		"paymentDate": "2001-02-18T03:00:00.000Z",
		"isPaid": true,
		"clientId": "437e1802a77746898fc7c1f7a44141a6",
		"createdAt": "2021-02-03T08:09:49.178Z",
		"updatedAt": "2021-02-03T08:09:49.178Z",
		"transactions": [
			{
			"id": "c91b726ebe0e4c84a87575346478d60b",
			"amount": "0000009937064",
			"type": "2",
			"createdAt": "2021-02-03T08:53:37.605Z",
			"updatedAt": "2021-02-03T08:53:37.605Z",
			"paymentId": "c2a8caff0c00475b826ba36aa8448c3a"
			},
		],
		"discounts": [
			{
			"id": "d9c10ca7ad8043ffa6cf20ab222ff913",
			"amount": "0000000642789",
			"type": "0",
			"createdAt": "2021-02-03T08:09:49.433Z",
			"updatedAt": "2021-02-03T08:09:49.433Z",
			"paymentId": "6dea3caacc874336ad94a01714e80164"
			}
		]
	},
	{
		"id": "9f4f2b4a4df641878b2dc1892405cd3b",
		"coin": "001",
		"totalAmount": "0000235600121",
		"totalDiscount": "0000000112873",
		"totalWithDiscounts": "0000235487248",
		"paymentDate": "2001-02-18T03:00:00.000Z",
		"isPaid": true,
		"clientId": "6c5cf7a7f0a24beb952b833efc663507",
		"createdAt": "2021-02-03T08:09:49.178Z",
		"updatedAt": "2021-02-03T08:09:49.178Z",
		"transactions": [
			{
			"id": "c91b726ebe0e4c84a87575346478d60b",
			"amount": "0000009937064",
			"type": "2",
			"createdAt": "2021-02-03T08:53:37.605Z",
			"updatedAt": "2021-02-03T08:53:37.605Z",
			"paymentId": "c2a8caff0c00475b826ba36aa8448c3a"
			},
		],
		"discounts": [
			{
			"id": "d9c10ca7ad8043ffa6cf20ab222ff913",
			"amount": "0000000642789",
			"type": "0",
			"createdAt": "2021-02-03T08:09:49.433Z",
			"updatedAt": "2021-02-03T08:09:49.433Z",
			"paymentId": "6dea3caacc874336ad94a01714e80164"
			}
		]
	}
]
```
### Payments de un cliente pagos o impagos

@params: clientId: id del cliente, isPaid: true para pagos, false para impagos
> /payments/:clientId/client/:isPaid/ispaid

Este servicio devuelve un array con todos los pagos de un cliente pagos o impagos

```
curl --location --request GET 'http://localhost:3001/payments/:clientId/client/:isPaid/ispaid' \

--data-raw ''
```
Ejemplo de respuesta:
```
[
	{
		"id": "6dea3caacc874336ad94a01714e80164",
		"coin": "001",
		"totalAmount": "0000084301482",
		"totalDiscount": "0000001370588",
		"totalWithDiscounts": "0000082930894",
		"paymentDate": "2001-02-18T03:00:00.000Z",
		"isPaid": true,
		"clientId": "437e1802a77746898fc7c1f7a44141a6",
		"createdAt": "2021-02-03T08:09:49.178Z",
		"updatedAt": "2021-02-03T08:09:49.178Z"
	},
	{
		"id": "9f4f2b4a4df641878b2dc1892405cd3b",
		"coin": "001",
		"totalAmount": "0000235600121",
		"totalDiscount": "0000000112873",
		"totalWithDiscounts": "0000235487248",
		"paymentDate": "2001-02-18T03:00:00.000Z",
		"isPaid": true,
		"clientId": "6c5cf7a7f0a24beb952b833efc663507",
		"createdAt": "2021-02-03T08:09:49.178Z",
		"updatedAt": "2021-02-03T08:09:49.178Z"
	}
]
```

### Payments de un cliente pagos o impagos


@params: clientId: id del cliente, isPaid: true para pagos, false para impagos
> /payments/:id/id/:isPaid/ispaid

Este servicio cambia el estado de un pago. 
```
curl --location --request PUT 'http://localhost:3001/payments/:id/id/:isPaid/ispaid' \

--data-raw ''
```

La respuesta de este servicio es 200 si logra cambiar el estadio del pago