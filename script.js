let entries = JSON.parse(localStorage.getItem("entries")) || [];

const entryForm = document.getElementById("entryForm");
const entryTable = document
  .getElementById("entriesTable")
  .getElementsByTagName("tbody")[0];

const filterType = document.getElementById("filterType");
const filterCategory = document.getElementById("filterCategory");
const totalIncomeElement = document.getElementById("totalIncome");
const totalExpensesElement = document.getElementById("totalExpenses");
const balanceElement = document.getElementById("balance");

entryForm.addEventListener("submit", addEntry);
filterType.addEventListener("change", renderEntry);
filterCategory.addEventListener("change", renderEntry);

function updateBalance() {
  let totalIncome = 0;
  let totalExpenses = 0;

  entries.forEach((entry) => {
    if (entry.type === "income") totalIncome += Number(entry.amount);
    else totalExpenses += Number(entry.amount);
  });

  let totalBalance = totalIncome - totalExpenses;

  totalIncomeElement.textContent = `$${totalIncome.toFixed(2)}`;
  totalExpensesElement.textContent = `$${totalExpenses.toFixed(2)}`;
  balanceElement.textContent = `$${totalBalance.toFixed(2)}`;
}

function addEntry(e) {
  e.preventDefault();
  const description = document.getElementById("description").value.trim();
  const amount = document.getElementById("amount").value.trim();
  const category = document.getElementById("category").value;
  const type = document.getElementById("type").value;

  console.log(description, amount, category, type);

  if (description && amount && type && category) {
    const entry = {
      description,
      amount,
      category,
      type,
    };
    entries.push(entry);
}
saveEntry();
renderEntry();
updateBalance();
}

function saveEntry() {
    localStorage.setItem("entries", JSON.stringify(entries));
}

function editEntry(index) {
  const entry = entries[index];
  entryForm.description.value = entry.description;
  entryForm.amount.value = entry.amount;
  entryForm.type.value = entry.type;
  entryForm.category.value = entry.category;

  entries.splice(index, 1);
}
function deleteEntry(index) {
  entries.splice(index, 1);
  saveEntry();
  renderEntry();
  updateBalance();
}

function renderEntry() {
  // clearing the entryList
  entryTable.innerHTML = "";

  // again pushing new list
  const filterTypeValue = filterType.value;
  const filterCategoryValue = filterCategory.value;

  entries.forEach((entry, index) => {
    if (
      (entry.type === filterTypeValue || filterTypeValue === "all") &&
      (entry.category === filterCategoryValue || filterCategoryValue === "all")
    ) {
      const row = entryTable.insertRow();
      row.innerHTML = `
            <td>${entry.description}</td>
            <td>${entry.amount}</td>
            <td>${entry.type}</td>
            <td>${entry.category}</td>
            <td>
                <button onClick="editEntry(${index})">Edit</button>
                <button onClick="deleteEntry(${index})">Delete</button>
            </td>
        `;
    }
  });
  entryForm.reset();
}

renderEntry();
updateBalance();
