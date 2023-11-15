import React, {useEffect, useState} from "react";
import {v4 as uuidv4} from "uuid";
import {useNavigate, useParams} from "react-router-dom";
import styles from "./styles/index.module.scss";
import {Button} from "@chakra-ui/react";


const PopupContainer = () => {

    const [detailParam, setDetailParam] = useState(null);
    const [dataAccount, setDataAccount] = useState([]);
    const [dataAccountOriginal, setDataAccountOriginal] = useState([]);

    const [accountID, setAccountID] = useState(null);
    const [infos, setInfos] = useState([]);
    const [orderBy, setOrderBy] = useState(1)

    const [changeCurrency, setChangeCurrency] = useState(false);
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    const navigate = useNavigate();
    let { id } = useParams();

    console.log('idParam', id)


    const cookieFake = {
        sb : "SS9PZR4H9YpW0G7pgFEHXWgs",
        datr : "SS9PZYqNyaQ8Wgxg8cL3Mtdd",
        locale : "vi_VN",
        c_user : "100045983811887",
        xs : "34%3A9F64PgFRQVSDMw%3A2%3A1699688308%3A-1%3A7939%3A%3AAcWO44l763FnAPpvkN9cYoCfIO-2F_E5LAQLpiwz8w",
        wd : "1020x923",
        fr : "1LV2cQ5w7OjeQXY13.AWXbduuHs9y3L7UcnilsG_2AQFk.BlUan_.xm.AAA.0.0.BlUayT.AWVwG62htzQ",
        presence : "C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1699851417154%2C%22v%22%3A1%7D"
    }

    const cookiesFake2 = {
        sb : "g7xBZfn1sHbLcaZAfEeHY5LY",
        datr : "g7xBZZTQlGTHLaOKnQN8wBa6",
        locale : "vi_VN",
        c_user : "100054281226202",
        xs : "45%3A57SenU0v_LLjCA%3A2%3A1699859925%3A-1%3A8014",
        fr : "1oXA4eTQubQwmjx1g.AWWxRWaqyxwSTScfDG99HhgGhf0.BlT0iO.WF.AAA.0.0.BlUc3W.AWXDDEmPepI",
        presence : "C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1699859937792%2C%22v%22%3A1%7D",
        wd : "1920x498"
    }

    const coverCookieToString = ( cookies ) => {
        return Object.entries(cookies)
            .map(( [key, value] ) => `${key}=${value}`)
            .join(";");
    };

    console.log("cookiesFake2", coverCookieToString(cookiesFake2))

    const Title_Account =
        {
            STT : "STT",
            DATE : "Ngày tháng",
            DATE_BACKUP : "Ngày Backup",
            COOKIES : "Cookie",
            ID_TKQC : "ID_TKQC",
            THRESHOLD_TOTAL : "Tổng Ngưỡng",
            LIMIT_TOTAL : "Tổng Limit",
            BM_TOTAL : "Tổng BM",
            DEBT_TOTAL : "Tổng Dư Nợ",
        }
    ;

    const Value_Account = [
        {
            STT : 1,
            DATE : formattedDate,
            DATE_BACKUP : "19/11/2023",
            COOKIES : "Cookie",
            ID_TKQC : ["573216737882876", "573216737882871"],
            THRESHOLD : "20.000.000",
            LIMIT : "1.234.233",
            DETAIL : "DETAIL",
            ID : uuidv4(),
        },
        {
            STT : 1,
            DATE : formattedDate,
            DATE_BACKUP : "19/11/2023",
            COOKIES : cookieFake.c_user,
            ID_TKQC : ["573216737882876", "573216737882871"],
            THRESHOLD : "20.000.000",
            LIMIT : "1.234.233",
            DETAIL : "DETAIL",
            ID : uuidv4(),
        },
        {
            STT : 1,
            DATE : formattedDate,
            DATE_BACKUP : "19/11/2023",
            COOKIES : cookiesFake2.c_user,
            ID_TKQC : ["573216737882876", "573216737882871"],
            THRESHOLD : "20.000.000",
            LIMIT : "1.234.233",
            DETAIL : "DETAIL",
            ID : uuidv4(),
        },
    ];


    const handleGetAccessToken = () => {
        chrome.runtime.sendMessage({ action : "login_request" }, ( response ) => {
            if (response && response.success) {
                setDataAccountOriginal(response.data.data);
                setDataAccount(response.data.data);
                response.accountId.id && setAccountID(response.accountId.id);
            } else {
                console.error(response.error);
            }
        });
    };


    const handleNavigateDetail = () => {
        setDetailParam(cookieFake.c_user)

    };

    const Title_Account1 = [
        {
            STT : "STT",
            DATE : "Ngày tháng",
            COOKIES : "Cookie",
            ID_TKQC : "ID",
            NAME_TK : "Tên TK",//threshold_amount//infos:string//dataAccount:number
            LIMIT : "LIMIT", //adtrust_dsl//infos:string//dataAccount:number
            TOTAL_ACCOUNT_ADS : "Tổng TKQC",
            TOTAL_BM : "Tổng BM",
            TOTAL_THRESHOLD : "Tổng Ngưỡng",


            DEBT_TOTAL : "Tổng Dư Nợ",//balance//infos:string//dataAccount:string
            TOTAL_SPENDING : "Tổng Tiêu",//amount_spent//infos:string//dataAccount:string
            PROFILE_CHROME : "Profile Chrome",
            COUNTRY : "COUNTRY",
            CITY : "CITY",
            IP : "IP",
            PERMISSION_ACCOUNT : "Quyền Tài Khoản",
            CURRENCY : "Tiền tệ",
            ACCOUNT_TYPE : "Loại tài khoản",
            PERMISSION_BM : "Role",
            ID_BM : "ID BM",
            PAYMENT_METHOD : "PTTT",
            TIME_ZONE : "Múi giờ",
        },
    ];


    const currencyChange = ( current, currentRation ) => {
        let change;
        if (typeof current !== "object") {
            change = current / currentRation;
        } else if (Array.isArray(current) && current.length > 0) {
            change = current[0] / currentRation;
        } else if (!current) {
            change = 0;
        } else {
            change = 0;
        }
        const result = change.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
        return result;
    };

    function convertCurrencyToNumber( value ) {
        if (typeof value === 'number') {
            return value;
        } else if (typeof value === 'string') {
            const sanitizedValue = value.replace(/[^0-9.-]/g, ''); // Loại bỏ tất cả các ký tự không phải số hoặc dấu chấm
            const numberValue = parseFloat(sanitizedValue);
            return isNaN(numberValue) ? 0 : numberValue;
        } else {
            return 0; // Hoặc giá trị mặc định tùy thuộc vào yêu cầu của bạn
        }
    }


    const compareData = ( a, b, field ) => {
        if (a[field] < b[field]) {
            return -1;
        } else if (a[field] > b[field]) {
            return 1;
        } else {
            return 0;
        }
    };


    const handleSortItemNumber = ( field ) => {

        const compareField = ( a, b ) => compareData(a, b, field)
        if (orderBy === 1) {
            setInfos(( pre ) => {
                const storeData = [...pre].sort(compareField);
                setOrderBy(0);
                return storeData.reverse()
            })
        } else {
            setInfos(( pre ) => {
                const storeData = [...pre].sort(compareField);
                setOrderBy(1);
                return storeData
            })
        }
    };

    const formatCurrencyNormal = ( value ) => {
        if (typeof value === 'number') {
            return value.toLocaleString('en-US');
        }
        if (typeof value !== 'string') {
            return "--";
        }
        const cleanedValue = value.replace(/[.,]/g, '');
        const numberValue = Number(cleanedValue);
        if (isNaN(numberValue)) {
            return "--";
        } else {
            return numberValue.toLocaleString('en-US');
        }
    }
    const handleChangeCurrency = () => {
        if (changeCurrency === false) {
            const debt = dataAccountOriginal.map(( item ) => formatCurrencyNormal(item.balance));
            const limit = dataAccountOriginal.map(( item ) => item.adtrust_dsl === -1 ? "--" : formatCurrencyNormal(item.adtrust_dsl));
            const total_spending = dataAccountOriginal.map(( item ) => formatCurrencyNormal(item.amount_spent));
            const threshold_amount: any[] = dataAccountOriginal.flatMap(( item ) => {
                if (item.adspaymentcycle && item.adspaymentcycle.data) {
                    return item.adspaymentcycle.data.map(( cycleItem ) => {
                        const thresholdAmountValue = typeof cycleItem.threshold_amount === "string" ?
                            formatCurrencyNormal(parseFloat(cycleItem.threshold_amount.replace(/,/g, ''))) :
                            cycleItem.threshold_amount;
                        return thresholdAmountValue;
                    });
                } else {
                    return "--";
                }
            });
            setInfos(( prevState ) => {
                const newState = prevState.map(( item, index ) => ({
                    ...item,
                    DEBT : debt[index],
                    TOTAL_SPENDING : total_spending[index],
                    LIMIT : limit[index],
                    THRESHOLD : threshold_amount[index]
                }));

                return newState;
            });
            setChangeCurrency(!changeCurrency);
        } else {

            const debt = dataAccountOriginal.map(( item ) => currencyChange(item.balance, item.account_currency_ratio_to_usd));
            const limit = dataAccountOriginal.map(( item ) => item.adtrust_dsl === -1 ? "--" : currencyChange(item.adtrust_dsl, item.account_currency_ratio_to_usd));
            const total_spending = dataAccountOriginal.map(( item ) => currencyChange(item.amount_spent, item.account_currency_ratio_to_usd));
            const ratioValue = dataAccountOriginal.map(( item ) => item.account_currency_ratio_to_usd);
            const threshold_amount = dataAccountOriginal.flatMap(( item ) => {
                if (item.adspaymentcycle && item.adspaymentcycle.data) {
                    return item.adspaymentcycle.data.map(( cycleItem ) => {
                        return cycleItem.threshold_amount;
                    });
                } else {
                    return "--";
                }
            });
            const result = threshold_amount.map(( value, index ) => currencyChange(value, ratioValue[index]));
            setInfos(( prevState ) => {
                const newState = prevState.map(( item, index ) => {
                    return {
                        ...item,
                        DEBT : debt[index],
                        TOTAL_SPENDING : total_spending[index],
                        LIMIT : limit[index],
                        THRESHOLD : result[index]
                    };
                });
                return newState;
            });
            setChangeCurrency(!changeCurrency);
        }

    }

    const handleReloadStorage = ( e: any ) => {
        window.location.reload();
        chrome.runtime.sendMessage({ action : "reload_storage" }, function ( response ) {
            console.log(response);
        });
    };

    useEffect(() => {
        // Kiểm tra nếu detailParam có giá trị thì thực hiện chuyển trang
        if (detailParam) {
            navigate(`/popup.html/detail/${detailParam}`);
        }
    }, [detailParam]);

    useEffect(() => {
        if (
            typeof dataAccount === "object" &&
            accountID !== null &&
            dataAccount.length > 0
        ) {
            let dataInfos = [];

            for (let i = 0; i < dataAccount.length; i++) {
                const debt = currencyChange(
                    dataAccount[i]?.balance,
                    dataAccount[i]?.account_currency_ratio_to_usd
                );
                const thresholdArr = dataAccount[i]?.adspaymentcycle?.data.map(
                    ( item ) => item.threshold_amount
                );
                const threShold = currencyChange(
                    thresholdArr,
                    dataAccount[i]?.account_currency_ratio_to_usd
                );

                dataInfos.push({
                    STT : i + 1,
                    STATUS : dataAccount[i]?.account_status,
                    DATE : formattedDate,
                    DATE_BACKUP : "19/11/2023",
                    IP : "222.252.20.234",
                    PROFILE_CHROME : "Profile Chrome",
                    COUNTRY : "Viet Nam",
                    CITY : "Ha Noi",
                    COOKIES : "Cookie",
                    ID_TKQC : dataAccount[i]?.account_id,
                    NAME_TK : dataAccount[i]?.name,
                    DEBT : debt,
                    THRESHOLD : threShold,
                    LIMIT : currencyChange(
                        dataAccount[i]?.adtrust_dsl,
                        dataAccount[i]?.account_currency_ratio_to_usd
                    ),
                    ADMIN : dataAccount[i]?.userpermissions.data.length,
                    TOTAL_SPENDING : currencyChange(
                        dataAccount[i]?.amount_spent,
                        dataAccount[i]?.account_currency_ratio_to_usd
                    ),
                    // TOTAL_SPENDING: dataAccount[i]?.amount_spent,
                    PERMISSION_ACCOUNT :
                        accountID !== null &&
                        dataAccount[i]?.userpermissions.data.filter(
                            ( item ) => item?.user?.id === accountID
                        )
                            ? "ADMIN"
                            : "",


                    ID_BM : dataAccount[i]?.owner_business?.id,

                    ID : uuidv4(),
                });
            }

            const cookieFake = {
                sb : "SS9PZR4H9YpW0G7pgFEHXWgs",
                datr : "SS9PZYqNyaQ8Wgxg8cL3Mtdd",
                locale : "vi_VN",
                c_user : "100045983811887",
                xs : "34%3A9F64PgFRQVSDMw%3A2%3A1699688308%3A-1%3A7939%3A%3AAcWO44l763FnAPpvkN9cYoCfIO-2F_E5LAQLpiwz8w",
                wd : "1020x923",
                fr : "1LV2cQ5w7OjeQXY13.AWXbduuHs9y3L7UcnilsG_2AQFk.BlUan_.xm.AAA.0.0.BlUayT.AWVwG62htzQ",
                presence : "C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1699851417154%2C%22v%22%3A1%7D"
            }

            const cookiesFake2 = {
                sb : "g7xBZfn1sHbLcaZAfEeHY5LY",
                datr : "g7xBZZTQlGTHLaOKnQN8wBa6",
                locale : "vi_VN",
                c_user : "100054281226202",
                xs : "45%3A57SenU0v_LLjCA%3A2%3A1699859925%3A-1%3A8014",
                fr : "1oXA4eTQubQwmjx1g.AWWxRWaqyxwSTScfDG99HhgGhf0.BlT0iO.WF.AAA.0.0.BlUc3W.AWXDDEmPepI",
                presence : "C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1699859937792%2C%22v%22%3A1%7D",
                wd : "1920x498"
            }
            dataInfos = [
                {
                    STT : 1,
                    DATE : formattedDate,
                    COOKIES : "Cookie",
                    ID_TKQC : 573216737882876,
                    NAME_TK : "Jenny",
                    TOTAL_ACCOUNT_ADS : 4,
                    TOTAL_BM : 20,
                    TOTAL_SPENDING : 1234233,
                    TOTAL_THRESHOLD : 2313120,
                    DEBT_TOTAL : 2035556,
                    DETAIL : "DETAIL",
                    ID : uuidv4(),
                },
                {
                    STT : 2,
                    DATE : formattedDate,
                    COOKIES : cookieFake.c_user,
                    ID_TKQC : 573216737882871,
                    NAME_TK : "ADAM",
                    TOTAL_ACCOUNT_ADS : 9,
                    TOTAL_BM : 1,
                    TOTAL_SPENDING : 1234233,
                    TOTAL_THRESHOLD : 555005,
                    DEBT_TOTAL : 56555213321,
                    ID : uuidv4(),
                },
                {
                    STT : 3,
                    DATE : formattedDate,
                    COOKIES : cookiesFake2.c_user,
                    NAME_TK : "Charles",
                    ID_TKQC : 573216737882871,
                    TOTAL_ACCOUNT_ADS : 199,
                    TOTAL_BM : 150,
                    TOTAL_SPENDING : 1234233,
                    TOTAL_THRESHOLD : 65656000,
                    DEBT_TOTAL : 54212312,
                    DETAIL : "DETAIL",
                    ID : uuidv4(),
                },
            ];

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
                    <div style={{ display : "flex", flexDirection : "column", padding : 30 }}>
                        <div style={{ color : "white", fontSize : 25, fontWeight : 500 }}>Tổng Ngưỡng :
                            250000000000000
                        </div>
                        <div style={{ color : "white", fontSize : 25, fontWeight : 500 }}>Tổng Tiêu : 10000000000000
                        </div>
                    </div>
                    <div className="sc_heading">
                        <div className="command">
                            <div className="command_head">
                                <div className="command_flex">
                                    <div className="command_search">
                                        <div>
                                            <i className="fa-solid fa-magnifying-glass"></i>
                                            <input id="tbfilter" type="text" placeholder="Tìm kiếm"/>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        id="AccStatus"
                        className="tabcontent active"
                    >
                        <div className="loaddata1" style={{ display : "none" }}>
                            <img
                                src="chrome-extension://ookgnahfklmejhicejjbfjifppjbfnlk/access/icon/loadingdata.gif"
                                alt=""
                            />
                        </div>
                        <table
                            className="table table-striped"
                            id="tball"
                            // style={{ overflow: "scroll" }}
                        >
                            <thead id="thall">
                            <tr>
                                <th className="sort">STT</th>
                                <th className="sort"
                                    onClick={() => handleSortItemNumber("DATE")}
                                >DATE
                                </th>
                                <th className="sort">COOKIES</th>
                                <th className="sort">ID</th>
                                <th className="sort">Tên TK</th>
                                <th className="sort"
                                    onClick={() => handleSortItemNumber("TOTAL_ACCOUNT_ADS")}
                                >Tổng TKQC
                                </th>
                                <th className="sort"
                                    onClick={() => handleSortItemNumber("TOTAL_BM")}
                                >Tổng BM
                                </th>
                                <th className="sort"
                                    onClick={() => handleSortItemNumber("TOTAL_SPENDING")}
                                >Tổng Tiêu
                                </th>
                                <th className="sort"
                                    onClick={() => handleSortItemNumber("TOTAL_THRESHOLD")}
                                >Tổng Ngưỡng
                                </th>
                                <th className="sort" style={{ minWidth : "100px" }}
                                    onClick={() => handleSortItemNumber("DEBT_TOTAL")}
                                >
                                    Tổng Dư nợ
                                </th>

                            </tr>
                            </thead>
                            <tbody id="tb">
                            {infos.map(( item, key ) => (
                                <tr className="trInfo" key={key}>
                                    <td className="tdInfo">{item.STT}</td>

                                    <td className="tdInfo"> {item.DATE}</td>
                                    <td className="tdInfo">
                                        <span>

                                        {item.COOKIES}
                                        </span>
                                        <span>COPY</span>
                                    </td>
                                    <td className="tdInfo"
                                        style={{ textAlign : "left", overflow : "hidden" }}> {accountID}</td>
                                    <td className="tdInfo"> {item.NAME_TK}</td>

                                    <td className="tdInfo"


                                    >
                                        <span className="r">{item.TOTAL_ACCOUNT_ADS}</span>
                                    </td>
                                    <td className="tdInfo"

                                    >
                                        <span className="r">{item.TOTAL_BM}</span>
                                    </td>
                                    <td className="tdInfo"

                                    >
                                        <span className="r">{item.TOTAL_SPENDING}</span>
                                    </td>
                                    <td className="tdInfo"

                                    >
                                        <span className="r">{item.TOTAL_THRESHOLD}</span>
                                    </td>
                                    <td className="tdInfo"

                                    >
                                        <span className="r">{item.DEBT_TOTAL}</span>
                                    </td>
                                    <td className={styles.optionValue}>

                                        <Button
                                            onClick={handleNavigateDetail}
                                            m={4}
                                            className={styles.optionButton}
                                        >{`Open Detail Cookie`}</Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* <Table className={styles.optionContainer}>
        <TableCaption
          className={styles.optionHeader}
          style={{ fontSize: 30, color: "#000" }}
          placement="top"
        >
          Analysis Information
        </TableCaption>
        <Thead style={{ textAlign: "center" }}>
          {Title_Account.map((item, key) => (
            <Tr
              key={key}
              style={{
                textAlign: "center",
              }}
            >
              <Th className={styles.optionTitle}>{item.STT}</Th>
              <Th className={styles.optionTitle}>{item.DATE}</Th>
              <Th className={styles.optionTitle}>{item.DATE_BACKUP}</Th>
              <Th className={styles.optionTitle}>{item.COOKIES}</Th>
              <Th className={styles.optionTitle}>{item.ID_TKQC}</Th>
              <Th className={styles.optionTitle}>{item.THRESHOLD}</Th>
              <Th className={styles.optionTitle}>{item.LIMIT}</Th>
              <Th className={styles.optionTitle}>{item.DETAIL}</Th>
            </Tr>
          ))}
          {Value_Account.map((item) => (
            <Tr key={item.ID}>
              <Th className={styles.optionValue}>{item.STT}</Th>
              <Th className={styles.optionValue}>{item.DATE}</Th>
              <Th className={styles.optionValue}>{item.DATE_BACKUP}</Th>
              <Th className={styles.optionValue}>{item.COOKIES}</Th>
              <Th className={styles.optionValue}>
                {item.ID_TKQC.map((i, k) => (
                  <p key={k}>{i}</p>
                ))}
              </Th>
              <Th className={styles.optionValue}>{item.THRESHOLD}</Th>
              <Th className={styles.optionValue}>{item.LIMIT}</Th>
              <Th className={styles.optionValue}>
                <Button
                  onClick={() => handleClick(size)}
                  key={size}
                  m={4}
                  className={styles.optionButton}
                >{`Open Detail Cookie`}</Button>

                <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                  <DrawerOverlay />
                  <DrawerContent style={{ overflow: "scroll" }}>
                    <DrawerCloseButton />
                    <DrawerHeader>{`${size} drawer contents`}</DrawerHeader>
                    <DrawerBody className={styles.optionDrawer}>
                      <PopupDetail />
                    </DrawerBody>
                  </DrawerContent>
                </Drawer>
              </Th>
            </Tr>
          ))}
        </Thead>
      </Table> */}
        </>
    );
};

export default PopupContainer;
