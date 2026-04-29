//Sit Hin Kit 21078808d
//Wong Sze Sze 21081046d
import path from 'path';
import express from 'express';
import session from 'express-session';
import login from './login.js';
import train from './train.js';
import trans from './transaction.js';
import logs from './log.js';
import mongostore from 'connect-mongo';
import client from './dbclient.js';
import multer from 'multer';

const app = express();
var currentDate = new Date();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './static/assets');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

app.use('/static/assets', express.static('static/assets'));

app.post('/upload_image', upload.single('iconupload'), (req, res, next) => {
  console.log(JSON.stringify(req.file));
  var response = '<a href="/">Home</a><br>';
  response += 'Files uploaded successfully.<br>';
  response += `<img src="${req.file.path}" /><br>`;
  console.log(response);
  return;
});

app.use(
  session({
    secret: '21078808d_21081046d_eie4432_groupproject',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true },
    store: mongostore.create({
      client,
      dbName: 'groupproject',
      collectionName: 'session',
    }),
  })
);

app.get('/', (req, res) => {
  res.redirect('/index.html');
  //if (req.session.logged === true) {
  //  res.redirect('/index.html');
  //} else {
  //  res.redirect('/login.html');
  //}
});

app.listen(8080, () => {
  console.log(currentDate.toLocaleString('en-HK').toUpperCase());
  console.log('Server started at http://127.0.0.1:8080');
});

app.use('/auth', login);
app.use('/train', train);
app.use('/trans', trans);
app.use('/logs', logs);

app.use('/', express.static(path.join(process.cwd(), '/static')));
