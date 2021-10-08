import "./style.css"
import "bootstrap/dist/css/bootstrap.css"
import "./personFacade"
import personFacade from "./personFacade";


document.getElementById("all-content").style.display = "block"

const SEARCHBYID = document.getElementById("searchPersonById");
const SEARCHBYPHONE = document.getElementById("searchPersonByPhoneNumber");
const SEARCHBYZIP = document.getElementById("searchPersonByZip");
const COUNTWITHHOBBY = document.getElementById("countPersonsWithHobby");
const ADDPHONENUMBER = document.getElementById("addPhoneNumber");

    
function countPersonsWithHobby(hobby) {
  personFacade.countPersonsWithHobby(hobby)
      .then(data => {
        console.log(data);
        document.getElementById("result").innerHTML = `Number of persons with the hobby ${hobby}: ${data.amount}`;
      })
      .catch(err => {
          if (err.status) {
              err.fullError.then(e => document.getElementById("error").innerHTML = JSON.stringify(e));
          }
          else { console.log("Network error"); }
      });
}

function getPersonById(id) {
  
  personFacade.getPersonById(id)
      .then(person => {
        console.log(id)
        const userRows = person.map(persons => `
        <tr>
        <td>${persons.id}</td>
        <td>${persons.firstName}</td>
        <td>${persons.lastName}</td>
        <td>${persons.email}</td>
        `).join("");
        document.getElementById("result").innerHTML = userRows;
      })
      .catch(err => {
          if (err.status) {
              err.fullError.then(e => document.getElementById("error").innerHTML = JSON.stringify(e));
          }
          else { console.log("Network error"); }
      });
}

function getPersonByPhoneNumber(phoneNumber) {
  
  personFacade.getPersonByPhoneNumber(phoneNumber)
      .then(person => {
        console.log(phoneNumber)
        const userRows = person.map(persons => `
        <tr>
        <td>${persons.id}</td>
        <td>${persons.firstName}</td>
        <td>${persons.lastName}</td>
        <td>${persons.email}</td>
        `).join("");
        document.getElementById("result").innerHTML = userRows;
      })
      .catch(err => {
          if (err.status) {
              err.fullError.then(e => document.getElementById("error").innerHTML = JSON.stringify(e));
          }
          else { console.log("Network error"); }
      });
}

function validateInput (event){
  document.getElementById("error").innerHTML = "";
  document.getElementById("result").innerHTML = "";
  const buttonId = event.target.id;
  const inputData = document.getElementById("inputText").value;
  if(inputData == ""){
    console.log("button is clicked - but its empty")
  } else if(buttonId == "searchById"){
    getPersonById(inputData);
  } else if(buttonId == "searchByPhoneNumber"){
    getPersonByPhoneNumber(inputData);
  } else if(buttonId == "searchByZip"){
    getPersonsByZip(inputData);
  } else if (buttonId == "countPersonsWithHobby"){
    countPersonsWithHobby(inputData);
  }
}

function validatePhoneNumber (event){
  event.preventDefault();
  const inputNumber = document.getElementById("addNumber").value;
  const inputDesc = document.getElementById("addDescription").value;
  if (inputNumber == "" || inputDesc == ""){
    alert("Missing input data for phoneNumber or description")
  } else{
    //Updates unsorted list for user display
    let ul = document.getElementById("phoneNumbers");
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(`Phonenumber: ${inputNumber}, Description: ${inputDesc}`));
    ul.appendChild(li);

    //Adds values to hidden attributes for submission
    var phone = {};
    phone.number = inputNumber;
    phone.description = inputDesc;
    var form = document.getElementById("addPersonForm");
    var input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("value", JSON.stringify(phone));
    input.setAttribute("id","addPhoneNumberList");
    //append to form element that you want .
    form.appendChild(input);
  }
}

SEARCHBYID.addEventListener("click", validateInput);
SEARCHBYPHONE.addEventListener("click", validateInput);
COUNTWITHHOBBY.addEventListener("click", validateInput);
ADDPHONENUMBER.addEventListener("click",validatePhoneNumber);


/* START Add Person */
const hobbies = new Map();
function getAllHobbies(){
  personFacade.getHobbyList()
  .then(data => {
    data.all.forEach(hobby => {
      hobbies.set(hobby.name);
    });
    populateSelect(hobbies,"editHobbyName");
    populateSelect(hobbies,"addHobbyName");
  })
  .catch(err => {
      if (err.status) {
          err.fullError.then(e => document.getElementById("error").innerHTML = JSON.stringify(e));
      }
      else { console.log("Network error"); }
  });
}

function populateSelect(map,elementId){
  var select = document.getElementById(elementId);
  map.forEach(e => {
    var el = document.createElement("option");
    if(elementId == "editHobbyName"){
      el.setAttribute("id", e.name);
    }
    
    el.textContent = e.name;
    el.value = e.name;
    select.appendChild(el);
  })
}

  const addPersonForm = document.getElementById("addPersonForm");

  function addPerson(){
    const addFirstName = document.getElementById("addFirstName").value;
    const addLastName = document.getElementById("addLastName").value;
    const addEmail = document.getElementById("addEmail").value;
    const addStreet = document.getElementById("addStreet").value;
    const addAdditionalInfo = document.getElementById("addAdditionalInfo").value;
    const addCity = document.getElementById("addCity").value;
    const addZip = document.getElementById("addZip").value;
    //const addNumber = document.getElementById("addNumber").value;
    //const addDescription = document.getElementById("addDescription").value;
    const phoneList = document.querySelectorAll('#addPhoneNumberList');
    const addHobbyName = document.querySelectorAll('#addHobbyName option:checked');
   
    let selectedPhones = [];
    phoneList.forEach(x=>{
      selectedPhones.push(JSON.parse(x.value));
    });
    console.log(selectedPhones);

    let selectedHobbies = [];

    addHobbyName.forEach(x=>{
      selectedHobbies.push(hobbies.get(x.value));
    });

    console.log(selectedHobbies);

    var person = new Object();
    person.firstName = addFirstName;
    person.lastName = addLastName;
    person.email = addEmail;
    person.phoneList =  selectedPhones;
    person.address = {
      street : addStreet,
      additionalInfo : addAdditionalInfo,
      city : addCity,
      zipCode : addZip,
    };
    person.hobbies = selectedHobbies;
  
    console.log(person);
    personFacade.addPerson(person)
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      if (err.status) {
        err.fullError.then(e => document.getElementById("error").innerHTML = JSON.stringify(e));
    }
    else { console.log("Network error"); }
    });
  }

  addPersonForm.onsubmit = (event) => {
    event.preventDefault();
    addPerson();
  };
  // ####  add person end  ####

function hideAllShowOne(idToShow) {
  document.getElementById("frontpage_html").style = "display:none"
  document.getElementById("addPerson_html").style = "display:none"
  document.getElementById(idToShow).style = "display:block"
}

function menuItemClicked(evt) {
  const id = evt.target.id;
  switch (id) {
    case "addPerson": hideAllShowOne("addPerson_html"),getAllHobbies(); break
    default: hideAllShowOne("frontpage_html"); break
  }
  evt.preventDefault();
}
document.getElementById("menu").onclick = menuItemClicked;
hideAllShowOne("frontpage_html");


