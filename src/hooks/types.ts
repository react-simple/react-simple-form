import { StateReturn } from "@react-simple/react-simple-state";
import { FieldTypes } from "@react-simple/react-simple-validation";
import { SimpleFormDefinition, SimpleFormUpdateFilter, SimpleFormState, SimpleFormValidationOptions } from "form";

export interface UseFormStateProps<Schema extends FieldTypes = any, Data extends object = object,> {
  readonly formDefinition: SimpleFormDefinition<Schema, Data>;
  readonly formValidationOptions?: SimpleFormValidationOptions;

  // If specified the parent component will only get updated if these field (values or errors) change
  // Instead of selectors we use update filters. 
  readonly updateFilter?: SimpleFormUpdateFilter<Schema, Data>;
}

export type UseFormStateReturn<Schema extends FieldTypes = any, Data extends object = object> =
  StateReturn<SimpleFormState<Schema, Data>>;
