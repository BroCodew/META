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


const getDataAccount = async (token:any) => {
    try {
        const response = await fetch(`https://graph.facebook.com/v18.0/me?access_token=${token}&fields=adaccounts.limit(10)%7Baccount_id%2Caccount_status%2Cbalance%2Ccurrency%2Ccreated_time%2Cspend_cap%2Camount_spent%2Ctimezone_name%2Ctimezone_id%2Cthreshold_amount%2Cadplayables%7D&format=json`);
        const data = await response.json();
        console.log('getInforAccount',data);
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
                console.log('tokenDataBg', token);
                const data = await getDataAccount(token.token);
                console.log('data', data);
                sendResponse({ success: true, token });
            } catch (error) {
                sendResponse({ success: false, error: error.message });
            }
        })();
        return true;
    }
});

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === 'login_request') {
//         try {
//             FW.generateToken().then((token) => {
//                 console.log('tokenDataBg', token);
//                 const data =  getDataAccount(token.token)
//                 console.log('data', data);
                
//                 sendResponse({ success: true, token })
//             });
//         } catch (error) {
//             sendResponse({ success: false, error: error.message });
//         }

//         return true;
//     }
// });