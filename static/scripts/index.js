//Sit Hin Kit 21078808d
//Wong Sze Sze 21081046d

$(document).ready(function () {
  if (sessionStorage.getItem('login_state') == 'true') {
    $('#cover_button').attr('onclick', "window.location.href='/booking.html';");
  } else {
    $('#cover_button').attr('onclick', "window.location.href='/account/login.html';");
  }
});
