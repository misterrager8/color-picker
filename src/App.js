import { createContext, useEffect, useState } from "react";
import "./App.css";

const MultiContext = createContext();

function ColorItem({ item, className = "" }) {
  return (
    <div
      style={{ backgroundColor: item.hashCode }}
      className={className + " color-item"}>
      <span className="m-auto">{item.hashCode}</span>
    </div>
  );
}

function App() {
  const [colors, setColors] = useState([]);

  useEffect(() => {
    setColors([
      { id: 1, hashCode: "red" },
      { id: 2, hashCode: "blue" },
      { id: 3, hashCode: "green" },
      { id: 4, hashCode: "purple" },
      { id: 5, hashCode: "yellow" },
    ]);
  }, []);

  const contextValue = {
    colors: colors,
    setColors: setColors,
  };
  return (
    <MultiContext.Provider value={contextValue}>
      <div className="d-flex full">
        {colors.map((x) => (
          <ColorItem item={x} />
        ))}
      </div>
    </MultiContext.Provider>
  );
}

export default App;
