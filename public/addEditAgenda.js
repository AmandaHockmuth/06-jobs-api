import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showItems } from "./items.js";

let addEditAgendaDiv = null;
let agendaTitle = null;
let priority = null;
let agendaStatus = null;
let deadline = null;
let addingAgendaItem = null;

export const handleAddEditAgenda = () => {
  addEditAgendaDiv = document.getElementById("edit-agenda-item");
  agendaTitle = document.getElementById("agenda-title");
  priority = document.getElementById("priority");
  deadline = document.getElementById("deadline");
  agendaStatus = document.getElementById("agenda-status");
  addingAgendaItem = document.getElementById("adding-agenda-item");
  const editAgendaCancel = document.getElementById("edit-agenda-cancel");

  // @ts-ignore
  addEditAgendaDiv.addEventListener("click", async (e) => {
    // @ts-ignore
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingAgendaItem) {
        if (!isValidDate(deadline.value)) {
          // @ts-ignore
          message.textContent =
            "Invalid deadline. Please confirm date and use mm/dd/yyyy format.";
          return;
        }
        enableInput(false);

        let method = "POST";
        let url = "/api/v1/agenda";

        if (addingAgendaItem.textContent === "update") {
          method = "PATCH";
          url = `/api/v1/agenda/${addEditAgendaDiv.dataset.id}`;
        }

        try {
          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              agendaTitle: agendaTitle.value,
              priority: priority.value,
              deadline: deadline.value,
              agendaStatus: agendaStatus.value,
            }),
          });

          const data = await response.json();
          if (response.status === 200 || response.status === 201) {
            if (response.status === 200) {
              // @ts-ignore
              message.textContent = "The item entry was updated.";
            } else {
              // @ts-ignore
              message.textContent = "The item entry was created.";
            }

            agendaTitle.value = "";
            priority.value = "";
            deadline.value = "";
            agendaStatus.value = "received";

            showItems();
          } else {
            // @ts-ignore
            message.textContent = data.msg;
          }
        } catch (err) {
          console.log(err);
          // @ts-ignore
          message.textContent = "A communication error occurred.";
        }

        enableInput(true);
      } else if (e.target === editAgendaCancel) {
        // @ts-ignore
        message.textContent = "";
        showItems();
      }
    }
  });
};

export const showAddEditAgenda = async (agendaItemId) => {
  if (!agendaItemId) {
    agendaTitle.value = "";
    priority.value = "";
    deadline.value = "";
    agendaStatus.value = "received";
    addingAgendaItem.textContent = "add";
    // @ts-ignore
    message.textContent = "";

    setDiv(addEditAgendaDiv);
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/agenda/${agendaItemId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        const timestamp = data.agendaItem.deadline;
        const dateObj = new Date(timestamp);

        agendaTitle.value = data.agendaItem.agendaTitle;
        priority.value = data.agendaItem.priority;
        deadline.value = dateObj.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        agendaStatus.value = data.agendaItem.agendaStatus;
        addingAgendaItem.textContent = "update";
        // @ts-ignore
        message.textContent = "";
        addEditAgendaDiv.dataset.id = agendaItemId;

        setDiv(addEditAgendaDiv);
      } else {
        // @ts-ignore
        message.textContent = "The item entry was not found";
        showItems();
      }
    } catch (err) {
      console.log(err);
      // @ts-ignore
      message.textContent = "A communications error has occurred.";
      showItems();
    }

    enableInput(true);
  }
};

function isValidDate(dateString) {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(dateString)) {
    return false;
  }

  const parts = dateString.split("/");
  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    year < 1000 ||
    year > 2100
  ) {
    return false;
  }

  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}
