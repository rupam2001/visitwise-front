import { JSONObject } from "@/app/utils";
import * as React from "react";
import { FaCalendar, FaClock } from "react-icons/fa";

interface PropsIntf {
  onSubmitCallback: React.FormEventHandler;
  onClickBack: () => void;
  defaultValues: JSONObject;
}
const InviteDetailInput: React.FC<PropsIntf> = ({
  onSubmitCallback,
  onClickBack,
  defaultValues,
}) => {
  return (
    <div>
      <form onSubmit={onSubmitCallback} action={"POST"} className="w-3/4 ">
        <div className="flex w-full justify-center mt-4">
          <label className="input input-bordered flex items-center gap-2 grow">
            {/* <FaCalendar className="w-4 h-4 opacity-70" /> */}
            <input
              type="date"
              className="grow outline-none"
              placeholder="Date"
              name="date"
              defaultValue={defaultValues?.date as string}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 ml-4 grow">
            {/* <FaClock className="w-4 h-4 opacity-70" /> */}
            <input
              type="time"
              className="grow"
              placeholder="Time"
              defaultValue={defaultValues?.time as string}
              name="time"
            />
          </label>
        </div>
        <div className="flex w-full justify-center mt-4 mb-4">
          <label className="flex items-center gap-2 grow">
            <textarea
              placeholder="Purpose of visit"
              className="textarea textarea-bordered textarea-sm w-full max-w-xs grow "
              name="purpose"
              defaultValue={defaultValues?.purpose as string}
            ></textarea>
          </label>
        </div>
        <button className="btn mr-2" onClick={() => onClickBack()}>
          Back
        </button>

        <button className="btn" type="submit">
          Next
        </button>
      </form>
    </div>
  );
};

export default InviteDetailInput;
