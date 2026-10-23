const STORAGE_KEY = "intellicore_categories";

const PRODUCT_STORAGE_KEY =
    "intellicore_grocery_products";


let categories =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || [

        {
            id: 1,
            name: "Beverages",
            description: "Soft drinks, juices, water and other beverages.",
            status: "Active"
        },

        {
            id: 2,
            name: "Snacks",
            description: "Chips, biscuits, crackers and snack products.",
            status: "Active"
        },

        {
            id: 3,
            name: "Canned Goods",
            description: "Canned meat, seafood and preserved food.",
            status: "Active"
        },

        {
            id: 4,
            name: "Rice & Grains",
            description: "Rice, grains and related staple products.",
            status: "Active"
        },

        {
            id: 5,
            name: "Frozen Goods",
            description: "Frozen meat and frozen food products.",
            status: "Active"
        },

        {
            id: 6,
            name: "Dairy",
            description: "Milk, cheese, butter and dairy products.",
            status: "Active"
        },

        {
            id: 7,
            name: "Personal Care",
            description: "Soap, shampoo, toothpaste and hygiene products.",
            status: "Active"
        },

        {
            id: 8,
            name: "Household",
            description: "Cleaning supplies and household products.",
            status: "Active"
        },

        {
            id: 9,
            name: "Condiments",
            description: "Sauces, seasonings and cooking ingredients.",
            status: "Active"
        },

        {
            id: 10,
            name: "Bakery",
            description: "Bread, pastries and bakery products.",
            status: "Active"
        }

    ];

let currentPage = 1;
const categoriesPerPage = 10;

/* ELEMENTS */

const categoryTableBody =
    document.getElementById("categoryTableBody");

const categoryModal =
    document.getElementById("categoryModal");

const categoryForm =
    document.getElementById("categoryForm");

const addCategoryBtn =
    document.getElementById("addCategoryBtn");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const cancelBtn =
    document.getElementById("cancelBtn");

const searchInput =
    document.getElementById("searchInput");

const statusFilter =
    document.getElementById("statusFilter");

const categoryPagination =
    document.getElementById("categoryPagination");

const prevPageBtn =
    document.getElementById("prevPageBtn");

const nextPageBtn =
    document.getElementById("nextPageBtn");

const pageNumbers =
    document.getElementById("pageNumbers");

const premiumPopup =
    document.getElementById("premiumPopup");

const premiumPopupIcon =
    document.getElementById("premiumPopupIcon");

const premiumPopupTitle =
    document.getElementById("premiumPopupTitle");

const premiumPopupMessage =
    document.getElementById("premiumPopupMessage");

const deleteCategoryModal =
    document.getElementById("deleteCategoryModal");

const deleteCategoryMessage =
    document.getElementById("deleteCategoryMessage");

const cancelDeleteCategory =
    document.getElementById("cancelDeleteCategory");

const confirmDeleteCategory =
    document.getElementById("confirmDeleteCategory");

let pendingDeleteCategoryId = null;

const modalTitle =
    document.getElementById("modalTitle");


/* FORM INPUTS */

const categoryId =
    document.getElementById("categoryId");

const categoryName =
    document.getElementById("categoryName");

const categoryDescription =
    document.getElementById("categoryDescription");

const categoryStatus =
    document.getElementById("categoryStatus");

function showPremiumPopup(title, message, type = "success") {

    premiumPopupTitle.textContent = title;
    premiumPopupMessage.textContent = message;

    premiumPopupIcon.textContent =
        type === "success" ? "✓" : "!";

    premiumPopup.classList.remove("success", "error");

    premiumPopup.classList.add(type);

    premiumPopup.classList.remove("hidden");

    setTimeout(() => {
        premiumPopup.classList.add("hidden");
    }, 2200);
}

/* SAVE */

function saveCategories() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(categories)
    );

}


/* RENDER */

