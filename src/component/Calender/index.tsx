import React, {useState,useEffect,useRef} from 'react'
import {Calendar} from "react-date-range";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { format } from "date-fns";
import styles from "./styles/index.module.scss";
import {Input, Stack} from '@chakra-ui/react';

const CalendarComponent = () => {
    const [calendar,setCalendar] = useState(format(new Date(),'dd-MM-yyyy'));
    const [isOpen,setIsOpen] = useState(false);

    const refCalendar = useRef(null);

    const clickOutside = (event) => {
        if(refCalendar.current && !refCalendar.current.contains(event.target)){
            setIsOpen(false)
        }
    }
    const handleSelectDate = (date) => {
        console.log(date)
        setCalendar(format(date,'dd-MM-yyyy'))
    }

    useEffect(() => {
       document.addEventListener("click",clickOutside,true );
    }, []);

    return (
        <div style={{zIndex:10000000}} className={styles.calenderContainer}>
            <Stack spacing={3}>
                <Input bgColor={"#fff"} className={styles.inputCalendar}   placeholder='small size' size='sm' value={calendar} onClick={()=>setIsOpen(true)}/>
            </Stack>
            <div ref={refCalendar}>
               {
                   isOpen && <Calendar
                    date={new Date()}
                    onChange={handleSelectDate}
                />
               }
           </div>
        </div>
    )
}
export default CalendarComponent;
