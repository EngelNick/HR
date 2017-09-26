const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const savenews = require('./routes/savenews')(router);
const vacancies = require('./routes/vacancies')(router);
const articles = require('./routes/articles')(router);
const authentication = require('./routes/authentication')(router);
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 8080;

mongoose.Promise = global.Promise;

mongoose.connect(config.uri, (err) => {
    if (err) {
        console.log('Нет связи с базой данных: ', err);
    } else {
        console.log('Успешно подключено к базе данных ' + config.db);
    }
});

app.use(cors({
    origin: 'http://localhost:4200'
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.use('/vacancies', vacancies );
app.use('/savenews', savenews );
app.use('/articles', articles );
app.use('/authentication', authentication );


// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname + '/client/src/index.html'));
// });

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(port, () => {
    console.log('Сервер слушает порт ' + port);
});