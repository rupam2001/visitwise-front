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

export const saveDeviceToken = (token: string) => {
  Cookies.set("device_token", token);
};
export const getDeviceToken = () => Cookies.get("device_token");

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
  [key: string]: string | number | boolean | null;
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
import { InvitationStatusData } from "./types";

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

export function getLatestStatus(records: InvitationStatusData[]) {
  if (!records || records.length === 0) {
    return null;
  }

  // Sort records by created_at in descending order
  const sortedRecords = records.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Return the first element (latest record)
  return sortedRecords[0].current_status;
}

export function calculateTimeDifferenceInHours(
  timeString1: string,
  timeString2: string
): number {
  const date1: Date = new Date(timeString1);
  const date2: Date = new Date(timeString2);

  // Calculate the time difference in milliseconds
  const timeDifferenceInMilliseconds: number =
    date2.getTime() - date1.getTime();

  // Convert milliseconds to hours
  const timeDifferenceInHours: number =
    timeDifferenceInMilliseconds / (1000 * 60 * 60);

  return timeDifferenceInHours;
}

export function isTime1BeforeTime2(
  timeString1: string,
  timeString2: string
): boolean {
  const date1: Date = new Date(timeString1);
  const date2: Date = new Date(timeString2);

  // Compare the two dates
  return date1 < date2;
}

export function getRelativeDate(ago: number): string {
  const currentDate = new Date();

  // Set the number of milliseconds for the past date (e.g., 1 day ago)
  const millisecondsInOneDay = 24 * 60 * 60 * 1000 * ago; // 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
  const pastDateMilliseconds = currentDate.getTime() - millisecondsInOneDay;

  // Create a new Date object for the past date
  const pastDate = new Date(pastDateMilliseconds);
  return pastDate.toUTCString();
}

export function convertUtcToDateString(utcTimeString: string): string {
  const utcDate = new Date(utcTimeString);
  const year = utcDate.getUTCFullYear();
  const month = String(utcDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(utcDate.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function convertBroswerToUTC(dateString: string): string | null {
  const userDate = new Date(`${dateString}T00:00:00`);

  if (isNaN(userDate.getTime())) {
    console.error("Invalid date format");
    return null;
  }

  const userTimezoneOffset = userDate.getTimezoneOffset();
  const utcTimestamp = userDate.getTime() + userTimezoneOffset * 60000;

  const utcDate = new Date(utcTimestamp);

  return utcDate.toISOString().split("T")[0];
}

export function convertToLocalDateFormat(localDateString: string) {
  const localDate = new Date(localDateString);

  // Check if the date is valid
  if (isNaN(localDate.getTime())) {
    console.error("Invalid date format");
    return null;
  }

  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const day = String(localDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getDatesInRange(
  startDateStr: string,
  endDateStr: string
): string[] | null {
  // Convert start and end date strings to Date objects
  const startDate = new Date(`${startDateStr}T00:00:00`);
  const endDate = new Date(`${endDateStr}T00:00:00`);

  // Check if the date strings are valid
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.error("Invalid date format");
    return null;
  }

  const datesInRange: string[] = [];
  let currentDate = new Date(startDate);

  // Iterate through dates and add them to the array
  while (currentDate <= endDate) {
    datesInRange.push(new Date(currentDate).toUTCString());
    currentDate.setUTCDate(currentDate.getUTCDate() + 1); // Move to the next day
  }

  return datesInRange;
}

export function convertUtcToBrowserDate(utcTimeString: string): string | null {
  // Create a Date object from the UTC time string
  const utcDate = new Date(utcTimeString);

  // Check if the date is valid
  if (isNaN(utcDate.getTime())) {
    console.error("Invalid date format");
    return null;
  }

  // Get the browser's timezone offset in minutes
  const browserTimezoneOffset = new Date().getTimezoneOffset();

  // Calculate the new date in the browser's timezone
  const browserDate = new Date(
    utcDate.getTime() - browserTimezoneOffset * 60000
  );

  // Extract year, month, and day components
  const year = browserDate.getFullYear();
  const month = String(browserDate.getMonth() + 1).padStart(2, "0");
  const day = String(browserDate.getDate()).padStart(2, "0");

  // Format the date as 'YYYY-MM-DD'
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

export function getDatesInRange2(
  startDateStr: string,
  endDateStr: string
): { utcDates: string[] | null; localDates: string[] | null } {
  // Convert start and end date strings to Date objects
  const startDate = new Date(`${startDateStr}T00:00:00`);
  const endDate = new Date(`${endDateStr}T00:00:00`);

  // Check if the date strings are valid
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.error("Invalid date format");
    return { utcDates: null, localDates: null };
  }

  const utcDates: string[] = [];
  const localDates: string[] = [];
  let currentDate = new Date(startDate);

  // Iterate through dates and add them to the arrays
  while (currentDate <= endDate) {
    const utcDateStr = convertToDateFormat(new Date(currentDate).toUTCString());
    let localDateStr = convertToDateFormat(
      new Date(currentDate).toLocaleDateString()
    );

    utcDates.push(utcDateStr);
    localDateStr =
      localDateStr.split("-")[0] +
      "-" +
      localDateStr.split("-")[2] +
      "-" +
      localDateStr.split("-")[1];
    localDates.push(localDateStr);

    currentDate.setUTCDate(currentDate.getUTCDate() + 1); // Move to the next day
  }

  return { utcDates, localDates };
}

function convertToDateFormat(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDatesInRange3(
  startDateStr: string,
  endDateStr: string
): string[] | null {
  // Convert start and end date strings to Date objects
  const startDate = new Date(`${startDateStr}T00:00:00`);
  const endDate = new Date(`${endDateStr}T00:00:00`);

  // Check if the date strings are valid
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.error("Invalid date format");
    return null;
  }

  const datesInRange: string[] = [];
  let currentDate = new Date(startDate);

  // Iterate through dates and add them to the array
  while (currentDate <= endDate) {
    datesInRange.push(
      convertToDateFormat2(new Date(currentDate).toUTCString())
    );
    currentDate.setUTCDate(currentDate.getUTCDate() + 1); // Move to the next day
  }

  return [...datesInRange, endDateStr];
}

function convertToDateFormat2(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function textShortner(text: string, maxLen: number = 20) {
  if (!text) return "--";
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + "...";
}

export function downloadCsv(data: JSONObject[], fileName: string): void {
  const csvContent = convertToCsv(data);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create a link element to trigger the download
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    console.error("Downloading CSV is not supported in this browser.");
  }
}

function convertToCsv(data: JSONObject[]): string {
  // Extract headers from the first object
  const headers = Object.keys(data[0]);

  // Convert data to CSV rows
  const rows = data.map((obj) => headers.map((key) => obj[key]).join(","));

  // Combine headers and rows
  const csvContent = [headers.join(","), ...rows].join("\n");

  return csvContent;
}
