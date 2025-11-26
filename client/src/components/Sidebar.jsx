import { useState } from "react";
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiChevronRight,
  FiFolder,
  FiShield
} from "react-icons/fi";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, name, role, handleLogout }) => {
  const [openProjects, setOpenProjects] = useState(false);
  const [openRoles, setOpenRoles] = useState(false);

  return (
    <aside
      className={`bg-white shadow-lg fixed top-0 left-0 h-full w-64 z-40 p-1 pt-20
      transition-transform duration-300 flex flex-col justify-between
      ${isOpen ? "translate-x-0" : "-translate-x-64"}
      md:translate-x-0`}
    >

      {/* TOP MENU */}
      <div>
        <ul className="space-y-3 mt-5 pt-5 pr-5 nunito-uniquifier">

          {/* Dashboard */}
          <Link to="/users/admin" className="text-black flex items-center hover:bg-gray-100 rounded-lg cursor-pointer" style={{ textDecoration: "none" }}>
            <li className="flex items-center gap-3 p-2">
              <FiHome className="text-lg" /> Dashboard
            </li>
          </Link>

          {/* PROJECTS DROPDOWN */}
          <li>
            <div
              className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
              onClick={() => setOpenProjects(!openProjects)}
            >
              <div className="flex items-center gap-3">
                <FiFolder className="text-lg" />
                <span>Projects</span>
              </div>

              <span
                className={`transition-transform duration-300 ${openProjects ? "rotate-180" : ""
                  }`}
              >
                <FiChevronDown className="text-lg" />
              </span>
            </div>

            {/* Dropdown Items */}
            <div
              className={`overflow-hidden transition-all duration-300 ${openProjects ? "max-h-40" : "max-h-0"
                }`}
            >
              <ul className="ml-10 mt-1 space-y-2">
                <li className="py-1 cursor-pointer hover:text-blue-600">Project List</li>
                <li className="py-1 cursor-pointer hover:text-blue-600">Create Project</li>
                <li className="py-1 cursor-pointer hover:text-blue-600">Archived</li>
              </ul>
            </div>
          </li>

          {/* ROLE & PERMISSION DROPDOWN */}
          <li>
            <div
              className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
              onClick={() => setOpenRoles(!openRoles)}
            >
              <div className="flex items-center gap-3">
                <FiShield className="text-lg" />
                <span>Roles & Permission</span>
              </div>

              <span
                className={`transition-transform duration-300 ${openRoles ? "rotate-180" : ""
                  }`}
              >
                <FiChevronDown className="text-lg" />
              </span>
            </div>

            {/* Dropdown Items */}
            <div
              className={`overflow-hidden transition-all duration-300 ${openRoles ? "max-h-40" : "max-h-0"
                }`}
            >
              <ul className="ml-10 mt-1 space-y-2">
                <Link to="/users/admin/roles" className="text-black flex items-center" style={{ textDecoration: "none" }}>
                  <li className="flex items-center py-1 cursor-pointer hover:text-blue-600">
                    Role List
                  </li>
                </Link>
                  <Link to="/users/admin/permissions" className="text-black flex items-center" style={{ textDecoration: "none" }}>
                  <li className="flex items-center py-1 cursor-pointer hover:text-blue-600">
                    Permission List
                  </li>
                </Link>
              </ul>
            </div>
          </li>

          {/* Users */}
          <li className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
            <FiUsers className="text-lg" /> Users
          </li>

          {/* Settings */}
          <li className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
            <FiSettings className="text-lg" /> Settings
          </li>
        </ul>
      </div>

      {/* BOTTOM USER SECTION */}
      <div className="border-t pt-4 mt-6 flex items-center gap-3 p-2">
        <img
          src="https://i.pravatar.cc/150?img=12"
          alt="User"
          className="w-10 h-10 rounded-full"
        />

        <div>
          <h6 className="font-semibold text-sm text-black">{name}</h6>
          <span className="text-xs">Role : {role}</span>
        </div>

        <FiLogOut className="ml-auto text-red-500 cursor-pointer text-xl" onClick={handleLogout} />
      </div>

    </aside>
  );
};

export default Sidebar;
