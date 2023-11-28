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


const processToken = async () => {
    try {
        console.log('111111111')
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
        return tokendtsg;
        console.log('tokendtsgtokendtsgtokendtsg', tokendtsg);

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

chrome.runtime.onStartup.addListener(() => {
    processToken();
});

// Sự kiện khi tab được cập nhật (reload)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Kiểm tra xem trạng thái cập nhật có chứa "complete" hay không
    if (changeInfo.status === 'complete') {
        processToken();
    }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === "process") {
        try {
            const apiData = await processToken();
            console.log('API Data:', apiData);

            // Gửi kết quả API về popup hoặc content script
            sendResponse({ success: true, data: apiData });
        } catch (error) {
            console.error('Error calling API:', error);

            // Gửi lỗi về popup hoặc content script
            sendResponse({ success: false, error: error.message });
        }
    }
    // Trả về true để thông báo rằng bạn sẽ gọi sendResponse sau này (bất đồng bộ)
    return true;
});


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

// chrome.runtime.onMessage.addListener((request, sender,sendResponse) => {
//     if (request.action === "process"){
//         (async ()=> {
//             try {
//                 (async() => {
//                     const process = await  processToken();
//                     console.log('processBGGGG',process);
//                 })
//             }
//             catch{
//                 console.log('error');
//             }
//         })
//         return true;
//     }
// })


// chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
//     if (request.action === "process") {
//         try {
//             const result = await processToken();
//             console.log('processBGGGG', result);
//             sendResponse({ success: true, data: result });
//         } catch (error) {
//             console.log('error', error);
//             sendResponse({ success: false, error: error.message });
//         }
//         return true;
//     }
// });
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
                                const tokenFacebook = await processToken();
                                const value = { token, accountId, data, dataPage, dataBM,tokenFacebook };
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