import { FiMenu, FiUser, FiBell, FiGrid } from "react-icons/fi";
import { Link } from "react-router-dom";

const Navigation = ({ name, toggleSidebar, userId }) => {
    return (
        <header className="w-full bg-white px-4 py-3 shadow-md flex justify-between items-center fixed top-0 left-0 z-50 nunito-uniquifier">
            <div className="flex items-center gap-3">
                <button
                    className="text-xl md:hidden"
                    onClick={toggleSidebar}
                >
                    <FiMenu />
                </button>
                <h3 className="text-xl font-semibold mt-1 flex items-center gap-3">
                    <FiGrid className="text-blue-600 text-3xl" />
                    Admin Panel
                </h3>
            </div>
            <div className="flex items-center gap-6">
                <div className="relative cursor-pointer hover:text-blue-600 transition">
                    <FiBell className="text-xl" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1">
                        3
                    </span>
                </div>
                <Link className="text-black" to={`/users/profile/${userId}`}>
                    <FiUser className="text-xl cursor-pointer hover:text-blue-600 transition" />
                </Link>
            </div>
        </header>
    );
};

export default Navigation;
