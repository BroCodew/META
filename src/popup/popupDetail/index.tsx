import React, {useEffect, useState} from "react";
import styles from "./styles/index.module.scss";
import {v4 as uuidv4} from "uuid";
import {Stack, Switch} from "@chakra-ui/react";

const PopupDetail = () => {
    const [accessToken, setAccessToken] = useState ("");
    const [dataAccount, setDataAccount] = useState ([]);
    const [dataAccountOriginal, setDataAccountOriginal] = useState ([]);

    const [accountID, setAccountID] = useState (null);
    const [infos, setInfos] = useState ([]);
    const [sortItem, setSortItem] = useState ();
    const [orderBy, setOrderBy] = useState ("ASC");
    const [changeCurrency, setChangeCurrency] = useState (false);
    const today = new Date ();
    const day = today.getDate ();
    const month = today.getMonth () + 1;
    const year = today.getFullYear ();
    const formattedDate = `${day}/${month}/${year}`;

    const handleGetAccessToken = () => {
        chrome.runtime.sendMessage ({action: "login_request"}, (response) => {
            if (response && response.success) {
                console.log ("response", response.data);
                setDataAccountOriginal (response.data.data);
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
            THRESHOLD: "Ngưỡng",//threshold_amount//infos:string//dataAccount:number
            LIMIT: "LIMIT", //adtrust_dsl//infos:string//dataAccount:number
            DEBT: "Dư nợ",//balance//infos:string//dataAccount:string
            TOTAL_SPENDING: "Tổng Tiêu",//amount_spent//infos:string//dataAccount:string
            PROFILE_CHROME: "Profile Chrome",
            COUNTRY: "COUNTRY",
            CITY: "CITY",
            IP: "IP",
            NAME_TK: "Tên_TK",
            PERMISSION_ACCOUNT: "Quyền Tài Khoản",
            CURRENCY: "Tiền tệ",
            ACCOUNT_TYPE: "Loại tài khoản",
            PERMISSION_BM: "Role",
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

    function convertCurrencyToNumber(value) {
        if (typeof value === 'number') {
            return value;
        } else if (typeof value === 'string') {
            const sanitizedValue = value.replace (/[^0-9.-]/g, ''); // Loại bỏ tất cả các ký tự không phải số hoặc dấu chấm
            const numberValue = parseFloat (sanitizedValue);
            return isNaN (numberValue) ? 0 : numberValue;
        } else {
            return 0; // Hoặc giá trị mặc định tùy thuộc vào yêu cầu của bạn
        }
    }

    const compare = (a, b, field) => {
        if (a[field] < b[field]) {
            return -1;
        }
        if (a[field] > b[field]) {
            return 1;
        }
        return 0;
    }
    const handleSortItemNumber = (field) => {
        console.log ('infos', infos)


        if (orderBy === "ASC") {
            setInfos (infos.sort ((a, b) => compare ({
                ...a,
                THRESHOLD: convertCurrencyToNumber (a.THRESHOLD),
                DEBT: convertCurrencyToNumber (a.DEBT),
                TOTAL_SPENDING: convertCurrencyToNumber (a.TOTAL_SPENDING),
                STATUS: a.STATUS,
                LIMIT: convertCurrencyToNumber (a.LIMIT),
            }, {
                ...b,
                THRESHOLD: convertCurrencyToNumber (b.THRESHOLD),
                DEBT: convertCurrencyToNumber (b.DEBT),
                TOTAL_SPENDING: convertCurrencyToNumber (b.TOTAL_SPENDING),
                STATUS: b.STATUS,
                LIMIT: convertCurrencyToNumber (b.LIMIT),
            }, field)).reverse ());
            setOrderBy ("DSC");
        } else {
            setInfos (infos.sort ((a, b) => compare ({
                ...a,
                THRESHOLD: convertCurrencyToNumber (a.THRESHOLD),
                DEBT: convertCurrencyToNumber (a.DEBT),
                TOTAL_SPENDING: convertCurrencyToNumber (a.TOTAL_SPENDING),
                STATUS: a.STATUS,
                LIMIT: convertCurrencyToNumber (a.LIMIT),
            }, {
                ...b,
                THRESHOLD: convertCurrencyToNumber (b.THRESHOLD),
                DEBT: convertCurrencyToNumber (b.DEBT),
                TOTAL_SPENDING: convertCurrencyToNumber (b.TOTAL_SPENDING),
                STATUS: b.STATUS,
                LIMIT: convertCurrencyToNumber (b.LIMIT),
            }, field)));
            setOrderBy ("ASC");
        }
        console.log ('infos', infos.map (item => item.THRESHOLD), infos.map (item => typeof item.THRESHOLD))

    };
    const handleSortItemText = (field) => {
        if (orderBy === "ASC") {
            setInfos (infos.sort ((a, b) => compare ({
                ...a,
                PERMISSION_BM: a.PERMISSION_BM,
                NAME_TK: a.NAME_TK,
                PERMISSION_ACCOUNT: a.PERMISSION_ACCOUNT,
                CITY: a.CITY,
                COUNTRY: a.COUNTRY,
                ACCOUNT_TYPE: a.ACCOUNT_TYPE,
                PAYMENT_METHOD: a.PAYMENT_METHOD,
            }, {
                ...b,
                PERMISSION_BM: b.PERMISSION_BM,
                NAME_TK: b.NAME_TK,
                PERMISSION_ACCOUNT: b.PERMISSION_ACCOUNT,
                CITY: b.CITY,
                COUNTRY: b.COUNTRY,
                ACCOUNT_TYPE: b.ACCOUNT_TYPE,
                PAYMENT_METHOD: b.PAYMENT_METHOD,
            }, field)).reverse ());
            setOrderBy ("DSC");
        }
        if (orderBy === "DSC") {
            setInfos (infos.sort ((a, b) => compare ({
                ...a, PERMISSION_BM: a.PERMISSION_BM,
                NAME_TK: a.NAME_TK,
                PERMISSION_ACCOUNT: a.PERMISSION_ACCOUNT,
                CITY: a.CITY,
                COUNTRY: a.COUNTRY,
                ACCOUNT_TYPE: a.ACCOUNT_TYPE,
                PAYMENT_METHOD: a.PAYMENT_METHOD,
            }, {
                ...b,
                PERMISSION_BM: b.PERMISSION_BM,
                NAME_TK: b.NAME_TK,
                PERMISSION_ACCOUNT: b.PERMISSION_ACCOUNT,
                CITY: b.CITY,
                COUNTRY: b.COUNTRY,
                ACCOUNT_TYPE: b.ACCOUNT_TYPE,
                PAYMENT_METHOD: b.PAYMENT_METHOD,
            }, field)));
            setOrderBy ("ASC");
        }
    };


    const handleSortPaymentMethod = (field) => {
        const a = infos.filter (item => item.PAYMENT_METHOD === undefined);
        const b = infos.filter (item => item.PAYMENT_METHOD !== undefined);
        if (orderBy === "ASC") {
            const dataSort = b.sort ((i, j) => compare (i, j, field)).reverse ();
            const c = a.concat (dataSort);
            setInfos (c);
            setOrderBy ("DSC");
        }
        if (orderBy === "DSC") {
            const dataSort = b.sort ((i, j) => compare (i, j, field));
            const c = dataSort.concat (a);
            setInfos (c);
            setOrderBy ("ASC");
        }
    };

    const formatCurrencyNormal = (value) => {
        if (typeof value === 'number') {
            return value.toLocaleString ('en-US');
        }
        if (typeof value !== 'string') {
            return "--";
        }
        const cleanedValue = value.replace (/[.,]/g, '');
        const numberValue = Number (cleanedValue);
        if (isNaN (numberValue)) {
            return "--";
        } else {
            return numberValue.toLocaleString ('en-US');
        }
    }
    const handleChangeCurrency = () => {
        if (changeCurrency === false) {
            const debt = dataAccountOriginal.map ((item) => formatCurrencyNormal (item.balance));
            const limit = dataAccountOriginal.map ((item) => item.adtrust_dsl === -1 ? "--" : formatCurrencyNormal (item.adtrust_dsl));
            const total_spending = dataAccountOriginal.map ((item) => formatCurrencyNormal (item.amount_spent));
            const threshold_amount: any[] = dataAccountOriginal.flatMap ((item) => {
                if (item.adspaymentcycle && item.adspaymentcycle.data) {
                    return item.adspaymentcycle.data.map ((cycleItem) => {
                        // Kiểm tra giá trị của cycleItem.threshold_amount
                        console.log ('cycleItem.threshold_amount', cycleItem.threshold_amount);

                        // Kiểm tra nếu là chuỗi, chuyển đổi thành số và định dạng tiền tệ
                        const thresholdAmountValue = typeof cycleItem.threshold_amount === "string" ?
                            formatCurrencyNormal (parseFloat (cycleItem.threshold_amount.replace (/,/g, ''))) :
                            cycleItem.threshold_amount;

                        console.log ('thresholdAmountValue', thresholdAmountValue);

                        return thresholdAmountValue;
                    });
                } else {
                    return "--";
                }
            });
            console.log ("infoshandleChangeCurrency", infos);
            console.log ("threshold_amount", threshold_amount);
            console.log ("debt", debt);
            console.log ("limit", limit);
            console.log ("total_spending", total_spending);

            setInfos ((prevState) => {
                const newState = prevState.map ((item, index) => ({
                    ...item,
                    DEBT: debt[index],
                    TOTAL_SPENDING: total_spending[index],
                    LIMIT: limit[index],
                    THRESHOLD: threshold_amount[index]
                }));

                return newState;
            });
            setChangeCurrency (!changeCurrency);
        } else {

            const debt = dataAccountOriginal.map ((item) => currencyChange (item.balance, item.account_currency_ratio_to_usd));
            const limit = dataAccountOriginal.map ((item) => item.adtrust_dsl === -1 ? "--" : currencyChange (item.adtrust_dsl, item.account_currency_ratio_to_usd));
            const total_spending = dataAccountOriginal.map ((item) => currencyChange (item.amount_spent, item.account_currency_ratio_to_usd));
            const ratioValue = dataAccountOriginal.map ((item) => item.account_currency_ratio_to_usd);
            const threshold_amount = dataAccountOriginal.flatMap ((item) => {
                if (item.adspaymentcycle && item.adspaymentcycle.data) {
                    return item.adspaymentcycle.data.map ((cycleItem) => {
                        return cycleItem.threshold_amount;
                    });
                } else {
                    return "--";
                }
            });
            const result = threshold_amount.map ((value, index) => currencyChange (value, ratioValue[index]));
            console.log ('aaaaaaaaaaaaaaaaaaaaaaa', result)
            console.log ('ratioValue', ratioValue)
            console.log ('kqqqqqqqqqq', threshold_amount)


            setInfos ((prevState) => {
                const newState = prevState.map ((item, index) => {
                    return {
                        ...item,
                        DEBT: debt[index],
                        TOTAL_SPENDING: total_spending[index],
                        LIMIT: limit[index],
                        THRESHOLD: result[index]
                    };
                });

                return newState;
            });
            setChangeCurrency (!changeCurrency);
        }

    }
    console.log ('dataAccountOriginal', dataAccountOriginal);
    console.log ('infosOutside', infos);


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
                    // STATUS : checkStatusBM(dataAccount[i]?.account_status),
                    STATUS: dataAccount[i]?.account_status,
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
                        dataAccount[i]?.adtrust_dsl,
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
                    CURRENCY_RATIO_USD: dataAccount[i]?.account_currency_ratio_to_usd
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
                                    <Stack direction='row'>
                                        <Switch onChange={handleChangeCurrency} colorScheme='teal' size='lg'/>
                                        <span>Change Currency</span>
                                    </Stack>
                                    <div className="command_btn" id="btn_export">
                                        <span>Reload Page</span>
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
                                        handleSortItemNumber ("STATUS")
                                    }
                                >
                                    Trạng thái
                                </th>
                                <th className="sort">DATE</th>
                                <th className="sort">ID</th>
                                <th
                                    className="sort"
                                    onClick={() =>
                                        handleSortItemText ("NAME_TK")
                                    }
                                >
                                    Tên TK{" "}
                                </th>
                                <th className="sort">Profile Chrome</th>
                                <th className="sort">IP</th>
                                <th
                                    className="sort"
                                    onClick={() =>
                                        handleSortItemText ("CITY")
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
                                        handleSortItemText ("CURRENCY")
                                    }
                                >
                                    Tiền tệ
                                </th>
                                <th className="sort" onClick={() =>
                                    handleSortItemText ("ACCOUNT_TYPE")
                                }>Loại TK
                                </th>
                                <th className="sort"
                                    onClick={() =>
                                        handleSortItemText ("PERMISSION_BM")
                                    }
                                >Role
                                </th>
                                <th className="sort">ID BM</th>
                                <th className="sort" onClick={() =>
                                    handleSortPaymentMethod ("PAYMENT_METHOD")
                                }>Thanh toán
                                </th>
                                <th className="sort">Múi giờ</th>
                            </tr>
                            </thead>
                            <tbody id="tb">
                            {infos.map ((item, key) => (
                                <tr className="trInfo" key={key}>
                                    <td className="tdInfo">{item.STT}</td>
                                    <td className="tdInfo">
                                        <div className="tbstatus">{checkStatusBM (item.STATUS)}</div>
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
                                            {item.LIMIT < 1 || item.LIMIT === "--" ? "NO LIMIT" : item.LIMIT}
                                            {/*{isNaN (item.LIMIT) ? "NO LIMIT" : item.LIMIT}?*/}
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

export default PopupDetail