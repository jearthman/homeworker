const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.assignment.createMany({
    data: [
      {
        title: "Simple Addition",
        description: "Solve the following addition problems.",
        subject: "Mathematics",
        gradeLevel: "2",
        gradingCriteria: "Each correct answer: 10 points, Neatness: 10 points",
      },
      {
        title: "My Favorite Story",
        description:
          "Write a short paragraph about a favorite storybook character, describing the character and explaining why it’s a favorite.",
        subject: "Language Arts",
        gradeLevel: "2",
        gradingCriteria:
          "Identification of character: 5 points, Description of character: 5 points, Explanation of preference: 5 points, Grammar and spelling: 5 points",
      },
      {
        title: "Plant Observation",
        description:
          "Observe a plant, draw and label its parts, and write about what it needs to grow.",
        subject: "Science",
        gradeLevel: "2",
        gradingCriteria:
          "Accurate drawing of plant: 5 points, Correct labeling of parts: 5 points, Explanation of growth needs: 5 points, Overall effort and observation: 5 points",
      },
      {
        title: "Multiplication Practice",
        description: "Solve the following multiplication problems.",
        subject: "Mathematics",
        gradeLevel: "4",
        gradingCriteria: "Each correct answer: 6 points, Neatness: 10 points",
      },
      {
        title: "Weather Watcher",
        description:
          "Observe and describe the weather, use weather-related vocabulary, and make a prediction for the next day.",
        subject: "Science",
        gradeLevel: "4",
        gradingCriteria:
          "Description of current weather: 5 points, Usage of weather-related vocabulary: 5 points, Prediction for next day’s weather: 5 points, Clarity and organization: 5 points",
      },
      {
        title: "State Report",
        description:
          "Choose a U.S. state and write a one-page report including key facts like the state capital, bird, flower, etc.",
        subject: "Social Studies",
        gradeLevel: "4",
        gradingCriteria:
          "Inclusion of key facts about state: 10 points, Organization and presentation: 5 points, Grammar and spelling: 5 points",
      },
      {
        title: "Fraction Operations",
        description:
          "Perform the following operations and simplify the fractions.",
        subject: "Mathematics",
        gradeLevel: "6",
        gradingCriteria:
          "Each correct answer: 8 points, Simplification: 2 points per problem, Neatness: 10 points",
      },
      {
        title: "Poetry Analysis",
        description:
          "Read a selected poem and write a brief analysis, focusing on the theme, tone, and a literary device used.",
        subject: "Language Arts",
        gradeLevel: "6",
        gradingCriteria:
          "Identification of theme, tone, literary device: 10 points, Analysis of the poem: 5 points, Clarity and grammar: 5 points",
      },
      {
        title: "Solar System Exploration",
        description:
          "Choose a planet in the solar system and write a summary of key characteristics such as size, composition, atmosphere, etc.",
        subject: "Science",
        gradeLevel: "6",
        gradingCriteria:
          "Selection and description of key characteristics: 10 points, Organization and clarity: 5 points, Accuracy and relevance of information: 5 points",
      },
    ],
  });

  await prisma.problem.createMany({
    data: [
      { content: "2 + 3", answer: "5", assignmentId: 1 },
      { content: "7 + 8", answer: "15", assignmentId: 1 },
      { content: "4 + 9", answer: "13", assignmentId: 1 },
      { content: "10 + 10", answer: "20", assignmentId: 1 },
      { content: "3 + 5", answer: "8", assignmentId: 1 },

      { content: "6 x 7", answer: "42", assignmentId: 4 },
      { content: "8 x 9", answer: "72", assignmentId: 4 },
      { content: "7 x 7", answer: "49", assignmentId: 4 },
      { content: "5 x 11", answer: "55", assignmentId: 4 },
      { content: "10 x 12", answer: "120", assignmentId: 4 },

      { content: "3/4 + 1/4", answer: "1", assignmentId: 7 },
      { content: "2/3 - 1/6", answer: "1/2", assignmentId: 7 },
      { content: "5/8 + 3/8", answer: "1", assignmentId: 7 },
      { content: "7/12 - 1/4", answer: "1/3", assignmentId: 7 },
      { content: "2/5 + 3/10", answer: "7/10", assignmentId: 7 },
    ],
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
