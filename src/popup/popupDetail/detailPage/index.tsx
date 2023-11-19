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
    const [changeCurrency, setChangeCurrency] = useState (true);
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
    // const handleSortItemNumber = (field) => {
    //     if (orderBy === "ASC") {
    //         setInfos (infos.sort ((a, b) => compare ({
    //             ...a,
    //             THRESHOLD: convertCurrencyToNumber (a.THRESHOLD),
    //             DEBT: convertCurrencyToNumber (a.DEBT),
    //             TOTAL_SPENDING: convertCurrencyToNumber (a.TOTAL_SPENDING),
    //             STATUS: a.STATUS,
    //             LIMIT: convertCurrencyToNumber (a.LIMIT),
    //         }, {
    //             ...b,
    //             THRESHOLD: convertCurrencyToNumber (b.THRESHOLD),
    //             DEBT: convertCurrencyToNumber (b.DEBT),
    //             TOTAL_SPENDING: convertCurrencyToNumber (b.TOTAL_SPENDING),
    //             STATUS: b.STATUS,
    //             LIMIT: convertCurrencyToNumber (b.LIMIT),
    //         }, field)).reverse ());
    //         setOrderBy ("DSC");
    //     } else {
    //         setInfos (infos.sort ((a, b) => compare ({

    //             ...a,
    //             THRESHOLD: convertCurrencyToNumber (a.THRESHOLD),
    //             DEBT: convertCurrencyToNumber (a.DEBT),
    //             TOTAL_SPENDING: convertCurrencyToNumber (a.TOTAL_SPENDING),
    //             STATUS: a.STATUS,
    //             LIMIT: convertCurrencyToNumber (a.LIMIT),
    //         }, {
    //             ...b,
    //             THRESHOLD: convertCurrencyToNumber (b.THRESHOLD),
    //             DEBT: convertCurrencyToNumber (b.DEBT),
    //             TOTAL_SPENDING: convertCurrencyToNumber (b.TOTAL_SPENDING),
    //             STATUS: b.STATUS,
    //             LIMIT: convertCurrencyToNumber (b.LIMIT),
    //         }, field)));
    //         setOrderBy ("ASC");
    //     }
    //
    // };

    const handleSortItemNumber = (field) => {
        console.log ('infosShort', infos)
        if (orderBy === "ASC") {
            setInfos (infos.sort ((a, b) => compare ({
                ...a,
                THRESHOLD: a.THRESHOLD,
                DEBT: a.DEBT,
                TOTAL_SPENDING: a.TOTAL_SPENDING,
                LIMIT: a.LIMIT,
                STATUS: a.STATUS,
            }, {
                ...b,
                THRESHOLD: b.THRESHOLD,
                DEBT: b.DEBT,
                TOTAL_SPENDING: b.TOTAL_SPENDING,
                STATUS: b.STATUS,
                LIMIT: b.LIMIT,
            }, field)).reverse ());
            setOrderBy ("DSC");
        } else {
            setInfos (infos.sort ((a, b) => compare ({
                ...a,
                THRESHOLD: a.THRESHOLD,
                DEBT: a.DEBT,
                TOTAL_SPENDING: a.TOTAL_SPENDING,
                LIMIT: a.LIMIT,
                STATUS: a.STATUS,
            }, {
                ...b,
                THRESHOLD: b.THRESHOLD,
                DEBT: b.DEBT,
                TOTAL_SPENDING: b.TOTAL_SPENDING,
                STATUS: b.STATUS,
                LIMIT: b.LIMIT,
            }, field)));
            setOrderBy ("ASC");
        }

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

    // const formatCurrencyNormal = ( value, currency ) => {
    //     console.log('value', value);
    //     if (typeof value === 'number') {
    //         if (currency === "USD") {
    //             return (value * 10).toLocaleString('en-US');
    //         } else {
    //             return value.toLocaleString('en-US');
    //
    //         }
    //
    //     }
    //     if (typeof value !== 'string') {
    //         return "--";
    //     }
    //
    //     const cleanedValue = value.replace(/[.,]/g, '');
    //
    //
    //     let numberValue;
    //     if (currency === "USD") {
    //
    //         numberValue = Number(cleanedValue) * 10;
    //     } else {
    //         numberValue = Number(cleanedValue);
    //     }
    //
    //     if (isNaN(numberValue)) {
    //         return "--";
    //     } else {
    //         return numberValue.toLocaleString('en-US');
    //     }
    // }
    // const handleChangeCurrency = () => {
    //     if (changeCurrency === false) {
    //         const debt = dataAccountOriginal.map(( item ) => formatCurrencyNormal(item.balance, item.currency));
    //         const limit = dataAccountOriginal.map(( item ) => item.adtrust_dsl === -1 ? "--" : formatCurrencyNormal(item.adtrust_dsl, item.currency));
    //         const total_spending = dataAccountOriginal.map(( item ) => formatCurrencyNormal(item.amount_spent, item.currency));
    //         const threshold_amount: any[] = dataAccountOriginal.flatMap(( item ) => {
    //             if (item.adspaymentcycle && item.adspaymentcycle.data) {
    //                 return item.adspaymentcycle.data.map(( cycleItem ) => {
    //                     const thresholdAmountValue = typeof cycleItem.threshold_amount === "string" ?
    //                         formatCurrencyNormal(parseFloat(cycleItem.threshold_amount.replace(/,/g, '')), item.currency) :
    //                         cycleItem.threshold_amount;
    //                     return thresholdAmountValue;
    //                 });
    //             } else {
    //                 return "--";
    //             }
    //         });
    //         setInfos(( prevState ) => {
    //             const newState = prevState.map(( item, index ) => ({
    //                 ...item,
    //                 DEBT : debt[index],
    //                 TOTAL_SPENDING : total_spending[index],
    //                 LIMIT : limit[index],
    //                 THRESHOLD : threshold_amount[index]
    //             }));
    //
    //             return newState;
    //         });
    //         console.log('infos', infos)
    //         setChangeCurrency(!changeCurrency);
    //     } else {
    //
    //         const spendCap = dataAccountOriginal.flatMap(( item ) => item?.insights?.data.map((item => item.spend)));
    //         const spendCapWithoutNull = spendCap.map(value => (value != null ? value : "0"));
    //         const total_spending = dataAccountOriginal.map(( item, index ) => currencyChange(spendCapWithoutNull[index], item.account_currency_ratio_to_usd, item.currency));
    //         const spendingTotalAmount = dataAccountOriginal.flatMap(( item ) => item?.insights?.data.map(item => +item.spend));
    //         const debt = dataAccountOriginal.map(( item ) => currencyChange(item.balance, item.account_currency_ratio_to_usd, item.currency));
    //         const limit = dataAccountOriginal.map(( item ) => item.adtrust_dsl === -1 ? "--" : currencyChange(item.adtrust_dsl, item.account_currency_ratio_to_usd, item.currency));
    //
    //         const ratioValue = dataAccountOriginal.map(( item ) => item.account_currency_ratio_to_usd);
    //         const currencyValue = dataAccountOriginal.map(( item ) => item.currency);
    //         const threshold_amount = dataAccountOriginal.flatMap(( item ) => {
    //             if (item.adspaymentcycle && item.adspaymentcycle.data) {
    //                 return item.adspaymentcycle.data.map(( cycleItem ) => {
    //                     return cycleItem.threshold_amount;
    //                 });
    //             } else {
    //                 return "--";
    //             }
    //         });
    //         const result = threshold_amount.map(( value, index ) => currencyChange(value, ratioValue[index], currencyValue[index]));
    //         setInfos(( prevState ) => {
    //             const newState = prevState.map(( item, index ) => {
    //                 return {
    //                     ...item,
    //                     DEBT : debt[index],
    //                     TOTAL_SPENDING : total_spending[index],
    //                     LIMIT : limit[index],
    //                     THRESHOLD : result[index]
    //                 };
    //             });
    //             return newState;
    //         });
    //         setChangeCurrency(!changeCurrency);
    //     }
    //
    // }


    // function formatCurrency(number) {
    //     const formatter = new Intl.NumberFormat ('en-US', {
    //         style: 'currency',
    //         currency: 'USD',
    //         minimumFractionDigits: 2,
    //         maximumFractionDigits: 2,
    //     });
    //     const b = formatter.format (number).replace ('$', '');
    //     return b;
    // }
    //
    // const formatCurrencyRaw = (value, currency, ratio, field) => {
    //     // console.log('valueformatCurrencyRaw:', value)
    //
    //     let a;
    //     if (typeof value === "string") {
    //         if (ratio <= 1 && (field === 'DEBT' || field === 'THRESHOLD')) { //ok
    //             const valueRaw = value.replace (/,/g, '')
    //             a = formatCurrency (+valueRaw / 100);
    //         }
    //         if (field === "THRESHOLD" && value === undefined) { //ok
    //             a = '--'
    //         } else {
    //             const valueRaw = value.replace (/,/g, '')
    //             a = formatCurrency (valueRaw);
    //         }
    //     } else if (typeof value === "number") {
    //         if (field === "LIMIT" && value < 0) {
    //             a = 'NO LIMIT'
    //         } else {
    //             a = formatCurrency (value);
    //         }
    //     } else if (Array.isArray (value) && value.length > 0) {
    //         if (ratio <= 1 && field === "THRESHOLD") {
    //             a = formatCurrency (value[0] / 100)
    //         } else {
    //             a = formatCurrency (value);
    //         }
    //     } else if (field === "TOTAL_SPENDING" && value === undefined) {
    //         a = 0
    //     } else if (field === "THRESHOLD" && value === undefined) {
    //         a = "--"
    //     }
    //
    //     return a;
    // }
    // // const cleanedValue = value.replace(/[^\d.]/g, "");
    // const handleChangeCurrency = () => {
    //     const formatCurrencyToUSD = (value, currency, field, ratio) => {
    //         if (ratio <= 1 && (field === 'DEBT' || field === 'THRESHOLD')) {
    //             if (typeof value === "string") {
    //                 const cleanedValue = value.replace (/,/g, '')
    //                 const numericValue = parseFloat (cleanedValue);
    //                 return numericValue / (ratio * 100);
    //             } else if (Array.isArray (value) && value.length > 0) {
    //                 return value[0] / (ratio * 100);
    //             }
    //         } else {
    //             if (Array.isArray (value) && value.length > 0) {
    //                 return value[0] / ratio
    //             } else if (typeof value === 'string') {
    //                 console.log ("ggggg", value, +value)
    //                 return +value / ratio
    //             } else if (typeof value === 'number') {
    //                 return value / ratio
    //             }
    //             return null;
    //         }
    //
    //         // Handle other cases or return an error, depending on your requirements
    //         return null;
    //     };
    //
    //
    //     if (changeCurrency === false) {
    //         console.log (infos);
    //         const debt = infos.map ((item) => {
    //             console.log ("fff", item);
    //             return formatCurrencyToUSD (item.DEBT, item.CURRENCY, "DEBT", item.CURRENCY_RATIO_USD)
    //         });
    //         console.log ("ddd", debt);
    //         const thres = infos.map ((item) => formatCurrencyToUSD (item.THRESHOLD, item?.CURRENCY, "THRESHOLD", item.CURRENCY_RATIO_USD));
    //         const total_spending = infos.map ((item) => formatCurrencyToUSD (item.TOTAL_SPENDING, item?.CURRENCY, "TOTAL_SPENDING", item.CURRENCY_RATIO_USD));
    //         const limit = infos.map ((item) => formatCurrencyToUSD (item.LIMIT, item?.CURRENCY, "LIMIT", item.CURRENCY_RATIO_USD));
    //         setInfos ((prevState) => {
    //             const newState = prevState.map ((item, index) => ({
    //                 ...item,
    //                 DEBT: debt[index],
    //                 THRESHOLD: thres[index],
    //                 TOTAL_SPENDING: total_spending[index],
    //                 LIMIT: limit[index],
    //             }));
    //
    //             return newState;
    //         });
    //         // console.log('infos', infos)
    //         setChangeCurrency (!changeCurrency);
    //     } else {
    //         const debt = dataAccountOriginal.map ((item) => formatCurrencyRaw (item.DEBT, item.CURRENCY, "DEBT", item.CURRENCY_RATIO_USD));
    //         const thres = dataAccountOriginal.map ((item) => formatCurrencyRaw (item.THRESHOLD, item.CURRENCY, "THRESHOLD", item.CURRENCY_RATIO_USD));
    //         const total_spending = dataAccountOriginal.map ((item) => formatCurrencyRaw (item.TOTAL_SPENDING, item?.CURRENCY, "TOTAL_SPENDING", item.CURRENCY_RATIO_USD));
    //         const limit = dataAccountOriginal.map ((item) => formatCurrencyRaw (item.LIMIT, item.CURRENCY, "LIMIT", item.CURRENCY_RATIO_USD));
    //
    //         setInfos ((prevState) => {
    //             const newState = prevState.map ((item, index) => ({
    //                 ...item,
    //                 DEBT: debt[index],
    //                 THRESHOLD: thres[index],
    //                 TOTAL_SPENDING: total_spending[index],
    //                 LIMIT: limit[index],
    //             }));
    //
    //             return newState;
    //         });
    //         setChangeCurrency (!changeCurrency);
    //
    //     }
    //
    // }
    console.log ('infos', infos)
    const handleChangeCurrency = () => {
        setChangeCurrency (!changeCurrency);
    }

    const formatCurrencyRaw = (value, ratio, field) => {

        function formatNumber(number) {
            // Sử dụng hàm toLocaleString để chuyển đổi số thành định dạng ngôn ngữ
            // với dấu phân cách ngàn là ',' và dấu thập phân là '.'
            return number.toLocaleString (undefined, {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
                useGrouping: true
            });
        }

        if (field === "THRESHOLD" && value === 0) {
            return "--"
        } else if (ratio <= 1 && (field === "THRESHOLD" || field === "DEBT")) {
            return formatNumber (value / 100)
        } else if (field === "LIMIT" && value === -1) {
            return "NO LIMIT"
        } else {
            return formatNumber (value)
        }
    }

    function formatCurrencyChange(number) {
        return number.toLocaleString (undefined, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
            useGrouping: true
        });
    }

    const formatCurrencyToUSD = (index, value, ratio, field) => {


        const updatedData = infos.map ((item) => {
            // Kiểm tra điều kiện
            if (field === "THRESHOLD" && value === 0) {
                return {...item, THRESHOLD: "--"};
            } else if (ratio <= 1 && (field === "THRESHOLD" || field === "DEBT")) {
                return {...item, THRESHOLD: formatCurrencyChange (item.THRESHOLD / 100 / ratio), DEBT: formatCurrencyChange (item.DEBT / 100 / ratio)};
            } else if (field === "LIMIT" && value === -1) {
                return {...item, LIMIT: "NO LIMIT"};
            } else {
                return {...item, LIMIT: formatCurrencyChange (item.LIMIT / ratio), THRESHOLD: formatCurrencyChange (item.THRESHOLD / ratio), TOTAL_SPENDING: formatCurrencyChange (item.TOTAL_SPENDING / ratio), DEBT: formatCurrencyChange (item.DEBT / ratio)};
            }
        });
        setInfos (updatedData);

    };
    // if (field === "THRESHOLD" && value === 0) {
    //     return "--";
    // } else if (ratio <= 1 && (field === "THRESHOLD" || field === "DEBT")) {
    //     return formatCurrency (value / 100 / ratio);
    // } else if (field === "LIMIT" && value === -1) {
    //     return "NO LIMIT";
    // } else {
    //     return formatCurrency (value / ratio);
    // }
    const handleReloadStorage = (e: any) => {
        window.location.reload ();
        chrome.runtime.sendMessage ({action: "reload_storage"}, function (response) {
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

                const total_spend = dataAccount[i].insights === null ? null : Number (dataAccount[i].insights?.data.map ((item => item.spend)))
                const threshold_amount = dataAccount[i].adspaymentcycle === null ? null : Number (dataAccount[i]?.adspaymentcycle?.data.map (
                    (item) => item.threshold_amount
                ).join (''))
                const limit = dataAccount[i].adtrust_dsl === null ? null : Number (dataAccount[i].adtrust_dsl)
//conver value to number
                const debtNumber = +dataAccount[i].balance;
                const threNumber = isNaN (threshold_amount) ? 0 : threshold_amount
                const totalSpendNumber = isNaN (total_spend) ? 0 : total_spend;
                const limitNumber = isNaN (limit) ? 0 : limit


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
                    DEBT: debtNumber,
                    THRESHOLD: threNumber,
                    LIMIT: limitNumber,
                    TOTAL_SPENDING: totalSpendNumber,
                    ADMIN: dataAccount[i]?.userpermissions.data.length,
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
            setDataAccountOriginal (dataInfos)
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
                                        handleSortItemNumber ("LIMIT")
                                    }
                                >
                                    Limit Ẩn
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
                                        <span
                                            className="r">  {changeCurrency ? formatCurrencyRaw (item.DEBT, item.CURRENCY_RATIO_USD, "DEBT") : formatCurrencyToUSD (item.STT, item.DEBT, item.CURRENCY_RATIO_USD, "DEBT")}</span>
                                    </td>
                                    <td className="tdInfo">
                                        <span className="r">
                                            {changeCurrency ? formatCurrencyRaw (item.THRESHOLD, item.CURRENCY_RATIO_USD, "THRESHOLD") : formatCurrencyToUSD (item.STT, item.THRESHOLD, item.CURRENCY_RATIO_USD, "THRESHOLD")}
                                        </span>
                                    </td>
                                    <td className="tdInfo">
                                        <span className="r">
                                            {changeCurrency ? formatCurrencyRaw (item.LIMIT, item.CURRENCY_RATIO_USD, "LIMIT") : formatCurrencyToUSD (item.STT, item.LIMIT, item.CURRENCY_RATIO_USD, "LIMIT")}
                                      </span>
                                    </td>
                                    <td className="tdInfo">
                                        <span className="r">
                                            {changeCurrency ? formatCurrencyRaw (item.LIMIT, item.CURRENCY_RATIO_USD, "LIMIT") : formatCurrencyToUSD (item.STT, item.LIMIT, item.CURRENCY_RATIO_USD, "LIMIT")}
                                      </span>
                                    </td>
                                    <td className="tdInfo">
                                        <span
                                            className="r"> {changeCurrency ? formatCurrencyRaw (item.TOTAL_SPENDING, item.CURRENCY_RATIO_USD, "TOTAL_SPENDING") : formatCurrencyToUSD (item.STT, item.TOTAL_SPENDING, item.CURRENCY_RATIO_USD, "TOTAL_SPENDING")}</span>
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