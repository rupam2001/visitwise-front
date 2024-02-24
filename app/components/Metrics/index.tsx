import { ENDPOINT } from "@/app/constants";
import { getAuthHeaders } from "@/app/utils";
import moment from "moment";
import * as React from "react";
interface MetricProps {
  start_date: string;
  end_date: string;
}

type MetricsData = {
  total_visits: number;
  total_visitors: number;
  total_walkin_visits: number;
  total_invited_visits: number;
};

const Metrics: React.FC<MetricProps> = ({ start_date, end_date }) => {
  const [metricsData, setMetricsData] = React.useState<MetricsData>();

  const loadData = async () => {
    try {
      const res = await fetch(ENDPOINT + "/analytics/get_metrics/", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ start_date, end_date }),
      }).then((r) => r.json());

      if (res.success) {
        setMetricsData(res.data);
      }
    } catch (error) {}
  };
  React.useEffect(() => {
    loadData();
  }, [start_date, end_date]);

  return (
    <div className="stats stats-vertical lg:stats-horizontal w-full flex justify-center">
      <div className="stat">
        <div className="stat-title">Visits</div>
        <div className="stat-value">{metricsData?.total_visits}</div>
        <div className="stat-desc">
          {moment(start_date).format("ll")} - {moment(end_date).format("ll")}
        </div>
      </div>

      <div className="stat">
        <div className="stat-title">Visitors</div>
        <div className="stat-value">{metricsData?.total_visitors}</div>
        {/* <div className="stat-desc">↗︎ 400 (22%)</div> */}
      </div>

      <div className="stat">
        <div className="stat-title">Walkin Visitors</div>
        <div className="stat-value">{metricsData?.total_walkin_visits}</div>
        {/* <div className="stat-desc">↘︎ 90 (14%)</div> */}
      </div>
      <div className="stat">
        <div className="stat-title">Invited Visitors</div>
        <div className="stat-value">{metricsData?.total_invited_visits}</div>
        {/* <div className="stat-desc">↘︎ 92 (14%)</div> */}
      </div>
    </div>
  );
};
export default Metrics;
