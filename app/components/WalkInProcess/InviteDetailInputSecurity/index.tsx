import { ENDPOINT } from "@/app/constants";
import { JSONObject, getAuthHeaders } from "@/app/utils";
import * as React from "react";
import { FaCalendar, FaClock } from "react-icons/fa";

interface PropsIntf {
  onSubmitCallback: React.FormEventHandler;
  onClickBack: () => void;
  defaultValues: JSONObject;
  onSelectUserCallback: (user: JSONObject) => void;
}
const InviteDetailInputSecurity: React.FC<PropsIntf> = ({
  onSubmitCallback,
  onClickBack,
  defaultValues,
  onSelectUserCallback,
}) => {
  const [users, setUsers] = React.useState<JSONObject[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  React.useEffect(() => {
    console.log(searchQuery);
    if (searchQuery.trim() != "") search();
  }, [searchQuery]);

  const search = async () => {
    try {
      const res = await fetch(ENDPOINT + "/user/me/search/", {
        headers: getAuthHeaders(),
        method: "POST",
        body: JSON.stringify({ query: searchQuery }),
      }).then((r) => r.json());
      if (res.success) {
        setUsers(res.data);
      }
    } catch (error) {}
  };

  return (
    <div className="h-full">
      <form onSubmit={onSubmitCallback} action={"POST"} className="w-3/">
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

        <div className="mt-10 min-h-1/2">
          <div className="divider divider-start text-blue-800">
            Select visiting person{" "}
            <label className="input input-bordered flex items-center gap-2 text-black">
              <input
                type="text"
                className="grow py-1 px-2"
                placeholder="Search"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </div>
          <div className="flex overflow-x-auto w-2/3   p-2">
            <div className="flex overflow-x-auto w-2/3  mt-4 p-2">
              {searchQuery.trim() != "" &&
                users.slice(0, 5).map((user) => (
                  <div
                    className="mr-6 flex flex-col items-center p-1 cursor-pointer hover:text-blue-700 "
                    onClick={() => {
                      if (user.placeholder == "yes") return;
                      onSelectUserCallback(user);
                    }}
                  >
                    <div className="avatar placeholder">
                      <div
                        className={` rounded-full w-20 ${
                          user.placeholder
                            ? "skeleton"
                            : " bg-neutral text-neutral-content"
                        }`}
                      >
                        {user.placeholder != "yes" && (
                          <span className="text-lg">
                            {`${(user.first_name as string)[0]} ${
                              (user.last_name as string)[0]
                            }`}
                          </span>
                        )}
                      </div>
                    </div>
                    {user.placeholder != "yes" && (
                      <p className="w-full  text-sm">
                        {`${user.first_name as string} ${
                          user.last_name as string
                        }`}
                      </p>
                    )}
                    {user.placeholder == "yes" && (
                      <p className="skeleton h-4 w-12 mt-2"></p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="bottom-0">
          <button className="btn mr-2" onClick={() => onClickBack()}>
            Back
          </button>

          <button className="btn" type="submit">
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default InviteDetailInputSecurity;
