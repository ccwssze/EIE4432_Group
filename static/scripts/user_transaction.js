//Sit Hin Kit 21078808d
//Wong Sze Sze 21081046d

var trans_data = [];
var user_info;

$(document).ready(function () {
  $.ajax({ url: '/auth/me', method: 'GET', datatype: 'json' })
    .always(function (response) {
      console.log(response.status);
      switch (response.status) {
        case 401:
          alert('Please login');
          window.location.href = '/login.html';
          break;
        case 'success':
          user_info = response.user;
          console.log(response.user.username);
          break;
        default:
          alert('humm');
          break;
      }
    })
    .then(function () {
      $.ajax({ url: '/trans/userget', type: 'POST', data: { user: user_info.username } })
        .always(function (response) {
          console.log(response);
          switch (response.status) {
            case 'success':
              for (let i = 0; i < response.trans.length; i++) {
                trans_data.push({
                  tdate: response.trans[i].tdate,
                  ttime: response.trans[i].ttime,
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
        <td>${trans_data[i].event}</td>
        <td>${trans_data[i].seats}</td>
        <td>$${trans_data[i].tprice}</td></tr>`
            );
          }
        });
    });
});
