// context.tsx
import React, { createContext, useContext, ReactNode, useState } from "react";
import {
  InvitationPassData,
  InvitationPassResponse,
  NotificationData,
} from "../types";
import { JSONObject, getAuthHeaders, getTodayDateInUTC } from "../utils";
import { ENDPOINT } from "../constants";
import { INVITES_NAME } from "../constants";
import { REQUEST_NAME } from "../constants";

// Define the type for your context value
type UserContextType = {
  invitationRequests: InvitationPassData[];
  setInvitationRequests: React.Dispatch<
    React.SetStateAction<InvitationPassData[]>
  >;
  invitations: InvitationPassData[];
  setInvitations: React.Dispatch<React.SetStateAction<InvitationPassData[]>>;
  loadInvitations: (page: number) => Promise<any>;
  loadInvitationRequests: () => void;
  notifications: NotificationData[];
  loadNotifications: () => void;
  markAsRead: () => void;
  oldNotifications: NotificationData[];
  loadOldNotifications: () => void;
  addLoader: (name: string) => void;
  removeLoader: (name: string) => void;
  currentLoadingScreens: JSONObject;
  isLoading: (name: string) => boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserContextProviderType {
  children: ReactNode;
}

export const UserContextProvider: React.FC<UserContextProviderType> = ({
  children,
}) => {
  // Define the state or values you want to share

  const [currentLoadingScreens, setCurrentLoadingScreens] =
    useState<JSONObject>({});

  const [invitations, setInvitations] = React.useState<InvitationPassData[]>(
    []
  );
  const [invitationRequests, setInvitationRequests] = React.useState<
    InvitationPassData[]
  >([]);

  const [notifications, setNotification] = React.useState<NotificationData[]>(
    []
  );
  const [oldNotifications, setOldNotification] = React.useState<
    NotificationData[]
  >([]);
  const loadNotifications = async () => {
    try {
      const res = await fetch(ENDPOINT + "/notification/get_unread/", {
        headers: getAuthHeaders(),
        method: "GET",
      }).then((r) => r.json());

      console.log(res, "response");
      if (res.success) {
        //   setUserData(res.data);
        setNotification(res.data);
      }
      return res;
    } catch (error) {
      console.error(error);
    }
  };
  const loadOldNotifications = async () => {
    try {
      const res = await fetch(ENDPOINT + "/notification/", {
        headers: getAuthHeaders(),
        method: "GET",
      }).then((r) => r.json());

      console.log(res, "response");
      if (res.success) {
        //   setUserData(res.data);
        setOldNotification(res.data);
      }
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const markAsRead = async () => {
    try {
      const res = await fetch(ENDPOINT + "/notification/mark_as_read/", {
        headers: getAuthHeaders(),
        method: "PATCH",
        body: JSON.stringify({
          notification_ids: notifications
            .filter((n) => !n.is_read)
            .map((n) => n.id),
        }),
      }).then((r) => r.json());

      console.log(res, "response mark_as_read");
      if (res.success) {
        // await loadNotifications();
      }
      return res;
    } catch (error) {
      console.error(error);
    }
  };
  const loadInvitationRequests = async () => {
    addLoader(REQUEST_NAME);
    try {
      const res = await fetch(ENDPOINT + "/invitation/get_requests/", {
        method: "GET",
        headers: getAuthHeaders(),
      }).then((r) => r.json());
      if (res.success) {
        setInvitationRequests(res.data);
      }
      removeLoader(REQUEST_NAME);
    } catch (error) {
      removeLoader(REQUEST_NAME);
    }
  };
  const loadInvitations = async (page: number = 1) => {
    addLoader(INVITES_NAME);
    try {
      const res = await fetch(ENDPOINT + "/invitation/get_history/" + page, {
        method: "GET",
        headers: getAuthHeaders(),
      }).then((r) => r.json());
      if (res.success) {
        setInvitations(res.data);
        removeLoader(INVITES_NAME);
        return { ...res };
      }
    } catch (error) {
      removeLoader(INVITES_NAME);
    }
  };

  const addLoader = (name: string) => {
    setCurrentLoadingScreens((screens) => {
      let temp = { ...screens };
      temp[name] = true;
      return temp;
    });
  };
  const removeLoader = (name: string) => {
    setCurrentLoadingScreens((screens) => {
      let temp = { ...screens };
      delete temp[name];
      return temp;
    });
  };
  const isLoading = (name: string) => {
    if (name in currentLoadingScreens) {
      return currentLoadingScreens[name] as boolean;
    }
    return false;
  };
  return (
    <UserContext.Provider
      value={{
        invitationRequests,
        setInvitationRequests,
        invitations,
        setInvitations,
        loadInvitationRequests,
        loadInvitations,
        notifications,
        loadNotifications,
        markAsRead,
        oldNotifications,
        loadOldNotifications,
        addLoader,
        removeLoader,
        currentLoadingScreens,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  // Create a custom hook to easily access the context value
  const contextValue = useContext(UserContext);
  if (!contextValue) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return contextValue;
};
