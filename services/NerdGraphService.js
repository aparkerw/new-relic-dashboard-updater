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

const runNRQL = async (nrql, account) => {
  console.log(nrql);
  var graphql_query = {
    query: `
        {
            actor {
              nrql(query: "${nrql}", accounts: ${account}) {
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






export default { runNRQL, getAccounts };