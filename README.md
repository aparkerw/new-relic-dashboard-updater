# NRQL + Nerdgraph Sample Application

The purpose of this applicaiton is to showcase the ability to get NRQL data from Nerdgraph. In a way that is easy to request and consume for common external dashboard use cases.

https://developer.newrelic.com/build-apps/add-nerdgraphquery-guide/



## Pre-Requisited

### Dependencies
After cloning this repository install all the dependant packages by running:

```
npm install
```

### API Key

You will need to obtain a New Relic API key form [https://one.newrelic.com/api-keys](https://one.newrelic.com/api-keys).

That key should be placed into your `.env` file or saved as an environment variable with the name `NEW_RELIC_API_KEY`.  You can copy the template file with the command:

```
cp .env.template .env
```


## Execution

You can run this inline via the command:

```
npm start
```

If you choose to add your key inline instead of via the `.env` file you can run:

```
NEW_RELIC_API_KEY=NRAK-ABCDABCDABCD npm start
```

The results you will see should be an overview of the types of queries and output you can expect from this demonstrative application.

### Web Dashboard Demo 

This demo also includes a sample web dashboard that includes a React frontend and an express backend. This will demonstrate the retrieval and consumption of New Relic data to display a UI.

To start the web server locally on port 3000 you can run:

```
npm run start:frontend
```

To start the api server on port 3001 you can run:

```
npm run start:backend
```

### Output

```JSON
[
  {
    beginTimeSeconds: 1686107700,
    endTimeSeconds: 1686129300,
    'average.newrelic.goldenmetrics.browser.application.pageLoadSeconds': 0.38646153846153847
  },
  {
    beginTimeSeconds: 1686129300,
    endTimeSeconds: 1686150900,
    'average.newrelic.goldenmetrics.browser.application.pageLoadSeconds': 0.46116666666666667
  },
  {
    beginTimeSeconds: 1686150900,
    endTimeSeconds: 1686172500,
    'average.newrelic.goldenmetrics.browser.application.pageLoadSeconds': 0.48193749999999996
  },
  {
    beginTimeSeconds: 1686172500,
    endTimeSeconds: 1686194100,
    'average.newrelic.goldenmetrics.browser.application.pageLoadSeconds': 0.4366428571428571
  },
  {
    beginTimeSeconds: 1686194100,
    endTimeSeconds: 1686215700,
    'average.newrelic.goldenmetrics.browser.application.pageLoadSeconds': 0.3517142857142857
  },
  {
    beginTimeSeconds: 1686215700,
    endTimeSeconds: 1686237300,
    'average.newrelic.goldenmetrics.browser.application.pageLoadSeconds': 0.47259999999999996
  },
  {
    beginTimeSeconds: 1686237300,
    endTimeSeconds: 1686258900,
    'average.newrelic.goldenmetrics.browser.application.pageLoadSeconds': 0.39641666666666664
  },
  {
    beginTimeSeconds: 1686258900,
    endTimeSeconds: 1686280500,
    'average.newrelic.goldenmetrics.browser.application.pageLoadSeconds': 0.5407272727272727
  },
  {
    beginTimeSeconds: 1686280500,
    endTimeSeconds: 1686302100,
    'average.newrelic.goldenmetrics.browser.application.pageLoadSeconds': 0.4658666666666667
  }
]
```

## Architecture

### NRQL Service

The NRQL service is designed to create various types of NRQL valid queries that fit into defined paradigms.  That way, for example, asking for the timeseries of several metrics can be done with a single function call with a few different perameters.

### NerdGraph Services

The purpose of the nerdgraph service is to call the New Relic Graph APIs with the NRQL from the service above and to format the response for easy use within a dashboard.

