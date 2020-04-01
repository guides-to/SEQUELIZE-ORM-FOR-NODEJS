import { Router as $router } from 'express';
import User from '../models/user';

const router = $router();

router.get('/all', (req, res) => {
  // getting all  users
  User.findAll({ attributes: ['name', 'email', 'id', 'createdAt'] })
    .then((users) => {
      // rendering all users
      res.render('all-users', {
        title: 'All Users',
        users,
        activeUser: req.session.user,
      });
    })
    .catch((e) => {
      console.log(e);
      res.send('Something went wrong');
    });
});

router.get('/new', (_req, res) => {
  res.render('new-user', { title: 'New User' });
});

router.post('/new', (req, res) => {
  // counting user documents
  User.count({ where: { email: req.body.email } })
    .then((users) => {
      // if the count is zero, no user exists, create a new one
      if (users == 0) {
        User.create({ name: req.body.name, email: req.body.email })
          .then(() => {
            res.render('new-user', {
              title: 'New User',
              success: true,
              message: 'Created User',
            });
          })
          .catch(() => {
            res.send('Something went wrong');
          });
      } else {
        // user exists and send error message
        res.render('new-user', {
          title: 'New User',
          error: true,
          message: 'User Already Exists',
        });
      }
    })
    .catch(() => {
      res.send('Something went wrong');
    });
});

router.get('/:id/activate', (req, res) => {
  // finding the user by primary key
  User.findByPk(req.params.id)
    .then((user) => {
      // if user exists
      if (user) {
        // set the user in session and save it
        req.session.user = user;
        req.session.save((e) => {
          if (e) {
            res.send('Something went wrong');
          } else {
            res.redirect('/user/all');
          }
        });
      } else {
        res.send('User not found');
      }
    })
    .catch(() => {
      res.send('Something went wrong');
    });
});

router.get('/:id/edit', (req, res) => {
  // finding user by primary key
  User.findByPk(req.params.id)
    .then((user) => {
      // sending the user
      if (user) {
        res.render('edit-user', { title: 'Edit User', user });
      } else {
        res.send('User not found');
      }
    })
    .catch(() => {
      res.send('Something went wrong');
    });
});
router.post('/:id/edit', (req, res) => {
  // finding the user by primary key
  User.findByPk(req.params.id)
    .then((user) => {
      // setting the updated values
      user.name = req.body.name;
      user.email = req.body.email;

      // saving the user object
      user
        .save()
        .then(() => {
          res.redirect('/user/all');
        })
        .catch((e) => {
          res.send('Something went wrong');
        });
    })
    .catch(() => {
      res.send('Something went wrong');
    });
});

router.get('/:id/delete', (req, res) => {
  // finding the user by primary key
  User.findByPk(req.params.id)
    .then((v) => {
      // if user exists
      if (v) {
        // delete that entry
        v.destroy()
          .then(() => {
            res.redirect('/user/all');
          })
          .catch(() => {
            res.send('Something went wrong');
          });
      } else {
        res.send('User not found');
      }
    })
    .catch(() => {
      res.send('Something went wrong');
    });
});
export default router;
