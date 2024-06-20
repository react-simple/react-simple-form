import { FieldTypes, FieldValidationOptions } from "@react-simple/react-simple-validation";

export interface SimpleFormDefinitionOptions<FormData extends object = object> {
  readonly defaultValues?: FormData;
  readonly namedObjs?: FieldValidationOptions["namedObjs"];
}

export interface SimpleFormDefinition<FormSchema extends FieldTypes = any, FormData extends object = object> {
  readonly formName: string;
  readonly formSchema: FormSchema;
  readonly options?: SimpleFormDefinitionOptions<FormData>;
}
