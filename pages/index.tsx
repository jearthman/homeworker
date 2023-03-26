import "material-icons/iconfont/material-icons.css";

export default function Home() {
  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="bg-slate-700 text-gray-200 py-4 px-6 flex items-baseline">
          <div className="text-2xl font-bold">Thera</div>
          <ul className="ml-20 flex items-center gap-10">
            <li>
              <a className="hover:text-cyan-300 hover:cursor-pointer cursor-default">
                Therapist
              </a>
            </li>
            <li>
              <a className="hover:text-cyan-300 hover:cursor-pointer cursor-default">
                Medications
              </a>
            </li>
            <li>
              <a className="hover:text-cyan-300 hover:cursor-pointer cursor-default">
                Journal
              </a>
            </li>
          </ul>
          <div className="flex ml-auto">
            <button className="flex items-middle">
              <span>About</span>
              <span className="material-icons md-18">expand_more</span>
            </button>
            <button className="flex items-middle">
              <span>Username</span>
              <i className="rounded-full"></i>
              <span className="material-icons md-18">expand_more</span>
            </button>
            <div></div>
          </div>
        </div>
        <div className="bg-gray-100 flex-grow">
          <nav className="flex flex-col justify-start py-4 px-6 bg-slate-700 w-1/5">
            <a href="#" className="text-gray-200 hover:text-gray-300 mb-3">
              Home
            </a>
            <a href="#" className="text-gray-200 hover:text-gray-300 mb-3">
              About
            </a>
            <a href="#" className="text-gray-200 hover:text-gray-300 mb-3">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </>
  );
}
