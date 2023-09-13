-- CreateTable
CREATE TABLE "StudentProblemAnswer" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "problemId" INTEGER NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "answer" TEXT NOT NULL,
    "feedback" TEXT,
    "isCorrect" BOOLEAN,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentProblemAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentProblemAnswer_studentId_problemId_key" ON "StudentProblemAnswer"("studentId", "problemId");

-- AddForeignKey
ALTER TABLE "StudentProblemAnswer" ADD CONSTRAINT "StudentProblemAnswer_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProblemAnswer" ADD CONSTRAINT "StudentProblemAnswer_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProblemAnswer" ADD CONSTRAINT "StudentProblemAnswer_studentId_assignmentId_fkey" FOREIGN KEY ("studentId", "assignmentId") REFERENCES "StudentAssignment"("studentId", "assignmentId") ON DELETE RESTRICT ON UPDATE CASCADE;
