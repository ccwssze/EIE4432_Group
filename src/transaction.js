//Sit Hin Kit 21078808d
//Wong Sze Sze 21081046d

import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import { Router } from 'express';
import { new_transaction, user_transaction, all_transaction } from './transdb.js';

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
  await user_transaction(req.body.user).then(async (ress) => {
    res.json({
      status: 'success',
      trans: ress,
    });
  });
});

route.post('/allget', async function (req, res) {
  await all_transaction().then(async (ress) => {
    res.json({
      status: 'success',
      trans: ress,
    });
  });
});

route.post('/new', async function (req, res) {
  await new_transaction(
    req.body.tdate,
    req.body.ttime,
    req.body.user,
    req.body.event,
    req.body.seats,
    req.body.tprice
  ).then(async (ress) => {
    res.json({
      status: 'success',
    });
  });
});

export default route;
