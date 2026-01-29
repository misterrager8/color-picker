import { useContext, useEffect, useState } from "react";
import { MultiContext } from "../../Context";
import { v4 as uuidv4 } from "uuid";
import Button from "../atoms/Button";
import ThemeItem from "../items/ThemeItem";
import { wordBank } from "../../wordBank";

export default function Generator() {
  const multiCtx = useContext(MultiContext);
  const [base, setBase] = useState("both");
  const [allSaved, setAllSaved] = useState(false);

  const classifyHue = (hue) => {
    if (hue <= 15 || (hue >= 345 && hue <= 360)) {
      return "red";
    } else if (hue >= 16 && hue <= 45) {
      return "orange";
    } else if (hue >= 46 && hue <= 75) {
      return "yellow";
    } else if (hue >= 76 && hue <= 150) {
      return "green";
    } else if (hue >= 151 && hue <= 240) {
      return "blue";
    } else if (hue >= 241 && hue <= 270) {
      return "indigo";
    } else if (hue >= 271 && hue <= 344) {
      return "purple";
    }
  };

  const generateName = (hue1, hue2) => {
    let wordBank1 = wordBank.find((x) => x.hue === classifyHue(hue1))?.words;
    let wordBank2 = wordBank.find((x) => x.hue === classifyHue(hue2))?.words;

    let prefix = wordBank1[Math.floor(Math.random() * wordBank1.length)];
    let suffix = wordBank2[Math.floor(Math.random() * wordBank2.length)];

    return `${prefix}-${suffix}`;
  };

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

  const getRandomNumber = (min, max) =>
    Math.round(Math.random() * (max - min) + min);

  const getRandomTheme = () => {
    let hue = getRandomNumber(1, 359);
    let saturation = getRandomNumber(5, 20);
    let lightness = getRandomNumber(15, 85);

    let primaryBg = hslToHex(hue, saturation, lightness);
    let primaryTxt = hslToHex(
      getRandomNumber(1, 359),
      getRandomNumber(10, 30),
      lightness < 40 ? 80 : 10,
    );

    let secondaryColor = hslToHex(
      hue,
      saturation,
      lightness < 40 ? lightness + 15 : lightness - 15,
    );

    let btnHue = getRandomNumber(1, 359);
    let btnColor = hslToHex(
      btnHue,
      getRandomNumber(40, 70),
      getRandomNumber(lightness < 40 ? 60 : 15, lightness < 40 ? 85 : 30),
    );
    let btnHoverTxt = primaryBg;
    let name = generateName(hue, btnHue);

    return {
      id: uuidv4(),
      name: name,
      hue: hue,
      saturation: saturation,
      lightness: lightness,
      primaryBg: primaryBg,
      primaryTxt: primaryTxt,
      secondaryColor: secondaryColor,
      btnColor: btnColor,
      btnHoverTxt: btnHoverTxt,
    };
  };

  const getRandomThemes = () => {
    let themes_ = [];
    for (let x = 0; x < multiCtx.limit; x++) {
      themes_.push(getRandomTheme());
    }
    multiCtx.setThemes(themes_);
  };

  useEffect(() => {
    getRandomThemes();
  }, [multiCtx.limit, base]);

  return (
    <>
      <div className="nav-custom">
        <div className="my-auto">
          <Button
            border
            icon="oui:generate"
            onClick={() => getRandomThemes()}
          />
          <Button
            icon={allSaved ? "bi:check-lg" : "ic:sharp-save-all"}
            onClick={() => {
              multiCtx.addThemes([...multiCtx.themes]);
              setAllSaved(true);
              setTimeout(() => setAllSaved(false), 250);
            }}
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
        {multiCtx.themes.map((x) => (
          <ThemeItem item={x} />
        ))}
      </div>
    </>
  );
}
