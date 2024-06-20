import { useEffect, useMemo } from "react";
import { ValueOrCallbackWithArgs, deepCopyObject, logTrace, stringAppend } from "@react-simple/react-simple-util";
import { getChildMemberValue } from "@react-simple/react-simple-mapping";
import { SetGlobalStateOptions, UseGlobalStateProps, setGlobalState, useGlobalState } from "@react-simple/react-simple-state";
import {
  FieldTypes, ObjectValidationResult, getEmptyObjectValidationResult, mergeFieldValidationOptions
} from "@react-simple/react-simple-validation";
import {
  SimpleFormDefinition, SimpleFormInstance, SimpleFormOptions, SimpleFormState, SimpleFormValidationOptions, validateSimpleForm 
} from "form";
import { REACT_SIMPLE_FORM } from "data";

// A form is just a sub-tree in global state which is validated and bound to inputs.
// Therefore useFormState() uses useGlobalState() to implement its features.
// Components can subscribe to change in the entire form, subsections or single inputs only by using 
// the updateFilter of global state.

export type UseSimpleFormStateProps<FormSchema extends FieldTypes = any, FormData extends object = object>
  = Omit<UseGlobalStateProps<SimpleFormState<FormSchema, FormData>>, "defaultState">
  & {
    readonly formDefinition: SimpleFormDefinition<FormSchema, FormData>; // must be a memoized reference!
    readonly options?: SimpleFormOptions<FormSchema, FormData>;
  };

export interface UseSimpleFormStateReturn<FormSchema extends FieldTypes = any, FormData extends object = object> {
  readonly formState: SimpleFormState<FormSchema, FormData>;

  // from formState
  readonly form: SimpleFormInstance<FormSchema, FormData>; 
  readonly errors: ObjectValidationResult<FormSchema>;
  readonly data: FormData;

  // callbacks
  readonly setFormState: (
    state: ValueOrCallbackWithArgs<SimpleFormState<FormSchema, FormData>, Partial<SimpleFormState<FormSchema, FormData>>>,
    options?: SetGlobalStateOptions<SimpleFormState<FormSchema, FormData>>
  ) => SimpleFormState<FormSchema, FormData>;

  // Fields are just children states in global state, so anytime the setGlobalState() function can be used if something special is needed.
  readonly getFieldValue: <Value = unknown>(fullQualifiedName: string) => Value | undefined;
  readonly setFieldValue: <Value = unknown>(fullQualifiedName: string, value: Value, options?: SetGlobalStateOptions<Value>) => void;

  readonly validateForm: (options?: SimpleFormValidationOptions) => ObjectValidationResult<FormSchema>;
}

export function useSimpleFormState<FormSchema extends FieldTypes = any, FormData extends object = object>(
  props: UseSimpleFormStateProps<FormSchema, FormData>
): UseSimpleFormStateReturn<FormSchema, FormData> {
  const { formDefinition, options, ...globalStateProps } = props;
  const { fullQualifiedName } = props;

  const defaultFormState = useMemo<SimpleFormState<FormSchema, FormData>>(
    () => ({
      $form: {
        formName: formDefinition.formName,
        fullQualifiedName,
        formDefinition,
        formSchema: deepCopyObject(formDefinition.formSchema),
        options: mergeFieldValidationOptions(formDefinition.options || {}, options || {})
      },
      $errors: getEmptyObjectValidationResult()
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fullQualifiedName, formDefinition]);

  // calling the hook here ensures that this component gets updated when the form at fullQualifiedName changes,
  // or when any of its parent or child state nodes change (like fields)
  const [formState, setFormState] = useGlobalState<SimpleFormState<FormSchema, FormData>>({
    ...globalStateProps,
    defaultState: defaultFormState
  });

  const getFieldValue: UseSimpleFormStateReturn<FormSchema, FormData>["getFieldValue"] =
    <Value = unknown>(name: string) => {
      return getChildMemberValue(formState || {}, name) as Value | undefined;
    };

  const setFieldValue: UseSimpleFormStateReturn<FormSchema, FormData>["setFieldValue"] =
    <Value = unknown>(name: string, value: Value, options?: SetGlobalStateOptions<Value>) => {
      // do not set the entire form state, only the field (to avoid unnecessary updates)
      setGlobalState(stringAppend(fullQualifiedName, name, "."), value, options);
    };

  const validateForm: UseSimpleFormStateReturn<FormSchema, FormData>["validateForm"] = options => {
    return validateSimpleForm(fullQualifiedName, options);
  };

  useEffect(
    () => {
      // initialize
      setFormState(formState); // formState is calculated, set it once

      return () => {
        // finalize
        // useGlobalState() removes the state if props.removeStateOnUnload is specified
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
  
  logTrace(
    `[useFormState] ${formDefinition.formName}`,
    {
      args: { props, formState },
      logLevel: REACT_SIMPLE_FORM.LOGGING.logLevel
    });
    
  return {
    // data
    formState,
    form: formState?.$form || defaultFormState.$form,
    errors: formState?.$errors || defaultFormState.$errors,
    data: (formState || {}) as FormData,

    // callbacks
    setFormState,
    getFieldValue,
    setFieldValue,
    validateForm
  };
}
