import React, {useEffect, useState} from "react";
import {NotVerified} from "../../../static/icon/NotVerified";
import {Verified} from "../../../static/icon/Verified";
import SearchBar from "../../../component/Search";

const PopupDetailPageSale = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const [dataPageSale, setDataPageSale] = useState([])
    const [accountId, setAccountId] = useState(null)
    const [infos, setInfos] = useState<any>([]);
    const [orderBy, setOrderBy] = useState(1) //asc

    const handleGetData = () => {
        chrome.runtime.sendMessage({ action : "login_request" }, ( response ) => {
            if (response && response.success) {
                setAccountId(response.accountId.id)
                setDataPageSale(response.dataPage.accounts.data)
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


    const handleChangeDataRaw = () => {
        if (typeof dataPageSale === "object" && Array.isArray(dataPageSale) && accountId !== null) {
            let dataInfos = [];

            for (let i = 0; i < dataPageSale.length; i++) {
                const hasPermissionPost = dataPageSale[i].roles.data.some(item => item.id === accountId && item.tasks.includes("CREATE_CONTENT"));

                dataInfos.push({
                    STT : i + 1,
                    AVATAR : dataPageSale[i]?.picture.data.url,
                    ID : dataPageSale[i].id,
                    NAME_PAGE : dataPageSale[i].name,
                    VERIFIED : dataPageSale[i].verification_status,
                    LIKES : dataPageSale[i].fan_count,
                    FOLLOWERS : dataPageSale[i].followers_count,
                    PERMISSION_POST : hasPermissionPost ? 1 : 0,
                    ADS : dataPageSale[i].is_promotable ? 1 : 0,
                    ADS_COUNT : 0
                })
            }

            // dataInfos = [
            //     {
            //         STT : 1,
            //         AVATAR : "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
            //         ID : 1,
            //         NAME_PAGE : "a",
            //         VERIFIED : true,
            //         LIKES : 1,
            //         FOLLOWERS : 1,
            //         PERMISSION_POST : true,
            //         ADS : 1,
            //         ADS_COUNT : 0
            //     },
            //     {
            //         STT : 2,
            //         AVATAR : "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
            //         ID : 2,
            //         NAME_PAGE : "g",
            //         VERIFIED : true,
            //         LIKES : 100,
            //         FOLLOWERS : 99,
            //         PERMISSION_POST : true,
            //         ADS : 6,
            //         ADS_COUNT : 0
            //     },
            //     {
            //         STT : 3,
            //         AVATAR : "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
            //         ID : 5,
            //         NAME_PAGE : "d",
            //         VERIFIED : true,
            //         LIKES : 50,
            //         FOLLOWERS : 60,
            //         PERMISSION_POST : true,
            //         ADS : 3,
            //         ADS_COUNT : 1
            //     },
            //     {
            //         STT : 4,
            //         AVATAR : "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
            //         ID : 3,
            //         NAME_PAGE : "d",
            //         VERIFIED : true,
            //         LIKES : 89,
            //         FOLLOWERS : 60,
            //         PERMISSION_POST : true,
            //         ADS : 4,
            //         ADS_COUNT : 1
            //     }
            // ]
            setInfos(dataInfos)

        }

    }

    const handleReloadStorage = ( e: any ) => {
        window.location.reload();
        chrome.runtime.sendMessage({ action : "reload_storage" }, function ( response ) {
            console.log(response);
        });
    };

    useEffect(() => {
        handleChangeDataRaw()
    }, [dataPageSale, accountId]);

    useEffect(() => {
        handleGetData()
    }, []);
    const Title_Account = [
        {
            STT : "STT",
            AVATAR : "AVATAR",
            ID : "ID",
            NAME_PAGE : "TÊN PAGE",
            VERIFIED : "VERIFIED",
            LIKES : "LIKES",//threshold_amount//infos:string//dataAccount:number
            FOLLOWERS : "FOLLOWERS", //adtrust_dsl//infos:string//dataAccount:number
            PERMISSION_POST : "QUYỀN ĐĂNG",//balance//infos:string//dataAccount:string
            ADS : "QUẢNG CÁO",//amount_spent//infos:string//dataAccount:string
            ADS_COUNT : "ADS_COUNT"
        },
    ];


    return (
        <>
            <div className="app" style={{ padding : 0 }}>
                <div className="wrapper" id="main" style={{ padding : 0 }}>
                    <div className="sc_heading" style={{ padding : 0 }}>
                        <div className="command">
                            <div className="command_head" style={{ backgroundColor : "#023302" }}>
                                <div className="command_flex">
                                    <SearchBar/>
                                </div>
                                <div className="command_flex">

                                    <div className="command_btn" id="btn_export" onClick={handleReloadStorage}>
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
                                    Avatar
                                </th>
                                <th className="sort">ID</th>
                                <th className="sort">Tên Page</th>
                                <th
                                    className="sort"

                                >
                                    Verified
                                </th>
                                <th
                                    className="sort"
                                    onClick={() => handleSortItemNumber("LIKES")}
                                >
                                    Likes
                                </th>

                                <th
                                    className="sort"
                                    style={{ minWidth : "100px" }}
                                    onClick={() => handleSortItemNumber("FOLLOWERS")}
                                >
                                    Followers
                                </th>
                                <th
                                    className="sort"
                                    style={{ minWidth : "70px" }}
                                    onClick={() => handleSortItemNumber("PERMISSION_POST")}
                                >
                                    Quyền đăng
                                </th>
                                <th className="sort" style={{ minWidth : "70px" }}
                                    onClick={() => handleSortItemNumber("ADS")}
                                >
                                    Quảng cáo
                                </th>
                                <th className="sort" style={{ minWidth : "70px" }}

                                >
                                    ADS Count
                                </th>

                            </tr>
                            </thead>
                            <tbody id="tb">
                            {infos.map(( item, key ) => (
                                <tr className="trInfo" key={key}>
                                    <td className="tdInfo">{item.STT}</td>
                                    <td className="tdInfo">
                                        <div className="tbstatus">
                                            <img src={item.AVATAR} alt=""/>
                                        </div>
                                    </td>
                                    <td className="tdInfo"> {item.ID}</td>
                                    <td className="tdInfo"> {item.NAME_PAGE}</td>
                                    <td className="tdInfo"> {item.VERIFIED === "not_verified" ?
                                        <div><NotVerified/></div> : <Verified/>}</td>
                                    <td className="tdInfo"> {item.LIKES}</td>
                                    <td className="tdInfo"> {item.FOLLOWERS}</td>
                                    <td className="tdInfo"> {item.PERMISSION_POST === 1 ? "true" : "false"}</td>
                                    <td className="tdInfo">
                                        <span className="r">{item.ADS === 1 ? 'true' : 'false'}</span>
                                    </td>
                                    <td className="tdInfo">
                                        <span className="r">{item.ADS_COUNT}</span>
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

export default PopupDetailPageSale;