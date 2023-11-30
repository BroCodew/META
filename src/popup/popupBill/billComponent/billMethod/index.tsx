import React from "react";
import './index.scss'
import PaymentCredit from "../../../../static/paymentCredit.png";
import {images} from "../../../../static/icon";
import {Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr} from "@chakra-ui/react";
import {AdCredit} from "../../../../static/icon/AdCredit";


const PopupBillMethod = () => {

    const test = [
        {date:"20/10",method:"Visa-1",amount:	0.03,status:"paid"},
        {date:"20/10",method:"Visa-1",amount:	0.03,status:"paid"},
        {date:"20/10",method:"Visa-1",amount:0.03,status:"paid"}
    ]

    return (
        <>
           <div className={"bill-method-container"}>
               <div className={"method-left"}>

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
                           <AdCredit/>
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
                       <TableContainer>
                           <Table variant='simple'>
                               <Thead>
                                   <Tr>
                                       <Th className={"font-upper-balance"} style={{paddingLeft:"-10px"}}>Date</Th>
                                       <Th className={"font-upper-balance"}>Payment method</Th>
                                       <Th className={"font-upper-balance"}>Amount</Th>
                                       <Th className={"font-upper-balance"}>Status</Th>


                                   </Tr>

                               </Thead>
                               <Tbody>
                                   {test.map(item =>(
                                       <Tr>
                                           <Th className={"font-down-balance"}>{item.date}</Th>
                                           <Th className={"font-down-balance"}>{item.method}</Th>
                                           <Th className={"font-down-balance"}>${item.amount}</Th>
                                           <Th className={"font-down-balance background-paid"} style={{width:1}}>{item.status}</Th>

                                       </Tr>
                                   ))}
                               </Tbody>

                           </Table>
                       </TableContainer>
                   </div>
                   <div className={"method-info content-background"}>
                       <p className={"info-title font-upper-balance"}>Business info</p>
                       <div className={"info-data"}>
                           <p className={"font-upper-balance"}>Business name</p>
                           <p className={"font-upper-balance"}>Address</p>
                           <p className={"font-upper-balance"}>Currency</p>
                       </div>
                       <p className={"font-upper-balance"}>_</p>
                       <p className={"info-tax font-upper-balance"}>Tax ID</p>
                       <p className={"font-upper-balance"}>_</p>
                   </div>
               </div>
               <div className={"method-right content-background"}>
                   <div className={"flex-content"}>
                       <p className={"font-right-key"}>Trạng Thái</p>
                       <p className={"font-right-key"}>Hoạt động</p>

                   </div>
                   <div className={"method-ID flex-content"}>
                       <p className={"font-right-key"}>ID</p>
                       <p className={"font-right-key"}>1975358262742601</p>
                   </div>
                   <div className={"method-name flex-content"}>
                       <p className={"font-right-key"}>Tên TK</p>
                       <p className={"font-right-key"}>z.com</p>
                   </div>
                   <div className={"method-name flex-content"}>
                       <p className={"font-right-key"}>Dư nợ</p>
                       <div className={"flex-value"}>

                           <p className={"backGround-blue"}>0 USD</p>
                           <p className={"backGround-green"}>0 $</p>

                       </div>
                   </div>
                   <div className={"method-name flex-content"}>
                       <p className={"font-right-key"}>Ngưỡng</p>
                       <div className={"flex-value"}>
                           <p className={"backGround-blue"}>900 USD</p>
                           <p className={"backGround-green"}>900 $</p>
                       </div>
                   </div>
                   <div className={"method-name flex-content"}>

                       <p className={"font-right-key"}>Limit ngày</p>
                       <div className={"flex-value"}>
                           <p className={"backGround-blue"}>No Limit</p>
                           <p className={"backGround-green"}>No Limit</p>
                       </div>
                   </div>
                   <div className={"method-name flex-content"}>
                       <p className={"font-right-key"}>Limit</p>
                       <div className={"flex-value"}>
                           <p className={"backGround-pink"}>5,000</p>
                           <p className={"backGround-green"}>5,000</p>
                       </div>
                   </div>
                   <div className={"method-name flex-content"}>
                       <p className={"font-right-key"}> Chi tiêu</p>
                       <div className={"flex-value"}>
                           <p className={"backGround-blue"}>8,583.9 USD</p>
                           <p className={"backGround-green"}>8583.9 $</p>
                       </div>
                   </div>
                   <div className={"method-name flex-content"}>
                       <p className={"font-right-key"}>Admin</p>
                       <p className={"font-right-key"}>1</p>
                   </div>
                   <div className={"method-name flex-content"}>
                           <p className={"font-right-key"}>Tiền tệ</p>
                           <p className={"font-right-key"}>USD</p>
                   </div>
                   <div className={"method-name flex-content"}>
                       <p className={"font-right-key"}>Loại TK</p>
                       <p className={"font-right-key"}>Doanh nghiệp</p>
                   </div>
                   <div className={"method-name flex-content"}>
                       <p className={"font-right-key"}>Ngày tạo</p>
                       <p className={"font-right-key"}>2017-08-10</p>
                   </div>
                   <div className={"method-name flex-content"}>
                       <p className={"font-right-key"}>Múi giờ</p>
                       <p className={"font-right-key"}>-5 | America/Lima</p>
                   </div>
                   <div className={"method-name flex-content"}>
                       <p className={"font-right-key"}>Quyền</p>
                       <p className={"font-right-key"}>Quản trị viên</p>
                   </div>

               </div>
           </div>
        </>
    )
}
export default PopupBillMethod;