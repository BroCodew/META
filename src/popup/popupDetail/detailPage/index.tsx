import React, {useEffect, useState} from "react";
import styles from "./styles/index.module.scss";
import {v4 as uuidv4} from "uuid";
import {Stack, Switch} from "@chakra-ui/react";
import SearchBar from "../../../component/Search";

const PopupDetailAD = () => {
    const [accessToken, setAccessToken] = useState ("");
    const [dataAccount, setDataAccount] = useState ([]);
    const [dataAccountOriginal, setDataAccountOriginal] = useState ([]);
    const [accountID, setAccountID] = useState (null);
    const [infos, setInfos] = useState ([]);
    const [orderBy, setOrderBy] = useState ("ASC");
    const [changeCurrency, setChangeCurrency] = useState (false);
    const [filteredList, setFilteredList] = useState (infos);
    const today = new Date ();
    const day = today.getDate ();
    const month = today.getMonth () + 1;
    const year = today.getFullYear ();
    const formattedDate = `${day}/${month}/${year}`;


    useEffect (() => {
        setFilteredList (infos)
    }, [infos]);
    const handleGetAccessToken = () => {
        chrome.runtime.sendMessage ({action: "login_request"}, (response) => {
            if (response && response.success) {
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


    const currencyChange = (current, currentRation, field) => {
        let change;
        if (typeof current !== "object") {
            if (field === "USD") {
                const currentUsd = current / 100;
                change = currentUsd / currentRation
            } else {
                change = current / currentRation;
            }
        } else if (Array.isArray (current) && current.length > 0) {
            if (field === "USD") {
                const currentUsd = current[0] / 100;
                change = currentUsd / currentRation
            } else {
                change = current[0] / currentRation;
            }

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
                NAME_TK_AD: a.NAME_TK_AD,
                PERMISSION_ACCOUNT: a.PERMISSION_ACCOUNT,
                CITY: a.CITY,
                COUNTRY: a.COUNTRY,
                ACCOUNT_TYPE: a.ACCOUNT_TYPE,
                PAYMENT_METHOD: a.PAYMENT_METHOD,
            }, {
                ...b,
                PERMISSION_BM: b.PERMISSION_BM,
                NAME_TK_AD: b.NAME_TK_AD,
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
                NAME_TK_AD: a.NAME_TK_AD,
                PERMISSION_ACCOUNT: a.PERMISSION_ACCOUNT,
                CITY: a.CITY,
                COUNTRY: a.COUNTRY,
                ACCOUNT_TYPE: a.ACCOUNT_TYPE,
                PAYMENT_METHOD: a.PAYMENT_METHOD,
            }, {
                ...b,
                PERMISSION_BM: b.PERMISSION_BM,
                NAME_TK_AD: b.NAME_TK_AD,
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

    const formatCurrencyNormal = (value, currency) => {
        console.log ('value', value);
        if (typeof value === 'number') {
            if (currency === "USD") {
                return (value * 10).toLocaleString ('en-US');
            } else {
                return value.toLocaleString ('en-US');

            }

        }
        if (typeof value !== 'string') {
            return "--";
        }
        const cleanedValue = value//.replace (/[.,]/g, '');
        let numberValue;
        if (currency === "USD") {

            numberValue = Number (cleanedValue) * 10;
        } else {
            numberValue = Number (cleanedValue);
        }

        // let numberValue;
        // if (currency === "USD") {
        //     return numberValue = Number (cleanedValue) * 10;
        //
        // } else {
        //     return numberValue = Number (cleanedValue);
        // }

        if (isNaN (numberValue)) {
            return "--";
        } else {
            return numberValue.toLocaleString ('en-US');
        }
    }
    const handleChangeCurrency = () => {
        if (changeCurrency === false) {
            const debt = dataAccountOriginal.map ((item) => formatCurrencyNormal (item.balance, item.currency));
            const limit = dataAccountOriginal.map ((item) => item.adtrust_dsl === -1 ? "--" : formatCurrencyNormal (item.adtrust_dsl, item.currency));
            const total_spending = dataAccountOriginal.map ((item) => formatCurrencyNormal (item.amount_spent, item.currency));
            const threshold_amount: any[] = dataAccountOriginal.flatMap ((item) => {
                if (item.adspaymentcycle && item.adspaymentcycle.data) {
                    return item.adspaymentcycle.data.map ((cycleItem) => {
                        const thresholdAmountValue = typeof cycleItem.threshold_amount === "string" ?
                            formatCurrencyNormal (parseFloat (cycleItem.threshold_amount.replace (/,/g, '')), item.currency) :
                            cycleItem.threshold_amount;
                        return thresholdAmountValue;
                    });
                } else {
                    return "--";
                }
            });
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
            console.log ('infos', infos)
            setChangeCurrency (!changeCurrency);
        } else {

            const debt = dataAccountOriginal.map ((item) => currencyChange (item.balance, item.account_currency_ratio_to_usd, item.currency));
            const limit = dataAccountOriginal.map ((item) => item.adtrust_dsl === -1 ? "--" : currencyChange (item.adtrust_dsl, item.account_currency_ratio_to_usd, item.currency));
            const total_spending = dataAccountOriginal.map ((item) => currencyChange (item.amount_spent, item.account_currency_ratio_to_usd, item.currency));
            const ratioValue = dataAccountOriginal.map ((item) => item.account_currency_ratio_to_usd);
            const currencyValue = dataAccountOriginal.map ((item) => item.currency);
            const threshold_amount = dataAccountOriginal.flatMap ((item) => {
                if (item.adspaymentcycle && item.adspaymentcycle.data) {
                    return item.adspaymentcycle.data.map ((cycleItem) => {
                        return cycleItem.threshold_amount;
                    });
                } else {
                    return "--";
                }
            });
            const result = threshold_amount.map ((value, index) => currencyChange (value, ratioValue[index], currencyValue[index]));
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

    const handleReloadStorage = (e: any) => {
        window.location.reload ();
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
                    dataAccount[i]?.account_currency_ratio_to_usd, dataAccount[i]?.currency
                );
                const thresholdArr = dataAccount[i]?.adspaymentcycle?.data.map (
                    (item) => item.threshold_amount
                );
                const threShold = currencyChange (
                    thresholdArr,
                    dataAccount[i]?.account_currency_ratio_to_usd,
                    dataAccount[i]?.currency
                );

                dataInfos.push ({
                    STT: i + 1,
                    STATUS: dataAccount[i]?.account_status,
                    DATE_AD: formattedDate,
                    DATE_BACKUP: "19/11/2023",
                    IP: "222.252.20.234",
                    PROFILE_CHROME: "Profile Chrome",
                    COUNTRY: "Viet Nam",
                    CITY: "Ha Noi",
                    COOKIES: "Cookie",
                    ID_TKQC_AD: dataAccount[i]?.account_id,
                    NAME_TK_AD: dataAccount[i]?.name,
                    DEBT: debt,
                    THRESHOLD: threShold,
                    LIMIT: currencyChange (
                        dataAccount[i]?.adtrust_dsl,
                        dataAccount[i]?.account_currency_ratio_to_usd,
                        dataAccount[i]?.currency
                    ),
                    ADMIN: dataAccount[i]?.userpermissions.data.length,
                    TOTAL_SPENDING: currencyChange (
                        dataAccount[i]?.amount_spent,
                        dataAccount[i]?.account_currency_ratio_to_usd,
                        dataAccount[i]?.currency
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
            <div className="app" style={{padding: 0}}>
                <div className="wrapper" id="main">
                    <div className="sc_heading" style={{padding: 0}}>
                        <div className="command">
                            <div className="command_head" style={{backgroundColor: "#023302"}}>
                                <div className="command_flex">
                                    <SearchBar filteredList={filteredList} infos={infos}
                                               setFilteredList={setFilteredList}/>
                                </div>
                                <div className="command_flex">
                                    <Stack direction='row'>
                                        <Switch onChange={handleChangeCurrency} colorScheme='teal' size='lg'/>
                                        <span>Change Currency</span>
                                    </Stack>
                                    <div className="command_btn" id="btn_export" onClick={handleReloadStorage}>
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
                                <th className="sort"
                                    onClick={() =>
                                        handleSortItemNumber ("STT")
                                    }
                                >STT
                                </th>
                                <th
                                    className="sort"
                                    onClick={() =>
                                        handleSortItemNumber ("STATUS")
                                    }
                                >
                                    Trạng thái
                                </th>
                                <th className="sort"
                                    onClick={() =>
                                        handleSortItemNumber ("DATE")
                                    }
                                >DATE
                                </th>
                                <th className="sort"
                                    onClick={() =>
                                        handleSortItemNumber ("ID_TKQC_AD")
                                    }
                                >ID
                                </th>
                                <th
                                    className="sort"

                                    onClick={() =>
                                        handleSortItemText ("NAME_TK_AD")
                                    }
                                >
                                    Tên TK{" "}
                                </th>
                                <th className="sort" onClick={() =>
                                    handleSortItemText ("PROFILE_CHROME")
                                }>Profile Chrome
                                </th>
                                <th className="sort"
                                    onClick={() =>
                                        handleSortItemNumber ("IP")
                                    }
                                >IP
                                </th>
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
                                <th className="sort"
                                    onClick={() =>
                                        handleSortItemNumber ("ADMIN")
                                    }
                                >Admin
                                </th>
                                <th className="sort"
                                    onClick={() =>
                                        handleSortItemText ("PERMISSION_ACCOUNT")
                                    }>Quyền TK
                                </th>
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
                                <th className="sort"
                                    onClick={() =>
                                        handleSortItemNumber ("ID_BM")
                                    }
                                >ID BM
                                </th>
                                <th className="sort" onClick={() =>
                                    handleSortPaymentMethod ("PAYMENT_METHOD")
                                }>Thanh toán
                                </th>
                                <th className="sort"
                                    onClick={() =>
                                        handleSortItemNumber ("TIME_ZONE")
                                    }
                                >Múi giờ
                                </th>
                            </tr>
                            </thead>
                            <tbody id="tb">
                            {filteredList.map ((item, key) => (
                                <tr className="trInfo" key={key}>
                                    <td className="tdInfo">{item.STT}</td>
                                    <td className="tdInfo">
                                        <div className="tbstatus">{checkStatusBM (item.STATUS)}</div>
                                    </td>
                                    <td className="tdInfo"> {item.DATE_AD}</td>
                                    <td className="tdInfo"> {item.ID_TKQC_AD}</td>
                                    <td className="tdInfo"
                                        style={{textAlign: "left", overflow: "hidden"}}> {item.NAME_TK_AD}</td>
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

export default PopupDetailAD;