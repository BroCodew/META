import React from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import PopupContainer from "./popupContainer";
import "./popup.scss";
import "./bootstrap.css";
import "./style.css";
import "./form.css";
// import "./all.min.css";
import PopupDetail from "./popupDetail";
const test = (
  <div>
    <h1>Hello 1</h1>
  </div>
);

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <div className="popup">
        <PopupContainer />
      </div>
    </ChakraProvider>
  </React.StrictMode>
  // <React.StrictMode>
  //   <ChakraProvider>
  //     <div className="popup-detail">
  //       <PopupDetail />
  //     </div>
  //   </ChakraProvider>
  // </React.StrictMode>
);
// root.render(test);
// import React from "react";

// const popup = () => {
//   return <div>Hello world</div>;
// };

// export default popup;
