//Sit Hin Kit 21078808d
//Wong Sze Sze 21081046d

var dashboard_data = [];
var auto_list = [];

$(document).ready(function () {
  $.ajax({ url: '/train/allget', type: 'POST', data: {} })
    .always(function (response) {
      switch (response.status) {
        case 'success':
          for (let i = 0; i < response.train.length; i++) {
            if (response.train[i].seat.taken != null) {
              dashboard_data.push({
                tcode: response.train[i].traincode,
                date: response.train[i].date,
                dtime: response.train[i].dtime,
                atime: response.train[i].atime,
                dstation: response.train[i].dstation,
                astation: response.train[i].astation,
                ticket:
                  response.train[i].seat.carts * response.train[i].seat.rowPcart * response.train[i].seat.seatProw -
                  response.train[i].seat.taken.length,
              });
            } else {
              dashboard_data.push({
                tcode: response.train[i].traincode,
                date: response.train[i].date,
                dtime: response.train[i].dtime,
                atime: response.train[i].atime,
                dstation: response.train[i].dstation,
                astation: response.train[i].astation,
                ticket:
                  response.train[i].seat.carts * response.train[i].seat.rowPcart * response.train[i].seat.seatProw,
              });
            }
          }
          console.log(dashboard_data);
          break;
        default:
          alert('Unexpected Error!');
      }
    })
    .then(function () {
      var event_amount = dashboard_data.length;
      console.log(event_amount);
      var tcode_list = [];
      var date_list = [];
      var dtime_list = [];
      var atime_list = [];
      var dstation_list = [];
      var astation_list = [];
      var ticket_list = [];

      for (let i = 0; i < event_amount; i++) {
        tcode_list.push(dashboard_data[i].tcode);
        date_list.push(dashboard_data[i].date);
        dtime_list.push(dashboard_data[i].dtime);
        atime_list.push(dashboard_data[i].atime);
        dstation_list.push(dashboard_data[i].dstation);
        astation_list.push(dashboard_data[i].astation);
        ticket_list.push(dashboard_data[i].ticket);
      }

      tcode_list = unique_array(tcode_list);
      date_list = unique_array(date_list);
      dtime_list = unique_array(dtime_list);
      atime_list = unique_array(atime_list);
      dstation_list = unique_array(dstation_list);
      astation_list = unique_array(astation_list);
      ticket_list = unique_array(ticket_list);

      auto_list = tcode_list.concat(
        date_list.concat(dtime_list.concat(atime_list.concat(dstation_list.concat(astation_list))))
      );
      console.log(auto_list);

      var lists = [tcode_list, date_list, dtime_list, atime_list, dstation_list, astation_list, ticket_list];
      var filters = [
        'tcode_filter',
        'date_filter',
        'dtime_filter',
        'atime_filter',
        'dstation_filter',
        'astation_filter',
        'ticket_filter',
      ];
      var columns = ['tcode_col', 'date_col', 'dtime_col', 'atime_col', 'dstation_col', 'astation_col', 'ticket_col'];

      var to_append;
      for (let p = 0; p < lists.length - 1; p++) {
        to_append = ``;
        to_append += `<select name="${filters[p]}" id="${filters[p]}" onchange="${filters[p]}()">`;
        to_append += `<option value=""></option>`;
        for (let i = 0; i < lists[p].length; i++) {
          to_append += `<option value="${lists[p][i]}">${lists[p][i]}</option>`;
        }
        to_append += `</select>`;
        $('#' + columns[p]).append(to_append);
      }

      for (let i = 0; i < event_amount; i++) {
        $('#table_body').append(
          `<tr><th>${i + 1}</th><td><img width="50" height="50" src="../assets/${dashboard_data[i].tcode}.png">${
            dashboard_data[i].tcode
          }</td><td>${dashboard_data[i].date}</td><td>${dashboard_data[i].dtime}</td><td>${
            dashboard_data[i].atime
          }</td><td>${dashboard_data[i].dstation}</td><td>${dashboard_data[i].astation}</td><td>${
            dashboard_data[i].ticket
          }</td></tr>`
        );
      }
    });
});

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

function tcode_filter() {
  $('#date_filter').val('');
  $('#dtime_filter').val('');
  $('#atime_filter').val('');
  $('#dstation_filter').val('');
  $('#astation_filter').val('');

  $('#table_body tr').remove();
  if ($('#tcode_filter').val() != '') {
    for (let i = 0; i < dashboard_data.length; i++) {
      if (dashboard_data[i].tcode == $('#tcode_filter').val()) {
        $('#table_body').append(
          `<tr><th>${i + 1}</th><td><img width="50" height="50" src="../assets/${dashboard_data[i].tcode}.png">${
            dashboard_data[i].tcode
          }</td><td>${dashboard_data[i].date}</td><td>${dashboard_data[i].dtime}</td><td>${
            dashboard_data[i].atime
          }</td><td>${dashboard_data[i].dstation}</td><td>${dashboard_data[i].astation}</td><td>${
            dashboard_data[i].ticket
          }</td></tr>`
        );
      }
    }
  } else {
    for (let i = 0; i < dashboard_data.length; i++) {
      $('#table_body').append(
        `<tr><th>${i + 1}</th><td><img width="50" height="50" src="../assets/${dashboard_data[i].tcode}.png">${
          dashboard_data[i].tcode
        }</td><td>${dashboard_data[i].date}</td><td>${dashboard_data[i].dtime}</td><td>${
          dashboard_data[i].atime
        }</td><td>${dashboard_data[i].dstation}</td><td>${dashboard_data[i].astation}</td><td>${
          dashboard_data[i].ticket
        }</td></tr>`
      );
    }
  }
}

