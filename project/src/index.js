import express from 'express';
import morgan from 'morgan';
import sequelize from './models';
import session from 'express-session';
import * as path from 'path';
import moment from 'moment';

// getting the models
import User from './models/user';
import Todo from './models/todo';
import Item from './models/item';

// getting the controllers
import UserController from './routes/user';
import TodoController from './routes/todo';
import ItemController from './routes/item';

User.hasMany(Todo);
Todo.belongsTo(User, { onDelete: 'CASCADE' });
Todo.hasMany(Item);
Item.belongsTo(Todo, { onDelete: 'CASCADE' });

sequelize
  .sync()
  .then(() => console.log('Synced tables with DB'))
  .catch(console.warn);

const app = express();
app.locals.moment = moment;
app.use(
  session({
    secret: 'woot',
    resave: false,
    saveUninitialized: false,
    // eslint-disable-next-line comma-dangle
  })
);
app.set('view engine', 'pug');
app.use('/static', express.static(path.resolve(__dirname, '..', 'static')));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));

app.use('/user', UserController);
app.use('/todo', TodoController);
app.use('/item', ItemController);

app.all('/*', (req, res) => {
  if (req.session.user) {
    res.redirect('/todo/all');
  } else {
    res.redirect('/user/all');
  }
});
app.listen(3000, () => {
  console.log('Running HTTP Server on :3000');
});
