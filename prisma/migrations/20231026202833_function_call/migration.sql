-- CreateEnum
CREATE TYPE "StudentAssignmentStatus" AS ENUM ('completed', 'in_progress', 'unstarted');

-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('system', 'user', 'assistant', 'function');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLogin" TIMESTAMP(6),
    "studentId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Disability" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Disability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentDisability" (
    "studentId" INTEGER NOT NULL,
    "disabilityId" INTEGER NOT NULL,

    CONSTRAINT "StudentDisability_pkey" PRIMARY KEY ("studentId","disabilityId")
);

-- CreateTable
CREATE TABLE "StudentLanguage" (
    "studentId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,

    CONSTRAINT "StudentLanguage_pkey" PRIMARY KEY ("studentId","languageId")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "gradeLevel" VARCHAR(50) NOT NULL,
    "nativeLanguageId" INTEGER NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    "gradeLevel" VARCHAR(50) NOT NULL,
    "gradingCriteria" TEXT NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Problem" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "assignmentId" INTEGER NOT NULL,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentAssignment" (
    "studentId" INTEGER NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "chatId" INTEGER,
    "status" VARCHAR(50) NOT NULL,
    "grade" INTEGER,

    CONSTRAINT "StudentAssignment_pkey" PRIMARY KEY ("studentId","assignmentId")
);

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

-- CreateTable
CREATE TABLE "Chat" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "functionCall" JSON,
    "hiddenFromUser" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chatId" INTEGER NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_studentId_key" ON "User"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Disability_name_key" ON "Disability"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Language_name_key" ON "Language"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentAssignment_chatId_key" ON "StudentAssignment"("chatId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProblemAnswer_studentId_problemId_key" ON "StudentProblemAnswer"("studentId", "problemId");

-- AddForeignKey
ALTER TABLE "StudentDisability" ADD CONSTRAINT "StudentDisability_disabilityId_fkey" FOREIGN KEY ("disabilityId") REFERENCES "Disability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StudentDisability" ADD CONSTRAINT "StudentDisability_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StudentLanguage" ADD CONSTRAINT "StudentLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StudentLanguage" ADD CONSTRAINT "StudentLanguage_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_nativeLanguageId_fkey" FOREIGN KEY ("nativeLanguageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAssignment" ADD CONSTRAINT "StudentAssignment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAssignment" ADD CONSTRAINT "StudentAssignment_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAssignment" ADD CONSTRAINT "StudentAssignment_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProblemAnswer" ADD CONSTRAINT "StudentProblemAnswer_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProblemAnswer" ADD CONSTRAINT "StudentProblemAnswer_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProblemAnswer" ADD CONSTRAINT "StudentProblemAnswer_studentId_assignmentId_fkey" FOREIGN KEY ("studentId", "assignmentId") REFERENCES "StudentAssignment"("studentId", "assignmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
