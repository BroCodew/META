import {
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Table,
  TableCaption,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./styles/index.module.scss";
import PopupDetail from "../popupDetail";
const PopupContainer = () => {
  const [detail, setDetail] = useState(null);

  const [size, setSize] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClick = (newSize) => {
    setSize(newSize);
    onOpen();
  };
  const sizes = ["Detail"];
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
      LIMIT: "Limit",
      DETAIL: "DETAIL",
    },
  ];

  const Value_Account = [
    {
      STT: 1,
      DATE: formattedDate,
      DATE_BACKUP: "19/11/2023",
      COOKIES: "Cookie",
      ID_TKQC: ["573216737882876", "573216737882876"],
      THRESHOLD: "20.000.000",
      LIMIT: "1.234.233",
      DETAIL: "DETAIL",
      ID: uuidv4(),
    },
    {
      STT: 1,
      DATE: formattedDate,
      DATE_BACKUP: "19/11/2023",
      COOKIES: "Cookie",
      ID_TKQC: ["573216737882876", "573216737882876"],
      THRESHOLD: "20.000.000",
      LIMIT: "1.234.233",
      DETAIL: "DETAIL",
      ID: uuidv4(),
    },
    {
      STT: 1,
      DATE: formattedDate,
      DATE_BACKUP: "19/11/2023",
      COOKIES: "Cookie",
      ID_TKQC: ["573216737882876", "573216737882876"],
      THRESHOLD: "20.000.000",
      LIMIT: "1.234.233",
      DETAIL: "DETAIL",
      ID: uuidv4(),
    },
  ];

  //   const handleGetAccessToken = async () => {
  //     const result = await FW.generateToken();
  //     const { token } = result;
  //   };

  //   const handleDetailClick = (value) => {
  //     alert(value);
  //     console.log("value", value);
  //   };

  //   useEffect(() => {
  //     handleGetAccessToken();
  //   }, []);
  return (
    <>
      <Table className={styles.optionContainer}>
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
                  <DrawerContent>
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
      </Table>
    </>
  );
};

export default PopupContainer;
