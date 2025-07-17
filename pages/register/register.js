// pages/register/register.js
const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Optional: Save the name to Firestore or Firebase profile
    await user.updateProfile({ displayName: name });

    alert('Registration successful!');
    window.location.href = '../login/login.html'; // redirect to login
  } catch (error) {
    alert(error.message);
  }
});

function checkPasswordStrength() {
  const password = document.getElementById("password").value;
  const msg = document.getElementById("strength-msg");

  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  if (strongPasswordRegex.test(password)) {
    msg.textContent = "✅ Strong password";
    msg.style.color = "green";
    return true;
  } else {
    msg.textContent = "❌ Weak (min 8 chars, upper, lower, digit, special)";
    msg.style.color = "red";
    return false;
  }
}