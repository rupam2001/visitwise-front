import { ENDPOINT } from "@/app/constants";
import { NotificationData, User } from "@/app/types";
import { getAuthHeaders } from "@/app/utils";
import React from "react";
import { useRouter } from "next/navigation";

export default function UserTab() {
  const [userData, setUserData] = React.useState<User | null>(null);
  const [notification, setNotification] = React.useState<NotificationData[]>(
    []
  );
  const router = useRouter();
  const fetchUserData = async () => {
    try {
      const res = await fetch(ENDPOINT + "/user/me/details/", {
        headers: getAuthHeaders(),
        method: "GET",
      }).then((r) => r.json());

      console.log(res, "response");
      if (res.success) {
        setUserData(res.data);
      }
      return res;
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    fetchUserData();
    fetchNotifications();
  }, []);
  const fetchNotifications = async () => {
    try {
      const res = await fetch(ENDPOINT + "/notification/get_unread/", {
        headers: getAuthHeaders(),
        method: "GET",
      }).then((r) => r.json());

      console.log(res, "response");
      if (res.success) {
        //   setUserData(res.data);
        setNotification(res.data);
      }
      return res;
    } catch (error) {
      console.error(error);
    }
  };
  const onClickNotificationBtn = async () => {
    try {
      const res = await fetch(ENDPOINT + "/notification/mark_as_read/", {
        headers: getAuthHeaders(),
        method: "PATCH",
        body: JSON.stringify({
          notification_ids: notification
            .filter((n) => !n.is_read)
            .map((n) => n.id),
        }),
      }).then((r) => r.json());

      console.log(res, "response mark_as_read");
      if (res.success) {
        await fetchNotifications();
      }
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const onClickLogout = () => {
    router.replace("/");
  };
  return (
    <div className="flex w-full">
      <button className="btn btn-ghost btn-circle mx-2">
        <div className="avatar placeholder ">
          <div className="bg-neutral text-neutral-content rounded-full w-12">
            <span>
              {userData?.first_name[0]}
              {userData?.last_name[0]}
            </span>
          </div>
        </div>
      </button>
      <div>
        <div>{`${userData?.first_name} ${userData?.last_name}`}</div>
        <div className="text-xs">{userData?.email}</div>
        <button className="btn btn-link text-red-700" onClick={onClickLogout}>
          logout
        </button>
      </div>
    </div>
  );
}
