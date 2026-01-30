import { useContext, useState } from "react";
import { cssString, MultiContext } from "../../Context";
import { Icon } from "@iconify/react";

export default function ThemeItem({ item }) {
  const multiCtx = useContext(MultiContext);
  const [copied, setCopied] = useState(false);

  const copyTheme = () => {
    navigator.clipboard.writeText(cssString(item));
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const isSaved = () => {
    let themes_ = [...multiCtx.savedThemes];
    return themes_.includes(item);
  };

  return (
    <div
      className="color-item p-5 text-center"
      style={{
        backgroundColor: item.primaryBg,
      }}>
      <div
        style={{
          color: item.primaryTxt,
          fontSize: "1.25rem",
          fontStyle: "italic",
          fontWeight: "bold",
        }}>
        "{item.name}"
      </div>
      <div className="text-uppercase">
        <div className="fw-bold" style={{ color: item.primaryTxt }}>
          <div
            onClick={() => {
              navigator.clipboard.writeText(item.primaryBg?.slice(1));
              setCopied(true);
              setTimeout(() => setCopied(false), 500);
            }}
            className="m-2">
            {item.primaryBg}
          </div>
          <div className="m-2">{item.primaryTxt}</div>
          <div className="m-2" style={{ color: item.secondaryColor }}>
            {item.secondaryColor}
          </div>
        </div>
        <div className="d-flex flex-column">
          <button
            onClick={() => {
              navigator.clipboard.writeText(item.btnColor?.slice(1));
              setCopied(true);
              setTimeout(() => setCopied(false), 500);
            }}
            className="m-2 text-uppercase"
            style={{
              backgroundColor: "transparent",
              border: `.5px solid ${item.btnColor}`,
              color: item.btnColor,
              borderRadius: "5px",
              letterSpacing: "1.5px",
              padding: "5px 13px",
              fontSize: ".875rem",
            }}>
            {item.btnColor}
          </button>
          <button
            className="m-2 text-uppercase"
            style={{
              backgroundColor: item.btnColor,
              border: ".5px solid transparent",
              color: item.btnHoverTxt,
              borderRadius: "5px",
              letterSpacing: "1.5px",
              padding: "5px 13px",
              fontSize: ".875rem",
            }}>
            {item.btnHoverTxt}
          </button>
        </div>
        <div className="d-flex m-2">
          <button
            onClick={() => copyTheme()}
            className="w-50"
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: item.btnColor,
              letterSpacing: "1.5px",
              fontSize: "1.5rem",
            }}>
            <Icon inline icon={copied ? "bi:check-lg" : "bi:copy"} />
          </button>
          <button
            onClick={() => multiCtx.addTheme(item)}
            className="w-50"
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: item.btnColor,
              letterSpacing: "1.5px",
              fontSize: "1.5rem",
            }}>
            <Icon inline icon={isSaved() ? "bi:check-lg" : "fa:save"} />
          </button>
        </div>
      </div>
      <div className="d-flex mx-auto">
        <Icon
          className="m-1"
          style={{ color: item.red }}
          inline
          icon="bi:circle-fill"
        />
        <Icon
          className="m-1"
          style={{ color: item.orange }}
          inline
          icon="bi:circle-fill"
        />
        <Icon
          className="m-1"
          style={{ color: item.yellow }}
          inline
          icon="bi:circle-fill"
        />
        <Icon
          className="m-1"
          style={{ color: item.green }}
          inline
          icon="bi:circle-fill"
        />
        <Icon
          className="m-1"
          style={{ color: item.blue }}
          inline
          icon="bi:circle-fill"
        />
        <Icon
          className="m-1"
          style={{ color: item.indigo }}
          inline
          icon="bi:circle-fill"
        />
        <Icon
          className="m-1"
          style={{ color: item.purple }}
          inline
          icon="bi:circle-fill"
        />
      </div>
    </div>
  );
}
