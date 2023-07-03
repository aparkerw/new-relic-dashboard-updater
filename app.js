import "dotenv/config.js";
import NRQLService from "./services/NRQLService.js";
import NerdGraphService from "./services/NerdGraphService.js";
import { MetricNames, SinceTimeRange, SeriesIntervalTimeRange, AggregateFunctions } from "./Variables.js";
import notificationChannelProcessor from "./services/reports/notificationChannelProcessor.js";

const run = async () => {
  let accounts = await NerdGraphService.getAccounts();
  console.log(accounts);

  // const emails = { };
  const emails = {};

  for(const account of accounts.slice(3,7)) {
    console.log("Processing reports for account", account.name);
    let accountId = account.id;
    // let policies = await NerdGraphService.getAlertPolicies(accountId);
    // console.log(policies);
    // for(const policy of policies) {
    //   // let policyDetails = await NerdGraphService.getAlertPolicyDetails(accountId, policy.id);
    //   // console.log(policyDetails);
    // }


    await notificationChannelProcessor.run(accountId);
    
  }
    
  
  for(const ec of Object.values(notificationChannelProcessor.reporter.emails)) {
    if (!emails[ec.key]) {
      emails[ec.key] = ec.policyIds;
      console.log('mmmm', emails[ec.key]);
    }
    else {
      console.log('wwwwwww');
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