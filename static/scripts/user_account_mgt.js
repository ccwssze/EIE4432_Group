//Sit Hin Kit 21078808d
//Wong Sze Sze 21081046d

var logs_data = [];
var user_info;
var all_users = [];

$(document).ready(function () {
  $.ajax({ url: '/auth/all', method: 'GET', datatype: 'json' }).always(function (response) {
    switch (response.status) {
      case 'success':
        all_users = response.users;
        for (let i = 0; i < all_users.length; i++) {
          $('#table_body').append(`<tr>
            <td><button type="button" class="btn btn-outline-dark btn-sm fw-bold" onclick="update_info('${all_users[i].username}')">${all_users[i].username}</button></td>
            <td>${all_users[i].email}</td>
          </tr>
                    `);
        }

        break;
      default:
        alert('humm');
        break;
    }
  });

  $.ajax({ url: '/auth/me', method: 'GET', datatype: 'json' })
    .always(function (response) {
      switch (response.status) {
        case 401:
          alert('Please login');
          window.location.href = '/login.html';
          break;
        case 'success':
          user_info = response.user;
          $('#event-table').append(`<tr>
                        <th id="username_col">Username</th>
                        <td>${user_info.username}</td>
                    </tr>
                    <tr>
                        <th id="pw_col">Password</th>
                        <td>${user_info.password}</td>
                    </tr>
                    <tr>
                        <th id="nickname_col">Nickname</th>
                        <td>${user_info.nickname}</td>
                    </tr>
                    <tr>
                        <th id="email_col">Email</th>
                        <td>${user_info.email}</td>
                    </tr>
                    <tr>
                        <th id="gender_col">Gender</th>
                        <td>${user_info.gender}</td>
                    </tr>
                        <tr>
                        <th id="birth_col">Birth Date</th>
                        <td>${user_info.birthdate}</td>
                    </tr>`);
          break;
        default:
          alert('humm');
          break;
      }
    })
    .then(function () {
      $.ajax({ url: '/logs/userget', type: 'POST', data: { user: user_info.username } })
        .always(function (response) {
          switch (response.status) {
            case 'success':
              for (let i = 0; i < response.logs.length; i++) {
                logs_data.push({
                  user: response.logs[i].user,
                  log: response.logs[i].log,
                });
              }
              break;
            default:
              alert('Unexpected Error!');
          }
        })
        .then(function () {
          for (let i = 0; i < logs_data.length; i++) {
            $('#user-log').append(`<p>${logs_data[i].log}</p>`);
          }
        });
    });
});

function update_info(user) {
  $.ajax({ url: '/auth/get', method: 'post', data: { username: user } })
    .always(function (response) {
      switch (response.status) {
        case 401:
          alert('Please login');
          window.location.href = '/login.html';
          break;
        case 'success':
          user_info = response.user;
          $('#event-table tr').remove();
          $('#event-table').append(`<tr>
                        <th id="username_col">Username</th>
                        <td>${user_info.username}</td>
                    </tr>
                    <tr>
                        <th id="pw_col">Password</th>
                        <td>${user_info.password}</td>
                    </tr>
                    <tr>
                        <th id="nickname_col">Nickname</th>
                        <td>${user_info.nickname}</td>
                    </tr>
                    <tr>
                        <th id="email_col">Email</th>
                        <td>${user_info.email}</td>
                    </tr>
                    <tr>
                        <th id="gender_col">Gender</th>
                        <td>${user_info.gender}</td>
                    </tr>
                        <tr>
                        <th id="birth_col">Birth Date</th>
                        <td>${user_info.birthdate}</td>
                    </tr>`);
          break;
        default:
          alert('humm');
          break;
      }
    })
    .then(function () {
      $.ajax({ url: '/logs/userget', type: 'POST', data: { user: user_info.username } })
        .always(function (response) {
          console.log(response.status);
          switch (response.status) {
            case 'success':
              logs_data = [];
              for (let i = 0; i < response.logs.length; i++) {
                logs_data.push({
                  user: response.logs[i].user,
                  log: response.logs[i].log,
                });
              }
              break;
            default:
              alert('Unexpected Error!');
          }
        })
        .then(function () {
          $('#user-log p').remove();
          for (let i = 0; i < logs_data.length; i++) {
            $('#user-log').append(`<p>${logs_data[i].log}</p>`);
          }
        });
    });
}

function user_filter() {
  var filter = $('#username-search').val();
  $('#table_body tr').remove();
  for (let i = 0; i < all_users.length; i++) {
    if (all_users[i].username.includes(filter)) {
      $('#table_body').append(`<tr>
            <td><button type="button" class="btn btn-primary btn-sm fw-bold" onclick="update_info('${all_users[i].username}')">${all_users[i].username}</button></td>
            <td>${all_users[i].email}</td>
          </tr>
                    `);
    }
  }
}
