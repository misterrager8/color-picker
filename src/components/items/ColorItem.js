import { useContext, useState } from "react";
import { MultiContext } from "../../App";

export default function ColorItem({ item }) {
  const multiCtx = useContext(MultiContext);
  const [copied, setCopied] = useState(false);

  const copy = (color) => {
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="color">
      <div
        style={{
          backgroundColor: item.textColor,
          color: item.primary,
        }}
        className="color-inner">
        <div className="m-auto">
          <div className="text-center">
            <div
              style={{
                display: "flex",
                width: "25px",
                height: "25px",
                backgroundColor: item.primary,
                color: item.textColor,
                borderRadius: "7px",
              }}>
              <span className="m-auto">ABC</span>
            </div>
            <a onClick={() => copy(item.textColor)}>
              <i className={"bi bi-" + (copied ? "check-lg" : "copy")}></i>
            </a>
            <div className="mb-4">{item.textColor}</div>

            <a onClick={() => copy(item.primary)}>
              <i className={"bi bi-" + (copied ? "check-lg" : "copy")}></i>
            </a>
            <div>{item.primary}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
