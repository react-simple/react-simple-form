import { useGlobalState } from "@react-simple/react-simple-state";
import { FieldTypes, getEmptyObjectValidationResult } from "@react-simple/react-simple-validation";
import { UseFormStateProps, UseFormStateReturn } from "./types";
import { getFormGlobalStateKey, getResolvedFormUpdateFilter } from "./functions";
import { SimpleFormState } from "form";
import { logTrace } from "@react-simple/react-simple-util";
import { REACT_SIMPLE_FORM } from "data";

export function useFormState<Schema extends FieldTypes = any, Data extends object = object>(
  props: UseFormStateProps<Schema, Data>
): UseFormStateReturn<Schema, Data> {
  const { formDefinition, formValidationOptions = {}, updateFilter } = props;
  const { formName, options } = formDefinition;

  const stateKey = getFormGlobalStateKey(formName);

  const [formState, setFormState] = useGlobalState<SimpleFormState<Schema, Data>>({
    stateKey,
    defaultValue: {
      formDefinition,
      formData: options?.defaultValues || {} as any,
      formErrors: getEmptyObjectValidationResult(),
      formValidationOptions
    },
    updateFilter: args => getResolvedFormUpdateFilter(args, updateFilter)
  });

  logTrace(`[useFormState] ${formDefinition.formName}`, { props, formState }, REACT_SIMPLE_FORM.LOGGING.logLevel);
  return [formState, setFormState];
};
