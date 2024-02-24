"use client";

import { ENDPOINT } from "@/app/constants";
import { getAuthHeaders } from "@/app/utils";
import { FormEvent, useEffect, useRef, useState } from "react";
import { extractFormData, saveAuthToken, getAuthToken } from "../../utils";

interface organizationInf {
  id: string;
  name: string;
  email: string;
  about: string;

  members: [];
}

export default function Organization() {
  const [organizationData, setOrganizationData] =
    useState<organizationInf | null>(null);

  const orgModelRef: React.RefObject<HTMLDialogElement> = useRef(null);

  const fetchOrganizationData = async () => {
    try {
      const res = await fetch(ENDPOINT + "/organization/user_organization/", {
        headers: getAuthHeaders(),
        method: "GET",
      }).then((r) => r.json());

      if (res.success) {
        setOrganizationData(res.data);
        console.log(res);
      } else {
        alert(res.message);
      }
    } catch (error) {
      alert("Something went wrong:(");
      console.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      fetchOrganizationData();
    })();
  }, []);

  //WJEj52utB1azdwS

  const handleSubmitOrg = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = extractFormData(event);
    delete data["name"];
    try {
      const res = await fetch(
        ENDPOINT + "/organization/" + organizationData?.id + "/",
        {
          headers: getAuthHeaders(),
          method: "PATCH",
          body: JSON.stringify(data),
        }
      ).then((r) => r.json());

      if (res.success) {
        setOrganizationData(res.data);
        console.log(res);
      } else {
        alert(res.message);
      }
    } catch (error) {
      alert("Something went wrong:(");
      console.error(error);
    }
  };

  const OrgFormModal = () => (
    <dialog id="org_edit_model" className="modal" ref={orgModelRef}>
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Edit your organization details</h3>
        <form onSubmit={handleSubmitOrg} className="p-4">
          <label
            className="input input-bordered flex items-center gap-2 tooltip"
            data-tip="You can't edit the name"
          >
            <input
              type="text"
              className="grow"
              placeholder=""
              value={organizationData?.name}
              readOnly={true}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 mt-4">
            <input
              type="text"
              className="grow"
              placeholder=""
              defaultValue={organizationData?.email}
              name="email"
            />
          </label>
          <textarea
            className="textarea textarea-bordered mt-4 w-full"
            placeholder="Bio"
            defaultValue={organizationData?.about}
            name="about"
          ></textarea>
          <button className="btn m-2 hover:bg-red-400" type="submit">
            Update
          </button>
        </form>
      </div>
    </dialog>
  );

  return (
    <div className="pt-4">
      <div className=" bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] p-4 rounded-lg">
        <div className="flex items-center">
          <div className="avatar placeholder">
            <div
              className={"bg-neutral text-neutral-content rounded-full w-24"}
            >
              <span className="text-3xl">{organizationData?.name[0]}</span>
            </div>
          </div>
          <div className="flex flex-col ml-4">
            <div className="text-2xl font-semibold  text-slate-800 flex items-center">
              {organizationData?.name}
            </div>
            <div className="text-sm text-gray-500">
              {organizationData?.about}
            </div>
            <button
              className="btn btn-xs mt-4 bg-purple-500 text-white hover:bg-purple-500"
              onClick={() => {
                orgModelRef.current?.showModal();
              }}
            >
              Edit
            </button>
          </div>
          <div className="flex-1"></div>
          <div className="">
            {/* <div className="">{organizationData?.members.length}</div> */}
            {/* <div>
              <span className="countdown font-mono text-4xl">
                <span
                  style={{ "--value": organizationData?.members.length }}
                ></span>
              </span>
              members
            </div> */}
          </div>
          <OrgFormModal />
        </div>
      </div>
    </div>
  );
}
