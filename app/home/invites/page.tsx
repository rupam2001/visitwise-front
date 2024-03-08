"use client";
import { ENDPOINT, INVITES_NAME } from "@/app/constants";
import { InvitationPassData } from "@/app/types";
import { getAuthHeaders } from "@/app/utils";
import * as React from "react";
import { useUserContext } from "../context";
import InvitationCard from "@/app/components/InvitationCard";
import Link from "next/link";

export default function Invites() {
  const { loadInvitations, invitations, addLoader, removeLoader, isLoading } =
    useUserContext();

  const [page, setPage] = React.useState(1);
  const [totalPage, setTotalPage] = React.useState(1);

  React.useEffect(() => {
    (async () => {
      try {
        if (invitations.length == 0 || true) {
          const res = await loadInvitations(page);
          setTotalPage(res.extra_data["total_page"]);
        }
      } catch (error) {}
    })();
  }, [page]);
  const onClickPage = async (p: number) => {
    const res = await loadInvitations(p);
    setTotalPage(res.extra_data["total_page"]);
    setPage(p);
  };

  return (
    <div className="drawer drawer-end h-full">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content h-full">
        {/* Page content here */}
        <div className="flex w-full justify-end mb-2 px-4">
          <Link href={"/home/invites/create"}>
            <button className="btn bg-blue-600 hover:bg-blue-600 text-white hover:shadow-lg cursor-pointer">
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
              Invite
            </button>
          </Link>
        </div>
        {isLoading(INVITES_NAME) && (
          <div className="w-full h-full flex justify-center items-center">
            <span className="loading loading-ring loading-lg mb-20"></span>
          </div>
        )}
        <div className="flex flex-wrap">
          {invitations.map((inv, index) => (
            <div key={inv.id} className="m-2 drawer-button">
              <InvitationCard invitation={inv} FooterComponent={null} />
            </div>
          ))}
        </div>
        <div className="join mt-4 mb-10 float-right mr-6">
          {totalPage != 1 &&
            Array.from(Array(totalPage).keys()).map((p, index) => (
              <input
                className="join-item btn btn-square"
                type="radio"
                name="options"
                aria-label={(p + 1).toString()}
                checked={index + 1 == page}
                key={p}
                onClick={() => onClickPage(p + 1)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
