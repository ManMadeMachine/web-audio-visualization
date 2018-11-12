const express = require('express');
const logger = require('morgan');
const path = require('path');

const app = express();

app.use(logger('dev'));

// This can still stay, it is general enough so that I can use it in the future if necessary.
// Although it will still presume a back-end folder and files inside it. 
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
