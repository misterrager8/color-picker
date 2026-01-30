import { useContext, useEffect, useState } from "react";
import { cssString, MultiContext } from "../../Context";
import SavedThemeItem from "../items/SavedThemeItem";
import Button from "../atoms/Button";
import Dropdown from "../atoms/Dropdown";
import { v4 as uuidv4 } from "uuid";
import Input from "../atoms/Input";

export default function Saved() {
  const multiCtx = useContext(MultiContext);
  const [deletingAll, setDeletingAll] = useState(false);
  const [filter, setFilter] = useState(null);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const [themeName, setThemeName] = useState("");
  const onChangeThemeName = (e) => setThemeName(e.target.value);

  const [saved, setSaved] = useState(false);

  const sorts = [
    {
      label: "Hue",
      value: "hue",
    },
    {
      label: "Saturation",
      value: "saturation",
    },
    {
      label: "Lightness",
      value: "lightness",
    },
    {
      label: "Name",
      value: "name",
    },
  ];

  const copyTheme = () => {
    navigator.clipboard.writeText(cssString(multiCtx.currentTheme));
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const copyThemeNames = () => {
    let names = [];
    for (let x = 0; x < multiCtx.savedThemes.length; x++) {
      names.push(`"${multiCtx.savedThemes[x].name}",`);
    }

    navigator.clipboard.writeText(`${names.join("\n")}`);
    setExported(true);
    setTimeout(() => setExported(false), 250);
  };

  const copyThemes = () => {
    let themes = [];
    for (let x = 0; x < multiCtx.savedThemes.length; x++) {
      themes.push(cssString(multiCtx.savedThemes[x]));
    }

    navigator.clipboard.writeText(`${themes.join("\n\n")}`);
    setExported(true);
    setTimeout(() => setExported(false), 250);
  };

  useEffect(() => {
    setDeletingAll(false);
  }, [multiCtx.currentPage]);

  useEffect(() => {
    setDeleting(false);
    setThemeName(multiCtx.currentTheme?.name || "");
  }, [multiCtx.currentTheme]);

  useEffect(() => {
    multiCtx.setCurrentTheme(null);
  }, [filter]);

  return (
    <>
      <div className="nav-custom">
        {multiCtx.savedThemes.length > 0 && (
          <div className="my-auto">
            <Dropdown
              target="sorts"
              icon="bi:filter-right"
              text={sorts.find((x) => x.value === multiCtx.sort)?.label}>
              {sorts.map((x) => (
                <a
                  key={uuidv4()}
                  onClick={() => multiCtx.setSort(x.value)}
                  className={
                    "dropdown-item" +
                    (x.value === multiCtx.sort ? " active" : "")
                  }>
                  {x.label}
                </a>
              ))}
            </Dropdown>
            <Button
              icon="ri:sun-fill"
              onClick={() => setFilter("light")}
              active={filter === "light"}
            />
            <Button
              icon="solar:moon-bold"
              onClick={() => setFilter("dark")}
              active={filter === "dark"}
            />
            <Button
              icon="proicons:dark-theme"
              onClick={() => setFilter(null)}
              active={!filter}
            />
            <Button
              active={exporting}
              icon={exported ? "bi:check-lg" : "bi:copy"}
              text="Export"
              onClick={() => setExporting(!exporting)}
            />
            {exporting && (
              <>
                <Button text="Names" onClick={() => copyThemeNames()} />
                <Button text="All" onClick={() => copyThemes()} />
              </>
            )}
            <Button
              icon="streamline-plump:clean-broom-wipe-solid"
              onClick={() => setDeletingAll(!deletingAll)}
            />
            {deletingAll && (
              <Button
                icon="bi:question-lg"
                onClick={() => multiCtx.deleteAllThemes()}
              />
            )}
          </div>
        )}
      </div>

      <div className="row m-0">
        <div
          className="col-6 row m-0 p-0"
          style={{ height: "85vh", overflowY: "auto" }}>
          {multiCtx.savedThemes
            .filter((u) => {
              if (filter === "light") {
                return u.lightness > 40;
              } else if (filter === "dark") {
                return u.lightness < 41;
              } else {
                return u;
              }
            })
            .sort((v, w) => {
              if (multiCtx.sort === "hue") {
                return v?.hue - w?.hue;
              } else if (multiCtx.sort === "saturation") {
                return v?.saturation - w?.saturation;
              } else if (multiCtx.sort === "lightness") {
                return v?.lightness - w?.lightness;
              } else if (multiCtx.sort === "name") {
                return v.name.localeCompare(w.name);
              }
            })
            .map((x) => (
              <SavedThemeItem key={x.id} item={x} />
            ))}
        </div>
        <div
          className="col m-0 d-flex"
          style={{
            height: "85vh",
            overflowY: "auto",
            backgroundColor: multiCtx.currentTheme?.primaryBg,
            color: multiCtx.currentTheme?.primaryTxt,
          }}>
          <div className="m-auto">
            {multiCtx.currentTheme ? (
              <div className="text-center">
                <div style={{ fontSize: "1.1rem" }}>
                  <div
                    style={{
                      borderBottom: `.5px solid ${multiCtx.currentTheme?.secondaryColor}`,
                    }}
                    className={
                      "pb-2 mb-2 fw-bold " +
                      (multiCtx.currentTheme.name ? "" : "invisible")
                    }>
                    "{multiCtx.currentTheme?.name}"
                    <form
                      className="my-3"
                      onSubmit={(e) => {
                        multiCtx.renameTheme(e, themeName);
                        setSaved(true);
                        setTimeout(() => setSaved(false), 250);
                      }}>
                      <Input
                        required
                        placeholder="Color Name"
                        value={themeName}
                        onChange={onChangeThemeName}
                      />
                    </form>
                  </div>
                  <div
                    className="pb-2 mb-2"
                    style={{
                      borderBottom: `.5px solid ${multiCtx.currentTheme?.secondaryColor}`,
                    }}>
                    <div className="fw-bold mb-1">Background Color</div>
                    <div
                      onClick={() => {
                        navigator.clipboard.writeText(
                          multiCtx.currentTheme?.primaryBg?.slice(1),
                        );
                        setCopied(true);
                        setTimeout(() => setCopied(false), 500);
                      }}
                      style={{
                        textTransform: "uppercase",
                        color: multiCtx.currentTheme?.primaryTxt,
                      }}>
                      {multiCtx.currentTheme?.primaryBg}
                    </div>
                  </div>
                  <div
                    className="pb-2 mb-2"
                    style={{
                      borderBottom: `.5px solid ${multiCtx.currentTheme?.secondaryColor}`,
                    }}>
                    <div className="fw-bold mb-1">Font Color</div>
                    <div
                      style={{
                        textTransform: "uppercase",
                        color: multiCtx.currentTheme?.primaryTxt,
                      }}>
                      {multiCtx.currentTheme?.primaryTxt}
                    </div>
                  </div>
                  <div
                    className="pb-2 mb-2"
                    style={{
                      borderBottom: `.5px solid ${multiCtx.currentTheme?.secondaryColor}`,
                    }}>
                    <div className="fw-bold mb-1">Secondary Color</div>
                    <div
                      style={{
                        textTransform: "uppercase",
                        color: multiCtx.currentTheme?.secondaryColor,
                      }}>
                      {multiCtx.currentTheme?.secondaryColor}
                    </div>
                  </div>
                  <div
                    className="pb-2 mb-2"
                    style={{
                      borderBottom: `.5px solid ${multiCtx.currentTheme?.secondaryColor}`,
                    }}>
                    <div className="fw-bold mb-1">Button Color</div>
                    <div
                      onClick={() => {
                        navigator.clipboard.writeText(
                          multiCtx.currentTheme?.btnColor?.slice(1),
                        );
                        setCopied(true);
                        setTimeout(() => setCopied(false), 500);
                      }}
                      style={{
                        textTransform: "uppercase",
                        color: multiCtx.currentTheme?.btnColor,
                      }}>
                      {multiCtx.currentTheme?.btnColor}
                    </div>
                  </div>
                  <div
                    className="pb-2 mb-2"
                    style={{
                      borderBottom: `.5px solid ${multiCtx.currentTheme?.secondaryColor}`,
                    }}>
                    <div className="fw-bold mb-1">Button Hover Color</div>
                    <div
                      style={{
                        textTransform: "uppercase",
                        backgroundColor: multiCtx.currentTheme?.btnColor,
                        color: multiCtx.currentTheme?.btnHoverTxt,
                        padding: "6px 12px",
                        borderRadius: "5px",
                      }}>
                      {multiCtx.currentTheme?.btnHoverTxt}
                    </div>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="d-flex mx-auto">
                    <div>
                      <Button
                        style={{ color: "inherit" }}
                        onClick={() => multiCtx.setCurrentTheme(null)}
                        icon="dashicons:exit"
                      />
                    </div>

                    <div>
                      <Button
                        style={{ color: "inherit" }}
                        onClick={() => copyTheme()}
                        icon={copied ? "bi:check-lg" : "bi:copy"}
                      />
                    </div>
                    <Button
                      style={{ color: "inherit" }}
                      onClick={() => setDeleting(!deleting)}
                      icon="bi:x-lg"
                    />
                    <div>
                      {deleting && (
                        <Button
                          style={{ color: "inherit" }}
                          onClick={() => multiCtx.deleteTheme()}
                          icon="bi:question-lg"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <span className="opacity-50 small">No Color Selected.</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
