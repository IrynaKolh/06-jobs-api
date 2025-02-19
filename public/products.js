import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit, showDelete } from "./addEdit.js";

let productsDiv = null;
let productsTable = null;
let productsTableHeader = null;

export const handleProducts = () => {
  productsDiv = document.getElementById("product");
  const logoff = document.getElementById("logoff");
  const addproduct = document.getElementById("add-product");
  productsTable = document.getElementById("product-table");
  productsTableHeader = document.getElementById("product-table-header");

  productsDiv.addEventListener("click", (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addproduct) {
        showAddEdit(null);
      } else if (e.target.classList.contains("editButton")) {
        message.textContent = "";
        showAddEdit(e.target.dataset.id);
      } else if (e.target.classList.contains("deleteButton")) {
        message.textContent = "";
        showDelete(e.target.dataset.id);
      } else if (e.target === logoff) {
        setToken(null);
        message.textContent = "You have been logged off.";
        productsTable.replaceChildren([productsTableHeader]);
        showLoginRegister();
      }
    }
  });
};

export const showProducts = async () => {
  try {
    enableInput(false);

    const response = await fetch("/api/v1/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    let children = [productsTableHeader];

    if (response.status === 200) {
      if (data.count === 0) {
        productsTable.replaceChildren(...children); // clear this for safety
      } else {
        for (let i = 0; i < data.products.length; i++) {
          let rowEntry = document.createElement("tr");

          let editButton = `<td><button type="button" class="editButton" data-id=${data.products[i]._id}>edit</button></td>`;
          let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.products[i]._id}>delete</button></td>`;
          let rowHTML = `
            <td>${data.products[i].name}</td>
            <td>${data.products[i].description}</td>
            <td>${data.products[i].type}</td>
            <td>${data.products[i].price}</td>
            <div>${editButton}${deleteButton}</div>`;

          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        productsTable.replaceChildren(...children);
      }
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }
  enableInput(true);
  setDiv(productsDiv);
};
