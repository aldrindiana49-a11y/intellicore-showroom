const CUSTOMER_STORAGE_KEY =
    "intellicore_customers";


let customers =
    JSON.parse(
        localStorage.getItem(CUSTOMER_STORAGE_KEY)
    ) || [
        {
            id: 1,
            firstName: "Juan",
            lastName: "Dela Cruz",
            phone: "09171234567",
            email: "juan@example.com",
            address: "Koronadal City",
            type: "Regular",
            loyaltyPoints: 120,
            status: "Active"
        },

        {
            id: 2,
            firstName: "Maria",
            lastName: "Santos",
            phone: "09181234567",
            email: "maria@example.com",
            address: "General Santos City",
            type: "VIP",
            loyaltyPoints: 560,
            status: "Active"
        }
    ];


/* ELEMENTS */

const totalCustomers =
    document.getElementById("totalCustomers");

const activeCustomers =
    document.getElementById("activeCustomers");

const vipCustomers =
    document.getElementById("vipCustomers");

const totalLoyaltyPoints =
    document.getElementById("totalLoyaltyPoints");

const searchInput =
    document.getElementById("searchInput");

const typeFilter =
    document.getElementById("typeFilter");

const statusFilter =
    document.getElementById("statusFilter");

const customerTableBody =
    document.getElementById("customerTableBody");

const customerPagination =
    document.getElementById("customerPagination");

const prevCustomerPageBtn =
    document.getElementById("prevCustomerPageBtn");

const nextCustomerPageBtn =
    document.getElementById("nextCustomerPageBtn");

const customerPageNumbers =
    document.getElementById("customerPageNumbers");

let currentCustomerPage = 1;

const customersPerPage = 10;

const customerModal =
    document.getElementById("customerModal");

const customerForm =
    document.getElementById("customerForm");

const modalTitle =
    document.getElementById("modalTitle");

const addCustomerBtn =
    document.getElementById("addCustomerBtn");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const cancelBtn =
    document.getElementById("cancelBtn");


/* FORM FIELDS */

const customerId =
    document.getElementById("customerId");

const firstName =
    document.getElementById("firstName");

const lastName =
    document.getElementById("lastName");

const customerPhone =
    document.getElementById("customerPhone");

const customerEmail =
    document.getElementById("customerEmail");

const customerAddress =
    document.getElementById("customerAddress");

const customerType =
    document.getElementById("customerType");

const loyaltyPoints =
    document.getElementById("loyaltyPoints");

const customerStatus =
    document.getElementById("customerStatus");

const customerPhoto =
    document.getElementById("customerPhoto");

const customerPhotoPreview =
    document.getElementById("customerPhotoPreview");

const memberId =
    document.getElementById("memberId");

const customerBarcode =
    document.getElementById("customerBarcode");

const generateBarcodeBtn =
    document.getElementById("generateBarcodeBtn");

const premiumPopup =
    document.getElementById("premiumPopup");

const premiumPopupIcon =
    document.getElementById("premiumPopupIcon");

const premiumPopupTitle =
    document.getElementById("premiumPopupTitle");

const premiumPopupMessage =
    document.getElementById("premiumPopupMessage");

const deleteCustomerModal =
    document.getElementById("deleteCustomerModal");

const deleteCustomerMessage =
    document.getElementById("deleteCustomerMessage");

const cancelDeleteCustomer =
    document.getElementById("cancelDeleteCustomer");

const confirmDeleteCustomer =
    document.getElementById("confirmDeleteCustomer");

let pendingDeleteCustomerId = null;

function generateMemberId() {

    let highestNumber = 0;

    customers.forEach(customer => {

        const match =
            String(customer.memberId || "")
                .match(/^VIP-(\d+)$/);

        if (match) {

            const number =
                Number(match[1]);

            if (number > highestNumber) {

                highestNumber = number;

            }

        }

    });

    const nextNumber =
        highestNumber + 1;

    return (
        "VIP-" +
        String(nextNumber)
            .padStart(6, "0")
    );

}

function generateCustomerBarcode() {

    let barcode;

    do {

        barcode =
            "29" +
            String(
                Math.floor(
                    Math.random() * 10000000000
                )
            ).padStart(10, "0");

    } while (
        customers.some(customer =>
            String(customer.barcode || "") === barcode
        )
    );

    customerBarcode.value = barcode;

}

/* SAVE */

function saveCustomers() {

    localStorage.setItem(
        CUSTOMER_STORAGE_KEY,
        JSON.stringify(customers)
    );

}

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

    premiumPopup.hideTimer =
        setTimeout(() => {
            premiumPopup.classList.add("hidden");
        }, 2200);
}

/* STATS */

