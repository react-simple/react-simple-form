import { useGlobalState } from "@react-simple/react-simple-state";
import { FieldTypes, getEmptyObjectValidationResult } from "@react-simple/react-simple-validation";
import { UseSimpleFormProps, UseSimpleFormReturn } from "./types";
import { getSimpleFormGlobalStateKey } from "./functions";
import { SimpleFormState } from "form";

export function useSimpleForm<FormSchema extends FieldTypes = any, FormData = any>(
  props: UseSimpleFormProps<FormSchema, FormData>
): UseSimpleFormReturn<FormSchema, FormData> {
  const { formDefinition } = props;
  const { formName, options } = formDefinition;

  const stateKey = getSimpleFormGlobalStateKey(formName);

  const [formState, setFormState] = useGlobalState<SimpleFormState<FormSchema, FormData>>({
    stateKey,
    defaultValue: {
      formData: options?.defaultValues || {} as any,
      errors: getEmptyObjectValidationResult()
    },
    getUpdates: true
  });

  return { formState };
};