function date_filter() {
  $('#tcode_filter').val('');
  $('#dtime_filter').val('');
  $('#atime_filter').val('');
  $('#dstation_filter').val('');
  $('#astation_filter').val('');

  $('#table_body tr').remove();
  if ($('#date_filter').val() != '') {
    for (let i = 0; i < dashboard_data.length; i++) {
      if (dashboard_data[i].date == $('#date_filter').val()) {
        $('#table_body').append(
          `<tr><th>${i + 1}</th><td><img width="50" height="50" src="../assets/${dashboard_data[i].tcode}.png">${
            dashboard_data[i].tcode
          }</td><td>${dashboard_data[i].date}</td><td>${dashboard_data[i].dtime}</td><td>${
            dashboard_data[i].atime
          }</td><td>${dashboard_data[i].dstation}</td><td>${dashboard_data[i].astation}</td><td>${
            dashboard_data[i].ticket
          }</td></tr>`
        );
      }
    }
  } else {
    for (let i = 0; i < dashboard_data.length; i++) {
      $('#table_body').append(
        `<tr><th>${i + 1}</th><td><img width="50" height="50" src="../assets/${dashboard_data[i].tcode}.png">${
          dashboard_data[i].tcode
        }</td><td>${dashboard_data[i].date}</td><td>${dashboard_data[i].dtime}</td><td>${
          dashboard_data[i].atime
        }</td><td>${dashboard_data[i].dstation}</td><td>${dashboard_data[i].astation}</td><td>${
          dashboard_data[i].ticket
        }</td></tr>`
      );
    }
  }
}

function dtime_filter() {
  $('#tcode_filter').val('');
  $('#date_filter').val('');
  $('#atime_filter').val('');
  $('#dstation_filter').val('');
  $('#astation_filter').val('');

  $('#table_body tr').remove();
  if ($('#dtime_filter').val() != '') {
    for (let i = 0; i < dashboard_data.length; i++) {
      if (dashboard_data[i].dtime == $('#dtime_filter').val()) {
        $('#table_body').append(
          `<tr><th>${i + 1}</th><td><img width="50" height="50" src="../assets/${dashboard_data[i].tcode}.png">${
            dashboard_data[i].tcode
          }</td><td>${dashboard_data[i].date}</td><td>${dashboard_data[i].dtime}</td><td>${
            dashboard_data[i].atime
          }</td><td>${dashboard_data[i].dstation}</td><td>${dashboard_data[i].astation}</td><td>${
            dashboard_data[i].ticket
          }</td></tr>`
        );
      }
    }
  } else {
    for (let i = 0; i < dashboard_data.length; i++) {
      $('#table_body').append(
        `<tr><th>${i + 1}</th><td><img width="50" height="50" src="../assets/${dashboard_data[i].tcode}.png">${
          dashboard_data[i].tcode
        }</td><td>${dashboard_data[i].date}</td><td>${dashboard_data[i].dtime}</td><td>${
          dashboard_data[i].atime
        }</td><td>${dashboard_data[i].dstation}</td><td>${dashboard_data[i].astation}</td><td>${
          dashboard_data[i].ticket
        }</td></tr>`
      );
    }
  }
}

function atime_filter() {
  $('#tcode_filter').val('');
  $('#date_filter').val('');
  $('#dtime_filter').val('');
  $('#dstation_filter').val('');
  $('#astation_filter').val('');

  $('#table_body tr').remove();
  if ($('#atime_filter').val() != '') {
    for (let i = 0; i < dashboard_data.length; i++) {
      if (dashboard_data[i].atime == $('#atime_filter').val()) {
        $('#table_body').append(
          `<tr><th>${i + 1}</th><td><img width="50" height="50" src="../assets/${dashboard_data[i].tcode}.png">${
            dashboard_data[i].tcode
          }</td><td>${dashboard_data[i].date}</td><td>${dashboard_data[i].dtime}</td><td>${
            dashboard_data[i].atime
          }</td><td>${dashboard_data[i].dstation}</td><td>${dashboard_data[i].astation}</td><td>${
            dashboard_data[i].ticket
          }</td></tr>`
        );
      }
    }
  } else {
    for (let i = 0; i < dashboard_data.length; i++) {
      $('#table_body').append(
        `<tr><th>${i + 1}</th><td><img width="50" height="50" src="../assets/${dashboard_data[i].tcode}.png">${
          dashboard_data[i].tcode
        }</td><td>${dashboard_data[i].date}</td><td>${dashboard_data[i].dtime}</td><td>${
          dashboard_data[i].atime
        }</td><td>${dashboard_data[i].dstation}</td><td>${dashboard_data[i].astation}</td><td>${
          dashboard_data[i].ticket
        }</td></tr>`
      );
    }
  }
}

