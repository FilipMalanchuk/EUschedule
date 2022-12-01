let dataFromServer = [];
disableBoth();









// функции 
// меняю опции елемента dataCurs
function changeDataCurs(set) {
	clearDataCurs();

	let elem = document.getElementById("dataCurs");
	let stringToInsert = ``;
	set.forEach((item)=>{
		stringToInsert+= `<option value="${item}">${item}</option>`
	})
	elem.insertAdjacentHTML("beforeend",stringToInsert);
}
// меняю опции елемента groupChoose
function changeGroupChoose(set) {
	clearGroupChoose();

	let elem = document.getElementById("groupChoose");
	let stringToInsert = ``;
	set.forEach((item)=>{
	
		item = item.split("\n")[0]; // обязательно что бы в файле данных группы были написаны следующим образом  "группа *** \n "специальность итд""
		stringToInsert+= `<option value="${item}">${item}</option>`
	})
	elem.insertAdjacentHTML("beforeend",stringToInsert);
}

//----------------------------------------------------------------------------------------

// стираю опции елемента dataCurs
function clearDataCurs(){
	document.getElementById("dataCurs").innerHTML = `<option value="blank"></option>`;
}
// стираю опции елемента dataCurs
function clearGroupChoose(){
	document.getElementById("groupChoose").innerHTML = `<option value="blank"></option>`;
}



// выключаю опции
function disableBoth(){
	document.getElementById("dataCurs").disabled = "disabled";
	document.getElementById("groupChoose").disabled = "disabled";
}
function disableGroupChoose(){
	document.getElementById("groupChoose").disabled = "disabled";
}

// включаю опции
function ableDataCurs(){
	document.getElementById("dataCurs").disabled = false;
}
function ableGroupChoose(){
	document.getElementById("groupChoose").disabled = false;
}



//----------------------------------------------------------------------------------------

// ивент на select facult
document.getElementById("facult").addEventListener("change", (event) => {
	// стирание данных на всякий случай
	clearDataCurs();
	clearData()
	clearGroupChoose();
	disableGroupChoose();
	//проверки
	let val = event.target.value;
	if (val == "blank"){
		disableBoth();
		return
	}
	ableDataCurs();


	// запрос
	fetch(`http://localhost:3000/${val}`)
	.then((response) => response.json())
	.then((data) => dataFromServer = data)
	.then((data) => {
		let set = new Set();
		console.log(dataFromServer)
		for (let i = 0;i < dataFromServer.length;i++){
			set.add(dataFromServer[i].sheetName);
		}

		changeDataCurs(set);
	});

})
// ивент на select dataCurs
document.getElementById("dataCurs").addEventListener("change", (event) => {
	clearData();
	let val = event.target.value;
	//проверки
	if (dataFromServer.length == 0){return};
	if (val == "blank") {
		disableGroupChoose();
		clearGroupChoose();
		return
	}

	ableGroupChoose();

	let set = new Set();

	for (let i = 0;i < dataFromServer.length;i++){
		if (dataFromServer[i].sheetName === val) {
			set.add(dataFromServer[i].group);
		}
	}
	changeGroupChoose(set);
});

// ивент на select groupChoose
document.getElementById("groupChoose").addEventListener("change", (event) => {
	let val = event.target.value;
	//проверки
	if (val == "blank") {
		return
	}
	let selectedCoursDate = document.querySelector("select#dataCurs").value
	let	data = dataFromServer.find((elem) => {
		if (elem.group.split("\n")[0] == val && selectedCoursDate === elem.sheetName) {
			return elem;

		}
	})
	addData(data);
});

//----------------------------------------------------------------------------------------
// добавляю данные на сайт

function addData(object) {
	makeWeekDay(object.monday,"monday")
	makeWeekDay(object.tuesday,"tuesday")
	makeWeekDay(object.wednesday,"wednesday")
	makeWeekDay(object.thursday,"thursday")
	makeWeekDay(object.friday,"friday")
	makeWeekDay(object.saturday,"saturday")
}
function makeWeekDay (array, classToWhere = "no") {
	if (classToWhere == "no"){return}
	let day = document.querySelector(`.${classToWhere}`)
	let lines = document.querySelectorAll(`.${classToWhere} .dataline`);
	
	for(let i = 0;i<lines.length;i++){
		if(array[0][i] === undefined ||array[1][i] === undefined ||array[2][i] === undefined ){break}
		lines[i].children[1].innerHTML = array[0][i];
		lines[i].children[2].innerHTML = array[1][i];
		lines[i].children[3].innerHTML = array[2][i];
		if(array[2][i] == "Zoom"){
			lines[i].children[3].insertAdjacentHTML("afterBegin",`<img src="images/zoom-icon.svg" alt="" class="AudLogo">`)
		}
	}
}

function clearData(){
	document.querySelectorAll(".dataline").forEach((item)=>{
		item.children[1].innerHTML = ""
		item.children[2].innerHTML = ""
		item.children[3].innerHTML = ""

	})
}