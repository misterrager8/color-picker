import { createContext, useEffect, useState } from "react";

export const MultiContext = createContext();

export function cssString(theme_) {
  return `html[data-theme="${theme_?.name}"] {
  --primary-bg: ${theme_?.primaryBg};
  --primary-txt: ${theme_?.primaryTxt};

  --secondary-color: ${theme_?.secondaryColor};

  --btn-color: ${theme_?.btnColor};
  --btn-hover-txt: ${theme_?.btnHoverTxt};
}`;
}

export default function Context({ children }) {
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(5);

  const [themes, setThemes] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("tints-last-page") || "generator",
  );
  const [savedThemes, setSavedThemes] = useState(
    JSON.parse(localStorage.getItem("saved-themes")) || [],
  );
  const [currentTheme, setCurrentTheme] = useState(null);
  const [sort, setSort] = useState("hue");

  const addTheme = (theme) => {
    let themes_ = [...savedThemes];
    themes_.push(theme);
    setSavedThemes(themes_);
  };

  const addThemes = (newThemes) => {
    let themes_ = [...savedThemes];

    for (let x = 0; x < newThemes.length; x++) {
      if (!themes_.includes(newThemes[x])) {
        themes_.push(newThemes[x]);
      }
    }

    setSavedThemes(themes_);
  };

  const deleteTheme = () => {
    let themes_ = [...savedThemes].filter((x) => x.id !== currentTheme?.id);
    setSavedThemes(themes_);
    setCurrentTheme(null);
  };

  const deleteAllThemes = () => {
    setSavedThemes([]);
    setCurrentTheme(null);
  };

  const renameTheme = (e, newName) => {
    e.preventDefault();
    let themes_ = [...savedThemes];
    let theme_ = themes_.find((x) => x.id === currentTheme?.id);

    theme_.name = newName;
    setSavedThemes(themes_);
    setCurrentTheme(theme_);
  };

  useEffect(() => {
    localStorage.setItem("saved-themes", JSON.stringify(savedThemes));
  }, [savedThemes]);

  useEffect(() => {
    localStorage.setItem("tints-last-page", currentPage);
  }, [currentPage]);

  const contextValue = {
    loading: loading,
    setLoading: setLoading,
    limit: limit,
    setLimit: setLimit,
    themes: themes,
    setThemes: setThemes,
    currentPage: currentPage,
    setCurrentPage: setCurrentPage,
    savedThemes: savedThemes,
    setSavedThemes: setSavedThemes,
    addThemes: addThemes,
    addTheme: addTheme,
    deleteTheme: deleteTheme,
    deleteAllThemes: deleteAllThemes,
    currentTheme: currentTheme,
    setCurrentTheme: setCurrentTheme,
    renameTheme: renameTheme,
    sort: sort,
    setSort: setSort,
  };

  return (
    <MultiContext.Provider value={contextValue}>
      {children}
    </MultiContext.Provider>
  );
}
