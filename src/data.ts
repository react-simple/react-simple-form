import { ReactSimpleForm } from "types";

// For depndency injection references. All stub references are set by the respective util files.
const stub: any = () => { };

// Custom types are set in types.custom.ts and can be set by the client code if more types are defined.
export const REACT_SIMPLE_FORM: ReactSimpleForm = {
	LOGGING: {
		logLevel: "error" // for functions in react-simple-form
	},

	DI: {
	}
};
