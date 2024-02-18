import { ENDPOINT, INVITATION_STATUS } from "@/app/constants";
import { useSecurityContext } from "@/app/security/context";
import { Belongings, InvitationPassData } from "@/app/types";
import {
  calculateTimeDifferenceInHours,
  getAuthHeaders,
  getLatestStatus,
  getTodayDateInUTC,
  getUTCTimestamp,
} from "@/app/utils";
import * as React from "react";
import CheckIn from "../CheckIn";
import CheckOut from "../CheckOut";
import moment from "moment";

export interface InvitationActionPorps {
  invitation: InvitationPassData;
}

const InvitationAction: React.FC<InvitationActionPorps> = ({ invitation }) => {
  const modalRef: React.RefObject<HTMLDialogElement> = React.useRef(null);
  const { fetchInvitationDataByDate, setInvitationData, loadTodaysData } =
    useSecurityContext();

  const handleOnClick = () => {
    modalRef.current?.showModal();
  };
  const closeModal = () => {
    modalRef.current?.close();
  };
  const statusToHumanReadableForm = (status: string | null) => {
    switch (status) {
      case INVITATION_STATUS.READY_FOR_CHECKIN:
        return "CHECK IN";

      case INVITATION_STATUS.CHECKED_IN:
        return "CHECK OUT";
      case INVITATION_STATUS.CHECKED_OUT:
        return `CHECK OUT COMPLETED On ${moment(
          new Date(invitation.checked_out_at)
        ).format("MMMM Do YYYY, h:mm a")}  (
            ${calculateTimeDifferenceInHours(
              invitation.checked_in_at,
              invitation.checked_out_at
            ).toFixed(1)}hours )`;
      case INVITATION_STATUS.PENDING_APPROVAL:
        return `APPROVAL IS PENDING`;

      default:
        return "SOMETHING WENT WRONG";
    }
  };

  const [belongings, setBelongings] = React.useState<Belongings[]>([]);

  const onClickAddItem = () => {
    const blankItem: Belongings = {
      name: "",
      description: "",
      identifier_code: "",
    };
    setBelongings((b) => [...b, blankItem]);
  };
  const onClickRemoveItem = (index: number) => {
    setBelongings((item) => {
      let i = [...item];
      i.splice(index, 1);
      return i;
    });
  };
  const checkin = async () => {
    try {
      const res = await fetch(
        ENDPOINT + "/invitation/" + invitation.id + "/checkin/",
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            checked_in_at: new Date().toISOString(),
            belongings: belongings,
          }),
        }
      ).then((r) => r.json());
      if (res.success) {
        alert("Success");
        await loadTodaysData();
        modalRef.current?.close();
      }
    } catch (error) {
      console.error(error);
      alert("Somthing went wrong");
    }
  };

  const onChangeItems = (index: number, value: string, field: string) => {
    setBelongings((item) => {
      let temp_item = [...item];
      if (
        field == "name" ||
        field == "description" ||
        field == "identifier_code"
      ) {
        temp_item[index][field] = value;
      }
      return temp_item;
    });
  };

  return (
    <div>
      {getLatestStatus(invitation.invitationstatus_set) ==
        INVITATION_STATUS.READY_FOR_CHECKIN && (
        <button
          className="btn  btn-sm bg-green-600 text-white hover:bg-green-700"
          onClick={handleOnClick}
        >
          CHECK IN
        </button>
      )}
      {getLatestStatus(invitation.invitationstatus_set) ==
        INVITATION_STATUS.CHECKED_IN && (
        <div
          className="btn  btn-sm bg-red-600 text-white hover:bg-red-600"
          onClick={handleOnClick}
        >
          CHECK OUT
        </div>
      )}
      {getLatestStatus(invitation.invitationstatus_set) ==
        INVITATION_STATUS.CHECKED_OUT && (
        <div
          className="btn  btn-link no-underline text-gray-400"
          onClick={handleOnClick}
        >
          CHECKED OUT
        </div>
      )}
      {getLatestStatus(invitation.invitationstatus_set) ==
        INVITATION_STATUS.PENDING_APPROVAL && (
        <div
          className="btn  btn-link no-underline text-gray-400 text-xs"
          onClick={handleOnClick}
        >
          PENDING APPROVAL
        </div>
      )}
      <dialog id="my_modal_3" className="modal" ref={modalRef}>
        <div className="modal-box  w-11/12 max-w-5xl">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-4">
            {statusToHumanReadableForm(
              getLatestStatus(invitation.invitationstatus_set)
            )}
          </h3>
          {getLatestStatus(invitation.invitationstatus_set) ==
            INVITATION_STATUS.READY_FOR_CHECKIN && (
            <CheckIn invitation={invitation} closeModal={closeModal} />
          )}
          {getLatestStatus(invitation.invitationstatus_set) ==
            INVITATION_STATUS.CHECKED_IN && (
            <CheckOut invitation={invitation} closeModal={closeModal} />
          )}
          {getLatestStatus(invitation.invitationstatus_set) ==
            INVITATION_STATUS.PENDING_APPROVAL && (
            <span className="text-red-600">
              {`${invitation.visiting_person.first_name} ${invitation.visiting_person.last_name}`}{" "}
              has not approved yet.
            </span>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default InvitationAction;
