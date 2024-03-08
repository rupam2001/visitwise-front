import React, { useEffect, useState } from "react";
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

  const [currYear, setCurrYear] = useState(generatePastYears()[0]);

  const loadData = async () => {
    try {
      const res = await fetch(ENDPOINT + "/analytics/get_visitors_month/", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ currYear }),
      }).then((r) => r.json());

      if (res.success) {
        setMonthsData(res.data);
      }
    } catch (error) {}
  };
  React.useEffect(() => {
    loadData();
  }, [currYear]);

  const [options, setOptions] = useState({
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
        max: 10,
        ticks: {
          callback: function (value: any) {
            // Format the y-axis label to remove decimal points
            return value.toFixed(0);
          },
          stepSize: 1,
        },
      },
    },
  });

  useEffect(() => {
    const datapoints: number[] = labels.map(
      (month) => monthsData[month] as number
    );
    const maxVal = Math.max(...datapoints);
    setOptions((op) => {
      let temp = { ...op };
      temp["scales"]["x"]["max"] = Math.max(temp["scales"]["x"]["max"], maxVal);
      temp["scales"]["x"]["ticks"]["stepSize"] = Math.floor(
        temp["scales"]["x"]["max"] / 10
      );

      return temp;
    });
  }, [monthsData]);

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

  return (
    <div className="w-full h-full">
      <div className="h-14 flex justify-end">
        <select
          className="select w-fit"
          onChange={(e) => {
            setCurrYear(e.target.value as unknown as number);
          }}
        >
          {generatePastYears().map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </div>
      <Bar options={options} data={data} />
    </div>
  );
};

function generatePastYears() {
  // returns list of all the past years from current year upto a min year
  let curr_year = new Date().getFullYear();
  const min_year = 2023;
  let years = [];
  while (curr_year >= min_year) {
    years.push(curr_year);
    curr_year--;
  }
  return years;
}

export default TopVisitedPersonChart;
