export function getInteractionContentString(
  type: string,
  word: string,
  isShorthand: boolean = false,
) {
  switch (type) {
    case "definition":
      return isShorthand
        ? DEFINITION_INSTRUCTION_SHORTHAND.replace("<WORD>", word)
        : DEFINITION_INSTRUCITON.replace("<WORD>", word);
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
  "Define '<WORD>'. Only give me one definition that you think makes the most sense based on our conversation and the assignment.Only give me the definition without any extra text.";
export const DEFINITION_INSTRUCTION_SHORTHAND = "Define '<WORD>'.";
