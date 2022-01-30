import React from "react";
import cn from "classnames";

function Modal({ isOpen = true, children, onExitClick }) {
  return (
    <>
      <div
        className={cn(
          "modal fade fixed top-0 left-0 w-full h-full outline-none overflow overflow-y-auto overflow-x-auto show display-block",
          {
            hidden: !isOpen,
            show: isOpen,
          }
        )}
        id="exampleModalCenteredScrollable"
        tabindex="-1"
        aria-labelledby="exampleModalCenteredScrollable"
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable relative w-full pointer-events-none max-w-[75vw] max-h-[72vh]">
          <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
            <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
              <h5
                className="text-xl font-medium leading-normal text-gray-800"
                id="exampleModalCenteredScrollableLabel"
              ></h5>
              <button
                type="button"
                className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={onExitClick}
              ></button>
            </div>
            <div className="modal-body relative p-4">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
