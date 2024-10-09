import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";
import { deleteItem } from "./delete.js";
import { showAddEditAgenda } from "./addEditAgenda.js";
import { deleteAgendaItem } from "./deleteAgenda.js";

let itemsDiv = null;
let itemsTable = null;
let itemsTableHeader = null;
let agendaItemsTable = null;
let agendaItemsTableHeader = null;

export const handleItems = () => {
  itemsDiv = document.getElementById("items");
  const logoff = document.getElementById("logoff");
  const addItem = document.getElementById("add-item");
  itemsTable = document.getElementById("items-table");
  itemsTableHeader = document.getElementById("items-table-header");
  const addAgendaItem = document.getElementById("add-agenda-item");
  agendaItemsTable = document.getElementById("agenda-items-table");
  agendaItemsTableHeader = document.getElementById("agenda-items-table-header");

  // @ts-ignore
  itemsDiv.addEventListener("click", (e) => {
    // @ts-ignore
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addItem) {
        showAddEdit(null);
      } else if (e.target === addAgendaItem) {
        showAddEditAgenda(null);
      } else if (e.target === logoff) {
        setToken(null);
        // @ts-ignore
        message.textContent = "You have been logged off.";
        itemsTable.replaceChildren([itemsTableHeader]);
        showLoginRegister();
        // @ts-ignore
      } else if (e.target.classList.contains("editButton")) {
        // @ts-ignore
        message.textContent = "";
        // @ts-ignore
        showAddEdit(e.target.dataset.id);
        // @ts-ignore
      } else if (e.target.classList.contains("editAgendaButton")) {
        // @ts-ignore
        message.textContent = "";
        // @ts-ignore
        showAddEditAgenda(e.target.dataset.id);
        // @ts-ignore
      } else if (e.target.classList.contains("deleteButton")) {
        // @ts-ignore
        message.textContent = "";
        // @ts-ignore
        deleteItem(e.target.dataset.id);
        // @ts-ignore
      } else if (e.target.classList.contains("deleteAgendaButton")) {
        // @ts-ignore
        message.textContent = "";
        // @ts-ignore
        deleteAgendaItem(e.target.dataset.id);
      }
    }
  });
};

export const showItems = async () => {
  try {
    await showBudgetItems();
    await showAgendaItems();
    // enableInput(false);

    // const response = await fetch("/api/v1/items", {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    // });

    // const data = await response.json();
    // let children = [itemsTableHeader];

    // if (response.status === 200) {
    //   if (data.count === 0) {
    //     itemsTable.replaceChildren(...children); // clear this for safety
    //   } else {
    //     for (let i = 0; i < data.items.length; i++) {
    //       let rowEntry = document.createElement("tr");

    //       let editButton = `<td><button type="button" class="editButton" data-id=${data.items[i]._id}>edit</button></td>`;
    //       let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.items[i]._id}>delete</button></td>`;
    //       let rowHTML = `
    //             <td>${data.items[i].title}</td>
    //             <td>${data.items[i].value}</td>
    //             <td>${data.items[i].status}</td>
    //             <div>${editButton}${deleteButton}</div>`;

    //       rowEntry.innerHTML = rowHTML;
    //       children.push(rowEntry);
    //     }
    //     itemsTable.replaceChildren(...children);
    //   }
    // } else {
    //   message.textContent = data.msg;
    // }
  } catch (err) {
    console.error(err);
    // @ts-ignore
    message.textContent = "A communication error occurred.";
  }
  enableInput(true);
  setDiv(itemsDiv);
};

const showBudgetItems = async () => {
  enableInput(false);

  const response = await fetch("/api/v1/items", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  let children = [itemsTableHeader];

  if (response.status === 200) {
    if (data.count === 0) {
      itemsTable.replaceChildren(...children); // clear this for safety
    } else {
      for (let i = 0; i < data.items.length; i++) {
        let rowEntry = document.createElement("tr");

        let editButton = `<td><button type="button" class="editButton" data-id=${data.items[i]._id}>edit</button></td>`;
        let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.items[i]._id}>delete</button></td>`;
        let rowHTML = `
              <td>${data.items[i].title}</td>
              <td>$${data.items[i].value}</td>
              <td>${data.items[i].status}</td>
              <div>${editButton}${deleteButton}</div>`;

        rowEntry.innerHTML = rowHTML;
        children.push(rowEntry);
      }
      itemsTable.replaceChildren(...children);
    }
  } else {
    // @ts-ignore
    message.textContent = data.msg;
  }
};

const showAgendaItems = async () => {
  enableInput(false);

  const response = await fetch("/api/v1/agenda", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  let children = [agendaItemsTableHeader];

  if (response.status === 200) {
    if (data.count === 0) {
      agendaItemsTable.replaceChildren(...children); // clear this for safety
    } else {
      for (let i = 0; i < data.agendaItems.length; i++) {
        let rowEntry = document.createElement("tr");

        let editAgendaButton = `<td><button type="button" class="editAgendaButton" data-id=${data.agendaItems[i]._id}>edit</button></td>`;
        let deleteAgendaButton = `<td><button type="button" class="deleteAgendaButton" data-id=${data.agendaItems[i]._id}>delete</button></td>`;
        let timestamp = data.agendaItems[i].deadline;
        let dateObj = new Date(timestamp);
        let rowHTML = `
              <td>${data.agendaItems[i].agendaTitle}</td>
              <td>${data.agendaItems[i].priority}</td>
              <td>${dateObj.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                timeZone: "UTC",
              })}</td>
              <td>${data.agendaItems[i].agendaStatus}</td>
              <div>${editAgendaButton}${deleteAgendaButton}</div>`;

        rowEntry.innerHTML = rowHTML;
        children.push(rowEntry);
      }
      agendaItemsTable.replaceChildren(...children);
    }
  } else {
    // @ts-ignore
    message.textContent = data.msg;
  }
};
