import { StudentProblemAnswer } from "@prisma/client";
//create props with an array of StudentProblemAnswers
export interface Props {
  studentProblemAnswers: StudentProblemAnswer[];
  className?: string;
}

export default function ProblemsProgress({
  studentProblemAnswers,
  className,
}: Props) {
  const renderIcon = (
    answer: string | null,
    isCorrect: boolean | null,
    key: number,
  ) => {
    if (answer === null || answer === "") {
      return (
        <span
          className="material-symbols-rounded cursor-default text-gray-400"
          title="Not Started"
          key={key}
        >
          not_started
        </span>
      ); // Not Started Icon
    } else if (!isCorrect) {
      return (
        <span
          className="material-symbols-rounded cursor-default text-yellow-400"
          title="In Progress"
          key={key}
        >
          pending
        </span>
      ); // In Progress Icon
    } else {
      return (
        <span
          className="material-symbols-rounded cursor-default text-green-400"
          title="Complete"
          key={key}
        >
          check_circle
        </span>
      ); // Complete Icon
    }
  };

  return (
    <span
      className={`${className} inline-flex gap-1 rounded-full bg-gray-50 p-1`}
    >
      {studentProblemAnswers &&
        studentProblemAnswers.map((studentProblemAnswer, index) =>
          //render 3 different icons based on studentProblemAnswer
          renderIcon(
            studentProblemAnswer.answer,
            studentProblemAnswer.isCorrect,
            index,
          ),
        )}
    </span>
  );
}
