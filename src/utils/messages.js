const formatMessage = (user, msg) => {
    const date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    if (minutes < 10) minutes = `0${minutes}`;
    if (hours < 10) hours = `0${hours}`;

    return {
        user,
        text: msg.message,
        image: msg.dataUrl,
        time: `${hours}:${minutes}`,
    }
}

module.exports = formatMessage;