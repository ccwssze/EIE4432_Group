//Sit Hin Kit 21078808d
//Wong Sze Sze 21081046d

import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import { Router } from 'express';
import { new_log, user_logs, all_logs } from './logdb.js';

const route = Router();
const form = multer();
const userjson = new Array();

route.use(
  express.urlencoded({
    extended: true,
  })
);

//request handler for POST /login
route.post('/userget', async function (req, res) {
  await user_logs(req.body.user).then(async (ress) => {
    res.json({
      status: 'success',
      logs: ress,
    });
  });
});

route.post('/allget', async function (req, res) {
  await all_logs().then(async (ress) => {
    res.json({
      status: 'success',
      logs: ress,
    });
  });
});

route.post('/new', async function (req, res) {
  await new_log(req.body.user, req.body.log).then(async (ress) => {
    res.json({
      status: 'success',
    });
  });
});

export default route;
