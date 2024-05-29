import {ObjectValidationResult, FieldTypes } from "@react-simple/react-simple-validation";

export interface SimpleFormState<FormSchema extends FieldTypes = any, FormData = any> {
  readonly formData: FormData;
  readonly errors: ObjectValidationResult<FormSchema>;
}
