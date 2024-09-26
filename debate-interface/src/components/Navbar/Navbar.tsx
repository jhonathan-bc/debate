import "./Navbar.css";
import React from "react";

function Navbar() {
  const Navlist = [
    { title: "בית", link: "" },
    { title: "ראש הממשלה", link: "/Speech/PM" },
    { title: 'יו"ר האופוזיציה', link: "/Speech/LO" },
    { title: "סגן ראש הממשלה", link: "/Speech/DPM" },
    { title: 'סגן יו"ר האופוזיציה', link: "/Speech/DLO" },
    { title: "מרחיב הממשלה", link: "/Speech/MG" },
    { title: "מרחיב האופוזיציה", link: "/Speech/MO" },
    { title: "מסכם הממשלה", link: "/Speech/GW" },
    { title: "מסכם האופוזיציה", link: "/Speech/OW" },
  ];
  return (
    <>
      <nav>
        {Navlist.map((item) => (
          <div>
            <a href={item.link}>{item.title}</a>
          </div>
        ))}
      </nav>
    </>
  );
}

export default Navbar;
