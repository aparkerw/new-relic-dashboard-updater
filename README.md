# WORK IN PROGRESS

**This project is in development and will be changing to provide common cross-account query examples and to make modification for any future use case easer to implement**

# NRQL + Nerdgraph Sample Application

The purpose of this applicaiton is to showcase the ability execute nerdgraph queries accross multiple account that a user is associated with.

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


## Architecture

### NRQL Service

The NRQL service is designed to create various types of NRQL valid queries that fit into defined paradigms.  That way, for example, asking for the timeseries of several metrics can be done with a single function call with a few different perameters.

### NerdGraph Services

The purpose of the nerdgraph service is to call the New Relic Graph APIs with the NRQL from the service above and to format the response for easy use within a dashboard.

