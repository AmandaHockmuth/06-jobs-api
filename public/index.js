let activeDiv = null;
export const setDiv = (newDiv) => {
  if (newDiv != activeDiv) {
    if (activeDiv) {
      activeDiv.style.display = "none";
    }
    newDiv.style.display = "block";
    activeDiv = newDiv;
  }
};

export let inputEnabled = true;
export const enableInput = (state) => {
  inputEnabled = state;
};

export let token = null;
export const setToken = (value) => {
  token = value;
  if (value) {
    localStorage.setItem("token", value);
  } else {
    localStorage.removeItem("token");
  }
};

export let message = null;

import { showItems, handleItems } from "./items.js";
import { showLoginRegister, handleLoginRegister } from "./loginRegister.js";
import { handleLogin } from "./login.js";
import { handleAddEdit } from "./addEdit.js";
import { handleRegister } from "./register.js";
import { handleAddEditAgenda } from "./addEditAgenda.js";

document.addEventListener("DOMContentLoaded", () => {
  // @ts-ignore
  token = localStorage.getItem("token");
  // @ts-ignore
  message = document.getElementById("message");
  handleLoginRegister();
  handleLogin();
  handleItems();
  handleRegister();
  handleAddEdit();
  handleAddEditAgenda();

  if (token) {
    showItems();
  } else {
    showLoginRegister();
  }
});
