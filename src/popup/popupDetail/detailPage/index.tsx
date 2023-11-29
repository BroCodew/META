import React, {useEffect, useState} from "react";
import styles from "./styles/index.module.scss";
import {Stack, Switch} from "@chakra-ui/react";
import SearchBar from "../../../component/Search";
import {useNavigate} from "react-router-dom";

const PopupDetailAD = () => {
    const [accessToken, setAccessToken] = useState("");
    const [dataAccount, setDataAccount] = useState([]);
    const [dataAccountOriginal, setDataAccountOriginal] = useState([]);
    const [accountID, setAccountID] = useState(null);
    const [infos, setInfos] = useState([]);
    const [orderBy, setOrderBy] = useState("ASC");
    const [changeCurrency, setChangeCurrency] = useState(true);
    const [filteredList, setFilteredList] = useState(infos);
    const [widthMain, setWidthMain] = useState({
        widthTotal : 0,
        widthDebt : 0,
        widthThresHold : 0,
        widthLimit : 0,
        widthLimitHidden : 0,
        widthLimitTotalSpending : 0,
    })
    const [loading, setLoading] = useState(true)
    const [fakeData, setFakeData] = useState(true)
    const [currentPage, setCurrenPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [tokenFdtg,setTokenFdtg] = useState('');
    const [limit, setLimit] = useState(null);
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const totalPages = Math.ceil(infos.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = infos.slice(indexOfFirstItem, indexOfLastItem);
    const navigate = useNavigate();
    useEffect(() => {
        setFilteredList(infos)
    }, [infos]);
    const handleGetAccessToken = () => {
        chrome.runtime.sendMessage({ action : "login_request" }, ( response ) => {
            if (response && response.success) {
                console.log('dataPage',response)
                setDataAccountOriginal(response.data.data);
                setDataAccount(response.data.data);
                setTokenFdtg(response.tokenFacebook)
                response.accountId.id && setAccountID(response.accountId.id);
                setAccessToken(response.token.token);
            } else {
                console.error(response.error);
            }
        });
    };
    const reqAPI = async(url, method, body, mode) => {
        let response = await fetch(url, {
            method: method,
            credentials: "include",
            body: body,
            mode: mode,
            headers: {
                referer: "https://business.facebook.com/adsmanager/manage/accounts",
            },
        });
        let html = await response.text().then((res) => res);
        return html;
    }
    const getLimit = async (fbdt, act) =>{
        var origin = window.location.origin;
        var url = `${origin}/api/graphql`;
        let formData = new FormData();

        formData.append("fb_dtsg", fbdt);
        formData.append("doc_id", "6401661393282937");
        formData.append("variables", `{"assetID":${act}}`);
        let res = await reqAPI(url, "POST", formData, "no-cors");
        try {
            let formatted_dsl = res.split('"formatted_dsl":"')[1].split('",')[0];
            var newlimit = formatted_dsl
                .replace(/\\u[\dA-Fa-f]{4}/g, "")
                .replace(/[^\d]/g, "");
            return Number(newlimit);
        } catch (error) {
            return "-";
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getLimit(tokenFdtg,accountID);
                setLimit(result);
                console.log("Limit value:", result);
            } catch (error) {
                console.error("Error in fetchData:", error);
            }
        };

        fetchData();
    }, []);
    console.log("Limit value:", 1111111);

    const checkStatusBM = ( option ) => {
        switch (option) {
            case 1:
                return (
                    <div className={styles.statusAccountLive}>
                        <p className={styles.liveTextLive}>Hoạt Động</p>
                    </div>
                );
            case 2:
                return (
                    <div className={styles.statusAccountDie}>
                        <p className={styles.liveTextDie}>Vô Hiệu</p>
                    </div>
                );
            case 3:
                return (
                    <div className={styles.statusAccountDebt}>
                        <p className={styles.liveTextDebt}>Đang Nợ</p>
                    </div>
                );
            default:
                return "DRAFT";
        }
    };

    const checkAuthorBM = ( option ) => {
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


    const compare = ( a, b, field ) => {
        if (a[field] < b[field]) {
            return -1;
        }
        if (a[field] > b[field]) {
            return 1;
        }
        return 0;
    }


    const handleSortItemNumber = ( field ) => {
        if (orderBy === "ASC") {
            setInfos(infos.sort(( a, b ) => compare({
                ...a,
                THRESHOLD : a.THRESHOLD,
                THRESHOLD_USD : a.THRESHOLD_USD,
                DEBT : a.DEBT,
                DEBT_USD : a.DEBT_USD,
                TOTAL_SPENDING : a.TOTAL_SPENDING,
                TOTAL_SPENDING_USD : a.TOTAL_SPENDING_USD,
                LIMIT : a.LIMIT,
                LIMIT_USD : a.LIMIT_USD,
                STATUS : a.STATUS,
            }, {
                ...b,
                THRESHOLD : b.THRESHOLD,
                THRESHOLD_USD : b.THRESHOLD_USD,
                DEBT : b.DEBT,
                DEBT_USD : b.DEBT_USD,
                TOTAL_SPENDING : b.TOTAL_SPENDING,
                TOTAL_SPENDING_USD : b.TOTAL_SPENDING_USD,
                LIMIT : b.LIMIT,
                LIMIT_USD : b.LIMIT_USD,
            }, field)).reverse());
            setOrderBy("DSC");
        } else {
            setInfos(infos.sort(( a, b ) => compare({
                ...a,
                THRESHOLD : a.THRESHOLD,
                THRESHOLD_USD : a.THRESHOLD_USD,
                DEBT : a.DEBT,
                DEBT_USD : a.DEBT_USD,
                TOTAL_SPENDING : a.TOTAL_SPENDING,
                TOTAL_SPENDING_USD : a.TOTAL_SPENDING_USD,
                LIMIT : a.LIMIT,
                LIMIT_USD : a.LIMIT_USD,
            }, {
                ...b,
                THRESHOLD : b.THRESHOLD,
                THRESHOLD_USD : b.THRESHOLD_USD,
                DEBT : b.DEBT,
                DEBT_USD : b.DEBT_USD,
                TOTAL_SPENDING : b.TOTAL_SPENDING,
                TOTAL_SPENDING_USD : b.TOTAL_SPENDING_USD,
                LIMIT : b.LIMIT,
                LIMIT_USD : b.LIMIT_USD,
            }, field)));
            setOrderBy("ASC");
        }

    };


        const handleSortItemText = ( field ) => {
            if (orderBy === "ASC") {
                setInfos(infos.sort(( a, b ) => compare({
                    ...a,
                    PERMISSION_BM : a.PERMISSION_BM,
                    NAME_TK_AD : a.NAME_TK_AD,
                    PERMISSION_ACCOUNT : a.PERMISSION_ACCOUNT,
                    CITY : a.CITY,
                    COUNTRY : a.COUNTRY,
                    ACCOUNT_TYPE : a.ACCOUNT_TYPE,
                    PAYMENT_METHOD : a.PAYMENT_METHOD,
                }, {
                    ...b,
                    PERMISSION_BM : b.PERMISSION_BM,
                    NAME_TK_AD : b.NAME_TK_AD,
                    PERMISSION_ACCOUNT : b.PERMISSION_ACCOUNT,
                    CITY : b.CITY,
                    COUNTRY : b.COUNTRY,
                    ACCOUNT_TYPE : b.ACCOUNT_TYPE,
                    PAYMENT_METHOD : b.PAYMENT_METHOD,
                }, field)).reverse());
                setOrderBy("DSC");
            }
            if (orderBy === "DSC") {
                setInfos(infos.sort(( a, b ) => compare({
                    ...a, PERMISSION_BM : a.PERMISSION_BM,
                    NAME_TK_AD : a.NAME_TK_AD,
                    PERMISSION_ACCOUNT : a.PERMISSION_ACCOUNT,
                    CITY : a.CITY,
                    COUNTRY : a.COUNTRY,
                    ACCOUNT_TYPE : a.ACCOUNT_TYPE,
                    PAYMENT_METHOD : a.PAYMENT_METHOD,
                }, {
                    ...b,
                    PERMISSION_BM : b.PERMISSION_BM,
                    NAME_TK_AD : b.NAME_TK_AD,
                    PERMISSION_ACCOUNT : b.PERMISSION_ACCOUNT,
                    CITY : b.CITY,
                    COUNTRY : b.COUNTRY,
                    ACCOUNT_TYPE : b.ACCOUNT_TYPE,
                    PAYMENT_METHOD : b.PAYMENT_METHOD,
                }, field)));
                setOrderBy("ASC");
            }
        };


        const handleSortPaymentMethod = ( field ) => {
            const a = infos.filter(item => item.PAYMENT_METHOD === undefined);
            const b = infos.filter(item => item.PAYMENT_METHOD !== undefined);
            if (orderBy === "ASC") {
                const dataSort = b.sort(( i, j ) => compare(i, j, field)).reverse();
                const c = a.concat(dataSort);
                setInfos(c);
                setOrderBy("DSC");
            }
            if (orderBy === "DSC") {
                const dataSort = b.sort(( i, j ) => compare(i, j, field));
                const c = dataSort.concat(a);
                setInfos(c);
                setOrderBy("ASC");
            }
        };

        const handleChangeCurrency = () => {
            setChangeCurrency(!changeCurrency);
        }
        const handleGetBill = () => {
        navigate('/popup.html/bill');
        }


    function formatNumber(so) {
        // Chuyển số thành chuỗi và tách phần nguyên và phần thập phân
        let [phanNguyen, phanThapPhan] = parseFloat(so).toFixed(2).toString().split('.');

        // Thêm dấu phẩy ngăn cách hàng nghìn
        phanNguyen = phanNguyen.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        // Nếu có phần thập phân, loại bỏ số 0 đầu tiên
        if (phanThapPhan) {
            phanThapPhan = phanThapPhan.replace(/\.?0+$/, '');
        }

        // Nếu chỉ có phần nguyên, loại bỏ dấu phẩy ở cuối
        let formattedSo = phanNguyen + (phanThapPhan ? '.' + phanThapPhan : '');

        return formattedSo;
    }

    const handleReloadStorage = ( e: any ) => {
        window.location.reload();
        chrome.runtime.sendMessage({ action : "reload_storage" }, function ( response ) {
        });
    };

    useEffect(() => {
        if (
            typeof dataAccount === "object" &&
            accountID !== null &&
            dataAccount.length > 0
        ) {
            let dataInfos = [];
            for (let i = 0; i < dataAccount.length; i++) {
                const total_spend = dataAccount[i].insights === null ? null : Number(dataAccount[i].insights?.data.map((item => item.spend)))
                const threshold_amount = dataAccount[i].adspaymentcycle === null ? null : Number(dataAccount[i]?.adspaymentcycle?.data.map(( item ) => item.threshold_amount).join(''))
                const limit = dataAccount[i].adtrust_dsl === null ? null : Number(dataAccount[i].adtrust_dsl)
//conver value to number
                const debtNumber = dataAccount[i].account_currency_ratio_to_usd <= 1 ? dataAccount[i].balance / 100 : +dataAccount[i].balance;
                const threNumber = dataAccount[i].account_currency_ratio_to_usd <= 1 ? (isNaN(threshold_amount) ? 0 : threshold_amount / 100) : (isNaN(threshold_amount) ? 0 : threshold_amount)
                const limitNumber = isNaN(limit) ? 0 : limit
                const totalSpendNumber = isNaN(total_spend) ? 0 : total_spend;
//convert value to USD
                const limit_usd = dataAccount[i].adtrust_dsl <= 0 ? 0 : dataAccount[i].adtrust_dsl / dataAccount[i].account_currency_ratio_to_usd
                let debt_usd;
                if (dataAccount[i].account_currency_ratio_to_usd <= 1) {
                    debt_usd = dataAccount[i].balance / 100 / dataAccount[i].account_currency_ratio_to_usd
                } else {
                    debt_usd = dataAccount[i].balance / dataAccount[i].account_currency_ratio_to_usd
                }
                const total_usd_raw = dataAccount[i].adspaymentcycle === null ? null : Number(dataAccount[i].insights?.data.map((item => item.spend))) / dataAccount[i].account_currency_ratio_to_usd
                const total_usd = isNaN(total_usd_raw) ? 0 : total_usd_raw;
                let threshold_usd;
                if (dataAccount[i].account_currency_ratio_to_usd <= 1) {
                    threshold_usd = isNaN(threshold_amount / 100 / dataAccount[i].account_currency_ratio_to_usd) ? 0 : threshold_amount / 100 / dataAccount[i].account_currency_ratio_to_usd
                } else {
                    threshold_usd = isNaN(threshold_amount / dataAccount[i].account_currency_ratio_to_usd) ? 0 : threshold_amount / dataAccount[i].account_currency_ratio_to_usd
                }

                if (fakeData === true) {

                    dataInfos.push({
                        STT : i + 1,
                        STATUS : dataAccount[i]?.account_status,
                        DATE_AD : formattedDate,
                        DATE_BACKUP : "19/11/2023",
                        IP : "222.252.20.234",
                        PROFILE_CHROME : "Profile Chrome",
                        COUNTRY : "Viet Nam",
                        CITY : "Ha Noi",
                        COOKIES : "Cookie",
                        ID_TKQC_AD : dataAccount[i]?.account_id,
                        NAME_TK_AD : dataAccount[i]?.name,
                        DEBT : debtNumber,
                        DEBT_USD : debt_usd,
                        THRESHOLD : threNumber,
                        THRESHOLD_USD : threshold_usd,
                        LIMIT : limitNumber,
                        LIMIT_USD : limit_usd,
                        TOTAL_SPENDING : totalSpendNumber,
                        TOTAL_SPENDING_USD : total_usd,
                        ADMIN : dataAccount[i]?.userpermissions.data.length,
                        BILL: "PAID | Visa2292 |  | 9/18/2023 | 175,00$",
                        PERMISSION_ACCOUNT :
                            accountID !== null &&
                            dataAccount[i]?.userpermissions.data.filter(
                                ( item ) => item?.user?.id === accountID
                            )
                                ? "ADMIN"
                                : "",
                        CURRENCY : dataAccount[i]?.currency,
                        ACCOUNT_TYPE : dataAccount[i].hasOwnProperty("owner_business")
                            ? "BM"
                            : "CN",
                        PERMISSION_BM : checkAuthorBM(
                            dataAccount[i]?.userpermissions.data
                                .filter(( item ) => item?.user)
                                .map(( item, index ) => {
                                    return item?.role.toString();
                                })
                        ),
                        ID_BM : dataAccount[i]?.owner_business?.id,
                        PAYMENT_METHOD : dataAccount[
                            i
                            ]?.all_payment_methods?.pm_credit_card?.data.map(
                            ( item ) => item?.display_string
                        ),
                        TIME_ZONE : `${dataAccount[i]?.timezone_offset_hours_utc}  -  ${dataAccount[i]?.timezone_name} `,
                        CURRENCY_RATIO_USD : dataAccount[i]?.account_currency_ratio_to_usd
                    });
                }

            }
            if (fakeData === false) {

                dataInfos = [
                    {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    },
                    {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    },
                    {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    },
                    {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    }, {
                        STT : 1,
                        STATUS : formattedDate,
                        DATE_AD : "Cookie",
                        DATE_BACKUP : 573216737882876,
                        COOKIES : "Jenny",
                        ID_TKQC_AD : 4,
                        NAME_TK_AD : 20,
                        DEBT : 1234233,
                        DEBT_USD : 2313120,
                        THRESHOLD : 2035556,
                        THRESHOLD_USD : "DETAIL",
                        LIMIT : 2035556,
                        LIMIT_USD : 2035556,
                        TOTAL_SPENDING : 2035556,
                        TOTAL_SPENDING_USD : 2035556,
                        ADMIN : 2035556,
                        PERMISSION_ACCOUNT : 2035556,
                        CURRENCY : 2035556,
                        ACCOUNT_TYPE : 2035556,
                        PERMISSION_BM : 2035556,
                        ID_BM : 2035556,
                        PAYMENT_METHOD : 2035556,
                        TIME_ZONE : 2035556,
                        ID : 2035556,
                        CURRENCY_RATIO_USD : 2035556,
                    },
                ];
            }
            setDataAccountOriginal(dataInfos)
            setInfos(dataInfos);
            setLoading(false)

        }
    }, [dataAccount, accountID]);

    useEffect(() => {
        handleGetAccessToken();
    }, []);

    const updateSize = () => {
        const td1 = document.querySelector('.tdInfo:nth-child(1)') as HTMLElement;
        const td2 = document.querySelector('.tdInfo:nth-child(2)') as HTMLElement;
        const td3 = document.querySelector('.tdInfo:nth-child(3)') as HTMLElement;
        const td4 = document.querySelector('.tdInfo:nth-child(4)') as HTMLElement;
        const td5 = document.querySelector('.tdInfo:nth-child(5)') as HTMLElement;
        const td6 = document.querySelector('.tdInfo:nth-child(6)') as HTMLElement;
        const td7 = document.querySelector('.tdInfo:nth-child(7)') as HTMLElement;
        const td8 = document.querySelector('.tdInfo:nth-child(8)') as HTMLElement;
        const td9 = document.querySelector('.tdInfo:nth-child(9)') as HTMLElement;
        const td10 = document.querySelector('.tdInfo:nth-child(10)') as HTMLElement;


        if (td1 && td2 && td3 && td4) {
            const width1 = td1.offsetWidth;
            const width2 = td2.offsetWidth;
            const width3 = td3.offsetWidth;
            const width4 = td4.offsetWidth;
            const width5 = td5.offsetWidth;
            const width6 = td6.offsetWidth;
            const width7 = td7.offsetWidth;
            const width8 = td8.offsetWidth;
            const width9 = td9.offsetWidth;
            const width10 = td10.offsetWidth;
            const width = width1 + width2 + width3 + width4 ;
            setWidthMain(( prev ) => ({
                ...prev,
                widthTotal : width,
                widthDebt : width5,
                widthThresHold : width6,
                widthLimit : width7,
                widthLimitHidden : width8,
                widthLimitTotalSpending : width9
            }));
        }
    }

    useEffect(() => {
        const intervalId = setInterval(updateSize, 1000);
        const cleanup = () => {
            clearInterval(intervalId);
            console.log('Interval cleared after 2 seconds.');
        };
        const timeoutId = setTimeout(cleanup, 100000);
        return () => {
            clearTimeout(timeoutId);
            cleanup();
        };
    }, [infos, widthMain.widthTotal,
        widthMain.widthDebt,
        widthMain.widthThresHold,
        widthMain.widthLimit,
        widthMain.widthLimitHidden,
        widthMain.widthLimitTotalSpending]);


    useEffect(() => {
        window.addEventListener('resize', function ( event ) {
            updateSize()
        }, true);
    }, []);


    return (


        <>
            <div className="app" style={{ padding : 0 }}>
                <div className="wrapper" id="main">
                    <div className="sc_heading" style={{ padding : 0 }}>
                        <div className="command">
                            <div className="command_head" style={{ backgroundColor : "#2b3054" }}>
                                <div className="command_flex">
                                    <SearchBar filteredList={filteredList} infos={infos}
                                               setFilteredList={setFilteredList}/>
                                </div>
                                <div className="command_flex">
                                    <Stack direction='row' style={{display:"flex",alignItems:"center"}}>
                                        <Switch onChange={handleChangeCurrency} colorScheme='teal' size='lg'/>
                                        <span>Change USD</span>
                                    </Stack>
                                    <div className="command_btn" id="btn_export" onClick={handleReloadStorage}>
                                        <span>Reload Page</span>
                                        <i className="fa-solid fa-download"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="AccStatus" className="tabcontent active" style={{ maxHeight : `calc(100vh - 134px)` }}>
                        <div className="loaddata1" style={{ display : "none" }}>
                            <img
                                src="chrome-extension://ookgnahfklmejhicejjbfjifppjbfnlk/access/icon/loadingdata.gif"
                                alt=""
                            />
                        </div>
                        <table className="table table-striped" id="tball" style={{ marginBottom : 0 }}>
                            <thead id="thall">
                            <tr>
                                <th className="sort"
                                    onClick={() =>
                                        handleSortItemNumber("STT")
                                    }
                                >STT
                                </th>
                                <th
                                    className="sort"
                                    onClick={() =>
                                        handleSortItemNumber("STATUS")
                                    }
                                >
                                    Trạng thái
                                </th>

                                <th className="sort"
                                    onClick={() =>
                                        handleSortItemNumber("ID_TKQC_AD")
                                    }
                                >ID
                                </th>
                                <th
                                    className="sort"

                                    onClick={() =>
                                        handleSortItemText("NAME_TK_AD")
                                    }
                                >
                                    Tên TK{" "}
                                </th>
                                <th
                                    className="sort"
                                    style={{ minWidth : "100px" }}
                                    onClick={() =>
                                        handleSortItemNumber(changeCurrency ? "DEBT" : "DEBT_USD")

                                    }
                                >
                                    Dư nợ
                                </th>
                                <th
                                    className="sort"
                                    style={{ minWidth : "70px" }}
                                    onClick={() =>
                                        handleSortItemNumber(changeCurrency ? "THRESHOLD" : "THRESHOLD_USD")

                                    }
                                >
                                    Ngưỡng
                                </th>
                                <th className="sort" style={{ minWidth : "70px" }}
                                    onClick={() =>
                                        handleSortItemNumber(changeCurrency ? "LIMIT" : "LIMIT_USD")

                                    }
                                >
                                    Limit
                                </th>
                                <th className="sort" style={{ minWidth : "70px" }}
                                    onClick={() =>
                                        handleSortItemNumber(changeCurrency ? "LIMIT" : "LIMIT_USD")

                                    }
                                >
                                    Limit Ẩn
                                </th>
                                <th className="sort" style={{ minWidth : "70px" }}
                                    onClick={() =>
                                        handleSortItemNumber(changeCurrency ? "TOTAL_SPENDING" : "TOTAL_SPENDING_USD")
                                    }
                                >
                                    Tổng Tiêu
                                </th>
                                <th className="sort"
                                    onClick={() =>
                                        handleSortItemNumber("ADMIN")
                                    }
                                >Admin
                                </th>
                                <th className="sort"
                                    onClick={() =>
                                        handleSortItemText("PERMISSION_ACCOUNT")
                                    }>Quyền TK
                                </th>
                                <th
                                    className="sort"
                                    onClick={() =>
                                        handleSortItemText("CURRENCY")
                                    }
                                >
                                    Tiền tệ
                                </th>
                                <th className="sort" onClick={() =>
                                    handleSortItemText("ACCOUNT_TYPE")
                                }>Loại TK
                                </th>
                                <th className="sort"
                                    onClick={() =>
                                        handleSortItemText("PERMISSION_BM")
                                    }
                                >Role
                                </th>
                                <th className="sort"
                                    onClick={() =>
                                        handleSortItemNumber("ID_BM")
                                    }
                                >ID BM
                                </th>
                                <th className="sort"
                                    onClick={() =>
                                        handleSortItemNumber("ID_BM")
                                    }
                                >BILL
                                </th>
                                <th className="sort" onClick={() =>
                                    handleSortPaymentMethod("PAYMENT_METHOD")
                                }>Thanh toán
                                </th>
                                <th className="sort"
                                    onClick={() =>
                                        handleSortItemNumber("TIME_ZONE")
                                    }
                                >Múi giờ
                                </th>
                            </tr>
                            </thead>
                            <tbody id="tb" style={{ position : "relative", overflowY : "auto" }}>
                            {filteredList.map(( item, key ) => (
                                <tr className="trInfo" key={key}>
                                    <td className="tdInfo">{item.STT}</td>
                                    <td className="tdInfo">
                                        <div className="tbstatus">{checkStatusBM(item.STATUS)}</div>
                                    </td>
                                    <td className="tdInfo"> {item.ID_TKQC_AD}</td>
                                    <td className="tdInfo"
                                        style={{ textAlign : "left", overflow : "hidden" }}> {item.NAME_TK_AD}</td>

                                    <td className="tdInfo">
                                        <span
                                            className="r">
                                            {changeCurrency ? formatNumber(item.DEBT) : formatNumber(item.DEBT_USD)}
                                        </span>
                                    </td>
                                    <td className="tdInfo">
                                        <span className="r">
                                            {changeCurrency ? (item.THRESHOLD <= 0 ? "--" : formatNumber(item.THRESHOLD)) : (item.THRESHOLD_USD <= 0 ? "--" : formatNumber(item.THRESHOLD_USD))}
                                        </span>
                                    </td>
                                    <td className="tdInfo">
                                        <span className="r">
                                            {changeCurrency ? (item.LIMIT <= 0 ? "NO LIMIT" : formatNumber(item.LIMIT)) : (item.LIMIT <= 0 ? "NO LIMIT" : formatNumber(item.LIMIT_USD))}
                                        </span>
                                    </td>
                                    <td className="tdInfo">
                                        <span className="r">
                                            {changeCurrency ? (item.LIMIT <= 0 ? "NO LIMIT" : formatNumber(item.LIMIT)) : (item.LIMIT <= 0 ? "NO LIMIT" : formatNumber(item.LIMIT_USD))}

                                      </span>
                                    </td>
                                    <td className="tdInfo">
                                        <span
                                            className="r">
                                            {changeCurrency ? formatNumber(item.TOTAL_SPENDING) : formatNumber(item.TOTAL_SPENDING_USD)}
                                        </span>
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
                                    <td className="tdInfo" style={{color:"blue"}} onClick={handleGetBill}>Link</td>

                                    <td className="tdInfo">{item.PAYMENT_METHOD}</td>
                                    <td className="tdInfo" style={{textAlign:"left"}}>{item.TIME_ZONE}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <table className={styles.sticky}>
                        <tbody>
                        <tr>
                            <td style={{ width : `${widthMain.widthTotal}px`, borderRight : "1px solid #ccc" }}
                                className={styles.stickyTotal}>
                                TOTAL
                            </td>
                            <td className="tdInfo"
                                style={{
                                    width : `${widthMain.widthDebt}px`,
                                    backgroundColor : "#133c40",
                                    borderRight : "1px solid #ccc"
                                }}>
                                {formatNumber(infos.reduce(( total, item ) => total + item.DEBT, 0))}
                            </td>
                            <td className="tdInfo"
                                style={{
                                    width : `${widthMain.widthThresHold}px`,
                                    backgroundColor : "#133c40",
                                    borderRight : "1px solid #ccc"
                                }}>
                                {formatNumber(infos.reduce(( total, item ) => total + item.DEBT, 0))}
                            </td>
                            <td className="tdInfo"
                                style={{
                                    width : `${widthMain.widthLimit}px`,
                                    backgroundColor : "#133c40",
                                    borderRight : "1px solid #ccc"
                                }}>
                                {formatNumber(infos.reduce(( total, item ) => total + item.DEBT, 0))}
                            </td>
                            <td className="tdInfo"
                                style={{
                                    width : `${widthMain.widthLimitHidden}px`,
                                    backgroundColor : "#133c40",
                                    borderRight : "1px solid #ccc"
                                }}>
                                {formatNumber(infos.reduce(( total, item ) => total + item.DEBT, 0))}
                            </td>
                            <td className="tdInfo" style={{
                                width : `${widthMain.widthLimitTotalSpending}px`,
                                backgroundColor : "#133c40"
                            }}>
                                {formatNumber(infos.reduce(( total, item ) => total + item.DEBT, 0))}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </>
    );
};

export default PopupDetailAD;