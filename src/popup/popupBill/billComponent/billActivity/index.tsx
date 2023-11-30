import React from "react";
import './index.scss'
import PaymentCredit from "../../../../static/paymentCredit.png";
import {images} from "../../../../static/icon";
import {Button, Select, Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr} from "@chakra-ui/react";
import {AdCredit} from "../../../../static/icon/AdCredit";


const PopupActivity = () => {

    const test = [
        {transactionID: 5369323996512901-11185455,date:"20/10",amount:	0.03,method:"Visa-1",status:"paid",invoiceID:"FBADS-202-102321273"},
        {transactionID: 5369323996512901-11185455,date:"20/10",amount:	0.03,method:"Visa-1",status:"paid",invoiceID:"FBADS-202-102321273"},
        {transactionID: 5369323996512901-11185455,date:"20/10",amount:	0.03,method:"Visa-1",status:"paid",invoiceID:"FBADS-202-102321273"},
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
                    <div className={"activity-id content-background"}>
                        <div className={"id-account"}>
                            <p className={"font-down-balance"}>Ad account</p>
                            <p className={"font-upper-balance"}>1975358262742601</p>
                        </div>
                        <div className={"id-threshold"}>
                            <div className={"threshold-data"}>
                                <p className={"font-down-balance"}>Current balance</p>
                                <p className={"data-number font-upper-balance"}>$0.00</p>
                            </div>
                            <Button className={"threshold-button"} size={"large"}>Pay now</Button>
                        </div>
                    </div>
                    <div className={"activity-action content-background"}>
                        <Select placeholder='Transactions'>
                            <option value='option1'>Transactions</option>
                            <option value='option2'>Account spending limit</option>
                        </Select>
                    </div>
                    <div className={"activity-transaction content-background"}>

                        <TableContainer>
                            <Table variant='simple' __css={{'table-layout': 'fixed', width: 'full'}}>
                                <Thead>
                                    <Tr>
                                        <Th className={"font-upper-balance"} style={{paddingLeft:"-10px",fontWeight:"800"}}>Transaction ID</Th>
                                        <Th className={"font-upper-balance"} style={{paddingLeft:"-10px",fontWeight:"800"}}>Date</Th>
                                        <Th className={"font-upper-balance"} style={{fontWeight:"800"}}>Amount</Th>
                                        <Th className={"font-upper-balance"} style={{fontWeight:"800"}}>Payment method</Th>
                                        <Th className={"font-upper-balance"} style={{fontWeight:"800"}}>VAT invoice ID</Th>
                                        <Th className={"font-upper-balance"} style={{fontWeight:"800"}}>Payment status</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {test.map(item =>(
                                        <Tr>
                                            <Th className={"font-down-balance"} style={{fontWeight:"500"}}>{item.transactionID}</Th>
                                            <Th className={"font-down-balance"} style={{fontWeight:"500"}}>{item.date}</Th>
                                            <Th className={"font-down-balance"} style={{fontWeight:"500"}}>${item.amount}</Th>
                                            <Th className={"font-down-balance "} style={{fontWeight:"500"}}>{item.method}</Th>
                                            <Th className={"font-down-balance"} style={{fontWeight:"500"}}>{item.invoiceID}</Th>
                                            <Th  style={{fontWeight:"500"}}>
                                                <span className={"font-down-balance background-paid"}>

                                                {item.status}
                                                </span>
                                            </Th>

                                        </Tr>
                                    ))}
                                </Tbody>

                            </Table>
                        </TableContainer>
                    </div>

            </div>
        </>
    )
}
export default PopupActivity;