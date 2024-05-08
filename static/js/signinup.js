// Load all of the document first 
document.addEventListener("DOMContentLoaded", () => {
    // sign in and up constants
    const wrapper = document.querySelector('.wrapper');
    const signin = document.querySelector('.signin');
    const signup = document.querySelector('.signup');
  
    signup.addEventListener("click", () => {
      wrapper.classList.add("animate-signin");
      wrapper.classList.remove("animate-signup");
    });
  
    signin.addEventListener("click", () => {
      wrapper.classList.add("animate-signup");
      wrapper.classList.remove("animate-signin");
    });
  });
  