const stepMenuOne = document.querySelector('.formbold-step-menu1')
const stepMenuThree = document.querySelector('.formbold-step-menu3')

const stepOne = document.querySelector('.formbold-form-step-1')
const stepThree = document.querySelector('.formbold-form-step-3')

const formSubmitBtn = document.querySelector('.formbold-btn')
const formBackBtn = document.querySelector('.formbold-back-btn')

formSubmitBtn.addEventListener("click", function(event){
  event.preventDefault()
  if(stepMenuOne.className == 'formbold-step-menu1 active') {
      event.preventDefault()

      stepMenuOne.classList.remove('active')
      stepMenuTwo.classList.add('active')

      stepOne.classList.remove('active')
      stepTwo.classList.add('active')

      formBackBtn.classList.add('active')
      formBackBtn.addEventListener("click", function (event) {
        event.preventDefault()

        stepMenuOne.classList.add('active')
        stepMenuTwo.classList.remove('active')

        stepOne.classList.add('active')
        stepTwo.classList.remove('active')

        formBackBtn.classList.remove('active')

      })

    } else if(stepMenuThree.className == 'formbold-step-menu3 active') {
      document.querySelector('form').submit()
    }
})