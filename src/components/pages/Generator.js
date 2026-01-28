import { useContext, useEffect, useState } from "react";
import { MultiContext } from "../../Context";
import ColorItem from "../items/ColorItem";
import { v4 as uuidv4 } from "uuid";
import Button from "../atoms/Button";

export default function Generator() {
  const multiCtx = useContext(MultiContext);
  const [base, setBase] = useState("both");
  const [allSaved, setAllSaved] = useState(false);

  const hslToHex = (h, s, l) => {
    s /= 100;
    l /= 100;

    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

    const toHex = (x) =>
      Math.round(x * 255)
        .toString(16)
        .padStart(2, "0");

    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
  };

  const getRandomColor = () => {
    let shades = [];

    let h = Math.round(Math.random() * 359);
    let s = Math.round(Math.random() * (90 - 10) + 10);
    let l;
    if (base === "light") {
      l = Math.round(Math.random() * (4 - 1) + 1) * 10;
    } else if (base === "dark") {
      l = Math.round(Math.random() * (9 - 5) + 5) * 10;
    } else {
      l = Math.round(Math.random() * (9 - 1) + 1) * 10;
    }

    for (let y = 1; y <= 10; y++) {
      shades.push({
        hslCode: `hsl(${h} ${s} ${y * 10})`,
        hexCode: hslToHex(h, s, y * 10),
        textColor: y < 5 ? "#cccccc" : "#1a1a1a",
      });
    }

    let hsl = `hsl(${h} ${s} ${l})`;
    return {
      id: uuidv4(),
      shades: shades,
      hslCode: hsl,
      hslValues: {
        hue: h,
        saturation: s,
        lightness: l,
      },
      hexCode: hslToHex(h, s, l),
      textColor: l < 50 ? "#cccccc" : "#1a1a1a",
    };
  };

  const getRandomColors = () => {
    let colors_ = [];
    for (let x = 0; x < multiCtx.limit; x++) {
      colors_.push(getRandomColor());
    }
    multiCtx.setColors(colors_);
  };

  useEffect(() => {
    getRandomColors();
  }, [multiCtx.limit, base]);

  return (
    <>
      <div className="nav-custom">
        <div className="my-auto">
          <Button
            border
            icon="oui:generate"
            onClick={() => getRandomColors()}
          />
          <Button
            icon={allSaved ? "bi:check-lg" : "ic:sharp-save-all"}
            onClick={() => {
              multiCtx.addColors([...multiCtx.colors]);
              setAllSaved(true);
              setTimeout(() => setAllSaved(false), 250);
            }}
          />
          <Button
            active={multiCtx.reverseAll}
            icon="picon:switch"
            onClick={() => multiCtx.setReverseAll(!multiCtx.reverseAll)}
          />
          <Button
            disabled={multiCtx.limit === 2}
            icon="bi:dash-lg"
            onClick={() => multiCtx.setLimit(multiCtx.limit - 1)}
          />

          <Button
            icon="oui:color"
            className=""
            text={multiCtx.limit}
            disabled={multiCtx.limit === 5}
            onClick={() => multiCtx.setLimit(5)}
          />
          <Button
            disabled={multiCtx.limit === 10}
            icon="bi:plus-lg"
            onClick={() => multiCtx.setLimit(multiCtx.limit + 1)}
          />
          <Button
            icon="ri:sun-fill"
            onClick={() => setBase("light")}
            active={base === "light"}
          />
          <Button
            icon="solar:moon-bold"
            onClick={() => setBase("dark")}
            active={base === "dark"}
          />
          <Button
            icon="proicons:dark-theme"
            onClick={() => setBase("both")}
            active={base === "both"}
          />
        </div>
      </div>
      <div className="inner">
        {multiCtx.colors.map((x) => (
          <ColorItem key={x.id} item={x} />
        ))}
      </div>
    </>
  );
}
