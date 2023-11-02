const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => { console.log('Connected to MongoDB'); })
  .catch((err) => { console.error('Failed connection to MongoDB', err) });

app.use((req, res, next) => {
  req.user = {
    _id: '6543ea6d0e712f207b9e2f33' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});