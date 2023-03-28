let currentMode = `read`;
let employeeArray = [];

function loadEmployees()
{
    fetch('http://localhost:8888/employee/')
    .then(res=>res.json())
    .then(json=>{

        const divTag = document.querySelector('div#editableTable');
        let html = `<table class="striped" id="mainTable"><thead><th>First Name</th><th>Last Name</th><th>Email</th><th>Position</th><th>Phone</th><th id='hidemeTH'>Update?</th></thead><tbody>`;
        employeeArray = [];

        for(const emp of json)
        {
            employeeArray.push([emp.EmployeeId, emp.FirstName + ` ` + emp.LastName])
    

            html += `
            <tr>
            <td class='hiddenid'>${emp.EmployeeId}</td>
            <td>${emp.FirstName}</td>
            <td>${emp.LastName}</td>
            <td>${emp.Email}</td>
            <td>${emp.Title}</td>
            <td>${emp.Phone}</td>
            <td class='hidemeTD'><button>Update</button></td>
            </tr>

        
            `; 
        }
        divTag.innerHTML = html + '</tbody></table>';
        hider();
    })



    const elem = document.getElementById('subMenu');
    let subMenuInner;

    switch (currentMode) {
        case 'read':  subMenuInner = `<p>Thank you for using GenericSoft Employee Management System. <br> You are currently are in the read only mode.</p>`; break
        case 'create': subMenuInner = 
        `<form id="addForm">
        <div class="centerThis">
        <br>
        <label for="FirstName">First name:</label> 
        <input type="text" id="FirstName" name="FirstName"><br>
        <label for="LastName">Last name:</label>
        <input type="text" id="LastName" name="LastName"><br>
        <label for="Email">E-mail Address:</label>
        <input type="text" id="Email" name="Email"><br>
        <label for="Title">Position:</label>
        <input type="Title" id="Title" name="Title"><br>
        <label for="Phone">Phone:</label>
        <input type="Phone" id="Phone" name="Phone">
        <br> 
        <button type="button" id="addEmpBut" onclick="addEmployee()">Add</button>
        <br>
        </div>
        <br>
      </form>`; break;
        case 'update': subMenuInner = `<p>Thank you for using GenericSoft Employee Management System. <br> You are currently are in the update mode. You can click on any information that you wish to edit.<br> In order to save your changes, please use the "update" button. </p>`;break;
        case 'delete': subMenuInner = `
        <form>
        <br>
        <label for="delSel">Select from the list:</label>
        <select name="delSel" id="delSel">
        </select>
        <button onclick="handleDeleteEmp()">Confirm Deletion</button> 
        </form>
        <br><br><br>
        `;break;
    }

    subMenu.innerHTML = subMenuInner;


    if (currentMode == `delete`) {
        const selectBox = document.getElementById('delSel');
            for (let i = 0; i < employeeArray.length; i++) {
                const option = document.createElement('option');   
                option.value = employeeArray[i];
                option.innerHTML = employeeArray[i];
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
    jsonData['FirstName'] = data[1].innerText;
    jsonData['LastName']  = data[2].innerText;
    jsonData['Email']     = data[3].innerText;
    jsonData['Title']     = data[4].innerText;
    jsonData['Phone']     = data[5].innerText;
    jsonData = JSON.stringify(jsonData);
    console.dir(jsonData);
    fetch('http://localhost:8888/employee/'+ empID,
    {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        method:'put',
        body:jsonData
    })
    loadEmployees();
}
}

loadEmployees();

const optionSelection = document.getElementById("choosenOp");
optionSelection.addEventListener("change", statusUpdater);
function statusUpdater() {
    if (optionSelection.value != currentMode) {
    currentMode = optionSelection.value;
    loadEmployees();
}}


function addEmployee(event)
{
    const fd = new FormData(document.getElementById(`addForm`));
    alert(`Operation Complete! ` + fd.get(`FirstName`) + ` ` + fd.get(`LastName`) + ` added as a new employee.`);
    fetch(`http://localhost:8888/newemployee`, {method:`post`, body:fd});
  
}

function handleDeleteEmp(event)
{

const myData_id = document.getElementById("delSel");
const myData_value = myData_id.value;
const onlyTheID = parseInt(myData_value.split(',')[0]);

if (onlyTheID != 3) {
fetch('http://localhost:8888/employee/' + onlyTheID,
{
method: 'DELETE',
})
alert(myData_value.split(',')[1] + ` has been fired!`)
location.reload();

} else {
    alert(`ERROR: YOU CAN'T FIRE YOURSELF FROM THE COMPANY. TRY SOMEONE ELSE.`)
    location.reload();
}


}


function hider()
{
    if (currentMode == `update`) {
     addEventListeners();
    document.getElementById(`hidemeTH`).style.display = "block";
    document.querySelectorAll(".hidemeTD").forEach(a=>a.style.display = "block");

} else {
    document.getElementById(`hidemeTH`).style.display = "none";
    document.querySelectorAll(".hidemeTD").forEach(a=>a.style.display = "none");
}
}


