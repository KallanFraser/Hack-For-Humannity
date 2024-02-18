document.addEventListener('DOMContentLoaded', () => //when content is loaded...
{
  const registerForm = document.getElementById('registerForm'); //gets the register buttom

  registerForm.addEventListener('submit', async (event) => //event listener listens for the submit event = triggered when register button is hit
  {
    window.location.href = '/register';
  });
});
