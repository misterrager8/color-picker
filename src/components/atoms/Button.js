import { Icon } from "@iconify/react";

export default function Button({
  onClick,
  style,
  icon,
  text,
  disabled = false,
  border = false,
  active = false,
  type_ = "button",
  className = "",
}) {
  return (
    <button
      style={style}
      disabled={disabled}
      type={type_}
      className={
        className +
        " btn" +
        (border ? "" : " border-0") +
        (active ? " active" : "")
      }
      onClick={onClick}>
      {icon && <Icon inline className={text ? "me-2" : ""} icon={icon} />}
      {text && <span>{text}</span>}
    </button>
  );
}
