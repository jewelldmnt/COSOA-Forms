var officerCount = 1;
var activeOfficer = 1;
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".add__officer").addEventListener("click", addOfficer);
  document
    .querySelector("#submit--button-OR")
    .addEventListener("click", handleSubmit);
  updateButtons();
});
window.addEventListener("load", () => {
  fetchOfficerInfo();
});

function isValidForm() {
  const currentForm = document.querySelector(".form.active");
  const inputs = currentForm.querySelectorAll(".form-input");
  let isValid = true;

  // Validate form inputs
  inputs.forEach((input) => {
    const trimmedValue = input.value.trim();
    if (trimmedValue === "" && input.hasAttribute("required")) {
      isValid = false;
      input.classList.add("error");
      createErrorMsg(input, "red", "This field is required.");
      return;
    } else {
      input.classList.remove("error");
      createErrorMsg(input, "hsl(165, 29%, 97%)", "This is an error message"); // Clear error message
    }

    // Check pattern validity if pattern attribute is present
    if (input.hasAttribute("pattern")) {
      const pattern = new RegExp(`^${input.getAttribute("pattern")}$`);
      if (!pattern.test(trimmedValue)) {
        isValid = false;
        input.classList.add("error");
        const patternError =
          input.getAttribute("title") || "Invalid input format.";
        createErrorMsg(input, "red", patternError);
      } else {
        input.classList.remove("error");
        createErrorMsg(input, "hsl(165, 29%, 97%)", "This is an error message"); // Clear error message
      }
    }

    // Custom pattern check for yearsection input
    if (input.name === "yearsection") {
      const yearSectionPattern = /^(1|2|3|4)-(1|2|3|4|5|1n)$/;
      if (!yearSectionPattern.test(trimmedValue)) {
        isValid = false;
        input.classList.add("error");
        createErrorMsg(input, "red", "Invalid year and section format.");
      } else {
        input.classList.remove("error");
        createErrorMsg(input, "hsl(165, 29%, 97%)", "This is an error message"); // Clear error message
      }
    }

    if (input.name == "age") {
      if (trimmedValue < 18 || trimmedValue > 60) {
        createErrorMsg(input, "red", "Age must be between 18 to 60");
      }
    }
    // Validate emails using isEmailValid() function
    if (!isEmailValid()) {
      isValid = false;
    }
  });

  if (!isValid) {
    alert(
      "Please fill in all required fields and ensure pattern requirements are met."
    );
    currentForm.querySelector(".form-input.error").focus();
  }

  return isValid;
}

function addOfficerLabel(electedOffice) {
  const ul = document.querySelector(".officers-div ul");
  ul.querySelector("li.active")?.classList.remove("active");

  const li = document.createElement("li");
  li.className = `officer-label${officerCount} active`;
  li.innerHTML = `<span>${officerCount}</span> ${electedOffice}`;

  ul.insertBefore(li, ul.lastElementChild);
}

function addOfficerForm(electedOffice) {
  var currentActiveForm = document.querySelector("div.form.active");
  if (currentActiveForm) {
    currentActiveForm.classList.remove("active");
  }
  var formSection = document.querySelector(".form-officer-1");
  var newFormSection = formSection.cloneNode(true);
  // Clear input values in the cloned form section
  var clonedInputs = newFormSection.querySelectorAll(".form-input");
  clonedInputs.forEach(function (input) {
    input.value = ""; // Reset input value
    if (input.name === "elected_office") {
      input.removeAttribute("readonly"); // Remove the readonly attribute
    }
  });
  newFormSection.className = "form-officer-" + officerCount + " active form";
  newFormSection.querySelector("#elected_office").value = electedOffice;

  formSection.parentNode.insertBefore(
    newFormSection,
    document.querySelector(".form-btn-wrapper")
  );

  addCssRule(`.form-officer-${officerCount}`, "display: none;");
  addCssRule(`.form-officer-${officerCount}.active`, "display: block;");
}

