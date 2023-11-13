import React from "react";
// import {Link, Route, Routes} from "react-router-dom";
import PopupContainer from "../popup/popupContainer";
import PopupDetail from "../popup/popupDetail";
import {HashRouter as Router, Link, Route, Routes} from "react-router-dom";

const Tab = () => {
    return (
        <Router>
            <div>
                {" "}
                <ul>
                    <li>
                        <Link to="/popup.html">HOME</Link>
                    </li>
                    <li>
                        <Link to="/popup.html/detail">DETAIL</Link>
                    </li>
                </ul>
                <Routes>
                    <Route path="/popup.html" element={<PopupContainer/>}/>
                    <Route path="/popup.html/detail/:id" element={<PopupDetail/>}/>
                </Routes>
            </div>
        </Router>
    );
};

export default Tab;
