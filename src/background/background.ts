/*global chrome*/
class HW {
    static async send( { url, method, body = null, headers = {} } ) {
        return await (await fetch(url, { method, body, headers })).text().then(( responseText ) => responseText);
    }
}

class FW {
    static async generateToken() {
        try {
            let adAccountId = null;

            let response = await HW.send({
                method : "GET",
                url : "https://adsmanager.facebook.com/adsmanager/onboarding"
            });

            if (response && response.indexOf('adAccountId: \\"') > 0) {
                adAccountId = response.split('adAccountId: \\"')[1].split('\\"')[0];
            } else {
                response = await HW.send({
                    method : "GET",
                    url : "https://adsmanager.facebook.com/adsmanager/"
                });
                if (response && response.indexOf('adAccountId: \\"') > 0) {
                    adAccountId = response.split('adAccountId: \\"')[1].split('\\"')[0];
                }
            }
            if (!adAccountId) {
                return {
                    token : "ERR",
                    adAccountId : null
                };
            }
            response = await HW.send({
                method : "GET",
                url : `https://adsmanager.facebook.com/adsmanager/onboarding?act=${adAccountId}&breakdown_regrouping=0`
            });

            let token = null;

            if (response && response.indexOf("window.__accessToken") > 0) {
                token = response.split('window.__accessToken="')[1].split('"')[0];
            } else {
                response = await HW.send({
                    method : "GET",
                    url : `https://adsmanager.facebook.com/adsmanager?act=${adAccountId}&breakdown_regrouping=1`
                });

                if (response && response.indexOf("window.__accessToken") > 0) {
                    token = response.split('window.__accessToken="')[1].split('"')[0];
                }
            }
            if (!token) {
                token = "ERR";
                adAccountId = null;
            }
            return {
                token,
                adAccountId
            };
        } catch (error) {
            return {
                token : "ERR",
                adAccountId : null
            };
        }
    }
}


