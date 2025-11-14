import React from "react";

type StatusButtonProps = {
  label: string;
  status: boolean;
  trueText: string;
  falseText: string;
  onClick: () => void;
};

const StatusButtonComponent: React.FC<StatusButtonProps> = ({ label, status, trueText, falseText, onClick }) => (
  <div className="flex items-center gap-3 ">
    <span className="text-gray-700 font-medium">{label}:</span>
    <button
      className={`px-3 py-1 rounded text-xs font-semibold transition ${
        status
          ?  "bg-gray-100 text-gray-600 border cursor-not-allowed border-gray-200"
          :"bg-green-100 text-green-800 border cursor-pointer border-green-300"
      } hover:shadow`}
      onClick={onClick}
      type="button"
      disabled={status}
    >
      {status ? trueText : falseText}
    </button>
  </div>
);


export default StatusButtonComponent