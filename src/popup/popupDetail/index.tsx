import React, { useEffect, useState } from "react";
import {
  Center,
  Table,
  TableCaption,
  Th,
  Thead,
  Tr,
  Td,
} from "@chakra-ui/react";
import styles from "./styles/index.module.scss";
import { v4 as uuidv4 } from "uuid";

const PopupDetail = () => {
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataAccount, setDataAccount] = useState([]);
  const [accountID, setAccountID] = useState(null);
  const [infos, setInfos] = useState([]);
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  const Title_Account = [
    {
      STT: "STT",
      DATE: "Ngày tháng",
      DATE_BACKUP: "Ngày Backup",
      COOKIES: "Cookie",
      ID_TKQC: "ID_TKQC",
      THRESHOLD: "Ngưỡng",
      LIMIT: "LIMIT",
      PROFILE_CHROME: "Profile Chrome",
      COUNTRY: "COUNTRY",
      CITY: "CITY",
      IP: "IP",
      NAME_TK: "Tên_TK",
      DEBT: "Dư nợ",
      ADMIN: "ADMIN",
      TOTAL_SPENDING: "Tổng Tiêu",
      PERMISSION_ACCOUNT: "Quyền Tài Khoản",
      CURRENCY: "Tiền tệ",
      ACCOUNT_TYPE: "Loại tài khoản",
      PERMISSION_BM: "Quyền BM",
      ID_BM: "ID BM",
      PAYMENT_METHOD: "PTTT",
      TIME_ZONE: "Múi giờ",
    },
  ];

  const handleGetAccessToken = () => {
    chrome.runtime.sendMessage({ action: "login_request" }, (response) => {
      if (response && response.success) {
        setDataAccount(response.data.data);
        response.accountId.id && setAccountID(response.accountId.id);
        console.log("dataPopup", response.data);
        setAccessToken(response.token.token);
      } else {
        console.error(response.error);
      }
    });
  };
  console.log("accountID", accountID);

  useEffect(() => {
    if (
      typeof dataAccount === "object" &&
      accountID !== null &&
      dataAccount.length > 0
    ) {
      let dataInfos = [];
      console.log("dataAccount", dataAccount);

      for (let i = 0; i < dataAccount.length; i++) {
        dataInfos.push({
          STT: i + 1,
          DATE: formattedDate,
          DATE_BACKUP: "19/11/2023",
          PROFILE_CHROME: "Profile Chrome",
          COUNTRY: "Viet Nam",
          CITY: "Ha Noi",
          IP: "222.252.20.234",
          COOKIES: "Cookie",
          ID_TKQC: dataAccount[i]?.account_id,
          NAME_TK: dataAccount[i]?.name,
          DEBT: dataAccount[i]?.balance,
          THRESHOLD: dataAccount[i]?.adspaymentcycle?.data.map(
            (item) => item.threshold_amount
          ),
          LIMIT: dataAccount[i]?.adtrust_dsl,
          ADMIN: dataAccount[i]?.userpermissions.data.length,
          TOTAL_SPENDING: dataAccount[i]?.amount_spent,
          PERMISSION_ACCOUNT:
            accountID !== null &&
            dataAccount[i]?.userpermissions.data.filter(
              (item) => item?.user?.id === accountID
            )
              ? "ADMIN"
              : "",
          CURRENCY: dataAccount[i]?.currency,
          ACCOUNT_TYPE: "Loại tài khoản",
          PERMISSION_BM: "Quyền BM",
          ID_BM: dataAccount[i]?.owner_business?.id,
          PAYMENT_METHOD: dataAccount[
            i
          ]?.all_payment_methods?.pm_credit_card?.data.map(
            (item) => item?.display_string
          ),
          TIME_ZONE: `${dataAccount[i]?.timezone_offset_hours_utc}  -  ${dataAccount[i]?.timezone_name} `,
          ID: uuidv4(),
        });
      }

      setInfos(dataInfos);
    }
  }, [dataAccount, accountID]);

  useEffect(() => {
    handleGetAccessToken();
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
                style={{ width: "16px" }}
              />
            </div>
            <div
              className="menu"
              id="menu"
              style={{ visibility: "hidden", opacity: 0 }}
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
          <div className="divclose">
            <div className="c_user">
              <i
                className="fa-brands fa-facebook"
                title="Click to copy token"
              ></i>
              <span title="Click to copy link profile">James Linihan</span>
            </div>
            <div
              className="div-btn"
              id="btnreload"
              style={{ pointerEvents: "none", opacity: 0.4 }}
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
                    <input id="tbfilter" type="text" placeholder="Tìm kiếm" />
                  </div>
                </div>
                <div className="command_flex">
                  <div id="btn_currency" className="command_btn">
                    <i className="fa-solid fa-sack-dollar"></i>
                  </div>
                  <div className="command_btn" id="btn_export">
                    <span>Xuất Excel</span>
                    <i className="fa-solid fa-download"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="AccStatus" className="tabcontent active">
            <div className="loaddata1" style={{ display: "none" }}>
              <img
                src="chrome-extension://ookgnahfklmejhicejjbfjifppjbfnlk/access/icon/loadingdata.gif"
                alt=""
              />
            </div>
            <table className="table table-striped" id="tball">
              <thead id="thall">
                <tr>
                  <th className="sort">STT</th>
                  <th className="sort">Trạng thái</th>
                  <th className="sort">ID</th>
                  <th className="sort">Tên TK</th>
                  <th className="sort" style={{ minWidth: "70px" }}>
                    Dư nợ
                  </th>
                  <th className="sort" style={{ minWidth: "70px" }}>
                    Ngưỡng
                  </th>
                  <th className="sort" style={{ minWidth: "70px" }}>
                    Limit
                  </th>
                  <th className="sort" style={{ minWidth: "70px" }}>
                    Đã tiêu
                  </th>
                  <th className="sort">Admin</th>
                  <th className="sort">Quyền TK</th>
                  <th className="sort">Tiền tệ</th>
                  <th className="sort">Loại TK</th>
                  <th className="sort">Role</th>
                  <th className="sort">ID BM</th>
                  <th className="sort">Thanh toán</th>
                  <th className="sort">Múi giờ</th>
                </tr>
              </thead>
              <tbody id="tb">
                {infos.map((item, key) => (
                  <tr className="trInfo" key={key}>
                    <td className="tdInfo">{item.STT}</td>
                    <td className="tdInfo">
                      <div className="tbstatus">
                        <i
                          className="fa-solid fa-circle fa-xs"
                          style={{ color: " #ff0000" }}
                        />
                        dIE
                      </div>
                    </td>
                    <td className="tdInfo"> {item.ID_TKQC}</td>
                    <td className="tdInfo"> {item.NAME_TK}</td>
                    <td className="tdInfo">
                      <span className="r">{item.DEBT}</span>
                    </td>
                    <td className="tdInfo">
                      <span className="r">{item.THRESHOLD}</span>
                    </td>
                    <td className="tdInfo">
                      <span className="r">{item.LIMIT}</span>
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
                    <td className="tdInfo">{item.CURRENCY}</td>

                    <td className="tdInfo">{item.ADMIN}</td>
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
      <div style={{ display: "flex", backgroundColor: "aqua" }}>
        <button onClick={handleGetAccessToken}>Get Access Token</button>
        <p>{accessToken}</p>
      </div>
      <Table className={styles.popupContainer}>
        <TableCaption
          className={styles.optionHeader}
          style={{ fontSize: 30, color: "#000" }}
          placement="top"
        >
          ANALYST DETAIL FACEBOOK
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
              <Th className={styles.optionTitle}>{item.PROFILE_CHROME}</Th>
              <Th className={styles.optionTitle}>{item.COUNTRY}</Th>
              <Th className={styles.optionTitle}>{item.CITY}</Th>
              <Th className={styles.optionTitle}>{item.IP}</Th>
              <Th className={styles.optionTitle}>{item.NAME_TK}</Th>
              <Th className={styles.optionTitle}>{item.DEBT}</Th>
              <Th className={styles.optionTitle}>{item.TOTAL_SPENDING}</Th>
              <Th className={styles.optionTitle}>{item.PERMISSION_ACCOUNT}</Th>
              <Th className={styles.optionTitle}>{item.CURRENCY}</Th>
              <Th className={styles.optionTitle}>{item.ACCOUNT_TYPE}</Th>
              <Th className={styles.optionTitle}>{item.PERMISSION_BM}</Th>
              <Th className={styles.optionTitle}>{item.ADMIN}</Th>
              <Th className={styles.optionTitle}>{item.ID_BM}</Th>
              <Th className={styles.optionTitle}>{item.PAYMENT_METHOD}</Th>
              <Th className={styles.optionTitle}>{item.TIME_ZONE}</Th>
            </Tr>
          ))}
          {infos.map((item, key) => (
            <Tr key={key}>
              <Th className={styles.optionValue} style={{ background: "red" }}>
                {item.STT}
              </Th>
              <Th className={styles.optionValue} style={{ background: "red" }}>
                {item.DATE}
              </Th>
              <Th className={styles.optionValue}>{item.DATE_BACKUP}</Th>
              <Th className={styles.optionValue}>{item.COOKIES}</Th>
              <Th className={styles.optionValue} style={{ background: "red" }}>
                {item.ID_TKQC}
              </Th>
              <Th className={styles.optionValue} style={{ background: "red" }}>
                {item.THRESHOLD}
              </Th>
              <Th className={styles.optionValue} style={{ background: "red" }}>
                {item.LIMIT}
              </Th>
              <Th className={styles.optionValue}>{item.PROFILE_CHROME}</Th>
              <Th className={styles.optionValue}>{item.COUNTRY}</Th>
              <Th className={styles.optionValue}>{item.CITY}</Th>
              <Th className={styles.optionValue}>{item.IP}</Th>
              <Th className={styles.optionValue} style={{ background: "red" }}>
                {item.NAME_TK}
              </Th>
              <Th className={styles.optionValue} style={{ background: "red" }}>
                {item.DEBT} okkkk
              </Th>
              <Th className={styles.optionValue} style={{ background: "red" }}>
                {item.TOTAL_SPENDING} okkkkkk
              </Th>
              <Th className={styles.optionValue} style={{ background: "red" }}>
                {item.PERMISSION_ACCOUNT}
              </Th>
              <Th className={styles.optionValue} style={{ background: "red" }}>
                {item.CURRENCY} okkkkkkk
              </Th>
              <Th className={styles.optionValue}>{item.ACCOUNT_TYPE}</Th>
              <Th className={styles.optionValue}>{item.PERMISSION_BM}</Th>
              <Th className={styles.optionValue} style={{ background: "red" }}>
                {item.ADMIN} okkkkkk
              </Th>
              <Th className={styles.optionValue} style={{ background: "red" }}>
                {item.ID_BM} okkkkkk
              </Th>
              <Th className={styles.optionValue} style={{ background: "red" }}>
                {item.PAYMENT_METHOD}
              </Th>
              <Th className={styles.optionValue} style={{ background: "red" }}>
                {item.TIME_ZONE}
              </Th>
            </Tr>
          ))}
        </Thead>
      </Table>
    </>
  );
};

export default PopupDetail;
