import { ENDPOINT } from "@/app/constants";
import { getAuthHeaders } from "@/app/utils";
import * as React from "react";
import { FaMobile } from "react-icons/fa";
import QRCode from "react-qr-code";

const PairScanner = () => {
  const modalRef: React.RefObject<HTMLDialogElement> = React.useRef(null);
  const [qrContent, setQrContent] = React.useState<string>("");
  const [validFor, setValidFor] = React.useState(30);
  const fetchQRCodeContent = async () => {
    //fetch from the server
    try {
      const res = await fetch(ENDPOINT + "/services/get_pairing_qrcode/", {
        method: "GET",
        headers: getAuthHeaders(),
      }).then((r) => r.json());
      if (res.success) {
        const content: string =
          "http://192.168.1.2:3000/security/scanner?token=" + res.data["token"];
        setQrContent(content);
      }
    } catch (error) {}
  };
  const onClickPairScanner = async () => {
    //fetch

    modalRef.current?.showModal();
    await fetchQRCodeContent();
  };

  React.useEffect(() => {
    // const t = setTimeout(() => {
    //   setValidFor((v) => v - 1);
    // }, 1000 * 30);
  }, []);

  return (
    <div>
      <button
        className="btn btn-ghost mr-4 tooltip tooltip-bottom flex cursor-pointer"
        data-tip="Pair a scanning device"
        onClick={onClickPairScanner}
      >
        <FaMobile />
        Pair scanner
      </button>
      <dialog
        id="my_modal_3"
        className="modal"
        ref={modalRef}
        onClose={() => {
          setQrContent("");
        }}
      >
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Pair your scanner</h3>
          <p className="my-4">Open your phone and scan the QR bellow</p>
          <br />
          <div
            style={{
              height: "auto",
              margin: "0 auto",
              maxWidth: 100,
              width: "100%",
            }}
            className={`${qrContent == "" ? "skeleton" : ""}`}
          >
            {qrContent == "" && <div className="skeleton w-32 h-32"></div>}
            {qrContent != "" && (
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={qrContent}
                viewBox={`0 0 256 256`}
                className="w-34 h-34"
              />
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default PairScanner;