function renderCategories() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedStatus =
        statusFilter.value;


    const filteredCategories =
        categories.filter(category => {

            const matchesSearch =
                category.name
                    .toLowerCase()
                    .includes(searchTerm) ||

                category.description
                    .toLowerCase()
                    .includes(searchTerm);


            const matchesStatus =
                selectedStatus === "all" ||
                category.status === selectedStatus;


            return matchesSearch && matchesStatus;

        });


    const totalPages =
        Math.ceil(
            filteredCategories.length /
            categoriesPerPage
        );

    if (currentPage > totalPages) {
        currentPage = totalPages || 1;
    }

    const startIndex =
        (currentPage - 1) *
        categoriesPerPage;

    const endIndex =
        startIndex +
        categoriesPerPage;

    const paginatedCategories =
        filteredCategories.slice(
            startIndex,
            endIndex
        );

    categoryTableBody.innerHTML = "";


    if (filteredCategories.length === 0) {

        categoryTableBody.innerHTML = `
      <tr>
        <td colspan="4" class="empty-row">
          No categories found.
        </td>
      </tr>
    `;

        categoryPagination.style.display = "none";
        return;
    }


    paginatedCategories.forEach(category => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

      <td class="category-name">
        ${category.name}
      </td>


      <td class="description">
        ${category.description || "—"}
      </td>


      <td>

        <span
          class="status ${category.status === "Active"
                ? "status-active"
                : "status-inactive"
            }"
        >
          ${category.status}
        </span>

      </td>


      <td>

        <button
          class="action-btn edit-btn"
          data-action="edit"
          data-id="${category.id}"
        >
          Edit
        </button>


        <button
          class="action-btn delete-btn"
          data-action="delete"
          data-id="${category.id}"
        >
          Delete
        </button>

      </td>

    `;


        categoryTableBody.appendChild(row);

    });

    renderCategoryPagination(totalPages);

}

function renderCategoryPagination(totalPages) {
    pageNumbers.innerHTML = "";

    if (totalPages <= 1) {
        categoryPagination.style.display = "none";
        return;
    }

    categoryPagination.style.display = "flex";

    prevPageBtn.disabled =
        currentPage === 1;

    nextPageBtn.disabled =
        currentPage === totalPages;

    for (let page = 1; page <= totalPages; page++) {
        const button =
            document.createElement("button");

        button.type = "button";
        button.textContent = page;

        button.className =
            page === currentPage
                ? "page-btn active"
                : "page-btn";

        button.addEventListener("click", () => {
            currentPage = page;
            renderCategories();
        });

        pageNumbers.appendChild(button);
    }
}


/* MODAL */

function openModal() {

    categoryModal.classList.remove("hidden");

}


function closeModal() {

    categoryModal.classList.add("hidden");

    categoryForm.reset();

    categoryId.value = "";

}


/* ADD */

addCategoryBtn.addEventListener(
    "click",
    () => {

        categoryForm.reset();

        categoryId.value = "";

        categoryStatus.value = "Active";

        modalTitle.textContent =
            "Add Category";

        openModal();

    }
);


/* CLOSE */

closeModalBtn.addEventListener(
    "click",
    closeModal
);


cancelBtn.addEventListener(
    "click",
    closeModal
);


categoryModal.addEventListener(
    "click",
    event => {

        if (event.target === categoryModal) {

            closeModal();

        }

    }
);


/* SAVE FORM */

categoryForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const editingId =
            Number(categoryId.value);


        const newCategory = {

            id:
                editingId ||
                Date.now(),

            name:
                categoryName.value.trim(),

            description:
                categoryDescription.value.trim(),

            status:
                categoryStatus.value

        };


        /* DUPLICATE CHECK */

        const duplicate =
            categories.some(category => {

                return (
                    category.name.toLowerCase() ===
                    newCategory.name.toLowerCase() &&

                    category.id !== editingId
                );

            });


        if (duplicate) {

            showPremiumPopup(
                "Duplicate Category",
                "Category name already exists.",
                "error"
            );

            return;

        }


        /* EDIT */

        if (editingId) {

            categories =
                categories.map(category => {

                    return category.id === editingId
                        ? newCategory
                        : category;

                });

        }


        /* ADD */

        else {

            categories.push(newCategory);

        }


        saveCategories();

        currentPage = 1;

        renderCategories();

        closeModal();

        showPremiumPopup(
            editingId
                ? "Category Updated"
                : "Category Added",
            editingId
                ? "Category updated successfully."
                : "Category added successfully.",
            "success"
        );

    }
);


/* EDIT */

function editCategory(id) {

    const category =
        categories.find(
            item => item.id === id
        );


    if (!category) {
        return;
    }


    modalTitle.textContent =
        "Edit Category";


    categoryId.value =
        category.id;


    categoryName.value =
        category.name;


    categoryDescription.value =
        category.description;


    categoryStatus.value =
        category.status;


    openModal();

}


/* DELETE */

function deleteCategory(id) {

    const category =
        categories.find(
            item => item.id === id
        );


    if (!category) {
        return;
    }

    const products =
        JSON.parse(
            localStorage.getItem(
                PRODUCT_STORAGE_KEY
            )
        ) || [];

    const productsUsingCategory =
        products.filter(product => {
            return product.category === category.name;
        });

    if (productsUsingCategory.length > 0) {

        showPremiumPopup(
            "Cannot Delete Category",
            `"${category.name}" is used by ${productsUsingCategory.length} product(s). Transfer them to another category before deleting.`,
            "error"
        );

        return;
    }

    pendingDeleteCategoryId = id;

    deleteCategoryMessage.textContent =
        `Delete category "${category.name}"?`;

    deleteCategoryModal.classList.remove("hidden");

}

cancelDeleteCategory.addEventListener("click", () => {
    pendingDeleteCategoryId = null;
    deleteCategoryModal.classList.add("hidden");
});

deleteCategoryModal.addEventListener("click", event => {
    if (event.target === deleteCategoryModal) {
        pendingDeleteCategoryId = null;
        deleteCategoryModal.classList.add("hidden");
    }
});

confirmDeleteCategory.addEventListener("click", () => {

    if (pendingDeleteCategoryId === null) {
        return;
    }

    categories =
        categories.filter(
            item =>
                item.id !== pendingDeleteCategoryId
        );

    saveCategories();

    if (currentPage > Math.ceil(categories.length / categoriesPerPage)) {
        currentPage = Math.max(
            1,
            Math.ceil(categories.length / categoriesPerPage)
        );
    }

    renderCategories();

    deleteCategoryModal.classList.add("hidden");

    pendingDeleteCategoryId = null;

    showPremiumPopup(
        "Category Deleted",
        "Category deleted successfully.",
        "success"
    );
});

/* TABLE BUTTONS */

categoryTableBody.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-action]"
            );


        if (!button) {
            return;
        }


        const id =
            Number(button.dataset.id);


        const action =
            button.dataset.action;


        if (action === "edit") {

            editCategory(id);

        }


        if (action === "delete") {

            deleteCategory(id);

        }

    }
);


searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderCategories();
});

statusFilter.addEventListener("change", () => {
    currentPage = 1;
    renderCategories();
});

prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderCategories();
    }
});

nextPageBtn.addEventListener("click", () => {
    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();

    const selectedStatus =
        statusFilter.value;

    const filteredCategories =
        categories.filter(category => {

            const matchesSearch =
                category.name
                    .toLowerCase()
                    .includes(searchTerm) ||

                category.description
                    .toLowerCase()
                    .includes(searchTerm);

            const matchesStatus =
                selectedStatus === "all" ||
                category.status === selectedStatus;

            return matchesSearch && matchesStatus;
        });

    const totalPages =
        Math.ceil(
            filteredCategories.length /
            categoriesPerPage
        );

    if (currentPage < totalPages) {
        currentPage++;
        renderCategories();
    }
});

/* START */

renderCategories();