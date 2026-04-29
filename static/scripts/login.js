//Sit Hin Kit 21078808d
//Wong Sze Sze 21081046d

$(document).ready(function () {
  sessionStorage.setItem('admin_role', false);
  if (localStorage.getItem('username_mem') != null) {
    $('#username').val(localStorage.getItem('username_mem'));
    $('#password').val(localStorage.getItem('password_mem'));
    if (localStorage.getItem('role_mem') == 'admin') {
      $('#admin_switch').prop('checked', true);
    } else if (localStorage.getItem('role_mem') == 'user') {
      $('#admin_switch').prop('checked', false);
    }
  }
  if (localStorage.getItem('remember')) {
    $('#remember').prop('checked', true);
  } else {
    $('#remember').prop('checked', false);
  }
});

function check_role() {
  if ($('#admin_switch').is(':checked')) {
    sessionStorage.setItem('admin_role', true);
  } else {
    sessionStorage.setItem('admin_role', false);
  }
}

function login_clicked() {
  if ($('#username').val() == '' || $('#password').val() == '') {
    alert('Username and password cannot be empty');
  } else {
    $.ajax({
      url: '/auth/login',
      type: 'POST',
      data: { username: $('#username').val(), password: $('#password').val() },
    }).always(function (response) {
      switch (response.status) {
        case 401:
          alert(response.responseJSON.message);
          break;
        case 'success':
          if ($('#admin_switch').is(':checked')) {
            if (response.user.role == 'admin') {
              alert('Logged as `' + response.user.username + '` (' + response.user.role + ')');
              login_log(response.user.username, true);
              window.location.href = '/index.html';
              sessionStorage.setItem('login_state', true);
              if ($('#remember').is(':checked')) {
                localStorage.setItem('username_mem', $('#username').val());
                localStorage.setItem('password_mem', $('#password').val());
                localStorage.setItem('role_mem', 'admin');
                localStorage.setItem('remember', true);
              } else {
                localStorage.removeItem('username_mem');
                localStorage.removeItem('password_mem');
                localStorage.removeItem('role_mem');
                localStorage.removeItem('remember');
              }
              check_role();
              break;
            } else {
              alert('Account `' + response.user.username + '` is not a admin');
              break;
            }
          } else {
            if (response.user.role == 'user') {
              alert('Logged as `' + response.user.username + '` (' + response.user.role + ')');
              login_log(response.user.username, true);
              window.location.href = '/index.html';
              sessionStorage.setItem('login_state', true);
              if ($('#remember').is(':checked')) {
                localStorage.setItem('username_mem', $('#username').val());
                localStorage.setItem('password_mem', $('#password').val());
                localStorage.setItem('role_mem', 'admin');
                localStorage.setItem('remember', true);
              } else {
                localStorage.removeItem('username_mem');
                localStorage.removeItem('password_mem');
                localStorage.removeItem('role_mem');
                localStorage.removeItem('remember');
              }
              check_role();
              break;
            } else {
              alert('Account `' + response.user.username + '` is not a user');
              break;
            }
          }
        default:
          alert('Unknown error');
      }
    });
  }
}

function login_log(user, success) {
  const cur_date = new Date();
  var cur_year = cur_date.getFullYear();
  var cur_month = cur_date.getMonth() + 1;
  var cur_day = cur_date.getDate();
  var cur_hour = cur_date.getHours();
  var cur_min = cur_date.getMinutes();
  var log_string;
  if (cur_month < 10) {
    cur_month = '0' + cur_month;
  }
  if (cur_day < 10) {
    cur_day = '0' + cur_day;
  }
  if (cur_hour < 10) {
    cur_hour = '0' + cur_hour;
  }
  if (cur_min < 10) {
    cur_min = '0' + cur_min;
  }
  if (success) {
    log_string =
      cur_year + '-' + cur_month + '-' + cur_day + ' (' + cur_hour + ':' + cur_min + ') - Login Attempt(success)';
  } else {
    log_string =
      cur_year + '-' + cur_month + '-' + cur_day + ' (' + cur_hour + ':' + cur_min + ') - Login Attempt(failed)';
  }

  console.log(log_string);
  $.ajax({ url: '/logs/new', method: 'POST', data: { user: user, log: log_string } });
}
