const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'sql5.freesqldatabase.com',
  user: 'sql5779898',
  password: 'RXj93PXjj1',
  database: 'sql5779898',
  port:3306
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos MySQL');
});

module.exports = connection;