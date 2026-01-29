import { useContext, useState } from "react";
import { MultiContext } from "../../Context";
import { Icon } from "@iconify/react";

export default function SavedThemeItem({ item }) {
  const multiCtx = useContext(MultiContext);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  return (
    <div
      className="col-2 d-flex"
      style={{
        cursor: "pointer",
        backgroundColor: item.primaryBg,
        color: item.primaryTxt,
      }}
      onClick={() =>
        multiCtx.setCurrentTheme(
          multiCtx.currentTheme?.id === item.id ? null : item,
        )
      }>
      <div className="m-auto text-truncate">
        <span
          className="text-truncate fw-bold d-flex"
          style={
            multiCtx.currentTheme?.id === item.id
              ? {
                  borderTop: ".5px solid",
                  borderBottom: ".5px solid",
                  padding: "3px 0px",
                  borderColor: item.btnColor,
                }
              : null
          }>
          {multiCtx.currentTheme?.id === item.id && (
            <Icon
              style={{ color: item.btnColor }}
              className="me-2 my-auto"
              inline
              icon="bi:circle-fill"
            />
          )}
          <span className="text-truncate" style={{ color: item?.btnColor }}>
            {multiCtx.sort === "hue"
              ? item?.hue
              : multiCtx.sort === "saturation"
                ? item?.saturation
                : multiCtx.sort === "lightness"
                  ? item?.lightness
                  : item.name}
          </span>
        </span>
      </div>
    </div>
  );
}
