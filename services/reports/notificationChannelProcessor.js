
import NerdGraphService from "../NerdGraphService.js";


class EmailChannel {
  constructor(email, accountId, policies = []) {
    this.email = email;
    this.accountId = accountId;
    this.policies = policies;
  }

  addPolicies(newPolicies) {
    this.policies.concat(newPolicies);
  }

  get policyIds() {
    return this.policies.map(p => p.id);
  }

  get key() {
    return `${this.email} - ${this.accountId}`;
  }
}

class UserChannel {
  constructor(key, accountId, policies = []) {
    let keyParts = key.match(/(.*) <([^>]+)>/);
    this.name = keyParts[1] || key;
    this.email = keyParts[2] || key;
    this.accountId = accountId;
    this.policies = policies;
  }

  addPolicies(newPolicies) {
    this.policies.concat(newPolicies);
  }

  get policyIds() {
    return this.policies.map(p => p.id);
  }

  get key() {
    return `${this.email} - ${this.accountId}`;
  }
}

const reporter = {
  emails: {},
  users: {},
  orphans: []
}

const findAlertEmailsForAccount = async (accountId) => {
  let notificationChannels = await NerdGraphService.getNotificationChannels(accountId) || [];

  // extract all the email channels
  let associatedEmailChannels = notificationChannels.filter(c => c.associatedPolicies.totalCount > 0 && c.type === 'EMAIL');
  console.log('new email channels', associatedEmailChannels.length);
  for(const ec of associatedEmailChannels) {
    let currentEmailChannel = new EmailChannel(ec.name, accountId, ec.associatedPolicies.policies);
    let key = currentEmailChannel.key;

    if(!reporter.emails[key]) {
      reporter.emails[key] = currentEmailChannel;
    }
    reporter.emails[key].addPolicies(currentEmailChannel.policies);
  }

  // extract all the user channels
  let associatedUserChannels = notificationChannels.filter(c => c.associatedPolicies.totalCount > 0 && c.type === 'USER');
  console.log('new user channels', associatedUserChannels.length);
  for(const uc of associatedUserChannels) {
    let currentUserChannel = new UserChannel(uc.name, accountId, uc.associatedPolicies.policies);
    let key = currentUserChannel.key;
    if(!reporter.users[key]) {
      reporter.users[key] = currentUserChannel;
    }
    reporter.users[key].addPolicies(currentUserChannel.policies);
  }

  // identify orphaned channels (without policies)
  reporter.orphans = reporter.orphans.concat(notificationChannels.filter(c => c.associatedPolicies.totalCount === 0));
  
  console.log('email channels', Object.keys(reporter.emails).length);
  console.log('users', Object.keys(reporter.users).length);
  console.log('orphaned channels',reporter.orphans.length);
  console.log('----');

  return reporter;
}

const run = async (accountId) => {
  return await findAlertEmailsForAccount(accountId);
}

export default { run, reporter };
