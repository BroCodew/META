import React from "react";
import {createRoot} from "react-dom/client";
import {ChakraProvider} from "@chakra-ui/react";
import "./popup.scss";
import "./bootstrap.css";
import "./style.css";
import "./form.css";
import Tab from "../tabs/tabs";
// import "./all.min.css";


const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <ChakraProvider>
            <div className="popup">
                <Tab/>
            </div>
        </ChakraProvider>
    </React.StrictMode>
);

