require('dotenv').config();
const express = require('express');
const mysql = require('mysql');

const app = express();

// connect to sql
const createUnixSocketPool = async config => {
  const dbSocketPath = process.env.DB_SOCKET_PATH || '/cloudsql';

  // Establish a connection to the database
  return await mysql.createPool({
    user: process.env.DB_USER, // e.g. 'my-db-user'
    password: process.env.DB_PASS, // e.g. 'my-db-password'
    database: process.env.DB_NAME, // e.g. 'my-database'
    // If connecting via unix domain socket, specify the path
    socketPath: `${dbSocketPath}/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
    // Specify additional properties here.
    ...config,
  });
};

// connecting to proxy - localhost 3306
const createTcpPool = async (config) => {
  // Extract host and port from socket address
  const dbSocketAddr = process.env.DB_HOST.split(":")

  // Establish a connection to the database
  return await mysql.createPool({
    user: process.env.DB_USER, // e.g. 'my-db-user'
    password: process.env.DB_PASS, // e.g. 'my-db-password'
    database: process.env.DB_NAME, // e.g. 'my-database'
    host: dbSocketAddr[0], // e.g. '127.0.0.1'
    port: dbSocketAddr[1], // e.g. '3306'
    // ... Specify additional properties here.
    ...config
  });
}

const createPool = async (config) => {
  if (process.env.DB_HOST) {
    return await createTcpPool(config);
  } else {
    return await createUnixSocketPool(config);
  }
}

app.get('/',  async (req, res) => {
  const config = {};
  //const pool = await createUnixSocketPool(config);
  const pool = await createPool(config);

  pool.query('SELECT 1 + 1 AS solution', function(error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500).send('Error connecting to database')
      .end();
    }
    else {
      res.status(200).send(`
        <div 
          style="display: flex; 
          flex-direction: column; 
          height: 100vh; width: 100%;"
        >
          <h1 style=" display: flex; justify-content: center;">GAE</h1>
          <div 
            style="display:flex; 
              flex-direction: column; 
              width: 100%; justify-content:center; align-items: center;"
            >
            <h3>FenceStack</h3>
            <p>GAE</p>
            <p>Database connection Successful</p>
            <p>it has now google managed ssl</p>
            <p>learnt this the hard way: google treats wwww as a subdomain in app engines</p>

            <hr />

            <h3><a href="http://codtechref.com" target="codetechref">CodtechRef.com</a></h3>
            <p>GCE</p>
            <p>need to add ssl here</p>
          </div>
        </div>
      `)
      .end();
    }

  });
  
  
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app;
