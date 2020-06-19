const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { MONGOURI } = require('./config/keys');
const PORT = process.env.PORT || 5000;

//mongoose.model('User');

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
  console.log('connected to mongo yeahhh...');
});

mongoose.connection.on('error', (err) => {
  console.log('error connecting', err);
});

require('./models/user');
require('./models/post');

app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

/*appconst middleWare = (req, res, next) => {
  console.log('Middleware executed');
  next();
};

app.use(middleWare);
/*app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/about', middleWare, (req, res) => {
  res.send('Hello World');
});*/

if (process.env.NODE_ENV == 'production') {
  app.use(express.static('client/build'));
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
