import { enableInput, message, token } from "./index.js";
import { showItems } from "./items.js";

export const deleteAgendaItem = async (agendaItemId) => {
  enableInput(false);

  const url = `/api/v1/agenda/${agendaItemId}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (
      response.status === 200 ||
      response.status === 202 ||
      response.status === 204
    ) {
      // @ts-ignore
      message.textContent = "The item entry was deleted.";
    } else {
      console.error(data.msg);
      // @ts-ignore
      message.textContent = "An error occurred while deleting the item.";
    }
  } catch (err) {
    console.error(err);
    // @ts-ignore
    message.textContent = "A communication error occurred.";
  }
  showItems();
  enableInput(true);
};
