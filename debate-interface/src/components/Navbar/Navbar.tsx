import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar({ id }: any) {
  const Navlist = [
    { title: "בית", link: "" },
    { title: "ראש הממשלה", link: `/Speech/PM/${id}` },
    { title: 'יו"ר האופוזיציה', link: `/Speech/LO/${id}` },
    { title: "סגן ראש הממשלה", link: `/Speech/DPM/${id}` },
    { title: 'סגן יו"ר האופוזיציה', link: `/Speech/DLO/${id}` },
    { title: "מרחיב הממשלה", link: `/Speech/MG/${id}` },
    { title: "מרחיב האופוזיציה", link: `/Speech/MO/${id}` },
    { title: "מסכם הממשלה", link: `/Speech/GW/${id}` },
    { title: "מסכם האופוזיציה", link: `/Speech/OW/${id}` },
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
