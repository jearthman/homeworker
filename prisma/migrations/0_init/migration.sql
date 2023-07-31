-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMP(6),

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
    "student_id" INTEGER NOT NULL,
    "disability_id" INTEGER NOT NULL,

    CONSTRAINT "StudentDisability_pkey" PRIMARY KEY ("student_id","disability_id")
);

-- CreateTable
CREATE TABLE "StudentLanguage" (
    "student_id" INTEGER NOT NULL,
    "language_id" INTEGER NOT NULL,

    CONSTRAINT "StudentLanguage_pkey" PRIMARY KEY ("student_id","language_id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "grade_level" VARCHAR(50) NOT NULL,
    "reading_level" VARCHAR(50) NOT NULL,
    "native_language_id" INTEGER,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Disability_name_key" ON "Disability"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Language_name_key" ON "Language"("name");

-- AddForeignKey
ALTER TABLE "StudentDisability" ADD CONSTRAINT "StudentDisability_disability_id_fkey" FOREIGN KEY ("disability_id") REFERENCES "Disability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StudentDisability" ADD CONSTRAINT "StudentDisability_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StudentLanguage" ADD CONSTRAINT "StudentLanguage_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StudentLanguage" ADD CONSTRAINT "StudentLanguage_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_native_language_id_fkey" FOREIGN KEY ("native_language_id") REFERENCES "Language"("id") ON DELETE SET NULL ON UPDATE CASCADE;

