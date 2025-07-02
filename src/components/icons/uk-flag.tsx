import * as React from "react";
import { SVGProps } from "react";

const UkFlag = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 36" {...props}>
    <clipPath id="a">
      <path d="M0 0h60v36H0z" />
    </clipPath>
    <g clipPath="url(#a)">
      <path d="M0 0h60v36H0z" fill="#00247d" />
      <path d="M0 0l60 36m-60 0L60 0" stroke="#fff" strokeWidth="6" />
      <path d="M0 0l60 36m-60 0L60 0" stroke="#cf142b" strokeWidth="4" />
      <path d="M30 0v36M0 18h60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0v36M0 18h60" stroke="#cf142b" strokeWidth="6" />
    </g>
  </svg>
);
export default UkFlag;
