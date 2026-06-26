import { Link } from "react-router-dom";

function Navbar() {
return ( <nav className="bg-blue-600 text-white p-4 flex gap-6 shadow-lg"> <Link to="/" className="hover:text-gray-200">Overview</Link> <Link to="/shipments" className="hover:text-gray-200">Shipments</Link> <Link to="/predict" className="hover:text-gray-200">Predict</Link> <Link to="/intelligence" className="hover:text-gray-200">Intelligence</Link> </nav>
);
}

export default Navbar;
