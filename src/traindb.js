//Sit Hin Kit 21078808d
//Wong Sze Sze 21081046d

import fs from 'fs/promises';
import client from './dbclient.js';

var currentDate = new Date();
console.log(currentDate.toLocaleString('en-HK').toUpperCase());

async function init_db() {
  try {
    // TODO
    const trains = client.db('groupproject').collection('trains');
    if ((await trains.countDocuments()) === 0) {
      const json = await JSON.parse(await fs.readFile('./trains.json'));

      console.log('Added ' + (await trains.insertMany(json)).insertedCount + ' trains');
    }
  } catch (err) {
    // TODO
    console.log('Unable to initialize the database!');
  }
}
init_db().catch(console.dir);

async function update_train(traincode, date, dtime, atime, dstation, astation, seat, enabled) {
  try {
    const trains = client.db('groupproject').collection('trains');
    const update_res = await trains.updateOne(
      { traincode: traincode, date: date },
      {
        $set: {
          traincode: traincode,
          date: date,
          dtime: dtime,
          atime: atime,
          dstation: dstation,
          astation: astation,
          seat: seat,
          enabled: enabled,
        },
      },
      { upsert: true }
    );
    console.log('Added ' + update_res.upsertedCount + ' trains');
    return true;
  } catch (err) {
    console.log('Unable to update the database!');
    return false;
  }
}

async function reschedule_event(traincode, o_date, n_date, dtime, atime) {
  try {
    const trains = client.db('groupproject').collection('trains');
    const update_res = await trains.updateOne(
      { traincode: traincode, date: o_date },
      {
        $set: {
          date: n_date,
          dtime: dtime,
          atime: atime,
        },
      }
    );
    console.log('Added ' + update_res.upsertedCount + ' trains');
    return true;
  } catch (err) {
    console.log('Unable to update the database!');
    return false;
  }
}

async function cancel_event(traincode, date) {
  try {
    const trains = client.db('groupproject').collection('trains');
    const update_res = await trains.deleteOne({ traincode: traincode, date: date });
    console.log('Added ' + update_res.upsertedCount + ' trains');
    return true;
  } catch (err) {
    console.log('Unable to update the database!');
    return false;
  }
}

async function fetch_train(traincode, date) {
  try {
    const trains = client.db('groupproject').collection('trains');
    const find_res = await trains.findOne({ traincode: traincode, date: date });
    return find_res;
  } catch (err) {
    console.log('Unable to fetch from database!');
  }
}

async function train_exist(traincode, date) {
  try {
    if ((await fetch_train(traincode, date)) == undefined) {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    console.log('Unable to fetch from database!');
  }
}

async function book_fetch(date, dstation, astation) {
  try {
    const trains = client.db('groupproject').collection('trains');
    const find_res = await trains.find({ date: date, dstation: dstation, astation: astation }).toArray();
    return find_res;
  } catch (err) {
    console.log('Unable to fetch from database!');
  }
}

async function all_fetch() {
  try {
    const trains = client.db('groupproject').collection('trains');
    const find_res = await trains.find().toArray();
    return find_res;
  } catch (err) {
    console.log('Unable to fetch from database!');
  }
}

export { update_train, fetch_train, train_exist, book_fetch, all_fetch, reschedule_event, cancel_event };
