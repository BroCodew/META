const request = require('request-promise');
const fs = require('fs');
let GetCookie = async function(){
    var headers = {
        'authority': 'm.facebook.com',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'en',
        'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
    };

    var options = {
        url: 'https://m.facebook.com/login/device-based/regular/login/?refsrc=deprecated&lwv=100',
        method:'GET',
        headers,
        resolveWithFullResponse:true,
    };
    let response = await request(options);
    let cookie = response.headers['set-cookie'].reduce((previous,current)=>previous+=current.split(';')[0]+';','');
    let startS = '"dtsg":{"token":"';
    let endS = '"';
    let fb_dtsg = response.body.match(new RegExp('(?<=' + startS + '+).*?(?=' + endS + ')',"gs"))[0];
    let startS2 = 'name="lsd" value="';
    let endS2 = '"';
    let lsd = response.body.match(new RegExp('(?<=' + startS2 + '+).*?(?=' + endS2 + ')',"gs"))[0];
    return {cookie,fb_dtsg,lsd}
};
let LoginWithPass = async (username,password,{cookie,fb_dtsg,lsd},proxy)=>{
    try{
        var headers = {
            'authority': 'm.facebook.com',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
            'cache-control': 'max-age=0',
            'content-type': 'application/x-www-form-urlencoded',
            cookie,
            'origin': 'https://m.facebook.com',
            'referer': 'https://m.facebook.com/login/',
            'sec-ch-prefers-color-scheme': 'dark',
            'sec-ch-ua': '""',
            'sec-ch-ua-full-version-list': '""',
            'sec-ch-ua-mobile': '?1',
            'sec-ch-ua-platform': '""',
            'sec-ch-ua-platform-version': '""',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Mobile; Nokia 6300 4G; rv:48.0) Gecko/48.0 Firefox/48.0 KAIOS/2.5.4 PodLP/1.5.2.0'
        };

        
        var options = {
            url: 'https://m.facebook.com/login/device-based/regular/login/?refsrc=deprecated&lwv=100',
            method: 'POST',
            headers,
            form:{
                lsd,
                'jazoest': '2850',
                'm_ts': '1692843730',
                'try_number': '0',
                fb_dtsg,
                'unrecognized_tries': '0',
                'email': username,
                'pass': password,
                'login': 'Đăng nhập',
                'bi_xrwh': '0'
            }
        };
        if(proxy) options.proxy = 'http://'+proxy;
        await request(options);
        return null;
    }catch(error){
        return error.response.headers['set-cookie'].reduce((previous,current)=>previous+=current.split(';')[0]+';','')
    }
};
let GetCookieOTP = async function(cookie){

    var headers = {
        'authority': 'm.facebook.com',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'en',
        cookie,
        'dpr': '1',
        'referer': 'https://m.facebook.com/login/device-based/regular/login/?refsrc=deprecated&lwv=100',
        'sec-ch-prefers-color-scheme': 'dark',
        'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
        'sec-ch-ua-full-version-list': '"Chromium";v="116.0.5845.97", "Not)A;Brand";v="24.0.0.0", "Google Chrome";v="116.0.5845.97"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-model': '""',
        'sec-ch-ua-platform': '"Windows"',
        'sec-ch-ua-platform-version': '"10.0.0"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
        'viewport-width': '791'
    };

    var options = {
        url: 'https://m.facebook.com/checkpoint/?__req=4',
        headers,
        method:'GET',
        resolveWithFullResponse:true
    };
    let response = await request(options);
    cookie = response.headers['set-cookie'].reduce((previous,current)=>previous+=current.split(';')[0]+';','') + cookie;
    let startS = '"dtsg":{"token":"';
    let endS = '"';
    let fb_dtsg = response.body.match(new RegExp('(?<=' + startS + '+).*?(?=' + endS + ')',"gs"))[0];
    let startS2 = 'name="nh" value="';
    let endS2 = '"';
    let nh = response.body.match(new RegExp('(?<=' + startS2 + '+).*?(?=' + endS2 + ')',"gs"))[0];
    return {cookie,fb_dtsg,nh}

};
let ConfirmOTP = async function({cookie,fb_dtsg,nh},code){

    var headers = {
        'authority': 'm.facebook.com',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'en',
        'cache-control': 'max-age=0',
        'content-type': 'application/x-www-form-urlencoded',
        cookie,
        'dpr': '1',
        'origin': 'https://m.facebook.com',
        'referer': 'https://m.facebook.com/checkpoint/?__req=4',
        'sec-ch-prefers-color-scheme': 'dark',
        'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
        'sec-ch-ua-full-version-list': '"Chromium";v="116.0.5845.97", "Not)A;Brand";v="24.0.0.0", "Google Chrome";v="116.0.5845.97"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-model': '""',
        'sec-ch-ua-platform': '"Windows"',
        'sec-ch-ua-platform-version': '"10.0.0"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
        'viewport-width': '791'
    };


    var options = {
        url: 'https://m.facebook.com/login/checkpoint/',
        method: 'POST',
        headers,
        form:{
           fb_dtsg,

           'jazoest': '2866',
           'checkpoint_data': '',
           'approvals_code': code,
           'codes_submitted': '0',
           'submit[Submit Code]': 'Gửi mã',
           nh
       },
       resolveWithFullResponse:true
   };

   let response = await request(options);
   cookie = response.headers['set-cookie'].reduce((previous,current)=>previous+=current.split(';')[0]+';','') + cookie;
   return cookie;
};
let ConvertOTP = async function(secretKey){
    secretKey = secretKey.replace(/ /g,'');
    var headers = {
        'authority': '2fa.live',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'en,vi-VN;q=0.9,vi;q=0.8,fr-FR;q=0.7,fr;q=0.6,en-US;q=0.5',
        'cache-control': 'max-age=0',
        'cookie': '_gcl_au=1.1.2105659409.1682514124; _ga=GA1.2.363850197.1682514124; _gid=GA1.2.2104782520.1684576892',
        'if-none-match': 'W/"12-jujg2RzAND81flonq2ibIU0jLmw"',
        'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
    };

    var options = {
        url: 'https://2fa.live/tok/'+secretKey,
        headers,
        method:'GET'
    };
    let responseText = await request(options);
    let {token} = JSON.parse(responseText);
    return token;
};
let GetConfigDevice = async function(cookie){
    var headers = {
        'authority': 'm.facebook.com',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'en',
        'cache-control': 'max-age=0',
        cookie,
        'dpr': '1',
        'sec-ch-prefers-color-scheme': 'dark',
        'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
        'sec-ch-ua-full-version-list': '"Chromium";v="116.0.5845.110", "Not)A;Brand";v="24.0.0.0", "Google Chrome";v="116.0.5845.110"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-model': '""',
        'sec-ch-ua-platform': '"Windows"',
        'sec-ch-ua-platform-version': '"10.0.0"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
        'viewport-width': '791'
    };

    var options = {
        url: 'https://m.facebook.com/login/checkpoint/',
        headers,
        method:'GET',
        resolveWithFullResponse:true

    };
    let response = await request(options);
    cookie = response.headers['set-cookie'].reduce((previous,current)=>previous+=current.split(';')[0]+';','') + cookie;
    let startS = '"dtsg":{"token":"';
    let endS = '"';
    let fb_dtsg = response.body.match(new RegExp('(?<=' + startS + '+).*?(?=' + endS + ')',"gs"))[0];
    let startS2 = 'name="nh" value="';
    let endS2 = '"';
    let nh = response.body.match(new RegExp('(?<=' + startS2 + '+).*?(?=' + endS2 + ')',"gs"))[0];

    return {cookie,fb_dtsg,nh}

};
let GetConfigCheckpoint = async function(cookie){
    var headers = {
        'authority': 'm.facebook.com',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'en',
        'cache-control': 'max-age=0',
        cookie,
        'dpr': '1',
        'sec-ch-prefers-color-scheme': 'dark',
        'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
        'sec-ch-ua-full-version-list': '"Chromium";v="116.0.5845.110", "Not)A;Brand";v="24.0.0.0", "Google Chrome";v="116.0.5845.110"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-model': '""',
        'sec-ch-ua-platform': '"Windows"',
        'sec-ch-ua-platform-version': '"10.0.0"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
        'viewport-width': '791'
    };

    var options = {
        url: 'https://m.facebook.com/login/checkpoint/',
        headers,
        method:'GET',
        resolveWithFullResponse:true
    };
    let response = await request(options);
    cookie = response.headers['set-cookie'].reduce((previous,current)=>previous+=current.split(';')[0]+';','') + cookie;
    let startS = '"dtsg":{"token":"';
    let endS = '"';
    let fb_dtsg = response.body.match(new RegExp('(?<=' + startS + '+).*?(?=' + endS + ')',"gs"))[0];
    let startS2 = 'name="nh" value="';
    let endS2 = '"';
    let nh = response.body.match(new RegExp('(?<=' + startS2 + '+).*?(?=' + endS2 + ')',"gs"))[0];

    return {cookie,fb_dtsg,nh}

};
let PassRecentLogin = async function({cookie,fb_dtsg,nh}){
    var headers = {
        'authority': 'm.facebook.com',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'en',
        'cache-control': 'max-age=0',
        'content-type': 'application/x-www-form-urlencoded',
        'dpr': '1',
        cookie,
        'origin': 'https://m.facebook.com',
        'referer': 'https://m.facebook.com/login/checkpoint/',
        'sec-ch-prefers-color-scheme': 'dark',
        'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
        'sec-ch-ua-full-version-list': '"Chromium";v="116.0.5845.110", "Not)A;Brand";v="24.0.0.0", "Google Chrome";v="116.0.5845.110"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-model': '""',
        'sec-ch-ua-platform': '"Windows"',
        'sec-ch-ua-platform-version': '"10.0.0"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
        'viewport-width': '791'
    };


    var options = {
        url: 'https://m.facebook.com/login/checkpoint/',
        method: 'POST',
        headers,
        form:{
           fb_dtsg,
           'jazoest': '21022',
           'checkpoint_data': '',
           'submit[This was me]': 'Đây là tôi',
           nh
       },
       resolveWithFullResponse:true
   };
   let response = await request(options);
   cookie = response.headers['set-cookie'].reduce((previous,current)=>previous+=current.split(';')[0]+';','') + cookie;
   return cookie;
};
let PassCheckpoint = async function({cookie,fb_dtsg,nh}){

    var headers = {
        'authority': 'm.facebook.com',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'en',
        'cache-control': 'max-age=0',
        'content-type': 'application/x-www-form-urlencoded',
        cookie,
        'dpr': '1',
        'origin': 'https://m.facebook.com',
        'referer': 'https://m.facebook.com/login/checkpoint/',
        'sec-ch-prefers-color-scheme': 'dark',
        'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
        'sec-ch-ua-full-version-list': '"Chromium";v="116.0.5845.110", "Not)A;Brand";v="24.0.0.0", "Google Chrome";v="116.0.5845.110"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-model': '""',
        'sec-ch-ua-platform': '"Windows"',
        'sec-ch-ua-platform-version': '"10.0.0"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
        'viewport-width': '791'
    };


    var options = {
        url: 'https://m.facebook.com/login/checkpoint/',
        method: 'POST',
        headers,
        form:{
            fb_dtsg,
            'jazoest': '21042',
            'checkpoint_data': '',
            'submit[Continue]': 'Tiếp tục',
            nh
        },
        resolveWithFullResponse:true
    };
    let response = await request(options);

    if(response.body.includes('name="submit[This was me]"')){
        cookie = response.headers['set-cookie'].reduce((previous,current)=>previous+=current.split(';')[0]+';','') + cookie;
        let startS = '"dtsg":{"token":"';
        let endS = '"';
        let fb_dtsg = response.body.match(new RegExp('(?<=' + startS + '+).*?(?=' + endS + ')',"gs"))[0];
        let startS2 = 'name="nh" value="';
        let endS2 = '"';
        let nh = response.body.match(new RegExp('(?<=' + startS2 + '+).*?(?=' + endS2 + ')',"gs"))[0];
        cookie = await PassRecentLogin({cookie,nh,fb_dtsg});
        return await PassDevice(cookie);
    }

};
let SaveDevice = async function({cookie,fb_dtsg,nh}){
    try{
        var headers = {
            'authority': 'm.facebook.com',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-language': 'en',
            'cache-control': 'max-age=0',
            'content-type': 'application/x-www-form-urlencoded',
            cookie,
            'dpr': '1',
            'origin': 'https://m.facebook.com',
            'referer': 'https://m.facebook.com/login/checkpoint/',
            'sec-ch-prefers-color-scheme': 'dark',
            'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
            'sec-ch-ua-full-version-list': '"Chromium";v="116.0.5845.97", "Not)A;Brand";v="24.0.0.0", "Google Chrome";v="116.0.5845.97"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-model': '""',
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua-platform-version': '"10.0.0"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
            'viewport-width': '791'
        };

        var options = {
            url: 'https://m.facebook.com/login/checkpoint/',
            method: 'POST',
            headers,
            form:{
                fb_dtsg,
                'jazoest': '21069',
                'checkpoint_data': '',
                'name_action_selected': 'save_device',
                'submit[Continue]': 'Tiếp tục',
                nh
            },
            resolveWithFullResponse:true

        };
        let response = await request(options);
        if(response.body.includes('name="submit[Continue]"')){
           cookie = response.headers['set-cookie'].reduce((previous,current)=>previous+=current.split(';')[0]+';','') + cookie;
           let config_checkpoint = await GetConfigCheckpoint(cookie);
           await PassCheckpoint(config_checkpoint)
       }
       return null;
   }catch(error){
   
    return error.response.headers['set-cookie'].reduce((previous,current)=>previous+=current.split(';')[0]+';','');
}

};
let PassDevice = async function(cookie){
   let sa = await GetConfigDevice(cookie);
   sa.cookie = sa.cookie + cookie;

   let cookie_result = await SaveDevice(sa);
   return cookie_result
};
(async ()=>{
    let username = '';
    let password = '';
    let secretKey = 'ZQEK 6T3V VL3J B2UZ L2PT ZXNE PSVQ CIRA';
    let proxy = null;
    let f = await GetCookie();

    let cookie_login = await LoginWithPass(username,password,f,proxy);
    if(cookie_login === null){
        throw 'Mật khẩu sai';
    }else if(cookie_login.includes('checkpoint')){
        let cookie = f.cookie + cookie_login;
        let s = await GetCookieOTP(cookie);
        let otp = await ConvertOTP(secretKey);
        let cookie_confirm = await ConfirmOTP(s,otp);
        cookie = cookie_confirm + cookie;
        let cookie_result = await PassDevice(cookie);
        console.log(cookie_result);

        
    }else{
        console.log(cookie_login);
    }
})();