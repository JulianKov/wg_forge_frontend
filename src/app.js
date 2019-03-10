import './style.css';
import { generateInfo, calcStat, setStatistic } from './generator';
import { renderThead, renderTrows, renderSelect } from './renderer';

const Info = generateInfo();
let searchInfo = [];
let currency = 1;
let curName = 'USD';
let filter;

function toggleUserInfo(e) {
  e.preventDefault();
  const { target } = e;
  if (document.querySelector('.visible') && target.parentNode.childNodes[3].classList.contains('visible')) {
    target.parentNode.childNodes[3].classList.toggle('visible');
  } else {
    if (document.querySelector('.visible')) {
      document.querySelector('.visible').classList.toggle('visible');
    }
    if (target.classList.contains('toggler')) {
      target.parentNode.childNodes[3].classList.toggle('visible');
    }
  }
}

function search() {
  const value = document.querySelector('.search').value;
  if (value === '') {
    searchInfo = Info.slice(0);
    document.querySelector('tbody').innerHTML = renderTrows(searchInfo.sort(filter), currency);
    setStatistic(calcStat(searchInfo), currency, curName);
    document.querySelector('tfoot').classList.remove('tHide');
  } else {
    searchInfo = Info.filter(el => (
      el.fullName.toLowerCase().indexOf(value) !== -1
                || el.transactionId.toLowerCase().indexOf(value) !== -1
                || el.total.toLowerCase().indexOf(value) !== -1
                || el.cardType.toLowerCase().indexOf(value) !== -1
                || el.orderCountry.toLowerCase().indexOf(value) !== -1
                || el.orderIp.toLowerCase().indexOf(value) !== -1
    ));
    setStatistic(calcStat(searchInfo), currency, curName);
    if (searchInfo.length === 0) {
      document.querySelector('tbody').innerHTML = `
                <tr>
                    <td colspan="7">Nothing found</td>
                </tr>
            `;
      document.querySelector('tfoot').classList.add('tHide');
    } else {
      document.querySelector('tfoot').classList.remove('tHide');
      document.querySelector('tbody').innerHTML = renderTrows(searchInfo.sort(filter), currency);
    }
  }
}

function sort(e) {
  if (e.target.parentNode.getAttribute('data-sort') === 'transactionId') {
    filter = (a, b) => a.transactionId.localeCompare(b.transactionId);
  } else if (e.target.parentNode.getAttribute('data-sort') === 'fullName') {
    filter = (a, b) => (a.fullName).localeCompare(b.fullName);
  } else if (e.target.parentNode.getAttribute('data-sort') === 'orderAmount') {
    filter = (a, b) => a.total - b.total;
  } else if (e.target.parentNode.getAttribute('data-sort') === 'orderDate') {
    filter = (a, b) => Date.parse(a.orderDate) - Date.parse(b.orderDate);
  } else if (e.target.parentNode.getAttribute('data-sort') === 'cardType') {
    filter = (a, b) => a.cardType.localeCompare(b.cardType);
  } else if (e.target.parentNode.getAttribute('data-sort') === 'location') {
    filter = (a, b) => {
      const ipA = a.orderIp.split('.').map((el) => {
        if (el.length === 1) return `00${el}`;
        if (el.length === 2) return `0${el}`;
        return el;
      });
      const ipB = b.orderIp.split('.').map((el) => {
        if (el.length === 1) return `00${el}`;
        if (el.length === 2) return `0${el}`;
        return el;
      });
      return (a.orderCountry + ipA).localeCompare(b.orderCountry + ipB);
    };
  }
  if (document.querySelector('.search').value === '') {
    Info.sort(filter);
    search();
  } else {
    Info.sort(filter);
    search();
  }
}

function changeAmounts(data) {
  curName = document.querySelector('.select').value;
  currency = data[curName];
  Info.sort(filter);
  document.querySelector('tbody').innerHTML = renderTrows(Info, currency);
  search();
}

function setValues(rates) {
  const arr = [];
  for (const key in rates) {
    arr.push(key);
  }
  document.querySelector('.select').innerHTML = renderSelect(arr);
  document.querySelector('.select').onchange = () => { changeAmounts(rates); };
}

function getExchangeRates() {
  fetch('https://api.exchangeratesapi.io/latest?base=USD')
    .then(resp => resp.json())
    .then(data => setValues(data.rates));
}

export default (function a() {
  document.getElementById('app').innerHTML = renderThead(Info, currency);
  document.querySelector('table').onclick = toggleUserInfo;
  document.querySelectorAll('.sorter').forEach((node) => { node.onclick = sort; });
  setStatistic(calcStat(Info), currency, curName);
  document.querySelector('.search').oninput = search;
  getExchangeRates();
}());
