import { useMemo } from "react";
import { logTrace } from "@react-simple/react-simple-util";
import { getChildMemberValue } from "@react-simple/react-simple-mapping";
import { SetGlobalStateOptions, UseGlobalStateProps, useGlobalState } from "@react-simple/react-simple-state";
import { FieldType, FieldValidationResult, getChildFieldType, getChildValidationResult } from "@react-simple/react-simple-validation";
import { SimpleFormState } from "form";
import { REACT_SIMPLE_FORM } from "data";

// A form is just a sub-tree in global state which is validated and bound to inputs.
// Therefore useSimpleFormState() hook just uses the useGlobalState() hook to implement its features.
// Components can subscribe to change in the entire form, subsections or single inputs only by using 
// the updateFilter of global state.

// The useSimpleFormState() hook must be called at least once in some root component to initialize the form state, but it's idempotent.

export type UseSimpleFormFieldProps<Value> = Omit<UseGlobalStateProps<Value>, "defaultState" | "selector" | "fullQualifiedName"> & {
  fullQualifiedName: {
    form: string;
    field: string; // relative to form
  };
};

export interface UseSimpleFormFieldReturn<Value> {
  readonly value: Value | undefined;
  readonly fieldType: FieldType | undefined;
  readonly validationResult: FieldValidationResult | undefined;
  readonly errors: FieldValidationResult | undefined;

  // callbacks
  readonly setValue: (value: Value, options?: SetGlobalStateOptions<Partial<SimpleFormState>>) => void;
}

export function useSimpleFormField<Value>(props: UseSimpleFormFieldProps<Value>): UseSimpleFormFieldReturn<Value> {
  const {fullQualifiedName } = props;

  // subscribe at form level, but get updates for this field only
  const [formState, setFormState] = useGlobalState<Partial<SimpleFormState>>({
    fullQualifiedName: fullQualifiedName.form,
    defaultState: {},
    // only update if this field changes or its error changes
    updateFilter: {
      selector: { childMemberFullQualifiedName: fullQualifiedName.field }
    }
  });

  // we don't expect schema to change
  const fieldType = useMemo(
    () => formState?.$form?.formSchema && getChildFieldType(formState.$form.formSchema, fullQualifiedName.field),
    [formState?.$form?.formSchema, fullQualifiedName.field]
  );

  const value = getChildMemberValue<Value>(formState, fullQualifiedName.field);
  const validationResult = formState?.$errors && getChildValidationResult(formState.$errors, fullQualifiedName.field);

  logTrace(
    `[useSimpleFormField] ${props.fullQualifiedName}`,
    {
      args: { props, fieldType, value, validationResult },
      logLevel: REACT_SIMPLE_FORM.LOGGING.logLevel
    });
  
  const setValue = (value: Value, options?: SetGlobalStateOptions<Partial<SimpleFormState>>) => {
    setFormState(
      {
        childMemberFullQualifiedName: fullQualifiedName.field,
        state: value
      },
      options);
  };

  return {
    // data
    value,
    fieldType,
    validationResult,
    errors: validationResult?.isValid === false ? validationResult : undefined,

    // callbacks
    setValue
  };
}
