import React from 'react'
import {Input, Stack} from "@chakra-ui/react";


const SearchBar = () => {
    return (
        <div>
            <Stack bgColor={"white"} borderRadius={5}>
                <Input placeholder='Tìm kiếm' size='md' color={"black"}/>
            </Stack>
        </div>
    )
}
export default SearchBar
