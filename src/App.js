import { createContext, useEffect, useState } from "react";
import "./App.css";
import Button from "./Button";

const MultiContext = createContext();

function ColorItem({ item, className = "" }) {
  const [copied, setCopied] = useState(false);

  const copyHex = () => {
    navigator.clipboard.writeText(item.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div
      onClick={() => copyHex()}
      style={{ backgroundColor: item.hex, color: item.textColor }}
      className={className + " color-item"}>
      <div className="m-auto">
        <div className="h1">{item.hex}</div>
        <div className="text-center h3">
          {copied && <i className="bi bi-clipboard-check"></i>}&nbsp;
        </div>
      </div>
    </div>
  );
}

function App() {
  const [colors, setColors] = useState([]);

  const getColors = () => {
    let colors_ = [];

    for (let x = 1; x <= 5; x++) {
      let r_int = Math.round(Math.random() * 255);
      let r_hex = r_int.toString(16);

      let g_int = Math.round(Math.random() * 255);
      let g_hex = g_int.toString(16);

      let b_int = Math.round(Math.random() * 255);
      let b_hex = b_int.toString(16);

      let hex = `#${r_hex}${g_hex}${b_hex}`.toLocaleUpperCase();
      let rgb = `${r_int}, ${g_int}, ${b_int}`;
      let brightness = Math.round(
        ((r_int * 212.6 + g_int * 715.2 + b_int * 72.2) / 1000 / 255) * 100
      );

      let textColor = brightness > 40 ? "#1a1a1a" : "#cccccc";

      colors_.push({
        hex: hex,
        rgb: rgb,
        textColor: textColor,
      });
    }

    setColors(colors_);
  };

  useEffect(() => {
    getColors();
  }, []);

  const contextValue = {
    colors: colors,
    setColors: setColors,
  };
  return (
    <MultiContext.Provider value={contextValue}>
      <div className="d-flex full">
        <Button
          icon="arrow-clockwise"
          onClick={() => getColors()}
          className="position-fixed m-2"
        />
        {colors.map((x) => (
          <ColorItem item={x} />
        ))}
      </div>
    </MultiContext.Provider>
  );
}

export default App;
