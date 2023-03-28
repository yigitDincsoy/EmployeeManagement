let currentMode = `read`;
let genreArray = [];

function loadData()
{
    fetch('http://localhost:8888/genre/')
    .then(res=>res.json())
    .then(json=>{

        const divTag = document.querySelector('div#editableTable');
        let html = `<table id="mainTable"><thead><th>Genres</th><th id='hidemeTH'>Update?</th></thead><tbody>`;
        genreArray = [];

        for(const ele of json)
        {
            genreArray.push([ele.GenreId, ele.Name])
            html += `
            <tr>
            <td class='hiddenid'>${ele.GenreId}</td>
            <td>${ele.Name}</td>
            <td class='hidemeTD'><button>Update</button></td>
            </tr>

        
            `; 
        }
        divTag.innerHTML = html + '</tbody></table>';
        hider();
    })



    const elem = document.getElementById('subMenu');
    elem.innerHTML = `asd`;
    let subMenuInner;

    switch (currentMode) {
        case 'read':  subMenuInner = `<p>Thank you for using Genericsoft Chinook Genre Editor <br> You are currently are in the read only mode.</p>`; break
        case 'create': subMenuInner = 
        `<form id="addForm">
        <div class="centerThis">
        <br>
        <label for="Genre">Genre name:</label> 
        <input type="text" id="Genre" name="Genre"><br>
        <br> 
        <button type="button" id="addEmpBut" onclick="addGenre()">Add</button>
        <br>
        </div>
        <br>
      </form>`; break;
        case 'update': subMenuInner = `<p>Thank you for using Genericsoft Chinook Genre Editor <br> You are currently are in the update mode. You can click on any information that you wish to edit.<br> In order to save your changes, please use the "update" button. </p>`;break;
        case 'delete': subMenuInner = `
        <form>
        <br>
        <label for="delSel">Select from the list:</label>
        <select name="delSel" id="delSel">
        </select>
        <button onclick="handleDeleteGenre()">Confirm Deletion</button> 
        </form>
        <br><br><br>
        `;break;
    }

    subMenu.innerHTML = subMenuInner;


    if (currentMode == `delete`) {
        const selectBox = document.getElementById('delSel');
            for (let i = 0; i < genreArray.length; i++) {
                const option = document.createElement('option');   
                option.value = genreArray[i];
                option.innerHTML = genreArray[i];
                selectBox.appendChild(option);  
            }        
    }



}

function addEventListeners()
{
    const cells = document.querySelectorAll('td');
    
    for(const cell of cells)
    {
        cell.addEventListener('click',(e)=>e.target.parentElement.setAttribute('contenteditable',true))
    }
    
    const updateBtns = document.querySelectorAll('button');
    for(const btn of updateBtns)
    {
        btn.addEventListener('click',(e)=>edit(e.target));
    }
}

function edit(e)
{
if (currentMode = 'update') {
    const data = e.parentElement.parentElement.children;
    const empID = data[0].innerText;
    let jsonData = {};
    jsonData['Name'] = data[1].innerText;
    jsonData = JSON.stringify(jsonData);
    fetch('http://localhost:8888/genre/'+ empID,
    {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        method:'put',
        body:jsonData
    })
    loadData();
}
}

loadData();

const optionSelection = document.getElementById("choosenOp");
optionSelection.addEventListener("change", statusUpdater);
function statusUpdater() {
    if (optionSelection.value != currentMode) {
    currentMode = optionSelection.value;
    loadData();
}}

function addGenre(event)
{
    const fd = new FormData(document.getElementById(`addForm`));
    alert(`Operation Complete!`);
    fetch(`http://localhost:8888/newgenre`, {method:`post`, body:fd});
}

function handleDeleteGenre(event)
{

const myData_id = document.getElementById("delSel");
const myData_value = myData_id.value;
const onlyTheID = parseInt(myData_value.split(',')[0]);

fetch('http://localhost:8888/genre/' + onlyTheID,
{
method: 'DELETE',
})

location.reload();




}


function hider()
{
    if (currentMode == `update`) {
     addEventListeners();
    document.getElementById(`hidemeTH`).style.display = "block";
    document.querySelectorAll(".hidemeTD").forEach(x=>x.style.display = "block");

} else {
    document.getElementById(`hidemeTH`).style.display = "none";
    document.querySelectorAll(".hidemeTD").forEach(x=>x.style.display = "none");
}
}


