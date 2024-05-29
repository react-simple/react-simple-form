import { FieldTypes } from "@react-simple/react-simple-validation";
import { SimpleFormDefinition, SimpleFormState } from "form";

export interface UseSimpleFormProps<FormSchema extends FieldTypes = any, FormData = any,> {
  readonly formDefinition: SimpleFormDefinition<FormSchema, FormData>;

  // if specified the parent component will only get updated if these field (values or errors) change
  readonly filter?: string[] | ((fullQualifiedFieldName: string) => boolean);
}

export interface UseSimpleFormReturn<FormSchema extends FieldTypes = any, FormData = any> {
  readonly formState: SimpleFormState<FormSchema, FormData>;
}
