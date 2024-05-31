import * as React from "react";
import { FormInputPropsBase } from "components/types";
import { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & FormInputPropsBase;

export const Input = ({ ignoreForm, ...inputProps }: InputProps) => {
  return <input {...inputProps} />;
};
