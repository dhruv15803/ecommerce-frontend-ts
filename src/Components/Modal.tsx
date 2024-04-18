import React from "react";

type ModalProps = {
  logoutUser: () => void;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const Modal = ({ logoutUser, setModal }: ModalProps) => {
  return (
    <>
      {/* Overlay with semi-transparent background */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

      {/* Modal content */}
      <div className="fixed top-[30%] border-2 h-fit w-[50%] mx-auto flex flex-col items-center p-4 shadow-lg rounded-lg bg-white z-50 left-1/2 transform -translate-x-1/2">
        <div className="text-red-500 font-semibold text-xl">
          Are you sure you want to logout?
        </div>
        <div className="flex items-center gap-8 mt-4">
          <button
            onClick={() => setModal(false)}
            className="border-2 rounded-lg p-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={logoutUser}
            className="border-2 rounded-lg p-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Modal;

