const api = (url, params, callback) =>
  fetch("/" + url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(params),
  })
    .then((response) => response.json())
    .then((data) => (!data.success ? alert(data.msg) : callback(data)));

const MultiContext = React.createContext();

function Icon({ className, name }) {
  return <i className={className + " bi bi-" + name}></i>;
}

function Button({
  className,
  type_ = "button",
  onClick,
  icon,
  text,
  size,
  tooltip,
}) {
  return (
    <button
      title={tooltip}
      type={type_}
      className={className + " btn" + (size === "sm" ? " btn-sm" : "")}
      onClick={onClick}>
      {icon && <i className={"bi bi-" + icon + (text ? " me-1" : "")}></i>}
      {text}
    </button>
  );
}

function Input({
  className,
  onChange,
  value,
  placeholder,
  required,
  type_,
  size,
}) {
  return (
    <input
      onChange={onChange}
      value={value}
      className={
        className + " form-control" + (size === "sm" ? " form-control-sm" : "")
      }
      placeholder={placeholder}
      required={required}
      autoComplete="off"
      type={type_}
    />
  );
}

function ButtonGroup({ className, size, children }) {
  return (
    <div
      className={
        className + " btn-group" + (size === "sm" ? " btn-group-sm" : "")
      }>
      {children}
    </div>
  );
}

function InputGroup({ className, size, children }) {
  return (
    <div
      className={
        className + " input-group" + (size === "sm" ? " input-group-sm" : "")
      }>
      {children}
    </div>
  );
}

function Spinner({ className }) {
  return (
    <span className={className + " spinner-border spinner-border-sm"}></span>
  );
}

function Badge({ className, icon, text }) {
  return (
    <span className={className + " badge"}>
      {icon && <i className={"bi bi-" + icon + (text ? " me-1" : "")}></i>}
      {text}
    </span>
  );
}

function Dropdown({
  className,
  classNameBtn,
  classNameMenu,
  target,
  icon,
  children,
  text,
  autoClose = true,
}) {
  return (
    <div className={className + " dropdown"}>
      <a
        data-bs-target={"#" + target}
        data-bs-toggle="dropdown"
        data-bs-auto-close={autoClose}
        className={classNameBtn + " dropdown-toggle"}>
        {icon && <Icon name={icon} className="me-1" />}
        {text}
      </a>
      <div id={target} className={classNameMenu + " dropdown-menu"}>
        {children}
      </div>
    </div>
  );
}

function Heading({ className, size = 1, icon, text }) {
  return (
    <div className={className + " text-center h" + size}>
      {icon && <Icon name={icon} className="me-3" />}
      {text}
    </div>
  );
}

function ThemeItem({ item, className }) {
  const multiCtx = React.useContext(MultiContext);
  const [deleting, setDeleting] = React.useState(false);

  const btnStyles = {
    backgroundColor: "transparent",
    color: item.textColor,
    borderColor: `${item.textColor}`,
  };

  return (
    <div
      className="mb-1 rounded py-1 ps-3 between"
      style={{
        backgroundColor: item.hex,
        color: item.textColor,
      }}>
      <a className="small" onClick={() => multiCtx.setCurrentColor(item)}>
        <Icon name="eyedropper" className="me-2" />
        {item.name}
      </a>
      <ButtonGroup size="sm">
        {/* <button className="btn border-0" style={btnStyles}>
          <Icon name="clipboard" />
        </button> */}
        {deleting && (
          <button
            onClick={() => multiCtx.deleteTheme(item.id)}
            className="btn border-0"
            style={btnStyles}>
            <Icon name="question-lg" />
          </button>
        )}
        <button
          onClick={() => setDeleting(!deleting)}
          className="btn border-0"
          style={btnStyles}>
          <Icon name="x-lg" />
        </button>
      </ButtonGroup>
    </div>
  );
}

