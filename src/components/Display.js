import { useContext } from "react";
import { MultiContext } from "../Context";
import Button from "./atoms/Button";
import Saved from "./pages/Saved";
import Generator from "./pages/Generator";

export default function Display() {
  const multiCtx = useContext(MultiContext);

  return (
    <div className="body">
      <div className="nav-custom">
        <div className="my-auto d-flex">
          <Button
            active={multiCtx.currentPage === "generator"}
            icon="fa-solid:random"
            onClick={() => multiCtx.setCurrentPage("generator")}
          />
          <Button
            active={multiCtx.currentPage === "saved-colors"}
            text={multiCtx.savedColors.length.toString()}
            icon="icon-park-solid:save"
            onClick={() => multiCtx.setCurrentPage("saved-colors")}
          />
        </div>
      </div>
      {multiCtx.currentPage === "saved-colors" ? (
        <Saved />
      ) : multiCtx.currentPage === "generator" ? (
        <Generator />
      ) : (
        <></>
      )}
    </div>
  );
}
