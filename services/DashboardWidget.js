import { jsonToGraphQLQuery } from 'json-to-graphql-query';

class DashboardWidget {
  constructor(dashboardId, pageId, widgetObj) {
    this.dashboardId = dashboardId;
    this.pageId = pageId;
    this.id = widgetObj.id;
    this.title = widgetObj.title;
    this.rawConfiguration = widgetObj.rawConfiguration;
    this.linkedEntities = widgetObj.linkedEntities;
    if (widgetObj.layout) {
      this.layout = {
        column: widgetObj.layout.column,
        height: widgetObj.layout.height,
        row: widgetObj.layout.row,
        width: widgetObj.layout.width,
      }
    }
  }

  linkedEntityGuidsForMutation() {
    if(this.linkedEntities) {
      const guidArray = this.linkedEntities.map(e => e.guid);
      return `linkedEntityGuids: ${JSON.stringify(guidArray)}`;
    }
    return 'linkedEntityGuids: null';
  }

  toUpdateNerdGraph() {

    // let mutation = {
    //   mutation: {
    //     dashboardUpdateWidgetsInPage: {
    //       _args: {
    //         guid: "MTEzNTg4OHxWSVp8REFTSEJPQVJEfDEwODUxMzEw",
    //         widgets: {
    //           id: "161963911",
    //           title: "Browser Hits",
    //           configuration: { billboard: { nrqlQueries: { accountId: 3136945, query: "SELECT count(*) AS 'Hits' FROM BrowserInteraction where duration IS NOT NULL where appName like 'B2B_Quick_Quote_Prod' Where targetUrl LIKE '%ui/quick-quote/#/%' AND targetUrl  NOT LIKE '%sqa%' AND targetUrl  NOT LIKE '%nsq%' AND targetUrl  NOT LIKE '%prj%' AND targetUrl NOT LIKE '%localhost%'  and targetUrl NOT LIKE '%train%' and targetUrl NOT LIKE '%nssit%' limit max COMPARE WITH 1 day ago" } } },
    //           layout: { column: 1, height: 2, row: 1, width: 2 }
    //         },
    //         errors: {
    //           description: true,
    //           type: true,
    //         }
    //       }
    //     }}};
          return `
          mutation {
            dashboardUpdateWidgetsInPage(guid: "${this.pageId}", widgets: {
              id: "${this.id}", 
              title: "${this.title}", 
              layout: { column: ${this.layout.column}, height: ${this.layout.height}, row: ${this.layout.row}, width: ${this.layout.width}}
              ${this.linkedEntityGuidsForMutation()}
            }) {
              errors {
                description
                type
              }
            }
          `;
          //return jsonToGraphQLQuery(mutation, { pretty: true });
          //return JSON.stringify(this);
        }
      };

      export default DashboardWidget;