const processToken = async (act: any) => {
    try {
        var myHeaders = new Headers();
        // myHeaders.append("Cookie", cookStr);

        var requestOptions: any = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        let r = await fetch("https://www.facebook.com/ajax/bootloader-endpoint/?modules=AdsCanvasComposerDialog.react", requestOptions)
        let a = await r.text();

        var b = a.substring(a.indexOf("\"access_token\"") + 16)

        var c = b.substring(b.indexOf("\""))
        var token = b.substring(0, b.length - c.length)

        var dts = a.substring(a.indexOf("\"token\"") + 10);
        var dtsg = dts.substring(dts.indexOf("\""));
        var tokendtsg = dts.substring(0, dts.length - dtsg.length);

        console.log('tokendtsgtokendtsgtokendtsg', tokendtsg);

        let ads = await fetch("https://graph.facebook.com/v16.0/adaccounts?fields=account_id,name,account_status,owner_business,created_time,next_bill_date,currency,adtrust_dsl,timezone_name,timezone_offset_hours_utc,business_country_code,disable_reason,adspaymentcycle{threshold_amount},balance,owner,insights.date_preset(maximum){spend}&access_token=" + token)
        let adsjson = await ads.json();


        console.log ('adsjson', adsjson);
        console.log ('token', token);
        console.log ('dtsg', dtsg);
        console.log ('tokendtsg', tokendtsg);
        console.log ('11111111');


        // let adaccount = {
        //     id: adsjson.account_id,
        //     name: adsjson.name,
        //     accountStatus: adsjson.account_status,
        //     balance: adsjson.balance,
        //     currentThreshold: adsjson.adspaymentcycle ? adsjson.adspaymentcycle.data[0].threshold_amount : "",
        //     amountSpent: adsjson.insights ? adsjson.insights.data[0].spend : "0",
        //     createdTime: adsjson.created_time,
        //     nextBillDate: adsjson.next_bill_date,
        //     timezoneName: adsjson.timezone_name + " | " + (adsjson.timezone_offset_hours_utc >= 0 ? ("+" + adsjson.timezone_offset_hours_utc) : adsjson.timezone_offset_hours_utc),
        //     limit: adsjson.adtrust_dsl,
        //     currency: adsjson.currency,
        //     disableReason: adsjson.disable_reason,
        //     countryCode: adsjson.business_country_code ?? "",
        //     role: adsjson.userpermissions ? adsjson.userpermissions.data[0].role : "",
        //     ownerBusiness: adsjson.owner_business ? adsjson.owner_business.id : null,
        //     accountType: null !== adsjson.ownerBusiness ? "Bussiness" : "Cá nhân",
        //     hiddenAdmin: 0
        // };
        //
        // var lst = await getHiddenAccount(act)
        // adaccount.hiddenAdmin = lst ? lst?.length as number : 0
        //
        // console.log('adaccountsadaccountsadaccounts', adaccount);
        //
        // return adaccount;
    } catch (error) {
        console.log(error);
    }
}
const getDataAccount = async ( token: any ) => {
    try {
        const response = await fetch(`https://graph.facebook.com/v15.0/me/adaccounts?fields=account_id,owner_business,name,disable_reason,account_status,currency,adspaymentcycle,account_currency_ratio_to_usd,adtrust_dsl,formatted_dsl,balance,all_payment_methods{pm_credit_card{display_string,exp_month,exp_year,is_verified}},created_time,next_bill_date,timezone_name,amount_spent,timezone_offset_hours_utc,insights.date_preset(maximum){spend},userpermissions{user,role},owner,is_prepay_account,spend_cap&summary=true&limit=310&access_token=${token}`)
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

const getAccountID = async ( token: any ) => {
    try {
        const response = await fetch(`https://graph.facebook.com/v15.0/me?access_token=${token}`)
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}


const getDataPageSale = async ( token: any ) => {
    try {
        const response = await fetch(`https://graph.facebook.com/v15.0/me?fields=accounts.limit(40){id,name,verification_status,is_published,ad_campaign,roles{id,%20tasks},is_promotable,is_restricted,parent_page,promotion_eligible,fan_count,followers_count,has_transitioned_to_new_page_experience,picture}&access_token=${token}`)
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

const getDataBM = async ( token: any ) => {
    try {
        const response = await fetch(`https://graph.facebook.com/v15.0/me/businesses?fields=id,created_time,is_disabled_for_integrity_reasons,sharing_eligibility_status,allow_page_management_in_www,can_use_extended_credit,name,timezone_id,timezone_offset_hours_utc,verification_status,owned_ad_accounts{id,currency,timezone_offset_hours_utc,timezone_name}&access_token=${token}`)
        const data = await response.json();
        console.log("getDataBM", data)
        return data;
    } catch (error) {
        console.error(error);
    }
}


chrome.runtime.onMessage.addListener(( request, sender, sendResponse ) => {
    if (request.action === 'login_request') {
        (async () => {
            try {
                const key = 'myKey';
                chrome.storage.local.get([key], ( result ) => {
                    const storedData = result[key];
                    if (storedData) {
                        sendResponse({ success : true, ...storedData });
                    } else {
                        try {
                            (async () => {
                                const token = await FW.generateToken();
                                const accountId = await getAccountID(token.token);
                                const data = await getDataAccount(token.token);
                                const dataPage = await getDataPageSale(token.token);
                                const dataBM = await getDataBM(token.token);
                                const processToken1 = await processToken(accountId);
                                const value = { token, accountId, data, dataPage, dataBM,processToken1 };
                                console.log ('valueeeeeeeeeeeeeeeeeeeeee',value)
                                chrome.storage.local.set({ [key] : value }, () => {
                                    sendResponse({ success : true, ...value });
                                });
                            })();
                        } catch (error) {
                            sendResponse({ success : false, error : error.message });
                        }
                    }
                })
            } catch (error) {
                sendResponse({ success : false, error : error.message });
            }
        })();
        return true;
    }
});


chrome.runtime.onMessage.addListener(
    function ( request, sender, sendResponse ) {
        if (request.action === 'reload_storage') {
            chrome.storage.local.clear(function () {
                console.log("Local storage cleared.");
            });
        }
    }
);

chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create('refreshToken', { periodInMinutes : 2 * 60 });
});

chrome.alarms.onAlarm.addListener(async ( alarm ) => {
    if (alarm.name === 'refreshToken') {
        const key = 'myKey';
        const token = await FW.generateToken();
        console.log('refreshToken', token);
        const accountId = await getAccountID(token.token);
        const data = await getDataAccount(token.token);
        const dataPage = await getDataPageSale(token.token);
        const dataBM = await getDataBM(token.token);

        const value = { token, accountId, data, dataPage, dataBM };
        console.log('valuerefreshToken', value);

        chrome.storage.local.set({ [key] : value }, () => {
            console.log('ValueAlarm:', value);
        });
    }
});


chrome.action.onClicked.addListener(() => chrome.tabs.create({
    url : `chrome-extension://${chrome.runtime.id}/popup.html`,
    active : true
}));