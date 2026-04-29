//Sit Hin Kit 21078808d
//Wong Sze Sze 21081046d

$(document).ready(function () {
  $('#username').blur(function () {
    $.ajax({
      url: '/auth/validate',
      type: 'POST',
      data: { username: $('#username').val() },
    }).always(function (response) {
      if ($('#username').val() == 'wrongname' || $('#username').val() == '' || response.exist) {
        $('#username').css('box-shadow', '0px 0px 5px #FF0000');
      } else {
        $('#username').css('box-shadow', '0px 0px 5px #00FF00');
      }
    });
  });
  $('#password').blur(function () {
    if ($('#password').val() == '') {
      $('#password').css('box-shadow', '0px 0px 5px #FF0000');
    } else {
      $('#password').css('box-shadow', '0px 0px 5px #00FF00');
    }
  });
  $('#password2').blur(function () {
    if ($('#password2').val() != $('#password').val() || $('#password2').val() == '') {
      $('#password2').css('box-shadow', '0px 0px 5px #FF0000');
    } else {
      $('#password2').css('box-shadow', '0px 0px 5px #00FF00');
    }
  });
});

function changeicon() {
  const [file] = $('#iconupload').prop('files');
  if (file) {
    $('#profile-pic-preview').attr('src', URL.createObjectURL(file)).css('object-fit', 'cover');
  }
}

function register_clicked() {
  if ($('#username').val().trim() != '' && $('#password').val().trim() != '') {
    if ($('#password').val() == $('#password2').val()) {
      if (
        $('#nickname').val() != '' &&
        $('#email').val() != '' &&
        $('#gender').val() != '' &&
        $('#birthdate').val() != ''
      ) {
        $.ajax({
          url: '/auth/register',
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
              alert('Welcome, ' + response.user.username + '!\nYou can login with your account now!');
              window.location.href = '/account/login.html';
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
