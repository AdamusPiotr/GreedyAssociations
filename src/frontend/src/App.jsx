import axios from "axios";
import React, { useRef, useState } from "react";
import Checkbox from "./components/Checkbox.jsx";
import FileInput from "./components/FileInput.jsx";
import FileLine from "./components/FileLine.jsx";
import HeuristicTypesCheckboxes from "./components/HeuristicTypesRadios.jsx";
import HeuristicTypesRadios from "./components/HeuristicTypesRadios.jsx";
import InformationSystemTable from "./components/InformationSystemTable.jsx";
import Modal from "./components/Modal.jsx";

function App() {
  const [associationRules, setAssociationRules] = useState([]);
  const [files, setFiles] = useState([]);
  const [informationSystem, setInformationSystem] = useState();
  const formData = useRef(new FormData());

  const [heuristicTypes, setHeuristicTypes] = useState([
    "m",
    "maxCov",
    "rm",
    "poly",
    "log",
  ]);

  const onFileAdded = (e) => {
    setFiles((prev) => [...prev, e.target.files[0]]);
  };

  const processInputs = async () => {
    formData.current.delete("files");
    files.forEach((file) => {
      console.log(file);
      formData.current.append("files", file);
    });

    const resp = await axios.post(
      "http://localhost:3001/fileUpload",
      formData.current,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("resp.data", resp.data[0].systemInfo);

    setAssociationRules(resp.data);
  };

  const onSystemLookup = async (file) => {
    const formData = new FormData();

    formData.append("file", file);

    const resp = await axios.post(
      "http://localhost:3001/system-lookup",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setInformationSystem(resp.data);
  };

  return (
    <div className="w-screen h-screen bg-gray-100 ">
      <div className="w-full h-16 p-4 flex flex-col justify-center bg-blue-600">
        <span className="font-sans font-bold">Miningster</span>
      </div>
      <div className="flex flex-wrap p-4 justify-between">
        <div
          className="flex justify-between p-10
               md:px-7
               rounded-[20px]
               bg-white
               shadow-md
               hover:shadow-lg
               mb-8
               w-full"
        >
          <div className="w-[32%]">
            <div>Heuristic Type</div>

            <div className="pt-7">
              <HeuristicTypesCheckboxes values={heuristicTypes} />
            </div>
          </div>

          <div className="w-[32%]">
            <div>Files with headers</div>

            <div className="pt-7">
              <Checkbox />
            </div>
          </div>

          <div className="w-[32%] h-full flex justify-center items-center">
            <div
              className="h-10 w-32 bg-green-500 flex justify-center items-center rounded-md text-white hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer hover:active:translate-y-0 hover:active:shadow-none "
              onClick={async () => {
                await processInputs();
              }}
            >
              Generate
            </div>
          </div>
        </div>

        <div
          className="flex flex-col justify-center p-10
               md:px-7
               xl:px-10
               rounded-[20px]
               bg-white
               shadow-md
               hover:shadow-lg
               mb-8
               w-[48%]"
        >
          {files.length > 0 ? (
            files.map((file) => {
              return (
                <FileLine
                  key={file.name}
                  file={file}
                  onLookupClick={onSystemLookup}
                  onCrossClick={(deletedFile) => {
                    setFiles((prev) => {
                      return prev.filter((file) => {
                        return file !== deletedFile;
                      });
                    });
                  }}
                />
              );
            })
          ) : (
            <span className="text-xl">No files added yet</span>
          )}
          <FileInput onFileAdded={onFileAdded} />
        </div>

        <div
          className="flex flex-col justify-center p-10
               md:px-7
               xl:px-10
               rounded-[20px]
               bg-white
               shadow-md
               hover:shadow-lg
               mb-8
               w-[48%]"
        ></div>
      </div>
      <div>
        <Modal
          isOpen={!!informationSystem}
          onExitClick={() => [setInformationSystem(undefined)]}
        >
          {informationSystem && (
            <InformationSystemTable informationSystem={informationSystem} />
          )}
        </Modal>
      </div>
    </div>
  );
}

export default App;
