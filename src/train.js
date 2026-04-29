//Sit Hin Kit 21078808d
//Wong Sze Sze 21081046d

import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import { Router } from 'express';
import {
  update_train,
  fetch_train,
  train_exist,
  book_fetch,
  all_fetch,
  reschedule_event,
  cancel_event,
} from './traindb.js';

const route = Router();
const form = multer();
const userjson = new Array();

route.use(
  express.urlencoded({
    extended: true,
  })
);

//request handler for POST /login
route.post('/bookget', async function (req, res) {
  await book_fetch(req.body.date, req.body.dstation, req.body.astation).then(async (ress) => {
    res.json({
      status: 'success',
      train: ress,
    });
  });
});

route.post('/allget', async function (req, res) {
  await all_fetch().then(async (ress) => {
    res.json({
      status: 'success',
      train: ress,
    });
  });
});

route.post('/update', async function (req, res) {
  await update_train(
    req.body.traincode,
    req.body.date,
    req.body.dtime,
    req.body.atime,
    req.body.dstation,
    req.body.astation,
    req.body.seat,
    req.body.enabled
  ).then(async (ress) => {
    res.json({
      status: 'success',
    });
  });
});

route.post('/reschedule', async function (req, res) {
  await reschedule_event(req.body.tcode, req.body.o_date, req.body.n_date, req.body.dtime, req.body.atime).then(
    async (ress) => {
      res.json({
        status: 'success',
      });
    }
  );
});

route.post('/cancel', async function (req, res) {
  await cancel_event(req.body.tcode, req.body.date).then(async (ress) => {
    res.json({
      status: 'success',
    });
  });
});

route.post('/get', async function (req, res) {
  await fetch_train(req.body.traincode, req.body.date).then(async (ress) => {
    res.json({
      status: 'success',
      train: ress,
    });
  });
});

export default route;
