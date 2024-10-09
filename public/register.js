import {
  inputEnabled,
  setDiv,
  message,
  enableInput,
  setToken,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showItems } from "./items.js";

let registerDiv = null;
let name = null;
let email1 = null;
let password1 = null;
let password2 = null;
let team = null;

export const handleRegister = () => {
  registerDiv = document.getElementById("register-div");
  name = document.getElementById("name");
  email1 = document.getElementById("email1");
  password1 = document.getElementById("password1");
  password2 = document.getElementById("password2");
  team = document.getElementById("team");
  const registerButton = document.getElementById("register-button");
  const registerCancel = document.getElementById("register-cancel");

  // @ts-ignore
  registerDiv.addEventListener("click", async (e) => {
    // @ts-ignore
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === registerButton) {
        if (password1.value != password2.value) {
          // @ts-ignore
          message.textContent = "The passwords entered do not match.";
        } else {
          enableInput(false);

          try {
            const response = await fetch("/api/v1/auth/register", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: name.value,
                email: email1.value,
                password: password1.value,
                team: team.value,
              }),
            });

            const data = await response.json();
            if (response.status === 201) {
              // @ts-ignore
              message.textContent = `Registration successful.  Welcome ${data.user.name}, team ${data.user.team}.`;
              setToken(data.token);

              name.value = "";
              email1.value = "";
              password1.value = "";
              password2.value = "";
              team.value = "";

              showItems();
            } else {
              // @ts-ignore
              message.textContent = data.msg;
            }
          } catch (err) {
            console.error(err);
            // @ts-ignore
            message.textContent = "A communications error occurred.";
          }

          enableInput(true);
        }
      } else if (e.target === registerCancel) {
        name.value = "";
        email1.value = "";
        password1.value = "";
        password2.value = "";
        team.value = "";
        showLoginRegister();
      }
    }
  });
};

export const showRegister = () => {
  email1.value = null;
  password1.value = null;
  password2.value = null;
  setDiv(registerDiv);
};
