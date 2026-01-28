import { useContext, useState } from "react";
import { MultiContext } from "../../Context";
import Button from "../atoms/Button";
import { Icon } from "@iconify/react";
import { v4 as uuidv4 } from "uuid";

export default function ColorItem({ item }) {
  const multiCtx = useContext(MultiContext);
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reversed, setReversed] = useState(false);
  const [showShades, setShowShades] = useState(false);

  const copyColor = () => {
    navigator.clipboard.writeText(item.hexCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const isSaved = () => {
    let colors_ = [...multiCtx.savedColors].map((x) => x.hexCode);
    return colors_.includes(item.hexCode);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor:
          reversed || multiCtx.reverseAll ? item.textColor : item.hexCode,
        color: reversed || multiCtx.reverseAll ? item.hexCode : item.textColor,
      }}
      className={"color-item" + (showShades ? "" : "")}>
      <div className="color-inner">
        {showShades ? (
          <>
            {item.shades.map((x) => (
              <div
                key={uuidv4()}
                onClick={() => {
                  item.hexCode === x.hexCode && setShowShades(false);
                }}
                className="d-flex h-100 p-3 w-100"
                style={{
                  backgroundColor: x.hexCode,
                  color: x.textColor,
                  cursor: item.hexCode === x.hexCode ? "pointer" : "unset",
                }}>
                <div className="m-auto d-flex">
                  {item.hexCode === x.hexCode && <Icon icon="bi:record-fill" />}
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className={"btn-flex my-auto" + (hovered ? "" : " invisible")}>
              <Button
                onClick={() => copyColor()}
                icon={"bi:" + (copied ? "check-lg" : "copy")}
              />
              <Button
                onClick={() => setShowShades(!showShades)}
                icon="bi:sunglasses"
              />
              <Button
                onClick={() => (!isSaved() ? multiCtx.addColor(item) : null)}
                icon={isSaved() ? "bi:check-lg" : "icon-park-solid:save"}
              />
              <Button
                border={reversed}
                onClick={() => setReversed(!reversed)}
                icon="ic:round-swap-horiz"
              />
            </div>
            <div className="color-label p-5">
              <span
                style={
                  reversed || multiCtx.reverseAll
                    ? {
                        backgroundColor: item.hexCode,
                        color: item.textColor,
                        padding: "10px",
                        borderRadius: "5px",
                      }
                    : {}
                }>
                {item.hexCode}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
