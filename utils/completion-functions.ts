const dictionaryUrl = process.env.LEARNER_DICTIONARY_URL;
const dictionaryKey = process.env.LEARNER_DICTIONARY_KEY;

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
            "There was an error parsing the MW API response: ",
            error,
          );
          return error;
        }
      },
    );
  } catch (error: any) {
    console.log("There was an error using the MW API: ", error);
    return error;
  }
}
