const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const app = express();
const {ArticleRouter} = require('./api/v1/articles');
mongoose.connect('mongodb://localhost/cms', {useNewUrlParser: true});

app.enable('strict routing'); 
app.use(bodyParser.json());

app.use('/api/v1/article', ArticleRouter);
app.use(express.static(path.join(__dirname, '../frontend/dist')))
app.get('*', (req, res) => {
    res.sendFile('index.html', {root: path.join(__dirname, '../frontend/dist')});
});

app.listen(3000, () => console.log('listening on port 3000'));
