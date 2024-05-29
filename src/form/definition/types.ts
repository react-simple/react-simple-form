import { FieldTypes } from "@react-simple/react-simple-validation";

export interface SimpleFormOptions<FormData extends object = object> {
  readonly flatModel?: boolean;
  readonly defaultValues?: FormData;
}

export interface SimpleFormCallbacks<FormData extends object = object> {
}

export interface SimpleFormDefinition<FormSchema extends FieldTypes = any, FormData extends object = object> {
  readonly formName: string;
  readonly formSchema: FormSchema;
  readonly options?: SimpleFormOptions<FormData>;
}
