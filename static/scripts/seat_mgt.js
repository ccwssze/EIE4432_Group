//Sit Hin Kit 21078808d
//Wong Sze Sze 21081046d

var num_seat_selected = 0;
var pricePseat = 20;

var selected_seat = [];

var trains;
var selected_train;

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
      console.log(trains);
      trains.forEach((item) => {
        $('#train_event').append(
          $('<option>', {
            value: item.traincode + ' ' + item.date,
            text: item.dtime.slice(0, 5) + ' - ' + item.atime.slice(0, 5) + ' / ' + item.date + ' / ' + item.traincode,
          })
        );
      });
    });
});

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
          selected_seat = trains[i].seat.taken;
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
                }" onclick="bookseat_toggle_admin('${i}${Alpha[j]}')"></rect>
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
                }" onclick="bookseat_toggle_admin('${i}${Alpha[j]}')"></rect>
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
    if (selected_seat != null) {
      for (let i = 0; i < selected_seat.length; i++) {
        $('#' + selected_seat[i][0])
          .addClass('booked_admin')
          .removeClass('seat')
          .attr('alt', selected_seat[i][1]);
      }
    }
  }

  //for testing show seat owner

  //

  $('.booked_admin').hover(
    function () {
      $('#seat_no').text(`Seat:${$(this).attr('id')}`);
      $('#seat_owner').text(`Owner: ${$(this).attr('alt')}`);
    },
    function () {
      $('#seat_no').text(`Seat:`);
      $('#seat_owner').text(`Owner:`);
    }
  );
}

function setclick() {
  $('#1A').click(alert(' '));
}

//document.getElementsByClassName("seat").addEventListener("click", seat_select_toggle())
//document.getElementsByClassName("seat").addEventListener("click", seat_select_toggle())

function bookseat(seat) {
  $('#' + seat)
    .addClass('booked')
    .removeClass('seat');
}

function freeseat(seat) {
  $('#' + seat)
    .removeClass('booked')
    .addClass('seat');
}
function bookseat_toggle_admin(seat) {
  if ($('#' + seat).attr('class') == 'seat') {
    $('#' + seat)
      .addClass('booked_admin')
      .removeClass('seat');
    num_seat_selected += 1;
    selected_seat.push([seat, 'admin']);
    console.log(selected_seat);
  } else if ($('#' + seat).attr('class') == 'booked_admin') {
    $('#' + seat)
      .addClass('seat')
      .removeClass('booked_admin');
    num_seat_selected -= 1;
    let index = 0;
    for (let i = 0; i < selected_seat.length; i++) {
      if (selected_seat[i][0] == seat) {
        index = i;
      }
    }
    selected_seat.splice(index, 1);
    console.log(selected_seat);
  }
}

function seat_select_toggle(seat) {
  if ($('#' + seat).attr('class') == 'seat') {
    $('#' + seat)
      .addClass('selected')
      .removeClass('seat');
  } else if ($('#' + seat).attr('class') == 'selected') {
    $('#' + seat)
      .addClass('seat')
      .removeClass('selected');
  }
  $('#seat_amount').text(`No. of seat selected:${num_seat_selected}`);
  $('#total_price').text(`Price:$${num_seat_selected * pricePseat}`);
}

function confirm() {
  selected_train.seat.taken = [];
  for (let i = 0; i < selected_seat.length; i++) {
    selected_train.seat.taken.push(selected_seat[i]);
  }
  console.log(selected_train);
  $.ajax({
    url: '/train/update',
    type: 'POST',
    data: {
      traincode: selected_train.traincode,
      date: selected_train.date,
      dtime: selected_train.dtime,
      atime: selected_train.atime,
      dstation: selected_train.dstation,
      astation: selected_train.astation,
      seat: selected_train.seat,
      enabled: 'true',
    },
  })
    .always(function (response) {
      switch (response.status) {
        case 'success':
          break;
        default:
          alert('Unexpected Error!');
      }
    })
    .then(function () {
      window.location.href = '../admin/seat_mgt.html';
    });
}
