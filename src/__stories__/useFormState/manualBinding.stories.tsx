import * as React from "react";
import type { Meta } from '@storybook/react';
import { LOG_LEVELS, LogLevel, StorybookComponent, logInfo } from "@react-simple/react-simple-util";
import { FIELDS, RULES } from "@react-simple/react-simple-validation";
import { Cluster, Stack } from "@react-simple/react-simple-ui";
import { SimpleFormDefinition, validateSimpleForm } from "form";
import { REACT_SIMPLE_FORM } from "data";
import { REACT_SIMPLE_STATE, getGlobalState, setGlobalState } from "@react-simple/react-simple-state";
import { useSimpleFormField, useSimpleFormState } from "hooks";

const TITLE = "useFormState / Manually binding inputs";
const DESC = <>Inputs are manually bound by setting value and onBlur/onChange attributes.</>;

const fullQualifiedName = "forms.manualBinding";

const formDefinition: SimpleFormDefinition = {
  formName: "Test form",
  formSchema: {
    obj1: FIELDS.object({
      text1: FIELDS.text([RULES.conditions.compare("equals", "@param1")])
    })
  },
  options: {
    namedObjs: {
      // define @param1
      param1: {
        type: FIELDS.text(),
        value: "123"
      }
    }
  }
};

interface ComponentProps {
  logLevel: LogLevel;
}

const Component = (props: ComponentProps) => {
  // this is not a state, in real app we only set it once at the beginning
  REACT_SIMPLE_FORM.LOGGING.logLevel = props.logLevel;
  logInfo("[Component]: render", { args: props, logLevel: REACT_SIMPLE_FORM.LOGGING.logLevel });
    
  // using the whole form will update the component on any changes
  const { getFieldValue, setFieldValue } = useSimpleFormState({ fullQualifiedName, formDefinition });

  // using a single field will update the component only if that field gets changed
  const field = useSimpleFormField<string>({
    fullQualifiedName: {
      form: fullQualifiedName,
      field: "obj1.text1"
    }
  });

  console.log(field);

  return (
    <Stack>
      <p>{DESC}</p>
      <Cluster>
        <input type="button" value="Trace root state" style={{ padding: "0.5em 1em" }}
          onClick={() => console.log("state", getGlobalState(""))} />

        <input type="button" value="Trace subscriptions" style={{ padding: "0.5em 1em" }}
          onClick={() => console.log("subscriptions", REACT_SIMPLE_STATE.ROOT_STATE.subscriptions)} />

        <input type="button" value="Trace contexts" style={{ padding: "0.5em 1em" }}
          onClick={() => console.log("contexts", REACT_SIMPLE_STATE.CONTEXTS)} />

        <input type="button" value="Validate form" style={{ padding: "0.5em 1em" }}
          onClick={() => console.log("errors", validateSimpleForm(fullQualifiedName)?.errorsFlatList)} />
      </Cluster>

      <label htmlFor="text_input">Text input - useSimpleFormState.setFieldValue()</label>
      <Cluster>
        <input id="text_input"
          // Field values are stored in global state and we can access that in different ways.
          value={getFieldValue("obj1.text1") || ""} // controlled input
          onChange={e => setFieldValue("obj1.text1", e.target.value)}
        />
      </Cluster>

      <label htmlFor="text_input">Text input - setGlobalState()</label>
      <Cluster>
        <input id="text_input_2"
          // We cannot use <StateContext fullQualifiedNamePrefix={fullQualifiedName} /> here since functions cannot access React.context.
          value={getGlobalState(`${fullQualifiedName}.obj1.text1`) || ""} // controlled input
          onChange={e => setGlobalState(`${fullQualifiedName}.obj1.text1`, e.target.value)}
        />
      </Cluster>

      <label htmlFor="text_input">Text input - useSimpleFormField.setValue()</label>
      <Cluster>
        <input id="text_input_3"
          // We cannot use <StateContext fullQualifiedNamePrefix={fullQualifiedName} /> here since functions cannot access React.context.
          value={field.value || ""} // controlled input
          onChange={e => field.setValue(e.target.value)}
        />
      </Cluster>
    </Stack>
  );
};

type SC = StorybookComponent<ComponentProps>;
const Template: SC = args => <Component {...args} />;

export const Default: SC = Template.bind({});

const meta: Meta = {
  component: Component,
  title: TITLE,
  args: {
    logLevel: "info"
  },
  argTypes: {
    logLevel: {
      title: "Log level",
      control: { type: "select" },
      options: Object.keys(LOG_LEVELS)
    }
  }
};

export default meta;
