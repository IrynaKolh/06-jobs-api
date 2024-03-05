import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showProducts } from "./products.js";

let addEditDiv = null;
let name = null;
let description = null;
let type = null;
let price = null;
let addingProduct = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-product");
  name = document.getElementById("productName");
  description = document.getElementById("description");
  type = document.getElementById("type");
  price = document.getElementById("price");
  addingProduct = document.getElementById("adding-product");
  const editCancel = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingProduct) {
        enableInput(false);

        let method = "POST";
        let url = "/api/v1/products";

        if (addingProduct.textContent === "update") {
          method = "PATCH";
          url = `/api/v1/products/${addEditDiv.dataset.id}`;
        }

        try {
          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: name.value,
              description: description.value,
              type: type.value,
              price: price.value,
            }),
          });

          const data = await response.json();
          if (response.status === 200 || response.status === 201) {
            if (response.status === 200) {
              // a 200 is expected for a successful update
              message.textContent = "The product entry was updated.";
            } else {
              // a 201 is expected for a successful create
              message.textContent = "The product entry was created.";
            }

            name.value = "";
            description.value = "";
            type.value = "Others";
            price.value = "";
            showProducts();
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          console.log(err);
          message.textContent = "A communication error occurred.";
        }

        enableInput(true);
      } else if (e.target === editCancel) {
        message.textContent = "";
        showProducts();
      }
    }
  });
};

export const showAddEdit = async (productId) => {
  if (!productId) {
    name.value = "";
    description.value = "";
    type.value = "Others";
    price.value = "";
    addingProduct.textContent = "add";
    message.textContent = "";

    setDiv(addEditDiv);
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/products/${productId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        name.value = data.product.name;
        description.value = data.product.description;
        type.value = data.product.type;
        price.value = data.product.price;
        addingProduct.textContent = "update";
        message.textContent = "";
        addEditDiv.dataset.id = productId;

        setDiv(addEditDiv);
      } else {
        // might happen if the list has been updated since last display
        message.textContent = "The products entry was not found";
        showProducts();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error has occurred.";
      showProducts();
    }

    enableInput(true);
  }
};

export const showDelete = async (productId) => {
  enableInput(false);
  try {
    const response = await fetch(`/api/v1/products/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.status === 200) {
      addingProduct.textContent = "delete";
      message.textContent = data.msg;
      showProducts();
    } else {
      // might happen if the list has been updated since last display
      message.textContent = "The products entry was not found";
      showProducts();
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communications error has occurred.";
    showProducts();
  }
  enableInput(true);
};
