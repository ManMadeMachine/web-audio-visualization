const express = require('express');
const logger = require('morgan');
const path = require('path');

const app = express();

app.use(logger('dev'));

// app.use(express.static(path.join(__dirname, './../client/public')));


// app.use('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, './../client/public/index.html'));
// })

app.get('/file/:name', (req, res) => {
    const name = req.params.name;



    res.sendFile(path.resolve(__dirname, `./files/${name}`), (err) => {
        if (err){
            console.error(err.message);
        }
        else {
            console.log(`Successfully sent file ${name} to the client.`);
        }
    });
})

app.listen(8080, () => console.log('Listening on port 1234'));
