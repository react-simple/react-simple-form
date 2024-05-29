import { useGlobalState } from "@react-simple/react-simple-state";
import { FieldTypes, getEmptyObjectValidationResult, getValidationResultChild } from "@react-simple/react-simple-validation";
import { getObjectChildValue } from "@react-simple/react-simple-mapping";
import { UseFormStateProps, UseFormStateReturn } from "./types";
import { getFormGlobalStateKey } from "./functions";
import { SimpleFormState } from "form";

export function useFormState<FormSchema extends FieldTypes = any, FormData extends object = object>(
  props: UseFormStateProps<FormSchema, FormData>
): UseFormStateReturn<FormSchema, FormData> {
  const { formDefinition, filter } = props;
  const { formName, options } = formDefinition;

  const stateKey = getFormGlobalStateKey(formName);

  const [formState, setFormState] = useGlobalState<SimpleFormState<FormSchema, FormData>>({    
    stateKey,
    defaultValue: {
      formDefinition,
      formData: options?.defaultValues || {} as any,
      formErrors: getEmptyObjectValidationResult()
    },
    getUpdates: args => {
      if (!filter) {
        // no filter, react to any form changes
        return true;
      }
      else if (filter.getUpdates) {
        // custom callback
        return filter.getUpdates(args);
      }
      else {
        const { oldState, newState } = args;

        if (filter.valueChange !== false) {
          // update parent component on value change
          if (!filter.fullQualifiedFieldNames || !!oldState.formData) {
            return oldState.formData !== newState.formData;
          }
          else {
            // compare values
            return filter.fullQualifiedFieldNames.some(t =>
              getObjectChildValue(oldState.formData!, t) !== getObjectChildValue(newState.formData, t)
            );
          }
        }

        if (filter.errorChange !== false) {
          // update parent component on error change
          if (!filter.fullQualifiedFieldNames) {
            return oldState.formErrors !== newState.formErrors;
          }
          else {
            // compare values
            return filter.fullQualifiedFieldNames.some(t =>
              getValidationResultChild(oldState.formErrors!, t) !== getValidationResultChild(newState.formErrors, t)
            );
          }
        }

        // don't update, filtered out
        return false;
      }          
    }
  });

  return [formState, setFormState];
};
