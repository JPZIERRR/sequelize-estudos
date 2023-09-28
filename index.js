require('dotenv').config();

const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');

const port = process.env.PORT || 3003;

const conn = require('./db/conn');

const User = require('./models/User');

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

// receber resposta do body
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/add', async (req, res) => {
  const { name, email, fone } = req.body;

  const data = {
    name,
    email,
    fone,
  };

  try {
    await User.create(data);

    res.redirect('/users');
  } catch (err) {
    console.log('Aconteceu um erro!', err);
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({ raw: true });

    res.render('users', { users });
  } catch (err) {
    console.log('Aconteceu um erro!', err);
  }
});

app.get('/edit/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findOne({ where: { id: id }, raw: true });
    console.log(user);

    res.render('editform', { user });
  } catch (err) {
    console.log(err);
  }
});

app.post('/edit', async (req, res) => {
  const { name, id, email, fone } = req.body;

  const user = {
    name,
    email,
    fone,
  };

  try {
    await User.update(user, { where: { id: id } });

    res.redirect('/users');
  } catch (err) {
    console.log(err);
  }
});

app.post('/delete', async (req, res) => {
  const id = req.body.id;

  try {
    await User.destroy({ where: { id: id } });

    res.redirect('/users');
  } catch (err) {
    console.log(err);
  }
});

app.get('/', (req, res) => {
  res.render('home');
});

conn
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log('Servidor rodando');
    });
  })
  .catch(err => {
    console.log('Aconteceu um erro!!! ' + err);
  });
