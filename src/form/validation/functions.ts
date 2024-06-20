import { logTrace } from "@react-simple/react-simple-util";
import { getGlobalState, setGlobalState } from "@react-simple/react-simple-state";
import {
  FieldTypes, ObjectValidationResult, getEmptyObjectValidationResult, mergeFieldValidationOptions, validateObject
 } from "@react-simple/react-simple-validation";
import { SimpleFormValidationOptions } from "./types";
import { REACT_SIMPLE_FORM } from "data";
import { SimpleFormState } from "form/instance";

export function validateSimpleForm<Schema extends FieldTypes = any>(
  fullQualifiedName: string,
  options?: SimpleFormValidationOptions & {
    updateState?: boolean // default is 'true' and form errors will be set in global state
  }
): ObjectValidationResult<Schema> {
  const formState = getGlobalState<SimpleFormState>(fullQualifiedName);

  if (!formState) {
    return getEmptyObjectValidationResult();
  }

  const formErrors = validateObject(
    formState,
    formState.$form.formSchema,
    mergeFieldValidationOptions(formState.$form.options?.validationOptions || {}, options || {})
  );

  if (options?.updateState !== false) {
    // do not set the entire form state, only errors (to avoid unnecessary updates)
    setGlobalState(`${fullQualifiedName}.$formErrors`, formErrors, { immutableUpdate: false });
  }

  logTrace(
    `[validateForm] isValid: ${formErrors.isValid}`,
    {
      args: { fullQualifiedName, options, formState, formErrors },
      logLevel: REACT_SIMPLE_FORM.LOGGING.logLevel
    });

  return formErrors;
}
