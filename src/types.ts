import { LogLevel } from "@react-simple/react-simple-util";
import { ReactSimpleFormDependencyInjection } from "types.di";

export interface ReactSimpleForm {
	LOGGING: {
		logLevel: LogLevel; // for functions in react-simple-form
	};

	DI: ReactSimpleFormDependencyInjection;
}
