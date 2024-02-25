"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChartArea, FaDownload, FaSchool, FaUser } from "react-icons/fa";
import { FaGear, FaInbox } from "react-icons/fa6";
import UserTab from "../components/UserTab";
import { UserContextProvider, useUserContext } from "./context";
import { useEffect } from "react";
import TopBar from "../components/TopBar";

interface HomeLayoutProps {
  children: React.ReactNode;
}
export default function HomeLayout({ children }: HomeLayoutProps) {
  const pathname = usePathname();

  return (
    <UserContextProvider>
      <div className="h-screen flex" style={{ backgroundColor: "whitesmoke" }}>
        <div className="w-56 px-2 bg-white">
          <div className=" w-full flex flex-col items-center h-full py-4">
            <h1 className="text-blue-500 font-semibold text-3xl">VisitWise</h1>
            <div className="divider"></div>
            <div className="flex-1 w-full h-full">
              <Link href={"/home/requests"} className="w-full mb-4">
                <div
                  className={`flex items-center rounded-lg ${
                    pathname.includes("/home/requests") ? "bg-blue-500" : ""
                  } bg-opacity-35 p-2   text-gray-700 font-semibold`}
                >
                  <FaDownload
                    className={` ${
                      pathname.includes("/home/requests") ? "text-blue-500" : ""
                    } `}
                  />
                  <span
                    className={` ${
                      pathname.includes("/home/requests") ? "text-blue-500" : ""
                    } ml-2 `}
                  >
                    Requests
                  </span>
                </div>
              </Link>
              <Link href={"/home/invites"} className="w-full mt-10">
                <div
                  className={`flex items-center rounded-lg mt-6 ${
                    pathname.includes("/home/invites") ? "bg-blue-500" : ""
                  } bg-opacity-35 p-2   text-gray-700 font-semibold`}
                >
                  <FaUser
                    className={` ${
                      pathname.includes("/home/invites") ? "text-blue-500" : ""
                    } `}
                  />
                  <span
                    className={` ${
                      pathname.includes("/home/invites") ? "text-blue-500" : ""
                    } ml-2 `}
                  >
                    Invites
                  </span>
                </div>
              </Link>
              {/* <Link href={"/home/settings"} className="w-full mt-8">
                <div
                  className={`flex items-center rounded-lg ${
                    pathname == "/home/settings" ? "bg-blue-500" : ""
                  } bg-opacity-35 p-2   text-gray-700 font-semibold`}
                >
                  <FaGear
                    className={` ${
                      pathname.includes("/home/settings") ? "text-blue-500" : ""
                    } `}
                  />
                  <span
                    className={` ${
                      pathname.includes("/home/settings") ? "text-blue-500" : ""
                    } ml-2 `}
                  >
                    Settings
                  </span>
                </div>
              </Link> */}
            </div>
            <div className=" w-full mb-4">
              <div className="divider"></div>
              <UserTab />
            </div>
          </div>
        </div>
        <div className="flex-1 bg-white overflow-y-auto">
          <TopBar />
          <div>{children}</div>
        </div>
      </div>
    </UserContextProvider>
  );
}
