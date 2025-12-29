import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import { createContext, useEffect, useState } from "react";
import "./App.css";
import Button from "./components/atoms/Button";
import ColorItem from "./components/items/ColorItem";

export const MultiContext = createContext();

function App() {
  const [colors, setColors] = useState([]);
  const [reversed, setReversed] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem("color-picker-theme") || "light"
  );

  const [scheme, setScheme] = useState("both");

  function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  const getColors = () => {
    let colors_ = [];
    for (let x = 1; x <= 5; x++) {
      let h = Math.round(Math.random() * 359);
      let s = Math.round(Math.random() * 90);
      let l = getRandomArbitrary(
        scheme === "light" ? 20 : scheme === "dark" ? 41 : 20,
        scheme === "light" ? 40 : scheme === "dark" ? 80 : 80
      );

      let h2 = Math.round(Math.random() * 359);
      let s2 = Math.round(Math.random() * 90);
      let l2 = getRandomArbitrary(
        scheme === "light" ? 20 : 41,
        scheme === "light" ? 40 : 80
      );

      let primary = `hsl(${h} ${s} ${l})`;
      let secondary = `hsl(${h2} ${s2} ${l})`;
      // let textColor = l < 41 ? "#cccccc" : "#1a1a1a";
      let textColor = `hsl(${h2} ${s2} ${l < 41 ? 80 : 10})`;

      colors_.push({
        primary: primary,
        secondary: secondary,
        textColor: textColor,
      });
    }

    setColors(colors_);
  };

  useEffect(() => {
    getColors();
  }, [scheme]);

  useEffect(() => {
    localStorage.setItem("color-picker-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const contextValue = {
    reversed: reversed,
  };

  return (
    <MultiContext.Provider value={contextValue}>
      <div className="body">
        <div className="inner">
          <div className="nav">
            <div className="d-flex">
              <Button
                onClick={() => getColors()}
                icon="dice-5"
                text="Generate"
              />
              <div className="d-flex">
                <Button
                  active={scheme === "light"}
                  icon="sun-fill"
                  onClick={() => setScheme("light")}
                  text="Light"
                />
                <Button
                  active={scheme === "dark"}
                  icon="moon-fill"
                  onClick={() => setScheme("dark")}
                  text="Dark"
                />
                <Button
                  active={scheme === "both"}
                  icon="record2"
                  onClick={() => setScheme("both")}
                  text="Both"
                />
              </div>
            </div>
            <div>
              <Button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                icon={(theme === "light" ? "sun" : "moon") + "-fill"}
              />
            </div>
          </div>
          <div className="color-panel">
            {colors.map((x) => (
              <ColorItem item={x} />
            ))}
          </div>
        </div>
      </div>
    </MultiContext.Provider>
  );
}

export default App;
