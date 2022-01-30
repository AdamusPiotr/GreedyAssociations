import React from "react";
import { ReactComponent as TrashIcon } from "../assets/trashIcon.svg";
import { ReactComponent as SearchIcon } from "../assets/searchIcon.svg";

function FileLine({ file, onCrossClick, onLookupClick }) {
  return (
    <div className="flex justify-between items-center my-1">
      <span>{file.name}</span>
      <div className="flex">
        <SearchIcon
          onClick={() => {
            onLookupClick(file);
          }}
          className="h-5 w-5 hover:stroke-blue-600 cursor-pointer mr-4"
        />
        <TrashIcon
          className="h-5 w-5 hover:stroke-red-600 cursor-pointer"
          onClick={() => onCrossClick(file)}
        />
      </div>
    </div>
  );
}

export default FileLine;
