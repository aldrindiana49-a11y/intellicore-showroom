const USER_STORAGE_KEY =
    "intellicore_users";


let users =
    JSON.parse(
        localStorage.getItem(
            USER_STORAGE_KEY
        )
    ) || [];

if (users.length === 0) {

    users.push({
        id: Date.now(),
        fullName: "System Owner",
        username: "owner",
        role: "Owner",
        status: "Active",
        pin: "1234",
        updatedAt: Date.now()
    });

    localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(users)
    );
}


let currentUserPage = 1;

const usersPerPage = 10;

let pendingDeleteUserId = null;


/* ELEMENTS */

const totalUsers =
    document.getElementById("totalUsers");

const activeUsers =
    document.getElementById("activeUsers");

const headCashierUsers =
    document.getElementById("headCashierUsers");

const receiverUsers =
    document.getElementById("receiverUsers");

const searchInput =
    document.getElementById("searchInput");

const roleFilter =
    document.getElementById("roleFilter");

const statusFilter =
    document.getElementById("statusFilter");

const userTableBody =
    document.getElementById("userTableBody");

const userPagination =
    document.getElementById("userPagination");

const prevUserPageBtn =
    document.getElementById("prevUserPageBtn");

const nextUserPageBtn =
    document.getElementById("nextUserPageBtn");

const userPageNumbers =
    document.getElementById("userPageNumbers");


/* MODAL */

const userModal =
    document.getElementById("userModal");

const userForm =
    document.getElementById("userForm");

const modalTitle =
    document.getElementById("modalTitle");

const addUserBtn =
    document.getElementById("addUserBtn");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const cancelBtn =
    document.getElementById("cancelBtn");


/* FIELDS */

const userId =
    document.getElementById("userId");

const fullName =
    document.getElementById("fullName");

const username =
    document.getElementById("username");

const userRole =
    document.getElementById("userRole");

const userStatus =
    document.getElementById("userStatus");

const userBarcode =
    document.getElementById("userBarcode");

const userPin =
    document.getElementById("userPin");

const confirmPin =
    document.getElementById("confirmPin");

const rolePermissionText =
    document.getElementById("rolePermissionText");


/* DELETE */

const deleteUserModal =
    document.getElementById("deleteUserModal");

const deleteUserMessage =
    document.getElementById("deleteUserMessage");

const cancelDeleteUser =
    document.getElementById("cancelDeleteUser");

const confirmDeleteUser =
    document.getElementById("confirmDeleteUser");


/* POPUP */

const premiumPopup =
    document.getElementById("premiumPopup");

const premiumPopupIcon =
    document.getElementById("premiumPopupIcon");

const premiumPopupTitle =
    document.getElementById("premiumPopupTitle");

const premiumPopupMessage =
    document.getElementById("premiumPopupMessage");


function saveUsers() {

    localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(users)
    );
}


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
        "error"
    );

    if (type === "error") {

        premiumPopup.classList.add("error");

        premiumPopupIcon.textContent =
            "!";

    } else {

        premiumPopupIcon.textContent =
            "✓";
    }

    clearTimeout(
        premiumPopup.hideTimer
    );

    premiumPopup.hideTimer =
        setTimeout(() => {

            premiumPopup.classList.add(
                "hidden"
            );

        }, 2200);
}


function renderStats() {

    totalUsers.textContent =
        users.length;

    activeUsers.textContent =
        users.filter(user =>
            user.status === "Active"
        ).length;

    headCashierUsers.textContent =
        users.filter(user =>
            user.role === "Head Cashier"
        ).length;

    receiverUsers.textContent =
        users.filter(user =>
            user.role === "Receiver / Stock Clerk"
        ).length;
}


function getFilteredUsers() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();

    return users.filter(user => {

        const searchable = `
            ${user.fullName}
            ${user.username}
            ${user.role}
        `.toLowerCase();

        const matchesSearch =
            searchable.includes(
                searchTerm
            );

        const matchesRole =
            roleFilter.value === "all" ||
            user.role === roleFilter.value;

        const matchesStatus =
            statusFilter.value === "all" ||
            user.status ===
            statusFilter.value;

        return (
            matchesSearch &&
            matchesRole &&
            matchesStatus
        );
    });
}


