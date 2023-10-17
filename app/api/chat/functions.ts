import { ChatCompletionCreateParams } from "openai/resources/chat/index";

export const functions: ChatCompletionCreateParams.Function[] = [
  {
    name: "getDefinitions",
    description:
      "Get a list definitions for a word using the Merriam-Webster Dictionary API when the user asks for the definition of a word",
    parameters: {
      type: "object",
      properties: {
        word: {
          type: "string",
          description:
            "The word that the user needs defined and get the definitions for",
        },
      },
      required: ["word"],
    },
  },
];

const dictionaryUrl = process.env.LEARNER_DICTIONARY_URL;
const dictionaryKey = process.env.LEARNER_DICTIONARY_KEY;

const wolframAlphaLLMAPIUrl = process.env.WOLFRAM_ALPHA_LLM_API_URL;
const wolmramAlphaAppId = process.env.WOLFRAM_ALPHA_APP_ID;

type Definition = {
  headWord: string;
  functionalLabel: string;
  stems: string[];
  shortDefinitions: string[];
};

async function getDefinitions(word: string) {
  try {
    return fetch(`${dictionaryUrl}${word}?key=${dictionaryKey}`).then(
      async (res) => {
        try {
          const dictionaryRes = await res.json();

          if (typeof dictionaryRes[0] === "string") {
            return "No definitions found. Word is either a name or does not exist in the Merriam-Webster Dictionary.";
          }

          const definitions = dictionaryRes.map(
            (definitionJSON: any): Definition => {
              return {
                headWord: definitionJSON?.hwi?.hw,
                functionalLabel: definitionJSON?.fl,
                stems: definitionJSON?.stems,
                shortDefinitions: definitionJSON?.shortdef,
              };
            },
          );

          return JSON.stringify(definitions);
        } catch (error: any) {
          console.log(
            "There was an error parsing the Merriam-Webster Dictionary API response: ",
            error,
          );
          return error;
        }
      },
    );
  } catch (error: any) {
    console.log(
      "There was an error using the Merriam-Webster Dictionary API: ",
      error,
    );
    return error;
  }
}

export async function runFunction(name: string, args: any) {
  switch (name) {
    case "getDefinitions":
      return await getDefinitions(args.word);
  }
}
