import * as React from "react";
import type { Meta } from '@storybook/react';
import { LOG_LEVELS, LogLevel, StorybookComponent, logInfo } from "@react-simple/react-simple-util";
import { getFormFieldValue, setFormFieldValue, useFormState } from "hooks";
import { Stack } from "@react-simple/react-simple-ui";
import { SimpleFormDefinition } from "form";
import { REACT_SIMPLE_FORM } from "data";
import { FIELDS, RULES } from "@react-simple/react-simple-validation";

const TITLE = "useFormState / Manually binding inputs";
const DESC = <>Inputs are manually binded by setting value and onBlur/onChange attributes.</>;

const FORM_DEF: SimpleFormDefinition = {
  formName: "Test form",
  formSchema: {
    obj1: FIELDS.object({
      text1: FIELDS.text([RULES.conditions.compare("equals", "@param1")])
    })
  },
  options: {
    validationOptions: {
      namedObjs: {
        param1: {
          type: FIELDS.text(),
          value: "123"
        }
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

  logInfo("[Component]: render", props, REACT_SIMPLE_FORM.LOGGING.logLevel);
  const formState = useFormState({ formDefinition: FORM_DEF });

  return (
    <Stack>
      <p>{DESC}</p>

      <label htmlFor="text_input">Text input</label>

      <input id="text_input"
        value={getFormFieldValue(formState, "obj1.text1") || ""}
        onChange={e => setFormFieldValue(formState, "obj1.text1", e.target.value, true)}
      />

      <input id="text_input_copy"
        value={getFormFieldValue(formState, "obj1.text1") || ""}
        onChange={e => setFormFieldValue(formState, "obj1.text1", e.target.value, true)}
      />
    </Stack>
  );
};

type SC = StorybookComponent<ComponentProps>;
const Template: SC = args => <Component {...args} />;

export const Default: SC = Template.bind({});

const meta: Meta<typeof useFormState> = {
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
