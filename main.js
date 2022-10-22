const form = document.getElementById('transactionForm')
const shareForm = document.getElementById('sharesForm')

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let expenseFormData = new FormData(form);
    let transactionObject = convertToObject(expenseFormData);

    if (transactionObject["type"] != "" && transactionObject["category"] != "" && transactionObject["description"] != "" && transactionObject["amount"] != "" && transactionObject["shares"] != "") {
        saveTransactionObject(transactionObject);
        insertRowHistoryTable(transactionObject);
    }
    form.reset()
})

function escribirHola (){
    
}

document.addEventListener("DOMContentLoaded", (e) => {
    let historyStorageArray = JSON.parse(localStorage.getItem("historyData"));
    if (!(historyStorageArray == null)) {
        historyStorageArray.forEach((expense) => {
            insertRowHistoryTable(expense);

        })
    }
    updateBalanceAmount()
})

function shareCalculation(e){
    e.preventDefault()
    let shareCalculationFormData = new FormData(shareForm);
    let calculationSharesResult = document.getElementById("shareCalculationResult")
    let sharesS = shareCalculationFormData.get("totalCalculationShares") 
    sharesS = JSON.parse(sharesS)
    let amountS = shareCalculationFormData.get("shareCalculationAmount")
    amountS = JSON.parse(amountS)
    result = amountS/sharesS

    if(sharesS==0){
        calculationSharesResult.innerText = "Imposible dividir por cero"
    }else{
        calculationSharesResult.innerText = `Pagando en ${sharesS} cuota/s va a abonar $${result} por mes`;
    }
}

function updateBalanceAmount(){
    let historyStorageArray = JSON.parse(localStorage.getItem("historyData"));
    let totalAmount = 0;
    if (!(historyStorageArray == null)) {
        historyStorageArray.forEach((expense) => {
            actualAmount = parseFloat(expense.amount)
            if(expense.type == "Egreso"){
                totalAmount = totalAmount - actualAmount
            }else if(expense.type == "Ingreso"){
                totalAmount = totalAmount + actualAmount
            }
        })
    }
    let balanceRef = document.getElementById("money_balance");
    balanceRef.textContent = `Balance: ${totalAmount}`;
}

function insertRowHistoryTable(transactionObject) {
    let historyTableRef = document.getElementById("historyTable");
    let newTransactionRow = historyTableRef.insertRow(1);
    newTransactionRow.setAttribute("transactionID", transactionObject["id"])

    let newTypeCell = newTransactionRow.insertCell(0);
    newTypeCell.textContent = transactionObject["type"]

    let newCategoryCell = newTransactionRow.insertCell(1);
    newCategoryCell.textContent = transactionObject["category"]

    let newDescriptionCell = newTransactionRow.insertCell(2);
    newDescriptionCell.textContent = transactionObject["description"]

    let newAmountCell = newTransactionRow.insertCell(3);
    newAmountCell.textContent = transactionObject["amount"]

    let newSharesCell = newTransactionRow.insertCell(4);
    newSharesCell.textContent = transactionObject["shares"]

    let newDeleteCell = newTransactionRow.insertCell(5);
    let deleteButton = document.createElement("Button");
    newDeleteCell.setAttribute("Class", "actionButtons")
    deleteButton.textContent = "Eliminar";
    newDeleteCell.appendChild(deleteButton);
    deleteButton.addEventListener("click", (e) => {
        let deleteRow = e.target.parentNode.parentNode
        let deleteId = deleteRow.getAttribute("transactionID")
        deleteRow.remove();
        deleteTransactionObject(deleteId)
    })

}

function deleteTransactionObject(id) {
    let historyArray = JSON.parse(localStorage.getItem("historyData"));
    let indexTransaction = historyArray.findIndex(e => e.id == id);
    historyArray.splice(indexTransaction, 1);
    let historyArrayJSON = JSON.stringify(historyArray);
    localStorage.setItem("historyData", historyArrayJSON)
    updateBalanceAmount()
}

