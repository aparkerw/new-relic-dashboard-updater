import "dotenv/config.js";
import NRQLService from "./services/NRQLService.js";
import NerdGraphService from "./services/NerdGraphService.js";
import { MetricNames, SinceTimeRange, SeriesIntervalTimeRange, AggregateFunctions } from "./Variables.js";

const run = async () => {
  let accounts = await NerdGraphService.getAccounts();
  console.log(accounts);

  for(const account of accounts) {
    console.log("Processing reports for account", account.name);
    let accountId = account.id;
    let nrql = NRQLService.getNRQLTimeSeries({ metric: MetricNames.GOLDEN_PAGE_LOAD_SECONDS, since: SinceTimeRange.WEEK, interval: SeriesIntervalTimeRange.DAY });
    let results = await NerdGraphService.runNRQL(nrql, accountId);
    console.log("results", results);
  }
}

run();