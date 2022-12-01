const { google } = require("googleapis");
// функция берет id таблицы и возвращает данные видимых листов
async function getDataFromGoogleAPI(spreadsheetId) {
    // авторизация гугл
    const auth = new google.auth.GoogleAuth({
        keyFile: "keys/credencials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });

    const client = await auth.getClient();

    // гугл таблица
    const googleSheets = google.sheets({ version: "v4", auth: client });

    // метаданные таблицы
    var metaData;
    // сюда получаю название листов, данные из которых хочу взять
    var sheetsNames = [];

    // беру мета данные, фильтрую страницы
    async function setMetaData() {
        let Data; // то что возвращаю
        metaData = await googleSheets.spreadsheets.get({
            auth,
            spreadsheetId

        });
        // фильтрую видимые и невидимые страницы
        metaData = (metaData.data.sheets).filter(obj => !obj.properties.hasOwnProperty("hidden"));
        for (let i = 0; i < metaData.length; i++) {
            sheetsNames.push(metaData[i].properties.title)
        }

        Data = (await getData()).data;
        return Data
    }
    // отправляет запрос на получение данных
    async function getData() {
        let Data = await googleSheets.spreadsheets.values.batchGet({
            spreadsheetId: spreadsheetId,
            ranges: sheetsNames,
            majorDimension : "COLUMNS" // можно заменить на ROWS
        })
        return Data;


    }
    return await setMetaData();
}
// експорт getDataFromGoogleAPI
module.exports = getDataFromGoogleAPI;