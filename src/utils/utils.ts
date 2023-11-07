import { MD5 } from 'crypto-js';

export default {
    sortObj: function (obj) {
        let keys = Object.keys(obj).sort();
        let sortedObj = {};
        for (let i in keys) {
            sortedObj[keys[i]] = obj[keys[i]];
        }
        return sortedObj;
    },

    randBetween: function (min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    md5: function (str) {
        return MD5(str).toString();
    },

    randString: function (limit) {
        limit = limit || 10;
        let text = 'abcdefghijklmnopqrstuvwxyz';
        text = text.charAt(Math.floor(Math.random() * text.length));
        const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < limit - 1; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
};
