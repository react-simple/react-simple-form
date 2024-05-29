import { StateChangeArgs, StateReturn } from "@react-simple/react-simple-state";
import { FieldTypes } from "@react-simple/react-simple-validation";
import { SimpleFormDefinition, SimpleFormState } from "form";

export interface UseFormStateProps<FormSchema extends FieldTypes = any, FormData extends object = object,> {
  readonly formDefinition: SimpleFormDefinition<FormSchema, FormData>;

  // if specified the parent component will only get updated if these field (values or errors) change
  readonly filter?: {
    readonly valueChange?: boolean; // update this component if values change, default is 'true'
    readonly errorChange?: boolean; // update this component if errors change, default is 'true'

    readonly fullQualifiedFieldNames: string[]; // filter fields by name
    readonly getUpdates?: (args: StateChangeArgs<SimpleFormState<FormSchema, FormData>>) => boolean; // custom callback to compare before-after state to decide
  };
}

export type UseFormStateReturn<FormSchema extends FieldTypes = any, FormData extends object = object> = StateReturn<SimpleFormState<FormSchema, FormData>>;
