import pretty from "pino-pretty";

import pino from "pino";
export const loggerManager = () => pino(pretty());
