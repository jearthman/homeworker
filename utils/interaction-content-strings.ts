export function getInteractionContentString(
  type: string,
  content: string,
  isShorthand: boolean = false,
) {
  switch (type) {
    case "definition":
      return isShorthand
        ? DEFINITION_INSTRUCTION_SHORTHAND.replace("<CONTENT>", content)
        : DEFINITION_INSTRUCITON.replace("<CONTENT>", content);
    case "checkAnswer":
      return CHECK_ANSWER_INSTRUCTION.replace("<CONTENT>", content);
    // case "example":
    //   return shorthand ? EXAMPLE_INSTRUCTION_SHORTHAND.replace("<WORD>", word) : EXAMPLE_INSTRUCTION.replace("<WORD>", word);
    // case "synonym":
    //   return shorthand ? SYNONYM_INSTRUCTION_SHORTHAND.replace("<WORD>", word) : SYNONYM_INSTRUCTION.replace("<WORD>", word);
    // case "antonym":
    //   return shorthand ? ANTONYM_INSTRUCTION_SHORTHAND.replace("<WORD>", word) : ANTONYM_INSTRUCTION.replace("<WORD>", word);
    // case "rhyme":
    //   return shorthand ? RHYME_INSTRUCTION_SHORTHAND.replace("<WORD>", word) : RHYME_INSTRUCTION.replace("<WORD>", word);
    // case "partOfSpeech":
    //   return shorthand ? PART_OF_SPEECH_INSTRUCTION_SHORTHAND.replace("<WORD>", word) : PART_OF_SPEECH_INSTRUCTION.replace("<WORD>", word);
    // case "sentence":
    //   return shorthand ? SENTENCE_INSTRUCTION_SHORTHAND.replace("<WORD>", word) : SENTENCE_INSTRUCTION.replace("<WORD>", word);
    // case "word":
    //   return shorthand ? WORD_INSTRUCTION_SHORTHAND : WORD_INSTRUCTION;
    default:
      return "";
  }
}

export const DEFINITION_INSTRUCITON =
  "Define '<CONTENT>'. Review each definition of the word and only provide one definition that you think makes the most sense based on your review our conversation and my current assignment. Only give me the word, functional label, and definition without any extra text. e.g. 'apple (noun) : the fleshy, usually rounded red, yellow, or green edible pome fruit of a usually cultivated tree (genus Malus) of the rose family'. If no definition was found, say 'No definitions found. Word is either a name or does not exist in the Merriam-Webster Dictionary.'";
export const DEFINITION_INSTRUCTION_SHORTHAND = "Define '<CONTENT>'.";

export const CHECK_ANSWER_INSTRUCTION =
  "Please check my answer so far.\n\n<CONTENT>";
