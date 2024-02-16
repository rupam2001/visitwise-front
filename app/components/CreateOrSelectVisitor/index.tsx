import { ENDPOINT } from "@/app/constants";
import { VisitorData } from "@/app/types";
import { JSONObject, getAuthHeaders } from "@/app/utils";
import React, { FormEventHandler, useEffect, useState } from "react";
import { FaAddressBook, FaBuilding, FaPhone, FaUser } from "react-icons/fa";

interface PropsIntf {
  onSubmitCallback: FormEventHandler;
  defaultValues: JSONObject;
  onSelectVisiorCallback: (dat: JSONObject) => void;
}

const CreateOrSelectVisitor: React.FC<PropsIntf> = ({
  onSubmitCallback,
  defaultValues,
  onSelectVisiorCallback,
}) => {
  const placeholderVisitors = Array.from({ length: 4 }, (_) => ({
    placeholder: "yes",
  }));

  const [suggestedVisitors, setSuggestedVisitors] = useState<JSONObject[]>([
    ...placeholderVisitors,
  ]);
  const [searchVisitors, setsearchVisitors] = useState<JSONObject[]>([]);

  const getSuggestedVisitors = async () => {
    const res = await fetch(ENDPOINT + "/visitor/suggested/", {
      method: "GET",
      headers: getAuthHeaders(),
    }).then((r) => r.json());
    if (res.success) return res;
  };
  useEffect(() => {
    (async () => {
      try {
        const res = await getSuggestedVisitors();
        if (res.success) {
          setSuggestedVisitors(res.data);
        }
      } catch (error) {}
    })();
  }, []);

  const onClickSelectSuggestedVisitor = (data: JSONObject) => {};
  return (
    <div className="w-full">
      <form
        onSubmit={onSubmitCallback}
        action={"POST"}
        className="w-3/4 flex flex-col items-center"
      >
        <div className="flex w-full justify-center">
          <label className="input input-bordered flex items-center gap-2 grow dropdown dropdown-bottom dropdown-end">
            <FaUser className="w-4 h-4 opacity-70" />

            <input
              type="text"
              className="grow "
              placeholder="Frist Name"
              name="first_name"
              //   tabIndex={0}
              //   role="button"
              defaultValue={defaultValues?.first_name as string}
              autoComplete="none"
            />
            {searchVisitors.length != 0 && (
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <a>Item 1</a>
                </li>
                <li>
                  <a>Item 2</a>
                </li>
              </ul>
            )}
          </label>
          <label className="input input-bordered flex items-center gap-2 ml-4 grow">
            <FaUser className="w-4 h-4 opacity-70" />
            <input
              type="phone"
              className="grow"
              placeholder="Last Name"
              defaultValue={defaultValues?.last_name as string}
              name="last_name"
            />
          </label>
        </div>
        <div className="flex w-full justify-center mt-4">
          <label className="input input-bordered flex items-center gap-2 grow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              type="text"
              className="grow"
              placeholder="Email"
              name="email"
              defaultValue={defaultValues?.email as string}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 ml-4 grow">
            <FaPhone />
            <input
              type="phone"
              className="grow"
              placeholder="Phone no"
              defaultValue={defaultValues?.phone as string}
              name="phone"
            />
          </label>
        </div>
        <div className="flex w-full justify-center mt-4">
          <label className="input input-bordered flex items-center gap-2 grow">
            <FaBuilding className="w-4 h-4 opacity-70" />

            <input
              type="text"
              className="grow"
              placeholder="Company"
              name="company"
              defaultValue={defaultValues?.company as string}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 ml-4 grow">
            <FaAddressBook className="w-4 h-4 opacity-70" />
            <input
              type="phone"
              className="grow"
              placeholder="Address"
              defaultValue={defaultValues?.address as string}
              name="address"
            />
          </label>
        </div>
        <div className=" mt-4 flex w-full">
          <button className="btn text-purple-700" type="submit">
            Next
          </button>
        </div>
      </form>
      <div className="pr-32 mt-8">
        <div className="divider divider-start text-blue-800">
          Suggested visitors{" "}
          <label className="input input-bordered flex items-center gap-2 text-black">
            <input
              type="text"
              className="grow py-1 px-2"
              placeholder="Search"
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
        <div className="flex overflow-x-auto w-2/3  mt-8 p-2">
          {suggestedVisitors.map((sv) => (
            <div
              className="mr-6 flex flex-col items-center p-2 cursor-pointer hover:text-blue-700 "
              onClick={() => {
                if (sv.placeholder == "yes") return;
                onSelectVisiorCallback(sv);
              }}
            >
              <div className="avatar placeholder">
                <div
                  className={` rounded-full w-20 ${
                    sv.placeholder
                      ? "skeleton"
                      : " bg-neutral text-neutral-content"
                  }`}
                >
                  {sv.placeholder != "yes" && (
                    <span className="text-lg">
                      {`${(sv.first_name as string)[0]} ${
                        (sv.last_name as string)[0]
                      }`}
                    </span>
                  )}
                </div>
              </div>
              {!sv.placeholder && (
                <p>{`${sv.first_name as string} ${sv.last_name as string}`}</p>
              )}
              {sv.placeholder && <p className="skeleton h-4 w-12 mt-2"></p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateOrSelectVisitor;