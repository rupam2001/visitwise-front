"use client";
import AddUser from "@/app/components/AddUser";
import UserTable from "@/app/components/UserTable";
import { ENDPOINT } from "@/app/constants";
import { User } from "@/app/types";
import { getAuthHeaders } from "@/app/utils";
import * as React from "react";
import Organization from "../organization/page";

export default function UsersPage() {
  const [usersData, setUsersData] = React.useState<User[]>([]);
  const loadUsersData = async () => {
    try {
      const res = await fetch(ENDPOINT + "/organization/get_users/", {
        headers: getAuthHeaders(),
        method: "GET",
      }).then((r) => r.json());

      if (res.success) {
        setUsersData(res.data);
        console.log(res);
      } else {
        alert(res.message);
      }
    } catch (error) {
      alert("Something went wrong:(");
      console.error(error);
    }
  };

  React.useEffect(() => {
    loadUsersData();
  }, []);
  return (
    <div>
      <Organization />

      <div className="bg-white mt-2">
        <AddUser
          addUserCallback={() => {
            loadUsersData();
          }}
        />
        <UserTable userData={usersData} />
      </div>
    </div>
  );
}
