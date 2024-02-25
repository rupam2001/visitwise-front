import { InvitationPassData } from "@/app/types";
import * as React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  convertToLocalDateFormat,
  convertUtcToBrowserDate,
  convertUtcToBrowserTime,
  getDatesInRange,
  getDatesInRange2,
  getDatesInRange3,
} from "@/app/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
interface TrendChartProps {
  invitationData: InvitationPassData[];
  start_date: string;
  end_date: string;
  title: string;
}

const TrendChart: React.FC<TrendChartProps> = ({
  invitationData,
  start_date,
  end_date,
  title,
}) => {
  //   const labels = [""];

  console.log(start_date, end_date, "start end date");

  const [labels, setLabels] = React.useState<Set<string>>(new Set());
  const [dataPoints, setDataPoints] = React.useState<number[]>([]);

  React.useEffect(() => {
    setLabels((l) => {
      //   return new Set(getDatesInRange(start_date, end_date));
      return new Set(getDatesInRange3(start_date, end_date));
    });
  }, [invitationData, start_date, end_date]);

  React.useEffect(() => {
    setDataPoints((points) => {
      let _points: number[] = [];
      const dates = invitationData.map((inv) =>
        convertUtcToBrowserDate(inv.valid_from)
      );

      console.log(dates, "dates");
      console.log(labels, "labels");
      labels.forEach((l) => {
        _points.push(dates.filter((d) => d == l).length);
      });
      console.log(_points, "points");

      return _points;
    });
  }, [labels]);

  const data = {
    labels: Array.from(labels),
    datasets: [
      {
        fill: true,
        label: "",
        data: dataPoints,
        borderColor: "#c827f5",
        backgroundColor: "#c827f5",
        tension: 0,
      },
    ],
  };
  const [options, setOptions] = React.useState({
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          callback: function (value: any) {
            // Format the y-axis label to remove decimal points
            return value.toFixed(0);
          },
          stepSize: 1,
        },
        grid: {
          display: !false,
        },
      },
      x: {
        display: true,
        grid: {
          display: !false,
        },
        ticks: {
          //   maxRotation: 45, // Set the maximum rotation angle
          //   minRotation: 45, // Set the minimum rotation angle
          fontSize: 5,
          autoSkip: true,
          maxTicksLimit: 10, // Set the maximum number of ticks to display
          callback: function (value: any, index: number, values: any[]) {
            // Custom callback to display labels for every 10th day
            if (index % Math.ceil(dataPoints.length / 2) === 0) {
              return value;
            } else {
              return ""; // Hide the label for other days
            }
          },
        },
      },
    },
  });

  React.useEffect(() => {
    setOptions((op) => {
      let temp = { ...op };
      temp.scales.y.max = Math.max(temp.scales.y.max, Math.max(...dataPoints));
      return temp;
    });
  }, [invitationData]);

  return <Line options={options} data={data} />;
};

export default TrendChart;

function getLastSevenDaysNames(utcDate: Date): string[] {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get the day index of the provided UTC date (0 for Sunday, 1 for Monday, etc.)
  const dayIndex = utcDate.getUTCDay();

  // Calculate the indices for the last seven days in reverse order
  const lastSevenDaysIndices = Array.from(
    { length: 7 },
    (_, i) => (dayIndex - i + 7) % 7
  );

  // Map the indices to the corresponding day names
  const lastSevenDaysNames = lastSevenDaysIndices.map(
    (index) => daysOfWeek[index]
  );

  return lastSevenDaysNames;
}
