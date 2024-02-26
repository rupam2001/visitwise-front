import { User } from "@/app/types";
import { convertUtcToBrowserDate, extractFormData } from "@/app/utils";
import moment from "moment";
import * as React from "react";
import { FaRecycle } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
interface UserDetailProps {
  userData: User;
}
const UserDetail: React.FC<UserDetailProps> = ({ userData }) => {
  const [user, setUser] = React.useState(userData);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = extractFormData(e);
    console.log(data);
  };
  return (
    <form onSubmit={onSubmit}>
      <div className="flex  w-full">
        <div className="avatar placeholder">
          <div className="bg-neutral text-2xl text-neutral-content rounded-full w-24">
            <span>
              {userData.first_name[0].toUpperCase() +
                userData.last_name[0].toUpperCase()}
            </span>
          </div>
        </div>
        <div className="ml-2">
          <div className="text-xl font-semibold">
            {userData.first_name + " " + userData.last_name}
          </div>
          <div className="text-gray-500">{userData.email}</div>
          <div className="text-gray-500">
            Created at{" "}
            {moment(convertUtcToBrowserDate(userData.created_at)).format("ll")}
          </div>
        </div>
      </div>
      <div className="flex w-full mt-4">
        <div className="flex w-full">
          <div className="flex-1 font-semibold">Active: </div>
          <input
            type="checkbox"
            className="toggle toggle-info"
            name="active"
            defaultChecked={userData.is_active}
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button className="btn btn-outline">Save</button>
      </div>
    </form>
  );
};

export default UserDetail;
