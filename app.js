import "dotenv/config.js";
import prompt from 'prompt';
import * as fs from 'fs';
import NerdGraphService from "./services/NerdGraphService.js";
import { MetricNames, SinceTimeRange, SeriesIntervalTimeRange, AggregateFunctions } from "./Variables.js";
import NRQLService from "./services/NRQLService.js";
import DashboardWidget from "./services/DashboardWidget.js";

let oldAccountId = 2255127; // Verizon_VCIT_WLS_PR
let newAccountId = 3136945; // Verizon_VSIT_SOE_PR
// let newAccountId = 3871476; // Verizon_BVIT_BVO6_PR

const dashboardId = process.env.TARGET_DASHBOARD_ID;

const run = async () => {
  let dashboardObj = await loadDashboard(false);
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
      console.log(`\nWidget needs updating id: ${widget.id}  current account Ids: ${accountIds} we found the old accountId: ${oldAccountId}`);
      console.log(`   -- current account Ids: ${accountIds} we found the old accountId: ${oldAccountId}`);
      const {fix} = await prompt.get({
        description: 'would you like to fix (y/n/enter)', 
        type: 'string', 
        validator: /y[es]*|n[o]?/,
        name: 'fix'
      }, ['fix']);
      // console.log('rrr', fix);
      // time to modify this widget 
      if(fix === 'y' || fix === 'yes' || fix === '') {
        const myWidget = new DashboardWidget(dashboardId, pageGuid, widget);
        console.log('----- previous ----');
        console.log(JSON.stringify(widget, null, 2));

        myWidget.replaceAccount(oldAccountId, newAccountId);
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