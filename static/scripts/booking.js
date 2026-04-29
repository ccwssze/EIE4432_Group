//Sit Hin Kit 21078808d
//Wong Sze Sze 21081046d

var num_seat_selected = 0;
var pricePseat = 20;
var d_station_list = [];
var a_station_list = [];
var selected_seat = [];
var booked_seat = [];
var trains;
var selected_train;
function showseat() {
  $('#seat-array').empty();

  num_seat_selected = 0;
  $('#seat_amount').text(`No. of seat selected:${num_seat_selected}`);
  $('#total_price').text(`Price:$${num_seat_selected * pricePseat}`);

  var carts;
  var rowPcart;
  var seatProw;
  var rows;
  var Alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  var y_cor = 200;
  var x_cor = 10;
  var rowcount = 0;
  var taken_seat;

  if ($('#train_event').val() == '') {
    $('#seat-array').empty();
  } else {
    for (let i = 0; i < trains.length; i++) {
      if ($('#train_event').val() == trains[i].traincode + ' ' + trains[i].date) {
        selected_train = trains[i];
        carts = trains[i].seat.carts;
        rowPcart = trains[i].seat.rowPcart;
        seatProw = trains[i].seat.seatProw;
        if (trains[i].seat.taken != null) {
          booked_seat = trains[i].seat.taken;
        } else {
          booked_seat = [];
        }
      }
    }

    rows = rowPcart * carts;

    let toappend = ``;

    toappend += `<svg width="${210 + seatProw * 100}" height="${
      150 + rows * 100 + Math.ceil(rows / rowPcart) * 100 + 200
    }" >
                    <rect class="front" x="0" y="0" rx="20" ry="20" width="${
                      200 + seatProw * 100
                    }" height="80" id="front"/>
                    <text x="${
                      (210 + seatProw * 100) / 2
                    }" y="40" text-anchor="middle" alignment-baseline="central" fill="white">Front</text>`;
    for (let i = 1; i <= rows; i++) {
      x_cor = 10;
      for (let j = 0; j < seatProw / 2; j++) {
        let seat = `
                <rect class="seat" x="${x_cor}" y="${y_cor}" rx="20" ry="20" width="80" height="80" id="${i}${
                  Alpha[j]
                }" onclick="seat_select_toggle('${i}${Alpha[j]}')"></rect>
                <text x="${x_cor + 40}" y="${
                  y_cor + 40
                }" text-anchor="middle" alignment-baseline="central" fill="white">${i}${Alpha[j]}</text>
                `;
        toappend += seat;
        x_cor += 100;
      }
      x_cor += 200;
      for (let j = seatProw / 2; j < seatProw; j++) {
        let seat = `
                <rect class="seat" x="${x_cor}" y="${y_cor}" rx="20" ry="20" width="80" height="80" id="${i}${
                  Alpha[j]
                }" onclick="seat_select_toggle('${i}${Alpha[j]}')"></rect>
                    <text x="${x_cor + 40}" y="${
                      y_cor + 40
                    }" text-anchor="middle" alignment-baseline="central" fill="white">${i}${Alpha[j]}</text>
                `;
        toappend += seat;
        x_cor += 100;
      }
      y_cor += 100;
      rowcount++;
      if (rowcount >= rowPcart) {
        y_cor += 100;
        rowcount = 0;
      }
    }
    var door_x = 10;
    var door_y = -(rowPcart * 100);
    for (let i = 0; i < Math.ceil(rows / rowPcart); i++) {
      door_y += rowPcart * 100 + 100;
      toappend += `<rect class="door" x="${door_x}" y="${door_y}" rx="5" ry="5" width="30" height="80" id="door"></rect>`;
      toappend += `<rect class="door" x="${
        door_x + seatProw * 100 + 150
      }" y="${door_y}" rx="5" ry="5" width="30" height="80" id="door"></rect>`;
    }
    door_y += 100 + 100 * (rows - (Math.ceil(rows / rowPcart) - 1) * rowPcart);
    toappend += `<rect class="door" x="${door_x}" y="${door_y}" rx="5" ry="5" width="30" height="80" id="door"></rect>`;
    toappend += `<rect class="door" x="${
      door_x + seatProw * 100 + 150
    }" y="${door_y}" rx="5" ry="5" width="30" height="80" id="door"></rect>`;

    door_y += 100;
    toappend += `<rect class="front" x="0" y="${door_y}" rx="20" ry="20" width="${
      200 + seatProw * 100
    }" height="80" id="front"/>
                    <text x="${(210 + seatProw * 100) / 2}" y="${
                      door_y + 40
                    }" text-anchor="middle" alignment-baseline="central" fill="white">Back</text>`;

    toappend += `</svg>`;
    $('#seat-array').append(toappend);
    if (booked_seat != null) {
      for (let i = 0; i < booked_seat.length; i++) {
        $('#' + booked_seat[i][0])
          .addClass('booked')
          .removeClass('seat')
          .attr('alt', booked_seat[i][1]);
      }
    }
  }
}

function setclick() {
  $('#1A').click(alert(' '));
}

//document.getElementsByClassName("seat").addEventListener("click", seat_select_toggle())
//document.getElementsByClassName("seat").addEventListener("click", seat_select_toggle())