function renderStats() {

    totalCustomers.textContent =
        customers.length;


    activeCustomers.textContent =
        customers.filter(customer => {
            return customer.status === "Active";
        }).length;


    vipCustomers.textContent =
        customers.filter(customer => {
            return customer.type === "VIP";
        }).length;


    const totalPoints =
        customers.reduce(
            (sum, customer) => {
                return sum +
                    Number(customer.loyaltyPoints || 0);
            },
            0
        );


    totalLoyaltyPoints.textContent =
        totalPoints.toLocaleString("en-PH");

}


/* RENDER CUSTOMERS */

function renderCustomers() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedType =
        typeFilter.value;


    const selectedStatus =
        statusFilter.value;


    const filteredCustomers =
        customers.filter(customer => {

            const fullName =
                `${customer.firstName} ${customer.lastName}`;


            const searchableText = `
            ${fullName}
            ${customer.memberId || ""}
            ${customer.barcode || ""}
            ${customer.phone || ""}
            ${customer.email || ""}
            ${customer.address || ""}
            `.toLowerCase();


            const matchesSearch =
                searchableText.includes(searchTerm);


            const matchesType =
                selectedType === "all" ||
                customer.type === selectedType;


            const matchesStatus =
                selectedStatus === "all" ||
                customer.status === selectedStatus;


            return (
                matchesSearch &&
                matchesType &&
                matchesStatus
            );

        });


    customerTableBody.innerHTML = "";


    if (filteredCustomers.length === 0) {

        customerTableBody.innerHTML = `
      <tr>
        <td
          colspan="10"
          class="empty-row"
        >
          No customers found.
        </td>
      </tr>
    `;

        return;

    }

    const totalCustomerPages =
        Math.ceil(
            filteredCustomers.length /
            customersPerPage
        );

    renderCustomerPagination(
        totalCustomerPages
    );

    if (currentCustomerPage > totalCustomerPages) {
        currentCustomerPage =
            totalCustomerPages || 1;
    }

    const startIndex =
        (currentCustomerPage - 1) *
        customersPerPage;

    const endIndex =
        startIndex +
        customersPerPage;

    const paginatedCustomers =
        filteredCustomers.slice(
            startIndex,
            endIndex
        );

    paginatedCustomers.forEach(customer => {

        const row =
            document.createElement("tr");


        const fullName =
            `${customer.firstName} ${customer.lastName}`;


        row.innerHTML = `

<td>
    ${customer.photo
                ? `
                <img
                    src="${customer.photo}"
                    alt="${fullName}"
                    class="customer-table-photo"
                />
              `
                : `
                <div class="customer-photo-placeholder">
                    ${customer.firstName?.charAt(0) || "?"}
                </div>
              `
            }
</td>

      <td class="customer-name">
        ${fullName}
      </td>

    <td>
        ${customer.memberId || "—"}
     </td>

      <td>
        ${customer.phone || "—"}
      </td>


      <td>
        ${customer.email || "—"}
      </td>


      <td class="muted">
        ${customer.address || "—"}
      </td>


      <td>

        <span
          class="type-badge type-${customer.type.toLowerCase()}"
        >
          ${customer.type}
        </span>

      </td>


      <td>
        ${Number(
                customer.loyaltyPoints || 0
            ).toLocaleString("en-PH")}
      </td>


      <td>

        <span
          class="status ${customer.status === "Active"
                ? "status-active"
                : "status-inactive"
            }"
        >
          ${customer.status}
        </span>

      </td>


      <td>

        <button
          class="action-btn edit-btn"
          data-action="edit"
          data-id="${customer.id}"
        >
          Edit
        </button>


        <button
          class="action-btn delete-btn"
          data-action="delete"
          data-id="${customer.id}"
        >
          Delete
        </button>

      </td>

    `;


        customerTableBody.appendChild(row);

    });

}

function renderCustomerPagination(totalPages) {

    customerPageNumbers.innerHTML = "";

    totalPages = Math.max(totalPages, 1);

    customerPagination.style.display = "flex";

    customerPagination.style.display = "flex";

    prevCustomerPageBtn.disabled =
        currentCustomerPage === 1;

    nextCustomerPageBtn.disabled =
        currentCustomerPage === totalPages;

    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const button =
            document.createElement("button");

        button.type = "button";
        button.textContent = page;

        if (page === currentCustomerPage) {
            button.classList.add("active");
        }

        button.addEventListener(
            "click",
            () => {

                currentCustomerPage = page;

                renderCustomers();

            }
        );

        customerPageNumbers.appendChild(button);
    }
}

/* OPEN MODAL */

function openModal() {

    customerModal.classList.remove("hidden");

}


/* CLOSE MODAL */

