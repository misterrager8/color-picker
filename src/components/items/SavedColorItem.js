import { useContext, useState } from "react";
import { MultiContext } from "../../Context";
import Button from "../atoms/Button";
import { Icon } from "@iconify/react";

export default function SavedColorItem({ item }) {
  const multiCtx = useContext(MultiContext);
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const copyColor = () => {
    navigator.clipboard.writeText(item.hexCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div
      className={
        "col-md-2 p-0" +
        (multiCtx.currentColor?.id === item.id ? " opacity-25" : "")
      }
      style={{ cursor: "pointer" }}
      onClick={() =>
        multiCtx.setCurrentColor(
          multiCtx.currentColor?.id === item.id ? null : item,
        )
      }>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="d-flex h-100 p-3"
        style={{
          backgroundColor: multiCtx.reverseAll ? item.textColor : item.hexCode,
          color: multiCtx.reverseAll ? item.hexCode : item.textColor,
        }}>
        <div className="between w-100">
          <span
            className="m-auto color-label text-truncate"
            title={item.hexCode}>
            <Icon
              className="me-2"
              inline
              icon={
                item.textColor === "#1a1a1a" ? "solar:moon-bold" : "ri:sun-fill"
              }
            />
            {item.name && (
              <Icon className="me-2" inline icon="qlementine-icons:rename-16" />
            )}
            <span className="text-truncate">
              {multiCtx.sort === "hue"
                ? item.hslValues?.hue
                : multiCtx.sort === "saturation"
                  ? item.hslValues?.saturation
                  : item.hslValues?.lightness}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
