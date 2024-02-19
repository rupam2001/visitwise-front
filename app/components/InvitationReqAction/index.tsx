import { ENDPOINT, INVITATION_STATUS } from "@/app/constants";
import { InvitationPassData } from "@/app/types";
import { getAuthHeaders } from "@/app/utils";
import * as React from "react";

interface InvitationReqActionProps {
  invitation: InvitationPassData;
}

const InvitationReqAction: React.FC<InvitationReqActionProps> = ({
  invitation,
}) => {
  const modalRef: React.RefObject<HTMLDialogElement> = React.useRef(null);
  const onClickAcceptOrReject = async (type: string) => {
    try {
      const res = await fetch(
        ENDPOINT + `/invitation/${invitation.id}/req_action/`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ action: type }),
        }
      ).then((r) => r.json());
      if (res.success) {
        window.location.reload();
      } else {
        alert(res.message);
      }
    } catch (error) {
      alert("Somthing didn't go well :(");
    }
  };
  return (
    <div className="text-black">
      <div
        className="btn btn-link text-xs p-1 "
        onClick={() => {
          modalRef.current?.showModal();
        }}
      >
        Take action
      </div>
      <dialog id="my_modal_3" className="modal" ref={modalRef}>
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className=" text-lg">
            Take action for{" "}
            <span className="font-bold">
              {`${invitation.visitor.first_name} ${invitation.visitor.last_name}`}
            </span>
          </h3>
          <div className="divider"></div>
          <div className="flex flex-col mt-4">
            <label>
              <span className="font-bold">Ph: </span>
              <span className="ml-2">{invitation.visitor.phone}</span>
            </label>
            <label>
              <span className="font-bold">Purpose:</span>
              <span className="ml-2">{invitation.purpose}</span>
            </label>
            <label>
              <span className="font-bold">Address:</span>
              <span className="ml-2">{invitation.visitor.address}</span>
            </label>
            <label>
              <span className="font-bold">Company:</span>
              <span className="ml-2">{invitation.visitor.company}</span>
            </label>
          </div>
          <div className="w-full flex justify-end mt-4">
            <button
              className="btn  text-green-600 mr-2"
              onClick={() => {
                onClickAcceptOrReject(INVITATION_STATUS.APPROVED);
              }}
            >
              Approve
            </button>
            <button
              className="btn text-red-600"
              onClick={() => {
                onClickAcceptOrReject(INVITATION_STATUS.REJECTED);
              }}
            >
              Reject
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default InvitationReqAction;