function bookseat_toggle(seat) {
  $('#' + seat)
    .addClass('booked')
    .removeClass('seat');
}

function freeseat(seat) {
  $('#' + seat)
    .removeClass('booked')
    .addClass('seat');
}

function seat_select_toggle(seat) {
  var seat_index;
  if ($('#' + seat).attr('class') == 'seat') {
    $('#' + seat)
      .addClass('selected')
      .removeClass('seat');
    num_seat_selected += 1;
    selected_seat.push(seat);
  } else if ($('#' + seat).attr('class') == 'selected') {
    $('#' + seat)
      .addClass('seat')
      .removeClass('selected');
    num_seat_selected -= 1;
    for (let i = 0; i < selected_seat.length; i++) {
      if (selected_seat[i] == seat) {
        seat_index = i;
      }
    }
    selected_seat.splice(seat_index, 1);
  }
  $('#seat_amount').text(`No. of seat selected:${num_seat_selected}`);
  $('#total_price').text(`Price:$${num_seat_selected * pricePseat}`);
}

function train_filter() {
  console.log('executed');
  if ($('#event_date').val() != '' && $('#d_station').val() != '' && $('#a_station').val() != '') {
    $('#train_event option').remove();
    for (let i = 0; i < trains.length; i++) {
      if (
        trains[i].date == $('#event_date').val() &&
        trains[i].dstation == $('#d_station').val() &&
        trains[i].astation == $('#a_station').val()
      ) {
        $('#train_event').append(
          $('<option>', {
            value: trains[i].traincode + ' ' + trains[i].date,
            text:
              trains[i].dtime.slice(0, 5) +
              ' - ' +
              trains[i].atime.slice(0, 5) +
              ' / ' +
              trains[i].date +
              ' / ' +
              trains[i].traincode,
          })
        );
      }
    }
  } else if ($('#event_date').val() != '') {
    $('#train_event option').remove();
    for (let i = 0; i < trains.length; i++) {
      if (trains[i].date == $('#event_date').val()) {
        $('#train_event').append(
          $('<option>', {
            value: trains[i].traincode + ' ' + trains[i].date,
            text:
              trains[i].dtime.slice(0, 5) +
              ' - ' +
              trains[i].atime.slice(0, 5) +
              ' / ' +
              trains[i].date +
              ' / ' +
              trains[i].traincode,
          })
        );
      }
    }
  } else if ($('#d_station').val() != '' && $('#a_station').val() != '') {
    $('#train_event option').remove();
    for (let i = 0; i < trains.length; i++) {
      if (trains[i].dstation == $('#d_station').val() && trains[i].astation == $('#a_station').val()) {
        $('#train_event').append(
          $('<option>', {
            value: trains[i].traincode + ' ' + trains[i].date,
            text:
              trains[i].dtime.slice(0, 5) +
              ' - ' +
              trains[i].atime.slice(0, 5) +
              ' / ' +
              trains[i].date +
              ' / ' +
              trains[i].traincode,
          })
        );
      }
    }
  } else {
    $('#train_event option').remove();
    for (let i = 0; i < trains.length; i++) {
      $('#train_event').append(
        $('<option>', {
          value: trains[i].traincode + ' ' + trains[i].date,
          text:
            trains[i].dtime.slice(0, 5) +
            ' - ' +
            trains[i].atime.slice(0, 5) +
            ' / ' +
            trains[i].date +
            ' / ' +
            trains[i].traincode,
        })
      );
    }
  }
}

function unique_array(arr) {
  var u_arr = [];
  for (let j = 0; j < arr.length; j++) {
    var unique = true;
    for (let k = 0; k < j; k++) {
      if (arr[k] == arr[j]) {
        unique = false;
      }
    }
    if (unique == true) {
      u_arr.push(arr[j]);
    }
  }
  return u_arr;
}

function confirm_booking() {
  if (selected_seat.length != 0) {
    var book_info = {
      train: selected_train,
      seat: selected_seat,
    };
    sessionStorage.setItem('book_info', JSON.stringify(book_info));
    window.location.href = '../payment.html';
  }
}

$(document).ready(function () {
  $.ajax({
    url: '/train/allget',
    type: 'POST',
    data: {},
  })
    .always(function (response) {
      switch (response.status) {
        case 'success':
          trains = response.train;

          break;
        default:
          alert('Unexpected Error!');
      }
    })
    .then(function () {
      trains.forEach((item) => {
        d_station_list.push(item.dstation);
        a_station_list.push(item.astation);
      });
      d_station_list = unique_array(d_station_list);
      a_station_list = unique_array(a_station_list);

      d_station_list.forEach((item) => {
        $('#d_station').append(
          $('<option>', {
            value: item,
            text: item,
          })
        );
      });

      a_station_list.forEach((item) => {
        $('#a_station').append(
          $('<option>', {
            value: item,
            text: item,
          })
        );
      });
      for (let i = 0; i < trains.length; i++) {
        $('#train_event').append(
          $('<option>', {
            value: trains[i].traincode + ' ' + trains[i].date,
            text:
              trains[i].dtime.slice(0, 5) +
              ' - ' +
              trains[i].atime.slice(0, 5) +
              ' / ' +
              trains[i].date +
              ' / ' +
              trains[i].traincode,
          })
        );
      }
    });
});
