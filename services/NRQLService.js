import { SeriesIntervalTimeRange, SinceTimeRange, AggregateFunctions } from "../Variables.js";

const getNRQL = ({ limit = 5 }) => {
  return `{
    actor {
      nrql(accounts: 1, query: "SELECT * FROM Transaction limit ${limit}") {
        otherResult
        totalResult
        results
      }
    }
  }`;
};

const getAggregate = ({ aggregateFunction = AggregateFunctions.AVERAGE, metric, since = SinceTimeRange.WEEK }) => {
  let NRQL = `SELECT ${aggregateFunction}(\`${metric}\`) FROM Metric SINCE ${since}`;
  return NRQL;
};

const getNRQLTimeSeries = ({ aggregateFunction = AggregateFunctions.AVERAGE, metric, interval = SeriesIntervalTimeRange.DAY, since = SinceTimeRange.WEEK }) => {
  let NRQL = `SELECT ${aggregateFunction}(\`${metric}\`) FROM Metric SINCE ${since} TIMESERIES ${interval}`;
  return NRQL;
};

export default { getNRQL, getAggregate, getNRQLTimeSeries };
