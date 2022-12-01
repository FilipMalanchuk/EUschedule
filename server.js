// зависимости
const http = require('http');
const express = require("express");
const cors = require("cors");
const {google} = require("googleapis");
const mongoose = require("mongoose");
const getDataFromGoogleAPI = require('./GetDataFromGoogleSheets'); // линк на модуль получения данных из google таблиц
const linksToEU = require("./linksToEU_Schedule"); // линк на ссыки google таблиц
const Group = require("./models/group"); // линк на модель данных для БД
const MongoDBDataSender = require("./DB/MongoDbDataSender");// обработка и отправка данных в БД
const schedule = require ("node-schedule");
const fs = require('fs');
const path = require('path');


// переменные
const app = express();
const port = 3000;
const db = "mongodb+srv://EuStudentsAccess:NGPHmf1XtTmEG5BG@cluster0.k2eug5f.mongodb.net/?retryWrites=true&w=majority"

// база данных
mongoose
  .connect(db,{useNewUrlParser:true, useUnifiedTopology:true})
  .then((res)=> console.log("Connected to DB"))
  .catch((error)=> console.log(error));

const spreadsheetId = "1TfAprksNniXZm2U4_1b2MQ7U1kVlZ5jfrzLv8B3ak9E" // копия ЕУ ФИСТ
const femSpreadsheetId = "1Z4RZBM67qlTvyUDeOkVUqtemCrl3_e7SnESRX_D9TJ4" // копия ЕУ ФЕМ

// иначе будет пустой ответ(на другом url)
app.use(cors());
app.use(express.static(__dirname + "/site"));// настройка для правильного роутинга фронта

app.listen(port,'localhost', (error) => {
    error ? console.log(error) : console.log(`listening port ${port}`);
});



// запуск графика обновлений данных в бд
schedule.scheduleJob("0 * * * *",() => {

  // стираем все данные из БД из FIST
  Group.deleteMany({facult : "FIST"}).then(console.log("data deleted FIST"))
  Group.deleteMany({facult : "FEM"}).then(console.log("data deleted FEM"))
   // обработка и отправка данных в монгоДБ
  MongoDBDataSender("FIST",spreadsheetId);
  MongoDBDataSender("FEM",femSpreadsheetId)
})

// обработка запросов

app.get(['/','/index.html'],async (request,response) => {
  let options = {
    root : path.join(__dirname)
  };
  let fileName = 'index.html';
  response.sendFile(fileName,options)
});

// обработка запросов на данные
app.get('/FIST', async (request, response) => {

  
  async function showData () {
    return await Group.find({}).where('facult').equals("FIST");
  }

   response.json(await showData());
});
app.get('/FEM', async (request, response) => {

  
  async function showData () {
    return await Group.find({}).where('facult').equals("FEM");
  }

   response.json(await showData());
});