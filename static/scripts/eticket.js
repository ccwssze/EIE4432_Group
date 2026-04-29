//Sit Hin Kit 21078808d
//Wong Sze Sze 21081046d

var order_info;

$(document).ready(function () {
  order_info = JSON.parse(sessionStorage.getItem('book_info'));
  $('#e-date').html('Date: ' + order_info.train.date);
  $('#e-time').html('Time: ' + order_info.train.dtime + ' - ' + order_info.train.atime);
  $('#e-station').html(order_info.train.dstation + ' >>> ' + order_info.train.astation);
  $('#e-tcode').html('Train Code: ' + order_info.train.traincode);
  var seat_string = '';
  for (let i = 0; i < order_info.seat.length; i++) {
    seat_string += order_info.seat[i];
    seat_string += ' ';
  }
  $('#e-seat').html('Seat: ' + seat_string);
});
