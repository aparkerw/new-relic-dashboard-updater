import "dotenv/config.js";
import prompt from 'prompt';
import * as fs from 'fs';
import NerdGraphService from "./services/NerdGraphService.js";
import { MetricNames, SinceTimeRange, SeriesIntervalTimeRange, AggregateFunctions } from "./Variables.js";
import NRQLService from "./services/NRQLService.js";
import DashboardWidget from "./services/DashboardWidget.js";

let oldAccountId = 2255127;
let newAccountId = 3136945;

// const dashboardId = 'MTEzNTg4OHxWSVp8REFTSEJPQVJEfGRhOjM5MDE3ODY'; // B360-Quote-Adam
// const dashboardId = 'Mjk1Mjc2OHxWSVp8REFTSEJPQVJEfGRhOjM5MzM1Njk'; // testing account dashboard
// const dashboardId = 'MzA1ODgxNnxWSVp8REFTSEJPQVJEfGRhOjE0MzA4MjE'; // WLS_Digital_Dashboard https://onenr.io/0oQDK37GDjy
const dashboardId = 'MTEzNTg4OHxWSVp8REFTSEJPQVJEfGRhOjQwMTA2Mzk'; // WLS_Digital_Dashboard-Adam-I https://onenr.io/0qQa5VlxPQ1

const run = async () => {
  let dashboardObj = await loadDashboard(true);
  let updates = await prepareUpdates(dashboardObj);
}

const loadDashboard = async (bPrintJSON = false) => {
  let dashboardObj = await NerdGraphService.getDashboard(dashboardId, bPrintJSON);
  return dashboardObj;
}

const prepareUpdates = async (dashboardObj) => {
  let pages = dashboardObj.pages || [];
  for (let page of pages) {
    console.log(`Processing page: ${page.name} (${page.guid})`);
    await checkWidgetsForUpdate(page.guid, page.widgets);
  }
  return [];
}

const checkWidgetsForUpdate = async (pageGuid, widgets = []) => {
  for (let widget of widgets) {
    const queries = widget.rawConfiguration?.nrqlQueries || [];
    let query = queries[0];
    let accountIds = query?.accountIds || [query?.accountId];
    if (accountIds.includes(oldAccountId)) {
      console.log(`widget needs updating id: ${widget.id}`, accountIds, oldAccountId);
      const {fix} = await prompt.get({
        description: 'would you like to fix (y/n)', 
        type: 'string', 
        validator: /y[es]*|n[o]?/,
        name: 'fix'
      }, ['fix']);
      // console.log('rrr', fix);
      // time to modify this widget 
      if(fix === 'y' || fix === 'yes') {
        const myWidget = new DashboardWidget(dashboardId, pageGuid, widget);
        myWidget.replaceAccount(oldAccountId, newAccountId);
        console.log('----- previous ----');
        console.log(JSON.stringify(widget, null, 2));
        console.log('------- new ------');
        await NerdGraphService.dashboardUpdateWidgetsInPage(myWidget.toUpdateNerdGraph(), true);
      } else {
        console.log('skipping');
      }
    }
  }
}

prompt.start();
run();