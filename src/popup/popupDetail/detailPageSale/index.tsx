import React, {useEffect, useState} from "react";
import {Stack, Switch} from "@chakra-ui/react";
import {NotVerified} from "../../../static/icon/NotVerified";
import {Verified} from "../../../static/icon/Verified";

const PopupDetailPageSale = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const [dataPageSale, setDataPageSale] = useState([])
    const [accountId, setAccountId] = useState(null)
    const [infos, setInfos] = useState<any>([]);
    const [orderBy, setOrderBy] = useState("DSC")

    const handleGetData = () => {
        chrome.runtime.sendMessage({ action : "login_request" }, (response) => {
            console.log('responsepageSale', response.dataPage.accounts)
            if (response && response.success) {
                setAccountId(response.accountId.id)
                console.log('setDataPageSale', response.dataPage)
                console.log('setDataPageSale', response.dataPage.accounts)
                setDataPageSale(response.dataPage.accounts.data)
            }
        })
    }
    console.log('dataPageSale', dataPageSale)

    const compareData = (a, b, field) => {
        if (a[field] < b[field]) {
            return 1;
        } else if (a[field] > b[field]) {
            return -1;
        } else {
            return 0;
        }
    };


    const handleSortItemNumber = (field) => {

        const compareField = (a, b) => compareData(a, b, field);
        
        setInfos((prevInfos) => {
            const sortedInfos = [...prevInfos].sort(compareField);

            // Nếu đang là ASC, đảo ngược mảng
            if (orderBy === "ASC") {
                sortedInfos.reverse();
                setOrderBy('DSC')
            } else {
                setOrderBy('ASC')

            }

            return sortedInfos;
        });
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
                    PERMISSION_POST : hasPermissionPost,
                    ADS : dataPageSale[i].is_promotable,
                    // ADS_COUNT : dataPageSale
                    ADS_COUNT : ''
                })
            }
            setInfos(dataInfos)

        }

    }

    console.log('infos', infos)
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
                            {infos.map((item, key) => (
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
                                    <td className="tdInfo"> {item.PERMISSION_POST === true ? "true" : "false"}</td>
                                    <td className="tdInfo">
                                        <span className="r">{item.ADS === true ? 'true' : "false"}</span>
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