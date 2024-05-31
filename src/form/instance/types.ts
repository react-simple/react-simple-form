import { StateChangeArgs } from "@react-simple/react-simple-state";
import { ObjectValidationResult, FieldTypes } from "@react-simple/react-simple-validation";
import { SimpleFormDefinition } from "form/definition";

export interface SimpleFormState<Schema extends FieldTypes = any, Data extends object = object> {
  readonly formDefinition: SimpleFormDefinition<Schema, Data>;
  readonly formData: Data;
  readonly formErrors: ObjectValidationResult<Schema>;
}

export type FormFieldValues = { [fullQualifiedName: string]: unknown };

export interface SimpleFormUpdateFilterFullQualifiedName {
  readonly fullQualifiedName: string[]; // filter fields by name
  readonly valueChange?: boolean; // update this component if values change, default is 'true'
  readonly errorChange?: boolean; // update this component if errors change, default is 'true'
}

export type SimpleFormUpdateFilterCallback<Schema extends FieldTypes = any, Data extends object = object> =
  (args: StateChangeArgs<SimpleFormState<Schema, Data>>) => boolean; // custom callback to compare before-after state to decide

export type SimpleFormUpdateFilter<Schema extends FieldTypes = any, Data extends object = object> =
  | SimpleFormUpdateFilterFullQualifiedName
  | SimpleFormUpdateFilterCallback<Schema, Data>;
