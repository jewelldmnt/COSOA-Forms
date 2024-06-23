document.addEventListener("DOMContentLoaded", function () {
  const formSubmitBtn = document.querySelector("#submit--button");
  formSubmitBtn.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form submission to handle validation

    // Validate current active officer form
    var currentActiveForm = document.querySelector(".wav-formbold-form-step-1");
    var inputs = currentActiveForm.querySelectorAll(".wav-formbold-form-input");

    var isValid = true;
    inputs.forEach(function (input) {
      if (input.value.trim() === "" && input.hasAttribute("required")) {
        isValid = false;
        input.classList.add("error");
        createErrorMsg(input, "red", "This field is required.");
        return;
      } else {
        input.classList.remove("error");
        createErrorMsg(input, "hsl(165, 29%, 97%)", "This is an error message"); 
      }
    });

    if (!isValid) {
      alert("Please fill in all required fields.");
    } else {
      store_wav_data();
    }
  });
});

function createErrorMsg(input, color, errorMsg) {
  let errorElement = input.nextElementSibling;
  if (errorElement && errorElement.classList.contains("error-message")) {
    errorElement.textContent = errorMsg;
    errorElement.style.color = color;
  }
}

function store_wav_data() {
  // Store values
  const cnsoValue = document.querySelector('input[name="cnso"]').value;
  const cojValue = document.querySelector('select[name="coj"]').value;
  const scojValue = document.querySelector('select[name="scoj"]').value;
  const ntsoValue = document.querySelector('select[name="ntso"]').value;
  const cnsoaValue = document.querySelector('input[name="cnsoa"]').value;

  // Pass data in JSON form
  const data = {
    cnso: cnsoValue,
    coj: cojValue,
    scoj: scojValue,
    ntso: ntsoValue,
    cnsoa: cnsoaValue,
  };

  fetch("/store_wav_data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      link: "wav",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Redirect to gpoa.html after successful submission
      window.location.href = "/officers"; // Adjust URL as per your Flask route
    })
    .catch((error) => {
      console.error("Error:", error);
      // Add an alert here saying "an error occurred"
      alert(
        "An error occurred: Organization already exists. Contact COSOA if you think this is an error."
      );
    });
}
