import { FieldTypes, FieldValidationOptions } from "@react-simple/react-simple-validation";

export type SimpleFormValidationOptions = FieldValidationOptions;

export interface SimpleFormCallbacks<Schema extends FieldTypes = any, Data extends object = object> {
}

export interface SimpleFormOptions<Schema extends FieldTypes = any, Data extends object = object> {
  readonly flatModel?: boolean;
  readonly defaultValues?: Data;
  readonly validationOptions?: Omit<SimpleFormValidationOptions, "incrementalValidation">;
  readonly callbacks?: SimpleFormCallbacks<Schema, Data>;
}

export interface SimpleFormDefinition<Schema extends FieldTypes = any, Data extends object = object> {
  readonly formName: string;
  readonly formSchema: Schema; // can be pre-defined, but inputs will be automatically registered, if not there yet
  readonly options?: SimpleFormOptions<Schema, Data>;
}
