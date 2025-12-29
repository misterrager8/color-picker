export default function Button({
  text,
  icon,
  onClick,
  type_ = "button",
  active,
  border = true,
  className = "",
}) {
  return (
    <button
      onClick={onClick}
      type={type_}
      className={
        className +
        "btn-custom" +
        (border ? "" : " border-0") +
        (active ? " active" : "")
      }>
      {icon && <i className={"bi bi-" + icon + (text ? " me-1" : "")}></i>}
      {text && <span>{text}</span>}
    </button>
  );
}
