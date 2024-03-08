"use client";
import * as React from "react";
import InvitationTable from "../InvitationTable";
import { InvitationPassData } from "../../types";
import { ENDPOINT, INVITATION_STATUS } from "../../constants";
import {
  getAuthHeaders,
  getLatestStatus,
  getTodayDateInUTC,
} from "../../utils";
import InvitationAction from "../InvitationAction";
import { useSecurityContext } from "@/app/security/context";

export default function SecuritySummaryMainDashboard() {
  const { invitationData, setInvitationData, fetchInvitationDataByDate } =
    useSecurityContext();

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
  const [localInvitationData, setLocalInvitationData] = React.useState<
    InvitationPassData[]
  >([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    if (searchQuery != "" || currentFilter == "All")
      setLocalInvitationData(invitationData);
  }, [invitationData]);

  React.useEffect(() => {
    if (searchQuery.trim() === "") {
      //reset
      if (currentFilter === "All") setLocalInvitationData(invitationData);
      else applyFilter(currentFilter);
    }
    setLocalInvitationData((data) => {
      let temp = [...data];
      temp = temp.filter((d) =>
        (d.visitor.first_name + d.visitor.last_name)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      return temp;
    });
  }, [searchQuery]);

  const [currentFilter, setCurrentFilter] = React.useState("All");

  React.useEffect(() => {
    applyFilter(currentFilter);
  }, [currentFilter]);

  const applyFilter = (filter: string) => {
    if (filter === "") return;
    if (filter == "In premise") {
      setLocalInvitationData((data) => {
        return invitationData.filter(
          (i) =>
            getLatestStatus(i.invitationstatus_set) ===
            INVITATION_STATUS.CHECKED_IN
        );
      });
    } else if (filter == "All") {
      setLocalInvitationData(invitationData);
    } else if (filter == "Checkout completed") {
      setLocalInvitationData((data) =>
        invitationData.filter(
          (i) =>
            getLatestStatus(i.invitationstatus_set) ===
            INVITATION_STATUS.CHECKED_OUT
        )
      );
    } else if (filter == "Yet to come") {
      setLocalInvitationData(
        invitationData.filter(
          (data) =>
            getLatestStatus(data.invitationstatus_set) ===
            INVITATION_STATUS.READY_FOR_CHECKIN
        )
      );
    } else if (filter == "Pending approval") {
      setLocalInvitationData(
        invitationData.filter(
          (data) =>
            getLatestStatus(data.invitationstatus_set) ===
            INVITATION_STATUS.PENDING_APPROVAL
        )
      );
    }
  };

  return (
    <div className="p-4 mt-8 bg-white rounded-lg shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
      <div className="flex">
        <div className="divider divider-start flex-1 mr-4">
          <div className="text-lg font-semibold text-green-600">
            {"Today's Summary"}
          </div>
        </div>
        <select
          className="select select-ghost w-fit mr-2"
          onChange={(e) => setCurrentFilter(e.target.value)}
        >
          <option selected>All</option>
          <option className="text-red-300">In premise</option>
          <option>Yet to come</option>
          <option>Checkout completed</option>
          <option>Pending approval</option>
        </select>
        <label
          className={`input input-bordered flex items-center focus:outline-none focus:ring-0  gap-2 ${
            searchQuery.trim() != "" ? "input-error" : ""
          }`}
        >
          <input
            type="text"
            className="grow"
            placeholder="Search"
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
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
      <InvitationTable
        invitationData={localInvitationData}
        CustomActionComponent={InvitationAction}
      />
    </div>
  );
}
