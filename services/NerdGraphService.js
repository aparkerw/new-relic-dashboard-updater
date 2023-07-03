import axios from "axios";

const headers = () => {
  return {
    "API-Key": process.env.NEW_RELIC_API_KEY,
    "Content-Type": "application/json",
    Accept: 'application/json',
    'Accept-Charset': 'utf-8',
    "Access-Control-Allow-Origin": "http://localhost:3000/",
    "Access-Control-Allow-Methods": "POST",
    "charset": "UTF-8",
  };
}

const runNRQL = async (nrql, accounts) => {
  console.log(nrql);
  var graphql_query = {
    query: `
        {
            actor {
              nrql(query: "${nrql}", accounts: [${accounts.join(', ')}]) {
                results
                totalResult
              }
            }
          }`,
    variables: {}
  }

  var resp;
  resp = await axios.post('https://api.newrelic.com/graphql', graphql_query, {
    headers: headers()
  })
    .catch((e) => {
      console.log('GraphQL Error:', e.message);
    });

  return resp?.data?.data?.actor?.nrql?.results;
}

const getAccounts = async () => {

  var graphql = { query: "{\n  actor {\n    accounts {\n      id\n      name\n    }\n  }\n}", variables: null };

  var resp;
  resp = await axios({
    url: 'https://api.newrelic.com/graphql',
    method: 'post',
    headers: headers(),
    data: graphql
  }).catch((e) => {
    console.log('GraphQL account lookup error:', e.message);
  });

  return resp?.data?.data?.actor?.accounts;
}

const getAlertPolicies = async (accountId) => {

  var graphql = { query: `{\n  actor {\n    account(id: ${accountId}) {\n      alerts {\n        policiesSearch {\n          nextCursor\n          policies {\n            id\n            accountId\n            incidentPreference\n            name\n          }\n        }\n      }\n    }\n  }\n}`, variables: null };

  var resp;
  resp = await axios({
    url: 'https://api.newrelic.com/graphql',
    method: 'post',
    headers: headers(),
    data: graphql
  }).catch((e) => {
    console.log('GraphQL account lookup error:', e.message);
  });

  return resp?.data?.data?.actor?.account?.alerts?.policiesSearch?.policies;
}

const getNotificationChannels = async (accountId, cursor) => {

  var graphql = { query: `{\n  actor {\n    account(id: ${accountId}) {\n      alerts {\n        notificationChannels${cursor ? `(cursor:"${cursor}")` : ''} {\n          nextCursor\n          totalCount\n          channels {\n            id\n            name\n            type\n            associatedPolicies {\n              policies {\n                id\n                name\n              }\n              totalCount\n            }\n          }\n          nextCursor\n        }\n      }\n    }\n  }\n}\n`, variables: null };

  var resp;
  resp = await axios({
    url: 'https://api.newrelic.com/graphql',
    method: 'post',
    headers: headers(),
    data: graphql
  }).catch((e) => {
    console.log('GraphQL account lookup error:', e.message);
  });

  const alerts = resp?.data?.data?.actor?.account?.alerts;
  const notificationChannels = alerts?.notificationChannels;
  const nextCursor = notificationChannels?.nextCursor;

  console.log('next cursor', nextCursor);
  console.log('loaded: ', notificationChannels?.channels.length);
  console.log('total channels', notificationChannels?.totalCount);

  let channels = notificationChannels?.channels || [];

  if (nextCursor) {
    let newChannels = await getNotificationChannels(accountId, nextCursor);
    channels.concat(newChannels);
  }


  return channels;
}






export default { runNRQL, getAccounts, getAlertPolicies, getNotificationChannels };