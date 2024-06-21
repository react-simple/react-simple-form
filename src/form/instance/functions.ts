import { deepCopyObject } from "@react-simple/react-simple-util";
import {
  FIELDS, FieldTypes, ObjectFieldType, getEmptyObjectValidationResult, mergeFieldValidationOptions
 } from "@react-simple/react-simple-validation";
import { InitGlobalStateOptions, initGlobalState } from "@react-simple/react-simple-state";
import { SimpleFormOptions, SimpleFormState } from "./types";
import { SimpleFormDefinition } from "form/definition";

export function getDefaultSimpleFormState<FormSchema extends FieldTypes = any, FormData extends object = object>(
  fullQualifiedName: string,
  formDefinition: SimpleFormDefinition<FormSchema, FormData>,
  formOptions?: SimpleFormOptions<FormSchema, FormData>
): SimpleFormState<FormSchema, FormData> {
  return {
    $form: {
      formName: formDefinition.formName,
      fullQualifiedName,
      formDefinition,
      formSchema: FIELDS.object(deepCopyObject(
        (formDefinition.formSchema as ObjectFieldType).baseType === "object" && (formDefinition.formSchema as ObjectFieldType).type === "object"
          ? (formDefinition.formSchema as ObjectFieldType<FormSchema>).schema
          : formDefinition.formSchema as FormSchema
      )),
      options: mergeFieldValidationOptions(formDefinition.options || {}, formOptions || {})
    },
    $errors: getEmptyObjectValidationResult()
  };
}

export function initSimpleFormState<FormSchema extends FieldTypes = any, FormData extends object = object>(
  fullQualifiedName: string,
  formDefinition: SimpleFormDefinition<FormSchema, FormData>,
  formOptions?: SimpleFormOptions<FormSchema, FormData>,
  options?: InitGlobalStateOptions<SimpleFormState<FormSchema, FormData>>
): SimpleFormState<FormSchema, FormData> {
  return initGlobalState(
    fullQualifiedName,
    getDefaultSimpleFormState(fullQualifiedName, formDefinition, formOptions),
    options);
}
