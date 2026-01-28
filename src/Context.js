import { createContext, useEffect, useState } from "react";

export const MultiContext = createContext();

export default function Context({ children }) {
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(5);
  const [colors, setColors] = useState([]);
  const [reverseAll, setReverseAll] = useState(
    localStorage.getItem("reversed") || false,
  );
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("tints-last-page") || "generator",
  );
  const [savedColors, setSavedColors] = useState(
    JSON.parse(localStorage.getItem("saved-colors")) || [],
  );
  const [currentColor, setCurrentColor] = useState(null);
  const [sort, setSort] = useState("hue");

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

  const deleteColor = () => {
    let colors_ = [...savedColors].filter((x) => x.id !== currentColor?.id);
    setSavedColors(colors_);
    setCurrentColor(null);
  };

  const deleteAllColors = () => {
    setSavedColors([]);
    setCurrentColor(null);
  };

  const renameColor = (e, newName) => {
    e.preventDefault();
    let colors_ = [...savedColors];
    let color_ = colors_.find((x) => x.id === currentColor?.id);

    color_.name = newName;
    setSavedColors(colors_);
    setCurrentColor(color_);
  };

  useEffect(() => {
    localStorage.setItem("saved-colors", JSON.stringify(savedColors));
  }, [savedColors]);

  useEffect(() => {
    localStorage.setItem("reversed", reverseAll);
  }, [reverseAll]);

  useEffect(() => {
    localStorage.setItem("tints-last-page", currentPage);
  }, [currentPage]);

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
    currentColor: currentColor,
    setCurrentColor: setCurrentColor,
    renameColor: renameColor,
    sort: sort,
    setSort: setSort,
  };

  return (
    <MultiContext.Provider value={contextValue}>
      {children}
    </MultiContext.Provider>
  );
}
