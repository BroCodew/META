import React from "react";
// import {Link, Route, Routes} from "react-router-dom";
import PopupContainer from "../popup/popupContainer";
import PopupDetail from "../popup/popupDetail";
import {HashRouter as Router, Route, Routes} from "react-router-dom";
import PopupBill from "../popup/popupBill";

const Tab = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<PopupContainer/>}/>
                    <Route path="/popup.html" element={<PopupContainer/>}/>
                    <Route path="/popup.html/detail/:id" element={<PopupDetail/>}/>
                    <Route path="/popup.html/bill" element={<PopupBill/>}/>

                </Routes>
            </div>
        </Router>
    );
};

export default Tab;
