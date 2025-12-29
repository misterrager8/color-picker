import { createContext, useContext, useEffect, useState } from "react";
import "./App.css";
import Button from "./Button";

const MultiContext = createContext();
const ShadeContext = createContext();

function ShadeItem({ item }) {
  const shadeCtx = useContext(ShadeContext);
  const [copied, setCopied] = useState(false);

  const copyHSL = () => {
    navigator.clipboard.writeText(item.formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div
      onMouseEnter={() => shadeCtx.setHovered(item)}
      onMouseLeave={() => shadeCtx.setHovered(null)}
      onClick={() => {
        if (item.l === shadeCtx.base.l) {
          shadeCtx.setShowShades(false);
        } else {
          copyHSL();
        }
      }}
      className={"shade d-flex"}
      style={{ backgroundColor: item.formatted, color: item.textColor }}>
      <div className="m-auto text-center">
        {shadeCtx.hovered?.formatted === item.formatted && (
          <>
            {copied ? (
              <i className="bi bi-check-lg"></i>
            ) : (
              <span className="small opacity-75">{item.l}</span>
            )}
          </>
        )}
        {item.l === shadeCtx.base.l &&
          shadeCtx.hovered?.formatted !== item.formatted && (
            <i className="bi bi-record-fill"></i>
          )}
      </div>
    </div>
  );
}

function ColorItem({ item }) {
  const multiCtx = useContext(MultiContext);

  const [copied, setCopied] = useState(false);
  const [showShades, setShowShades] = useState(false);
  const [reversed, setReversed] = useState(false);
  const [hovered, setHovered] = useState(null);

  const copyHSL = () => {
    navigator.clipboard.writeText(item.formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  useEffect(() => {
    setReversed(multiCtx.reverseAll);
  }, [multiCtx.reverseAll]);

  useEffect(() => {
    setShowShades(multiCtx.showAllShades);
  }, [multiCtx.showAllShades]);

  const contextValue = {
    hovered: hovered,
    setHovered: setHovered,
    setShowShades: setShowShades,
    base: item,
  };

  return (
    <div className="col p-0">
      {!showShades ? (
        <div
          className="vh-90 d-flex"
          style={{
            backgroundColor: reversed ? item.textColor : item.formatted,
            color: reversed ? item.formatted : item.textColor,
          }}>
          <div className="btn-group-vertical m-auto">
            <button
              onClick={() => setShowShades(true)}
              className="btn btn-lg border-0"
              style={{
                color: reversed ? item.formatted : item.textColor,
              }}>
              <i className="bi bi-sunglasses"></i>
            </button>
            <button
              onClick={() => copyHSL()}
              className="btn btn-lg border-0"
              style={{
                color: reversed ? item.formatted : item.textColor,
              }}>
              <i className={"bi bi-" + (copied ? "check-lg" : "copy")}></i>
            </button>
            <button
              onClick={() => setReversed(!reversed)}
              className="btn btn-lg border-0"
              style={{
                color: reversed ? item.formatted : item.textColor,
              }}>
              <i className={"bi bi-toggle-" + (reversed ? "on" : "off")}></i>
            </button>
            <span className="mt-4 small opacity-75">
              {item.h}, {item.s}, {item.l}
            </span>
          </div>
        </div>
      ) : (
        <ShadeContext.Provider value={contextValue}>
          {item.shades.map((y) => (
            <ShadeItem item={y} />
          ))}
        </ShadeContext.Provider>
      )}
    </div>
  );
}

function App() {
  const [reverseAll, setReverseAll] = useState(false);
  const [showAllShades, setShowAllShades] = useState(false);
  const [limit, setLimit] = useState(5);
  const [colors, setColors] = useState([]);

  const hslToString = (h, s, l) => {
    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  const getTextColor = (brightness) =>
    brightness > 49 ? "#1a1a1a" : "#cccccc";

  const getColors = () => {
    let colors_ = [];
    for (let x = 1; x <= limit; x++) {
      let h = Math.round(Math.random() * 360);
      let s = Math.round(Math.random() * 100);
      let l = Math.round(Math.random() * (9 - 1) + 1) * 10;

      let shades = [];

      for (let y = 1; y <= 9; y++) {
        let newH = h;
        let newS = s;
        let newL = y * 10;

        shades.push({
          h: newH,
          s: newS,
          l: newL,
          formatted: hslToString(newH, newS, newL),
          textColor: getTextColor(newL),
        });
      }

      colors_.push({
        h: h,
        s: s,
        l: l,
        formatted: hslToString(h, s, l),
        textColor: getTextColor(l),
        shades: shades.sort((x, y) => y.l - x.l),
      });
    }

    setColors(colors_);
  };

  useEffect(() => {
    getColors();
  }, []);

  const contextValue = {
    reverseAll: reverseAll,
    setReverseAll: setReverseAll,
    showAllShades: showAllShades,
    setShowAllShades: setShowAllShades,
  };

  return (
    <MultiContext.Provider value={contextValue}>
      <div className="">
        <div className="top">
          <div className="btn-group btn-group-sm my-auto">
            <Button
              text="Generate"
              border={false}
              icon="shuffle"
              onClick={() => getColors()}
            />
            <Button
              onClick={() => setReverseAll(!reverseAll)}
              text="Reverse All"
              border={false}
              icon="repeat"
            />
            <Button
              onClick={() => setShowAllShades(!showAllShades)}
              text="Show All Shades"
              border={false}
              icon="sunglasses"
            />
          </div>
        </div>
        <div className="row">
          {colors.map((x) => (
            <ColorItem item={x} />
          ))}
        </div>
      </div>
    </MultiContext.Provider>
  );
}

export default App;
