import {
  JSONObject,
  extractFormData,
  getAuthHeaders,
  getUTCTimestamp,
  hasEmptyFields,
} from "@/app/utils";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import PassCard, { PassDataProps } from "../PassCard";
import { ENDPOINT } from "@/app/constants";
import CreateOrSelectVisitor from "../CreateOrSelectVisitor";
import InviteDetailInput from "../InviteDetails";
import InviteDetailInputSecurity from "./InviteDetailInputSecurity";

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};
function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export default function WalkInProcess() {
  const router = useRouter();
  const [visitorData, setVisitorData] = React.useState<JSONObject>({});
  const [inviteData, setInviteData] = React.useState<JSONObject>({
    date: getCurrentDate(),
    time: getCurrentTime(),
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setInviteData((iv) => ({ ...iv, time: getCurrentTime() }));
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  const [passData, setPassData] = React.useState<PassDataProps | null>();
  const [isSelectVisitor, setIsSelectVisitor] = React.useState(false);
  const stepsList = [
    {
      title: "Create or select visitor",
      isCompeted: false,
    },
    {
      title: "Fill in the detials",
      isCompeted: false,
    },
    {
      title: "Review",
      isCompeted: false,
    },
    {
      title: "Done!",
      isCompeted: false,
    },
  ];

  const reset = () => {
    setVisitorData({});
    setInviteData({});
    setPassData(null);
    setCurrentStep(0);
    setStepInfo(stepsList);
  };

  const handleCreateOrSelectFormSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const data = extractFormData(event);
    if (hasEmptyFields(data)) {
      return;
    }
    console.log(data);
    setVisitorData((v) => data);
    nextStep();
  };

  const [currentStep, setCurrentStep] = React.useState(0);

  const nextStep = () => {
    if (currentStep == 3) return;
    let steps = [...stepInfo];
    steps[currentStep].isCompeted = true;
    setStepInfo(steps);
    setCurrentStep((c) => c + 1);
  };

  const handleInviteDetailInput = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = extractFormData(event);
    if (hasEmptyFields(data)) {
      alert("please fill all the required fields");
      return;
    }
    setInviteData(data);
    console.log(data);
    preparePassPreviewData(inviteData);
    // nextStep();
  };

  const preparePassPreviewData = (inviteData: JSONObject) => {
    let pass: PassDataProps = {
      visitor_name:
        (visitorData["first_name"] as string) +
        " " +
        (visitorData["last_name"] as string),
      visitor_email: visitorData["email"] as string,
      visiting_person_name: "You",
      date: inviteData["date"] as string,
      time: inviteData["time"] as string,
      location: "",
      purpose: inviteData["purpose"] as string,
    };
    setPassData(pass);
    console.log(pass, "PAASSS");
    console.log(
      getUTCTimestamp(
        inviteData["date"] as string,
        inviteData["time"] as string
      ).toString()
    );
  };

  const [stepInfo, setStepInfo] = React.useState(stepsList);

  React.useEffect(() => {}, [currentStep]);

  const onClickStep = (index: number) => {
    setCurrentStep(index);
  };

  const handleFinalSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // send the details to backend
    if (isSelectVisitor) {
      //if visitor is selected then create invitation only
      const { id } = visitorData;
      const data = prepareInvitationData(inviteData);
      const res = await createInvitation({ ...data, visitor_id: id });
      if (res.success) {
        nextStep();
      }
    } else {
      //else create visitor and invitation both
      await createVisitorAndInvitation();
    }
  };

  const prepareInvitationData = (data: JSONObject) => {
    return {
      ...data,
      valid_from: getUTCTimestamp(
        inviteData["date"] as string,
        inviteData["time"] as string
      ).toString(),
    };
  };

  const createVisitorAndInvitation = async () => {
    try {
      const res = await createVisitor(visitorData);
      if (res.success) {
        const { id } = res.data; // visitor_id
        const res_inv = await createInvitation({
          ...prepareInvitationData(inviteData),
          visitor_id: id,
        });
        if (res_inv.success) {
          nextStep();
        } else {
          alert(res.message);
          console.error();
        }
      } else {
        alert(res.message);
      }
    } catch (error) {
      alert("Something didn't go well :(");
      console.error(error);
    }
  };

  const createVisitor = async (data: JSONObject) => {
    const res = await fetch(ENDPOINT + "/visitor/", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then((r) => r.json());
    if (res.success) return res;
  };
  const createInvitation = async (data: JSONObject) => {
    const res = await fetch(ENDPOINT + "/invitation/create_by_security/", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then((r) => r.json());
    if (res.success) return res;
  };
  const handleOnSelectVisitor = (data: JSONObject) => {
    setVisitorData(data);
    setIsSelectVisitor(true);
    nextStep();
  };

  const handleSelectVisitingPerson = (user: JSONObject) => {
    setInviteData((iv) => ({ ...iv, visiting_person_id: user["id"] }));
  };

  return (
    <div className="w-full flex p-4 min-h-screen pb-40">
      <div className="flex-1 bg-white  shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] p-4 rounded-lg mr-4">
        {currentStep != 3 && (
          <div className="text-lg  mb-4 font-bold">
            {stepInfo[currentStep].title}
          </div>
        )}
        {currentStep == 0 && (
          <CreateOrSelectVisitor
            onSubmitCallback={handleCreateOrSelectFormSubmit}
            defaultValues={visitorData}
            onSelectVisiorCallback={handleOnSelectVisitor}
            SUGGESTED_VISITOR_ENDPOINT={null}
            SEARCH_VISITOR_ENDPOINT={null}
          />
        )}
        {currentStep == 1 && (
          <InviteDetailInputSecurity
            onSubmitCallback={handleInviteDetailInput}
            onClickBack={() => {
              setCurrentStep((curr) => curr - 1);
            }}
            defaultValues={inviteData}
            onSelectUserCallback={(userData: JSONObject) => {
              handleSelectVisitingPerson(userData);
            }}
          />
        )}
        {currentStep == 2 && (
          <PassCard
            passData={passData}
            onSubmitCallback={handleFinalSubmit}
            onClickBack={() => {
              setCurrentStep((curr) => curr - 1);
            }}
          />
        )}
        {currentStep == 3 && (
          <div className="w-full h-full flex  flex-col justify-center items-center">
            <span className="text-green-600 text-xl font-semibold">
              Invitation has been created!
            </span>
            <div className="flex mt-4">
              <button
                className="btn mr-2 btn-sm"
                onClick={() => {
                  //   reset();
                  router.replace("/home/invites");
                }}
              >
                Back to home
              </button>

              <button
                className="btn btn-sm"
                onClick={() => {
                  reset();
                }}
              >
                Create new
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="min-h-full mr-16">
        <ul className="steps steps-vertical h-fit">
          {stepInfo.map((step, index) =>
            step.isCompeted ? (
              <li
                className="step step-primary"
                key={step.title}
                onClick={() => onClickStep(index)}
              >
                <span>{step.title}</span>
              </li>
            ) : index == currentStep ? (
              <li
                className="step step-primary"
                key={step.title}
                onClick={() => onClickStep(index)}
              >
                {index == 3 && currentStep == 3 ? (
                  <span className="text-green-600">{step.title}</span>
                ) : (
                  <span>{step.title}</span>
                )}
              </li>
            ) : (
              <li className="step" key={step.title}>
                {step.title}
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}
