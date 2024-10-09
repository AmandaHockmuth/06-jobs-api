import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showItems } from "./items.js";

let addEditDiv = null;
let title = null;
let value = null;
let status = null;
let addingItem = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-item");
  title = document.getElementById("title");
  value = document.getElementById("value");
  status = document.getElementById("status");
  addingItem = document.getElementById("adding-item");
  const editCancel = document.getElementById("edit-cancel");

  // @ts-ignore
  addEditDiv.addEventListener("click", async (e) => {
    // @ts-ignore
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingItem) {
        enableInput(false);

        let method = "POST";
        let url = "/api/v1/items";

        if (addingItem.textContent === "update") {
          method = "PATCH";
          url = `/api/v1/items/${addEditDiv.dataset.id}`;
        }

        try {
          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: title.value,
              value: value.value,
              status: status.value,
            }),
          });

          const data = await response.json();
          if (response.status === 200 || response.status === 201) {
            if (response.status === 200) {
              // a 200 is expected for a successful update
              // @ts-ignore
              message.textContent = "The item entry was updated.";
            } else {
              // a 201 is expected for a successful create
              // @ts-ignore
              message.textContent = "The item entry was created.";
            }

            title.value = "";
            value.value = "";
            status.value = "pending";

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
      } else if (e.target === editCancel) {
        // @ts-ignore
        message.textContent = "";
        showItems();
      }
    }
  });
};

export const showAddEdit = async (itemId) => {
  if (!itemId) {
    title.value = "";
    value.value = "";
    status.value = "unpaid";
    addingItem.textContent = "add";
    // @ts-ignore
    message.textContent = "";

    setDiv(addEditDiv);
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/items/${itemId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        title.value = data.item.title;
        value.value = data.item.value;
        status.value = data.item.status;
        addingItem.textContent = "update";
        // @ts-ignore
        message.textContent = "";
        addEditDiv.dataset.id = itemId;

        setDiv(addEditDiv);
      } else {
        // might happen if the list has been updated since last display
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
