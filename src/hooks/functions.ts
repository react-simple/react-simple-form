import { getChildMemberValue, setChildMemberValue } from "@react-simple/react-simple-mapping";
import { StateChangeArgs, StateReturn } from "@react-simple/react-simple-state";
import { Nullable, isArray, isFunction, logTrace } from "@react-simple/react-simple-util";
import {
  FieldRuleValidationResult, FieldTypes, FieldValidationOptions, FieldValidationResult, getChildValidationResult, getEmptyObjectValidationResult,
  validateObject

} from "@react-simple/react-simple-validation";
import { REACT_SIMPLE_FORM } from "data";
import {
  FormFieldValues, SimpleFormUpdateFilterFullQualifiedName, SimpleFormUpdateFilter, SimpleFormState,
  SimpleFormValidationOptions

} from "form";

// FORM

export const getFormGlobalStateKey = (formName: string) => {
  return `SIMPLE_FORM.${formName}`;
};

// TODO
// export function formReset<Schema extends FieldTypes = FieldTypes, Data extends object = object>(
//   formState: StateReturn<SimpleFormState<Schema, Data>>,
//   options?: {
//     setDefaultValues?: boolean; // default is 'true1
//     clearErrors?: boolean; // default is 'true'
//   }): SimpleFormState<Schema, Data> {
//   return {} as any;
// }

export function getResolvedFormUpdateFilter<Schema extends FieldTypes = FieldTypes, Data extends object = object>(
  args: StateChangeArgs<SimpleFormState<Schema, Data>>,
  updateFilter: Nullable<SimpleFormUpdateFilter<Schema, Data>>
): boolean {
  if (!updateFilter) {
    // no filter, react to any form changes
    return true;
  }

  // custom callback filter
  if (isFunction(updateFilter)) {
    return !!updateFilter(args);
  }

  const { fullQualifiedName, valueChange, errorChange } = updateFilter as SimpleFormUpdateFilterFullQualifiedName;

  if (!fullQualifiedName?.length) {
    return true;
  }

  // full qualified field name filter
  if (valueChange === false && errorChange === false) {
    return false;
  }

  const { oldState, newState } = args;

  if (!oldState) {
    return true;
  }

  if (valueChange !== false) {
    // update parent component on value change
    if (!fullQualifiedName) {
      return oldState.formData !== newState.formData;
    }
    else {
      // compare values
      return fullQualifiedName.some(t => getFormFieldValue(oldState, t) !== getFormFieldValue(newState, t));
    }
  }

  if (errorChange !== false) {
    // update parent component on error change
    if (!fullQualifiedName) {
      return oldState.formErrors !== newState.formErrors;
    }
    else {
      // compare values
      return fullQualifiedName.some(t => getFormFieldError(oldState, t) !== getFormFieldError(newState, t));
    }
  }

  // should not reach this line
  return false;
};

export function getResolvedFormState<Schema extends FieldTypes = FieldTypes, Data extends object = object>(
  formState: SimpleFormState | StateReturn<SimpleFormState<Schema, Data>>
): SimpleFormState  {
  return isArray(formState) ? formState[0] : formState;
}

// INPUTS

// TODO
// export function registerFormInput<Schema extends FieldTypes = FieldTypes, Data extends object = object>(
//   formState: StateReturn<SimpleFormState<Schema, Data>>,
//   fieldType: FieldType
// ): SimpleFormState<Schema, Data> {
//   return {} as any; 
// }

// FIELD VALUES

export function getFormFieldValue<Value = unknown, Schema extends FieldTypes = FieldTypes, Data extends object = object>(
  formState: SimpleFormState | StateReturn<SimpleFormState<Schema, Data>>,
  fullQualifiedName: string
): Value | undefined {
  const state = getResolvedFormState(formState);

  return state.formDefinition.options?.flatModel
    ? (state.formData as any)[fullQualifiedName]
    : getChildMemberValue(state.formData, fullQualifiedName);
}

export function setFormFieldValue<Schema extends FieldTypes = FieldTypes, Data extends object = object>(
  [formState, setFormState]: StateReturn<SimpleFormState<Schema, Data>>,
  fullQualifiedName: string,
  value: unknown,
  validate: boolean,
  validationOptions?: SimpleFormValidationOptions
): SimpleFormState<Schema, Data> {
  if (formState.formDefinition.options?.flatModel) {
    (formState.formData as any)[fullQualifiedName] = value;
  } else {
    setChildMemberValue(formState.formData, fullQualifiedName, value);
  }

  logTrace(
    `[setFormFieldValue] ${fullQualifiedName} was set to ${value}`,
    { fullQualifiedName, value, formState },
    REACT_SIMPLE_FORM.LOGGING.logLevel);

  if (validate) {
    formState = validateForm([formState, setFormState], validationOptions);
  }
  
  return setFormState(formState);
}

