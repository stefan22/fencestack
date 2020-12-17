const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.status(200).send(`
    <div 
      style="display: flex; 
      flex-direction: column; 
      height: 100vh; width: 100%;"
    >
      <h1 style=" display: flex; justify-content: center;">GAE</h1>
      <div style="display:flex; width: 100%; justify-content:center;">
        <h3>FenceStack</h3>
      </div>
    </div>
    
    `)
    .end();
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app;
