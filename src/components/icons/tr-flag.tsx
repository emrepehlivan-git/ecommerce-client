import * as React from "react";
import { SVGProps } from "react";

const TrFlag = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 24" {...props}>
    <rect width="36" height="24" fill="#e30a17" />
    <circle cx="12" cy="12" r="6" fill="#fff" />
    <circle cx="13.5" cy="12" r="4.8" fill="#e30a17" />
    <path
      d="M18.23 12 15.5 10.367l.004 2.022L16.03 14l-2.21-1.241.004 2.022L18.23 12z"
      fill="#fff"
      transform="matrix(.20228 0 0 .20228 15.01 7.95)"
    />
  </svg>
);
export default TrFlag;
