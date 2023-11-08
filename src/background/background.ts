/*global chrome*/
class HW {
    static async send({ url, method, body = null, headers = {} }) {
        return await (await fetch(url, { method, body, headers })).text().then((responseText) => responseText);
    }
}

class FW {
    static async generateToken() {
        try {
            let adAccountId = null;

            let response = await HW.send({
                method: "GET",
                url: "https://adsmanager.facebook.com/adsmanager/onboarding"
            });

            if (response && response.indexOf('adAccountId: \\"') > 0) {
                adAccountId = response.split('adAccountId: \\"')[1].split('\\"')[0];
            } else {
                response = await HW.send({
                    method: "GET",
                    url: "https://adsmanager.facebook.com/adsmanager/"
                });
                if (response && response.indexOf('adAccountId: \\"') > 0) {
                    adAccountId = response.split('adAccountId: \\"')[1].split('\\"')[0];
                }
            }

            if (!adAccountId) {
                return {
                    token: "ERR",
                    adAccountId: null
                };
            }

            response = await HW.send({
                method: "GET",
                url: `https://adsmanager.facebook.com/adsmanager/onboarding?act=${adAccountId}&breakdown_regrouping=0`
            });

            let token = null;

            if (response && response.indexOf("window.__accessToken") > 0) {
                token = response.split('window.__accessToken="')[1].split('"')[0];
            } else {
                response = await HW.send({
                    method: "GET",
                    url: `https://adsmanager.facebook.com/adsmanager?act=${adAccountId}&breakdown_regrouping=1`
                });

                if (response && response.indexOf("window.__accessToken") > 0) {
                    token = response.split('window.__accessToken="')[1].split('"')[0];
                }
            }

            if (!token) {
                token = "ERR";
                adAccountId = null;
            }
            console.log("token", token);

            return {
                token,
                adAccountId
            };
        } catch (error) {
            return {
                token: "ERR",
                adAccountId: null
            };
        }
    }
}


const getDataAccount = async (token: any) => {
    try {
        const response = await fetch(`https://graph.facebook.com/v15.0/me/adaccounts?fields=account_id,owner_business,name,disable_reason,account_status,currency,adspaymentcycle,account_currency_ratio_to_usd,adtrust_dsl,balance,all_payment_methods{pm_credit_card{display_string,exp_month,exp_year,is_verified}},created_time,next_bill_date,timezone_name,amount_spent,timezone_offset_hours_utc,insights.date_preset(maximum){spend},userpermissions{user,role},owner,is_prepay_account,spend_cap&summary=true&limit=100&access_token=${token}`)
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

const getAccountID = async (token: any) => {
    try {
        const response = await fetch(`https://graph.facebook.com/v15.0/me?access_token=${token}`)
        const data = await response.json();
        console.log('dataBg', data);

        return data;
    } catch (error) {
        console.error(error);
    }
}



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'login_request') {
        (async () => {
            try {
                const token = await FW.generateToken();
                const accountId = await getAccountID(token.token);
                const data = await getDataAccount(token.token);
                sendResponse({ success: true, token, data, accountId });
            } catch (error) {
                sendResponse({ success: false, error: error.message });
            }
        })();
        return true;
    }
});

chrome.action.onClicked.addListener(() => chrome.tabs.create({ url: `chrome-extension://${chrome.runtime.id}/popup.html`, active: true }));