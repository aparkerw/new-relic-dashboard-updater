# WORK IN PROGRESS

**This project serves as a way to programatically make changes to a dashboard without having to go through the UI**

# Dashboard Editor

This script will load the dashboard provided and will iterate over the pages and widgets.

As a start this script will look for older AccountId values and update those widgets with a new accountId, making the change in place via the NerdGraph endpoints.

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

You will be prompted for each widget change.

If you choose to add your key inline instead of via the `.env` file you can run:

```
NEW_RELIC_API_KEY=NRAK-ABCDABCDABCD npm start
```

