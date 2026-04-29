//Sit Hin Kit 21078808d
//Wong Sze Sze 21081046d

var trans_data = [];

$(document).ready(function () {
  $.ajax({ url: '/trans/allget', type: 'POST', data: {} })
    .always(function (response) {
      console.log(response);
      switch (response.status) {
        case 'success':
          for (let i = 0; i < response.trans.length; i++) {
            trans_data.push({
              tdate: response.trans[i].tdate,
              ttime: response.trans[i].ttime,
              user: response.trans[i].user,
              event: response.trans[i].event,
              seats: response.trans[i].seats,
              tprice: response.trans[i].tprice,
            });
          }
          break;
        default:
          alert('Unexpected Error!');
      }
    })
    .then(function () {
      for (let i = 0; i < trans_data.length; i++) {
        $('#table_body2').append(
          `<tr><th>${i + 1}</th>
        <td>${trans_data[i].tdate}</td>
        <td>${trans_data[i].ttime}</td>
        <td>${trans_data[i].user}</td>
        <td>${trans_data[i].event}</td>
        <td>${trans_data[i].seats}</td>
        <td>$${trans_data[i].tprice}</td></tr>`
        );
      }
    });
});
