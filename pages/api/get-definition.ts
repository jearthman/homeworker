import { NextApiRequest, NextApiResponse } from "next";

const dictionaryUrl = process.env.SCHOOL_DICTIONARY_URL;
const dictionaryKey = process.env.SCHOOL_DICTIONARY_KEY;

export default async function getDefinition(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { word } = req.query;
  const response = await fetch(`${dictionaryUrl}${word}?key=${dictionaryKey}`);
  const data = await response.json();
  res.status(200).json(data);
}
