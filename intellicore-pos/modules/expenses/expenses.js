const EXPENSE_STORAGE_KEY =
    "intellicore_expenses";


const EXPENSE_CATEGORIES = [
    "Rent",
    "Electricity",
    "Water",
    "Internet",
    "Phone",
    "Salaries / Wages",
    "Store Supplies",
    "Packaging Materials",
    "Transportation / Delivery",
    "Fuel",
    "Repairs & Maintenance",
    "Cleaning",
    "Marketing / Advertising",
    "Bank / Payment Fees",
    "Permits / Licenses",
    "Miscellaneous"
];


let expenses =
    JSON.parse(
        localStorage.getItem(
            EXPENSE_STORAGE_KEY
        )
    ) || [];


let currentPage = 1;

const expensesPerPage = 10;


const expenseTableBody =
    document.getElementById(
        "expenseTableBody"
    );

const addExpenseBtn =
    document.getElementById(
        "addExpenseBtn"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const categoryFilter =
    document.getElementById(
        "categoryFilter"
    );

const expensePagination =
    document.getElementById(
        "expensePagination"
    );

const prevPageBtn =
    document.getElementById(
        "prevPageBtn"
    );

const nextPageBtn =
    document.getElementById(
        "nextPageBtn"
    );

const pageNumbers =
    document.getElementById(
        "pageNumbers"
    );


const expenseModal =
    document.getElementById(
        "expenseModal"
    );

const expenseForm =
    document.getElementById(
        "expenseForm"
    );

const closeModalBtn =
    document.getElementById(
        "closeModalBtn"
    );

const cancelBtn =
    document.getElementById(
        "cancelBtn"
    );

const modalTitle =
    document.getElementById(
        "modalTitle"
    );


const expenseId =
    document.getElementById(
        "expenseId"
    );

const expenseDate =
    document.getElementById(
        "expenseDate"
    );

const expenseCategory =
    document.getElementById(
        "expenseCategory"
    );

const expenseDescription =
    document.getElementById(
        "expenseDescription"
    );

const expenseAmount =
    document.getElementById(
        "expenseAmount"
    );

const expensePaymentMethod =
    document.getElementById(
        "expensePaymentMethod"
    );

const expenseReference =
    document.getElementById(
        "expenseReference"
    );

const expenseNotes =
    document.getElementById(
        "expenseNotes"
    );

const deleteExpenseModal =
    document.getElementById(
        "deleteExpenseModal"
    );

const deleteExpenseMessage =
    document.getElementById(
        "deleteExpenseMessage"
    );

const cancelDeleteExpense =
    document.getElementById(
        "cancelDeleteExpense"
    );

const confirmDeleteExpense =
    document.getElementById(
        "confirmDeleteExpense"
    );

const premiumPopup =
    document.getElementById(
        "premiumPopup"
    );

const premiumPopupIcon =
    document.getElementById(
        "premiumPopupIcon"
    );

const premiumPopupTitle =
    document.getElementById(
        "premiumPopupTitle"
    );

const premiumPopupMessage =
    document.getElementById(
        "premiumPopupMessage"
    );

let pendingDeleteExpenseId = null;

function populateExpenseCategories() {

    expenseCategory.innerHTML = "";

    categoryFilter.innerHTML = `
        <option value="all">
            All Categories
        </option>
    `;


    EXPENSE_CATEGORIES.forEach(category => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            category;

        option.textContent =
            category;

        expenseCategory.appendChild(
            option
        );


        const filterOption =
            document.createElement(
                "option"
            );

        filterOption.value =
            category;

        filterOption.textContent =
            category;

        categoryFilter.appendChild(
            filterOption
        );

    });
}

function openExpenseModal() {

    expenseModal.classList.remove(
        "hidden"
    );

}


function closeExpenseModal() {

    expenseModal.classList.add(
        "hidden"
    );

    expenseForm.reset();

    expenseId.value = "";

}


addExpenseBtn.addEventListener(
    "click",
    () => {

        expenseForm.reset();

        expenseId.value = "";

        modalTitle.textContent =
            "Add Expense";


        const today =
            new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                today.getDate()
            ).padStart(2, "0");


        expenseDate.value =
            `${year}-${month}-${day}`;

        expensePaymentMethod.value =
            "Cash";


        openExpenseModal();

    }
);


closeModalBtn.addEventListener(
    "click",
    closeExpenseModal
);


