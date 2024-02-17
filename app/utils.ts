import React, { FormEvent } from "react";
import Cookies from "js-cookie";

export const extractFormData = (formEvent: FormEvent<HTMLFormElement>) => {
  const formDataObject: { [key: string]: string } = {};
  const formElements = formEvent.currentTarget
    .elements as HTMLFormControlsCollection;

  for (let i = 0; i < formElements.length; i++) {
    const element = formElements[i] as HTMLInputElement;
    if (element.name) {
      formDataObject[element.name] = element.value;
    }
  }
  return formDataObject;
};

export const saveAuthToken = (token: string) => {
  Cookies.set("token", token);
};
export const getAuthToken = () => Cookies.get("token");

export const API = () => {
  const headers = {
    "Content-Type": "application/json",
  };
  return {
    post: async (body: Object) => {},
  };
};

export const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Token ${getAuthToken()}`,
});
export const getHeaders = () => ({ "Content-Type": "application/json" });

export const wrapWithSkeleton = (className: string, isSkeleton: Boolean) =>
  isSkeleton ? "skeleton " + className : className;

export interface JSONObject {
  [key: string]: string | number | null;
}

export function hasEmptyFields(jsonObject: JSONObject): boolean {
  for (const key in jsonObject) {
    if (jsonObject[key] == "" || jsonObject[key] == null) {
      return true;
    }
  }
  return false;
}
export function getUTCTimestamp(dateInput: string, timeInput: string) {
  // Combine date and time inputs into a single string
  const dateTimeString = `${dateInput}T${timeInput}:00.000`;

  // Create a Date object from the combined string (in local timezone)
  const localDateTime = new Date(dateTimeString);

  // Get the UTC timestamp in the desired format
  const utcTimestamp = localDateTime.toISOString();

  // Remove the 'Z' at the end and replace with 'Z'
  const formattedTimestamp = utcTimestamp.replace("Z", "Z");

  return formattedTimestamp;
}

export function convertUtcToBrowserTime(utcTimeString: string): string {
  // Create a Date object from the UTC time string
  const utcDate = new Date(utcTimeString);

  // Get the browser's timezone offset in minutes
  const browserTimezoneOffset = new Date().getTimezoneOffset();

  // Calculate the new date and time in the browser's timezone
  const browserTime = new Date(
    utcDate.getTime() - browserTimezoneOffset * 60000
  );

  // Format the date and time using the browser's timezone
  const formattedTime = browserTime.toLocaleString();

  return formattedTime;
}

import moment from "moment";

export function formatDateTime(dateTimeString: string): string {
  const formattedDateTime = moment(
    dateTimeString,
    "DD/MM/YYYY, HH:mm:ss"
  ).format("MMM D, YYYY [at] h:mm A");
  return formattedDateTime;
}

export function getDayStatus(utcDateString: string): string {
  const currentDate = new Date();
  let inputDate = new Date(utcDateString);

  // Extract date components
  const currentDay = currentDate.getDate();
  const inputDay = inputDate.getDate();

  // Check if it's today, tomorrow, or future
  if (currentDay === inputDay) {
    return "today";
  } else if (currentDay + 1 === inputDay) {
    return "tomorrow";
  } else {
    return "future";
  }
}

export function getTodayDateInUTC(): string {
  const today = new Date();
  const utcDate = new Date(
    today.toISOString().split("T")[0] + "T00:00:00.000Z"
  );
  return utcDate.toISOString().split("T")[0];
}