function renderUsers() {

    const filteredUsers =
        getFilteredUsers();

    const totalPages =
        Math.max(
            Math.ceil(
                filteredUsers.length /
                usersPerPage
            ),
            1
        );

    if (
        currentUserPage >
        totalPages
    ) {
        currentUserPage =
            totalPages;
    }

    const startIndex =
        (currentUserPage - 1) *
        usersPerPage;

    const paginatedUsers =
        filteredUsers.slice(
            startIndex,
            startIndex + usersPerPage
        );

    userTableBody.innerHTML = "";

    if (
        paginatedUsers.length === 0
    ) {

        userTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No users found.
                </td>
            </tr>
        `;

    } else {

        paginatedUsers.forEach(user => {

            const row =
                document.createElement(
                    "tr"
                );

            row.innerHTML = `

                <td>
                    <strong>
                        ${user.fullName}
                    </strong>
                </td>

                <td>
                    ${user.username}
                </td>

                <td>
                    <span
                        class="
                            role-badge
                            role-${user.role
                    .toLowerCase()
                    .replace(/\s*\/\s*/g, "-")
                    .replace(/\s+/g, "-")
                }
                        "
                    >
                        ${user.role}
                    </span>
                </td>

                <td>
                    <span
                        class="
                            status
                            ${user.status === "Active"
                    ? "status-active"
                    : "status-inactive"}
                        "
                    >
                        ${user.status}
                    </span>
                </td>

                <td>
                    ${new Date(
                        user.updatedAt
                    ).toLocaleString(
                        "en-PH"
                    )}
                </td>

                <td>

                    <button
                        class="action-btn edit-btn"
                        data-action="edit"
                        data-id="${user.id}"
                    >
                        Edit
                    </button>

                    <button
                        class="action-btn delete-btn"
                        data-action="delete"
                        data-id="${user.id}"
                    >
                        Delete
                    </button>

                </td>
            `;

            userTableBody.appendChild(
                row
            );
        });
    }

    renderPagination(
        totalPages
    );
}


function renderPagination(totalPages) {

    userPageNumbers.innerHTML = "";

    userPagination.style.display =
        "flex";

    prevUserPageBtn.disabled =
        currentUserPage === 1;

    nextUserPageBtn.disabled =
        currentUserPage === totalPages;

    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const button =
            document.createElement(
                "button"
            );

        button.type = "button";

        button.textContent =
            page;

        if (
            page ===
            currentUserPage
        ) {
            button.classList.add(
                "active"
            );
        }

        button.addEventListener(
            "click",
            () => {

                currentUserPage =
                    page;

                renderUsers();
            }
        );

        userPageNumbers.appendChild(
            button
        );
    }
}


function openUserModal() {

    userModal.classList.remove(
        "hidden"
    );
}


function closeUserModal() {

    userModal.classList.add(
        "hidden"
    );

    userForm.reset();

    userId.value = "";
}


function updatePermissionText() {

    const role =
        userRole.value;

    if (role === "Owner") {

        rolePermissionText.textContent =
            "Owner access: Full system access including users, settings, reports, inventory, pricing, marketing, and POS.";

    } else if (role === "Manager") {

        rolePermissionText.textContent =
            "Manager access: Products, inventory, customers, orders, reports, expenses, pricing, receiving, and POS.";

    } else if (role === "Head Cashier") {

        rolePermissionText.textContent =
            "Head Cashier access: POS, cashier supervision, VOID approval, discount approval, and drawer-related overrides.";

    } else if (role === "Receiver / Stock Clerk") {

        rolePermissionText.textContent =
            "Receiver access: Stock receiving, supplier deliveries, purchase receiving, and inventory quantity updates.";

    } else if (role === "Pricing Staff") {

        rolePermissionText.textContent =
            "Pricing Staff access: Product selling prices, promo prices, and approved pricing updates.";

    } else if (role === "Marketing Staff") {

        rolePermissionText.textContent =
            "Marketing Staff access: Promotions, discounts, campaigns, featured products, and loyalty marketing.";

    } else {

        rolePermissionText.textContent =
            "Cashier access: POS, orders, and basic customer lookup.";
    }
}

function applyCashierPermissions() {

    const permissions = {
        dashboard: false,
        pos: true,
        orders: false,
        products: false,
        categories: false,
        brands: false,
        inventory: false,
        suppliers: false,
        customers: true,
        reports: false,
        expenses: false,
        users: false,
        settings: false,
        voidApproval: false
    };

    return permissions;
}

addUserBtn.addEventListener(
    "click",
    () => {

        userForm.reset();

        userId.value = "";

        userRole.value =
            "Cashier";

        userStatus.value =
            "Active";

        modalTitle.textContent =
            "Add User";

        updatePermissionText();

        openUserModal();
    }
);


function editUser(id) {

    const user =
        users.find(item =>
            Number(item.id) ===
            Number(id)
        );

    if (!user) {
        return;
    }

    userId.value =
        user.id;

    fullName.value =
        user.fullName;

    username.value =
        user.username;

    userRole.value =
        user.role;

    userStatus.value =
        user.status;

    userBarcode.value =
        user.barcode || "";

    userPin.value = "";
    confirmPin.value = "";

    modalTitle.textContent =
        "Edit User";

    updatePermissionText();

    openUserModal();
}


function deleteUser(id) {

    const user =
        users.find(item =>
            Number(item.id) ===
            Number(id)
        );

    if (!user) {
        return;
    }

    if (user.role === "Owner") {

        showPremiumPopup(
            "Protected Account",
            "Owner account cannot be deleted.",
            "error"
        );

        return;
    }

    pendingDeleteUserId =
        id;

    deleteUserMessage.textContent =
        `Are you sure you want to delete "${user.fullName}"?`;

    deleteUserModal.classList.remove(
        "hidden"
    );
}


userForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const editingId =
            Number(userId.value);

        const existingUser =
            users.find(user =>
                Number(user.id) === editingId
            );

        if (
            existingUser &&
            existingUser.role === "Owner" &&
            userRole.value !== "Owner"
        ) {

            const otherActiveOwners =
                users.filter(user =>
                    user.role === "Owner" &&
                    user.status === "Active" &&
                    Number(user.id) !== editingId
                );

            if (otherActiveOwners.length === 0) {

                showPremiumPopup(
                    "Owner Required",
                    "You cannot remove the last active Owner role.",
                    "error"
                );

                return;
            }
        }

        if (
            existingUser &&
            existingUser.role === "Owner" &&
            userStatus.value === "Inactive"
        ) {

            const otherActiveOwners =
                users.filter(user =>
                    user.role === "Owner" &&
                    user.status === "Active" &&
                    Number(user.id) !== editingId
                );

            if (otherActiveOwners.length === 0) {

                showPremiumPopup(
                    "Owner Required",
                    "You cannot deactivate the last active Owner account.",
                    "error"
                );

                return;
            }
        }

        const cleanUsername =
            username.value
                .trim()
                .toLowerCase();

        const isChangingPin =
            !editingId ||
            userPin.value.trim() !== "" ||
            confirmPin.value.trim() !== "";

        if (isChangingPin) {

            if (
                userPin.value !==
                confirmPin.value
            ) {

                showPremiumPopup(
                    "PIN Mismatch",
                    "PIN and Confirm PIN do not match.",
                    "error"
                );

                return;
            }

            if (
                !/^\d{4,6}$/.test(
                    userPin.value
                )
            ) {

                showPremiumPopup(
                    "Invalid PIN",
                    "PIN must contain 4 to 6 numbers only.",
                    "error"
                );

                return;
            }
        }

        const duplicateUsername =
            users.some(user => {

                return (
                    user.username
                        .toLowerCase() ===
                    cleanUsername &&

                    Number(user.id) !==
                    editingId
                );
            });

        if (
            duplicateUsername
        ) {

            showPremiumPopup(
                "Duplicate Username",
                "Username already exists.",
                "error"
            );

            return;
        }

        const cleanBarcode =
            userBarcode.value.trim();

        const duplicateBarcode =
            cleanBarcode !== "" &&
            users.some(user => {
                return (
                    user.barcode === cleanBarcode &&
                    Number(user.id) !== editingId
                );
            });

        if (duplicateBarcode) {
            showPremiumPopup(
                "Duplicate Barcode",
                "User barcode already exists.",
                "error"
            );

            return;
        }

        let finalPin =
            existingUser?.pin || "";

        if (userPin.value.trim()) {
            finalPin = userPin.value.trim();
        }

        const userData = {

            id:
                editingId ||
                Date.now(),

            fullName:
                fullName.value.trim(),

            username:
                cleanUsername,

            role:
                userRole.value,

            status:
                userStatus.value,

            barcode:
                userBarcode.value.trim(),

            pin:
                finalPin,

            permissions:
                userRole.value === "Cashier"
                    ? applyCashierPermissions()
                    : {},

            updatedAt:
                Date.now()
        };

        if (editingId) {

            users =
                users.map(user =>
                    Number(user.id) ===
                        editingId
                        ? userData
                        : user
                );

        } else {

            users.push(
                userData
            );
        }

        saveUsers();

        renderAll();

        closeUserModal();

        showPremiumPopup(
            editingId
                ? "User Updated"
                : "User Saved",

            editingId
                ? "User account updated successfully."
                : "New user account created successfully.",

            "success"
        );
    }
);


userTableBody.addEventListener(
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
            Number(
                button.dataset.id
            );

        const action =
            button.dataset.action;

        if (
            action === "edit"
        ) {
            editUser(id);
        }

        if (
            action === "delete"
        ) {
            deleteUser(id);
        }
    }
);


confirmDeleteUser.addEventListener(
    "click",
    () => {

        if (
            pendingDeleteUserId === null
        ) {
            return;
        }

        users =
            users.filter(user =>
                Number(user.id) !==
                Number(
                    pendingDeleteUserId
                )
            );

        saveUsers();

        renderAll();

        deleteUserModal.classList.add(
            "hidden"
        );

        pendingDeleteUserId =
            null;

        showPremiumPopup(
            "User Deleted",
            "User account deleted successfully.",
            "success"
        );
    }
);


cancelDeleteUser.addEventListener(
    "click",
    () => {

        deleteUserModal.classList.add(
            "hidden"
        );

        pendingDeleteUserId =
            null;
    }
);


deleteUserModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            deleteUserModal
        ) {

            deleteUserModal.classList.add(
                "hidden"
            );

            pendingDeleteUserId =
                null;
        }
    }
);


userRole.addEventListener(
    "change",
    updatePermissionText
);


searchInput.addEventListener(
    "input",
    () => {

        currentUserPage = 1;

        renderUsers();
    }
);


roleFilter.addEventListener(
    "change",
    () => {

        currentUserPage = 1;

        renderUsers();
    }
);


statusFilter.addEventListener(
    "change",
    () => {

        currentUserPage = 1;

        renderUsers();
    }
);


prevUserPageBtn.addEventListener(
    "click",
    () => {

        if (
            currentUserPage > 1
        ) {

            currentUserPage--;

            renderUsers();
        }
    }
);


nextUserPageBtn.addEventListener(
    "click",
    () => {

        const totalPages =
            Math.max(
                Math.ceil(
                    getFilteredUsers()
                        .length /
                    usersPerPage
                ),
                1
            );

        if (
            currentUserPage <
            totalPages
        ) {

            currentUserPage++;

            renderUsers();
        }
    }
);


closeModalBtn.addEventListener(
    "click",
    closeUserModal
);


cancelBtn.addEventListener(
    "click",
    closeUserModal
);


userModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            userModal
        ) {

            closeUserModal();
        }
    }
);


function renderAll() {

    renderStats();

    renderUsers();
}


renderAll();