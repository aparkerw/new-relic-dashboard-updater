import GraphQLConverter from '../helpers/GraphQLConverter.js';

class DashboardWidget {
  constructor(dashboardId, pageId, widgetObj) {
    this.dashboardId = dashboardId;
    this.pageId = pageId;
    this.id = widgetObj.id;
    this.title = widgetObj.title;
    this.rawConfiguration = widgetObj.rawConfiguration;
    this.linkedEntities = widgetObj.linkedEntities;
    this.visualization = widgetObj.visualization;
    if (widgetObj.layout) {
      this.layout = {
        column: widgetObj.layout.column,
        height: widgetObj.layout.height,
        row: widgetObj.layout.row,
        width: widgetObj.layout.width,
      }
    }
  }

  replaceAccount(oldId, newId) {
    const queries = this.rawConfiguration?.nrqlQueries || [];
    for (let query of queries) {
      if (query.accountId === oldId) {
        query.accountId = newId;
      } else if (query.accountIds) {
        const oldIndex = query.accountIds.indexOf(oldId);
        // cut out the old
        query.accountIds.splice(oldIndex, 1);
        const newIndex = query.accountIds.indexOf(newId);
        if(newIndex === -1) {
          // add in the new
          query.accountIds.push(newId);
        } else {
          console.warn('******* new account id already in the array, so no need to add');
          // do nothing
        }
      }
    }
  }

  linkedEntityGuidsForMutation() {
    if (this.linkedEntities) {
      const guidArray = this.linkedEntities.map(e => e.guid);
      return `linkedEntityGuids: ${JSON.stringify(guidArray)}`;
    }
    return 'linkedEntityGuids: null';
  }

  toUpdateNerdGraph() {

    ///mutation {
    ///  dashboardUpdateWidgetsInPage(widgets: {id: "", layout: {column: 0, height: 0, row: 0, width: 0}, title: "", visualization: {id: ""}, rawConfiguration: "", linkedEntityGuids: ["345,5678"]}, guid: "")
    ///}

    return `mutation {
            dashboardUpdateWidgetsInPage(guid: "${this.pageId}", widgets: {
              id: "${this.id}", 
              title: "${this.title}", 
              ${this.linkedEntityGuidsForMutation()}
              layout: { column: ${this.layout.column}, height: ${this.layout.height}, row: ${this.layout.row}, width: ${this.layout.width}},
              rawConfiguration: ${GraphQLConverter.ObjectToGraphQl(this.rawConfiguration)},
              visualization: ${GraphQLConverter.ObjectToGraphQl(this.visualization)}
            }) {
              errors {
                description
                type
              }
            }
          }`;
  }
};

export default DashboardWidget;