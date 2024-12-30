"use strict";

// Select input elements and containers
const caloriesNeeded = document.querySelector('.calories_needed');
const caloriesTextInput = document.querySelector('.calories_text_input');
const caloriesInput = document.querySelector('.calories_amount_input');
const tableData = document.querySelector('.table_data');
const cardsContainer = document.querySelector('.cards');

// Select cards for results
const calCard = document.querySelector('.calories_card');
const expCard = document.querySelector('.intake_card');
const balCard = document.querySelector('.remaining_calories_card');

let itemId = 1;
let itemList = JSON.parse(localStorage.getItem("caloriesdetails") || "[]");
renderTransactions()

calCard.textContent = localStorage.getItem("totalcalories")
expCard.textContent = localStorage.getItem("intakecalories");
balCard.textContent = localStorage.getItem("balancecalories");


// Initialize button event listeners
function btnEvents() {
  const calculateBtn = document.querySelector('#btn_calculate');
  const intakeBtn = document.querySelector('#btn_calories_intake');
  const remainingBtn = document.querySelector('#btn_remaining_calories');

  calculateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    popupCalories.classList.add("show")
    // calculateCalories();

  });

  intakeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    caloriesIntake();
  });

  remainingBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showRemainingCalories();
  });
}

document.addEventListener("DOMContentLoaded", btnEvents);

// Function to calculate required calories
function calculateCalories() {
  const caloriesValue = Number(caloriesNeeded.value);
  if (caloriesValue <= 0 || isNaN(caloriesValue)) {
    alert("Please enter a valid calorie requirement.");
  } else {
    // calCard.textContent = caloriesNeeded.value;
    caloriesNeeded.value = "";
    showRemainingCalories();
  }
}

// Function to log calorie intake
function caloriesIntake() {
  const intakeValue = Number(caloriesInput.value);
  const intakeDesc = caloriesTextInput.value;
  if (intakeDesc === "" || isNaN(intakeValue) || intakeValue < 0) {
    alert("Please enter a valid calorie description and amount.");
  } else {

    expCard.textContent = Number(expCard.textContent) + intakeValue;
    localStorage.setItem("intakecalories",expCard.textContent )
    caloriesInput.value = "";
    caloriesTextInput.value = "";
    showRemainingCalories();

    let intake = {
      id: itemId,
      title: intakeDesc,
      amount: intakeValue
    };
    itemList.push(intake);
    itemId = itemList.length + 1; // Set itemId for next intake
    localStorage.setItem("caloriesdetails", JSON.stringify(itemList));
    renderTransactions();
  }
}

// Render logged calorie transactions
function renderTransactions() {
  tableData.innerHTML = ''; // Clear existing transactions
  itemList.forEach((item, index) => {
    item.id = index + 1; // Reassign IDs
    const html = `
            <ul type="none" class="transactions" data-id="${item.id}">
                <li>${item.id}</li>
                <li>${item.title}</li>
                <li><span>kcal</span> ${item.amount}</li>
                <li>
                    <button type="button" class="btn_edit">Edit</button>
                    <button type="button" class="btn_delete">Delete</button>
                </li>
            </ul>`;
    tableData.insertAdjacentHTML("beforeend", html);
  });
  attachEventListeners(); // Attach event listeners to the newly rendered buttons
}

// Attach event listeners to edit and delete buttons
function attachEventListeners() {
  const btnEdit = document.querySelectorAll(".btn_edit");
  const btnDelete = document.querySelectorAll(".btn_delete");

  btnEdit.forEach(button => {
    button.addEventListener('click', (e) => {
      const li = e.target.closest('ul.transactions');
      const id = li.getAttribute('data-id');
      const intake = itemList.find(item => item.id == id);

      if (intake) {
        caloriesTextInput.value = intake.title;
        caloriesInput.value = intake.amount;
        itemList = itemList.filter(item => item.id != id); // Remove the item from the list
        expCard.textContent = Number(expCard.textContent) - intake.amount;
        localStorage.setItem("intakecalories",expCard.textContent)
        showRemainingCalories();
        renderTransactions(); // Re-render transactions with updated IDs
      }
    });
  });

  btnDelete.forEach(button => {
    button.addEventListener('click', (e) => {
      const li = e.target.closest('ul.transactions');
      const id = li.getAttribute('data-id');
      const intake = itemList.find(item => item.id == id);

      if (intake) {
        expCard.textContent = Number(expCard.textContent) - intake.amount;
        localStorage.setItem("intakecalories",expCard.textContent)

        itemList = itemList.filter(item => item.id != id); // Remove the item from the list
        localStorage.setItem("caloriesdetails", JSON.stringify(itemList));
        li.remove(); // Remove the item from the DOM
        showRemainingCalories();
        renderTransactions(); // Re-render transactions with updated IDs
      }
    });
  });
}

// Function to calculate and display remaining calories
function showRemainingCalories() {
  const remaining = parseInt(calCard.textContent) - parseInt(expCard.textContent);
  balCard.textContent = remaining;
  localStorage.setItem("balancecalories",remaining)
}




