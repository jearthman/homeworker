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

export async function getDefinitions(word: string) {
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

export async function getMathSolution(equation: string) {
  //If the equation is in LaTeX format, convert it to plain text
  // if (equation.startsWith("\\(") && equation.endsWith("\\)")) {
  //   equation = equation.substring(2, equation.length - 2);
  // }

  //If the equation is not a URI component, convert it to a URL encoded string
  if (!decodeURIComponent(equation)) {
    equation = encodeURIComponent(equation);
  }

  try {
    return fetch(
      `${wolframAlphaLLMAPIUrl}?input=${equation}&appid=${wolmramAlphaAppId}`,
    ).then(async (res) => {
      console.log("Wolfram Alpha LLM API response: ", res);
      switch (res.status) {
        case 200:
          const wolframAlphaLLMRes = await res.json();
          console.log(
            "Wolfram Alpha LLM API response JSON: ",
            wolframAlphaLLMRes,
          );
          return wolframAlphaLLMRes;
        case 400 || 501 || 403:
          return res.statusText;
        default:
          return "There was an error using the Wolfram Alpha LLM API.";
      }
    });
  } catch (error: any) {
    console.log("There was an error using the Wolfram Alpha LLM API: ", error);
    return error;
  }
}
