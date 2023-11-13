import React, {useEffect, useState} from "react";
import {Stack, Switch} from "@chakra-ui/react";

const PopupDetailPageSale = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const [dataPageSale, setDataPageSale] = useState([])
    const [accountId, setAccountId] = useState(null)
    const [infos, setInfos] = useState([]);

    const handleGetData = () => {
        chrome.runtime.sendMessage({ action : "login_request" }, ( response ) => {
            console.log('responsepageSale', response.dataPage.accounts)
            if (response && response.success) {
                setAccountId(response.accountId.id)
                setDataPageSale(response.dataPage.accounts.data)
            }
        })
    }

    const handleChangeDataRaw = () => {
        if (typeof dataPageSale === "object" && accountId !== null) {
            let dataInfos = [];
            for (let i = 0; i < dataPageSale.length; i++) {

                dataInfos.push({
                    STT : dataPageSale[i],
                    AVATAR : dataPageSale[i].map(item => item.picture.data.url),
                    ID : dataPageSale[i].map(item => item.ID),
                    NAME_PAGE : dataPageSale[i].map(item => item.name),
                    VERIFIED : dataPageSale[i].map(item => item.verification_status),
                    LIKES : dataPageSale[i].map(item => item.fan_count),
                    FOLLOWERS : dataPageSale[i].map(item => item.followers_count),
                    PERMISSION_POST : dataPageSale[i].map(item => item.roles.data.find(item => item.id === accountId)),
                    ADS : dataPageSale[i].map(item => item.is_promotable),
                    ADS_COUNT : dataPageSale
                })
            }

        }

    }

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
                                    Avatar
                                </th>
                                <th className="sort">ID</th>
                                <th className="sort">Tên Page</th>
                                <th
                                    className="sort"

                                >
                                    Verified
                                </th>
                                <th className="sort">Profile Chrome</th>
                                <th className="sort">IP</th>
                                <th
                                    className="sort"

                                >
                                    Likes
                                </th>

                                <th
                                    className="sort"
                                    style={{ minWidth : "100px" }}

                                >
                                    Followers
                                </th>
                                <th
                                    className="sort"
                                    style={{ minWidth : "70px" }}

                                >
                                    Quyền đăng
                                </th>
                                <th className="sort" style={{ minWidth : "70px" }}

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
                                            {item.THRESHOLD === "NaN" ? "--" : item.THRESHOLD}


                                        </span>
                                    </td>
                                    <td className="tdInfo">
                                        <span className="r">
                                            {item.THRESHOLD === "NaN" ? "--" : item.THRESHOLD}


                                        </span>
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