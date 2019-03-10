import orders from '../../data/orders.json';
import users from '../../data/users.json';
import companies from '../../data/companies.json';

function getDate(timestamp) {
  const time = new Date(+timestamp * 1000);
  return time.toLocaleString('en-US', { hour12: true });
}

function getUserData(userId) {
  return {
    gender: ((users[+userId - 1].gender === 'Male') ? 'Mr.' : 'Ms.'),
    fullName: `${users[+userId - 1].first_name} ${users[+userId - 1].last_name}`,
  };
}

function getCompanyDetail(compId) {
  const { url } = companies[+compId - 1];
  const { title } = companies[+compId - 1];
  const { industry } = companies[+compId - 1];
  return {
    url,
    title,
    industry,
  };
}

function getUserDetails(userId) {
  const birthday = (users[+userId - 1].birthday === null) ? '' : getDate(users[+userId - 1].birthday);
  let url; let title; let
    industry;
  if (users[+userId - 1].company_id !== null) {
    url = getCompanyDetail(users[+userId - 1].company_id).url;
    title = getCompanyDetail(users[+userId - 1].company_id).title;
    industry = getCompanyDetail(users[+userId - 1].company_id).industry;
  }
  return {
    userBirthday: birthday,
    userAvatar: users[+userId - 1].avatar,
    companyUrl: url,
    companyTitle: title,
    companyIndustry: industry,
  };
}

const generateInfo = () => orders.map((order) => {
  const userInfo = getUserData(order.user_id);
  const userData = getUserDetails(order.user_id);
  return {
    id: order.id,
    transactionId: order.transaction_id,
    gender: userInfo.gender,
    fullName: userInfo.fullName,
    birthday: userData.userBirthday,
    avatar: userData.userAvatar,
    url: userData.companyUrl,
    title: userData.companyTitle,
    industry: userData.companyIndustry,
    orderDate: getDate(order.created_at),
    total: order.total,
    cardNumber: order.card_number,
    cardType: order.card_type,
    orderCountry: order.order_country,
    orderIp: order.order_ip,
  };
});

function calcStat(data) {
  if (data.length === 0) {
    return {
      count: 'n/a',
      total: 'n/a',
      median: 'n/a',
      average: 'n/a',
      avgM: 'n/a',
      avgF: 'n/a',
    };
  }
  const totalArr = { male: [], female: [] };
  data.forEach((el) => {
    if (el.gender === 'Mr.') {
      totalArr.male.push(Math.round(Number(el.total) * 100));
    } else {
      totalArr.female.push(Math.round(Number(el.total) * 100));
    }
  });
  let totalM; let totalF; let total; let avgM; let
    avgF;
  if (totalArr.male.length === 0) {
    totalF = totalArr.female.reduce((a, e) => a + e) / 100;
    total = totalF;
    avgF = Math.round(totalF / totalArr.female.length * 100) / 100;
    avgM = 'n/a';
  } else if (totalArr.female.length === 0) {
    totalM = totalArr.male.reduce((a, e) => a + e) / 100;
    total = totalM;
    avgM = Math.round(totalM / totalArr.male.length * 100) / 100;
    avgF = 'n/a';
  } else {
    totalM = totalArr.male.reduce((a, e) => a + e) / 100;
    totalF = totalArr.female.reduce((a, e) => a + e) / 100;
    total = totalM + totalF;
    avgM = Math.round(totalM / totalArr.male.length * 100) / 100;
    avgF = Math.round(totalF / totalArr.female.length * 100) / 100;
  }

  const sortedTotal = (totalArr.male.concat(totalArr.female)).sort((a, b) => a - b);
  const median = (sortedTotal.length % 2 === 0)
    ? ((sortedTotal[(sortedTotal.length) / 2] + sortedTotal[(sortedTotal.length) / 2 - 1]) / 2) / 100 : (sortedTotal[(sortedTotal.length - 1) / 2]) / 100;
  const count = totalArr.male.length + totalArr.female.length;
  const average = Math.round(total / count * 100) / 100;
  return {
    count,
    total,
    median,
    average,
    avgM,
    avgF,
  };
}

function setStatistic(stat, currency, curName) {
  document.querySelector('.statCount').innerHTML = stat.count;
  document.querySelector('.statTotal').innerHTML = `${Math.round(Number(stat.total) * 100 * currency) / 100} ${curName}`;
  document.querySelector('.statMed').innerHTML = `${Math.round(Number(stat.median) * 100 * currency) / 100} ${curName}`;
  document.querySelector('.statAvg').innerHTML = `${Math.round(Number(stat.average) * 100 * currency) / 100} ${curName}`;
  document.querySelector('.statAvgF').innerHTML = `${Math.round(Number(stat.avgF) * 100 * currency) / 100} ${curName}`;
  document.querySelector('.statAvgM').innerHTML = `${Math.round(Number(stat.avgM) * 100 * currency) / 100} ${curName}`;
}

export { generateInfo, calcStat, setStatistic };
