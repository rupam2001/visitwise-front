"use client";
import * as React from "react";
import InvitationTable from "../InvitationTable";
import { InvitationPassData } from "../../types";
import { ENDPOINT } from "../../constants";
import { getAuthHeaders, getTodayDateInUTC } from "../../utils";

export default function SecuritySummaryMainDashboard() {
  const [invitationData, setInvitationData] = React.useState<
    InvitationPassData[]
  >([]);

  React.useEffect(() => {
    loadTodaysData();
  }, []);

  const loadTodaysData = async () => {
    try {
      const res = await fetchInvitationDataByDate(getTodayDateInUTC());
      if (res.success) {
        setInvitationData(res.data);
      } else {
        alert(res.message);
      }
    } catch (error) {
      //   alert("Somthing went wrong");
      console.log(error);
    }
  };

  const fetchInvitationDataByDate = async (date: string) => {
    // date = btoa(date);
    const res = await fetch(ENDPOINT + `/invitation/get_by_date/` + date, {
      headers: getAuthHeaders(),
      method: "GET",
    }).then((r) => r.json());
    return res;
  };

  return (
    <div className="p-4 mt-8 bg-white rounded-lg shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
      <div className="flex">
        <div className="divider divider-start flex-1 mr-4">
          <div className="text-lg font-semibold text-green-600">
            Today's Summary
          </div>
        </div>
        <label className="input input-bordered flex items-center gap-2">
          <input type="text" className="grow" placeholder="Search" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      </div>
      <InvitationTable invitationData={invitationData} />
    </div>
  );
}
