import { StateReturn } from "@react-simple/react-simple-state";
import { FieldRuleValidationResult, FieldTypes, FieldValidationResult } from "@react-simple/react-simple-validation";
import { FormFieldValues, SimpleFormState } from "form";

// TODO

// FORM

export const getFormGlobalStateKey = (formName: string) => {
  return `SIMPLE_FORM.${formName}`;
};

export function formReset<FormSchema extends FieldTypes = FieldTypes, FormData extends object = object>(
  formState: StateReturn<SimpleFormState<FormSchema, FormData>>,
  options?: {
    setDefaultValues?: boolean; // default is 'true1
    clearErrors?: boolean; // default is 'true'
  }): SimpleFormState<FormSchema, FormData> {
  return {} as any;
}

// FIELDS

export function setFormFieldValue<FormSchema extends FieldTypes = FieldTypes, FormData extends object = object>(
  formState: StateReturn<SimpleFormState<FormSchema, FormData>>,
  fullQualifiedName: string,
  value: unknown
): SimpleFormState<FormSchema, FormData> {
  return {} as any;
};

export const getFormFieldValue = <Value = unknown>(
  formState: SimpleFormState,
  fullQualifiedName: string
) => {
  return {} as Value;
};

export function clearFormFieldValue<FormSchema extends FieldTypes = FieldTypes, FormData extends object = object>(
  formState: StateReturn<SimpleFormState>,
  fullQualifiedName: string
): SimpleFormState<FormSchema, FormData> {
  return {} as any;
}

export function setFormFieldValues<FormSchema extends FieldTypes = FieldTypes, FormData extends object = object>(
  formState: StateReturn<SimpleFormState<FormSchema, FormData>>,
  values: FormFieldValues
): SimpleFormState<FormSchema, FormData> {
  return {} as any;
};

export function getFormFieldValues(
  formState: SimpleFormState,
  fullQualifiedNames: string[]
): FormFieldValues {
  return {};
};

export function clearFormFieldValues<FormSchema extends FieldTypes = FieldTypes, FormData extends object = object>(
  formState: StateReturn<SimpleFormState>,
  fullQualifiedNames: string[]
): SimpleFormState<FormSchema, FormData> {
  return {} as any;
}

// ERRORS

export function setFormFieldError<FormSchema extends FieldTypes = FieldTypes, FormData extends object = object>(
  formState: StateReturn<SimpleFormState>,
  fullQualifiedName: string,
  errors: FieldRuleValidationResult[] | Partial<Pick<FieldValidationResult, "errors" | "childErrors" | "childResult">>
): SimpleFormState<FormSchema, FormData> {
  return {} as any;
}

export function getFieldError(
  formState: SimpleFormState,
  fullQualifiedName: string
): FieldValidationResult {
  return {} as any;
}

export function clearFieldError<FormSchema extends FieldTypes = FieldTypes, FormData extends object = object>(
  formState: StateReturn<SimpleFormState>,
  fullQualifiedName: string
): SimpleFormState<FormSchema, FormData> {
  return {} as any;
}

export function setFormFieldErrors<FormSchema extends FieldTypes = FieldTypes, FormData extends object = object>(
  formState: StateReturn<SimpleFormState>,
  errors: { [fullQualifiedName: string]: FieldRuleValidationResult[] | Partial<Pick<FieldValidationResult, "errors" | "childErrors" | "childResult">> }
): SimpleFormState<FormSchema, FormData> {
  return {} as any;
}

export function getFormFieldErrors(
  formState: SimpleFormState,
  fullQualifiedNames: string[]
): {[fullQualifiedName: string]: FieldValidationResult } {
  return {} as any;
}

export function clearFieldErrors<FormSchema extends FieldTypes = FieldTypes, FormData extends object = object>(
  formState: StateReturn<SimpleFormState>,
  fullQualifiedNames: string[]
): SimpleFormState<FormSchema, FormData> {
  return {} as any;
}
