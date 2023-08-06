export default function Portal() {
  return (
    <>
      <div className="flex h-screen bg-gray-200">
        <div className=" flex flex-col w-1/5 bg-gray-400"></div>
        <div className="flex flex-col w-full">
          <div className="mx-20 mt-20 p-4 bg-matcha-300 border-4 border-matcha-400 rounded-lg">
            <div className="text-2xl mb-4 font-semibold">Assignments</div>
            {/* grid layout of assignments */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-lg cursor-pointer hover:bg-gray-200 transition-colors ease-in">
                <div className="flex flex-col p-4">
                  <div className="text-lg font-semibold">Assignment 1</div>
                  <div className="text-sm font-semibold">Due: 10/10/2021</div>
                  <div className="text-sm font-semibold">
                    Submitted: 10/10/2021
                  </div>
                  <div className="text-sm font-semibold">Grade: 100/100</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-around mx-20 mt-20">
            <div className="bg-sky-200 rounded-lg p-4 border-4 border-sky-400">
              <div className="text-2xl font-semibold mb-4">Schedule</div>
              <div className="text-sm font-semibold">Monday</div>
              <div className="text-sm font-semibold">Tuesday</div>
              <div className="text-sm font-semibold">Wednesday</div>
              <div className="text-sm font-semibold">Thursday</div>
              <div className="text-sm font-semibold">Friday</div>
            </div>
            <div className="bg-yellow-200 rounded-lg p-4 border-4 border-yellow-400">
              <div className="text-2xl font-semibold mb-4">Courses</div>
              <div className="flex flex-col">
                <div className="flex flex-row">
                  <div className="bg-white rounded-lg shadow-lg cursor-pointer hover:bg-gray-200 transition-colors ease-in">
                    <div className="flex flex-col p-4">
                      <div className="text-lg font-semibold">
                        Introduction to Psychology
                      </div>
                      <div className="text-sm font-semibold">
                        Instructor: Dr. John Doe
                      </div>
                      <div className="text-sm font-semibold">
                        Time: 10:00 - 11:00 AM
                      </div>
                      <div className="text-sm font-semibold">
                        Location: Zoom
                      </div>
                      <div className="text-sm font-semibold">
                        Days: Monday, Wednesday, Friday
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-pink-200 rounded-lg p-4 border-4 border-pink-400">
              <div className="text-2xl font-semibold mb-4">Resources</div>
              <div className="text-sm font-semibold">Syllabus</div>
              <div className="text-sm font-semibold">Zoom Link</div>
              <div className="text-sm font-semibold">Office Hours</div>
              <div className="text-sm font-semibold">Tutoring</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}