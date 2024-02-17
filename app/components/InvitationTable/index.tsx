import { INVITATION_STATUS } from "@/app/constants";
import { InvitationPassData, InvitationStatusData } from "@/app/types";
import { getUTCTimestamp } from "@/app/utils";
import moment from "moment";
import * as React from "react";
interface InvitationTableProps {
  invitationData: InvitationPassData[];
}

const InvitationTable: React.FC<InvitationTableProps> = ({
  invitationData,
}) => {
  return (
    <div className="">
      <table className="table">
        {/* head */}
        <thead
        //   className="bg-purple-500 rounded-lg text-white"
        >
          <tr>
            <th>Visitor Name</th>
            <th>Visiting person</th>

            <th>Expected at</th>

            <th>Check in</th>
            <th>Check out</th>

            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {invitationData.map((invitation) => (
            <tr className="rounded-lg hover:shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-12">
                      <span>
                        {invitation.visitor.first_name[0].toUpperCase() +
                          invitation.visitor.last_name[0].toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">{`${invitation.visitor.first_name} ${invitation.visitor.last_name}`}</div>
                    <div className="text-sm opacity-50">{}</div>
                  </div>
                </div>
              </td>
              <td>
                <div>
                  {invitation.visiting_person.first_name +
                    " " +
                    invitation.visiting_person.last_name}
                </div>
              </td>
              <td>
                {moment(new Date(invitation.valid_from)).format(
                  "MMM Do YYYY, h:mm a"
                )}
              </td>
              <td>
                {invitation.checked_in_at ? invitation.checked_in_at : "--"}
              </td>
              <td>
                {invitation.checked_out_at ? invitation.checked_out_at : "--"}
              </td>
              <td>
                {getLatestStatus(invitation.invitationstatus_set) ==
                  INVITATION_STATUS.READY_FOR_CHECKIN && (
                  <button className="btn  btn-sm">CHECK IN</button>
                )}
                {getLatestStatus(invitation.invitationstatus_set) ==
                  INVITATION_STATUS.CHECKED_IN && (
                  <div className="btn  btn-sm bg-red-600 text-white">
                    CHECK OUT
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvitationTable;

function getLatestStatus(records: InvitationStatusData[]) {
  if (!records || records.length === 0) {
    return null;
  }

  // Sort records by created_at in descending order
  const sortedRecords = records.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Return the first element (latest record)
  return sortedRecords[0].current_status;
}
