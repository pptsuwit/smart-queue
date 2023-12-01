import React, { MouseEventHandler } from "react";

interface Props {
  name: string;
  onClick: () => void;
  icon?: React.ReactElement;
  className?: string;
}
export default function Btn(props: Props) {
  return (
    <button
      onClick={props.onClick}
      type="button"
      className={`px-4 py-3 mt-4 text-gray-800 font-semibold border border-gray-400 rounded-md outline-none focus:ring-4 shadow-lg transform active:scale-y-75 transition-transform flex ${props.className}`}
    >
      {props.icon ? props.icon : <></>}

      <span className="ml-2">{props.name}</span>
    </button>
  );
}
