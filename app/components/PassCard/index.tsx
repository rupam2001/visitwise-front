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
        <label className=" flex">
          <span className="text-blue-600 mr-2">Name:</span>
          <div>{passData?.visitor_name}</div>
        </label>
        <label className=" flex">
          <span className="text-blue-600 mr-2">email:</span>
          <div>{passData?.visitor_email}</div>
        </label>
        <label className=" flex">
          <span className="text-blue-600 mr-2">Date:</span>
          <div>
            {passData?.date} at arround {passData?.time}
          </div>
        </label>
        <label className=" flex">
          <span className="text-blue-600 mr-2">Visiting person:</span>
          <div>{passData?.visiting_person_name}</div>
        </label>
        <label className=" flex mb-4">
          <span className="text-blue-600 mr-2">Purpose:</span>
          <div>{passData?.purpose}</div>
        </label>

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
