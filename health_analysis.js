
// Retrieve DOM elements for interaction
const addPatientButton = document.getElementById('addPatient'); // Button to add a new patient
const report = document.getElementById('report'); // Display area for the report
const result = document.getElementById('result'); // Display area for the search result
const btnSearch = document.getElementById('btnSearch'); // Button for searching patients

// Array to store patient data
const patients = [];

// Initialize input fields
const nameInput = document.getElementById('name'); // Input field for patient name
const ageInput = document.getElementById("age"); // Input field for patient age
const conditionSelect = document.getElementById("condition"); // Dropdown for patient condition
const conditionInput = document.getElementById('conditionInput');

// Function to add a new patient
function addPatient() {
    // Capture input values
    const name = nameInput.value;
    const age = ageInput.value;
    const condition = conditionSelect.value;
    const gender = document.querySelector('input[name="gender"]:checked').value;

    // Validate input
    if (name && gender && age && condition) {
        // Add patient to the array
        patients.push({ name, gender, age, condition });
        // Reset the form
        resetForm();
        // Generate and display the report
        generateReport();
    }
}

// Function to reset the input form
function resetForm() {
    nameInput.value = ""; // Clear name input
    document.querySelector('input[name="gender"]:checked').checked = false; // Uncheck gender selection
    ageInput.value = ""; // Clear age input
    conditionSelect.value = ""; // Clear condition selection
}

// Function to generate and display the report
function generateReport() {
    // Get the number of patients
    const numPatients = patients.length;

    // Object to store the count of each condition
    const conditionsCount = {
        Diabetes: 0,
        Thyroid: 0,
        "High Blood Pressure": 0,
    };

    // Object to store the count of each condition based on gender
    const genderConditionsCount = {
        Male: {
            Diabetes: 0,
            Thyroid: 0,
            "High Blood Pressure": 0,
        },
        Female: {
            Diabetes: 0,
            Thyroid: 0,
            "High Blood Pressure": 0,
        }
    };

    // Iterate through each patient
    for (const patient of patients) {
        // Increment condition count
        conditionsCount[patient.condition]++;
        // Increment gender-specific condition count
        genderConditionsCount[patient.gender][patient.condition]++;
    }

    // Display total number of patients
    report.innerHTML = `Number of patients: ${numPatients}<br><br>`;
    // Display breakdown of conditions
    report.innerHTML += `Conditions Breakdown:<br>`;
    for (const condition in conditionsCount) {
        report.innerHTML += `${condition}: ${conditionsCount[condition]}<br>`;
    }
    // Display gender-based condition statistics
    report.innerHTML += `<br>Gender-Based Conditions:<br>`;
    for (const gender in genderConditionsCount) {
        report.innerHTML += `${gender}:<br>`;
        for (const condition in genderConditionsCount[gender]) {
            report.innerHTML += `&nbsp;&nbsp;${condition}: ${genderConditionsCount[gender][condition]}<br>`;
        }
    }
}


function searchCondition() {
    const SearchText = conditionInput.value.trim().toLocaleLowerCase();

    if (SearchText === '') {
        alert("please enter a correct condition");
        return;
    }

    // get the data saved as json
    fetch('health_analysis.json')
        .then(response => response.json())
        .then(data => {
            const conditionsResult = data.conditions;

            const findCondition = conditionsResult.find(cond => cond.name.toLocaleLowerCase().includes(SearchText));

            if (findCondition) {
                result.innerHTML =
                    `<h2>${findCondition.name}</h2>
                    <img src="img/${findCondition.imagesrc}" alt="${findCondition.name}">
                    <div>
                        <p><b>symptoms: </b>${findCondition.symptoms.join(', ')} </p> <br>
                        <p><b>prevention: </b> ${findCondition.prevention.toString()}</p> <br>
                        <p><b>treatment: </b>${findCondition.treatment}</p> <br>
                    </div>
                    `;
            }
            else {
                result.innerHTML = 'Condition not found.';
            }


        })
        .catch(error => {
            console.error('Error:', error);
            result.innerHTML = 'An error occurred while fetching data.';
          });



}

// Attach event listener to 'Add Patient' button
addPatientButton.addEventListener("click", addPatient);

// Attach event listener to 'Search' button
btnSearch.addEventListener("click", searchCondition);