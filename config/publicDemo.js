function isPublicWriteAccessEnabled({ configuredValue } = {}) {
    return configuredValue === "true";
}


module.exports = { isPublicWriteAccessEnabled };
