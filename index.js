const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('¡Hola desde el backend!');
});

app.listen(5000, () => {
  console.log('Servidor backend iniciado en el puerto 5000');
});