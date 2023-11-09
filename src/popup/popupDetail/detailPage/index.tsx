import React, { useEffect, useState } from "react";
import {
    Center,
    Table,
    TableCaption,
    Th,
    Thead,
    Tr,
    Td,
} from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import styles from "./styles/index.module.scss";
import { v4 as uuidv4 } from "uuid";

const DetailPage = () => {
    const [accessToken, setAccessToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [dataAccount, setDataAccount] = useState([]);
    const [accountID, setAccountID] = useState(null);
    const [infos, setInfos] = useState([]);
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const Title_Account = [
        {
            STT: "STT",
            DATE: "Ngày tháng",
            DATE_BACKUP: "Ngày Backup",
            COOKIES: "Cookie",
            ID_TKQC: "ID_TKQC",
            THRESHOLD: "Ngưỡng",
            LIMIT: "LIMIT",
            PROFILE_CHROME: "Profile Chrome",
            COUNTRY: "COUNTRY",
            CITY: "CITY",
            IP: "IP",
            NAME_TK: "Tên_TK",
            DEBT: "Dư nợ",
            ADMIN: "ADMIN",
            TOTAL_SPENDING: "Tổng Tiêu",
            PERMISSION_ACCOUNT: "Quyền Tài Khoản",
            CURRENCY: "Tiền tệ",
            ACCOUNT_TYPE: "Loại tài khoản",
            PERMISSION_BM: "Quyền BM",
            ID_BM: "ID BM",
            PAYMENT_METHOD: "PTTT",
            TIME_ZONE: "Múi giờ",
        },
    ];

    const handleGetAccessToken = () => {
        chrome.runtime.sendMessage({ action: "login_request" }, (response) => {
            if (response && response.success) {
                setDataAccount(response.data.data);
                response.accountId.id && setAccountID(response.accountId.id);
                console.log("dataPopup", response.data);
                setAccessToken(response.token.token);
            } else {
                console.error(response.error);
            }
        });
    };

    const checkStatusBM = (option) => {
        switch (option) {
            case 1:
                return <div className={styles.statusAccount} >
                    <p className={styles.liveIconLive}></p>
                    <p className={styles.liveTextLive}>LIVE</p>
                </div>;
            case 2:
                return <div className={styles.statusAccount} >
                    <p className={styles.liveIconDie}></p>
                    <p className={styles.liveTextDie}>DIE</p>
                </div>;
            case 3:
                return <div className={styles.statusAccount} >
                    <p className={styles.liveIconDebt}></p>
                    <p className={styles.liveTextDebt}>NỢ</p>
                </div>;
            default:
                return "NO INFORM";
        }
    };

    const checkAuthorBM = (option) => {
        console.log('option', option);

        switch (option[0]) {
            case "GENERAL_USER":
                return "Nhà quảng cáo"
            case "REPORTS_ONLY":
                return "Nhà phân tích";
            case "ADMIN":
                return "Quản trị viên";
            default:
                return "NO INFORM";
        }
    };



    useEffect(() => {
        if (
            typeof dataAccount === "object" &&
            accountID !== null &&
            dataAccount.length > 0
        ) {
            let dataInfos = [];
            console.log('dataAccount111', dataAccount[1]);

            for (let i = 0; i < dataAccount.length; i++) {
                dataInfos.push({
                    STT: i + 1,
                    STATUS: checkStatusBM(dataAccount[i]?.account_status),
                    DATE: formattedDate,
                    DATE_BACKUP: "19/11/2023",
                    PROFILE_CHROME: "Profile Chrome",
                    COUNTRY: "Viet Nam",
                    CITY: "Ha Noi",
                    IP: "222.252.20.234",
                    COOKIES: "Cookie",
                    ID_TKQC: dataAccount[i]?.account_id,
                    NAME_TK: dataAccount[i]?.name,
                    DEBT: dataAccount[i]?.balance,
                    THRESHOLD: dataAccount[i]?.adspaymentcycle?.data.map(
                        (item) => item.threshold_amount
                    ),
                    LIMIT: dataAccount[i]?.adtrust_dsl,
                    ADMIN: dataAccount[i]?.userpermissions.data.length,
                    TOTAL_SPENDING: dataAccount[i]?.amount_spent,
                    PERMISSION_ACCOUNT:
                        accountID !== null &&
                            dataAccount[i]?.userpermissions.data.filter(
                                (item) => item?.user?.id === accountID
                            )
                            ? "ADMIN"
                            : "",
                    CURRENCY: dataAccount[i]?.currency,
                    ACCOUNT_TYPE: dataAccount[i].hasOwnProperty("owner_business") ? "BM" : "CN",
                    PERMISSION_BM: checkAuthorBM(dataAccount[i]?.userpermissions.data.filter((item) => item?.user).map((item, index) => {
                        return item?.role.toString();
                    })),
                    ID_BM: dataAccount[i]?.owner_business?.id,
                    PAYMENT_METHOD: dataAccount[
                        i
                    ]?.all_payment_methods?.pm_credit_card?.data.map(
                        (item) => item?.display_string
                    ),
                    TIME_ZONE: `${dataAccount[i]?.timezone_offset_hours_utc}  -  ${dataAccount[i]?.timezone_name} `,
                    ID: uuidv4(),
                });
            }

            setInfos(dataInfos);
        }
    }, [dataAccount, accountID]);

    useEffect(() => {
        handleGetAccessToken();
    }, []);

    return (
        <>

            <div className="app">
                <div className="wrapper" id="main">
                    <div className="sc_heading">
                        <div className="tabs">
                            <button className="tablinks active" data-electronic="AccStatus">
                                AD
                            </button>
                            <button className="tablinks" data-electronic="BMStatus">
                                BM
                            </button>
                            <button className="tablinks" data-electronic="FanPage">
                                PAGE
                            </button>
                            <button className="tablinks" data-electronic="Campaign">
                                CAMP
                            </button>
                        </div>
                        <div className="command">
                            <div className="command_head">
                                <div className="command_flex">
                                    <div className="command_search">
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                        <input id="tbfilter" type="text" placeholder="Tìm kiếm" />
                                    </div>
                                </div>
                                <div className="command_flex">
                                    <div id="btn_currency" className="command_btn">
                                        <i className="fa-solid fa-sack-dollar"></i>
                                    </div>
                                    <div className="command_btn" id="btn_export">
                                        <span>Xuất Excel</span>
                                        <i className="fa-solid fa-download"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="AccStatus" className="tabcontent active">
                        <div className="loaddata1" style={{ display: "none" }}>
                            <img
                                src="chrome-extension://ookgnahfklmejhicejjbfjifppjbfnlk/access/icon/loadingdata.gif"
                                alt=""
                            />
                        </div>
                        <table className="table table-striped" id="tball">
                            <thead id="thall">
                                <tr>
                                    <th className="sort">STT</th>
                                    <th className="sort">Trạng thái</th>
                                    <th className="sort">DATE</th>
                                    <th className="sort">ID</th>
                                    <th className="sort">Tên TK</th>
                                    <th className="sort" style={{ minWidth: "100px" }}>
                                        Dư nợ
                                    </th>
                                    <th className="sort" style={{ minWidth: "70px" }}>
                                        Ngưỡng
                                    </th>
                                    <th className="sort" style={{ minWidth: "70px" }}>
                                        Limit
                                    </th>
                                    <th className="sort" style={{ minWidth: "70px" }}>
                                        Đã tiêu
                                    </th>
                                    <th className="sort">Admin</th>
                                    <th className="sort">Quyền TK</th>
                                    <th className="sort">Tiền tệ</th>
                                    <th className="sort">Loại TK</th>
                                    <th className="sort">Role</th>
                                    <th className="sort">ID BM</th>
                                    <th className="sort">Thanh toán</th>
                                    <th className="sort">Múi giờ</th>
                                </tr>
                            </thead>
                            <tbody id="tb">
                                {infos.map((item, key) => (
                                    <tr className="trInfo" key={key}>
                                        <td className="tdInfo">{item.STT}</td>
                                        <td className="tdInfo">
                                            <div className="tbstatus">
                                                {item.STATUS}
                                            </div>
                                        </td>
                                        <td className="tdInfo"> {item.DATE}</td>
                                        <td className="tdInfo"> {item.ID_TKQC}</td>
                                        <td className="tdInfo"> {item.NAME_TK}</td>
                                        <td className="tdInfo">
                                            <span className="r">{item.DEBT}</span>
                                        </td>
                                        <td className="tdInfo">
                                            <span className="r">{item.THRESHOLD}</span>
                                        </td>
                                        <td className="tdInfo">
                                            <span className="r">{item.LIMIT}</span>
                                        </td>
                                        <td className="tdInfo">
                                            <span className="r">{item.TOTAL_SPENDING}</span>
                                        </td>
                                        <td className="tdInfo">
                                            <div className="tbadminshow">
                                                <span>{item.ADMIN}</span>
                                                <i
                                                    className="fa-solid fa-user-pen fa-sm show-admin"
                                                    title="Xem và xóa admin ẩn"
                                                    data-type="ad"
                                                    data-bemo="372456215074019"
                                                    data-id="573216737882876"
                                                ></i>
                                            </div>
                                        </td>
                                        <td className="tdInfo">{item.PERMISSION_ACCOUNT}</td>
                                        <td className="tdInfo">{item.CURRENCY}</td>
                                        <td className="tdInfo">{item.ACCOUNT_TYPE}</td>
                                        <td className="tdInfo">{item.PERMISSION_BM}</td>
                                        <td className="tdInfo">{item.ID_BM}</td>
                                        <td className="tdInfo">{item.PAYMENT_METHOD}</td>
                                        <td className="tdInfo">{item.TIME_ZONE}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
            <div style={{ display: "flex", backgroundColor: "aqua" }}>
                <button onClick={handleGetAccessToken}>Get Access Token</button>
                <p>{accessToken}</p>
            </div>

        </>
    );
};

export default DetailPage;
