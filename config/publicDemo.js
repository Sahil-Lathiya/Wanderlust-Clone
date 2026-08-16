function isPublicWriteAccessEnabled({ isProduction, configuredValue } = {}) {
    if (!isProduction) return true;
    return configuredValue === "true";
}


module.exports = { isPublicWriteAccessEnabled };
