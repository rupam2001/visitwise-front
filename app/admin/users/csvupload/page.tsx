"use client";

import CSVEditor from "@/app/components/CSVEditor";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FaQuestionCircle, FaUpload } from "react-icons/fa";

export default function CSVUploadPage() {
  const [csvContent, setCsvContent] = useState<string | null>(null);
  const inputRef: React.RefObject<HTMLInputElement> = useRef(null);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCsvContent(content);
      };

      reader.readAsText(file);
    }
  };

  const onClick = () => {
    inputRef.current?.click();
  };
  useEffect(() => {
    console.log(csvContent, "csv");
  }, [csvContent]);

  const onClickSubmit = () => {};

  return (
    <div className="w-full h-full p-4 max-w-screen-xl">
      <div className="w-full flex justify-end items-center">
        <FaQuestionCircle className="mr-4 text-2xl" />
        <button
          className="flex items-center btn btn-neutral w-fit"
          onClick={onClick}
          disabled={csvContent == null}
        >
          {/* <FaUpload className="" /> */}
          <span>Submit</span>
          <input
            hidden
            type="file"
            accept=".csv"
            ref={inputRef}
            onChange={handleFileUpload}
          />
        </button>
      </div>
      <div className="w-full h-full pb-4 flex">
        <div
          className="flex-1 p-2 rounded-lg shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
          style={{ maxWidth: "86%", height: "35rem" }}
        >
          {csvContent && <CSVEditor content={csvContent} />}
          {!csvContent && (
            <div
              className="text-center text-gray-300 h-full flex items-center justify-center cursor-pointer"
              onClick={onClick}
            >
              <span className="">Click anywhere to upload your CSV file</span>
            </div>
          )}
          <div>
            <pre>{guideText}</pre>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}

const guideText = `
How to use?

  Step 1: Upload your CSV file containing 
          . First Name
          . Last Name
          . Email
          . Phone
          . Role
          . Reports to (Email of the person the user reports to, not required)
  Step 2: Select the Appropriate columns from the CSV in the above editor 
          and tag them with the corresponding requried columns                

`;
