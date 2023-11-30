import React from "react";
import './index.scss'
import PaymentCredit from "../../../../static/paymentCredit.png";
import {images} from "../../../../static/icon";
import {Button, Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr} from "@chakra-ui/react";
import {AdCredit} from "../../../../static/icon/AdCredit";


const PopupActivity = () => {

    const test = [
        {date:"20/10",method:"Visa-1",amount:	0.03,status:"paid"},
        {date:"20/10",method:"Visa-1",amount:	0.03,status:"paid"},
        {date:"20/10",method:"Visa-1",amount:0.03,status:"paid"}
    ]

    return (
        <>
            <div className={"bill-activity-container"}>
                    <div className={"activity-title"}>
                        <p style={{fontSize:"20px",fontWeight:700}}>Payment activity</p>
                    </div>
                <div className={"activity-account content-background"}>
                    <Button className={"account-button"}>Ad account</Button>
                </div>
                <div className={"activity-id"}>
                    <div>

                        <p>Ad account</p>
                        <p>1975358262742601</p>
                    </div>
                    <div>
                        <div>
                            <p>Current balance</p>
                            <p>$0.00</p>
                        </div>
                        <Button className={"account-button"}>Pay now</Button>

                    </div>

                </div>


            </div>
        </>
    )
}
export default PopupActivity;