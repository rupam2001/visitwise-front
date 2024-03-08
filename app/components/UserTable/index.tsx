"user client";

import { User, UserTableProps } from "@/app/types";
import { useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import UserDetail from "../UserDetail";

const UserTable: React.FC<UserTableProps> = ({ userData }) => {
  const [selectedUser, setSelectedUser] = useState<User>();
  const modalRef: React.RefObject<HTMLDialogElement> = useRef(null);

  const onClickDetail = (user: User) => {
    setSelectedUser({ ...user });
    modalRef.current?.showModal();
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="overflow-x-auto p-4 rounded-lg shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
      >
        <table className="table">
          {/* head */}
          <thead
          //   className="bg-purple-500 rounded-lg text-white"
          >
            <tr>
              <th>
                {/* <label>
                  <input type="checkbox" className="checkbox" />
                </label> */}
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {userData.map((user, index) => (
              <tr
                key={index}
                className="rounded-lg hover:shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
              >
                <th>
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox"
                      name={"check_" + user.id}
                    />
                  </label>
                </th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-12">
                        <span>
                          {user.first_name[0].toUpperCase() +
                            user.last_name[0].toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{`${user.first_name} ${user.last_name}`}</div>
                      <div className="text-sm opacity-50">{}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div>{user.email}</div>
                </td>
                <td>
                  {user.role === "ADMIN" && (
                    <div className="text-green-800">{user.role}</div>
                  )}
                  {user.role === "EMPLOYEE" && (
                    <div className="text-blue-600">{user.role}</div>
                  )}
                  {user.role === "SECURITY" && (
                    <div className="text-red-800">{user.role}</div>
                  )}
                </td>
                <th>
                  <button
                    className="btn  btn-sm"
                    onClick={() => onClickDetail(user)}
                  >
                    Details
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
        {userData.length == 0 && (
          <div className="flex justify-center w-full mt-4">
            <span className="text-sm text-gray-500">No data found</span>
          </div>
        )}
      </form>
      <dialog id="my_modal_3" className="modal" ref={modalRef}>
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          {selectedUser && <UserDetail userData={selectedUser} />}
        </div>
      </dialog>
    </div>
  );
};

export default UserTable;
