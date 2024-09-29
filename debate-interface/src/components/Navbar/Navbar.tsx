import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  const Navlist = [
    { title: "בית", link: "" },
    { title: "מושן חדש", link: "/CreateNew" },
  ];
  return (
    <>
      <nav className="navbar">
        <div className="navbar-center">
          <ul className="nav-links">
            {Navlist.map((item, index) => (
              <li key={index}>
                <Link to={item.link}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
