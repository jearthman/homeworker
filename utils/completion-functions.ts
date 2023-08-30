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
        const dictionaryRes = await res.json();

        const definitions = dictionaryRes.map(
          (definitionJSON: any): Definition => {
            return {
              headWord: definitionJSON.hwi.hw,
              functionalLabel: definitionJSON.fl,
              stems: definitionJSON.stems,
              shortDefinitions: definitionJSON.shortdef,
            };
          },
        );

        return JSON.stringify(definitions);
      },
    );
  } catch (error: any) {
    console.log("There was an error with getDefinitions: ", error);
    return null;
  }
}
