
function renderTrows(data, currency) {
  return data.reduce((trow, el) => `${trow}
    <tr id="order_${el.id}">
      <td>${el.transactionId}</td>
      <td class="user_data">
        <a class="toggler" href="#">${el.gender} ${el.fullName}</a>
        <div class="user-details card">
          <div class="card-body">
            ${(el.birthday === '') ? '' : `<p class="card-subtitle mb-2 text-muted text-center">Birthday: ${el.birthday}</p>`}
            <p class="text-center"><img src=${el.avatar} width="100px"></p>
            <p class="card-subtitle mb-2 text-muted text-center">Company:
              <a class="card-link" href=${el.url} target="_blank">
                ${el.title}
              </a>
            </p>
            <p class="card-subtitle text-muted text-center">Industry: ${el.industry}</p>
          </div>
        </div>
      </td>
      <td>${el.orderDate}</td>
      <td class="amount">${Math.round(Number(el.total) * 100 * currency) / 100}</td>
      <td>${el.cardNumber}</td>
      <td>${el.cardType}</td>
      <td>${el.orderCountry} (${el.orderIp})</td>
    </tr>
  `, '');
}

function renderThead(data, currency) {
  return `
  <div class="container-fluid">
    <table class="table table-bordered">
      <thead>
        <tr>
          <th colspan="2">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">Search:</span>
              </div>
              <input type="text" class="form-control search" placeholder="Type smth." aria-label="Username" aria-describedby="basic-addon1">
            </div>
          </th>
          <th>Currency:</th>
          <th>
            <select class="select">
              <option value="USD">USD</option>
            </select>
          </th>
        </tr>
        <tr>
          <th scope="col" data-sort="transactionId">Transaction ID <span class="sorter">&#8595;</span></th>
          <th scope="col" data-sort="fullName">User Info <span class="sorter">&#8595;</span></th>
          <th scope="col" data-sort="orderDate">Order Date <span class="sorter">&#8595;</span></th>
          <th scope="col" data-sort="orderAmount">Order Amount <span class="sorter">&#8595;</span></th>
          <th scope="col">Card Number</th>
          <th scope="col" data-sort="cardType">Card Type <span class="sorter">&#8595;</span></th>
          <th scope="col" data-sort="location">Location <span class="sorter">&#8595;</span></th>
        </tr>
      </thead>
      <tbody>
        ${renderTrows(data, currency)}
      </tbody>
      <tfoot class="tshow">
        <th colspan="7" scope="col" data-sort="transactionId">Statistic :</th>
        <tr>
          <td colspan="3">Orders Count</td>
          <td colspan="4" class="statCount">11</td>
        </tr>
        <tr>
          <td colspan="3">Orders Total</td>
          <td colspan="4" class="statTotal">$ 6722.72</td>
        </tr>
        <tr>
          <td colspan="3">Median Value</td>
          <td colspan="4" class="statMed">$ 593.72</td>
        </tr>
        <tr>
          <td colspan="3">Average Check</td>
          <td colspan="4" class="statAvg">$ 611.16</td>
        </tr>
        <tr>
          <td colspan="3">Average Check (Female)</td>
          <td colspan="4" class="statAvgF">$ 395.18</td>
        </tr>
        <tr>
          <td colspan="3">Average Check (Male)</td>
          <td colspan="4" class="statAvgM">$ 692.15</td>
        </tr>
      </tfoot>
    </table>
  </div>
  `;
}

function renderSelect(arr) {
  return arr.reduce((acc, item) => {
    if (item === 'USD') {
      return `${acc}<option value="${item}" selected>${item}</option>`;
    }
    return `${acc}<option value="${item}">${item}</option>`;
  }, '');
}

export { renderThead, renderTrows, renderSelect };