export function getFormFieldValues<Schema extends FieldTypes = FieldTypes, Data extends object = object>(
  formState: SimpleFormState | StateReturn<SimpleFormState<Schema, Data>>,
  fullQualifiedNames: string[]
): FormFieldValues {
  const state = getResolvedFormState(formState);
  const result: FormFieldValues = {};

  if (state.formDefinition.options?.flatModel) {
    for (const fullQualifiedName of fullQualifiedNames) {
      result[fullQualifiedName] = (state.formData as any)[fullQualifiedName];
    }
  }
  else {
    for (const fullQualifiedName of fullQualifiedNames) {
      result[fullQualifiedName] = getChildMemberValue(state.formData, fullQualifiedName);
    }
  }

  return result;
}

export function setFormFieldValues<Schema extends FieldTypes = FieldTypes, Data extends object = object>(
  [formState, setFormState]: StateReturn<SimpleFormState<Schema, Data>>,
  values: FormFieldValues,
  validate: boolean,
  validationOptions?: SimpleFormValidationOptions
): SimpleFormState<Schema, Data> {
  if (formState.formDefinition.options?.flatModel) {
    for (const [fullQualifiedName, value] of Object.entries(values)) {
      (formState.formData as any)[fullQualifiedName] = value;
    }
  }
  else {
    for (const [fullQualifiedName, value] of Object.entries(values)) {
      setChildMemberValue(formState.formData, fullQualifiedName, value);
    }
  }

  if (validate) {
    formState = validateForm([formState, setFormState], validationOptions);
  }

  logTrace(log => log(
    `[setFormFieldValues] [${Object.keys(values).join(", ")}] were set to [${Object.values(values).join(", ")}]`,
    { values, formState },
    REACT_SIMPLE_FORM.LOGGING.logLevel
  ));

  return setFormState(formState);
}

// ERRORS

export function getFormFieldError<Schema extends FieldTypes = FieldTypes, Data extends object = object>(
  formState: SimpleFormState | StateReturn<SimpleFormState<Schema, Data>>,
  fullQualifiedName: string
): FieldValidationResult | undefined {
  return getChildValidationResult(getResolvedFormState(formState).formErrors, fullQualifiedName);
}

export function clearFormFieldErrors<Schema extends FieldTypes = FieldTypes, Data extends object = object>(
  [formState, setFormState]: StateReturn<SimpleFormState<Schema, Data>>,
): SimpleFormState<Schema, Data> {
  formState = { ...formState, formErrors: getEmptyObjectValidationResult() };

  logTrace("[clearFormFieldErrors] Errors were cleared", { formState }, REACT_SIMPLE_FORM.LOGGING.logLevel);
  return setFormState(formState);
}

// TODO
// export function getFormFieldErrors<Schema extends FieldTypes = FieldTypes, Data extends object = object>(
//   formState: SimpleFormState | StateReturn<SimpleFormState<Schema, Data>>,
//   fullQualifiedNames: string[]
// ): { [fullQualifiedName: string]: FieldValidationResult } {
//   const state = getResolvedFormState(formState);
//   return {} as any;
// }

// export function setFormFieldErrors<Schema extends FieldTypes = FieldTypes, Data extends object = object>(
//   formState: StateReturn<SimpleFormState>,
//   errors: { [fullQualifiedName: string]: FieldRuleValidationResult[] | Partial<Pick<FieldValidationResult, "errors" | "childErrors" | "childResult">> }
// ): SimpleFormState<Schema, Data> {
//   return {} as any;
// }

// export function clearFieldErrors<Schema extends FieldTypes = FieldTypes, Data extends object = object>(
//   formState: StateReturn<SimpleFormState>,
//   fullQualifiedNames: string[]
// ): SimpleFormState<Schema, Data> {
//   return {} as any;
// }

// VALIDATION

export function validateForm<Schema extends FieldTypes = FieldTypes, Data extends object = object>(
  [formState, setFormState]: StateReturn<SimpleFormState<Schema, Data>>,
  validationOptions?: SimpleFormValidationOptions
): SimpleFormState<Schema, Data> {
  const formErrors = validateObject(
    formState.formData,
    formState.formDefinition.formSchema,
    { ...formState.formDefinition.options?.validationOptions, ...validationOptions }
  );

  formState = { ...formState, formErrors };

  logTrace(
    `[validateForm] isValid: ${formErrors.isValid}`,
    { formState, options: validationOptions, formErrors },
    REACT_SIMPLE_FORM.LOGGING.logLevel);

  return setFormState(formState);
}
