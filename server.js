const express = require('express');
const cors = require('cors');
const app = express();
const personaRoutes = require('./routes/persona');

app.use(cors());
app.use(express.json());

app.use('/api/personas', personaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
