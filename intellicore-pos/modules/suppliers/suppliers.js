const STORAGE_KEY = "intellicore_suppliers";

let suppliers =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
        {
            id: 1,
            name: "South Cotabato Grocery Trading",
            contactPerson: "Juan Dela Cruz",
            phone: "09171234567",
            email: "sales@example.com",
            address: "Koronadal City, South Cotabato",
            status: "Active"
        },
        {
            id: 2,
            name: "Mindanao Beverage Distributor",
            contactPerson: "Maria Santos",
            phone: "09181234567",
            email: "orders@example.com",
            address: "General Santos City",
            status: "Active"
        }
    ];

let currentPage = 1;
const suppliersPerPage = 10;

/* ELEMENTS */

const supplierTableBody =
    document.getElementById("supplierTableBody");

const supplierModal =
    document.getElementById("supplierModal");

const supplierForm =
    document.getElementById("supplierForm");

const addSupplierBtn =
    document.getElementById("addSupplierBtn");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const cancelBtn =
    document.getElementById("cancelBtn");

const searchInput =
    document.getElementById("searchInput");

const statusFilter =
    document.getElementById("statusFilter");

const supplierPagination =
    document.getElementById("supplierPagination");

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

const deleteSupplierModal =
    document.getElementById("deleteSupplierModal");

const deleteSupplierMessage =
    document.getElementById("deleteSupplierMessage");

const cancelDeleteSupplier =
    document.getElementById("cancelDeleteSupplier");

const confirmDeleteSupplier =
    document.getElementById("confirmDeleteSupplier");

let pendingDeleteSupplierId = null;

function showPremiumPopup(
    title,
    message,
    type = "success"
) {
    if (
        !premiumPopup ||
        !premiumPopupIcon ||
        !premiumPopupTitle ||
        !premiumPopupMessage
    ) {
        return;
    }

    premiumPopupTitle.textContent = title;
    premiumPopupMessage.textContent = message;

    premiumPopup.classList.remove(
        "hidden",
        "error"
    );

    if (type === "error") {
        premiumPopup.classList.add("error");
        premiumPopupIcon.textContent = "!";
    } else {
        premiumPopupIcon.textContent = "✓";
    }

    clearTimeout(premiumPopup.hideTimer);

    premiumPopup.hideTimer = setTimeout(() => {
        premiumPopup.classList.add("hidden");
    }, 2200);
}

const modalTitle =
    document.getElementById("modalTitle");


/* FORM FIELDS */

const supplierId =
    document.getElementById("supplierId");

const supplierName =
    document.getElementById("supplierName");

const contactPerson =
    document.getElementById("contactPerson");

const supplierPhone =
    document.getElementById("supplierPhone");

const supplierEmail =
    document.getElementById("supplierEmail");

const supplierAddress =
    document.getElementById("supplierAddress");

const supplierStatus =
    document.getElementById("supplierStatus");


/* SAVE */

function saveSuppliers() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(suppliers)
    );

}


/* RENDER */

function renderSuppliers() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedStatus =
        statusFilter.value;


    const filteredSuppliers =
        suppliers.filter(supplier => {

            const searchableText = `
        ${supplier.name}
        ${supplier.contactPerson}
        ${supplier.phone}
        ${supplier.email}
        ${supplier.address}
      `.toLowerCase();


            const matchesSearch =
                searchableText.includes(searchTerm);


            const matchesStatus =
                selectedStatus === "all" ||
                supplier.status === selectedStatus;


            return matchesSearch && matchesStatus;

        });

    const totalPages =
        Math.ceil(
            filteredSuppliers.length /
            suppliersPerPage
        );

    if (currentPage > totalPages) {
        currentPage = totalPages || 1;
    }

    const startIndex =
        (currentPage - 1) *
        suppliersPerPage;

    const endIndex =
        startIndex +
        suppliersPerPage;

    const paginatedSuppliers =
        filteredSuppliers.slice(
            startIndex,
            endIndex
        );


    supplierTableBody.innerHTML = "";


    if (filteredSuppliers.length === 0) {

        supplierTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-row">
          No suppliers found.
        </td>
      </tr>
    `;

        supplierPagination.style.display = "none";

        return;
    }


    paginatedSuppliers.forEach(supplier => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

      <td class="supplier-name">
        ${supplier.name}
      </td>

      <td>
        ${supplier.contactPerson || "—"}
      </td>

      <td>
        ${supplier.phone || "—"}
      </td>

      <td>
        ${supplier.email || "—"}
      </td>

      <td class="muted">
        ${supplier.address || "—"}
      </td>

      <td>

        <span
          class="status ${supplier.status === "Active"
                ? "status-active"
                : "status-inactive"
            }"
        >
          ${supplier.status}
        </span>

      </td>

      <td>

        <button
          class="action-btn edit-btn"
          data-action="edit"
          data-id="${supplier.id}"
        >
          Edit
        </button>

        <button
          class="action-btn delete-btn"
          data-action="delete"
          data-id="${supplier.id}"
        >
          Delete
        </button>

      </td>

    `;


        supplierTableBody.appendChild(row);

    });

    renderSupplierPagination(totalPages);

}


function renderSupplierPagination(totalPages) {
    pageNumbers.innerHTML = "";

    if (totalPages <= 1) {
        supplierPagination.style.display = "none";
        return;
    }

    supplierPagination.style.display = "flex";

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
            renderSuppliers();
        });

        pageNumbers.appendChild(button);
    }
}