function App() {
  const [loading, setLoading] = React.useState(false);
  const [currentColor, setCurrentColor] = React.useState(null);
  const [themes, setThemes] = React.useState([]);
  const [showThemes, setShowThemes] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  async function getName(code) {
    let response = await fetch(`https://api.color.pizza/v1/?values=${code}`);
    let data = await response.json();

    return data;
  }

  const getThemes = () =>
    api("get_themes", {}, (data) => setThemes(data.themes));

  const addTheme = () =>
    api(
      "add_theme",
      {
        name: currentColor.name,
        hex: currentColor.hex,
        textColor: currentColor.textColor,
      },
      (data) => {
        getThemes();
        setSaved(true);
        setTimeout(() => setSaved(false), 1000);
      }
    );

  const deleteTheme = (id) =>
    api("delete_theme", { id: id }, (data) => {
      getThemes();
    });

  const deleteAllThemes = () =>
    api("delete_all_themes", {}, (data) => {
      getThemes();
    });

  const getRandomColor = () => {
    setLoading(true);
    let r_int = Math.round(Math.random() * 255);
    let r_hex = r_int.toString(16);

    let g_int = Math.round(Math.random() * 255);
    let g_hex = g_int.toString(16);

    let b_int = Math.round(Math.random() * 255);
    let b_hex = b_int.toString(16);

    let hex = `#${r_hex}${g_hex}${b_hex}`;
    while (hex.length < 7) {
      hex += Math.round(Math.random() * 255).toString(16);
    }

    let rgb = `${r_int}, ${g_int}, ${b_int}`;
    let brightness = Math.round(
      ((r_int * 212.6 + g_int * 715.2 + b_int * 72.2) / 1000 / 255) * 100
    );
    let textColor = brightness > 40 ? "#1a1a1a" : "#cccccc";

    getName(hex.slice(1)).then((data) => {
      setCurrentColor({
        hex: textColor,
        rgb: rgb,
        textColor: hex,
        name: (data.paletteTitle || "").toLowerCase().split(" ").join("-"),
      });
      setLoading(false);
    });
  };

  React.useEffect(() => {
    getRandomColor();
    getThemes();
  }, []);

  const textStyles = {
    backgroundColor: currentColor?.hex,
    color: currentColor?.textColor,
  };

  const btnStyles = {
    backgroundColor: "transparent",
    color: currentColor?.textColor,
    borderColor: `${currentColor?.textColor}`,
  };

  const btnStyles2 = {
    backgroundColor: showThemes ? currentColor?.textColor : "transparent",
    color: showThemes ? currentColor?.hex : currentColor?.textColor,
    borderColor: `${currentColor?.textColor}`,
  };

  const copyable = (name, hex, textColor) => `
  html[data-theme="${name}-${hex === "#1a1a1a" ? "dark" : "light"}"] {
    --primary-bg: ${hex};
    --primary-txt: ${hex === "#1a1a1a" ? "#cccccc" : "#1a1a1a"};
    --btn-color: ${textColor};
    --btn-hover-text: ${hex};
  }`;

  const contextValue = {
    loading: loading,
    setLoading: setLoading,
    currentColor: currentColor,
    setCurrentColor: setCurrentColor,
    getThemes: getThemes,
    deleteTheme: deleteTheme,
    copyable: copyable,
    deleteAllThemes: deleteAllThemes,
  };

  return (
    <MultiContext.Provider value={contextValue}>
      <div className="p-4 h-100" style={textStyles}>
        <div className="d-flex h-100">
          <div className="m-auto">
            <div
              className="text-center"
              style={{ fontSize: "7.5rem", fontStyle: "italic" }}>
              {currentColor?.name}
            </div>
            <div className="d-flex mt-4">
              <div className="m-auto">
                <ButtonGroup className="btn-group-lg w-100">
                  <button
                    onClick={() => getRandomColor()}
                    className="btn border-0"
                    style={btnStyles}>
                    <Icon
                      name={loading ? "hourglass-split" : "arrow-clockwise"}
                    />
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        copyable(
                          currentColor.name,
                          currentColor.hex,
                          currentColor.textColor
                        )
                      );
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1000);
                    }}
                    className="btn border-0"
                    style={btnStyles}>
                    <Icon name={"clipboard" + (copied ? "-check-fill" : "")} />
                  </button>
                  <button
                    onClick={() => {
                      let colors_ = { ...currentColor };
                      [colors_.hex, colors_.textColor] = [
                        colors_.textColor,
                        colors_.hex,
                      ];
                      setCurrentColor(colors_);
                    }}
                    className="btn border-0"
                    style={btnStyles}>
                    <Icon name="arrow-down-up" />
                  </button>
                  <button
                    onClick={() => addTheme()}
                    className="btn border-0"
                    style={btnStyles}>
                    <Icon name={saved ? "check-lg" : "floppy2"} />
                  </button>
                  <button
                    onClick={() => setShowThemes(!showThemes)}
                    className="btn border-0"
                    style={btnStyles2}>
                    <Icon className="me-2" name="palette-fill" />
                    <span className="small">{themes.length}</span>
                  </button>
                </ButtonGroup>
                <div className="" style={{ height: "300px", width: "450px" }}>
                  {showThemes && (
                    <div>
                      <hr />
                      <div className="between mb-3">
                        <ButtonGroup size="sm">
                          <button className="btn border-0" style={btnStyles}>
                            <Icon className="me-2" name="caret-down-fill" />
                            Newest
                          </button>
                        </ButtonGroup>
                        <ButtonGroup size="sm">
                          <button
                            className="btn border-0"
                            style={btnStyles}
                            onClick={() => {
                              let copyables = [];
                              for (let x = 0; x < themes.length; x++) {
                                copyables.push(
                                  copyable(
                                    themes[x].name,
                                    themes[x].hex,
                                    themes[x].textColor
                                  )
                                );
                              }
                              navigator.clipboard.writeText(
                                copyables.join("\n\n")
                              );

                              setCopied(true);
                              setTimeout(() => setCopied(false), 1000);
                            }}>
                            <Icon className="me-2" name="clipboard" />
                            Copy
                          </button>
                          <button
                            className="btn border-0"
                            style={btnStyles}
                            onClick={() => {
                              let copyables = [];
                              for (let x = 0; x < themes.length; x++) {
                                copyables.push(
                                  `"${themes[x].name}-${
                                    themes[x].hex === "#1a1a1a"
                                      ? "dark"
                                      : "light"
                                  }"`
                                );
                              }
                              navigator.clipboard.writeText(
                                copyables.join(",")
                              );

                              setCopied(true);
                              setTimeout(() => setCopied(false), 1000);
                            }}>
                            <Icon className="me-2" name="type" />
                            Copy Names
                          </button>
                          <button
                            onClick={() => deleteAllThemes()}
                            className="btn border-0"
                            style={btnStyles}>
                            <Icon className="me-2" name="x-lg" />
                            Delete
                          </button>
                        </ButtonGroup>
                      </div>
                      <div
                        style={{
                          height: "300px",
                          width: "450px",
                          overflow: "auto",
                        }}>
                        {themes.map((x) => (
                          <ThemeItem key={x.id} item={x} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MultiContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
