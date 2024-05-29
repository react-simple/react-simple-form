import {ObjectValidationResult, FieldTypes } from "@react-simple/react-simple-validation";
import { SimpleFormDefinition } from "form/definition";

export interface SimpleFormState<FormSchema extends FieldTypes = any, FormData extends object = object> {
  readonly formDefinition: SimpleFormDefinition<FormSchema, FormData>;
  readonly formData: FormData;
  readonly formErrors: ObjectValidationResult<FormSchema>;
}

export type FormFieldValues = { [fullQualifiedName: string]: undefined };
