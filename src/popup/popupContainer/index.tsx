import {Button} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {v4 as uuidv4} from "uuid";
import styles from "./styles/index.module.scss";
import {useNavigate, useParams} from "react-router-dom";

const PopupContainer = () => {

    const [detailParam, setDetailParam] = useState(null);
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    const navigate = useNavigate();
    let { id } = useParams();

    console.log('idParam', id)


    const handleNavigateDetail = () => {
        setDetailParam(cookieFake.c_user)

    };

    useEffect(() => {
        // Kiểm tra nếu detailParam có giá trị thì thực hiện chuyển trang
        if (detailParam) {
            navigate(`/popup.html/detail/${detailParam}`);
        }
    }, [detailParam]);


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

    const Title_Account =
        {
            STT : "STT",
            DATE : "Ngày tháng",
            DATE_BACKUP : "Ngày Backup",
            COOKIES : "Cookie",
            ID_TKQC : "ID_TKQC",
            THRESHOLD : "Ngưỡng",
            LIMIT : "Limit",
            DETAIL : "DETAIL",
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
                                <th className="sort">DATE</th>
                                <th className="sort">COOKIES</th>
                                <th className="sort">ID</th>
                                <th className="sort">Tên TK</th>
                                <th className="sort" style={{ minWidth : "100px" }}>
                                    Dư nợ
                                </th>
                                <th className="sort" style={{ minWidth : "70px" }}>
                                    Ngưỡng
                                </th>
                            </tr>
                            </thead>
                            <tbody id="tb">
                            {Value_Account.map(( item, key ) => (
                                <tr className="trInfo" key={key}>
                                    <td className="tdInfo">{item.STT}</td>

                                    <td className="tdInfo"> {item.DATE}</td>
                                    <td className="tdInfo"> {item.COOKIES}</td>

                                    <td className="tdInfo"> {item.ID_TKQC}</td>
                                    <td className="tdInfo"></td>
                                    <td className="tdInfo">
                                        <span className="r">{item.THRESHOLD}</span>
                                    </td>
                                    <td className="tdInfo">
                                        <span className="r">{item.LIMIT}</span>
                                    </td>
                                    <td className={styles.optionValue}>

                                        <Button
                                            onClick={handleNavigateDetail}
                                            m={4}
                                            className={styles.optionButton}
                                        >{`Open Detail Cookie`}</Button>

                                        {/*<Drawer onClose={onClose} isOpen={isOpen} size={size}>*/}
                                        {/*    <DrawerOverlay/>*/}
                                        {/*    <DrawerContent style={{ overflow : "scroll" }}>*/}
                                        {/*        <DrawerCloseButton/>*/}
                                        {/*        <DrawerHeader>{`${size} drawer contents`}</DrawerHeader>*/}
                                        {/*        <DrawerBody className={styles.optionDrawer}>*/}
                                        {/*            <PopupDetail/>*/}
                                        {/*        </DrawerBody>*/}
                                        {/*    </DrawerContent>*/}
                                        {/*</Drawer>*/}
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
