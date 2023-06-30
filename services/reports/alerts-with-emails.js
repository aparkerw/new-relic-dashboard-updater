
import NerdGraphService from "../NerdGraphService.js";

const findAlertEmailsForAccount = async (accountId) => {
  let emails = {};
  let notificationChannels = await NerdGraphService.getNotificationChannels(accountId);
  if (notificationChannels) {
    let associatedEmailChannels = notificationChannels.filter(c => c.associatedPolicies.totalCount > 0 && c.type === 'EMAIL');
    
    for(const ec of associatedEmailChannels) {
      if(!emails[ec.name]) {
        emails[ec.name] = [];
      }
      emails[ec.name] = emails[ec.name].concat(ec.associatedPolicies.policies.map(p => p.name));
    }
  }
  return emails;
}

const run = async (accountId) => {
  return await findAlertEmailsForAccount(accountId);
}

export default { run };
