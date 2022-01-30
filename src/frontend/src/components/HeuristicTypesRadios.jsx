import React from "react";
import Checkbox from "./Checkbox";

function HeuristicTypesCheckboxes({ values }) {
  const shouldBeChecked = (checkboxValue) => values.includes(checkboxValue);

  const checkboxes = [
    { text: "Max Cov", value: "maxCov" },
    { text: "Poly", value: "poly" },
    { text: "Log", value: "log" },
    { text: "RM", value: "rm" },
    { text: "M", value: "m" },
  ];

  return (
    <div>
      {checkboxes.map((config) => (
        <Checkbox
          text={config.text}
          checked={shouldBeChecked(config.value)}
          value={config.value}
          key={config.value}
        />
      ))}
    </div>
  );
}

export default HeuristicTypesCheckboxes;
