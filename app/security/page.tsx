"use client";
import * as React from "react";
import SecuritySummaryMainDashboard from "../components/SecuritySummaryMainDashboard";
import Link from "next/link";
import { BiCollapse } from "react-icons/bi";
import WalkInProcess from "../components/WalkInProcess";
import { useRouter } from "next/navigation";

export default function SecurityPage() {
  const walkinRef: React.RefObject<HTMLDialogElement> = React.useRef(null);

  const router = useRouter();

  return (
    <div className="w-full">
      <div>
        <div className="flex w-full justify-end  mb-6">
          <button
            className="btn bg-blue-600 text-white hover:bg-blue-600 hover:shadow-lg"
            onClick={() => {
              router.push("/security/walkin");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Walk in
          </button>
        </div>
        {/* You can open the modal using document.getElementById('ID').showModal() method */}

        <dialog id="my_modal_3" className="modal w-screen" ref={walkinRef}>
          <div className="modal-box min-w-screen">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>

            <WalkInProcess />
          </div>
        </dialog>
      </div>
      <SecuritySummaryMainDashboard />
    </div>
  );
}
