const express = require('express');
const logger = require('morgan');
const path = require('path');

const app = express();

app.use(logger('dev'));

// app.use(express.static(path.join(__dirname, './../client/public')));


// app.use('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, './../client/public/index.html'));
// })

app.listen(8080, () => console.log('Listening on port 1234'));
