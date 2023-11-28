async function getNewLimit(fbdt, act) {
    var origin = window.location.origin;
    var url = `${origin}/api/graphql`;
    let formData = new FormData();

    formData.append("fb_dtsg", fbdt);
    formData.append("doc_id", "6401661393282937");
    formData.append("variables", `{"assetID":${act}}`);
    let res = await reqAPI(url, "POST", formData);
    try {
        let formatted_dsl = res.split('"formatted_dsl":"')[1].split('",')[0];
        var newlimit = formatted_dsl
        .replace(/\\u[\dA-Fa-f]{4}/g, "")
        .replace(/[^\d]/g, "");
        return Number(newlimit);
    } catch (error) {
        return "-";
    }
}