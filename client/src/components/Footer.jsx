/**
 * Footer met live datum en tijd.
 *
 * Functionaliteit:
 * - toont vaste copyrighttekst
 * - werkt datum en tijd automatisch elke seconde bij
 */

import { useEffect, useState } from "react";

function Footer() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  const formattedTime = currentDateTime.toLocaleTimeString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  return (
    <footer className="site-footer">
      <div className="container footer-row">
        <p className="footer-text">💎 ©Nevil&apos;s Gallery 2026 💎</p>
        <p className="footer-datetime">
          💎 {formattedDate}💎{formattedTime} 💎
        </p>
      </div>
    </footer>
  );
}

export default Footer;