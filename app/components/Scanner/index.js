"use client";
import { ENDPOINT } from "@/app/constants";
import { getDeviceToken, getHeaders, saveDeviceToken } from "@/app/utils";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { FaCamera } from "react-icons/fa";
import QrReader from "react-qr-scanner";

export default function Scanner() {
  const params = useSearchParams();
  const [isPaired, setIsPaired] = React.useState(false);
  const [isScanning, setIsScanning] = React.useState(false);
  const [scannedData, setScannedData] = React.useState();

  const beepSoundRef = React.useRef(null);

  React.useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const token = params.get("token");
    if (token) {
      const device_token = getDeviceToken();
      if (device_token) {
        const pairres = await checkForPairing(device_token);
        if (pairres == false) {
          pair(token);
        }
      } else {
        pair(token);
      }
    }
  };

  const pair = async (token) => {
    try {
      const res = await fetch(ENDPOINT + "/services/pair_device/", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ token: token }),
      }).then((r) => r.json());
      if (res.success) {
        saveDeviceToken(res.data["token"]);
        isPaired(true);
      }
    } catch (error) {}
  };
  const checkForPairing = async (token) => {
    //token available, ping to the backend for validation
    try {
      const res = await fetch(ENDPOINT + "/services/check_pair_conn/", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ device_token: token }),
      }).then((r) => r.json());
      if (res.success) {
        setIsPaired(res.data["valid"]);
        return res.data["valid"];
      }
    } catch (error) {
      return false;
    }
  };

  const onScane = (data) => {
    if (data) {
      console.log(data);
      data = JSON.parse(data.text);
      console.log(data);
      if (scannedData && data["token"] == scannedData["token"]) return;
      setScannedData(data);
      varifyScannedQR(data["token"]);
    }
  };

  const varifyScannedQR = async (passkey) => {
    try {
      const res = await fetch(ENDPOINT + "/services/varify_qr/", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          passkey: passkey,
          device_token: getDeviceToken(),
        }),
      }).then((r) => r.json());
      if (res.success) {
        beepSoundRef.current?.play();

        setScannedData(null);
      }
    } catch (error) {}
  };

  if (isPaired)
    return (
      <div className="w-full h-screen flex flex-col items-center justify-cent">
        <div className="top-1 text-2xl font-semibold mb-10">Scanner</div>
        {isScanning && (
          <div className="p-1 shadow-lg">
            <QrReader
              delay={1000}
              style={{ outerHeight: "50%", innerWidth: "100%" }}
              onError={() => {}}
              onScan={onScane}
            />
          </div>
        )}
        {!isScanning && <FaCamera className="w-32 h-32 text-gray-400" />}

        <button
          className={`btn  bottom-10 fixed ${
            isScanning ? "bg-red-600" : "bg-green-500"
          }`}
          onClick={() => setIsScanning(!isScanning)}
        >
          {isScanning ? "Stop Scanning" : "Start Scanning"}
        </button>
        <audio
          src="https://res.cloudinary.com/rupamcloud/video/upload/v1709382932/zamfgbnww9dlgpbpvs6t.mp3"
          ref={beepSoundRef}
          hidden
        ></audio>
      </div>
    );

  return (
    <div>
      Scanner
      {isPaired && (
        <QrReader delay={1000} style={{}} onError={() => {}} onScan={onScane} />
      )}
    </div>
  );
}
