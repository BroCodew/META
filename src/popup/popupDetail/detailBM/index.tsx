import React, {useEffect, useState} from "react";
import {Stack, Switch} from "@chakra-ui/react";
import styles from "../detailPage/styles/index.module.scss";

const PopupDetailBM = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const [dataBM, setDataBM] = useState([])
    const [accountId, setAccountId] = useState(null)
    const [infos, setInfos] = useState<any>([]);
    const [orderBy, setOrderBy] = useState(1)


    const checkStatusBM = ( status ) => {
        return status === true ? (
            <div className={styles.statusAccount}>
                <p className={styles.liveIconLive}></p>
                <p className={styles.liveTextLive}>LIVE</p>
            </div>
        ) : (
            <div className={styles.statusAccount}>
                <p className={styles.liveIconDie}></p>
                <p className={styles.liveTextDie}>DIE</p>
            </div>
        );
    }

    const handleGetData = () => {
        chrome.runtime.sendMessage({ action : "login_request" }, ( response ) => {
            if (response && response.success) {
                setAccountId(response.accountId.id)
                setDataBM(response.dataBM.data)
            }
        })
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

    function convertDateFormat( inputDateString ) {
        // Chuyển đổi thành đối tượng Date
        var dateObject = new Date(inputDateString);

        // Lấy thông tin ngày, tháng, năm
        var day = dateObject.getDate();
        var month = dateObject.getMonth() + 1; // Tháng bắt đầu từ 0
        var year = dateObject.getFullYear(); // Lấy năm đầy đủ 4 chữ số

        // Định dạng lại ngày tháng theo dd/mm/yyyy
        var formattedDay = day < 10 ? '0' + day : day;
        var formattedMonth = month < 10 ? '0' + month : month;
        var formattedYear = year;

        var formattedDate = `${formattedDay}/${formattedMonth}/${formattedYear}`;

        return formattedDate;
    }

    const handleChangeDataRaw = () => {
        if (typeof dataBM === "object" && Array.isArray(dataBM) && accountId !== null) {
            let dataInfos = [];
            for (let i = 0; i < dataBM.length; i++) {
                dataInfos.push({
                    STT : i + 1,
                    STATUS : dataBM[i]?.allow_page_management_in_www,
                    ID : dataBM[i].id,
                    NAME : dataBM[i].name,
                    LEVEL : 1,
                    LIMIT : dataBM[i].can_use_extended_credit,
                    TIME : dataBM[i].timezone_id,
                    CREATED_TIME : dataBM[i].created_time,

                })
            }
            setInfos(dataInfos)

        }

    }

    useEffect(() => {
        handleChangeDataRaw()
    }, [dataBM, accountId]);

    useEffect(() => {
        handleGetData()
    }, []);
    const Title_Account = [
        {
            STT : "STT",
            STATUS : "STATUS",
            ID : "ID",
            NAME : "TÊN",
            LEVEL : "LEVEL",
            LIMIT : "LIMIT",
            TIME : "Múi giờ",
            CREATED_TIME : "Ngày tạo",
        },
    ];


    return (
        <>
            <div className="app">
                <div className="wrapper" id="main">
                    <div className="sc_heading">
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
                                        <Switch colorScheme='teal' size='lg'/>
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
                        <div className="loaddata1" style={{ display : "none" }}>
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
                                >
                                    STATUS
                                </th>
                                <th className="sort">ID</th>
                                <th className="sort">Tên Page</th>
                                <th
                                    className="sort"
                                    style={{ minWidth : "100px" }}
                                    onClick={() => handleSortItemNumber("FOLLOWERS")}
                                >
                                    LEVEL
                                </th>
                                <th
                                    className="sort"
                                    style={{ minWidth : "70px" }}
                                    onClick={() => handleSortItemNumber("PERMISSION_POST")}
                                >
                                    LIMIT
                                </th>
                                <th className="sort" style={{ minWidth : "70px" }}
                                    onClick={() => handleSortItemNumber("ADS")}
                                >
                                    Múi giờ
                                </th>
                                <th className="sort" style={{ minWidth : "70px" }}
                                    onClick={() => handleSortItemNumber("CREATED_TIME")}
                                >
                                    Ngày tạo
                                </th>

                            </tr>
                            </thead>
                            <tbody id="tb">
                            {infos.map(( item, key ) => (
                                <tr className="trInfo" key={key}>
                                    <td className="tdInfo">{item.STT}</td>
                                    <td className="tdInfo">
                                        {checkStatusBM(item.STATUS)}
                                    </td>
                                    <td className="tdInfo" style={{ color : "blue" }}> {item.ID}</td>
                                    <td className="tdInfo"> {item.NAME}</td>
                                    <td className="tdInfo"> {item.LEVEL}</td>
                                    <td className="tdInfo"> {item.LIMIT === false ? 'false' : 0} </td>
                                    <td className="tdInfo"> {item.TIME} : unknown</td>
                                    <td className="tdInfo"> {convertDateFormat(item.CREATED_TIME)}</td>
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

export default PopupDetailBM;