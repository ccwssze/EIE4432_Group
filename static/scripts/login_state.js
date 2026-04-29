//Sit Hin Kit 21078808d
//Wong Sze Sze 21081046d

function logout() {
  $.ajax({ url: '/auth/logout', type: 'POST' });
  window.location.href = '/index.html';
  sessionStorage.setItem('login_state', false);
}

$(document).ready(function () {
  if (sessionStorage.getItem('login_state') == 'true') {
    var frequency = setInterval(function () {
      elapsedTime++;

      if (elapsedTime > 1800) {
        // One hour timeout
        clearInterval(frequency);
        console.log('Logged out', elapsedTime);
        alert('Auto Logout(Idling)');
        logout();
      }
    }, 1000);
  }
  if (sessionStorage.getItem('admin_role') == 'true' && sessionStorage.getItem('login_state') == 'true') {
    $('#admin_link2').removeClass('d-none');
    $('#admin_link3').removeClass('d-none');
    $('#user_searcher').removeClass('d-none');
  }
  if (sessionStorage.getItem('login_state') == 'true') {
    $('#logged_in1').removeClass('d-none');
    $('#logged_in2').removeClass('d-none');
    $('#normal_link1').removeClass('d-none');
    $('#normal_link2').removeClass('d-none');
    $('#normal_link3').removeClass('d-none');
    $('#admin_link1').removeClass('d-none');
  } else {
    $('#logged_out1').removeClass('d-none');
    $('#logged_out2').removeClass('d-none');
  }
});

function logout_clicked() {
  const option = confirm('Confirm to logout?');
  if (option) {
    $.ajax({ url: '/auth/logout', type: 'POST' });
    window.location.href = '/index.html';
    sessionStorage.setItem('login_state', false);
  } else {
    return;
  }
}

var elapsedTime = 0;

window.onfocus = function () {
  elapsedTime = 0;
};
window.onclick = function () {
  elapsedTime = 0;
};