function closeModal() {

    customerModal.classList.add("hidden");

    customerForm.reset();

    customerId.value = "";


}


/* ADD CUSTOMER */

addCustomerBtn.addEventListener(
    "click",
    () => {

        customerForm.reset();

        customerId.value = "";

        customerType.value = "Regular";

        customerStatus.value = "Active";

        loyaltyPoints.value = 0;

        memberId.value =
            generateMemberId();

        customerBarcode.value = "";

        customerPhotoPreview.src = "";

        customerPhotoPreview.style.display =
            "none";

        modalTitle.textContent =
            "Add Customer";

        openModal();

    }
);


/* EDIT CUSTOMER */

function editCustomer(id) {

    const customer =
        customers.find(item => {
            return Number(item.id) === Number(id);
        });


    if (!customer) {
        return;
    }


    modalTitle.textContent =
        "Edit Customer";


    customerId.value =
        customer.id;

    memberId.value =
        customer.memberId || "";

    customerBarcode.value =
        customer.barcode || "";

    if (customer.photo) {

        customerPhotoPreview.src =
            customer.photo;

        customerPhotoPreview.style.display =
            "block";

    } else {

        customerPhotoPreview.src = "";

        customerPhotoPreview.style.display =
            "none";

    }


    firstName.value =
        customer.firstName;


    lastName.value =
        customer.lastName;


    customerPhone.value =
        customer.phone || "";


    customerEmail.value =
        customer.email || "";


    customerAddress.value =
        customer.address || "";


    customerType.value =
        customer.type;


    loyaltyPoints.value =
        Number(customer.loyaltyPoints || 0);


    customerStatus.value =
        customer.status;


    openModal();

}


/* DELETE CUSTOMER */

function deleteCustomer(id) {

    const customer =
        customers.find(item => {
            return Number(item.id) === Number(id);
        });


    if (!customer) {
        return;
    }


    const fullName =
        `${customer.firstName} ${customer.lastName}`;


    deleteCustomerMessage.textContent =
        `Are you sure you want to delete "${fullName}"?`;

    deleteCustomerModal.classList.remove("hidden");

    pendingDeleteCustomerId = id;

    return;


}


/* SAVE FORM */

customerForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const editingId =
            Number(customerId.value);


        let photoData = "";

        if (editingId) {

            const existingCustomer =
                customers.find(customer =>
                    Number(customer.id) === editingId
                );

            photoData =
                existingCustomer?.photo || "";

        }

        if (
            customerPhotoPreview.src &&
            customerPhotoPreview.style.display !== "none"
        ) {

            photoData =
                customerPhotoPreview.src;

        }

        const customerData = {

            id:
                editingId || Date.now(),

            memberId:
                memberId.value.trim(),

            barcode:
                customerBarcode.value.trim(),

            photo:
                photoData,

            firstName:
                firstName.value.trim(),

            lastName:
                lastName.value.trim(),

            phone:
                customerPhone.value.trim(),

            email:
                customerEmail.value.trim(),

            address:
                customerAddress.value.trim(),

            type:
                customerType.value,

            loyaltyPoints:
                Number(loyaltyPoints.value) || 0,

            status:
                customerStatus.value

        };

        /* DUPLICATE MEMBER ID CHECK */

        if (customerData.memberId) {

            const duplicateMemberId =
                customers.some(customer => {

                    return (
                        customer.memberId ===
                        customerData.memberId &&

                        Number(customer.id) !==
                        editingId
                    );

                });


            if (duplicateMemberId) {

                showPremiumPopup(
                    "Duplicate Member ID",
                    "Member ID already exists.",
                    "error"
                );

                return;

            }

        }


        /* DUPLICATE BARCODE CHECK */

        if (customerData.barcode) {

            const duplicateBarcode =
                customers.some(customer => {

                    return (
                        customer.barcode ===
                        customerData.barcode &&

                        Number(customer.id) !==
                        editingId
                    );

                });


            if (duplicateBarcode) {

                showPremiumPopup(
                    "Duplicate Barcode",
                    "Customer barcode already exists.",
                    "error"
                );

                return;

            }

        }

        /* DUPLICATE PHONE CHECK */

        if (customerData.phone) {

            const duplicatePhone =
                customers.some(customer => {

                    return (
                        customer.phone ===
                        customerData.phone &&

                        Number(customer.id) !==
                        editingId
                    );

                });


            if (duplicatePhone) {

                showPremiumPopup(
                    "Duplicate Phone Number",
                    "Phone number already exists.",
                    "error"
                );

                return;

            }

        }


        /* DUPLICATE EMAIL CHECK */

        if (customerData.email) {

            const duplicateEmail =
                customers.some(customer => {

                    return (
                        customer.email
                            .toLowerCase() ===
                        customerData.email
                            .toLowerCase() &&

                        Number(customer.id) !==
                        editingId
                    );

                });


            if (duplicateEmail) {

                showPremiumPopup(
                    "Duplicate Email",
                    "Email address already exists.",
                    "error"
                );

                return;

            }

        }


        /* EDIT */

        if (editingId) {

            customers =
                customers.map(customer => {

                    return (
                        Number(customer.id) === editingId
                    )
                        ? customerData
                        : customer;

                });

        }


        /* ADD */

        else {

            customers.push(customerData);

        }


        saveCustomers();

        renderAll();

        closeModal();

        showPremiumPopup(
            editingId
                ? "Customer Updated"
                : "Customer Saved",
            editingId
                ? "Customer details updated successfully."
                : "New customer added successfully.",
            "success"
        );

    }
);


