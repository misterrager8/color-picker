import { createContext, useEffect, useState } from "react";

export const MultiContext = createContext();

export default function Context({ children }) {
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(5);
  const [colors, setColors] = useState([]);
  const [reverseAll, setReverseAll] = useState(false);
  const [currentPage, setCurrentPage] = useState("generator");
  const [savedColors, setSavedColors] = useState(
    JSON.parse(localStorage.getItem("saved-colors")) || [],
  );

  const addColor = (color) => {
    let colors_ = [...savedColors];
    colors_.push(color);
    setSavedColors(colors_);
  };

  const addColors = (newColors) => {
    let colors_ = [...savedColors];
    let colorNames = colors_.map((x) => x.hexCode);

    for (let x = 0; x < newColors.length; x++) {
      if (!colorNames.includes(newColors[x]?.hexCode))
        colors_.push(newColors[x]);
    }

    setSavedColors(colors_);
  };

  const deleteColor = (id) => {
    let colors_ = [...savedColors].filter((x) => x.id !== id);
    setSavedColors(colors_);
  };

  const deleteAllColors = () => {
    setSavedColors([]);
  };

  useEffect(() => {
    localStorage.setItem("saved-colors", JSON.stringify(savedColors));
  }, [savedColors]);

  const contextValue = {
    loading: loading,
    setLoading: setLoading,
    limit: limit,
    setLimit: setLimit,
    colors: colors,
    setColors: setColors,
    reverseAll: reverseAll,
    setReverseAll: setReverseAll,
    currentPage: currentPage,
    setCurrentPage: setCurrentPage,
    savedColors: savedColors,
    setSavedColors: setSavedColors,
    addColors: addColors,
    addColor: addColor,
    deleteColor: deleteColor,
    deleteAllColors: deleteAllColors,
  };

  return (
    <MultiContext.Provider value={contextValue}>
      {children}
    </MultiContext.Provider>
  );
}
