//Sit Hin Kit 21078808d
//Wong Sze Sze 21081046d

var train_data = [];
var duplicated = false;
var dup_index = 0;

$(document).ready(function () {
  $.ajax({ url: '/train/allget', type: 'POST', data: {} }).always(function (response) {
    switch (response.status) {
      case 'success':
        for (let i = 0; i < response.train.length; i++) {
          train_data.push({
            tcode: response.train[i].traincode,
            date: response.train[i].date,
            dtime: response.train[i].dtime,
            atime: response.train[i].atime,
            dstation: response.train[i].dstation,
            astation: response.train[i].astation,
            seat: response.train[i].seat,
          });
        }

        train_data.forEach((item) => {
          $('#train_event').append(
            $('<option>', {
              value: item.tcode + ' ' + item.date,
              text: item.dtime.slice(0, 5) + ' - ' + item.atime.slice(0, 5) + ' / ' + item.date + ' / ' + item.tcode,
            })
          );
        });

        break;
      default:
        alert('Unexpected Error!');
    }
  });
});

function changeimage() {
  const [file] = $('#iconupload').prop('files');
  if (file) {
    $('#train-pic').attr('src', URL.createObjectURL(file)).css('object-fit', 'cover');
  }
  console.log($('#train-pic').attr('src'));
}

function upload_image() {
  var file = document.getElementById('iconupload').files[0];
  var formData = new FormData();
  formData.append('iconfile', file);
  console.log(formData);
  $.ajax({
    url: '/upload',
    type: 'POST',
    contentType: false,
    processData: false,
    cache: false,
    data: formData,
    success: function (res) {
      console.log(res);
      return;
    },
    error: function () {
      console.log('Error: In sending the request!');
      return;
    },
  });
}

function create_event() {
  if ($('#cm_switch').is(':checked')) {
    for (let i = 0; i < train_data.length; i++) {
      if (train_data[i].tcode == $('#code').val() && train_data[i].date == $('#date').val()) {
        duplicated = true;
        dup_index = i;
      }
    }
    if (duplicated) {
      $.ajax({
        url: '/train/update',
        type: 'POST',
        data: {
          traincode: $('#code').val(),
          date: $('#date').val(),
          dtime: $('#depatureTime').val(),
          atime: $('#arrivalTime').val(),
          dstation: $('#departure').val(),
          astation: $('#arrival').val(),
          seat: train_data[dup_index].seat,
          enabled: true,
        },
      })
        .always(function (response) {
          switch (response.status) {
            case 'success':
              alert('success');
          }
        })
        .then(function () {
          window.location.href = '../admin/event_mgt.html';
        });
    } else {
      alert('Event do not exist!');
    }
  } else {
    for (let i = 0; i < train_data.length; i++) {
      if (train_data[i].tcode == $('#code').val() && train_data[i].date == $('#date').val()) {
        duplicated = true;
      }
    }
    if (duplicated) {
      alert('This event already exist!');
    } else {
      $.ajax({
        url: '/train/update',
        type: 'POST',
        data: {
          traincode: $('#code').val(),
          date: $('#date').val(),
          dtime: $('#depatureTime').val(),
          atime: $('#arrivalTime').val(),
          dstation: $('#departure').val(),
          astation: $('#arrival').val(),
          seat: { carts: $('#cart').val(), rowPcart: $('#rowPcart').val(), seatProw: $('#seatProw').val(), taken: [] },
          enabled: true,
        },
      })
        .always(function (response) {
          switch (response.status) {
            case 'success':
              alert('success');
          }
        })
        .then(function () {
          window.location.href = '../admin/event_mgt.html';
        });
    }
  }
}

