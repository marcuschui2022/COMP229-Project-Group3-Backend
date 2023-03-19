// Name: Chui Kwok Yuk Student
// Number: 301246550
// Last Modified Date: 4 Feb 2023

const form = document.getElementById("contactForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let displayMsg = "This is the details you want to send: \n";
  const formData = new FormData(form);
  console.log(formData);
  for (const [key, value] of formData) {
    // console.log(displayMsg);
    displayMsg += `${key}: ${value}\n`;
  }
  // console.log(displayMsg);
  alert(displayMsg);
  window.location.href = "/";
});
