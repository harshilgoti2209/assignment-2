let itemList = [];
let section2 = document.querySelector("#list-box-items");
let form = document.querySelector("#add-item-form");
let nameElement = document.querySelector("#name");
let quantityElement = document.querySelector("#quantity");
let editStatus = -1;

let sampleText = document.createElement("h2");
sampleText.setAttribute("style", "text-align:center;margin:17px;");
sampleText.innerHTML = "Currently Item List is empty...	&#128528;";

const updateElement = (element, name, quantity) => {
  element.setAttribute("key", `${name}`);
  element.innerHTML = `
    <div>
      <h3>${name} </h3>
      <p>Quantity : ${quantity} </p>
    </div>
  `;
  let editBtn = document.createElement("img");
  editBtn.src = "https://img.icons8.com/dusk/64/000000/edit--v2.png";
  editBtn.addEventListener("click", () => {
    changeToEditView(`${name}`, `${quantity}`);
  });
  element.append(editBtn);
  let deleteBtn = document.createElement("img");
  deleteBtn.src = "https://img.icons8.com/fluent/48/ffffff/delete-sign.png";
  deleteBtn.addEventListener("click", () => {
    deleteItem(`${name}`);
  });
  element.append(deleteBtn);
};

const build = () => {
  localStorage.itemList === undefined
    ? (localStorage.itemList = JSON.stringify([]))
    : (itemList = JSON.parse(localStorage.itemList));

  itemList.forEach((item) => {
    let element = document.createElement("div");
    updateElement(element, item.name, item.quantity);
    section2.append(element);
  });
  if (section2.innerHTML == null) {
    section2.appendChild(sampleText);
  }
  if (itemList.length === 0) {
    section2.appendChild(sampleText);
  }
};

build();

const changeToEditView = (name, quantity) => {
  name = name.trim().toUpperCase();
  nameElement.value = name;
  quantityElement.value = quantity;
  document.getElementById("form-title").innerHTML = "Edit Item";
  document.querySelector(`[type='reset']`).style.display = "inline-block";
  document.querySelector(`[type='submit']`).innerHTML = "EDIT";
  editStatus = itemList.findIndex((item) => item.name === name);
  nameElement.focus();
};

const changeToAddView = () => {
  nameElement.value = "";
  quantityElement.value = "";
  document.getElementById("form-title").innerHTML = "Add Grocery Item";
  document.querySelector(`[type='reset']`).style.display = "none";
  document.querySelector(`[type='submit']`).innerHTML = "ADD";
  editStatus = -1;
  nameElement.focus();
};

const deleteItem = (name) => {
  name = name.trim().toUpperCase();
  let index = itemList.findIndex((item) => item.name === name);
  itemList.splice(index, 1);
  let element = document.querySelector(`[key="${name}"]`);
  section2.removeChild(element);
  if (editStatus === index) {
    changeToAddView();
  }
  localStorage.itemList = JSON.stringify(itemList);
  if (itemList.length === 0) {
    section2.appendChild(sampleText);
  }
};

const replaceItem = (index, name, quantity) => {
  name = name.trim().toUpperCase();
  let element = document.querySelector(`[key="${itemList[index].name}"]`);
  itemList[index] = { name, quantity };
  updateElement(element, name, quantity);
  localStorage.itemList = JSON.stringify(itemList);
};

const createItem = (name, quantity) => {
  name = name.trim().toUpperCase();
  let element = document.createElement("div");
  updateElement(element, name, quantity);
  section2.prepend(element);
  itemList.unshift({ name, quantity });
  localStorage.itemList = JSON.stringify(itemList);
  if (itemList.length === 1) {
    section2.removeChild(sampleText);
  }
};

const addItem = (name, quantity) => {
  name = name.trim().toUpperCase();
  let index = itemList.findIndex((item) => item.name === name);
  index !== -1
    ? replaceItem(index, name, quantity + itemList[index].quantity)
    : createItem(name, quantity);
};

const editItem = (name, quantity) => {
  name = name.trim().toUpperCase();
  let index = itemList.findIndex(
    (item, index) => item.name === name && index !== editStatus
  );
  if (index === -1) {
    replaceItem(editStatus, name, quantity);
  } else {
    replaceItem(index, name, itemList[index].quantity + quantity);
    deleteItem(itemList[editStatus].name);
  }
  editStatus = -1;
};

document.getElementById("name").addEventListener("input", (event) => {
  nameElement.value = nameElement.value.replace(/["]/g, `''`);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  let data = new FormData(form);
  let name = data.get("name").trim().toUpperCase();

  let quantity = +data.get("quantity");
  if (name === "") {
    alert("please enter item name");
    nameElement.focus();
    return;
  }
  if (Number.isFinite(quantity) === false) {
    alert("please enter valid quantity");
    quantityElement.focus();
    return;
  }
  editStatus === -1 ? addItem(name, quantity) : editItem(name, quantity);

  nameElement.focus();
  changeToAddView();
});

document.getElementById("quantity").addEventListener("input", (event) => {
  quantityElement.value = quantityElement.value
    .replace(/[^0-9.]/g, "")
    .replace(/(\..*?)\..*/g, "$1");
});

document.querySelector(`[type='reset']`).addEventListener("click", () => {
  changeToAddView();
});
