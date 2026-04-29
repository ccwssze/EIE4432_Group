//Sit Hin Kit 21078808d
//Wong Sze Sze 21081046d

var user_info;

function changeicon() {
  const [file] = $('#iconupload').prop('files');
  if (file) {
    $('#profile-pic-preview').attr('src', URL.createObjectURL(file)).css('object-fit', 'cover');
  }
}

$(document).ready(function () {
  $.ajax({ url: '/auth/me', method: 'GET', datatype: 'json' }).always(function (response) {
    console.log(response.status);
    switch (response.status) {
      case 401:
        alert('Please login');
        window.location.href = '/login.html';
        break;
      case 'success':
        user_info = response.user;
        $('#username').val(response.user.username);
        $('#password').val(response.user.password);
        $('#password2').val(response.user.password);
        $('#nickname').val(response.user.nickname);
        $('#email').val(response.user.email);
        $('#gender option[value="' + response.user.gender + '"]').attr('selected', true);
        $('#birthdate').val(response.user.birthdate);
        break;
      default:
        alert('humm');
        break;
    }
  });
});

function update_clicked() {
  if ($('#username').val().trim() != '' && $('#password').val().trim() != '') {
    if ($('#password').val() == $('#password2').val()) {
      if (
        $('#nickname').val() != '' &&
        $('#email').val() != '' &&
        $('#gender').val() != '' &&
        $('#birthdate').val() != ''
      ) {
        $.ajax({
          url: '/auth/update',
          type: 'POST',
          data: {
            username: $('#username').val(),
            password: $('#password').val(),
            nickname: $('#nickname').val(),
            email: $('#email').val(),
            gender: $('#gender').val(),
            birthdate: $('#birthdate').val(),
            role: 'user',
          },
        }).always(function (response) {
          switch (response.status) {
            case 400:
              alert(response.responseJSON.message);
              break;
            case 500:
              alert(response.responseJSON.message);
              break;
            case 'success':
              alert('Account ' + response.user.username + ' updated!');
              profile_log(response.user.username);
              window.location.href = '/account/account_mgt.html';
              break;
            default:
              alert('Unknown error');
          }
        });
      } else {
        alert('Please fill in your information!');
      }
    } else {
      alert('Password mismatch!');
    }
  } else {
    alert('Username and password cannot be empty');
  }
}

function validpassword() {
  if ($('#password').val() == '') {
    $('#password').css('box-shadow', '0px 0px 5px #FF0000');
  } else {
    $('#password').css('box-shadow', '0px 0px 5px #00FF00');
  }
}

function validpasswordaga() {
  if ($('#password2').val() != $('#password').val() || $('#password2').val() == '') {
    $('#password2').css('box-shadow', '0px 0px 5px #FF0000');
  } else {
    $('#password2').css('box-shadow', '0px 0px 5px #00FF00');
  }
}

function profile_log(user) {
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
  log_string = cur_year + '-' + cur_month + '-' + cur_day + ' (' + cur_hour + ':' + cur_min + ') - Profile Edited';

  console.log(log_string);
  $.ajax({ url: '/logs/new', method: 'POST', data: { user: user, log: log_string } });
}
