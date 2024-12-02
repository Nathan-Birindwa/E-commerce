let firstName = document.querySelector(".firstName").value;
let lastName = document.querySelector(".lastName").value;
let email = document.querySelector(".email").value;
let password = document.querySelector(".password").value;
let confirmPassword = document.querySelector(".confirmPassword").value;

const payload = {
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
};

try {
  const response = await fetch("http://localhost:3000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  if (response.ok) {
    alert(data.message);
  } else {
    alert(data.message);
  }
} catch (error) {}
