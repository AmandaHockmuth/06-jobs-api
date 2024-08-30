import { enableInput, message, token } from "./index.js";
import { showItems } from "./items.js";

export const deleteItem = async (itemId) => {
  enableInput(false);

  const url = `/api/v1/items/${itemId}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.status === 202 || response.status === 204) {
      // A 202 or 204 is expected for a successful delete
      message.textContent = "The item entry was deleted.";
    } else {
      console.error(data.message);
      message.textContent = "An error occurred while deleting the item.";
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }
  showItems();
  enableInput(true);
};