cancelBtn.addEventListener(
    "click",
    closeExpenseModal
);


expenseModal.addEventListener(
    "click",
    event => {

        if (event.target === expenseModal) {

            closeExpenseModal();

        }

    }
);

function saveExpenses() {

    localStorage.setItem(
        EXPENSE_STORAGE_KEY,
        JSON.stringify(expenses)
    );

}


function formatCurrency(value) {

    return `₱${Number(value || 0).toLocaleString(
        "en-PH",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    )}`;

}


function formatExpenseDate(dateValue) {

    if (!dateValue) {
        return "—";
    }

    const date =
        new Date(
            `${dateValue}T00:00:00`
        );

    return date.toLocaleDateString(
        "en-PH",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}


expenseForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const editingId =
            Number(
                expenseId.value
            );


        const expenseData = {

            id:
                editingId ||
                Date.now(),

            date:
                expenseDate.value,

            category:
                expenseCategory.value,

            description:
                expenseDescription.value
                    .trim(),

            amount:
                Number(
                    expenseAmount.value
                ),

            paymentMethod:
                expensePaymentMethod.value,

            reference:
                expenseReference.value
                    .trim(),

            notes:
                expenseNotes.value
                    .trim(),

            createdAt:
                editingId
                    ? expenses.find(
                        item =>
                            item.id === editingId
                    )?.createdAt ||
                    Date.now()
                    : Date.now()

        };


        if (editingId) {

            expenses =
                expenses.map(expense => {

                    return expense.id === editingId
                        ? expenseData
                        : expense;

                });

        }

        else {

            expenses.push(
                expenseData
            );

        }


        saveExpenses();

        currentPage = 1;

        renderExpenses();

        closeExpenseModal();


        showPremiumPopup(
            editingId
                ? "Expense Updated"
                : "Expense Added",

            editingId
                ? "Expense updated successfully."
                : "Expense added successfully.",

            "success"
        );
    }
);

function renderExpenses() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();

    const selectedCategory =
        categoryFilter.value;


    const filteredExpenses =
        expenses
            .filter(expense => {

                const matchesSearch =
                    expense.description
                        .toLowerCase()
                        .includes(searchTerm) ||

                    expense.category
                        .toLowerCase()
                        .includes(searchTerm) ||

                    (expense.reference || "")
                        .toLowerCase()
                        .includes(searchTerm);


                const matchesCategory =
                    selectedCategory === "all" ||
                    expense.category === selectedCategory;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            })
            .sort((a, b) => {

                return new Date(b.date) -
                    new Date(a.date);

            });


    const totalPages =
        Math.ceil(
            filteredExpenses.length /
            expensesPerPage
        );


    if (currentPage > totalPages) {

        currentPage =
            totalPages || 1;

    }


    const startIndex =
        (currentPage - 1) *
        expensesPerPage;

    const endIndex =
        startIndex +
        expensesPerPage;


    const paginatedExpenses =
        filteredExpenses.slice(
            startIndex,
            endIndex
        );


    expenseTableBody.innerHTML = "";


    if (filteredExpenses.length === 0) {

        expenseTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-row">
                    No expenses found.
                </td>
            </tr>
        `;

        expensePagination.style.display =
            "none";

        return;
    }


    paginatedExpenses.forEach(expense => {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>
                ${formatExpenseDate(expense.date)}
            </td>

            <td>
                ${expense.category}
            </td>

            <td>
                ${expense.description}
            </td>

            <td>
                <strong>
                    ${formatCurrency(expense.amount)}
                </strong>
            </td>

            <td>
                ${expense.paymentMethod}
            </td>

            <td>
                ${expense.reference || "—"}
            </td>

            <td>

                <button
                    class="action-btn edit-btn"
                    data-action="edit"
                    data-id="${expense.id}"
                >
                    Edit
                </button>

                <button
                    class="action-btn delete-btn"
                    data-action="delete"
                    data-id="${expense.id}"
                >
                    Delete
                </button>

            </td>

        `;

        expenseTableBody.appendChild(
            row
        );

    });


    renderExpensePagination(
        totalPages
    );

}

