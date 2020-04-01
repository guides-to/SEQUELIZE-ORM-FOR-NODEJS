import { Router as $router } from 'express';
import Todo from '../models/todo';
import Item from '../models/item';

const router = $router();

router.use((req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/todo/all');
  }
});

router.get('/new', (req, res) => {
  res.render('add-item', { title: 'Add Item', todo: req.session.todo });
});

router.post('/new', (req, res) => {
  // finding todo by primary key
  Todo.findByPk(req.session.todo.id)
    .then((todo) => {
      if (todo) {
        // creating an item using magic function
        todo
          .createItem({ title: req.body.title })
          .then(() => {
            res.redirect(`/todo/${req.query.todo}/view`);
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
  // finding item by primary key
  Item.findByPk(req.params.id)
    .then((item) => {
      if (item) {
        // deleting the record if it exists
        item
          .destroy()
          .then(() => {
            res.redirect(`/todo/${req.session.todo.id}/view`);
          })
          .catch(() => {
            res.send('Something went wrong');
          });
      } else {
        res.send('Item not found');
      }
    })
    .catch(() => {
      res.send('Something went wrong');
    });
});

router.get('/:id/edit', (req, res) => {
  // finding item  by primary key
  Item.findByPk(req.params.id)
    .then((item) => {
      if (item) {
        res.render('edit-item', {
          title: 'Edit Item',
          item,
        });
      } else {
        res.send('Item not found');
      }
    })
    .catch(() => {
      res.send('Something went wrong');
    });
});
router.post('/:id/edit', (req, res) => {
  // finding item  by primary key
  Item.findByPk(req.params.id)
    .then((item) => {
      if (item) {
        item.title = req.body.title;
        // updating its fields
        item
          .save()
          .then(() => {
            res.redirect(`/todo/${req.session.todo.id}/view`);
          })
          .catch(() => {
            res.send('Something went wrong');
          });
      } else {
        res.send('Item not found');
      }
    })
    .catch(() => {
      res.send('Something went wrong');
    });
});

router.get('/:id/status', (req, res) => {
  // finding item  by primary key
  Item.findByPk(req.params.id)
    .then((item) => {
      // if item exists
      if (item) {
        // check for the valid status
        switch (req.query.type) {
          case 'i':
            item.isCompleted = false;
            break;
          case 'c':
            item.isCompleted = true;
            break;

          default:
            res.redirect(`/todo/${req.session.todo.id}/view`);
            break;
        }
        // update the status
        item
          .save()
          .then(() => {
            res.redirect(`/todo/${req.session.todo.id}/view`);
          })
          .catch(() => {
            res.send('Something went wrong');
          });
      } else {
        res.send('Item not found');
      }
    })
    .catch(() => {
      res.send('Something went wrong');
    });
});

export default router;
