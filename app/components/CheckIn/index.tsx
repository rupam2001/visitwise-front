import { ENDPOINT } from "@/app/constants";
import { useSecurityContext } from "@/app/security/context";
import { Belongings, InvitationPassData } from "@/app/types";
import { getAuthHeaders } from "@/app/utils";
import * as React from "react";

export interface CheckInPorps {
  invitation: InvitationPassData;
  closeModal: () => void;
}

const CheckIn: React.FC<CheckInPorps> = ({ invitation, closeModal }) => {
  const [belongings, setBelongings] = React.useState<Belongings[]>([]);
  const { loadTodaysData } = useSecurityContext();

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
        await loadTodaysData(); // reloading the enitre data
        closeModal();
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
      <div className="flex items-center">
        <div className="flex-1 text-primary text-sm font-semibold">
          Carrying items ({belongings.length})
        </div>
        <button className="btn btn-ghost text-primary" onClick={onClickAddItem}>
          + Add
        </button>
      </div>
      <div className="">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Name *</th>
              <th>identifier *</th>
              <th>Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {belongings.map((item, index) => (
              <tr>
                <th>{index + 1}</th>
                <td>
                  <input
                    className="input input-bordered"
                    placeholder="Name"
                    defaultValue={item.name}
                    // autoFocus={index == belongings.length - 1}
                    onChange={(e) =>
                      onChangeItems(index, e.target.value, "name")
                    }
                  />
                </td>
                <td>
                  {" "}
                  <input
                    className="input input-bordered"
                    placeholder="Identifier"
                    defaultValue={item.identifier_code}
                    onChange={(e) =>
                      onChangeItems(index, e.target.value, "identifier_code")
                    }
                  />
                </td>
                <td>
                  {" "}
                  <input
                    className="input input-bordered"
                    placeholder="Description"
                    defaultValue={item.description}
                    onChange={(e) =>
                      onChangeItems(index, e.target.value, "description")
                    }
                  />
                </td>
                <td>
                  <button
                    className="btn  btn-link text-xs"
                    onClick={() => onClickRemoveItem(index)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {belongings.length == 0 && (
          <div className="flex w-full justify-center mt-4 text-gray-400">
            Add carrying items here
          </div>
        )}
        <div className="flex justify-end mt-4">
          <button className="btn btn-neutral" onClick={checkin}>
            Check in
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