function renderExpensePagination(totalPages) {

    pageNumbers.innerHTML = "";

    if (totalPages <= 1) {

        expensePagination.style.display =
            "none";

        return;
    }


    expensePagination.style.display =
        "flex";


    prevPageBtn.disabled =
        currentPage === 1;

    nextPageBtn.disabled =
        currentPage === totalPages;


    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const button =
            document.createElement(
                "button"
            );

        button.type =
            "button";

        button.textContent =
            page;

        button.className =
            page === currentPage
                ? "page-btn active"
                : "page-btn";


        button.addEventListener(
            "click",
            () => {

                currentPage =
                    page;

                renderExpenses();

            }
        );


        pageNumbers.appendChild(
            button
        );
    }
}

prevPageBtn.addEventListener(
    "click",
    () => {

        if (currentPage > 1) {

            currentPage--;

            renderExpenses();

        }

    }
);


nextPageBtn.addEventListener(
    "click",
    () => {

        const searchTerm =
            searchInput.value
                .trim()
                .toLowerCase();

        const selectedCategory =
            categoryFilter.value;


        const filteredExpenses =
            expenses.filter(expense => {

                const matchesSearch =
                    expense.description
                        .toLowerCase()
                        .includes(searchTerm) ||

                    expense.category
                        .toLowerCase()
                        .includes(searchTerm) ||

                    (expense.reference || "")
                        .toLowerCase()
                        .includes(searchTerm);


                const matchesCategory =
                    selectedCategory === "all" ||
                    expense.category === selectedCategory;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            });


        const totalPages =
            Math.ceil(
                filteredExpenses.length /
                expensesPerPage
            );


        if (currentPage < totalPages) {

            currentPage++;

            renderExpenses();

        }

    }
);

searchInput.addEventListener(
    "input",
    () => {

        currentPage = 1;

        renderExpenses();

    }
);


categoryFilter.addEventListener(
    "change",
    () => {

        currentPage = 1;

        renderExpenses();

    }
);

function editExpense(id) {

    const expense =
        expenses.find(
            item => item.id === id
        );


    if (!expense) {
        return;
    }


    expenseId.value =
        expense.id;

    expenseDate.value =
        expense.date;

    expenseCategory.value =
        expense.category;

    expenseDescription.value =
        expense.description;

    expenseAmount.value =
        expense.amount;

    expensePaymentMethod.value =
        expense.paymentMethod;

    expenseReference.value =
        expense.reference || "";

    expenseNotes.value =
        expense.notes || "";


    modalTitle.textContent =
        "Edit Expense";


    openExpenseModal();
}

expenseTableBody.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-action]"
            );


        if (!button) {
            return;
        }


        const action =
            button.dataset.action;

        const id =
            Number(
                button.dataset.id
            );


        if (action === "edit") {

            editExpense(id);

        }

        if (action === "delete") {

            deleteExpense(id);

        }
    }
);

function deleteExpense(id) {

    const expense =
        expenses.find(
            item => item.id === id
        );

    if (!expense) {
        return;
    }

    pendingDeleteExpenseId = id;

    deleteExpenseMessage.textContent =
        `Delete "${expense.description}" expense?`;

    deleteExpenseModal.classList.remove(
        "hidden"
    );
}


cancelDeleteExpense.addEventListener(
    "click",
    () => {

        pendingDeleteExpenseId = null;

        deleteExpenseModal.classList.add(
            "hidden"
        );

    }
);


confirmDeleteExpense.addEventListener(
    "click",
    () => {

        if (pendingDeleteExpenseId === null) {
            return;
        }

        expenses =
            expenses.filter(
                item =>
                    item.id !==
                    pendingDeleteExpenseId
            );

        saveExpenses();

        renderExpenses();

        deleteExpenseModal.classList.add(
            "hidden"
        );

        pendingDeleteExpenseId = null;


        showPremiumPopup(
            "Expense Deleted",
            "Expense deleted successfully.",
            "success"
        );
    }
);


deleteExpenseModal.addEventListener(
    "click",
    event => {

        if (event.target === deleteExpenseModal) {

            pendingDeleteExpenseId = null;

            deleteExpenseModal.classList.add(
                "hidden"
            );

        }

    }
);

function showPremiumPopup(
    title,
    message,
    type = "success"
) {

    premiumPopupTitle.textContent =
        title;

    premiumPopupMessage.textContent =
        message;

    premiumPopup.classList.remove(
        "hidden",
        "success",
        "error"
    );

    premiumPopup.classList.add(
        type
    );

    premiumPopupIcon.textContent =
        type === "success"
            ? "✓"
            : "!";

    setTimeout(() => {

        premiumPopup.classList.add(
            "hidden"
        );

    }, 2200);
}

populateExpenseCategories();

renderExpenses();