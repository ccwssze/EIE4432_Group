//Sit Hin Kit 21078808d
//Wong Sze Sze 21081046d

function placeOrder(event) {
  if (
    $('#payment-method').val() != '' &&
    $('#card-number').val() != '' &&
    $('#expired-date').val() != '' &&
    $('#cvv').val() != ''
  ) {
    if (
      $('#first-name').val() != '' &&
      $('#last-name').val() != '' &&
      $('#address').val() != '' &&
      $('#city').val() != '' &&
      $('#postal').val() != '' &&
      $('#country-city').val() != '' &&
      $('#phone').val() != ''
    ) {
      update_log();
      update_trans();
      update_train();
      $('.message').html('<div>Payment successful! Please wait...</div>');
      $('.message > div').addClass('alert alert-success');
      $('.message')
        .fadeIn(500)
        .delay(3000)
        .fadeOut(500, function () {
          $('.message > div').remove();
          document.getElementById('form').reset();
          window.location.href = '../eticket.html';
        });
    } else {
      alert('Please fill in bill info!');
    }
  } else {
    alert('Please fill in payment info!');
  }
}

function update_log() {
  const cur_date = new Date();
  var cur_year = cur_date.getFullYear();
  var cur_month = cur_date.getMonth() + 1;
  var cur_day = cur_date.getDate();
  var cur_hour = cur_date.getHours();
  var cur_min = cur_date.getMinutes();
  var ticket_no = order_info.seat.length;
  var tcode = order_info.train.traincode;
  var train_date = order_info.train.date;

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

  var log_string =
    cur_year +
    '-' +
    cur_month +
    '-' +
    cur_day +
    ' (' +
    cur_hour +
    ':' +
    cur_min +
    ') - Bought ' +
    ticket_no +
    ' tickets for ' +
    tcode +
    ' (' +
    train_date +
    ')';
  console.log(log_string);
  $.ajax({ url: '/logs/new', method: 'POST', data: { user: user_info.username, log: log_string } });
}

function update_trans() {
  const cur_date = new Date();
  var cur_year = cur_date.getFullYear();
  var cur_month = cur_date.getMonth() + 1;
  var cur_day = cur_date.getDate();
  var cur_hour = cur_date.getHours();
  var cur_min = cur_date.getMinutes();

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
  $.ajax({
    url: '/trans/new',
    method: 'POST',
    data: {
      tdate: cur_year + '-' + cur_month + '-' + cur_day,
      ttime: cur_hour + ':' + cur_min,
      user: user_info.username,
      event:
        order_info.train.traincode +
        ' / ' +
        order_info.train.date +
        ' / ' +
        order_info.train.dtime +
        ' to ' +
        order_info.train.atime +
        ' / ' +
        order_info.train.dstation +
        ' to ' +
        order_info.train.astation,
      seats: order_info.seat.length,
      tprice: order_info.seat.length * 20,
    },
  });
}

function update_train() {
  var seat_info = order_info.train.seat;
  if (seat_info.taken == null) {
    seat_info.taken = [];
  }
  for (let i = 0; i < order_info.seat.length; i++) {
    seat_info.taken.push([order_info.seat[i], user_info.username]);
  }
  console.log(seat_info);
  $.ajax({
    url: '/train/update',
    method: 'POST',
    data: {
      traincode: order_info.train.traincode,
      date: order_info.train.date,
      dtime: order_info.train.dtime,
      atime: order_info.train.atime,
      dstation: order_info.train.dstation,
      astation: order_info.train.astation,
      seat: seat_info,
      enabled: true,
    },
  });
}

var order_info;
var user_info;

$(document).ready(function () {
  order_info = JSON.parse(sessionStorage.getItem('book_info'));
  var seat_string = '';
  $('#tcode_display').html('&emsp;Train Code: ' + order_info.train.traincode);
  $('#date_display').html('&emsp;Date: ' + order_info.train.date);
  $('#time_display').html('&emsp;Time: ' + order_info.train.dtime + ' - ' + order_info.train.atime);
  $('#station_display').html('&emsp;' + order_info.train.dstation + ' -> ' + order_info.train.astation);
  for (let i = 0; i < order_info.seat.length; i++) {
    seat_string += order_info.seat[i];
    seat_string += ' ';
  }
  $('#seats_display').html('&emsp;Seat: ' + seat_string);
  var tprice = order_info.seat.length * 20;
  $('#price_display').html('$' + tprice);

  $.ajax({ url: '/auth/me', method: 'GET', datatype: 'json' }).always(function (response) {
    switch (response.status) {
      case 401:
        alert('Please login');
        window.location.href = '/login.html';
        break;
      case 'success':
        user_info = response.user;
        break;
      default:
        alert('humm');
        break;
    }
  });
});
