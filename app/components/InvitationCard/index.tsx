import { INVITATION_STATUS } from "@/app/constants";
import { InvitationPassData } from "@/app/types";
import {
  convertUtcToBrowserDate,
  getLatestStatus,
  textShortner,
} from "@/app/utils";
import moment from "moment";
import * as React from "react";
interface InvitationCardProps {
  invitation: InvitationPassData;
  FooterComponent: React.FC | null;
}

const InvitationCard: React.FC<InvitationCardProps> = ({
  invitation,
  FooterComponent,
}) => {
  return (
    <div className="max-w-xs w-72 cursor-pointer">
      <div className="bg-white hover:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] rounded-lg py-3">
        <div className="photo-wrapper p-2 w-full  flex justify-center">
          <div className="avatar placeholder">
            <div className="bg-neutral text-lg text-neutral-content rounded-full w-24 h-24">
              <span>
                {invitation["visitor"]["first_name"][0] +
                  " " +
                  invitation["visitor"]["last_name"][0]}
              </span>
            </div>
          </div>
        </div>
        <div className="p-2">
          <h3 className="text-center text-xl text-gray-900 font-medium leading-8">
            {invitation["visitor"]["first_name"] +
              " " +
              invitation["visitor"]["last_name"]}
          </h3>
          <div className="text-center text-gray-400 text-xs font-semibold">
            {/* <p>Web Developer</p> */}
          </div>
          <table className="text-xs my-3">
            <tbody>
              <tr>
                <td className="px-2 py-2 text-gray-500 font-semibold">
                  Purpose
                </td>
                <td className="px-2 py-2">
                  {" "}
                  {textShortner(invitation.purpose)}
                </td>
              </tr>
              <tr>
                <td className="px-2 py-2 text-gray-500 font-semibold">
                  Scheduled time:
                </td>
                <td className="px-2 py-2">
                  {moment(
                    convertUtcToBrowserDate(invitation.valid_from)
                  ).format("ll")}
                </td>
              </tr>
              <tr>
                <td className="px-2 py-2 text-gray-500 font-semibold">
                  Status
                </td>
                <td className="px-2 py-2">
                  {getLatestStatus(invitation.invitationstatus_set) ==
                    INVITATION_STATUS.CHECKED_OUT ||
                  getLatestStatus(invitation.invitationstatus_set) ==
                    INVITATION_STATUS.PENDING_REVIEW ? (
                    <span className="text-green-600">Visited</span>
                  ) : (
                    ""
                  )}
                  {getLatestStatus(invitation.invitationstatus_set) ==
                    INVITATION_STATUS.CHECKED_IN && "In Premise"}
                  {getLatestStatus(invitation.invitationstatus_set) ==
                    INVITATION_STATUS.CANCELLED && "Cancelled"}
                  {getLatestStatus(invitation.invitationstatus_set) ==
                    INVITATION_STATUS.READY_FOR_CHECKIN && (
                    <span className="text-yellow-600">Not Visited</span>
                  )}
                  {getLatestStatus(invitation.invitationstatus_set) ==
                    INVITATION_STATUS.PENDING_APPROVAL && (
                    <span className="text-blue-500">Pending approval</span>
                  )}
                  {getLatestStatus(invitation.invitationstatus_set) ==
                    INVITATION_STATUS.REJECTED && (
                    <span className="text-red-500">Rejected</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="text-center my-3">
            {FooterComponent && <FooterComponent />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationCard;