document.getElementById('popup-calorie-form').addEventListener('submit', function (e) {
  document.getElementById('popup-results').style.display = 'none';

  document.getElementById('popup-loading').style.display = 'block';

  setTimeout(calculateCalories, 2000);

  e.preventDefault();
});

let popupCalories = document.querySelector(".popup-calories");
let popupCancelBtn = document.querySelector(".popup-cancel");

popupCancelBtn.addEventListener("click", (e) => {
  e.preventDefault();
  popupCalories.classList.remove("show");
})


function calculateCalories(e) {

  const age = document.getElementById('popup-age');
  const gender = document.querySelector('input[name="customRadioInline1"]:checked');
  const weight = document.getElementById('popup-weight');
  const height = document.getElementById('popup-height');
  const activity = document.getElementById('popup-list').value;
  const totalCalories = document.getElementById('popup-total-calories');


  if (age.value === '' || weight.value === '' || height.value === '' || 80 < age.value || age.value < 15) {
    errorMessage('Please make sure the values you entered are correct')
  } else if (gender.id === 'male' && activity === "1") {
    totalCalories.value = 1.2 * (66.5 + (13.75 * parseFloat(weight.value)) + (5.003 * parseFloat(height.value)) - (6.755 * parseFloat(age.value)));
  } else if (gender.id === 'male' && activity === "2") {
    totalCalories.value = 1.375 * (66.5 + (13.75 * parseFloat(weight.value)) + (5.003 * parseFloat(height.value)) - (6.755 * parseFloat(age.value)));
  } else if (gender.id === 'male' && activity === "3") {
    totalCalories.value = 1.55 * (66.5 + (13.75 * parseFloat(weight.value)) + (5.003 * parseFloat(height.value)) - (6.755 * parseFloat(age.value)));
  } else if (gender.id === 'male' && activity === "4") {
    totalCalories.value = 1.725 * (66.5 + (13.75 * parseFloat(weight.value)) + (5.003 * parseFloat(height.value)) - (6.755 * parseFloat(age.value)));
  } else if (gender.id === 'male' && activity === "5") {
    totalCalories.value = 1.9 * (66.5 + (13.75 * parseFloat(weight.value)) + (5.003 * parseFloat(height.value)) - (6.755 * parseFloat(age.value)))
      ;
  } else if (gender.id === 'female' && activity === "1") {
    totalCalories.value = 1.2 * (655 + (9.563 * parseFloat(weight.value)) + (1.850 * parseFloat(height.value)) - (4.676 * parseFloat(age.value)));
  } else if (gender.id === 'female' && activity === "2") {
    totalCalories.value = 1.375 * (655 + (9.563 * parseFloat(weight.value)) + (1.850 * parseFloat(height.value)) - (4.676 * parseFloat(age.value)));
  } else if (gender.id === 'female' && activity === "3") {
    totalCalories.value = 1.55 * (655 + (9.563 * parseFloat(weight.value)) + (1.850 * parseFloat(height.value)) - (4.676 * parseFloat(age.value)));
  } else if (gender.id === 'female' && activity === "4") {
    totalCalories.value = 1.725 * (655 + (9.563 * parseFloat(weight.value)) + (1.850 * parseFloat(height.value)) - (4.676 * parseFloat(age.value)));
  } else {
    totalCalories.value = 1.9 * (655 + (9.563 * parseFloat(weight.value)) + (1.850 * parseFloat(height)) - (4.676 * parseFloat(age.value)));
  }

  //to show in main card
  calCard.textContent = Math.round(totalCalories.value)
  // Math.round(totalCalories.value);
  localStorage.setItem("caloriesdetails",[])
  itemList=[]
  expCard.textContent = 0;
  balCard.textContent = 0;
  renderTransactions();
  localStorage.setItem("totalcalories",Math.round(totalCalories.value))
  localStorage.setItem("intakecalories", 0)
  localStorage.setItem("balancecalories", 0)


  document.getElementById('popup-results').style.display = 'block';

  document.getElementById('popup-loading').style.display = 'none';
}

function errorMessage(error) {
  document.getElementById('popup-results').style.display = 'none';

  document.getElementById('popup-loading').style.display = 'none';
  const errorDiv = document.createElement('div');
  const card = document.querySelector('.popup-card');
  const heading = document.querySelector('.popup-heading');
  errorDiv.className = 'popup-alert popup-alert-danger';
  errorDiv.appendChild(document.createTextNode(error));

  card.insertBefore(errorDiv, heading);

  setTimeout(clearError, 4000);
}

function clearError() {
  document.querySelector('.popup-alert').remove();
}




//bmi 





let popupBmi = document.querySelector(".popup-bmi");

const bmi_btn = document.querySelector("#btn_bmi_calculate")
const bmi_cancel_btn = document.querySelector(".bmi-popup-cancel-btn")

bmi_btn.addEventListener("click", (e) => {
  e.preventDefault(); 
  popupBmi.classList.add("show-bmi");
})

