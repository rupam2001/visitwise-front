// context.tsx
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useRef,
  useEffect,
} from "react";
import { InvitationPassData, InvitationPassResponse } from "../types";
import {
  JSONObject,
  getAuthHeaders,
  getAuthToken,
  getTodayDateInUTC,
} from "../utils";
import { ENDPOINT, WEBSOCKET_ENDPOINT } from "../constants";

// Define the type for your context value
type SecurityContextType = {
  sharedValue: string;
  invitationData: InvitationPassData[];
  setInvitationData: React.Dispatch<React.SetStateAction<InvitationPassData[]>>;
  fetchInvitationDataByDate: (date: string) => Promise<InvitationPassResponse>;
  loadTodaysData: () => Promise<void>;
};

const SecurityContext = createContext<SecurityContextType | undefined>(
  undefined
);

interface SecurityContextProviderType {
  children: ReactNode;
}

export const SecurityContextProvider: React.FC<SecurityContextProviderType> = ({
  children,
}) => {
  // Define the state or values you want to share
  const sharedValue = "Hello from Context";
  const [invitationData, setInvitationData] = useState<InvitationPassData[]>(
    []
  );
  const fetchInvitationDataByDate = async (date: string) => {
    //fetch by date
    const res = await fetch(ENDPOINT + `/invitation/get_by_date/` + date, {
      headers: getAuthHeaders(),
      method: "GET",
    }).then((r) => r.json());
    return res;
  };
  const loadTodaysData = async () => {
    console.log("Loading todays data...");
    try {
      const res = await fetchInvitationDataByDate(getTodayDateInUTC());
      if (res.success) {
        setInvitationData(res.data);
      } else {
        alert(res.message);
      }
    } catch (error) {
      //   alert("Somthing went wrong");
      console.log(error);
    }
  };
  // useEffect(() => {
  //   let t = setInterval(() => {
  //     loadTodaysData();
  //   }, 3000);
  //   return () => clearInterval(t);
  // }, []);
  // sockets
  const socketRef = useRef<WebSocket | null>(null);

  const connectWebScoket = () => {
    if (!getAuthToken) return;
    socketRef.current = new WebSocket(WEBSOCKET_ENDPOINT + "/");

    socketRef.current.onopen = (e) => {
      console.log(e);
    };

    //
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // setInvitationData((inv) => [...inv, data["invitation"]]);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  };

  useEffect(() => {
    return connectWebScoket();
  }, []);

  return (
    <SecurityContext.Provider
      value={{
        sharedValue,
        invitationData,
        setInvitationData,
        fetchInvitationDataByDate,
        loadTodaysData,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurityContext = (): SecurityContextType => {
  // Create a custom hook to easily access the context value
  const contextValue = useContext(SecurityContext);
  if (!contextValue) {
    throw new Error(
      "useSecurityContext must be used within a SecurityContextProvider"
    );
  }
  return contextValue;
};
