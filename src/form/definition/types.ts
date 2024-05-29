import { FieldTypes } from "@react-simple/react-simple-validation";

export interface SimpleFormOptions<FormData = any> {
  readonly flatModel?: boolean;
  readonly defaultValues?: FormData;
}

export interface SimpleFormCallbacks<FormData = any> {
}

export interface SimpleFormDefinition<FormSchema extends FieldTypes = any, FormData = any> {
  readonly formName: string;
  readonly formSchema: FormSchema;
  readonly options?: SimpleFormOptions<FormData>;
}
