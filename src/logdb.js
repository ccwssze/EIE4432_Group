//Sit Hin Kit 21078808d
//Wong Sze Sze 21081046d

import fs from 'fs/promises';
import client from './dbclient.js';

var currentDate = new Date();
console.log(currentDate.toLocaleString('en-HK').toUpperCase());

async function init_db() {
  try {
    // TODO
    const logs = client.db('groupproject').collection('logs');
    if ((await logs.countDocuments()) === 0) {
      const json = await JSON.parse(await fs.readFile('./logs.json'));

      console.log('Added ' + (await logs.insertMany(json)).insertedCount + ' logs');
    }
  } catch (err) {
    // TODO
    console.log('Unable to initialize the database!');
  }
}
init_db().catch(console.dir);

async function new_log(user, log) {
  try {
    const logs = client.db('groupproject').collection('logs');
    const update_res = await logs.insertOne({
      user: user,
      log: log,
    });
    console.log('Added ' + update_res.insertedCount + ' logs');
    return true;
  } catch (err) {
    console.log('Unable to update the database!');
    return false;
  }
}

async function user_logs(user) {
  try {
    const logs = client.db('groupproject').collection('logs');
    const find_res = await logs.find({ user: user }).toArray();
    return find_res;
  } catch (err) {
    console.log('Unable to fetch from database!');
  }
}

async function all_logs() {
  try {
    const logs = client.db('groupproject').collection('logs');
    const find_res = await logs.find().toArray();
    return find_res;
  } catch (err) {
    console.log('Unable to fetch from database!');
  }
}

export { new_log, user_logs, all_logs };
