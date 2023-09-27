import { PromptTemplate } from "langchain/prompts";

export function getPromptTemplate(
  type: string,
  content: string,
  isShorthand: boolean = false,
) {
  switch (type) {
    case "definition":
      return isShorthand
        ? definitionTemplateShorthand.format({ word: content })
        : definitionTemplate.format({ word: content });
    case "checkAnswer":
      return checkAnswerTemplate.format({ answer: content });
    case "greeting":
      return greetingTemplate.format({ studentName: content });
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

export const definitionTemplate = PromptTemplate.fromTemplate(
  "<<APP>>Define {word}. Review each definition of the word and only provide one definition that you think makes the most sense based on your review our conversation and my current assignment. Only give me the word, functional label, and definition without any extra text. e.g. 'apple (noun) : the fleshy, usually rounded red, yellow, or green edible pome fruit of a usually cultivated tree (genus Malus) of the rose family'. If no definition was found, say 'No definitions found. Word is either a name or does not exist in the Merriam-Webster Dictionary.'<</APP>>",
);
export const definitionTemplateShorthand =
  PromptTemplate.fromTemplate("Define {word}.");

export const checkAnswerTemplate = PromptTemplate.fromTemplate(
  "<<APP>>Please check my answer so far. Do not ask any follow-up questions. Only provide feedback.\n\n{answer}<</APP>>",
);

export const greetingTemplate = PromptTemplate.fromTemplate(
  "<<APP>>Please greet {studentName}.<</APP>>",
);