bmi_cancel_btn.addEventListener("click", (e) => {
  e.preventDefault();
  popupBmi.classList.remove("show-bmi");
})

window.onload = function () {
  document.getElementById('lbsInput').addEventListener('input', function (e) {
      let lbs = e.target.value;
      document.getElementById('gmInput').value = (lbs / 0.0022046).toFixed(4);
      document.getElementById('kgInput').value = (lbs * 0.453592).toFixed(4);
      document.getElementById('ozInput').value = (lbs * 16).toFixed(4);
  });
  document.getElementById('kgInput').addEventListener('input', function (e) {
      let kg = e.target.value;
      document.getElementById('ozInput').value = (kg * 35.274).toFixed(4);
      document.getElementById('gmInput').value = (kg * 1000).toFixed(4);
      document.getElementById('lbsInput').value = (kg * 2.20462).toFixed(4);
  });
  document.getElementById('gmInput').addEventListener('input', function (e) {
      let gm = e.target.value;
      document.getElementById('ozInput').value = (gm * 0.035274).toFixed(4);
      document.getElementById('kgInput').value = (gm * 0.001).toFixed(4);
      document.getElementById('lbsInput').value = (gm * 0.00220462).toFixed(4);
  });
  document.getElementById('ozInput').addEventListener('input', function (e) {
      let oz = e.target.value;
      document.getElementById('gmInput').value = (oz * 28.3495).toFixed(4);
      document.getElementById('kgInput').value = (oz * 0.0283495).toFixed(4);
      document.getElementById('lbsInput').value = (oz * 0.0625).toFixed(4);
  });
  document.getElementById('cmInput').addEventListener('input', function (e) {
      let cm = e.target.value;
      document.getElementById('mInput').value = (cm * 0.01).toFixed(4);
      document.getElementById('inchInput').value = (cm * 0.393701).toFixed(4);
      document.getElementById('ftInput').value = (cm * 0.032808399).toFixed(4);
  });
  document.getElementById('mInput').addEventListener('input', function (e) {
      let m = e.target.value;
      document.getElementById('cmInput').value = (m * 100).toFixed(4);
      document.getElementById('inchInput').value = (m * 39.3701).toFixed(4);
      document.getElementById('ftInput').value = (m * 3.280841666667).toFixed(4);
  });
  document.getElementById('inchInput').addEventListener('input', function (e) {
      let inch = e.target.value;
      document.getElementById('mInput').value = (inch * 0.02539998984).toFixed(4);
      document.getElementById('cmInput').value = (inch * 2.5399989839999999042).toFixed(4);
      document.getElementById('ftInput').value = (inch * 0.0833333).toFixed(4);
  });
  document.getElementById('ftInput').addEventListener('input', function (e) {
      let ft = e.target.value;
      document.getElementById('mInput').value = (ft * 0.3048000097536).toFixed(4);
      document.getElementById('inchInput').value = (ft * 12).toFixed(4);
      document.getElementById('cmInput').value = (ft * 30.48).toFixed(4);
  });
}
function BMIFunction() {
  var oz = document.getElementById('ozInput').value
  var gm = document.getElementById('gmInput').value
  var kg = document.getElementById('kgInput').value
  var lbs = document.getElementById('lbsInput').value
  var m = document.getElementById('mInput').value
  var inc = document.getElementById('inchInput').value
  var cm = document.getElementById('cmInput').value
  var ft = document.getElementById('ftInput').value
  if (oz == "" || gm == "" || kg == "" || lbs == "") {
      alert("Please enter at least 1 weight value.");
  }
  else if (m == "" || inc == "" || cm == "" || ft == "") {
      alert("Please enter at least 1 height value.");
  }
  else {
      var meters = document.getElementById('mInput').value;
      var kilograms = document.getElementById('kgInput').value;
      var bmi = document.getElementById('bmi')
      var calIn = document.getElementById('calIn')
      var calOut = document.getElementById('calOut')
      var comment = document.getElementById('comment')
      var bmiValue = (kilograms / (meters * meters)).toFixed(2)
      calOut.innerHTML = "Your Minimum Calorie Burn should be " + ((kilograms / (meters * meters)) * (120)).toFixed(2).bold();
      bmi.innerHTML = "Your Body Mass Index is " + bmiValue.bold();
      calIn.innerHTML = "Your Minimum Calorie Intake should be " + ((kilograms / (meters * meters)) * (150)).toFixed(2).bold();
      if (bmiValue < 18.5) {
          comment.innerHTML = "You are underweight. Consult a doctor!";
      }
      else if (bmiValue > 24.9 && bmiValue < 30) {
          comment.innerHTML = "You are overweight. Consult a doctor!";
      }
      else if (bmiValue > 29.9) {
          comment.innerHTML = "You are obese. It's an alarming health situation. Go to the doctor!";
      }
      else {
          comment.innerHTML = "You're okay but a little workout never hurt anybody!";
      }
  }
}
