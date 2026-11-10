
let budget = Number(localStorage.getItem("budget")) || 0;

let transactions = JSON.parse(
    localStorage.getItem("transactions") || "[]"
);

function saveData() {
    localStorage.setItem("budget", budget);
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}

function setBudget() {
    const input = document.getElementById("budgetInput");
    const amount = Number(input.value);

    if (input.value.trim() === "" || !Number.isFinite(amount) || amount < 0) {
        alert("Please enter a valid budget.");
        return;
    }

    budget = amount;
    saveData();
    updateDashboard();

    input.value = "";
}

document.getElementById("transactionForm")
    .addEventListener("submit", function(event) {

    event.preventDefault();

    const description = document.getElementById("description").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;

    if (!description || !Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid description and amount.");
        return;
    }

    const transaction = {
        id: Date.now(),
        description: description,
        amount: amount,
        type: type,
        category: category
    };

    transactions.push(transaction);

    saveData();
    updateDashboard();

    this.reset();
});

function deleteTransaction(id) {
    transactions = transactions.filter(
        transaction => transaction.id !== id
    );

    saveData();
    updateDashboard();
}

function updateDashboard() {

    let income = 0;
    let expenses = 0;

    transactions.forEach(transaction => {
        if (transaction.type === "income") {
            income += transaction.amount;
        } else {
            expenses += transaction.amount;
        }
    });

    const balance = budget + income - expenses;

    document.getElementById("totalBudget").textContent =
        "KSh " + budget.toLocaleString();

    document.getElementById("totalIncome").textContent =
        "KSh " + income.toLocaleString();

    document.getElementById("totalExpenses").textContent =
        "KSh " + expenses.toLocaleString();

    document.getElementById("balance").textContent =
        "KSh " + balance.toLocaleString();

    const transactionList =
        document.getElementById("transactionList");

    transactionList.innerHTML = "";

    transactions.forEach(transaction => {

        const row = document.createElement("tr");

        const values = [
            transaction.description,
            transaction.category,
            transaction.type,
            "KSh " + transaction.amount.toLocaleString()
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.addEventListener("click", () => {
            deleteTransaction(transaction.id);
        });

        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        transactionList.appendChild(row);
    });
}

// Load saved data when the page opens
updateDashboard();
