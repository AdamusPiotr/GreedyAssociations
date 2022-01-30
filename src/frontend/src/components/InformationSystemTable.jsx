import React from "react";

function InformationSystemTable({ informationSystem }) {
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-center">
              <thead className="border-b bg-white">
                <tr>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-1 py-1"
                  >
                    #
                  </th>
                  {Object.keys(informationSystem[0]).map((val) => {
                    return (
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-1 py-1"
                      >
                        {val}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {informationSystem.map((row, index) => {
                  return (
                    <tr className="bg-white border-b">
                      <td className="px-1 py-1 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>

                      {Object.values(row).map((val) => {
                        return (
                          <td className="px-1 py-1 whitespace-nowrap text-sm font-medium text-gray-900">
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InformationSystemTable;
