import React from "react";

function Radio({ text }) {
  return (
    <div>
      <div>
        <div class="form-check">
          <input
            className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer hover:border-2 hover:border-blue-600"
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault1"
          />
          <label
            className="form-check-label inline-block text-gray-800"
            for="flexRadioDefault1"
          >
            {text}
          </label>
        </div>
      </div>
    </div>
  );
}

export default Radio;