function dstation_filter() {
  $('#tcode_filter').val('');
  $('#date_filter').val('');
  $('#dtime_filter').val('');
  $('#atime_filter').val('');
  $('#astation_filter').val('');

  $('#table_body tr').remove();
  if ($('#dstation_filter').val() != '') {
    for (let i = 0; i < dashboard_data.length; i++) {
      if (dashboard_data[i].dstation == $('#dstation_filter').val()) {
        $('#table_body').append(
          `<tr><th>${i + 1}</th><td><img width="50" height="50" src="../assets/${dashboard_data[i].tcode}.png">${
            dashboard_data[i].tcode
          }</td><td>${dashboard_data[i].date}</td><td>${dashboard_data[i].dtime}</td><td>${
            dashboard_data[i].atime
          }</td><td>${dashboard_data[i].dstation}</td><td>${dashboard_data[i].astation}</td><td>${
            dashboard_data[i].ticket
          }</td></tr>`
        );
      }
    }
  } else {
    for (let i = 0; i < dashboard_data.length; i++) {
      $('#table_body').append(
        `<tr><th>${i + 1}</th><td><img width="50" height="50" src="../assets/${dashboard_data[i].tcode}.png">${
          dashboard_data[i].tcode
        }</td><td>${dashboard_data[i].date}</td><td>${dashboard_data[i].dtime}</td><td>${
          dashboard_data[i].atime
        }</td><td>${dashboard_data[i].dstation}</td><td>${dashboard_data[i].astation}</td><td>${
          dashboard_data[i].ticket
        }</td></tr>`
      );
    }
  }
}

function astation_filter() {
  $('#tcode_filter').val('');
  $('#date_filter').val('');
  $('#dtime_filter').val('');
  $('#atime_filter').val('');
  $('#dstation_filter').val('');

  $('#table_body tr').remove();
  if ($('#astation_filter').val() != '') {
    for (let i = 0; i < dashboard_data.length; i++) {
      if (dashboard_data[i].astation == $('#astation_filter').val()) {
        $('#table_body').append(
          `<tr><th>${i + 1}</th><td><img width="50" height="50" src="../assets/${dashboard_data[i].tcode}.png">${
            dashboard_data[i].tcode
          }</td><td>${dashboard_data[i].date}</td><td>${dashboard_data[i].dtime}</td><td>${
            dashboard_data[i].atime
          }</td><td>${dashboard_data[i].dstation}</td><td>${dashboard_data[i].astation}</td><td>${
            dashboard_data[i].ticket
          }</td></tr>`
        );
      }
    }
  } else {
    for (let i = 0; i < dashboard_data.length; i++) {
      $('#table_body').append(
        `<tr><th>${i + 1}</th><td><img width="50" height="50" src="../assets/${dashboard_data[i].tcode}.png">${
          dashboard_data[i].tcode
        }</td><td>${dashboard_data[i].date}</td><td>${dashboard_data[i].dtime}</td><td>${
          dashboard_data[i].atime
        }</td><td>${dashboard_data[i].dstation}</td><td>${dashboard_data[i].astation}</td><td>${
          dashboard_data[i].ticket
        }</td></tr>`
      );
    }
  }
}

function dashboard_filter() {
  var filter = $('#username-search').val();
  $('#table_body tr').remove();
  for (let i = 0; i < dashboard_data.length; i++) {
    if (
      dashboard_data[i].tcode.includes(filter) ||
      dashboard_data[i].date.includes(filter) ||
      dashboard_data[i].dtime.includes(filter) ||
      dashboard_data[i].atime.includes(filter) ||
      dashboard_data[i].dstation.includes(filter) ||
      dashboard_data[i].astation.includes(filter)
    ) {
      $('#table_body').append(
        `<tr><th>${i + 1}</th><td><img width="50" height="50" src="../assets/${dashboard_data[i].tcode}.png">${
          dashboard_data[i].tcode
        }</td><td>${dashboard_data[i].date}</td><td>${dashboard_data[i].dtime}</td><td>${
          dashboard_data[i].atime
        }</td><td>${dashboard_data[i].dstation}</td><td>${dashboard_data[i].astation}</td><td>${
          dashboard_data[i].ticket
        }</td></tr>`
      );
    }
  }
}

function suggestion() {
  $('#suggestion datalist').remove();
  var appending = ``;
  appending += `<datalist id="suggestions">`;
  for (let i = 0; i < auto_list.length; i++) {
    if (auto_list[i].includes($('#username-search').val())) {
      appending += `<option value="${auto_list[i]}">`;
    }
  }
  appending += `</datalist>`;
  $('#suggestion').append(appending);
}
