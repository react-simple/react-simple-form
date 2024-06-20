import { ObjectValidationResult, FieldTypes } from "@react-simple/react-simple-validation";
import { SimpleFormDefinition, SimpleFormDefinitionOptions } from "form/definition";
import { SimpleFormValidationOptions } from "form/validation";

// TODO
export interface SimpleFormCallbacks<FormSchema extends FieldTypes = any, FormData extends object = object> {
}

export interface SimpleFormOptions<FormSchema extends FieldTypes = any, FormData extends object = object>
  extends SimpleFormDefinitionOptions<FormData> {
  
  readonly validationOptions?: SimpleFormValidationOptions;
  readonly callbacks?: SimpleFormCallbacks<FormSchema, FormData>;
}

// definition and schema is deep-cloned since inputs can register themselves in the schema of the instance
export interface SimpleFormInstance<FormSchema extends FieldTypes = any, FormData extends object = object> {
  readonly formName: string;
  readonly fullQualifiedName: string;
  readonly formDefinition: SimpleFormDefinition<FormSchema, FormData>;

  readonly formSchema: FormSchema; // schema of the instance, inputs will be automatically registered, if not present
  readonly options?: SimpleFormOptions<FormSchema, FormData>;
}

// Form data is stored in global state along with form state.
// fullQualifiedName specifies where the form data is stored in global state.
// We add these members to that state node to store the form state.
// Since form data and form errors are stored in global state update filter logic can be applied to those.
export interface SimpleFormState<Schema extends FieldTypes = any, Data extends object = object> {
  readonly $form: SimpleFormInstance<Schema, Data>;
  readonly $errors: ObjectValidationResult<Schema>;
}
