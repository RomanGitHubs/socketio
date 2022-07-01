const users = [];
const adjective = ['Неопознанаый', 'Разрушительный', 'Горный', 'Лесной', 'Сосновый', 
    'Вулканический', 'Снежный', 'Добрый', 'Желеный', 'Ледяной', 'Морский', 'Радиоактивный'];
const noun = ['жираф', 'медведь', 'червь', 'бобер', 'барс', 'змей', 'котик', 'пингвин', 'ястреб',
    'волк', 'бегемот', 'крокодил', 'ленивец', 'конь', 'осел', 'лось', 'олень', 'кабан', 'заяц', 'тигр', 'лев', 'дятел', 'паук', 'бандит'];

function getRandomNumber(arr) {
    const length = arr.length - 1;
    console.log(length);
    min = 0;
    max = Math.floor(length)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const addUser = (id, username, room) => {
    const user = { 
        id, 
        username: `${adjective[getRandomNumber(adjective)]} ${noun[getRandomNumber(noun)]}`, 
        room,
    };

    users.push(user);
    return user;
}

const getUser = (id) => {
    return users.find(user => user.id === id);
}

const exitUser = (id) => {
    const index = users.findIndex(user => user.id === id)

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getRoomUsers = (room) => {
    return users
}

module.exports = {
    addUser,
    getUser,
    exitUser,
    getRoomUsers,
}