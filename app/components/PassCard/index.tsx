import { JSONObject } from "@/app/utils";
import * as React from "react";

export interface PassDataProps {
  visitor_name: string;
  visitor_email: string;
  date: string;
  time: string;
  visiting_person_name: string;
  purpose: string;
  location: string;
  visiting_person_id: string | null;
}
interface PassCardProps {
  passData: PassDataProps | null | undefined;
  onSubmitCallback: React.FormEventHandler;
  onClickBack: () => void;
}

const PassCard: React.FC<PassCardProps> = ({
  passData,
  onSubmitCallback,
  onClickBack,
}) => {
  return (
    <div>
      <form onSubmit={onSubmitCallback}>
        <div className="mb-4 p-4 w-fit rounded-lg shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
          <div className="">
            <label className=" flex w-full h-full">
              <span
                className="text-blue-600 mr-2 font-semibold w-32  border-gray-300 border-r-2"
                style={{ borderRight: "1px" }}
              >
                Name:
              </span>
              <div className="flex items-center  justify-center ">
                <span>{passData?.visitor_name}</span>
              </div>
            </label>
            <label className=" flex w-full">
              <span
                className="text-blue-600 mr-2 font-semibold w-32  border-gray-300 border-r-2"
                style={{ borderRight: "1px" }}
              >
                Email:
              </span>
              <div>{passData?.visitor_email}</div>
            </label>
            <label className=" flex">
              <span
                className="text-blue-600 mr-2 font-semibold w-32  border-gray-300 border-r-2"
                style={{ borderRight: "1px" }}
              >
                Date:
              </span>
              <div>
                {passData?.date} at arround {passData?.time}
              </div>
            </label>
            <label className=" flex">
              <span
                className="text-blue-600 mr-2 font-semibold w-32  border-gray-300 border-r-2"
                style={{ borderRight: "1px" }}
              >
                Visiting person:
              </span>
              <div>{passData?.visiting_person_name}</div>
            </label>
            <label className=" flex mb-4">
              <span
                className="text-blue-600 mr-2 font-semibold w-32  border-gray-300 border-r-2"
                style={{ borderRight: "1px" }}
              >
                Purpose:
              </span>
              <div>{passData?.purpose}</div>
            </label>
          </div>
        </div>

        <button className="btn mr-2" onClick={() => onClickBack()}>
          Back
        </button>
        <button className="btn text-purple-700" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default PassCard;
