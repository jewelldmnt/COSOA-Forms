var officerCount = 1;
var activeOfficer = 1;

// Function to add a new officer
function addOfficer(event) {
  event.preventDefault();

  var electedOffice = prompt("Enter the name of the elected office:");

  if (electedOffice) {
    var ul = document.querySelector(".officers-div ul");

    var currentActiveStep = ul.querySelector("li.active");
    if (currentActiveStep) {
      currentActiveStep.classList.remove("active");
    }

    officerCount++;
    activeOfficer = officerCount;

    var officerNumber = document.createElement("span");
    officerNumber.textContent = officerCount;

    var newLi = document.createElement("li");
    newLi.className = "officer-label" + officerCount;
    newLi.classList.add("active");

    newLi.appendChild(officerNumber);
    newLi.appendChild(document.createTextNode(" " + electedOffice));

    ul.insertBefore(newLi, ul.lastElementChild);

    var currentActiveForm = document.querySelector("div.form.active");
    if (currentActiveForm) {
      currentActiveForm.classList.remove("active");
    }

    var formSection = document.querySelector(".form-officer-1");
    var newFormSection = formSection.cloneNode(true);

    newFormSection.className = "form-officer-" + officerCount + " active form";
    newFormSection.querySelector("#elected_office").value = electedOffice;

    formSection.parentNode.insertBefore(
      newFormSection,
      document.querySelector(".form-btn-wrapper")
    );

    addCssRule(`.form-officer-${officerCount}`, "display: none;");
    addCssRule(`.form-officer-${officerCount}.active`, "display: block;");

    updateButtons();
    scrollToActiveOfficer();
  }
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
  const formSubmitBtn = document.querySelector("#next--button");
  const formBackBtn = document.querySelector("#back--button");
  const formDelBtn = document.querySelector("#delete--button");
  const maxStep = getMaxStepCount();

  if (maxStep === 1) {
    formSubmitBtn.textContent = "Submit";
    formSubmitBtn.onclick = function () {
      document.querySelector("form").submit();
    };
    formBackBtn.style.display = "none";
    formDelBtn.style.display = "none";
  } else if (
    document.querySelector(`.form-officer-1`).classList.contains("active")
  ) {
    formSubmitBtn.textContent = "Next";
    formSubmitBtn.onclick = function (event) {
      event.preventDefault();
      goToNextStep();
    };
    formBackBtn.style.display = "none";
    formDelBtn.style.display = "none";
  } else {
    if (
      document
        .querySelector(`.form-officer-${maxStep}`)
        .classList.contains("active")
    ) {
      formSubmitBtn.textContent = "Submit";
      formSubmitBtn.onclick = function () {
        document.querySelector("form").submit();
      };
    } else {
      formSubmitBtn.textContent = "Next";
      formSubmitBtn.onclick = function (event) {
        event.preventDefault();
        goToNextStep();
      };
    }
    formDelBtn.style.display = "inline-block";
    formBackBtn.style.display = "inline-block";
    formBackBtn.onclick = function (event) {
      event.preventDefault();
      goToPreviousStep();
    };
  }
  // Attach delete event to the delete button
  formDelBtn.onclick = function (event) {
    event.preventDefault();
    deleteOfficer();
  };
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
  if (officerCount > 1) {
    var ul = document.querySelector(".officers-div ul");
    var currentActiveStep = ul.querySelector("li.active");
    var currentActiveForm = document.querySelector("div.form.active");

    // Remove the active form and label
    currentActiveStep.remove();
    currentActiveForm.remove();

    // Decrease officer count
    officerCount--;

    // Adjust officer numbers and IDs for subsequent officers
    var officers = ul.querySelectorAll("li:not(.add__officer)");
    officers.forEach((li, index) => {
      var officerNumber = li.querySelector("span");
      if (officerNumber) {
        officerNumber.textContent = index + 1;
      }
      li.className = "officer-label" + (index + 1);
    });

    var forms = document.querySelectorAll("div.form");
    forms.forEach((form, index) => {
      form.className = "form-officer-" + (index + 1) + " form";
    });

    // Set the new active officer
    activeOfficer = Math.min(activeOfficer, officerCount);
    if (activeOfficer > 0) {
      ul.querySelectorAll("li")[activeOfficer - 1].classList.add("active");
      forms[activeOfficer - 1].classList.add("active");
    }

    updateButtons();
    scrollToActiveOfficer();
  }
}

function goToNextStep() {
  if (activeOfficer == officerCount) {
    activeOfficer = officerCount;
  } else {
    activeOfficer++;
  }
  var ul = document.querySelector(".officers-div ul");
  var currentActiveStep = ul.querySelector("li.active");
  currentActiveStep.classList.remove("active");
  currentActiveStep.nextElementSibling.classList.add("active");

  var currentActiveForm = document.querySelector("div.form.active");
  currentActiveForm.classList.remove("active");
  currentActiveForm.nextElementSibling.classList.add("active");
  updateButtons();
}

function goToPreviousStep() {
  if (activeOfficer == 1) {
    activeOfficer = 1;
  } else {
    activeOfficer--;
  }
  var ul = document.querySelector(".officers-div ul");
  var currentActiveStep = ul.querySelector("li.active");
  currentActiveStep.classList.remove("active");
  currentActiveStep.previousElementSibling.classList.add("active");

  var currentActiveForm = document.querySelector("div.form.active");
  currentActiveForm.classList.remove("active");
  currentActiveForm.previousElementSibling.classList.add("active");
  updateButtons();
}

// Function to get the max step count
function getMaxStepCount() {
  var formSections = document.querySelectorAll("[class^='form-officer-']");
  var maxStep = 0;
  formSections.forEach(function (section) {
    var stepMatch = section.className.match(/form-officer-(\d+)/);
    if (stepMatch) {
      var step = parseInt(stepMatch[1]);
      if (step > maxStep) {
        maxStep = step;
      }
    }
  });
  return maxStep;
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

// Attach the add_officer function to the "+" button
document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".add__officer").addEventListener("click", addOfficer);
  updateButtons();
  scrollToActiveOfficer();
});

// Scroll to active officer label on load
window.addEventListener("load", scrollToActiveOfficer);
