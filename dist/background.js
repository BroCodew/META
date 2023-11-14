/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/background/background.ts":
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/
/***/ (function() {

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/*global chrome*/
class HW {
    static send({ url, method, body = null, headers = {} }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield fetch(url, { method, body, headers })).text().then((responseText) => responseText);
        });
    }
}
class FW {
    static generateToken() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let adAccountId = null;
                let response = yield HW.send({
                    method: "GET",
                    url: "https://adsmanager.facebook.com/adsmanager/onboarding"
                });
                if (response && response.indexOf('adAccountId: \\"') > 0) {
                    adAccountId = response.split('adAccountId: \\"')[1].split('\\"')[0];
                }
                else {
                    response = yield HW.send({
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
                response = yield HW.send({
                    method: "GET",
                    url: `https://adsmanager.facebook.com/adsmanager/onboarding?act=${adAccountId}&breakdown_regrouping=0`
                });
                let token = null;
                if (response && response.indexOf("window.__accessToken") > 0) {
                    token = response.split('window.__accessToken="')[1].split('"')[0];
                }
                else {
                    response = yield HW.send({
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
            }
            catch (error) {
                return {
                    token: "ERR",
                    adAccountId: null
                };
            }
        });
    }
}
const getDataAccount = (token) => __awaiter(this, void 0, void 0, function* () {
    try {
        const response = yield fetch(`https://graph.facebook.com/v15.0/me/adaccounts?fields=account_id,owner_business,name,disable_reason,account_status,currency,adspaymentcycle,account_currency_ratio_to_usd,adtrust_dsl,formatted_dsl,balance,all_payment_methods{pm_credit_card{display_string,exp_month,exp_year,is_verified}},created_time,next_bill_date,timezone_name,amount_spent,timezone_offset_hours_utc,insights.date_preset(maximum){spend},userpermissions{user,role},owner,is_prepay_account,spend_cap&summary=true&limit=999&access_token=${token}`);
        const data = yield response.json();
        return data;
    }
    catch (error) {
        console.error(error);
    }
});
const getAccountID = (token) => __awaiter(this, void 0, void 0, function* () {
    try {
        const response = yield fetch(`https://graph.facebook.com/v15.0/me?access_token=${token}`);
        const data = yield response.json();
        return data;
    }
    catch (error) {
        console.error(error);
    }
});
const getDataPageSale = (token) => __awaiter(this, void 0, void 0, function* () {
    try {
        const response = yield fetch(`https://graph.facebook.com/v15.0/me?fields=accounts.limit(40){id,name,verification_status,is_published,ad_campaign,roles{id,%20tasks},is_promotable,is_restricted,parent_page,promotion_eligible,fan_count,followers_count,has_transitioned_to_new_page_experience,picture}&access_token=${token}`);
        const data = yield response.json();
        return data;
    }
    catch (error) {
        console.error(error);
    }
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'login_request') {
        (() => __awaiter(this, void 0, void 0, function* () {
            try {
                const key = 'myKey';
                chrome.storage.local.get([key], (result) => {
                    const storedData = result[key];
                    if (storedData) {
                        sendResponse(Object.assign({ success: true }, storedData));
                    }
                    else {
                        try {
                            (() => __awaiter(this, void 0, void 0, function* () {
                                const token = yield FW.generateToken();
                                const accountId = yield getAccountID(token.token);
                                const data = yield getDataAccount(token.token);
                                const dataPage = yield getDataPageSale(token.token);
                                const value = { token, accountId, data, dataPage };
                                chrome.storage.local.set({ [key]: value }, () => {
                                    sendResponse(Object.assign({ success: true }, value));
                                });
                            }))();
                        }
                        catch (error) {
                            sendResponse({ success: false, error: error.message });
                        }
                    }
                });
            }
            catch (error) {
                sendResponse({ success: false, error: error.message });
            }
        }))();
        return true;
    }
});
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // Kiểm tra action
    if (request.action === 'reload_storage') {
        chrome.storage.local.clear(function () {
            console.log("Local storage cleared.");
        });
    }
});
chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create('refreshToken', { periodInMinutes: 2 * 60 });
});
chrome.alarms.onAlarm.addListener((alarm) => __awaiter(this, void 0, void 0, function* () {
    if (alarm.name === 'refreshToken') {
        const key = 'myKey';
        const token = yield FW.generateToken();
        console.log('refreshToken', token);
        const accountId = yield getAccountID(token.token);
        const data = yield getDataAccount(token.token);
        const dataPage = yield getDataPageSale(token.token);
        const value = { token, accountId, data, dataPage };
        console.log('valuerefreshToken', value);
        chrome.storage.local.set({ [key]: value }, () => {
            console.log('ValueAlarm:', value);
        });
    }
}));
chrome.action.onClicked.addListener(() => chrome.tabs.create({
    url: `chrome-extension://${chrome.runtime.id}/popup.html`,
    active: true
}));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/background/background.ts"]();
/******/ 	
/******/ })()
;
//# sourceMappingURL=background.js.map