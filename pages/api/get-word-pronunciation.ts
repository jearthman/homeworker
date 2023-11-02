import { NextApiRequest, NextApiResponse } from "next";

const dictionaryUrl = process.env.SCHOOL_DICTIONARY_URL;
const dictionaryKey = process.env.SCHOOL_DICTIONARY_KEY;
const dictionaryAudioUrl = process.env.SCHOOL_DICTIONARY_AUDIO_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let { word } = req.query;

  if (Array.isArray(word)) {
    word = word[0];
  }

  if (!word) {
    return null;
  }

  //remove non-alphanumeric characters from word
  word = word.replace(/[^a-zA-Z0-9]/g, "");

  const response = await fetch(`${dictionaryUrl}${word}?key=${dictionaryKey}`);

  if (!response.ok) {
    throw new Error("Error fetching pronunciation from dictionary API");
  }

  const data = await response.json();

  if (!data || !data[0]) {
    return null;
  }

  const hw = data[0].hwi.hw;
  let audioFileName = null;
  if (data[0].hwi?.prs[0]?.sound?.audio) {
    audioFileName = data[0].hwi.prs[0].sound.audio;
  } else {
    return res.status(200).json({ hw, audioUrl: null });
  }

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

  const audioBuffer = await audioResponse.arrayBuffer();
  const base64Audio = Buffer.from(audioBuffer).toString("base64");
  return res.status(200).json({ hw, base64Audio });
}