/* MODAL */

function openModal() {

    supplierModal.classList.remove("hidden");

}


function closeModal() {

    supplierModal.classList.add("hidden");

    supplierForm.reset();

    supplierId.value = "";

}


/* ADD SUPPLIER */

addSupplierBtn.addEventListener(
    "click",
    () => {

        supplierForm.reset();

        supplierId.value = "";

        supplierStatus.value = "Active";

        modalTitle.textContent =
            "Add Supplier";

        openModal();

    }
);


/* CLOSE MODAL */

closeModalBtn.addEventListener(
    "click",
    closeModal
);


cancelBtn.addEventListener(
    "click",
    closeModal
);


supplierModal.addEventListener(
    "click",
    event => {

        if (event.target === supplierModal) {

            closeModal();

        }

    }
);


/* FORM SUBMIT */

supplierForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const editingId =
            Number(supplierId.value);


        const supplierData = {

            id:
                editingId || Date.now(),

            name:
                supplierName.value.trim(),

            contactPerson:
                contactPerson.value.trim(),

            phone:
                supplierPhone.value.trim(),

            email:
                supplierEmail.value.trim(),

            address:
                supplierAddress.value.trim(),

            status:
                supplierStatus.value

        };


        /* DUPLICATE SUPPLIER NAME */

        const duplicate =
            suppliers.some(supplier => {

                return (
                    supplier.name.toLowerCase() ===
                    supplierData.name.toLowerCase() &&

                    supplier.id !== editingId
                );

            });


        if (duplicate) {

            showPremiumPopup(
                "Duplicate Supplier",
                "Supplier name already exists.",
                "error"
            );

            return;

        }


        /* EDIT */

        if (editingId) {

            suppliers =
                suppliers.map(supplier => {

                    return supplier.id === editingId
                        ? supplierData
                        : supplier;

                });

        }


        /* ADD */

        else {

            suppliers.push(supplierData);

        }

        saveSuppliers();

        currentPage = 1;

        closeModal();

        showPremiumPopup(
            editingId
                ? "Supplier Updated"
                : "Supplier Added",
            editingId
                ? "Supplier updated successfully."
                : "Supplier added successfully.",
            "success"
        );

        renderSuppliers();

    }
);


/* EDIT */

function editSupplier(id) {

    const supplier =
        suppliers.find(
            item => item.id === id
        );


    if (!supplier) {
        return;
    }


    modalTitle.textContent =
        "Edit Supplier";


    supplierId.value =
        supplier.id;


    supplierName.value =
        supplier.name;


    contactPerson.value =
        supplier.contactPerson || "";


    supplierPhone.value =
        supplier.phone || "";


    supplierEmail.value =
        supplier.email || "";


    supplierAddress.value =
        supplier.address || "";


    supplierStatus.value =
        supplier.status;


    openModal();

}


/* DELETE */

function deleteSupplier(id) {

    const supplier =
        suppliers.find(
            item => item.id === id
        );


    if (!supplier) {
        return;
    }

    pendingDeleteSupplierId = id;

    deleteSupplierMessage.textContent =
        `Delete supplier "${supplier.name}"?`;

    deleteSupplierModal.classList.remove("hidden");

}

cancelDeleteSupplier.addEventListener("click", () => {
    pendingDeleteSupplierId = null;
    deleteSupplierModal.classList.add("hidden");
});

deleteSupplierModal.addEventListener("click", event => {
    if (event.target === deleteSupplierModal) {
        pendingDeleteSupplierId = null;
        deleteSupplierModal.classList.add("hidden");
    }
});

confirmDeleteSupplier.addEventListener("click", () => {

    if (pendingDeleteSupplierId === null) {
        return;
    }

    suppliers =
        suppliers.filter(
            item =>
                item.id !== pendingDeleteSupplierId
        );

    saveSuppliers();

    renderSuppliers();

    deleteSupplierModal.classList.add("hidden");

    pendingDeleteSupplierId = null;

    showPremiumPopup(
        "Supplier Deleted",
        "Supplier deleted successfully.",
        "success"
    );
});

/* TABLE ACTIONS */

supplierTableBody.addEventListener(
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

            editSupplier(id);

        }


        if (action === "delete") {

            deleteSupplier(id);

        }

    }
);


/* SEARCH */

searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderSuppliers();
});

statusFilter.addEventListener("change", () => {
    currentPage = 1;
    renderSuppliers();
});

prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderSuppliers();
    }
});

nextPageBtn.addEventListener("click", () => {
    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();

    const selectedStatus =
        statusFilter.value;

    const filteredSuppliers =
        suppliers.filter(supplier => {

            const searchableText = `
                ${supplier.name}
                ${supplier.contactPerson}
                ${supplier.phone}
                ${supplier.email}
                ${supplier.address}
            `.toLowerCase();

            const matchesSearch =
                searchableText.includes(searchTerm);

            const matchesStatus =
                selectedStatus === "all" ||
                supplier.status === selectedStatus;

            return matchesSearch && matchesStatus;
        });

    const totalPages =
        Math.ceil(
            filteredSuppliers.length /
            suppliersPerPage
        );


    if (currentPage < totalPages) {
        currentPage++;
        renderSuppliers();
    }
});

/* INITIAL LOAD */

renderSuppliers();