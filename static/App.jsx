const defaultSettings = {
  theme: "light",
};

const MultiContext = React.createContext();

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

function HomePage({ className }) {
  return (
    <div className={className}>
      {/* CHANGE HERE */}
      <Heading icon="cone-striped" text="color-picker" />
      <div className="p-5 col-4 offset-4 fst-italic">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec accumsan
        nulla ut placerat vehicula. Maecenas eleifend purus efficitur, accumsan
        nunc et, ornare lacus. Mauris gravida leo non nisi tincidunt, eu
        sagittis neque pretium. Vivamus velit lectus, fringilla ac gravida quis,
        egestas sit amet quam. Aliquam erat volutpat. Proin sapien felis,
        gravida vel varius sit amet, maximus nec purus. Praesent est massa,
        dictum sed orci a, feugiat condimentum nunc. Maecenas consectetur a
        lectus sodales luctus.
      </div>
    </div>
  );
}

function SettingsPage({ className }) {
  const multiCtx = React.useContext(MultiContext);

  return (
    <div className={className}>
      <Heading icon="gear" text="Settings" className="mb-4" />
      <div style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(multiCtx.settings, null, 4)}
      </div>
    </div>
  );
}

function AboutPage({ className }) {
  const multiCtx = React.useContext(MultiContext);
  const [readme, setReadme] = React.useState("");

  React.useEffect(() => {
    multiCtx.setLoading(true);
    api("about", {}, (data) => {
      setReadme(data.readme);
      multiCtx.setLoading(false);
    });
  }, []);

  return (
    <div className={className}>
      <div
        dangerouslySetInnerHTML={{
          __html: window.markdownit().render(readme),
        }}></div>
    </div>
  );
}

function Display({ className }) {
  const multiCtx = React.useContext(MultiContext);

  return (
    <div className={className + " py-4"}>
      {multiCtx.currentPage === "settings" ? (
        <SettingsPage />
      ) : multiCtx.currentPage === "about" ? (
        <AboutPage />
      ) : (
        <HomePage />
      )}
    </div>
  );
}

function Nav({ className }) {
  const multiCtx = React.useContext(MultiContext);

  const themes = [
    "light",
    "dark",
    "scarlet-light",
    "scarlet-dark",
    "manila-light",
    "manila-dark",
    "mint-light",
    "mint-dark",
    "ocean-light",
    "ocean-dark",
    "lavender-light",
    "lavender-dark",
  ];

  return (
    <div className={className + " between"}>
      <ButtonGroup size="sm">
        {multiCtx.loading && (
          <button className="btn border-0">
            <Spinner />
          </button>
        )}
        <Button
          onClick={() => multiCtx.setCurrentPage("")}
          className="border-0"
          // CHANGE HERE
          text="color-picker"
          icon="cone-striped"
        />
      </ButtonGroup>
      <ButtonGroup size="sm">
        <Dropdown
          className="btn-group btn-group-sm"
          icon="paint-bucket"
          text={multiCtx.settings.theme}
          classNameMenu="text-center"
          classNameBtn="btn text-capitalize">
          {themes.map((x) => (
            <React.Fragment key={x}>
              {multiCtx.settings.theme !== x && (
                <button
                  className="dropdown-item text-capitalize small"
                  onClick={() =>
                    multiCtx.setSettings({ ...multiCtx.settings, theme: x })
                  }>
                  {x}
                </button>
              )}
            </React.Fragment>
          ))}
        </Dropdown>
        <Button
          text="Settings"
          icon="gear"
          className={multiCtx.currentPage === "settings" ? " active" : ""}
          onClick={() => multiCtx.setCurrentPage("settings")}
        />
        <Button
          className={multiCtx.currentPage === "about" ? " active" : ""}
          text="About"
          icon="info-circle"
          onClick={() => multiCtx.setCurrentPage("about")}
        />
      </ButtonGroup>
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [settings, setSettings] = React.useState(
    // CHANGE HERE
    JSON.parse(localStorage.getItem("color-picker")) || defaultSettings
  );

  const contextValue = {
    loading: loading,
    setLoading: setLoading,
    settings: settings,
    setSettings: setSettings,
    currentPage: currentPage,
    setCurrentPage: setCurrentPage,
  };

  React.useEffect(() => {
    // CHANGE HERE
    localStorage.setItem("color-picker", JSON.stringify(settings));

    document.documentElement.setAttribute("data-theme", settings.theme);
  }, [settings]);

  return (
    <MultiContext.Provider value={contextValue}>
      <div className="p-4">
        <Nav />
        <hr />
        <Display />
      </div>
    </MultiContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
