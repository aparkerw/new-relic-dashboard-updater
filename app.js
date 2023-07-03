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
  
  // for(const account of accounts.slice(2,7)) {
  for(const account of accounts) {
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
    
  
  // add the email channels to our email destination check
  for(const ec of Object.values(notificationChannelProcessor.reporter.emails)) {
    if (!emails[ec.key]) {
      emails[ec.key] = ec.policyIds;
    }
    else {
      emails[ec.key] = emails[ec.key].concat(ec.policyIds);
    }
  }

  // add the user channels to our email destination check
  for(const uc of Object.values(notificationChannelProcessor.reporter.users)) {
    if (!emails[uc.key]) {
      emails[uc.key] = uc.policyIds;
    }
    else {
      emails[uc.key] = emails[uc.key].concat(uc.policyIds);
    }
  }
  
  console.log(emails);

  console.log('\n===============================\n');

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
  
  console.log('\n===============================\n');

  console.log("Orphaned Channels (channels without a policy)");
  console.log(notificationChannelProcessor.reporter.orphans.map((o) => {
    return { name: o.name, type: o.type };
  }));

  console.log('\n===============================\n');

  console.log("User Channels to not migrate");
  console.log(Object.values(notificationChannelProcessor.reporter.users).map((u) => {
    return { name: u.name, email: u.email };
  }));
}

run();