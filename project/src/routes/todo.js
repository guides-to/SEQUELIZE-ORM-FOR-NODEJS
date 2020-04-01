import { Router as $router } from 'express';
import User from '../models/user';
import Todo from '../models/todo';

const router = $router();

router.use((req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/user/all');
  }
});

router.get('/all', (req, res) => {
  // finding user by id
  User.findByPk(req.session.user.id)
    .then((user) => {
      // getting all todos
      user
        .getTodos()
        .then((todos) => {
          res.render('all-todos', { title: 'Todos of ' + user.name, todos });
        })
        .catch(() => {
          res.send('Something went wrong');
        });
    })
    .catch(() => {
      res.send('Something went wrong');
    });
});

router.get('/new', (_req, res) => {
  res.render('new-todo', { title: 'New Todo' });
});

router.post('/new', (req, res) => {
  // finding user by id
  User.findByPk(req.session.user.id)
    .then((user) => {
      // creating todo for the user
      user
        .createTodo({
          title: req.body.title,
          description: req.body.description,
        })
        .then(() => {
          res.redirect('/todo/all');
        })
        .catch(() => {
          res.send('Something went wrong');
        });
    })
    .catch(() => {
      res.send('Something went wrong');
    });
});

router.get('/:id/view', (req, res) => {
  // finding todo by id
  Todo.findByPk(req.params.id)
    .then((todo) => {
      if (todo) {
        req.session.todo = todo;
        req.session.save((e) => {
          if (e) {
            res.send('Something went wrong');
          } else {
            todo
              .getItems()
              .then((items) => {
                res.render('view-todo', {
                  title: 'Todo Details',
                  todo,
                  items,
                });
              })
              .catch(() => {
                res.send('Something went wrong');
              });
          }
        });
      } else {
        res.send('Todo not found');
      }
    })
    .catch(() => {
      res.send('Something went wrong');
    });
});

router.get('/:id/edit', (req, res) => {
  // finding todo by id
  Todo.findByPk(req.params.id)
    .then((todo) => {
      if (todo) {
        res.render('edit-todo', {
          title: 'Edit Todo Details',
          todo,
        });
      } else {
        res.send('Todo not found');
      }
    })
    .catch(() => {
      res.send('Something went wrong');
    });
});
router.post('/:id/edit', (req, res) => {
  // finding todo by id
  Todo.findByPk(req.params.id)
    .then((todo) => {
      // if todo exists
      if (todo) {
        todo.title = req.body.title;
        todo.description = req.body.description;
        // updating its fields
        todo
          .save()
          .then(() => {
            res.redirect('/todo/all');
          })
          .catch(() => {
            res.send('Something went wrong');
          });
      } else {
        res.send('Todo not found');
      }
    })
    .catch(() => {
      res.send('Something went wrong');
    });
});

router.get('/:id/delete', (req, res) => {
  // finding todo by id
  Todo.findByPk(req.params.id)
    .then((todo) => {
      // if todo exists
      if (todo) {
        // delete the entry
        todo
          .destroy()
          .then(() => {
            res.redirect('/todo/all');
          })
          .catch(() => {
            res.send('Something went wrong');
          });
      } else {
        res.send('Todo not found');
      }
    })
    .catch(() => {
      res.send('Something went wrong');
    });
});

export default router;