// Function to add a new officer
function addOfficer(event) {
  event.preventDefault();

  if (!isValidForm()) return;

  const electedOffice = prompt("Enter the name of the elected office:");
  if (!electedOffice) return;

  officerCount++;
  activeOfficer = officerCount;

  addOfficerLabel(electedOffice);
  addOfficerForm(electedOffice);

  updateButtons();
  scrollToActiveOfficer();
}

// Function to add a CSS rule
function addCssRule(selector, rules) {
  var styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerHTML = `${selector} { ${rules} }`;
  document.head.appendChild(styleSheet);
}

// Function to update the button text based on the current step
function updateButtons() {
  const formNextBtn = document.querySelector("#next--button");
  const formSubmitBtn = document.querySelector("#submit--button-OR");
  const formBackBtn = document.querySelector("#back--button");
  const formDelBtn = document.querySelector("#delete--button");

  formNextBtn.style.display = "none";
  formSubmitBtn.style.display = "none";
  formDelBtn.style.display = "none";

  const maxStep = getMaxStepCount();
  console.log("Max step is: " + maxStep);

  const isFirstStepActive = document
    .querySelector(`.form-officer-1`)
    .classList.contains("active");
  const isLastStepActive = document
    .querySelector(`.form-officer-${maxStep}`)
    .classList.contains("active");

  if (maxStep === 1) {
    formSubmitBtn.style.display = "inline-block";
    formBackBtn.onclick = null; 
  } else if (isFirstStepActive) {
    formNextBtn.style.display = "inline-block";
    formNextBtn.onclick = goToNextStep;
    formDelBtn.onclick = deleteOfficer;
    formBackBtn.onclick = null; 
  } else if (!isLastStepActive) {
    formNextBtn.style.display = "inline-block";
    formNextBtn.onclick = goToNextStep;
    formDelBtn.style.display = "inline-block";
    formDelBtn.onclick = deleteOfficer;
    formBackBtn.classList.remove = 'href';
    formBackBtn.onclick = goToPreviousStep;
  } else {
    formSubmitBtn.style.display = "inline-block";
    formDelBtn.style.display = "inline-block";
    formDelBtn.onclick = deleteOfficer;
    formBackBtn.classList.remove = "href";
    formBackBtn.onclick = goToPreviousStep;
  }

  // Keep track of the active form and label elements
  var ul = document.querySelector(".officers-div ul");
  var activeForm = document.querySelector("div.form.active");
  var activeLabel = ul.querySelector("li.active");

  // Add event listener to update the active form and label when elected office input changes
  activeForm
    .querySelector("#elected_office")
    .addEventListener("input", function () {
      activeLabel.childNodes[1].nodeValue = " " + this.value;
    });

  scrollToActiveOfficer();
}

// Function to delete the current officer
function deleteOfficer() {
  if (officerCount <= 1) return;

  const ul = document.querySelector(".officers-div ul");
  const currentStep = ul.querySelector("li.active");
  const currentForm = document.querySelector("div.form.active");

  currentStep.remove();
  currentForm.remove();

  officerCount--;
  activeOfficer = Math.min(activeOfficer, officerCount);

  ul.querySelectorAll("li:not(.add__officer)").forEach((li, index) => {
    li.querySelector("span").textContent = index + 1;
    li.className = `officer-label${index + 1}`;
  });

  document.querySelectorAll("div.form").forEach((form, index) => {
    form.className = `form-officer-${index + 1} form`;
  });

  if (activeOfficer > 0) {
    ul.querySelectorAll("li")[activeOfficer - 1].classList.add("active");
    document
      .querySelectorAll("div.form")
      [activeOfficer - 1].classList.add("active");
  }

  updateButtons();
  scrollToActiveOfficer();
}
function changeActiveStep() {
  document
    .querySelector(".officers-div ul li.active")
    .classList.remove("active");
  document
    .querySelector(`.officer-label${activeOfficer}`)
    .classList.add("active");

  document.querySelector("div.form.active").classList.remove("active");
  document
    .querySelector(`.form-officer-${activeOfficer}`)
    .classList.add("active");

  updateButtons();
}
function goToNextStep(event) {
  event.preventDefault();
  if (activeOfficer < officerCount) {
    activeOfficer++;
    changeActiveStep();
  }
}

