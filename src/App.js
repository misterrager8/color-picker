import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

import "./App.css";
import Display from "./components/Display";
import Context from "./Context";

function App() {
  return (
    <Context>
      <Display />
    </Context>
  );
}

export default App;
