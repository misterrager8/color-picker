import { useContext, useEffect, useState } from "react";
import { MultiContext } from "../../Context";
import Button from "../atoms/Button";
import { Icon } from "@iconify/react";

export default function SavedColorItem({ item }) {
  const multiCtx = useContext(MultiContext);
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reversed, setReversed] = useState(false);
  const [showShades, setShowShades] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const copyColor = () => {
    navigator.clipboard.writeText(item.hexCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="col-2 p-0">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="d-flex h-100 p-3"
        style={{
          backgroundColor: item.hexCode,
          color: item.textColor,
          // backgroundColor: item.textColor,
          // color: item.hexCode,
        }}>
        <div className="between w-100">
          <span className="color-label my-auto">{item.hexCode}</span>
          <div
            style={{ color: item.textColor }}
            className={"my-auto " + (hovered ? "" : "invisible")}>
            <Button
              style={{ color: item.textColor }}
              onClick={() => copyColor()}
              icon={copied ? "bi:check-lg" : "bi:clipboard"}
            />
            {deleting && (
              <Button
                style={{ color: item.textColor }}
                onClick={() => multiCtx.deleteColor(item.id)}
                icon="bi:question-lg"
              />
            )}
            <Button
              style={{ color: item.textColor }}
              onClick={() => setDeleting(!deleting)}
              icon="bi:x-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
