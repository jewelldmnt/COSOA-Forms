
function initializeFormNavigation() {
  const stepMenuOne = document.querySelector(".wav-formbold-step-menu1");
  const stepMenuThree = document.querySelector(".wav-formbold-step-menu3");

  const stepOne = document.querySelector(".wav-formbold-form-step-1");
  const stepThree = document.querySelector(".wav-formbold-form-step-3");

  const formSubmitBtn = document.querySelector("#submit--button");
  const formNextBttn = document.querySelector("#next--button-wav");
  const formBackBtn = document.querySelector("#back--button-wav");

  formNextBttn.addEventListener("click", function (event) {
    event.preventDefault();
    if (stepMenuOne.classList.contains("active")) {
      stepMenuOne.classList.remove("active");
      stepMenuThree.classList.add("active");

      stepOne.classList.remove("active");
      stepThree.classList.add("active");

      formNextBttn.style.display = "none";
      formBackBtn.style.display = "inline-block";
      formSubmitBtn.style.display = "inline-block";
    } else if (stepMenuThree.classList.contains("active")) {
      document.querySelector("form").submit();
    }
  });

  formBackBtn.addEventListener("click", function (event) {
    event.preventDefault();

    stepMenuOne.classList.add("active");
    stepMenuThree.classList.remove("active");

    stepOne.classList.add("active");
    stepThree.classList.remove("active");

    formNextBttn.style.display = "inline-block";
    formBackBtn.style.display = "none";
    formSubmitBtn.style.display = "none";
  });
}

document.addEventListener("DOMContentLoaded", initializeFormNavigation);

document.addEventListener("DOMContentLoaded", function () {
  const formSubmitBtn = document.querySelector(".wav-formbold-btn");
  formSubmitBtn.addEventListener("click", function () {
    store_wav_data();
  });
});

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
    });
}
