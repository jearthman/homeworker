import { PromptTemplate } from "langchain/prompts";

export function getPromptTemplate(
  type: string,
  content: string[],
  isShorthand: boolean = false,
) {
  switch (type) {
    case "definition":
      return isShorthand
        ? definitionTemplateShorthand.format({
            word: content[0],
            sentence: content[1],
          })
        : definitionTemplate.format({ word: content[0], sentence: content[1] });
    case "checkAnswer":
      return checkAnswerTemplate.format({ answer: content[0] });
    case "greeting":
      return greetingTemplate.format({ studentName: content[0] });
    case "synonyms":
      return synonymsTemplate.format({ word: content[0] });
    case "etymology":
      return etymologyTemplate.format({ word: content[0] });
    default:
      return "";
  }
}

const definitionTemplate = PromptTemplate.fromTemplate(
  "Define '{word}' from the sentence: '{sentence}'. Review each definition of the word and only provide one definition that you think makes the most sense based on your review our conversation and my current assignment. Only responed with the word, functional label, and definition without any extra text or explanation, like this example: 'apple (noun) : the fleshy, usually rounded red, yellow, or green edible pome fruit of a usually cultivated tree (genus Malus) of the rose family'. If no definition was found, say 'No definitions found. Word is either a name or does not exist in the Merriam-Webster Dictionary.'",
);
const definitionTemplateShorthand =
  PromptTemplate.fromTemplate("Define {word}.");

const checkAnswerTemplate = PromptTemplate.fromTemplate(
  "<<APP>>Please check my answer so far. Do not ask any follow-up questions. Only provide feedback.\n\n{answer}<</APP>>",
);

const greetingTemplate = PromptTemplate.fromTemplate(
  "<<APP>>Please greet {studentName}.<</APP>>",
);

const synonymsTemplate = PromptTemplate.fromTemplate(
  "Please provide up to five synonyms for '{word}'. Just list the synonyms separated by commas. For example, 'big, large, huge'.",
);

const etymologyTemplate = PromptTemplate.fromTemplate(
  "Please provide the etymology of '{word}' in one concise sentence.",
);
