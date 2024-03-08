"use client";
import * as React from "react";
import { useUserContext } from "../context";
import InvitationReqAction from "@/app/components/InvitationReqAction";
import InvitationCard from "@/app/components/InvitationCard";
import { REQUEST_NAME } from "@/app/constants";

export default function RequestPage() {
  const { invitationRequests, loadInvitationRequests, isLoading } =
    useUserContext();
  React.useEffect(() => {
    loadInvitationRequests();
  }, []);

  return (
    <div className=" h-full">
      {/* Page content here */}
      {isLoading(REQUEST_NAME) ? (
        <div className="w-full h-full flex justify-center items-center">
          <span className="loading loading-ring loading-lg mb-20"></span>
        </div>
      ) : (
        <div className="flex flex-wrap">
          {invitationRequests.length == 0 && (
            <div className="w-full h-full flex justify-center items-center text-gray-500">
              You have no pending requests!
            </div>
          )}
          {invitationRequests.map((inv, index) => (
            <div key={index} className="m-2 drawer-button">
              <InvitationCard
                invitation={inv}
                FooterComponent={() => <InvitationReqAction invitation={inv} />}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
