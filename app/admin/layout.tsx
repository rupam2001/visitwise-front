"use client";
import * as React from "react";
import Image from "next/image";
import logo from "../../public/logo_t.png";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { FaUser, FaSchool, FaChartArea } from "react-icons/fa";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <div
      className="min-h-screen min-w-screen flex flex-col bg-white"
      //   style={{ backgroundColor: "#F5F5F5" }}
    >
      <div className="flex flex-col items-start justify-center p-2 pt-4">
        <h1 className="text-slate-600 font-semibold text-4xl">VisitWise</h1>
        <div className="divider"></div>
      </div>
      <div className="flex">
        <div className="min-h-full w-64 p-2">
          <div className="my-2 w-full flex flex-col items-center h-full py-4">
            <Link href={"/admin/organization"} className="w-full">
              <div
                className={`flex items-center rounded-lg ${
                  pathname == "/admin/organization" ? "bg-purple-600" : ""
                } bg-opacity-35 p-2   text-gray-700 font-semibold`}
              >
                <FaSchool
                  className={` ${
                    pathname == "/admin/organization" ? "text-purple-600" : ""
                  } `}
                />
                <span
                  className={` ${
                    pathname == "/admin/organization" ? "text-purple-600" : ""
                  } ml-2 `}
                >
                  Organization
                </span>
              </div>
            </Link>
            <Link href={"/admin/users"} className="w-full mt-4">
              <div
                className={`flex items-center rounded-lg ${
                  pathname == "/admin/users" ? "bg-purple-600" : ""
                } bg-opacity-35 p-2   text-gray-700 font-semibold`}
              >
                <FaUser
                  className={` ${
                    pathname == "/admin/users" ? "text-purple-600" : ""
                  } `}
                />
                <span
                  className={` ${
                    pathname == "/admin/users" ? "text-purple-600" : ""
                  } ml-2 `}
                >
                  Users
                </span>
              </div>
            </Link>
            <Link href={"/admin/analytics"} className="w-full mt-4">
              <div
                className={`flex items-center rounded-lg ${
                  pathname == "/admin/analytics" ? "bg-purple-600" : ""
                } bg-opacity-35 p-2   text-gray-700 font-semibold`}
              >
                <FaChartArea
                  className={` ${
                    pathname == "/admin/analytics" ? "text-purple-600" : ""
                  } `}
                />
                <span
                  className={` ${
                    pathname == "/admin/analytics" ? "text-purple-600" : ""
                  } ml-2 `}
                >
                  Analytics
                </span>
              </div>
            </Link>
          </div>
        </div>
        <div className="flex-1 p-2">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
