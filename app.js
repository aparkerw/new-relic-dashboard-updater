import "dotenv/config.js";
import NRQLService from "./services/NRQLService.js";
import NerdGraphService from "./services/NerdGraphService.js";
import { MetricNames, SinceTimeRange, SeriesIntervalTimeRange, AggregateFunctions } from "./Variables.js";
import alertsWithEmails from "./services/reports/alerts-with-emails.js";

const run = async () => {
  let accounts = await NerdGraphService.getAccounts();
  console.log(accounts);

  // const emails = { };
  const emails = { 'aaron+prodtest@newrelic.com': [ 'Aaron - NRQL Baselines' ] };

  for(const account of accounts) {
    console.log("Processing reports for account", account.name);
    let accountId = account.id;
    // let policies = await NerdGraphService.getAlertPolicies(accountId);
    // console.log(policies);
    // for(const policy of policies) {
    //   // let policyDetails = await NerdGraphService.getAlertPolicyDetails(accountId, policy.id);
    //   // console.log(policyDetails);
    // }


    let accountAlertEmails = await alertsWithEmails.run(accountId);

    
    let notificationChannels = await NerdGraphService.getNotificationChannels(accountId);
    // console.log(notificationChannels);

    if (notificationChannels) {
      let associatedEmailChannels = notificationChannels.filter(c => c.associatedPolicies.totalCount > 0 && c.type === 'EMAIL');
      
      for(const [key, value] of Object.entries(accountAlertEmails)) {
        if (!emails[key]) {
          emails[key] = value;
        } else {
          emails[key] = emails[key].concat(value);
        }
        
      }
    }
    
  }
    
  console.log(emails);

  // let's output the emails that are on the same policy twice
  console.log("Emails on one policy twice");
  let offenders = [];
  for (const [key, value] of Object.entries(emails)) {
    const duplicates = value.filter((item, index) => value.indexOf(item) !== index);
    if(duplicates.length > 0) {
      offenders.push({ key, duplicates});
    }
  }
  console.log(offenders);
}

run();