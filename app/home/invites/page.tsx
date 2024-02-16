"use client";
import Link from "next/link";
import * as React from "react";

export default function Invites() {
  return (
    <div>
      <div className="flex w-full justify-end p-4">
        <Link href={"/home/invites/create"}>
          <button className="btn text-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
            Invite
          </button>
        </Link>
      </div>
    </div>
  );
}
