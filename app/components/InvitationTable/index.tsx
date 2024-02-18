import { INVITATION_STATUS } from "@/app/constants";
import { InvitationPassData, InvitationStatusData } from "@/app/types";
import { getUTCTimestamp, isTime1BeforeTime2 } from "@/app/utils";
import moment from "moment";
import * as React from "react";
import { InvitationActionPorps } from "../InvitationAction";
interface InvitationTableProps {
  invitationData: InvitationPassData[];
  CustomActionComponent: React.ComponentType<InvitationActionPorps>;
}

const InvitationTable: React.FC<InvitationTableProps> = ({
  invitationData,
  CustomActionComponent,
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
                {moment(new Date(invitation.valid_from)).format("h:mm a")}
              </td>
              <td>
                {invitation.checked_in_at
                  ? moment(new Date(invitation.checked_in_at)).format("h:mm a")
                  : isTime1BeforeTime2(
                      invitation.valid_from,
                      new Date().toISOString()
                    )
                  ? "Late arrival"
                  : "Expected arrival"}
              </td>
              <td>
                {invitation.checked_out_at
                  ? moment(new Date(invitation.checked_out_at)).format("h:mm a")
                  : invitation.checked_in_at
                  ? "Currently in premise"
                  : "--"}
              </td>
              <td>
                <CustomActionComponent invitation={invitation} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvitationTable;
