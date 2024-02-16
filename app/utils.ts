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
  const dateTimeString = `${dateInput}T${timeInput}:00.000Z`;

  // Create a Date object from the combined string
  const dateTime = new Date(dateTimeString);

  // Get the UTC timestamp in the desired format
  const formattedTimestamp = dateTime.toISOString();

  return formattedTimestamp;
}
