"use client";
import InvitationAction from "@/app/components/InvitationAction";
import InvitationReqAction from "@/app/components/InvitationReqAction";
import { ENDPOINT, INVITATION_STATUS } from "@/app/constants";
import { InvitationPassData } from "@/app/types";
import {
  JSONObject,
  convertUtcToBrowserTime,
  formatDateTime,
  getAuthHeaders,
  getDayStatus,
  getLatestStatus,
} from "@/app/utils";
import moment from "moment";
import Link from "next/link";
import * as React from "react";
import { FaDoorOpen, FaDownload, FaHistory, FaInbox } from "react-icons/fa";
import { FaFire } from "react-icons/fa6";

export default function Invites() {
  const [invitationsUpcomming, setInvitationsUpcomming] = React.useState<
    InvitationPassData[]
  >([]);
  const [invitationRequests, setInvitationRequests] = React.useState<
    InvitationPassData[]
  >([]);
  const [invitationHistories, setInvitationHistories] = React.useState<
    InvitationPassData[]
  >([]);

  const fetchUpcommingInvitations = async () => {
    const res = await fetch(ENDPOINT + "/invitation/get_upcomming/", {
      method: "GET",
      headers: getAuthHeaders(),
    }).then((r) => r.json());
    if (res.success) return res;
  };

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetchUpcommingInvitations();
        if (res.success) {
          setInvitationsUpcomming(res.data);
        }
        const res_history = await fetchHistory();
        if (res_history.success) {
          setInvitationHistories(res_history.data);
        }
        const res_req = await fetchRequests();
        if (res_req.success) {
          setInvitationRequests(res_req.data);
        }
      } catch (error) {}
    })();
  }, []);

  const fetchHistory = async () => {
    const res = await fetch(ENDPOINT + "/invitation/get_history/", {
      method: "GET",
      headers: getAuthHeaders(),
    }).then((r) => r.json());
    if (res.success) return res;
  };
  const fetchRequests = async () => {
    const res = await fetch(ENDPOINT + "/invitation/get_requests/", {
      method: "GET",
      headers: getAuthHeaders(),
    }).then((r) => r.json());
    if (res.success) return res;
  };

  return (
    <div className="p-8">
      <div className="flex w-full justify-end  mb-6">
        <Link href={"/home/invites/create"}>
          <button className="btn bg-primary text-white hover:bg-primary hover:shadow-lg cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Invite
          </button>
        </Link>
      </div>
      <div className="w-full px-32">
        <div className="bg-white min-h-60 mt-4 p-4 rounded-lg shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
          <div className="divider divider-start w-2/3 ">
            <span className="font-light text-purple-700">
              Invitation requests
            </span>
            <FaDownload className="text-purple-700" />
          </div>
          <div className="grid grid-cols-3 grid-flow-row gap-4">
            {invitationRequests.map((iu) => (
              <div className="flex p-4  mr-2 min-w-80 cursor-pointer">
                {/* AVATAR */}
                <div className="avatar placeholder">
                  <div className="bg-neutral text-lg text-neutral-content rounded-full w-24 h-24">
                    <span>
                      {iu["visitor"]["first_name"][0] +
                        " " +
                        iu["visitor"]["last_name"][0]}
                    </span>
                  </div>
                </div>
                {/* Info */}
                <div className="ml-2">
                  <div>
                    {iu.visitor.first_name + " " + iu.visitor.last_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {iu.visitor.email}
                  </div>
                  <div className="text-sm text-blue-600">
                    <span className="text-black">Expected arrival</span>
                    <br />
                    {moment(new Date(iu.valid_from)).format(
                      "MMM Do YYYY, h:mm a"
                    )}
                    {getDayStatus(iu.valid_from) == "today" && (
                      <div className="rounded-xl text-xs p-1 w-fit bg-green-600 text-white">
                        Today
                      </div>
                    )}
                    {getDayStatus(iu.valid_from) == "tomorrow" && (
                      <div className="rounded-xl text-xs p-1 w-fit bg-yellow-600 text-white">
                        Tomorrow
                      </div>
                    )}

                    <InvitationReqAction invitation={iu} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {invitationRequests.length == 0 && (
            <div className="flex w-full h-full items-center justify-center">
              <div className="text-gray-400 text-sm">No requests</div>
            </div>
          )}
        </div>
        <div className="bg-white min-h-60 p-4 mt-4 rounded-lg shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
          <div className="divider divider-start w-2/3 ">
            <span className="font-light text-red-700">Upcoming</span>
            <FaFire className="text-red-600" />
          </div>
          <div className="flex overflow-x-auto">
            {invitationsUpcomming.map((iu) => (
              <div className="flex p-4  mr-2 min-w-80 cursor-pointer">
                {/* AVATAR */}
                <div className="avatar placeholder">
                  <div className="bg-neutral text-lg text-neutral-content rounded-full w-24 h-24">
                    <span>
                      {iu["visitor"]["first_name"][0] +
                        " " +
                        iu["visitor"]["last_name"][0]}
                    </span>
                  </div>
                </div>
                {/* Info */}
                <div className="ml-2">
                  <div>
                    {iu.visitor.first_name + " " + iu.visitor.last_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {iu.visitor.email}
                  </div>
                  <div className="text-sm text-blue-600">
                    <span className="text-black">Expected arrival</span>
                    <br />
                    {moment(new Date(iu.valid_from)).format(
                      "MMM Do YYYY, h:mm a"
                    )}
                    {getDayStatus(iu.valid_from) == "today" && (
                      <div className="rounded-xl text-xs p-1 w-fit bg-green-600 text-white">
                        Today
                      </div>
                    )}
                    {getDayStatus(iu.valid_from) == "tomorrow" && (
                      <div className="rounded-xl text-xs p-1 w-fit bg-yellow-600 text-white">
                        Tomorrow
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white min-h-60 mt-4  p-4 rounded-lg shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
          <div className="divider divider-start w-2/3 text-gray-600">
            <span className="font-light">Invitation history</span>
            <FaHistory />
          </div>
          <div className="grid grid-cols-3 grid-flow-row gap-4">
            {invitationHistories.map((iu) => (
              <div className="flex p-4  mr-2 min-w-80 cursor-pointer">
                {/* AVATAR */}
                <div className="avatar placeholder">
                  <div className="bg-neutral text-lg text-neutral-content rounded-full w-24 h-24">
                    <span>
                      {iu["visitor"]["first_name"][0] +
                        " " +
                        iu["visitor"]["last_name"][0]}
                    </span>
                  </div>
                </div>
                {/* Info */}
                <div className="ml-2">
                  <div>
                    {iu.visitor.first_name + " " + iu.visitor.last_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {iu.visitor.email}
                  </div>
                  <div className="text-sm text-blue-600">
                    <span className="text-black">
                      {getLatestStatus(iu.invitationstatus_set) ==
                        INVITATION_STATUS.CHECKED_OUT && "Visited"}
                      {getLatestStatus(iu.invitationstatus_set) ==
                        INVITATION_STATUS.CHECKED_IN && "In Premise"}
                    </span>
                    <br />
                    {moment(new Date(iu.valid_from)).format(
                      "MMM Do YYYY, h:mm a"
                    )}
                    {getDayStatus(iu.valid_from) == "today" && (
                      <div className="rounded-xl text-xs p-1 w-fit bg-green-600 text-white">
                        Today
                      </div>
                    )}
                    {getDayStatus(iu.valid_from) == "tomorrow" && (
                      <div className="rounded-xl text-xs p-1 w-fit bg-yellow-600 text-white">
                        Tomorrow
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