function saveTransactionObject(transactionObject) {
    let historyArray = JSON.parse(localStorage.getItem("historyData"));
    if (historyArray == null) {
        historyArray = [];
    }
    historyArray.push(transactionObject);

    let historyArrayJSON = JSON.stringify(historyArray);
    localStorage.setItem("historyData", historyArrayJSON)
    updateBalanceAmount()
}

function createNewId() {
    let lastId = localStorage.getItem("lastTransactionId") || "-1";
    let newId = JSON.parse(lastId) + 1;
    localStorage.setItem("lastTransactionId", JSON.stringify(newId));
    return newId;
}

function convertToObject(expenseFormData) {
    let type = "";
    if (expenseFormData.get("transactionType") == "income") {
        type = "Ingreso";
    } else if (expenseFormData.get("transactionType") == "expense") {
        type = "Egreso";
    }
    let category = expenseFormData.get("transactionCategory")
    let description = expenseFormData.get("transactionDescription")
    let amount = expenseFormData.get("transactionAmount")
    let shares = expenseFormData.get("transactionShares")
    let id = createNewId();
    return {
        "id": id,
        "type": type,
        "category": category,
        "description": description,
        "amount": amount,
        "shares": shares
    }
}























const expenses = [
    { id: 0, type: 'Egreso', category: 'Ropa', description: 'Remera', amount: 5000, shares: 3 },
    { id: 1, type: 'Egreso', category: 'Ropa', description: 'Pantalon', amount: 7500, shares: 1 },
    { id: 1, type: 'Ingreso', category: 'Ropa', description: 'Pantalon', amount: 7500, shares: 1 },
    { id: 1, type: 'Egreso', category: 'Ropa', description: 'Pantalon', amount: 7500, shares: 1 },
    { id: 2, type: 'Egreso', category: 'Comida', description: 'Hamburguesa', amount: 2500, shares: 3 },
    { id: 3, type: 'Ingreso', category: 'Salario', description: 'Sueldo mes Agosto', amount: 100000, shares: 1 },
    { id: 4, type: 'Ingreso', category: 'Inversiones', description: 'Recuperación de interés', amount: 15000, shares: 1 }
]

const shares = [1, 3, 6, 9, 12]

function manageAccount() {
    let total = 0;
    let selectedOption = prompt("1 - Agregar gasto\n2 - Agregar ingreso\n3 - Consultar saldos\n4 - Calcular cuotas\n5 - Ver categorías\n6 - Mostrar gastos por categoría\n7 - Salir");
    while (selectedOption != 7) {
        switch (selectedOption) {
            case "1":
                addExpense()
                break;
            case "2":
                addIncome()
                break;
            case "3":
                calculateBalance()
                break;
            case "4":
                showShares()
                break;
            case "5":
                showCategories()
                break;
            case "6":
                let category = validateStringEntry("Consultar el monto por categoría")
                showCategoryDetails(category)
                break;
            case "7":
                break;
            default:
                console.log("Opción errónea!")
                break;
        }
        selectedOption = prompt("1 - Agregar gasto\n2 - Agregar ingreso\n3 - Consultar saldos\n4 - Calcular cuotas\n5 - Ver categorías\n6 - Mostrar gastos por categoría\n7 - Salir")
    }
}


function Expense(id, type, category, description, amount, shares) {
    this.id = id;
    this.type = type;
    this.category = category;
    this.description = description;
    this.amount = amount;
    this.shares = shares;
}

function addExpense() {
    let id = expenses[expenses.length - 1] + 1;
    let type = "Egreso";
    let category = validateStringEntry("Ingrese la categoría del gasto:");
    let description = validateStringEntry("Ingrese la descripción del gasto:");
    let expenseAmount = validateFloatEntry("Ingrese el monto del gasto:");
    if (calculateAmount() > expenseAmount) {
        let amount = expenseAmount
        let shares = prompt("Ingrese la cantidad de cuotas del gasto:");
        const newExpense = new Expense(id, type, category, description, amount, shares)
        expenses.push(newExpense)
    } else {
        alert("No te alcanza la plata para este gasto!")
    }
}

