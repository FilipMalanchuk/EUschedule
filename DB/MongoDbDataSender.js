const {google} = require("googleapis");
const mongoose = require("mongoose");
const Group = require("../models/group");
const getDataFromGoogleAPI = require('../GetDataFromGoogleSheets')

// обработка данных из таблицы гугл и отправка
async function sendDataToBD(facult, spreadsheetId){
    const dataFromGoogle = await getDataFromGoogleAPI(spreadsheetId);

    for (let i = 0;i<dataFromGoogle.valueRanges.length;i++){
      let sheetName = (dataFromGoogle.valueRanges[i].range).split("!")[0];
      
      let groupArr = [];// массив данных для отправки
      let len = dataFromGoogle.valueRanges[i].values; // для сокращения и читабельности
      for (let j = 3;j<len.length;j+=3){
        // проверка на превышение массива
        if (j+2>len.length){console.log("ARRAY PROBLEM MONGODBDATASENDER");break}

        let group = dataFromGoogle.valueRanges[i].values[j][2];

        let monday  = [[],[],[]],tuesday = [[],[],[]],wednesday = [[],[],[]],thursday = [[],[],[]],friday = [[],[],[]],saturday = [[],[],[]];
        // заполнение массивов дней по 5 
        for (let a = 3;a <len[j].length;a++){
          if (a < 8) { 
            monday[0].push(len[j][a]);
            monday[1].push(len[j+1][a]);
            monday[2].push(len[j+2][a]);
          }
          else if (a < 13) {
            tuesday[0].push(len[j][a])
            tuesday[1].push(len[j+1][a])
            tuesday[2].push(len[j+2][a])
          }
          else if (a < 18) {
            wednesday[0].push(len[j][a])
            wednesday[1].push(len[j+1][a])
            wednesday[2].push(len[j+2][a])
          }
          else if (a < 23) {
            thursday[0].push(len[j][a])
            thursday[1].push(len[j+1][a])
            thursday[2].push(len[j+2][a])
          }
          else if (a < 28) {
            friday[0].push(len[j][a])
            friday[1].push(len[j+1][a])
            friday[2].push(len[j+2][a])
          }
          else if (a < 33){
            saturday[0].push(len[j][a])
            saturday[1].push(len[j+1][a])
            saturday[2].push(len[j+2][a])
          }
          else console.log("Error, array length too big");
        }
        let groupDataElem = new Group({facult,sheetName,group,monday,tuesday,wednesday,thursday,friday,saturday});
        groupArr.push(groupDataElem);
      }
      // отправка данных
      groupArr.forEach((item => item.save().catch((error)=>console.log(error))));
    }
  }

  module.exports = sendDataToBD;