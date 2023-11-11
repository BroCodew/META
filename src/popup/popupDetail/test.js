const handleSortPaymentMethod = (field) => {

    if (orderBy === "ASC") {
        setInfos(infos.sort((a, b) => compare({
            ...a,
            PAYMENT_METHOD: typeof a.PAYMENT_METHOD === "string" ? a.PAYMENT_METHOD : "a",
        }, {
            ...b,
            PAYMENT_METHOD: typeof b.PAYMENT_METHOD === "string" ? b.PAYMENT_METHOD : "a",

        }, field)).reverse());
        setOrderBy("DSC");
    }
    if (orderBy === "DSC") {
        setInfos(infos.sort((a, b) => compare({
            ...a,
            PAYMENT_METHOD: typeof a.PAYMENT_METHOD === "string" ? a.PAYMENT_METHOD : "a",
        }, {
            ...b,
            PAYMENT_METHOD: typeof b.PAYMENT_METHOD === "string" ? b.PAYMENT_METHOD : "a",

        }, field)));
        setOrderBy("ASC");
    }
};

const valuePaymentMethods = ["qưeqwe", undefined, "ewrer", "sf"]

handleSortPaymentMethod(valuePaymentMethods)