function goToPreviousStep(event) {
  event.preventDefault();
  if (activeOfficer > 1) {
    activeOfficer--;
    changeActiveStep();
  }
}

// Function to get the max step count
function getMaxStepCount() {
  return document.querySelectorAll("[class^='form-officer-']").length;
}

// Function to scroll the active officer label into view
function scrollToActiveOfficer() {
  var ul = document.querySelector(".officers-div ul");
  var activeLi = ul.querySelector("li.active");
  if (activeLi) {
    activeLi.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }
}
function createErrorMsg(input, color, errorMsg) {
  let errorElement = input.nextElementSibling;
  if (errorElement && errorElement.classList.contains("error-message")) {
    errorElement.textContent = errorMsg;
    errorElement.style.color = color;
  }
}

function isEmailValid() {
  console.log("Email Validation");

  // Get the currently active form
  var currentActiveForm = document.querySelector(".form.active");

  // Ensure elements are fetched within the current form context
  var PUPWebMail = currentActiveForm.querySelector("#PUPwebmail");
  var activeEmail = currentActiveForm.querySelector("#activeEmail");

  function validateEmail(input, domain, errorPrefix) {
    const value = input.value.trim();
    const isValid = value.endsWith(domain) && value.includes("@");
    input.setCustomValidity(isValid ? "" : errorPrefix);
    if (isValid) {
      console.log("Email is valid");
      input.classList.remove("error");
      createErrorMsg(input, "hsl(165, 29%, 97%)", "This is an error message"); // Clear error message
    } else {
      console.log("Email is invalid");
      input.classList.add("error");
      createErrorMsg(input, "red", errorPrefix);
    }
    return isValid;
  }

  // Event listeners for input validation
  PUPWebMail.addEventListener("input", function () {
    validateEmail(
      PUPWebMail,
      "@iskolarngbayan.pup.edu.ph",
      "Please enter a valid email address ending with @iskolarngbayan.pup.edu.ph"
    );
  });

  activeEmail.addEventListener("input", function () {
    validateEmail(
      activeEmail,
      "@gmail.com",
      "Please enter a valid email address ending with @gmail.com"
    );
  });

  // Check validity immediately on page load
  return (
    validateEmail(
      PUPWebMail,
      "@iskolarngbayan.pup.edu.ph",
      "Please enter a valid email address ending with @iskolarngbayan.pup.edu.ph"
    ) &&
    validateEmail(
      activeEmail,
      "@gmail.com",
      "Please enter a valid email address ending with @gmail.com"
    )
  );
}

function handleSubmit(event) {
  event.preventDefault();
  if (isValidForm()) store_officers_data();
}

