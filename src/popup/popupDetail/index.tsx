import React, {useEffect, useState} from "react";
import styles from "./styles/index.module.scss";
import {v4 as uuidv4} from "uuid";

const PopupDetail = () => {
    const [accessToken, setAccessToken] = useState ("");
    const [dataAccount, setDataAccount] = useState ([]);
    const [accountID, setAccountID] = useState (null);
    const [infos, setInfos] = useState ([]);
    const [sortItem, setSortItem] = useState ();
    const [orderBy, setOrderBy] = useState ("ASC");
    const today = new Date ();
    const day = today.getDate ();
    const month = today.getMonth () + 1;
    const year = today.getFullYear ();
    const formattedDate = `${day}/${month}/${year}`;

    const handleGetAccessToken = () => {
        chrome.runtime.sendMessage ({action: "login_request"}, (response) => {
            if (response && response.success) {
                console.log ("response", response.data);

                setDataAccount (response.data.data);
                response.accountId.id && setAccountID (response.accountId.id);
                setAccessToken (response.token.token);
            } else {
                console.error (response.error);
            }
        });
    };

    const checkStatusBM = (option) => {
        switch (option) {
            case 1:
                return (
                    <div className={styles.statusAccount}>
                        <p className={styles.liveIconLive}></p>
                        <p className={styles.liveTextLive}>LIVE</p>
                    </div>
                );
            case 2:
                return (
                    <div className={styles.statusAccount}>
                        <p className={styles.liveIconDie}></p>
                        <p className={styles.liveTextDie}>DIE</p>
                    </div>
                );
            case 3:
                return (
                    <div className={styles.statusAccount}>
                        <p className={styles.liveIconDebt}></p>
                        <p className={styles.liveTextDebt}>NỢ</p>
                    </div>
                );
            default:
                return "DRAFT";
        }
    };

    const checkAuthorBM = (option) => {
        switch (option[0]) {
            case "GENERAL_USER":
                return "Nhà quảng cáo";
            case "REPORTS_ONLY":
                return "Nhà phân tích";
            case "ADMIN":
                return "Quản trị viên";
            default:
                return "DRAFT";
        }
    };

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
    const currencyChange = (current, currentRation) => {
        let change;
        if (typeof current !== "object") {
            change = current / currentRation;
        } else if (Array.isArray (current) && current.length > 0) {
            change = current[0] / currentRation;
        } else if (!current) {
            change = 0;
        } else {
            change = 0;
        }
        const result = change.toFixed (2).replace (/\d(?=(\d{3})+\.)/g, "$&,");

        return result;
    };

    const [sortNumber, setSortNumber] = useState ();


    const handleSortItem = (item) => {
        console.log ("itemTextSort", item);

        if (orderBy === "ASC") {
            const stored = [...infos].sort ((a, b) => (a[item] > b[item] ? 1 : -1));
            setInfos (stored);
            setOrderBy ("DSC");
        }
        if (orderBy === "DSC") {
            const stored = [...infos].sort ((a, b) => (a[item] < b[item] ? 1 : -1));
            setInfos (stored);
            setOrderBy ("ASC");
        }
    };

    function compare(a, b, field) {
        if (a[field] < b[field]) {
            return -1;
        }
        if (a[field] > b[field]) {
            return 1;
        }
        return 0;
    }

    const handleSortItemNumber = (field) => {

        function convertCurrencyToNumber(currency) {
            if (typeof currency !== 'string') {
                console.error ('Invalid input. Expected a string.');
                return null;
            }
            const numberValue = parseFloat (currency.replace (/,/g, ''));
            return isNaN (numberValue) ? 0 : numberValue;
        }

        console.log ('infos', infos);
        if (orderBy === "ASC") {
            setInfos (infos.sort ((a, b) => compare ({
                ...a,
                THRESHOLD: convertCurrencyToNumber (a.THRESHOLD),
                DEBT: convertCurrencyToNumber (a.DEBT)

            }, {
                ...b,
                THRESHOLD: convertCurrencyToNumber (b.THRESHOLD),
                DEBT: convertCurrencyToNumber (b.DEBT)
            }, field)).reverse ());
            setOrderBy ("DSC");
        } else {
            setInfos (infos.sort ((a, b) => compare ({
                ...a,
                THRESHOLD: convertCurrencyToNumber (a.THRESHOLD),
                DEBT: convertCurrencyToNumber (a.DEBT)
            }, {
                ...b,
                THRESHOLD: convertCurrencyToNumber (b.THRESHOLD),
                DEBT: convertCurrencyToNumber (b.DEBT)
            }, field)));
            setOrderBy ("ASC");
        }
    };

    function convertCurrencyToNumber(currency) {
        if (typeof currency !== 'string') {
            console.error ('Invalid input. Expected a string.');
            return null;
        }
        const numberValue = parseFloat (currency.replace (/,/g, ''));
        return isNaN (numberValue) ? 0 : numberValue;
    }


    // objs.sort( compare );


    const handleReloadStorage = (e: any) => {
        chrome.runtime.sendMessage ({action: "reload_storage"}, function (response) {
            console.log (response);
        });
    };


    useEffect (() => {
        if (
            typeof dataAccount === "object" &&
            accountID !== null &&
            dataAccount.length > 0
        ) {
            let dataInfos = [];

            for (let i = 0; i < dataAccount.length; i++) {
                const debt = currencyChange (
                    dataAccount[i]?.balance,
                    dataAccount[i]?.account_currency_ratio_to_usd
                );

                const thresholdArr = dataAccount[i]?.adspaymentcycle?.data.map (
                    (item) => item.threshold_amount
                );
                const threShold = currencyChange (
                    thresholdArr,
                    dataAccount[i]?.account_currency_ratio_to_usd
                );
                dataInfos.push ({
                    STT: i + 1,
                    STATUS: checkStatusBM (dataAccount[i]?.account_status),
                    DATE: formattedDate,
                    DATE_BACKUP: "19/11/2023",
                    IP: "222.252.20.234",
                    PROFILE_CHROME: "Profile Chrome",
                    COUNTRY: "Viet Nam",
                    CITY: "Ha Noi",
                    COOKIES: "Cookie",
                    ID_TKQC: dataAccount[i]?.account_id,
                    NAME_TK: dataAccount[i]?.name,
                    DEBT: debt,
                    THRESHOLD: threShold,
                    LIMIT: currencyChange (
                        dataAccount[i]?.adtrust_dsl === -1
                            ? "NO LIMIT"
                            : dataAccount[i]?.adtrust_dsl,
                        dataAccount[i]?.account_currency_ratio_to_usd
                    ),
                    ADMIN: dataAccount[i]?.userpermissions.data.length,
                    TOTAL_SPENDING: currencyChange (
                        dataAccount[i]?.amount_spent,
                        dataAccount[i]?.account_currency_ratio_to_usd
                    ),
                    // TOTAL_SPENDING: dataAccount[i]?.amount_spent,
                    PERMISSION_ACCOUNT:
                        accountID !== null &&
                        dataAccount[i]?.userpermissions.data.filter (
                            (item) => item?.user?.id === accountID
                        )
                            ? "ADMIN"
                            : "",
                    CURRENCY: dataAccount[i]?.currency,
                    ACCOUNT_TYPE: dataAccount[i].hasOwnProperty ("owner_business")
                        ? "BM"
                        : "CN",
                    PERMISSION_BM: checkAuthorBM (
                        dataAccount[i]?.userpermissions.data
                            .filter ((item) => item?.user)
                            .map ((item, index) => {
                                return item?.role.toString ();
                            })
                    ),
                    ID_BM: dataAccount[i]?.owner_business?.id,
                    PAYMENT_METHOD: dataAccount[
                        i
                        ]?.all_payment_methods?.pm_credit_card?.data.map (
                        (item) => item?.display_string
                    ),
                    TIME_ZONE: `${dataAccount[i]?.timezone_offset_hours_utc}  -  ${dataAccount[i]?.timezone_name} `,
                    ID: uuidv4 (),
                });
            }

            setInfos (dataInfos);
        }
    }, [dataAccount, accountID]);

    useEffect (() => {
        handleGetAccessToken ();
    }, []);


    return (
        <>
            <div className="app">
                <div className="header">
                    <div className="divclose">
                        <div id="btn_menu" className="btn_tool2 menux">
                            <img
                                className="menux"
                                src="chrome-extension://ookgnahfklmejhicejjbfjifppjbfnlk/access/icon/menu.png"
                                alt="Menu"
                                style={{width: "16px"}}
                            />
                        </div>
                        <div
                            className="menu"
                            id="menu"
                            style={{visibility: "hidden", opacity: 0}}
                        >
                            <ul>
                                <li id="account">
                                    <div className="user">
                                        <div className="avatar">
                                            <img
                                                src="chrome-extension://ookgnahfklmejhicejjbfjifppjbfnlk/access/icon/avatar_basic.png"
                                                alt=""
                                            />
                                        </div>
                                        <ul className="detail">
                                            <li className="user_name">
                                                <span id="menu-login">Đăng nhập</span>
                                                <i className="fas fa-sign-out-alt"></i>
                                            </li>
                                            <li className="" id="user_detail">
                                                Plan: Basic
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                                <li id="home">Home</li>
                                <li id="btn_show_sharepixel">Share Pixel</li>
                                <li id="btn_show_shareadacc">Share TKQC</li>
                                <li id="btn_show_createbm">Tạo TKQC</li>
                                <li id="btn_show_setcamp">Tạo Campaign</li>
                            </ul>
                        </div>
                    </div>
                    <div className="divclose" onClick={handleReloadStorage}>
                        <div className="c_user" onClick={handleReloadStorage}>
                            <i
                                className="fa-brands fa-facebook"
                                title="Click to copy token"
                            ></i>
                            <span title="Click to copy link profile">James Linihan</span>
                        </div>
                        <div
                            className="div-btn"
                            id="btnreload"
                            style={{pointerEvents: "none", opacity: 0.4}}
                            onClick={handleReloadStorage}
                        >
                            <img
                                className="imgclss"
                                src="chrome-extension://ookgnahfklmejhicejjbfjifppjbfnlk/access/icon/reload.png"
                                alt=""
                            />
                        </div>
                    </div>
                </div>

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
                                        <input id="tbfilter" type="text" placeholder="Tìm kiếm"/>
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
                        <div className="loaddata1" style={{display: "none"}}>
                            <img
                                src="chrome-extension://ookgnahfklmejhicejjbfjifppjbfnlk/access/icon/loadingdata.gif"
                                alt=""
                            />
                        </div>
                        <table className="table table-striped" id="tball">
                            <thead id="thall">
                            <tr>
                                <th className="sort">STT</th>
                                <th
                                    className="sort"
                                    onClick={() =>
                                        handleSortItem (infos.map ((item) => item.STATUS))
                                    }
                                >
                                    Trạng thái
                                </th>
                                <th className="sort">DATE</th>
                                <th className="sort">ID</th>
                                <th
                                    className="sort"
                                    onClick={() =>
                                        handleSortItem (infos.map ((item) => item.NAME_TK))
                                    }
                                >
                                    Tên TK{" "}
                                </th>
                                <th className="sort">Profile Chrome</th>
                                <th className="sort">IP</th>
                                <th
                                    className="sort"
                                    onClick={() =>
                                        handleSortItem (infos.map ((item) => item.CITY))
                                    }
                                >
                                    CITY
                                </th>

                                <th
                                    className="sort"
                                    style={{minWidth: "100px"}}
                                    onClick={() =>
                                        handleSortItemNumber ("DEBT")
                                    }
                                >
                                    Dư nợ
                                </th>
                                <th
                                    className="sort"
                                    style={{minWidth: "70px"}}
                                    onClick={() =>
                                        handleSortItemNumber ("THRESHOLD")
                                    }
                                >
                                    Ngưỡng
                                </th>
                                <th className="sort" style={{minWidth: "70px"}}
                                    onClick={() =>
                                        handleSortItemNumber ("LIMIT")
                                    }
                                >
                                    Limit
                                </th>
                                <th className="sort" style={{minWidth: "70px"}}
                                    onClick={() =>
                                        handleSortItemNumber ("TOTAL_SPENDING")
                                    }
                                >
                                    Tổng Tiêu
                                </th>
                                <th className="sort">Admin</th>
                                <th className="sort">Quyền TK</th>
                                <th
                                    className="sort"
                                    onClick={() =>
                                        handleSortItem (infos.map ((item) => item.CURRENCY))
                                    }
                                >
                                    Tiền tệ
                                </th>
                                <th className="sort">Loại TK</th>
                                <th className="sort">Role</th>
                                <th className="sort">ID BM</th>
                                <th className="sort">Thanh toán</th>
                                <th className="sort">Múi giờ</th>
                            </tr>
                            </thead>
                            <tbody id="tb">
                            {infos.map ((item, key) => (
                                <tr className="trInfo" key={key}>
                                    <td className="tdInfo">{item.STT}</td>
                                    <td className="tdInfo">
                                        <div className="tbstatus">{item.STATUS}</div>
                                    </td>
                                    <td className="tdInfo"> {item.DATE}</td>
                                    <td className="tdInfo"> {item.ID_TKQC}</td>
                                    <td className="tdInfo"> {item.NAME_TK}</td>
                                    <td className="tdInfo"> {item.PROFILE_CHROME}</td>
                                    <td className="tdInfo"> {item.IP}</td>
                                    <td className="tdInfo"> {item.CITY}</td>
                                    <td className="tdInfo">
                                        <span className="r">{item.DEBT}</span>
                                    </td>
                                    <td className="tdInfo">
                      <span className="r">
                        {item.THRESHOLD === "NaN" ? "--" : item.THRESHOLD}
                      </span>
                                    </td>
                                    <td className="tdInfo">
                      <span className="r">
                        {isNaN (item.LIMIT) ? "NO LIMIT" : item.LIMIT}
                      </span>
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
        </>
    );
};

export default PopupDetail;
