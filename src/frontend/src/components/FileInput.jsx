import React from "react";
import { ReactComponent as CirclePlusIcon } from "../assets/circlePlusIcon.svg";

function FileInput({ onFileAdded }) {
  return (
    <label htmlFor="fileUploader" className="flex justify-center pt-6">
      <input
        id="fileUploader"
        type="file"
        onChange={onFileAdded}
        style={{
          width: 0,
          height: 0,
          visibility: "hidden",
        }}
      />
      <CirclePlusIcon className="h-10 w-10 hover:stroke-blue-600 cursor-pointer self-center" />
    </label>
  );
}

export default FileInput;
