document.addEventListener("DOMContentLoaded", function() {
  const formSubmitBtn = document.querySelector('.wav-formbold-btn');
  formSubmitBtn.addEventListener("click", function() {
      store_wav_data();
  });
});

function store_wav_data(){
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
    cnsoa: cnsoaValue
  };

  fetch('/store_wav_data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'link': 'wav'
      },
      body: JSON.stringify(data)
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      // Redirect to gpoa.html after successful submission
      window.location.href = '/officers'; // Adjust URL as per your Flask route
  })
  .catch(error => {
      console.error('Error:', error);
  });
}