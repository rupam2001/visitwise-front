import { ENDPOINT } from "@/app/constants";
import { useSecurityContext } from "@/app/security/context";
import { InvitationPassData } from "@/app/types";
import { getAuthHeaders } from "@/app/utils";
import * as React from "react";

interface CheckOutProps {
  invitation: InvitationPassData;
  closeModal: () => void;
}

const CheckOut: React.FC<CheckOutProps> = ({ invitation, closeModal }) => {
  const { loadTodaysData } = useSecurityContext();
  const checkout = async () => {
    try {
      const res = await fetch(
        ENDPOINT + "/invitation/" + invitation.id + "/checkout/",
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            checked_out_at: new Date().toISOString(),
          }),
        }
      ).then((r) => r.json());
      if (res.success) {
        await loadTodaysData(); // reloading the enitre data
        closeModal();
      }
    } catch (error) {
      console.error(error);
      alert("Somthing went wrong");
    }
  };
  return (
    <div>
      <div className="flex-1 text-primary text-sm font-semibold">
        {invitation.belongings.length == 1 ? "Carried item" : "Carried items"} (
        {invitation.belongings.length})
      </div>
      <div>
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Name *</th>
              <th>identifier *</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {invitation.belongings.map((item, index) => (
              <tr>
                <th>{index + 1}</th>
                <td>
                  <input
                    className="input input-bordered"
                    placeholder="Name"
                    value={item.name}
                    readOnly={true}
                    // autoFocus={index == belongings.length - 1}
                  />
                </td>
                <td>
                  {" "}
                  <input
                    className="input input-bordered"
                    placeholder="Identifier"
                    value={item.identifier_code}
                    readOnly={true}
                  />
                </td>
                <td>
                  {" "}
                  <input
                    className="input input-bordered"
                    placeholder="Description"
                    value={item.description}
                    readOnly={true}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {invitation.belongings.length < 1 && (
          <div className="flex w-full justify-center mt-4 text-gray-400">
            No items found
          </div>
        )}
        <div className="flex justify-end mt-4">
          <button className="btn btn-neutral" onClick={checkout}>
            Check Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
