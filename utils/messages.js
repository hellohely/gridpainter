function formatMessage(username, text) {
return {
    username,
    text,
    time: new Date().toLocaleTimeString('sv-SE')
}
}

module.exports = formatMessage;