function cm_switched() {
  if ($('#cm_switch').is(':checked')) {
    $('#cart').prop('disabled', true);
    $('#rowPcart').prop('disabled', true);
    $('#seatProw').prop('disabled', true);
  } else {
    $('#cart').prop('disabled', false);
    $('#rowPcart').prop('disabled', false);
    $('#seatProw').prop('disabled', false);
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

var item_list = [];

function pick_filter() {
  item_list = [];
  if ($('#filterList').val() == 'tcode') {
    train_data.forEach((item) => {
      item_list.push(item.tcode);
    });
  } else if ($('#filterList').val() == 'date') {
    train_data.forEach((item) => {
      item_list.push(item.date);
    });
  } else if ($('#filterList').val() == 'dtime') {
    train_data.forEach((item) => {
      item_list.push(item.dtime);
    });
  } else if ($('#filterList').val() == 'atime') {
    train_data.forEach((item) => {
      item_list.push(item.atime);
    });
  } else if ($('#filterList').val() == 'dstation') {
    train_data.forEach((item) => {
      item_list.push(item.dstation);
    });
  } else if ($('#filterList').val() == 'astation') {
    train_data.forEach((item) => {
      item_list.push(item.astation);
    });
  } else if ($('#filterList').val() == '') {
    $('#train_event option').remove();
    train_data.forEach((item) => {
      $('#train_event').append(
        $('<option>', {
          value: item.tcode + ' ' + item.date,
          text: item.dtime.slice(0, 5) + ' - ' + item.atime.slice(0, 5) + ' / ' + item.date + ' / ' + item.tcode,
        })
      );
    });
    item_list = [];
  }

  item_list = unique_array(item_list);
  console.log(item_list);
  $('#listitem option').remove();
  $('#listitem').append(
    $('<option>', {
      value: '',
      text: '',
    })
  );
  for (let i = 0; i < item_list.length; i++) {
    $('#listitem').append(
      $('<option>', {
        value: item_list[i],
        text: item_list[i],
      })
    );
  }
}

var option_list = [];

function pick_item() {
  $('#train_event option').remove();
  if ($('#filterList').val() == 'tcode') {
    train_data.forEach((item) => {
      if ($('#listitem').val() == item.tcode) {
        $('#train_event').append(
          $('<option>', {
            value: item.tcode + ' ' + item.date,
            text: item.dtime.slice(0, 5) + ' - ' + item.atime.slice(0, 5) + ' / ' + item.date + ' / ' + item.tcode,
          })
        );
      }
    });
  } else if ($('#filterList').val() == 'date') {
    train_data.forEach((item) => {
      if ($('#listitem').val() == item.date) {
        $('#train_event').append(
          $('<option>', {
            value: item.tcode + ' ' + item.date,
            text: item.dtime.slice(0, 5) + ' - ' + item.atime.slice(0, 5) + ' / ' + item.date + ' / ' + item.tcode,
          })
        );
      }
    });
  } else if ($('#filterList').val() == 'dtime') {
    train_data.forEach((item) => {
      if ($('#listitem').val() == item.dtime) {
        $('#train_event').append(
          $('<option>', {
            value: item.tcode + ' ' + item.date,
            text: item.dtime.slice(0, 5) + ' - ' + item.atime.slice(0, 5) + ' / ' + item.date + ' / ' + item.tcode,
          })
        );
      }
    });
  } else if ($('#filterList').val() == 'atime') {
    train_data.forEach((item) => {
      if ($('#listitem').val() == item.atime) {
        $('#train_event').append(
          $('<option>', {
            value: item.tcode + ' ' + item.date,
            text: item.dtime.slice(0, 5) + ' - ' + item.atime.slice(0, 5) + ' / ' + item.date + ' / ' + item.tcode,
          })
        );
      }
    });
  } else if ($('#filterList').val() == 'dstation') {
    train_data.forEach((item) => {
      if ($('#listitem').val() == item.dstation) {
        $('#train_event').append(
          $('<option>', {
            value: item.tcode + ' ' + item.date,
            text: item.dtime.slice(0, 5) + ' - ' + item.atime.slice(0, 5) + ' / ' + item.date + ' / ' + item.tcode,
          })
        );
      }
    });
  } else if ($('#filterList').val() == 'astation') {
    train_data.forEach((item) => {
      if ($('#listitem').val() == item.astation) {
        $('#train_event').append(
          $('<option>', {
            value: item.tcode + ' ' + item.date,
            text: item.dtime.slice(0, 5) + ' - ' + item.atime.slice(0, 5) + ' / ' + item.date + ' / ' + item.tcode,
          })
        );
      }
    });
  }
}

function reschedule() {
  var selected_tcode = $('#train_event').val().slice(0, 5);
  var selected_date = $('#train_event').val().slice(6, 16);
  var new_date = $('#new_date').val();
  var new_dtime = $('#new_dtime').val();
  var new_atime = $('#new_atime').val();
  $.ajax({
    url: '/train/reschedule',
    type: 'POST',
    data: { tcode: selected_tcode, o_date: selected_date, n_date: new_date, dtime: new_dtime, atime: new_atime },
  })
    .always(function (response) {})
    .then(function () {
      window.location.href = '../admin/event_mgt.html';
    });
}

function cancel() {
  var selected_tcode = $('#train_event').val().slice(0, 5);
  var selected_date = $('#train_event').val().slice(6, 16);
  console.log(selected_tcode);
  console.log(selected_date);
  $.ajax({ url: '/train/cancel', type: 'POST', data: { tcode: selected_tcode, date: selected_date } })
    .always(function (response) {})
    .then(function () {
      window.location.href = '../admin/event_mgt.html';
    });
}
