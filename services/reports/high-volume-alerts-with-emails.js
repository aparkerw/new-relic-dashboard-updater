
import NerdGraphService from "../NerdGraphService.js";

const findIncidentVolumesForAccount = async (accountId, policyIds) => {

  let nrql = `FROM NrAiIncident SELECT conditionId, conditionName, nrqlEventType, policyId, policyName, tags.policyId, tags.accountId, tags.type  limit 1000 SINCE 24 HOURS AGO WHERE policyId IN (${policyIds.join(', ')})`

  let results = await NerdGraphService.runNRQL(nrql, accountId);
  console.log("Medain", results3);
  
  // return emails;
}

const run = async (accountId, policyIds) => {
  return await findIncidentVolumesForAccount(accountId, policyIds);
}

// query to get incident counts for policies
// FROM NrAiIncident SELECT count(*) FACET policyName limit 100 SINCE 24 HOURS AGO

export default { run };
