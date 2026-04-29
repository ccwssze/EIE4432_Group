//Sit Hin Kit 21078808d
//Wong Sze Sze 21081046d

import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import { Router } from 'express';
import { validate_user, update_user, fetch_user, username_exist, all_user } from './userdb.js';

//const users = new Map();
const route = Router();
const form = multer();
const userjson = new Array();

/*async function update_user(username, password, role) {
  var to_append = {
    username: username,
    password: password,
    role: role,
    enabled: true,
  };
  users.set(to_append['username'], to_append);
  users.forEach(function (item) {
    userjson.push(item);
  });
  if ((await fs.writeFile('./users.json', JSON.stringify(userjson))) == undefined) {
    return true;
  } else {
    return false;
  }
}

async function init_userdb() {
  try {
    if (users.size === 0) {
      const json = JSON.parse(await fs.readFile('./users.json'));
      json.forEach(function (item) {
        users.set(item['username'], item);
      });
    } else {
      return;
    }
  } catch (err) {
    console.log('Error Caught!');
  }
}

async function validate_user(username, password) {
  console.log('recevied: ' + username + ' ' + password);
  if (users.has(username)) {
    if (users.get(username)['password'] === password) {
      return users.get(username);
    } else {
      console.log('Incorrect password!');
      return false;
    }
  } else {
    console.log('User not found!');
    return false;
  }
}*/

route.use(
  express.urlencoded({
    extended: true,
  })
);

//request handler for POST /login
route.post('/login', form.none(), async function (req, res) {
  //if (users.size === 0) {
  //await init_userdb();
  //}
  if (req.session.logged === true) {
    req.session.logged = false;
  }
  if ((await validate_user(req.body.username, req.body.password)) != false) {
    await fetch_user(req.body.username).then(async (ress) => {
      if (ress.enabled) {
        req.session.username = ress.username;
        req.session.role = ress.role;
        req.session.logged = true;
        req.session.timestamp = new Date();
        res.json({
          status: 'success',
          user: {
            username: ress.username,
            role: ress.role,
          },
        });
      } else {
        res.status(401).json({
          status: 'failed',
          message: 'User `' + req.body.username + '` is currently disabled',
        });
      }
    });
  } else {
    res.status(401).json({
      status: 'failed',
      message: 'Incorrect username and password',
    });
  }
});

//request handler for POST /logout
route.post('/logout', async function (req, res) {
  if (req.session.logged === true) {
    req.session.destroy();
    res.end();
  } else {
    res.status(401).json({
      status: 'failed',
      message: 'Unauthorized',
    });
  }
});

//request handler for GET /me
route.get('/me', async function (req, res) {
  if (req.session.logged === true) {
    await fetch_user(req.session.username).then(async (ress) => {
      res.json({
        status: 'success',
        user: {
          username: ress.username,
          password: ress.password,
          role: ress.role,
          nickname: ress.nickname,
          email: ress.email,
          gender: ress.gender,
          birthdate: ress.birthdate,
        },
      });
    });
  } else {
    res.status(401).json({
      status: 'failed',
      message: 'Unauthorized',
    });
  }
});

route.post('/get', async function (req, res) {
  await fetch_user(req.body.username).then(async (ress) => {
    res.json({
      status: 'success',
      user: {
        username: ress.username,
        password: ress.password,
        role: ress.role,
        nickname: ress.nickname,
        email: ress.email,
        gender: ress.gender,
        birthdate: ress.birthdate,
      },
    });
  });
});

route.get('/all', async function (req, res) {
  if (req.session.logged === true) {
    await all_user().then(async (ress) => {
      res.json({
        status: 'success',
        users: ress,
      });
    });
  } else {
    res.status(401).json({
      status: 'failed',
      message: 'Unauthorized',
    });
  }
});

//request handler for POST /register
route.post('/register', form.none(), async function (req, res) {
  //if (users.size === 0) {
  //await init_userdb();
  //}
  if (req.body.username != '' && req.body.password != '') {
    if (req.body.username.length >= 3) {
      if ((await username_exist(req.body.username)) == false) {
        if (req.body.password.length >= 8) {
          if (req.body.role == 'student' || req.body.role == 'user') {
            //console.log(update_status);
            if (
              (await update_user(
                req.body.username,
                req.body.password,
                req.body.role,
                true,
                req.body.nickname,
                req.body.email,
                req.body.gender,
                req.body.birthdate
              )) == true
            ) {
              fetch_user(req.body.username).then(async (ress) => {
                res.json({
                  status: 'success',
                  user: {
                    username: ress.username,
                    role: ress.role,
                  },
                });
              });
            } else {
              res.status(500).json({
                status: 'failed',
                message: 'Account created but unable to save into the database',
              });
            }
          } else {
            res.status(400).json({
              status: 'failed',
              message: 'Role can only be either `student` or `user`',
            });
          }
        } else {
          res.status(400).json({
            status: 'failed',
            message: 'Password must be at least 8 characters',
          });
        }
      } else {
        res.status(400).json({
          status: 'failed',
          message: `Username ${req.body.username} already exists`,
        });
      }
    } else {
      res.status(400).json({
        status: 'failed',
        message: 'Username must be at least 3 characters',
      });
    }
  } else {
    res.status(400).json({
      status: 'failed',
      message: 'Missing fields',
    });
  }
});

//request handler for POST /register
route.post('/update', form.none(), async function (req, res) {
  //if (users.size === 0) {
  //await init_userdb();
  //}
  if (req.body.username != '' && req.body.password != '') {
    if (req.body.username.length >= 3) {
      if ((await username_exist(req.body.username)) == true) {
        if (req.body.password.length >= 8) {
          if (req.body.role == 'student' || req.body.role == 'user') {
            //console.log(update_status);
            if (
              (await update_user(
                req.body.username,
                req.body.password,
                req.body.role,
                true,
                req.body.nickname,
                req.body.email,
                req.body.gender,
                req.body.birthdate
              )) == true
            ) {
              fetch_user(req.body.username).then(async (ress) => {
                res.json({
                  status: 'success',
                  user: {
                    username: ress.username,
                    role: ress.role,
                  },
                });
              });
            } else {
              res.status(500).json({
                status: 'failed',
                message: 'Account updated but unable to save into the database',
              });
            }
          } else {
            res.status(400).json({
              status: 'failed',
              message: 'Role can only be either `student` or `user`',
            });
          }
        } else {
          res.status(400).json({
            status: 'failed',
            message: 'Password must be at least 8 characters',
          });
        }
      } else {
        res.status(400).json({
          status: 'failed',
          message: `Username ${req.body.username} do not exists`,
        });
      }
    } else {
      res.status(400).json({
        status: 'failed',
        message: 'Username must be at least 3 characters',
      });
    }
  } else {
    res.status(400).json({
      status: 'failed',
      message: 'Missing fields',
    });
  }
});

route.post('/validate', async function (req, res) {
  if ((await username_exist(req.body.username)) == true) {
    res.json({
      exist: true,
    });
  } else {
    res.json({
      exist: false,
    });
  }
});

export default route;
