const express = require('express');
const logger = require('morgan');
const path = require('path');

const app = express();

app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  console.log('Came here');
  res.sendFile('index.html');
});

app.get('/visual', (req, res) => {
  res.sendFile('visual.html');
});

app.listen(1234, () => console.log('Listening on port 1234'));
