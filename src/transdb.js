//Sit Hin Kit 21078808d
//Wong Sze Sze 21081046d

import fs from 'fs/promises';
import client from './dbclient.js';

var currentDate = new Date();
console.log(currentDate.toLocaleString('en-HK').toUpperCase());

async function init_db() {
  try {
    // TODO
    const trans = client.db('groupproject').collection('trans');
    if ((await trans.countDocuments()) === 0) {
      const json = await JSON.parse(await fs.readFile('./trans.json'));

      console.log('Added ' + (await trans.insertMany(json)).insertedCount + ' transactions');
    }
  } catch (err) {
    // TODO
    console.log('Unable to initialize the database!');
  }
}
init_db().catch(console.dir);

async function new_transaction(tdate, ttime, user, event, seats, tprice) {
  try {
    const trans = client.db('groupproject').collection('trans');
    const update_res = await trans.insertOne({
      tdate: tdate,
      ttime: ttime,
      user: user,
      event: event,
      seats: seats,
      tprice: tprice,
    });
    console.log('Added ' + update_res.upsertedCount + ' transaction');
    return true;
  } catch (err) {
    console.log('Unable to update the database!');
    return false;
  }
}

async function user_transaction(user) {
  try {
    const trans = client.db('groupproject').collection('trans');
    const find_res = await trans.find({ user: user }).toArray();
    return find_res;
  } catch (err) {
    console.log('Unable to fetch from database!');
  }
}

async function all_transaction() {
  try {
    const trans = client.db('groupproject').collection('trans');
    const find_res = await trans.find().toArray();
    return find_res;
  } catch (err) {
    console.log('Unable to fetch from database!');
  }
}

export { new_transaction, user_transaction, all_transaction };
