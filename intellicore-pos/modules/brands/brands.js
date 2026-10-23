const STORAGE_KEY =
    "intellicore_brands";

const PRODUCT_STORAGE_KEY =
    "intellicore_grocery_products";


let brands =
    JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    ) || [];


let currentPage = 1;

const brandsPerPage = 10;


const brandTableBody =
    document.getElementById(
        "brandTableBody"
    );

const addBrandBtn =
    document.getElementById(
        "addBrandBtn"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const statusFilter =
    document.getElementById(
        "statusFilter"
    );

const brandModal =
    document.getElementById(
        "brandModal"
    );

const brandForm =
    document.getElementById(
        "brandForm"
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

const brandId =
    document.getElementById(
        "brandId"
    );

const brandName =
    document.getElementById(
        "brandName"
    );

const brandDescription =
    document.getElementById(
        "brandDescription"
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

const deleteBrandModal =
    document.getElementById(
        "deleteBrandModal"
    );

const deleteBrandMessage =
    document.getElementById(
        "deleteBrandMessage"
    );

const cancelDeleteBrand =
    document.getElementById(
        "cancelDeleteBrand"
    );

const confirmDeleteBrand =
    document.getElementById(
        "confirmDeleteBrand"
    );

let pendingDeleteBrandId = null;

const brandStatus =
    document.getElementById(
        "brandStatus"
    );

function openModal() {

    brandModal.classList.remove(
        "hidden"
    );

}


function closeModal() {

    brandModal.classList.add(
        "hidden"
    );

    brandForm.reset();

    brandId.value = "";

}

addBrandBtn.addEventListener(
    "click",
    () => {

        brandForm.reset();

        brandId.value = "";

        brandStatus.value =
            "Active";

        modalTitle.textContent =
            "Add Brand";

        openModal();

    }
);


closeModalBtn.addEventListener(
    "click",
    closeModal
);


cancelBtn.addEventListener(
    "click",
    closeModal
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

    premiumPopup.classList.add(type);

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

function saveBrands() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(brands)
    );

}


function renderBrands() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();

    const selectedStatus =
        statusFilter.value;


    const filteredBrands =
        brands.filter(brand => {

            const matchesSearch =
                brand.name
                    .toLowerCase()
                    .includes(searchTerm) ||

                (brand.description || "")
                    .toLowerCase()
                    .includes(searchTerm);


            const matchesStatus =
                selectedStatus === "all" ||
                brand.status === selectedStatus;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    brandTableBody.innerHTML = "";


    if (filteredBrands.length === 0) {

        brandTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-row">
                    No brands found.
                </td>
            </tr>
        `;

        return;
    }


    filteredBrands
        .slice(
            (currentPage - 1) *
            brandsPerPage,
            currentPage *
            brandsPerPage
        )
        .forEach(brand => {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td class="brand-name">
                    ${brand.name}
                </td>

                <td class="description">
                    ${brand.description || "—"}
                </td>

                <td>
                    <span
                        class="status ${brand.status === "Active"
                    ? "status-active"
                    : "status-inactive"
                }"
                    >
                        ${brand.status}
                    </span>
                </td>

                <td>
                    <button
                        class="action-btn edit-btn"
                        data-action="edit"
                        data-id="${brand.id}"
                    >
                        Edit
                    </button>

                    <button
                        class="action-btn delete-btn"
                        data-action="delete"
                        data-id="${brand.id}"
                    >
                        Delete
                    </button>
                </td>
            `;

            brandTableBody.appendChild(row);

        });

}

brandForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const editingId =
            Number(
                brandId.value
            );


        const newBrand = {

            id:
                editingId ||
                Date.now(),

            name:
                brandName.value
                    .trim(),

            description:
                brandDescription.value
                    .trim(),

            status:
                brandStatus.value

        };


        const duplicate =
            brands.some(brand => {

                return (
                    brand.name
                        .toLowerCase() ===
                    newBrand.name
                        .toLowerCase() &&

                    brand.id !== editingId
                );

            });


        if (duplicate) {

            showPremiumPopup(
                "Duplicate Brand",
                "Brand name already exists.",
                "error"
            );

            return;
        }


        if (editingId) {

            brands =
                brands.map(brand => {

                    return brand.id === editingId
                        ? newBrand
                        : brand;

                });

        }

        else {

            brands.push(
                newBrand
            );

        }


        saveBrands();

        currentPage = 1;

        renderBrands();

        closeModal();

        showPremiumPopup(
            editingId
                ? "Brand Updated"
                : "Brand Added",

            editingId
                ? "Brand updated successfully."
                : "Brand added successfully.",

            "success"
        );

    }
);

function editBrand(id) {

    const brand =
        brands.find(
            item => item.id === id
        );

    if (!brand) {
        return;
    }


    modalTitle.textContent =
        "Edit Brand";

    brandId.value =
        brand.id;

    brandName.value =
        brand.name;

    brandDescription.value =
        brand.description || "";

    brandStatus.value =
        brand.status;


    openModal();
}
brandTableBody.addEventListener(
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

        if (action === "edit") {
            editBrand(id);
        }

        if (action === "delete") {
            deleteBrand(id);
        }

    }
);


function deleteBrand(id) {

    const brand =
        brands.find(
            item => item.id === id
        );

    if (!brand) {
        return;
    }


    const products =
        JSON.parse(
            localStorage.getItem(
                PRODUCT_STORAGE_KEY
            )
        ) || [];


    const productsUsingBrand =
        products.filter(product => {
            return product.brand === brand.name;
        });


    if (productsUsingBrand.length > 0) {

        showPremiumPopup(
            "Cannot Delete Brand",
            `"${brand.name}" is used by ${productsUsingBrand.length} product(s). Transfer them to another brand first.`,
            "error"
        );

        return;
    }


    pendingDeleteBrandId =
        id;

    deleteBrandMessage.textContent =
        `Delete brand "${brand.name}"?`;

    deleteBrandModal.classList.remove(
        "hidden"
    );

    return;


    brands =
        brands.filter(
            item => item.id !== id
        );


    saveBrands();

    renderBrands();
}

cancelDeleteBrand.addEventListener(
    "click",
    () => {

        pendingDeleteBrandId = null;

        deleteBrandModal.classList.add(
            "hidden"
        );

    }
);


deleteBrandModal.addEventListener(
    "click",
    event => {

        if (event.target === deleteBrandModal) {

            pendingDeleteBrandId = null;

            deleteBrandModal.classList.add(
                "hidden"
            );

        }

    }
);


confirmDeleteBrand.addEventListener(
    "click",
    () => {

        if (pendingDeleteBrandId === null) {
            return;
        }


        brands =
            brands.filter(
                item =>
                    item.id !==
                    pendingDeleteBrandId
            );


        saveBrands();

        renderBrands();


        deleteBrandModal.classList.add(
            "hidden"
        );


        pendingDeleteBrandId = null;


        showPremiumPopup(
            "Brand Deleted",
            "Brand deleted successfully.",
            "success"
        );

    }
);

searchInput.addEventListener(
    "input",
    () => {

        currentPage = 1;

        renderBrands();

    }
);


statusFilter.addEventListener(
    "change",
    () => {

        currentPage = 1;

        renderBrands();

    }
);


renderBrands();