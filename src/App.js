import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";
import { useEffect, useState } from "react";

function ColorBox({ item }) {
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(item.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="col text-center d-flex"
      style={{ backgroundColor: `#1a1a1a`, color: "#cccccc" }}>
      <div className="m-auto">
        <div className={hovered ? "" : "invisible"}>
          <div className="btn-group-vertical">
            {/* <button className="btn btn-lg">
              <i className="bi bi-x-lg"></i>
            </button> */}
            <button className="btn btn-lg" onClick={() => copy()}>
              <i className={"bi bi-" + (copied ? "check-lg" : "copy")}></i>
            </button>
          </div>
        </div>
        <div className="mt-5">
          <div className="h2">{item.hex.slice(1)}</div>
          <div>{item.rgb}</div>
          <button
            className="mt-5"
            style={{
              color: `rgb(${item.rgb})`,
              border: `1px solid rgb(${item.rgb})`,
              borderRadius: "5px",
              padding: "1px 30px",
              backgroundColor: "transparent",
              letterSpacing: "2px",
            }}>
            Button
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [colors, setColors] = useState([]);
  const [num] = useState(5);

  const setAllColors = () => {
    fetch("http://colormind.io/api/", {
      method: "POST",
      headers: {},
      body: JSON.stringify({
        model: "default",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        let colors_ = [];
        for (let x = 0; x < data.result.length; x++) {
          let r_hex = data.result[x][0].toString(16);
          let g_hex = data.result[x][1].toString(16);
          let b_hex = data.result[x][2].toString(16);
          let hex = `#${r_hex}${g_hex}${b_hex}`.toLocaleUpperCase();

          let brightness = Math.round(
            ((data.result[x][0] * 212.6 +
              data.result[x][1] * 715.2 +
              data.result[x][2] * 72.2) /
              1000 /
              255) *
              100
          );
          let textColor = brightness > 40 ? "#1a1a1a" : "#cccccc";

          colors_.push({
            hex: hex,
            rgb: `${data.result[x][0]}, ${data.result[x][1]}, ${data.result[x][2]}`,
            textColor: textColor,
          });
        }
        setColors(colors_);
      });
    // eslint-disable-next-line
  };

  // const getRandomColor = () => {
  //   let r_int = Math.round(Math.random() * 255);
  //   let r_hex = r_int.toString(16);

  //   let g_int = Math.round(Math.random() * 255);
  //   let g_hex = g_int.toString(16);

  //   let b_int = Math.round(Math.random() * 255);
  //   let b_hex = b_int.toString(16);

  //   let hex = `#${r_hex}${g_hex}${b_hex}`.toLocaleUpperCase();
  //   let rgb = `${r_int}, ${g_int}, ${b_int}`;
  //   let brightness = Math.round(
  //     ((r_int * 212.6 + g_int * 715.2 + b_int * 72.2) / 1000 / 255) * 100
  //   );
  //   let textColor = brightness > 40 ? "black" : "white";

  //   return { hex: hex, rgb: rgb, textColor: textColor };
  // };

  useEffect(() => setAllColors(), []);

  return (
    <div className="overflow-hidden">
      <button
        onClick={() => setAllColors()}
        className="btn btn-lg position-absolute">
        <i className="bi bi-shuffle"></i>
      </button>
      <div
        className="row shadow"
        style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
        {colors.map((x) => (
          <ColorBox key={x.hex} item={x} />
        ))}
      </div>
    </div>
  );
}

export default App;
