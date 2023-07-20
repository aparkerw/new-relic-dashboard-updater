import "dotenv/config.js";
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

/* mutation {
  dashboardUpdateWidgetsInPage(guid: "MTEzNTg4OHxWSVp8REFTSEJPQVJEfDEwODUxMzEw", widgets: {
    id: "161963911", 
    title: "Browser Hits", 
    configuration: {billboard: {nrqlQueries: {accountId: 3136945, query: "SELECT count(*) AS 'Hits' FROM BrowserInteraction where duration IS NOT NULL where appName like 'B2B_Quick_Quote_Prod' Where targetUrl LIKE '%ui/quick-quote/#/%' AND targetUrl  NOT LIKE '%sqa%' AND targetUrl  NOT LIKE '%nsq%' AND targetUrl  NOT LIKE '%prj%' AND targetUrl NOT LIKE '%localhost%'  and targetUrl NOT LIKE '%train%' and targetUrl NOT LIKE '%nssit%' limit max COMPARE WITH 1 day ago"}}},
    layout: {column: 1, height: 2, row: 1, width: 2}
  }) {
    errors {
      description
      type
    }
  }
} */

const run = async () => {
  let dashboardObj = await loadDashboard(true);
  let updates = prepareUpdates(dashboardObj);
}

const loadDashboard = async (bPrintJSON = false) => {
  let dashboardObj = await NerdGraphService.getDashboard(dashboardId, bPrintJSON);
  return dashboardObj;
}

const prepareUpdates = (dashboardObj) => {
  let pages = dashboardObj.pages || [];
  for(let page of pages) {
    console.log(`Processing page: ${page.name} (${page.guid})`);
    checkWidgetsForUpdate(page.guid, page.widgets);
  }
  return [];
}

const checkWidgetsForUpdate = (pageGuid, widgets = []) => {
  for(let widget of widgets ) {
    const queries = widget.rawConfiguration?.nrqlQueries || [];
    let query = queries[0];
    let accountIds = query?.accountIds || [query?.accountId];
    if(accountIds.includes(oldAccountId)) {
      console.log(`widget needs updating id: ${widget.id}`, accountIds, oldAccountId);
      // time to modify this widget 
      const myWidget = new DashboardWidget(dashboardId, pageGuid, widget);
      console.log(myWidget.toUpdateNerdGraph());
    }
  }
}

run();