import React, { useEffect, useState } from "react";
import { Center, Table, TableCaption, Th, Thead, Tr,Td } from "@chakra-ui/react";
import styles from "./styles/index.module.scss";
import { v4 as uuidv4 } from "uuid";

const PopupDetail = () => {
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);
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

  const Value_Account = [
    {
      STT: "1",
      DATE: formattedDate,
      DATE_BACKUP: "19/11/2023",
      PROFILE_CHROME: "Profile Chrome",
      COUNTRY: "Viet Nam",
      CITY: "Ha Noi",
      IP: "222.252.20.234",
      COOKIES: "Cookie",
      ID_TKQC: ["573216737882876", "573216737882876"],
      NAME_TK: "NLM - 4019 - MESS VIỆT",
      DEBT: "21.817.727",
      THRESHOLD: "20.000.000",
      LIMIT: "1.234.233",
      TOTAL_SPENDING: "118.568.610",
      PERMISSION_ACCOUNT: "Quản trị viên",
      CURRENCY: "Tiền tệ",
      ACCOUNT_TYPE: "Loại tài khoản",
      PERMISSION_BM: "Quyền BM",
      ID_BM: "372456215074019",
      PAYMENT_METHOD: "Visa · 1604 (9/2027)",
      TIME_ZONE: "-7 | America/Los_Angeles",
      ID: uuidv4(),
    },
  ];

  // const handleGetAccessToken = async () => {
  //   const result = await FW.generateToken();
  //   const { token } = result;
  //   setAccessToken(token);
  // };

  // useEffect(() => {
  //   handleGetAccessToken();
  // }, []);

  const handleGetAccessToken = () => {
    // Bắn yêu cầu lấy token đến background script
    chrome.runtime.sendMessage({ action: 'login_request' }, (response) => {
      if (response && response.success) {
        console.log('resspone',response.token.token);
        
        setAccessToken(response.token.token);
      } else {
        console.error(response.error);
      }
    });
  };

  useEffect(() => {
    handleGetAccessToken()
  },[])

  return (
    <>
    <div style={{display:"flex",backgroundColor:"aqua"}}>

   <button onClick={handleGetAccessToken}>Get Access Token </button>
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
              <Th className={styles.optionTitle}>{item.ID_BM}</Th>

              <Th className={styles.optionTitle}>{item.PAYMENT_METHOD}</Th>
              <Th className={styles.optionTitle}>{item.TIME_ZONE}</Th>
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
              <Th className={styles.optionValue}>{item.PROFILE_CHROME}</Th>
              <Th className={styles.optionValue}>{item.COUNTRY}</Th>
              <Th className={styles.optionValue}>{item.CITY}</Th>
              <Th className={styles.optionValue}>{item.IP}</Th>
              <Th className={styles.optionValue}>{item.NAME_TK}</Th>
              <Th className={styles.optionValue}>{item.DEBT}</Th>
              <Th className={styles.optionValue}>{item.TOTAL_SPENDING}</Th>
              <Th className={styles.optionValue}>{item.PERMISSION_ACCOUNT}</Th>
              <Th className={styles.optionValue}>{item.CURRENCY}</Th>
              <Th className={styles.optionValue}>{item.ACCOUNT_TYPE}</Th>
              <Th className={styles.optionValue}>{item.PERMISSION_BM}</Th>
              <Th className={styles.optionValue}>{item.ID_BM}</Th>
              <Th className={styles.optionValue}>{item.PAYMENT_METHOD}</Th>
              <Th className={styles.optionValue}>{item.TIME_ZONE}</Th>
            </Tr>
          ))}
        </Thead>
      </Table>
    </>
  );
};

export default PopupDetail;
