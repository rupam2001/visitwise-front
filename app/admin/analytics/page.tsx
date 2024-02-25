"use client";
import Metrics from "@/app/components/Metrics";
import PieChart from "@/app/components/PieChart";
import TopVisitedPersonChart from "@/app/components/VisitorsByMonthChart";
import TrendChart from "@/app/components/TrendChart";
import { ENDPOINT } from "@/app/constants";
import { InvitationPassData } from "@/app/types";
import {
  convertBroswerToUTC,
  convertUtcToDateString,
  extractFormData,
  getAuthHeaders,
  getRelativeDate,
  getUTCTimestamp,
} from "@/app/utils";
import { FormEvent, useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import VisitSummaryTable from "@/app/components/VisitSummaryTable";

export default function Analytics() {
  const [invitationData, setInvitationData] = useState<InvitationPassData[]>(
    []
  );
  const [timeRange, setTimeRange] = useState({
    end_date: convertUtcToDateString(new Date().toUTCString()),
    start_date: convertUtcToDateString(getRelativeDate(7)),
  });
  const loadInvitationData = async (start_date: string, end_date: string) => {
    try {
      const res = await fetch(ENDPOINT + "/invitation/get_by_date_range/", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ start_date, end_date }),
      }).then((r) => r.json());
      console.log(res.data);
      if (res.success) {
        setInvitationData(res.data);
        console.log(res.data);
      } else {
        // alert("Unable to fetch the data");
      }
    } catch (error) {
      // alert("Somthing went wrong :(");
      console.error(error);
    }
  };
  useEffect(() => {
    loadInvitationData(timeRange.start_date, timeRange.end_date);
  }, [timeRange]);

  const onSubmitFilter = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = extractFormData(event);
    setTimeRange({
      start_date: formData["start_date"],
      end_date: formData["end_date"],
    });
    await loadInvitationData(
      convertBroswerToUTC(formData["start_date"]) as string,
      convertBroswerToUTC(formData["end_date"]) as string
    );
  };

  return (
    <div className=" min-h-screen">
      <div className="w-full flex justify-end p-2">
        <form
          className="flex items-end rounded-lg bg-white p-2 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
          onSubmit={onSubmitFilter}
        >
          <label className=" flex flex-col mr-2">
            <span>Start Date</span>
            <input
              type="date"
              placeholder="start date"
              className="input input-bordered w-full max-w-xs"
              name="start_date"
              defaultValue={timeRange.start_date}
            />
          </label>
          <label className="flex flex-col mr-2">
            <span>End Date</span>
            <input
              type="date"
              placeholder="end date"
              className="input input-bordered w-full max-w-xs"
              name="end_date"
              defaultValue={timeRange.end_date}
            />
          </label>
          <button
            className="btn bg-purple-500 text-white hover:bg-purple-600"
            type="submit"
          >
            Refresh
          </button>
        </form>
      </div>
      <div className="flex h-full w-full flex-col p-2">
        <div className="w-full flex items-center justify-center mb-4 shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] bg-white rounded-lg">
          <Metrics
            start_date={timeRange.start_date}
            end_date={timeRange.end_date}
          />
        </div>
        <div className="flex">
          <div className="max-h-96  p-2 bg-white rounded-lg w-1/2 shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px]">
            <div className="h-14"></div>
            <TrendChart
              invitationData={invitationData}
              start_date={timeRange.start_date}
              end_date={timeRange.end_date}
              title="Visitors by day"
            />
          </div>
          <div className="h-96 w-1/2 flex justify-center shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] bg-white ml-4 rounded-lg p-2">
            <TopVisitedPersonChart
              start_date={timeRange.start_date}
              end_date={timeRange.end_date}
            />
          </div>
        </div>
        <div className="bg-white shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] mt-4 p-2 rounded-lg overflow-auto">
          <VisitSummaryTable
            start_date={timeRange.start_date}
            end_date={timeRange.end_date}
          />
        </div>
      </div>
    </div>
  );
}
