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
    fetch("http://colormind.io/api/", {
      method: "POST",
      headers: {},
      body: JSON.stringify({
        model: "default",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setColors(data.result);

        let colors_ = [];
        for (let x = 0; x < data.result.length; x++) {
          let r_hex = data.result[x][0].toString(16);
          let g_hex = data.result[x][1].toString(16);
          let b_hex = data.result[x][2].toString(16);
          let hex = `#${r_hex}${g_hex}${b_hex}`.toLocaleUpperCase();

          let brightness = Math.round(
            ((data.result[x][0] * 212.6 +
              data.result[x][1] * 715.2 +
              data.result[x][2] * 72.2) /
              1000 /
              255) *
              100
          );
          let textColor = brightness > 40 ? "#1a1a1a" : "#cccccc";

          colors_.push({
            hex: hex,
            rgb: `${data.result[x][0]}, ${data.result[x][1]}, ${data.result[x][2]}`,
            textColor: textColor,
          });
        }
        setColors(colors_);
      });
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
