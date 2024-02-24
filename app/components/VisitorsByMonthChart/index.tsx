import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { JSONObject, getAuthHeaders } from "@/app/utils";
import { ENDPOINT } from "@/app/constants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TopVisitedPersonChartProps {
  start_date: string;
  end_date: string;
}
type MonthsData = {
  Jan: number;
  Feb: number;
  Mar: number;
  Apr: number;
  May: number;
  Jun: number;
  Jul: number;
  Aug: number;
  Sep: number;
  Oct: number;
  Nov: number;
  Dec: number;
};

const TopVisitedPersonChart: React.FC<TopVisitedPersonChartProps> = ({
  start_date,
  end_date,
}) => {
  const [monthsData, setMonthsData] = useState<JSONObject>({
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0,
  });

  const loadData = async () => {
    try {
      const res = await fetch(ENDPOINT + "/analytics/get_visitors_month/", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ start_date, end_date }),
      }).then((r) => r.json());

      if (res.success) {
        setMonthsData(res.data);
      }
    } catch (error) {}
  };
  React.useEffect(() => {
    loadData();
  }, [start_date, end_date]);

  const [options, _] = useState({
    indexAxis: "y" as const,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
      title: {
        display: true,
        text: "Visitors by month",
      },
    },
    scales: {
      y: {
        grid: {
          display: !false,
        },
      },
      x: {
        display: true,
        grid: {
          display: !false,
        },
      },
    },
  });

  const labels = Object.keys(monthsData);
  const data = {
    labels,
    datasets: [
      {
        label: "",
        data: labels.map((month) => monthsData[month]),
        borderColor: "#c827f5",
        backgroundColor: "#c827f5",
      },
    ],
  };
  return <Bar options={options} data={data} />;
};

export default TopVisitedPersonChart;
