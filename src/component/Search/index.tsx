import React, {useState} from 'react';
import {Input, Stack} from "@chakra-ui/react";

const SearchBar = ( props: any ) => {
    const { filteredList, setFilteredList, infos } = props;
    const [searchItem, setSearchItem] = useState("");


    const coverValueToSearch = ( value, searchValue ) => {
        return String(value).toLowerCase().includes(String(searchValue).toLowerCase());
    }

    const filterBySearch = ( e ) => {
        const searchTerm = e.target.value;
        setSearchItem(searchTerm);

        if (!searchTerm) {
            // Nếu không có giá trị tìm kiếm, hiển thị lại tất cả dữ liệu ban đầu.
            setFilteredList(infos);
        } else {
            const filteredItems = infos.filter(( item ) => {
                return coverValueToSearch(item.DATE_HOME, searchTerm)
                    || coverValueToSearch(item.ID_TKQC_HOME, searchTerm)
                    || coverValueToSearch(item.NAME_TK_HOME, searchTerm)
                    || coverValueToSearch(item.COOKIES, searchTerm)
                    || coverValueToSearch(item.TOTAL_ACCOUNT_ADS, searchTerm)
                    || coverValueToSearch(item.TOTAL_BM, searchTerm)
                    || coverValueToSearch(item.TOTAL_SPENDING_HOME, searchTerm)
                    || coverValueToSearch(item.TOTAL_THRESHOLD, searchTerm)
                    || coverValueToSearch(item.DEBT_TOTAL, searchTerm)

                    //AD
                    || coverValueToSearch(item.THRESHOLD, searchTerm)
                    || coverValueToSearch(item.STATUS, searchTerm)
                    || coverValueToSearch(item.DATE_AD, searchTerm)
                    || coverValueToSearch(item.IP, searchTerm)
                    || coverValueToSearch(item.PROFILE_CHROME, searchTerm)
                    || coverValueToSearch(item.COUNTRY, searchTerm)
                    || coverValueToSearch(item.CITY, searchTerm)
                    || coverValueToSearch(item.ID_TKQC_AD, searchTerm)
                    || coverValueToSearch(item.NAME_TK_AD, searchTerm)
                    || coverValueToSearch(item.DEBT, searchTerm)
                    || coverValueToSearch(item.THRESHOLD, searchTerm)
                    || coverValueToSearch(item.LIMIT, searchTerm)
                    || coverValueToSearch(item.ADMIN, searchTerm)
                    || coverValueToSearch(item.TOTAL_SPENDING, searchTerm)
                    || coverValueToSearch(item.PERMISSION_ACCOUNT, searchTerm)
                    || coverValueToSearch(item.CURRENCY, searchTerm)
                    || coverValueToSearch(item.ACCOUNT_TYPE, searchTerm)
                    || coverValueToSearch(item.PERMISSION_BM, searchTerm)
                    || coverValueToSearch(item.ID_BM, searchTerm)
                    || coverValueToSearch(item.PAYMENT_METHOD, searchTerm)
                    || coverValueToSearch(item.TIME_ZONE, searchTerm)

                    //BM
                    || coverValueToSearch(item.STATUS_BM, searchTerm)
                    || coverValueToSearch(item.NAME_BM, searchTerm)
                    || coverValueToSearch(item.LEVEL_BM, searchTerm)
                    || coverValueToSearch(item.LIMIT_BM, searchTerm)
                    || coverValueToSearch(item.TIME_BM, searchTerm)
                    || coverValueToSearch(item.TIME_BM, searchTerm)
                    || coverValueToSearch(item.ID_BM, searchTerm)

                    //PageSale
                    || coverValueToSearch(item.AVATAR, searchTerm)
                    || coverValueToSearch(item.ID_BM, searchTerm)
                    || coverValueToSearch(item.NAME_PAGE, searchTerm)
                    || coverValueToSearch(item.VERIFIED, searchTerm)
                    || coverValueToSearch(item.LIKES, searchTerm)
                    || coverValueToSearch(item.FOLLOWERS, searchTerm)
                    || coverValueToSearch(item.PERMISSION_POST, searchTerm)
                    || coverValueToSearch(item.ADS, searchTerm)
                    || coverValueToSearch(item.ADS_COUNT, searchTerm)


            });

            setFilteredList(filteredItems);
        }
    };
    return (
        <div>
            <Stack bgColor={"white"} borderRadius={5}>
                <Input placeholder='Tìm kiếm' size='sm' color={"black"} onChange={filterBySearch}/>
            </Stack>
        </div>
    );
};

export default SearchBar;