function addIncome() {
    let id = expenses[expenses.length - 1].id + 1;
    let type = "Ingreso";
    let category = validateStringEntry("Ingrese la categoría del ingreso:");
    let description = validateStringEntry("Ingrese la descripción del ingreso:");
    let amount = validateFloatEntry("Ingrese el monto del ingreso:");
    let shares = 1;
    const newIncome = new Expense(id, type, category, description, amount, shares)
    expenses.push(newIncome)
}

function calculateBalance() {
    alert(
        `El monto actual que tiene es de ${calculateAmount()} y podés gastarlo de la siguiente manera en cuotas\n${calculateShares(calculateAmount())}\nTenés un total de ${calculateAmount("c")} a pagar en cuotas`
    )
}

function showShares() {
    let amount = prompt("¿Cuanto cuesta lo que deseas comprar?")
    amount = parseFloat(amount)
    amountInAccount = parseFloat(calculateAmount())
    if (amountInAccount >= amount) {
        alert(`Podes gastar los ${amount} de la siguiente manera\n${calculateShares(amount)}`)
    } else {
        alert(`No tenes suficiente dinero para hacer este gasto tu saldo es de $ ${amountInAccount}`)

    }
}

function calculateShares(amount) {
    let text = ""
    let shareAmount = 0
    shares.forEach(e => {
        shareAmount = Math.round(amount / e)
        if (text != "") {
            text = `${text}\nEn ${e} cuotas abonarías ${shareAmount} por mes`
        } else {
            text = `En ${e} cuota abonarías ${shareAmount} por mes`
        }
    });
    return text
}

function showCategories() {
    let text = "Las categorías creadas hasta ahora son\n"
    let uniqueCategories = []
    expenses.forEach(e => {
        if (!uniqueCategories.includes(e.category)) {
            uniqueCategories.push(e.category)
            text = `${text} -${e.category} con un monto total de ${showBalanceByCategory(e.category)}\n`
        }
    });
    alert(text)
}

function showBalanceByCategory(category) {
    let categoryAmount = 0
    createCategoriesArray(category).forEach(e => {
        actualAmount = parseFloat(e.amount)
        if (e.type == "Egreso") {
            categoryAmount = categoryAmount - actualAmount
        } else if (e.type == "Ingreso") {
            categoryAmount = categoryAmount + actualAmount
        }
    });
    return categoryAmount
}

function createCategoriesArray(category) {
    return expenses.filter(exp => exp.category == category)
}

function showCategoryDetails(category) {
    let arrayCat = []
    arrayCat = createCategoriesArray(category)
    let text = `La categoría ${category} tiene un total de ${arrayCat.length} gastos`
    arrayCat.forEach(e => {
        if (e.type == "Egreso") {
            text = `${text}\nEl gasto de ${e.description} por un monto de ${e.amount} a pagar en ${e.shares} cuota/s`
        } else if (e.type == "Ingreso") {
            text = `${text}\nEl ingreso de ${e.description} por un monto de ${e.amount}`
        }
    });
    alert(text)
}

function calculateAmount(option = "") {
    let totalAmount = 0;
    if (option == "c") {
        expenses.forEach(e => {
            actualAmount = parseFloat(e.amount)
            if (e.shares != 1) {
                if (e.type == "Egreso") {
                    totalAmount = totalAmount + actualAmount
                }
            }
        });
    } else {
        expenses.forEach(e => {
            actualAmount = parseFloat(e.amount)
            if (e.type == "Egreso") {
                totalAmount = totalAmount - actualAmount
            } else if (e.type == "Ingreso") {
                totalAmount = totalAmount + actualAmount
            }
        });
    }
    return totalAmount;
}

function validateStringEntry(text) {
    let value = prompt(text)
    while (value == "") {
        value = prompt("El campo no puede estar vacío!")
    }
    return value;
}

function validateFloatEntry(text) {
    let value = prompt(text)
    while (isNaN(parseFloat(value)) || value == "") {
        value = prompt("El campo debe ser numérico y no puede estar vacío!")
        value = parseFloat(value)
    }
    return value;
}

function validateIntEntry(text) {
    let value = prompt(text)
    while (isNaN(parseInt(value)) || value == "") {
        value = prompt("El campo debe ser numérico y no puede estar vacío!")
        value = parseInt(value)
    }
    return value;
}