function store_officers_data() {
  var forms = document.querySelectorAll(".form");
  var officersData = [];

  forms.forEach(function (form) {
    // Extract values from each form
    const programVal = form.querySelector('select[name="program"]').value;
    const EOVal = form.querySelector('input[name="elected_office"]').value;
    const AYVal = form.querySelector('select[name="AY"]').value;
    const FNVal = form.querySelector('input[name="firstname"]').value;
    const MNVal = form.querySelector('input[name="midname"]').value;
    const LNVal = form.querySelector('input[name="lastname"]').value;
    const pronounsVal = form.querySelector('select[name="pronouns"]').value;
    const YSVal = form.querySelector('input[name="yearsection"]').value;
    const DOBVal = form.querySelector('input[name="dob"]').value;
    const ageVal = form.querySelector('input[name="age"]').value;
    const SNVal = form.querySelector('input[name="studentNumber"]').value;
    const PNVal = form.querySelector('input[name="phoneNum"]').value;
    const webmailVal = form.querySelector('input[name="PUPwebmail"]').value;
    const emailVal = form.querySelector('input[name="activeEmail"]').value;
    const FBVal = form.querySelector('input[name="fbLink"]').value;

    // Add extracted data to officersData array
    officersData.push({
      program: programVal,
      EO: EOVal,
      AY: AYVal,
      FN: FNVal,
      MN: MNVal,
      LN: LNVal,
      pronouns: pronounsVal,
      YS: YSVal,
      DOB: DOBVal,
      age: ageVal,
      SN: SNVal,
      PN: PNVal,
      webmail: webmailVal,
      email: emailVal,
      FB: FBVal,
    });
  });

  // Pass data in JSON form
  const data = {
    officers: officersData,
  };

  fetch("/store_officers_data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      link: "officers",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Redirect to gpoa.html after successful submission
      window.location.href = "/gpoa"; // Adjust URL as per your Flask route
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function fetchOfficerInfo() {
  fetch("/get_officer_info")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Officer Info:", data);

      // Clone form-officer-1 for additional officers if there are more than 1 officer
      if (data.length > 1) {
        for (let i = 1; i < data.length; i++) {
          console.log("Cloning form for officer", i + 1);
          var ul = document.querySelector(".officers-div ul");
          var currentActiveStep = ul.querySelector("li.active");
          if (currentActiveStep) {
            currentActiveStep.classList.remove("active");
          }
          var officerNumber = document.createElement("span");
          officerNumber.textContent = i + 1;
          var newLi = document.createElement("li");
          newLi.className = "officer-label" + (i + 1);
          newLi.classList.add("active");

          newLi.appendChild(officerNumber);
          newLi.appendChild(document.createTextNode(" " + data[i].EO));
          ul.insertBefore(newLi, ul.lastElementChild);

          var currentActiveForm = document.querySelector("div.form.active");
          if (currentActiveForm) {
            currentActiveForm.classList.remove("active");
          }
          // Clone the form section for officer 1 (assuming form-officer-1 is already in the HTML)
          var formSection1 = document.querySelector(".form-officer-1");
          var newFormSection = formSection1.cloneNode(true);

          // Update class name to form-officer-(i+1) and make it active if it's the first officer
          newFormSection.className = `form-officer-${i + 1} form`;

          newFormSection.classList.add("active");
          currentActiveForm.classList.remove("active");

          // Update input values based on data
          newFormSection.querySelector('select[name="program"]').value =
            data[i].program;
          newFormSection.querySelector('input[name="elected_office"]').value =
            data[i].EO;
          newFormSection.querySelector('select[name="AY"]').value = data[i].AY;
          newFormSection.querySelector('input[name="firstname"]').value =
            data[i].FN;
          newFormSection.querySelector('input[name="midname"]').value =
            data[i].MN;
          newFormSection.querySelector('input[name="lastname"]').value =
            data[i].LN;
          newFormSection.querySelector('select[name="pronouns"]').value =
            data[i].pronouns;
          newFormSection.querySelector('input[name="yearsection"]').value =
            data[i].YS;
          newFormSection.querySelector('input[name="dob"]').value = data[i].DOB;
          newFormSection.querySelector('input[name="age"]').value = data[i].age;
          newFormSection.querySelector('input[name="studentNumber"]').value =
            data[i].SN;
          newFormSection.querySelector('input[name="phoneNum"]').value =
            data[i].PN;
          newFormSection.querySelector('input[name="PUPwebmail"]').value =
            data[i].webmail;
          newFormSection.querySelector('input[name="activeEmail"]').value =
            data[i].email;
          newFormSection.querySelector('input[name="fbLink"]').value =
            data[i].FB;
          addCssRule(`.form-officer-${i + 1}`, "display: none;");
          addCssRule(`.form-officer-${i + 1}.active`, "display: block;");
          // Insert cloned form section before the form button wrapper
          var formButtonWrapper = document.querySelector(".form-btn-wrapper");
          formButtonWrapper.parentNode.insertBefore(
            newFormSection,
            formButtonWrapper
          );
        }
        // Update buttons and scroll to the active officer
        officerCount = data.length;
        activeOfficer = officerCount;

        updateButtons();
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
