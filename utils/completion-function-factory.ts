import * as completionFunctions from "./completion-functions";

export type CompletionFunctionMap = {
  [key: string]: (...args: any[]) => any;
};

const completionFunctionMap: CompletionFunctionMap = completionFunctions;

const completionFunctionFactory =
  (completionFunctionMap: CompletionFunctionMap) =>
  (completionFunctionName: string, argsJSONString: string) => {
    const func = completionFunctionMap[completionFunctionName];
    if (typeof func === "function") {
      const args = JSON.parse(argsJSONString);
      return func(...Object.values(args));
    } else {
      throw new Error(`Function ${completionFunctionName} does not exist.`);
    }
  };

export const callCompletionFunction = completionFunctionFactory(
  completionFunctionMap,
);
