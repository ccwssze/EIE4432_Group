//Sit Hin Kit 21078808d
//Wong Sze Sze 21081046d

import fs from 'fs/promises';
import client from './dbclient.js';

var currentDate = new Date();
console.log(currentDate.toLocaleString('en-HK').toUpperCase());

async function init_db() {
  try {
    // TODO
    const users = client.db('groupproject').collection('users');
    if ((await users.countDocuments()) === 0) {
      const json = await JSON.parse(await fs.readFile('./users.json'));

      console.log('Added ' + (await users.insertMany(json)).insertedCount + ' users');
    }
  } catch (err) {
    // TODO
    console.log('Unable to initialize the database!');
  }
}
init_db().catch(console.dir);

async function validate_user(username, password) {
  try {
    if (username == '' || password == '') {
      return false;
    } else {
      const users = client.db('groupproject').collection('users');
      const find_res = await users.findOne({ username: username, password: password });
      if (find_res == undefined) {
        return false;
      } else {
        return find_res;
      }
    }
  } catch (err) {
    console.log('Unable to fetch from database!');
  }
}

async function update_user(username, password, role, enabled, nickname, email, gender, birthdate) {
  try {
    const users = client.db('groupproject').collection('users');
    const update_res = await users.updateOne(
      { username: username },
      {
        $set: {
          username: username,
          password: password,
          nickname: nickname,
          email: email,
          gender: gender,
          birthdate: birthdate,
          role: role,
          enabled: enabled,
        },
      },
      { upsert: true }
    );
    console.log('Added ' + update_res.upsertedCount + ' users');
    return true;
  } catch (err) {
    console.log('Unable to update the database!');
    return false;
  }
}

async function fetch_user(username) {
  try {
    const users = client.db('groupproject').collection('users');
    const find_res = await users.findOne({ username: username });
    return find_res;
  } catch (err) {
    console.log('Unable to fetch from database!');
  }
}

async function all_user() {
  try {
    const users = client.db('groupproject').collection('users');
    const find_res = await users.find().toArray();
    return find_res;
  } catch (err) {
    console.log('Unable to fetch from database!');
  }
}

async function username_exist(username) {
  try {
    if ((await fetch_user(username)) == undefined) {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    console.log('Unable to fetch from database!');
  }
}

export { validate_user, update_user, fetch_user, username_exist, all_user };
