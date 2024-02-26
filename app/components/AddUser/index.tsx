"use client";

import { ENDPOINT } from "@/app/constants";
import { extractFormData, getAuthHeaders } from "@/app/utils";
import Link from "next/link";
import { FormEvent, useRef, useState } from "react";

type CallbackFunction = () => void;

interface AddUserProps {
  addUserCallback: CallbackFunction;
}

const AddUser: React.FC<AddUserProps> = ({ addUserCallback }) => {
  const [loading, setIsLoading] = useState<boolean>(false);

  const modelRef: React.RefObject<HTMLDialogElement> = useRef(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    //
    event.preventDefault();

    const data = extractFormData(event);
    console.log(data);
    try {
      //   setIsLoading(true);
      const res = await fetch(ENDPOINT + "/user/create/", {
        headers: getAuthHeaders(),
        method: "POST",
        body: JSON.stringify(data),
      }).then((r) => r.json());

      if (res.success) {
        //
        console.log(res.data);
        alert("User added successfully!");
        formRef.current?.reset();
        addUserCallback();
      }
      //   setIsLoading(false);
    } catch (error) {
      //   setIsLoading(false);
    }
  };
  const FormModal = () => (
    <dialog id="org_edit_model" className="modal" ref={modelRef}>
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Add new User</h3>
        <form
          onSubmit={handleSubmit}
          className="p-4"
          action={"POST"}
          ref={formRef}
        >
          <label className="input input-bordered flex items-center gap-2 tooltip">
            <input
              type="text"
              className="grow"
              placeholder="First Name"
              name="first_name"
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 tooltip mt-2">
            <input
              type="text"
              className="grow"
              placeholder="Last Name"
              name="last_name"
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 mt-2">
            <input
              type="text"
              className="grow"
              placeholder="Email"
              name="email"
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 mt-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="password"
              className="grow"
              name="password"
              placeholder="password"
            />
          </label>
          <span className="text-xs text-blue-500">
            User will be asked to change the password
          </span>
          <div className="flex mt-2">
            <div className="flex-1">
              <label>
                <select className="select max-w-xs" name="role">
                  <option disabled selected>
                    Select the role
                  </option>
                  <option>MEMBER</option>
                  <option>EMPLOYEE</option>

                  <option>SECURITY</option>
                  <option>ADMIN</option>
                </select>
              </label>
            </div>
            <button
              className="btn hover:bg-purple-600 hover:text-white"
              type="submit"
              disabled={loading}
            >
              {loading && <span className="loading loading-spinner"></span>}
              {loading ? "Adding.." : "Add"}
            </button>
          </div>
          <div className="w-full flex flex-col items-end">
            <Link
              href={"/admin/users/csvupload"}
              className="text-green-800 font-semibold text-sm mt-4 cursor-pointer hover:underline"
            >
              Add From CSV?
            </Link>
            <div className="text-xs text-gray-500" onClick={() => {}}>
              (You can upload a csv file containing neccessary user details)
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
  return (
    <div className="rounded-lg p-4">
      <div className="w-full flex justify-end">
        <button
          className="btn bg-purple-600 text-white hover:bg-purple-500"
          onClick={() => {
            modelRef.current?.showModal();
          }}
        >
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
          Add new user
        </button>
        <FormModal />
      </div>
    </div>
  );
};
export default AddUser;
