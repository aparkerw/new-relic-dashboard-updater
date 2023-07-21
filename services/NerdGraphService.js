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

const getDashboard = async (dashboardGuid, bPrintJSON = false) => {

  var graphql = { query: 
  `{
    actor {
      entity(guid: "${dashboardGuid}") {
        ... on DashboardEntity {
          name
          permissions
          pages {
            guid
            name
            description
            widgets {
              id
              visualization { id }
              title
              layout { row width height column }
              rawConfiguration
              linkedEntities {
                guid
              }
            }
          }
        }
      }
    }
  }`
  , variables: null };

  var resp;
  resp = await axios({
    url: 'https://api.newrelic.com/graphql',
    method: 'post',
    headers: headers(),
    data: graphql
  }).catch((e) => {
    console.log('GraphQL account lookup error:', e.message);
  })
  if (bPrintJSON) {
    console.log('dashboard', JSON.stringify(resp?.data, null, 2));
  }

  return resp.data?.data?.actor?.entity;
}


const dashboardUpdateWidgetsInPage = async (graphql, bPrintGraphql = false) => {

  if (bPrintGraphql) {
    console.log(graphql);
  }

  axios.interceptors.request.use(request => {
    console.log('Starting Request', JSON.stringify(request, null, 2))
    return request
  })

  var resp = await axios({
    url: 'https://api.newrelic.com/graphql',
    method: 'post',
    headers: headers(),
    data: JSON.stringify({"query": graphql})
  }).catch((e) => {
    console.log('GraphQL dashboard page widget update error:', e.message);
    return false;
  });
  return true;
}


export default { runNRQL, getDashboard, dashboardUpdateWidgetsInPage };