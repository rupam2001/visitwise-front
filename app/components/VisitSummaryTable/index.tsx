import { ENDPOINT } from "@/app/constants";
import {
  JSONObject,
  convertUtcToBrowserTime,
  downloadCsv,
  getAuthHeaders,
  textShortner,
} from "@/app/utils";
import moment from "moment";
import * as React from "react";
import { FaDownload } from "react-icons/fa";

interface SummaryTableProps {
  start_date: string;
  end_date: string;
}

const VisitSummaryTable: React.FC<SummaryTableProps> = ({
  start_date,
  end_date,
}) => {
  const [summaryData, setSummaryData] = React.useState<JSONObject[]>([]);

  const loadData = async () => {
    try {
      const res = await fetch(ENDPOINT + "/analytics/get_summary_table/", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ start_date, end_date }),
      }).then((r) => r.json());

      if (res.success) {
        setSummaryData(res.data);
      }
    } catch (error) {}
  };
  React.useEffect(() => {
    loadData();
  }, [start_date, end_date]);

  return (
    <div>
      <div className="w-full flex items-center">
        <div className="flex-1 flex">
          <h1 className="font-bold mt-2 ml-2 ">Summary Table</h1>
          <span className="text-xs text-gray-500 italic">
            ({moment(start_date).format("ll")} - {moment(end_date).format("ll")}
            )
          </span>
        </div>
        <FaDownload
          className="text-gray-500 mr-4 cursor-pointer hover:text-gray-700 tooltip"
          onClick={() =>
            downloadCsv(
              summaryData,
              `summary_data-${start_date}-to-${end_date}.csv`
            )
          }
          data-tip="Download as csv"
        />
      </div>
      <div className="divider"></div>
      <div className="overflow-x-auto">
        <table className="table text-xs">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Visiting Person</th>
              <th>Visiting Person Email</th>
              <th>Checkin at</th>
              <th>Checked out at</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Purpose</th>
              <th>Feedback</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.map((data, index) => (
              <tr className="hover:bg-gray-50" key={index}>
                <th>{index + 1}</th>
                <th>{data["name"]}</th>
                <th>{data["visiting_person_name"]}</th>
                <th>{data["visting_person_email"]}</th>
                <th>
                  {convertUtcToBrowserTime(data["check_in_at"] as string)}
                </th>
                <th>
                  {convertUtcToBrowserTime(data["check_out_at"] as string)}
                </th>
                <th>{data["email"]}</th>
                <th>{data["phone"]}</th>
                <th>{data["address"]}</th>
                <th className="tooltip" data-tip={data["purpose"]}>
                  {textShortner(data["purpose"] as string, 10)}
                </th>
                <th>{textShortner(data["feedback"] as string, 10)}</th>
                <th>{textShortner(data["rating"] as string)}</th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VisitSummaryTable;
