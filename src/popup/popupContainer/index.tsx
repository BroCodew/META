import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import styles from "./styles/index.module.scss";
import { Button, Checkbox, Input, Spinner, Stack } from "@chakra-ui/react";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SearchBar from "../../component/Search";
import { format } from "date-fns";
import { Calendar } from "react-date-range";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';


const PopupContainer = () => {



    const [detailParam, setDetailParam] = useState(null);
    const [dataAccount, setDataAccount] = useState([]);
    const [dataAccountOriginal, setDataAccountOriginal] = useState([]);
    const [accountID, setAccountID] = useState(null);
    const [infos, setInfos] = useState([]);
    const [orderBy, setOrderBy] = useState(1)
    const [copied, setCopied] = useState<boolean>(false);
    const [filteredList, setFilteredList] = useState(infos);
    const [loading, setLoading] = useState(true);
    const [selectedDates, setSelectedDates] = useState<Date[]>([new Date(), new Date()]);
    const [calendar, setCalendar] = useState(format(new Date(), 'dd-MM-yyyy'));
    const [isOpen, setIsOpen] = useState(false);
    const today = new Date();
    const formattedDate = format(today, 'dd-MM-yyyy')
    const navigate = useNavigate();
    const refCalendar = useRef(null);

const formatDateFn = (dateString) => {
    const dateObject = new Date(dateString);
    return format(dateObject, 'dd-MM-yyyy');
}



    const clickOutside = (event) => {
        if (refCalendar.current && !refCalendar.current.contains(event.target)) {
            setIsOpen(false)
        }
    }

    const handleSelectDate = (date) => {
        console.log('handleSelectDatehandleSelectDate', date)
        setCalendar(format(date, 'dd-MM-yyyy'));


        // setInfos([{
        //     STT: 1,
        //     DATE_HOME: formattedDate,
        //     COOKIES: "Cookie",
        //     ID_TKQC_HOME: 573216737882876,
        //     NAME_TK_HOME: "Jenny",
        //     TOTAL_ACCOUNT_ADS: 4,
        //     TOTAL_BM: 20,
        //     TOTAL_SPENDING_HOME: 1234233,
        //     TOTAL_THRESHOLD: 2313120,
        //     DEBT_TOTAL: 2035556,
        //     DETAIL: "DETAIL",
        //     ID: uuidv4(),
        // }])
    }

    const handleGetAccessToken = () => {
        chrome.runtime.sendMessage({ action: "login_request" }, (response) => {
            if (response && response.success) {
                setDataAccountOriginal(response.data.data);
                setDataAccount(response.data.data);
                response.accountId.id && setAccountID(response.accountId.id);
            } else {
                console.error(response.error);
            }
        });
    };


    const cookieFake = {
        sb: "SS9PZR4H9YpW0G7pgFEHXWgs",
        datr: "SS9PZYqNyaQ8Wgxg8cL3Mtdd",
        locale: "vi_VN",
        c_user: "100045983811887",
        xs: "34%3A9F64PgFRQVSDMw%3A2%3A1699688308%3A-1%3A7939%3A%3AAcWO44l763FnAPpvkN9cYoCfIO-2F_E5LAQLpiwz8w",
        wd: "1020x923",
        fr: "1LV2cQ5w7OjeQXY13.AWXbduuHs9y3L7UcnilsG_2AQFk.BlUan_.xm.AAA.0.0.BlUayT.AWVwG62htzQ",
        presence: "C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1699851417154%2C%22v%22%3A1%7D"
    }
    const handleNavigateDetail = () => {
        setDetailParam(cookieFake.c_user)

    };


    const currencyChange = (current, currentRation) => {
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


    const compareData = (a, b, field) => {
        if (a[field] < b[field]) {
            return -1;
        } else if (a[field] > b[field]) {
            return 1;
        } else {
            return 0;
        }
    };


    const handleSortItemNumber = (field) => {
        const compareField = (a, b) => compareData(a, b, field)
        if (orderBy === 1) {
            setInfos((pre) => {
                const storeData = [...pre].sort(compareField);
                setOrderBy(0);
                return storeData.reverse()
            })
        } else {
            setInfos((pre) => {
                const storeData = [...pre].sort(compareField);
                setOrderBy(1);
                return storeData
            })
        }
    };


    const convertNumberToUsd = (value) => {
        let USDollar = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        return USDollar.format(value);
    }


    const handleCopyCookie = (index) => {
        // setCopied(( prevCopied ) => {
        //     const updatedCopied = [...prevCopied];
        //     updatedCopied[index] = !prevCopied[index];
        //     return updatedCopied as boolean[];
        // });
    };
    useEffect(() => {
        // Kiểm tra nếu detailParam có giá trị thì thực hiện chuyển trang
        if (detailParam) {
            navigate(`/popup.html/detail/${detailParam}`);
        }
    }, [detailParam]);
    useEffect(() => {

        let dataInfos = [];

        const cookieFake = {
            sb: "SS9PZR4H9YpW0G7pgFEHXWgs",
            datr: "SS9PZYqNyaQ8Wgxg8cL3Mtdd",
            locale: "vi_VN",
            c_user: "100045983811887",
            xs: "34%3A9F64PgFRQVSDMw%3A2%3A1699688308%3A-1%3A7939%3A%3AAcWO44l763FnAPpvkN9cYoCfIO-2F_E5LAQLpiwz8w",
            wd: "1020x923",
            fr: "1LV2cQ5w7OjeQXY13.AWXbduuHs9y3L7UcnilsG_2AQFk.BlUan_.xm.AAA.0.0.BlUayT.AWVwG62htzQ",
            presence: "C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1699851417154%2C%22v%22%3A1%7D"
        }

        const cookiesFake2 = {
            sb: "g7xBZfn1sHbLcaZAfEeHY5LY",
            datr: "g7xBZZTQlGTHLaOKnQN8wBa6",
            locale: "vi_VN",
            c_user: "100054281226202",
            xs: "45%3A57SenU0v_LLjCA%3A2%3A1699859925%3A-1%3A8014",
            fr: "1oXA4eTQubQwmjx1g.AWWxRWaqyxwSTScfDG99HhgGhf0.BlT0iO.WF.AAA.0.0.BlUc3W.AWXDDEmPepI",
            presence: "C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1699859937792%2C%22v%22%3A1%7D",
            wd: "1920x498"
        }
        dataInfos = [
            {
                STT: 1,
                DATE_HOME: formatDateFn("2023-12-05"),
                COOKIES: "Cookie",
                ID_TKQC_HOME: 573216737882876,
                NAME_TK_HOME: "Jenny",
                TOTAL_ACCOUNT_ADS: 4,
                TOTAL_BM: 20,
                TOTAL_SPENDING_HOME: 1234233,
                TOTAL_THRESHOLD: 2313120,
                DEBT_TOTAL: 2035556,
                DETAIL: "DETAIL",
                ID: uuidv4(),
            },
            {
                STT: 2,
                // DATE_HOME: "5/6/2022",
                DATE_HOME: formatDateFn("2023-12-04"),

                COOKIES: 15610562311,
                ID_TKQC_HOME: 8573216737882871,
                NAME_TK_HOME: "ADAM",
                TOTAL_ACCOUNT_ADS: 9,
                TOTAL_BM: 1,
                TOTAL_SPENDING_HOME: 1234233,
                TOTAL_THRESHOLD: 555005,
                DEBT_TOTAL: 56555213321,
                ID: uuidv4(),
            },
            {
                STT: 3,
                DATE_HOME: "11/4/2023",
                COOKIES: cookiesFake2.c_user,
                NAME_TK_HOME: "Charles",
                ID_TKQC_HOME: 4573216737882871,
                TOTAL_ACCOUNT_ADS: 199,
                TOTAL_BM: 150,
                TOTAL_SPENDING_HOME: 1234233,
                TOTAL_THRESHOLD: 65656000,
                DEBT_TOTAL: 54212312,
                DETAIL: "DETAIL",
                ID: uuidv4(),
            },
        ];
        setInfos(dataInfos)
        setLoading(false)
        // }

    }, [dataAccount, accountID]);
    // useEffect(() => {
    //     handleGetAccessToken();
    // }, []);

    useEffect(() => {
        setFilteredList(infos)
    }, [infos]);

    useEffect(() => {
        document.addEventListener("click", clickOutside, true);
    }, []);

    if (loading) {
        return (
            <div className={styles.spinnerContainer}>
                <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl'
                    className={styles.ChakraSpinner}
                />
            </div>
        )
    }



    const filToday = (dateFilter) => {
        const date = new Date();
        let filter = [];

        switch (dateFilter) {
            case 'today':
                const formattedToday = format(date, 'dd-MM-yyyy');
                filter = infos.filter((item) => item.DATE_HOME === formattedToday);
                break;
            case 'yesterday':
                const yesterday = new Date(date);
                yesterday.setDate(date.getDate() - 1);
                const formattedYesterday = format(yesterday, 'dd-MM-yyyy');
                filter = infos.filter((item) => item.DATE_HOME === formattedYesterday);
                break;
            case 'allTime':
                // No date filter for "all time"
                filter = infos;
                break;
            default:
                break;
        }

        // Do something with the filtered data (e.g., setInfos(filter))
        console.log(filter);
        setFilteredList(filter);
    };

    return (

        !loading &&
        <>
            <div className="app" style={{ height: "100vh" }}>
                <div className="wrapper" id="main">

                    <div className="sc_heading" style={{ marginBottom: "20px", backgroundColor: 'transparent' }}>
                        <SearchBar filteredList={filteredList} infos={infos} setFilteredList={setFilteredList} />

                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <div  >
                                <Button onClick={() => filToday("today")} >Hôm nay</Button>
                                <Button onClick={()=>filToday("yesterday")} style={{ marginLeft: '10px', marginRight: '10px' }}>Hôm qua</Button>
                                <Button onClick={()=>filToday("allTime")}>All time</Button>
                            </div>

                            <div style={{ marginLeft: '40px' }}>
                                <Input bgColor={"#fff"} className={styles.inputCalendar} placeholder='small size' size='sm' value={calendar} onClick={() => setIsOpen(true)} />
                            </div>

                            <div ref={refCalendar} className={styles.calenderContainer}>
                                {isOpen && <Calendar date={new Date()} onChange={handleSelectDate} />}
                            </div>

                        </div>

                    </div>
                    <div
                        id="AccStatus"
                        className="tabcontent active">

                        <div className="loaddata1" style={{ display: "none" }}>
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
                                    onClick={() => handleSortItemNumber("DATE_HOME")}
                                >DATE
                                </th>
                                <th className="sort">COOKIES</th>
                                <th className="sort">CHECKER</th>

                                <th className="sort" onClick={() => handleSortItemNumber("ID_TKQC_HOME")}>ID</th>
                                <th className="sort">Tên TK</th>
                                <th className="sort"
                                    onClick={() => handleSortItemNumber("TOTAL_ACCOUNT_ADS")}
                                >Profile Chrome
                                </th>
                                <th className="sort"
                                    onClick={() => handleSortItemNumber("TOTAL_ACCOUNT_ADS")}
                                >IP
                                </th>
                                <th className="sort"
                                    onClick={() => handleSortItemNumber("TOTAL_ACCOUNT_ADS")}
                                >Quốc Gia
                                </th>


                                <th className="sort"
                                    onClick={() => handleSortItemNumber("TOTAL_ACCOUNT_ADS")}
                                >Tổng TKQC
                                </th>
                                <th className="sort"
                                    onClick={() => handleSortItemNumber("TOTAL_BM")}
                                >Tổng BM
                                </th>
                                <th className="sort"
                                    onClick={() => handleSortItemNumber("TOTAL_SPENDING_HOME")}
                                >Tổng Tiêu
                                </th>
                                <th className="sort"
                                    onClick={() => handleSortItemNumber("TOTAL_THRESHOLD")}
                                >Tổng Ngưỡng
                                </th>
                                <th className="sort" style={{ minWidth: "100px" }}
                                    onClick={() => handleSortItemNumber("DEBT_TOTAL")}
                                >
                                    Tổng Dư nợ
                                </th>

                            </tr>
                            </thead>
                            <tbody id="tb">
                            {filteredList.map((item, key) => (
                                <tr className="trInfo" key={uuidv4()}
                                    style={{ backgroundColor: copied[key] ? "red" : "transparent" }}>
                                    <td className="tdInfo">{item.STT}</td>
                                    <td className="tdInfo"> {item.DATE_HOME}</td>
                                    <td className="tdInfo">
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "space-around",
                                            marginTop: 5
                                        }}>

                                            <CopyToClipboard
                                                text={item.COOKIES}
                                                onCopy={() => handleCopyCookie(key)}>
                                                <Button
                                                    colorScheme='whatsapp'>{copied[key] ? "COPIED" : "COPY"}
                                                </Button>
                                            </CopyToClipboard>
                                        </div>

                                    </td>
                                    <td className="tdInfo">
                                        <Stack spacing={[1, 5]} direction={['column', 'row']}
                                               style={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
                                            <Checkbox size='sm' colorScheme='green'>
                                                Mr D
                                            </Checkbox>
                                            <Checkbox size='sm' colorScheme='green'>
                                                Mr H
                                            </Checkbox>
                                            <Checkbox size='sm' colorScheme='green'>
                                                Mr A
                                            </Checkbox>
                                        </Stack>
                                    </td>
                                    <td className="tdInfo"
                                        style={{ textAlign: "center", overflow: "hidden" }}> {item.ID_TKQC_HOME}</td>
                                    <td className="tdInfo"> {item.NAME_TK_HOME}</td>
                                    <td className="tdInfo"> Profile Chrome</td>
                                    <td className="tdInfo"> 226.226.266.266</td>
                                    <td className="tdInfo"> Hà Nội / Việt Nam</td>
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
                                        <span className="r">{convertNumberToUsd(item.TOTAL_SPENDING_HOME)}</span>
                                    </td>
                                    <td className="tdInfo"

                                    >
                                        <span className="r">{convertNumberToUsd(item.TOTAL_THRESHOLD)}</span>
                                    </td>
                                    <td className="tdInfo"

                                    >
                                        <span className="r">{convertNumberToUsd(item.DEBT_TOTAL)}</span>
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

        </>
    );
};

export default PopupContainer;