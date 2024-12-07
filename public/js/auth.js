const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

signUpButton?.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton?.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

function failSignIn(signInForm) {
  signInForm.username.setCustomValidity(
    "Неверные имя пользователя и/или пароль."
  );
  signInForm.username.reportValidity();
}

document.forms.signInForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const { method, action } = event.target;
  let response;
  try {
    response = await fetch(action, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: event.target.email.value,
        password: event.target.password.value,
      }),
    });
  } catch (err) {
    return failSignIn(event.target);
  }
  if (response.status !== 200) {
    return failSignIn(event.target);
  }
  return window.location.assign("/");
});

document.forms.signUpForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const { method, action } = event.target;
  let response;
  try {
    response = await fetch(action, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: event.target.username.value,
        email: event.target.email.value,
        password: event.target.password.value,
      }),
    });
  } catch (err) {
    console.error(err);
  }
  if (response.status !== 200) {
    console.error("error");
  }
  return window.location.assign("/");
});


document.getElementById("signOutBtn")?.addEventListener("click", async () => {
    console.log('hello');
    let response;
    try {
        response = await fetch("/auth/signout", {
            method: "GET",
        });
        if (response.ok) {
            return window.location.assign("/");
        }
    } catch (err) {
        console.error(err);
    }
});