/* TABLE EVENTS */

customerTableBody.addEventListener(
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
            Number(button.dataset.id);


        if (action === "edit") {

            editCustomer(id);

        }


        if (action === "delete") {

            deleteCustomer(id);

        }

    }
);


/* SEARCH */

searchInput.addEventListener(
    "input",
    () => {

        currentCustomerPage = 1;

        renderCustomers();

    }
);


/* TYPE FILTER */

typeFilter.addEventListener(
    "change",
    () => {

        currentCustomerPage = 1;

        renderCustomers();

    }
);

/* STATUS FILTER */

statusFilter.addEventListener(
    "change",
    () => {

        currentCustomerPage = 1;

        renderCustomers();

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


customerModal.addEventListener(
    "click",
    event => {

        if (event.target === customerModal) {

            closeModal();

        }

    }
);

cancelDeleteCustomer.addEventListener(
    "click",
    () => {

        deleteCustomerModal.classList.add("hidden");

        pendingDeleteCustomerId = null;

    }
);

confirmDeleteCustomer.addEventListener(
    "click",
    () => {

        if (pendingDeleteCustomerId === null) {
            return;
        }

        customers =
            customers.filter(customer => {
                return Number(customer.id) !==
                    Number(pendingDeleteCustomerId);
            });

        saveCustomers();

        renderAll();

        deleteCustomerModal.classList.add("hidden");

        pendingDeleteCustomerId = null;

        showPremiumPopup(
            "Customer Deleted",
            "Customer has been deleted successfully.",
            "success"
        );

    }
);

deleteCustomerModal.addEventListener(
    "click",
    event => {

        if (event.target === deleteCustomerModal) {

            deleteCustomerModal.classList.add("hidden");

            pendingDeleteCustomerId = null;
        }

    }
);

prevCustomerPageBtn.addEventListener(
    "click",
    () => {

        if (currentCustomerPage > 1) {

            currentCustomerPage--;

            renderCustomers();
        }

    }
);

nextCustomerPageBtn.addEventListener(
    "click",
    () => {

        const searchTerm =
            searchInput.value
                .trim()
                .toLowerCase();

        const selectedType =
            typeFilter.value;

        const selectedStatus =
            statusFilter.value;

        const filteredCustomers =
            customers.filter(customer => {

                const fullName =
                    `${customer.firstName} ${customer.lastName}`;

                const searchableText = `
                    ${fullName}
                    ${customer.memberId || ""}
                    ${customer.barcode || ""}
                    ${customer.phone || ""}
                    ${customer.email || ""}
                    ${customer.address || ""}
                `.toLowerCase();

                const matchesSearch =
                    searchableText.includes(searchTerm);

                const matchesType =
                    selectedType === "all" ||
                    customer.type === selectedType;

                const matchesStatus =
                    selectedStatus === "all" ||
                    customer.status === selectedStatus;

                return (
                    matchesSearch &&
                    matchesType &&
                    matchesStatus
                );
            });

        const totalPages =
            Math.ceil(
                filteredCustomers.length /
                customersPerPage
            );

        if (currentCustomerPage < totalPages) {

            currentCustomerPage++;

            renderCustomers();
        }

    }
);

/* RENDER */

function renderAll() {

    renderStats();

    renderCustomers();

}

generateBarcodeBtn.addEventListener(
    "click",
    generateCustomerBarcode
);

customerPhoto.addEventListener(
    "change",
    event => {

        const file =
            event.target.files[0];

        if (!file) {
            customerPhotoPreview.src = "";
            customerPhotoPreview.style.display = "none";
            return;
        }

        const reader =
            new FileReader();

        reader.onload = e => {

            customerPhotoPreview.src =
                e.target.result;

            customerPhotoPreview.style.display =
                "block";

        };

        reader.readAsDataURL(file);

    }
);

/* START */

renderAll();