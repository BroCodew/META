import React from "react";
import './index.scss'
import PaymentCredit from "../../../../static/paymentCredit.png";
import {images} from "../../../../static/icon";
import {Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr} from "@chakra-ui/react";


const PopupBillMethod = () => {

    const test = [
        {date:"20/10",method:"Visa-1",amount:1,status:"paid"},
        {date:"20/10",method:"Visa-1",amount:2,status:"paid"},
        {date:"20/10",method:"Visa-1",amount:3,status:"paid"}
    ]

    return (
        <>
           <div className={"bill-method-container"}>
               <div className={"method-title"}>
                   <p>z.com</p>
               </div>
               <div className={"method-balance"}>
                   <div className={"balance-content"}>
                       <p className={"content-title font-upper-balance"}>Current balance</p>
                       <p className={"content-number font-upper-balance"}>$0.00</p>
                       <p className={"content-due font-down-balance"}>No payment due at this time.</p>
                       <div className={"content-pay"}>
                           <p className={"pay-title font-upper-balance"}>When you'll pay</p>
                           <div className={"pay-content"}>
                               <div className={"content-threshold"}>
                                   <p className={"threshold-number font-upper-balance"}>$900.00</p>
                                   <p className={"threshold-number font-down-balance"}>Payment threshold</p>
                               </div>
                               <p className={"content-text font-down-balance"}>and</p>
                               <div className={"content-time"}>
                                   <p className={"time-date font-upper-balance"}>30 Nov 2023</p>
                                   <p className={"time-text font-down-balance"}>Monthly billing date</p>
                               </div>

                           </div>
                       </div>
                   <div className={"content-limit"}>
                       <p className={"limit-desc font-down-balance"}>Daily spending limit (set by Meta): <span className={"desc-number font-upper-balance"}>$5,000.00</span></p>

                   </div>
                   </div>
               </div>
               <div className={"method-fund content-background"}>
                   <p className={"fund-title font-upper-balance"}>Prepaid funds</p>
                   <p className={"fund-desc font-down-balance"}>Add prepaid funds to pay for ads in advance. We'll deduct from prepaid funds first before charging any payment methods with automatic billing turned on.</p>

               </div>
               <div className={"method-credit content-background"}>
                   <p className={"credit-title font-upper-balance"}>Ad credits</p>
                   <div className={"credit-total"}>
                        <img src={images.PaymentCredit}/>
                       <span className={"font-upper-balance"}> $0.00</span>
                   </div>
               </div>
               <div className={"method-payment content-background"}>
                   <p className={"font-upper-balance"}>Payment methods</p>
               </div>
               <div className={"method-limit content-background"}>
                   <p className={"limit-content font-upper-balance"}>Account spending limit</p>
                   <p className={"limit-text font-down-balance"}>
                       Control your total ad costs by setting an account spending limit. Ads will pause if you reach your limit and won't run again unless you change it.
                       <a style={{color:"rgb(10 88 202)"}}>
                       Learn more about account spending limits
                       </a>
                   </p>

               </div>
               <div className={"method-activity content-background"}>
                   <p className={"activity-title font-upper-balance"}>Payment activity</p>

                   {/*<div className={"activity-body"}>*/}
                   {/*    <div className={"body-title border-activity"}>*/}
                   {/*        <p className={"font-upper-balance"}>Date</p>*/}
                   {/*        <p className={"font-upper-balance"}>Payment method</p>*/}
                   {/*        <p className={"font-upper-balance"}> Amount</p>*/}
                   {/*        <p className={"font-upper-balance"}>Status</p>*/}
                   {/*    </div>*/}
                   {/*    <div className={"body-title border-activity"}>*/}
                   {/*        {test.map(item=>(*/}
                   {/*            <div style={{display:'flex'}}>*/}
                   {/*                <p className={"font-down-balance"}>{item.date}</p>*/}
                   {/*                <p className={"font-down-balance"}>{item.method}</p>*/}
                   {/*                <p className={"font-down-balance"}>{item.amount}</p>*/}
                   {/*                <p className={"font-down-balance"}>{item.status}</p>*/}

                   {/*            </div>*/}
                   {/*        ))}*/}
                   {/*    </div>*/}
                   {/*</div>*/}

                   <TableContainer>
                       <Table variant='simple'>
                           <TableCaption>Imperial to metric conversion factors</TableCaption>
                           <Thead>
                               <Tr>
                                   <Th>To convert</Th>
                                   <Th>into</Th>
                                   <Th isNumeric>multiply by</Th>
                                   <Th isNumeric>multiply by</Th>
                                   
                                   
                               </Tr>

                           </Thead>
                           <Tbody>
                               {test.map(item =>(
                                   <Tr>
                                       <Th>{item.date}</Th>
                                       <Th>{item.method}</Th>
                                       <Th >{item.amount}</Th>
                                       <Th >{item.status}</Th>

                                   </Tr>
                               ))}
                           </Tbody>
                           <Tfoot>
                               <Tr>
                                   <Th>To convert</Th>
                                   <Th>into</Th>
                                   <Th isNumeric>multiply by</Th>
                               </Tr>
                           </Tfoot>
                       </Table>
                   </TableContainer>

                   {/*<div className={"title-data"}>*/}
                    {/*        <div className={"font-upper-balance border-activity"}>*/}
                    {/*            <p className={"font-upper-balance border-activity"}>Date</p>*/}
                    {/*            <p className={"font-down-balance border-activity"}>5 Dec 2022</p>*/}
                    {/*            <p className={"font-down-balance border-activity"}>5 Dec 2022</p>*/}
                    {/*            <p className={"font-down-balance border-activity"}>5 Dec 2022</p>*/}
                    {/*        </div>*/}

                    {/*        <div className={"font-upper-balance border-activity"}>*/}
                    {/*            <p className={"font-upper-balance border-activity"}>Payment method</p>*/}
                    {/*            <p className={"font-down-balance border-activity"}>Visa · 3027</p>*/}
                    {/*            <p className={"font-down-balance border-activity"}>Visa · 3027</p>*/}
                    {/*            <p className={"font-down-balance border-activity"}>Visa · 3027</p>*/}
                    {/*        </div>*/}

                    {/*        <div className={"font-upper-balance border-activity"}>*/}
                    {/*            <p className={"font-upper-balance border-activity"}>Amount</p>*/}
                    {/*            <p className={"font-down-balance border-activity"}>	$0.03</p>*/}
                    {/*            <p className={"font-down-balance border-activity"}>	$0.03</p>*/}
                    {/*            <p className={"font-down-balance border-activity"}>	$0.03</p>*/}

                    {/*        </div>*/}

                    {/*        <div className={"font-upper-balance border-activity"}>*/}
                    {/*            <p className={"font-upper-balance border-activity"}>Status</p>*/}
                    {/*            <p className={"font-down-balance border-activity"}>Paid</p>*/}
                    {/*            <p className={"font-down-balance border-activity"}>Paid</p>*/}
                    {/*            <p className={"font-down-balance border-activity"}>Failed</p>*/}
                    {/*        </div>*/}

                    {/*</div>*/}
               </div>
               <div className={"method-info"}></div>
           </div>
        </>
    )
}
export default PopupBillMethod;