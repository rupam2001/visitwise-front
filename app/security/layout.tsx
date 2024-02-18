"use client";
import { FaX } from "react-icons/fa6";
import Navbar from "../components/Navbar";
import { SecurityContextProvider } from "./context";

interface SecurityLayoutProps {
  children: React.ReactNode;
}
export default function SecurityLayout({ children }: SecurityLayoutProps) {
  return (
    <SecurityContextProvider>
      <div className="min-h-screen " style={{ backgroundColor: "whitesmoke" }}>
        <div className="navbar bg-neutral text-neutral-content p-2">
          <div className="indicator mt-2">
            <span className="indicator-item badge badge-primary text-xs">
              Security
            </span>
            <button className="btn btn-ghost text-3xl grid">VisitWise</button>
          </div>
        </div>

        <div className="p-4">
          <div>{children}</div>
        </div>
      </div>
    </SecurityContextProvider>
  );
}
