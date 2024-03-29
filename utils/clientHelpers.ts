export function userMessageIsContextual(message: string) {
  return /^<\w+>/.test(message);
}

const dictionaryUrl = process.env.SCHOOL_DICTIONARY_URL;
const dictionaryKey = process.env.SCHOOL_DICTIONARY_KEY;
const dictionaryAudioUrl = process.env.SCHOOL_DICTIONARY_AUDIO_URL;

type WordPronunciation = {
  hw: string;
  audioUrl: string;
};

export async function getWordPronunciationFromMW(
  word: string,
): Promise<WordPronunciation | null> {
  if (!word) {
    return null;
  }

  const response = await fetch(`${dictionaryUrl}${word}?key=${dictionaryKey}`);

  if (!response.ok) {
    throw new Error("Error fetching pronunciation from dictionary API");
  }

  const data = await response.json();

  if (!data || !data[0]) {
    return null;
  }

  const hw = data[0].hwi.hw;
  const audioFileName = data[0].hwi.prs[0].sound.audio;

  /*
  if audio begins with "bix", the subdirectory should be "bix",
  if audio begins with "gg", the subdirectory should be "gg",
  if audio begins with a number or punctuation (eg, "_"), the subdirectory should be "number",
  otherwise, the subdirectory is equal to the first letter of audio.
  */

  let subdirectory = "";
  if (audioFileName.startsWith("bix")) {
    subdirectory = "bix";
  } else if (audioFileName.startsWith("gg")) {
    subdirectory = "gg";
  } else if (audioFileName.match(/^[0-9\W]/)) {
    subdirectory = "number";
  } else {
    subdirectory = audioFileName[0];
  }

  const audioResponse = await fetch(
    `${dictionaryAudioUrl}${subdirectory}/${audioFileName}.mp3`,
  );

  if (!audioResponse.ok) {
    throw new Error("Error fetching audio from dictionary API");
  }

  const audioBlob = await audioResponse.blob();
  const audioUrl = URL.createObjectURL(audioBlob);

  return { hw, audioUrl };
}
