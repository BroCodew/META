import {format} from "date-fns";

const formatDate =(date) => {
    return format(date, 'dd-MM-yyyy')
}
console.log(formatDate("05-12-2023"))