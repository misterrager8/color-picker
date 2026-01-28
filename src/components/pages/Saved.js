import { useContext, useEffect, useState } from "react";
import { MultiContext } from "../../Context";
import SavedColorItem from "../items/SavedColorItem";
import Button from "../atoms/Button";
import Dropdown from "../atoms/Dropdown";
import { v4 as uuidv4 } from "uuid";
import Input from "../atoms/Input";

export default function Saved() {
  const multiCtx = useContext(MultiContext);
  const [deletingAll, setDeletingAll] = useState(false);
  const [filter, setFilter] = useState(null);
  const [copiedHex, setCopiedHex] = useState(false);
  const [copiedTheme, setCopiedTheme] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [colorName, setColorName] = useState("");
  const onChangeColorName = (e) => setColorName(e.target.value);

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
  ];

  const copyColor = () => {
    navigator.clipboard.writeText(multiCtx.currentColor?.hexCode?.slice(1));
    setCopiedHex(true);
    setTimeout(() => setCopiedHex(false), 1000);
  };

  const classifyHue = () => {
    if (
      multiCtx.currentColor?.hslValues?.hue <= 15 ||
      (multiCtx.currentColor?.hslValues?.hue >= 345 &&
        multiCtx.currentColor?.hslValues?.hue <= 360)
    ) {
      return "red";
    } else if (
      multiCtx.currentColor?.hslValues?.hue >= 16 &&
      multiCtx.currentColor?.hslValues?.hue <= 45
    ) {
      return "orange";
    } else if (
      multiCtx.currentColor?.hslValues?.hue >= 46 &&
      multiCtx.currentColor?.hslValues?.hue <= 75
    ) {
      return "yellow";
    } else if (
      multiCtx.currentColor?.hslValues?.hue >= 76 &&
      multiCtx.currentColor?.hslValues?.hue <= 150
    ) {
      return "green";
    } else if (
      multiCtx.currentColor?.hslValues?.hue >= 151 &&
      multiCtx.currentColor?.hslValues?.hue <= 240
    ) {
      return "blue";
    } else if (
      multiCtx.currentColor?.hslValues?.hue >= 241 &&
      multiCtx.currentColor?.hslValues?.hue <= 270
    ) {
      return "indigo";
    } else if (
      multiCtx.currentColor?.hslValues?.hue >= 271 &&
      multiCtx.currentColor?.hslValues?.hue <= 344
    ) {
      return "purple";
    }
  };

  useEffect(() => {
    setDeletingAll(false);
  }, [multiCtx.currentPage]);

  useEffect(() => {
    setDeleting(false);
    setColorName(multiCtx.currentColor?.name || "");
  }, [multiCtx.currentColor]);

  useEffect(() => {
    multiCtx.setCurrentColor(null);
  }, [filter]);

  return (
    <>
      <div className="nav-custom">
        {multiCtx.savedColors.length > 0 && (
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
              active={multiCtx.reverseAll}
              icon="picon:switch"
              onClick={() => multiCtx.setReverseAll(!multiCtx.reverseAll)}
            />
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
              icon="streamline-plump:clean-broom-wipe-solid"
              onClick={() => setDeletingAll(!deletingAll)}
            />
            {deletingAll && (
              <Button
                icon="bi:question-lg"
                onClick={() => multiCtx.deleteAllColors()}
              />
            )}
          </div>
        )}
      </div>
      <div className="row m-0">
        <div
          className="col-6 row m-0 p-0"
          style={{ height: "85vh", overflowY: "auto" }}>
          {multiCtx.savedColors
            .filter((u) => {
              if (filter === "light") {
                return u.textColor === "#cccccc";
              } else if (filter === "dark") {
                return u.textColor === "#1a1a1a";
              } else {
                return u;
              }
            })
            .sort((v, w) => {
              if (multiCtx.sort === "hue") {
                return v.hslValues?.hue - w.hslValues?.hue;
              } else if (multiCtx.sort === "saturation") {
                return v.hslValues?.saturation - w.hslValues?.saturation;
              } else {
                return v.hslValues?.lightness - w.hslValues?.lightness;
              }
            })
            .map((x) => (
              <SavedColorItem key={x.id} item={x} />
            ))}
        </div>
        <div
          className="col m-0 d-flex"
          style={{
            height: "85vh",
            overflowY: "auto",
            backgroundColor: multiCtx.reverseAll
              ? multiCtx.currentColor?.textColor
              : multiCtx.currentColor?.hexCode,
            color: multiCtx.reverseAll
              ? multiCtx.currentColor?.hexCode
              : multiCtx.currentColor?.textColor,
          }}>
          <div className="m-auto">
            {multiCtx.currentColor ? (
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  // textAlign: "center",
                }}>
                <div className="text-center">
                  <div>{multiCtx.currentColor?.hexCode}</div>
                  <div>
                    {multiCtx.currentColor?.name
                      ? multiCtx.currentColor?.name
                      : `"${classifyHue()}-ish"`}
                  </div>
                  <form
                    className="my-3"
                    onSubmit={(e) => {
                      multiCtx.renameColor(e, colorName);
                      setSaved(true);
                      setTimeout(() => setSaved(false), 250);
                    }}>
                    <Input
                      required
                      placeholder="Color Name"
                      value={colorName}
                      onChange={onChangeColorName}
                    />
                  </form>
                  <div>
                    <Button
                      style={{ color: "inherit" }}
                      onClick={() => multiCtx.setCurrentColor(null)}
                      icon="dashicons:exit"
                    />
                    <Button
                      style={{ color: "inherit" }}
                      onClick={() => {
                        navigator.clipboard
                          .writeText(`html[data-theme="${multiCtx.currentColor?.textColor === "#1a1a1a" ? "dark" : "light"}-${classifyHue()}"] {
  --primary-bg: ${multiCtx.currentColor?.textColor};
  --primary-txt: ${multiCtx.currentColor?.textColor === "#1a1a1a" ? "#cccccc" : "#1a1a1a"};
  --btn-color: ${multiCtx.currentColor?.hexCode};
  --btn-hover-txt: ${multiCtx.currentColor?.textColor};
}`);
                        setCopiedTheme(true);
                        setTimeout(() => setCopiedTheme(false), 1000);
                      }}
                      icon={copiedTheme ? "bi:check-lg" : "nonicons:css-16"}
                    />
                    <Button
                      style={{ color: "inherit" }}
                      onClick={() => copyColor()}
                      icon={copiedHex ? "bi:check-lg" : "ph:hash-bold"}
                    />
                    {deleting && (
                      <Button
                        style={{ color: "inherit" }}
                        onClick={() => multiCtx.deleteColor()}
                        icon="bi:question-lg"
                      />
                    )}
                    <Button
                      style={{ color: "inherit" }}
                      onClick={() => setDeleting(!deleting)}
                      icon="bi:x-lg"
                    />
                  </div>
                </div>

                <div style={{ whiteSpace: "pre-wrap", textAlign: "unset" }}>
                  {}
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
