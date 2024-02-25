import { useUserContext } from "@/app/home/context";
import { convertUtcToBrowserDate, convertUtcToBrowserTime } from "@/app/utils";
import moment from "moment";
import { usePathname } from "next/navigation";
import * as React from "react";

const TopBar = () => {
  const pathname = usePathname();
  const {
    notifications,
    loadNotifications,
    markAsRead,
    oldNotifications,
    loadOldNotifications,
  } = useUserContext();
  React.useEffect(() => {
    loadNotifications();
  }, []);
  return (
    <div className="nav h-20 bg-white p-4 flex">
      <div className="flex-1">
        <label className="input input-bordered flex items-center gap-2 flex-1">
          <input type="text" className="grow" placeholder="Search" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
        {/* <div className="z-10 rounded-lg p-2 bg-white w-full shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] sticky">
          {[].map((item) => (
            <div className="py-4 hover:bg-gray-50">{item}</div>
          ))}
        </div> */}
      </div>

      <div className="dropdown dropdown-bottom dropdown-end">
        {/* <div tabIndex={0} className="btn m-1">Click</div> */}
        <button
          role="button"
          className="btn btn-ghost btn-circle ml-2"
          onClick={markAsRead}
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
            {notifications.length != 0 && (
              <span className="badge badge-xs badge-error indicator-item text-white">
                {notifications.length}
              </span>
            )}
          </div>
        </button>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] bg-base-100 rounded-box w-72"
        >
          {Array.from(new Set([...notifications, ...oldNotifications])).map(
            (n) => (
              <li className=" ">
                <a
                  className="flex flex-col justify-start items-start"
                  dangerouslySetInnerHTML={{
                    __html:
                      n.text +
                      `<span style="color:#1770e6"> ${moment(
                        convertUtcToBrowserDate(n.created_at)
                      ).format("ll")}</span>`,
                  }}
                ></a>
              </li>
            )
          )}
          {oldNotifications.length == 0 && (
            <div
              className="btn btn-link no-underline text-center"
              onClick={loadOldNotifications}
            >
              Load history
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TopBar;
