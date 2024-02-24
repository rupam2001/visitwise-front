"use client";
import { ENDPOINT } from "@/app/constants";
import { NotificationData, User } from "@/app/types";
import { getAuthHeaders } from "@/app/utils";
import Link from "next/link";
import * as React from "react";
export default function Navbar() {
  const [userData, setUserData] = React.useState<User | null>(null);
  const [notification, setNotification] = React.useState<NotificationData[]>(
    []
  );

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

  return (
    <div className="navbar bg-base-100 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li className="p-2">
              <Link href={"/home/invites"}>Homepage</Link>
            </li>

            <li className="p-2">
              <a>About</a>
            </li>
          </ul>
        </div>
        {/* <h1 className="text-slate-600 font-semibold text-3xl">VisitWise</h1> */}
      </div>
      <div className="navbar-center">
        <h1 className="text-slate-600 font-semibold text-3xl">VisitWise</h1>
      </div>
      <div className="navbar-end">
        <button className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
        <div className="dropdown dropdown-bottom dropdown-end">
          {/* <div tabIndex={0} className="btn m-1">Click</div> */}
          <button
            role="button"
            className="btn btn-ghost btn-circle ml-2"
            onClick={onClickNotificationBtn}
          >
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {notification.length != 0 && (
                <span className="badge badge-xs badge-error indicator-item text-white">
                  {notification.length}
                </span>
              )}
            </div>
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-72"
          >
            {notification.map((n) => (
              <li className="">
                <a dangerouslySetInnerHTML={{ __html: n.text }}></a>
              </li>
            ))}
            <div className="btn btn-link no-underline text-center">
              Load all
            </div>
          </ul>
        </div>

        <button
          className="btn btn-ghost btn-circle mx-2 tooltip tooltip-left"
          data-tip={`${userData?.first_name} ${userData?.last_name}`}
        >
          <div className="avatar placeholder ">
            <div className="bg-neutral text-neutral-content rounded-full w-12">
              <span>
                {userData?.first_name[0]}
                {userData?.last_name[0]}
              </span>
            </div>
          </div>
          {/* <ul tabIndex={0} className="menu menu-sm dropdown-content z-[1]">
            <li className="p-2">
              <a>Homepage</a>
            </li>
            <li className="p-2">
              <a>Portfolio</a>
            </li>
            <li className="p-2">
              <a>About</a>
            </li>
          </ul> */}
        </button>
      </div>
    </div>
  );
}
