const PRODUCT_STORAGE_KEY = "intellicore_grocery_products";
const SUPPLIER_STORAGE_KEY = "intellicore_suppliers";
const HISTORY_STORAGE_KEY = "intellicore_inventory_history";

let products =
    JSON.parse(localStorage.getItem(PRODUCT_STORAGE_KEY)) || [];

let suppliers =
    JSON.parse(localStorage.getItem(SUPPLIER_STORAGE_KEY)) || [];

let history =
    JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY)) || [];

let inventoryCurrentPage = 1;
let historyCurrentPage = 1;

const inventoryPerPage = 10;
const historyPerPage = 10;


/* ELEMENTS */

const totalProducts =
    document.getElementById("totalProducts");

const totalStockQty =
    document.getElementById("totalStockQty");

const lowStockCount =
    document.getElementById("lowStockCount");

const outOfStockCount =
    document.getElementById("outOfStockCount");

const inventoryTableBody =
    document.getElementById("inventoryTableBody");

const historyTableBody =
    document.getElementById("historyTableBody");

const searchInput =
    document.getElementById("searchInput");

const stockFilter =
    document.getElementById("stockFilter");

const stockMovementBtn =
    document.getElementById("stockMovementBtn");

const stockModal =
    document.getElementById("stockModal");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const cancelBtn =
    document.getElementById("cancelBtn");

const stockForm =
    document.getElementById("stockForm");

const productSelect =
    document.getElementById("productSelect");

const movementType =
    document.getElementById("movementType");

const movementQuantity =
    document.getElementById("movementQuantity");

const supplierSelect =
    document.getElementById("supplierSelect");

const referenceNumber =
    document.getElementById("referenceNumber");

const movementRemarks =
    document.getElementById("movementRemarks");

const selectedCurrentStock =
    document.getElementById("selectedCurrentStock");

const clearHistoryBtn =
    document.getElementById("clearHistoryBtn");

const premiumPopup =
    document.getElementById("premiumPopup");

const premiumPopupIcon =
    document.getElementById("premiumPopupIcon");

const premiumPopupTitle =
    document.getElementById("premiumPopupTitle");

const premiumPopupMessage =
    document.getElementById("premiumPopupMessage");

const clearHistoryModal =
    document.getElementById("clearHistoryModal");

const cancelClearHistory =
    document.getElementById("cancelClearHistory");

const confirmClearHistory =
    document.getElementById("confirmClearHistory");

const inventoryPagination =
    document.getElementById("inventoryPagination");

const inventoryPrevBtn =
    document.getElementById("inventoryPrevBtn");

const inventoryNextBtn =
    document.getElementById("inventoryNextBtn");

const inventoryPageNumbers =
    document.getElementById("inventoryPageNumbers");


const historyPagination =
    document.getElementById("historyPagination");

const historyPrevBtn =
    document.getElementById("historyPrevBtn");

const historyNextBtn =
    document.getElementById("historyNextBtn");

const historyPageNumbers =
    document.getElementById("historyPageNumbers");


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

/* SAVE */

function saveProducts() {
    localStorage.setItem(
        PRODUCT_STORAGE_KEY,
        JSON.stringify(products)
    );
}

function saveHistory() {
    localStorage.setItem(
        HISTORY_STORAGE_KEY,
        JSON.stringify(history)
    );
}


/* STOCK STATUS */

function getStockStatus(product) {
    const stock = Number(product.stock);
    const reorder = Number(product.reorderLevel);

    if (stock <= 0) {
        return "out";
    }

    if (stock <= reorder) {
        return "low";
    }

    return "normal";
}


function getStockStatusLabel(status) {
    if (status === "out") {
        return "Out of Stock";
    }

    if (status === "low") {
        return "Low Stock";
    }

    return "Normal";
}


/* STATS */

function renderStats() {
    totalProducts.textContent =
        products.length;

    const stockTotal =
        products.reduce((sum, product) => {
            return sum + Number(product.stock || 0);
        }, 0);

    totalStockQty.textContent =
        stockTotal.toLocaleString("en-PH");

    const lowCount =
        products.filter(product => {
            return getStockStatus(product) === "low";
        }).length;

    lowStockCount.textContent =
        lowCount;

    const outCount =
        products.filter(product => {
            return getStockStatus(product) === "out";
        }).length;

    outOfStockCount.textContent =
        outCount;
}


/* INVENTORY TABLE */

function renderInventory() {
    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();

    const selectedStockFilter =
        stockFilter.value;

    const filteredProducts =
        products.filter(product => {
            const searchable = `
        ${product.name}
        ${product.sku}
        ${product.barcode}
        ${product.category}
      `.toLowerCase();

            const matchesSearch =
                searchable.includes(searchTerm);

            const productStatus =
                getStockStatus(product);

            const matchesStatus =
                selectedStockFilter === "all" ||
                selectedStockFilter === productStatus;

            return matchesSearch && matchesStatus;
        });

    const totalPages =
        Math.ceil(
            filteredProducts.length /
            inventoryPerPage
        );

    if (inventoryCurrentPage > totalPages) {
        inventoryCurrentPage =
            totalPages || 1;
    }

    const startIndex =
        (inventoryCurrentPage - 1) *
        inventoryPerPage;

    const endIndex =
        startIndex +
        inventoryPerPage;

    const paginatedProducts =
        filteredProducts.slice(
            startIndex,
            endIndex
        );

    inventoryTableBody.innerHTML = "";

    if (filteredProducts.length === 0) {
        inventoryTableBody.innerHTML = `
      <tr>
        <td colspan="9" class="empty-row">
          No inventory products found.
        </td>
      </tr>
    `;

        inventoryPagination.style.display = "none";
        return;
    }

    paginatedProducts.forEach(product => {
        const status =
            getStockStatus(product);

        const row =
            document.createElement("tr");

        row.innerHTML = `

      <td class="product-name">
        ${product.name}
      </td>

      <td>
        ${product.sku || "—"}
      </td>

      <td>
        ${product.barcode || "—"}
      </td>

      <td>
        ${product.category || "—"}
      </td>

      <td>
        ${product.unit || "—"}
      </td>

      <td>
        <strong>${product.stock}</strong>
      </td>

      <td>
        ${product.reorderLevel ?? 0}
      </td>

      <td>
        <span class="stock-status stock-${status}">
          ${getStockStatusLabel(status)}
        </span>
      </td>

      <td>
        <button
          class="action-btn"
          data-stock-product="${product.id}"
        >
          Update Stock
        </button>
      </td>

    `;

        inventoryTableBody.appendChild(row);
    });

    renderInventoryPagination(totalPages);
}

function renderInventoryPagination(totalPages) {
    inventoryPageNumbers.innerHTML = "";

    if (totalPages <= 1) {
        inventoryPagination.style.display = "none";
        return;
    }

    inventoryPagination.style.display = "flex";

    inventoryPrevBtn.disabled =
        inventoryCurrentPage === 1;

    inventoryNextBtn.disabled =
        inventoryCurrentPage === totalPages;

    for (let page = 1; page <= totalPages; page++) {
        const button =
            document.createElement("button");

        button.type = "button";
        button.textContent = page;

        button.className =
            page === inventoryCurrentPage
                ? "page-btn active"
                : "page-btn";

        button.addEventListener("click", () => {
            inventoryCurrentPage = page;
            renderInventory();
        });

        inventoryPageNumbers.appendChild(button);
    }
}

/* HISTORY TABLE */

function renderHistory() {
    historyTableBody.innerHTML = "";

    if (history.length === 0) {
        historyTableBody.innerHTML = `
      <tr>
        <td colspan="9" class="empty-row">
          No stock movement history yet.
        </td>
      </tr>
    `;

        historyPagination.style.display = "none";
        return;
    }

    const sortedHistory =
        [...history].sort((a, b) => {
            return b.createdAt - a.createdAt;
        });

    const totalPages =
        Math.ceil(
            sortedHistory.length /
            historyPerPage
        );

    if (historyCurrentPage > totalPages) {
        historyCurrentPage =
            totalPages || 1;
    }

    const startIndex =
        (historyCurrentPage - 1) *
        historyPerPage;

    const endIndex =
        startIndex +
        historyPerPage;

    const paginatedHistory =
        sortedHistory.slice(
            startIndex,
            endIndex
        );

    paginatedHistory.forEach(record => {
        const row =
            document.createElement("tr");

        const date =
            new Date(record.createdAt);

        row.innerHTML = `

      <td>
        ${date.toLocaleString("en-PH")}
      </td>

      <td>
        ${record.reference || "—"}
      </td>

      <td class="product-name">
        ${record.productName}
      </td>

      <td>
        <span class="movement-type type-${record.type}">
          ${formatMovementType(record.type)}
        </span>
      </td>

      <td>
        ${record.quantity}
      </td>

      <td>
        ${record.beforeStock}
      </td>

      <td>
        ${record.afterStock}
      </td>

      <td>
        ${record.supplierName || "—"}
      </td>

      <td class="muted">
        ${record.remarks || "—"}
      </td>

    `;

        historyTableBody.appendChild(row);
    });

    renderHistoryPagination(totalPages);
}

function renderHistoryPagination(totalPages) {
    historyPageNumbers.innerHTML = "";

    if (totalPages <= 1) {
        historyPagination.style.display = "none";
        return;
    }

    historyPagination.style.display = "flex";

    historyPrevBtn.disabled =
        historyCurrentPage === 1;

    historyNextBtn.disabled =
        historyCurrentPage === totalPages;

    for (let page = 1; page <= totalPages; page++) {
        const button =
            document.createElement("button");

        button.type = "button";
        button.textContent = page;

        button.className =
            page === historyCurrentPage
                ? "page-btn active"
                : "page-btn";

        button.addEventListener("click", () => {
            historyCurrentPage = page;
            renderHistory();
        });

        historyPageNumbers.appendChild(button);
    }
}

function formatMovementType(type) {
    const names = {
        "stock-in": "Stock In",
        "stock-out": "Stock Out",
        "adjustment-add": "Adjustment +",
        "adjustment-minus": "Adjustment -"
    };

    return names[type] || type;
}


/* DROPDOWNS */

function populateProductSelect() {
    productSelect.innerHTML = `
    <option value="">
      Select Product
    </option>
  `;

    products.forEach(product => {
        const option =
            document.createElement("option");

        option.value =
            product.id;

        option.textContent =
            `${product.name} | Stock: ${product.stock}`;

        productSelect.appendChild(option);
    });
}


function populateSupplierSelect() {
    supplierSelect.innerHTML = `
    <option value="">
      No Supplier
    </option>
  `;

    suppliers
        .filter(supplier => supplier.status === "Active")
        .forEach(supplier => {
            const option =
                document.createElement("option");

            option.value =
                supplier.id;

            option.textContent =
                supplier.name;

            supplierSelect.appendChild(option);
        });
}


/* CURRENT STOCK PREVIEW */

function updateCurrentStockPreview() {
    const productId =
        Number(productSelect.value);

    const product =
        products.find(item => {
            return item.id === productId;
        });

    selectedCurrentStock.textContent =
        product ? product.stock : 0;
}


/* MODAL */

function openStockModal(productId = null) {
    stockForm.reset();

    populateProductSelect();
    populateSupplierSelect();

    if (productId) {
        productSelect.value =
            productId;
    }

    movementType.value =
        "stock-in";

    referenceNumber.value =
        generateReferenceNumber();

    updateCurrentStockPreview();

    stockModal.classList.remove("hidden");
}


function closeStockModal() {
    stockModal.classList.add("hidden");
    stockForm.reset();
}


function generateReferenceNumber() {
    const timestamp =
        Date.now().toString().slice(-8);

    return `INV-${timestamp}`;
}


/* SAVE STOCK MOVEMENT */

stockForm.addEventListener(
    "submit",
    event => {
        event.preventDefault();

        const productId =
            Number(productSelect.value);

        const type =
            movementType.value;

        const quantity =
            Math.max(
                0,
                Math.floor(
                    Number(movementQuantity.value) || 0
                )
            );

        const supplierId =
            Number(supplierSelect.value);

        const product =
            products.find(item => {
                return item.id === productId;
            });

        if (!product) {
            showPremiumPopup(
                "Product Required",
                "Please select a product.",
                "error"
            );
            return;
        }

        if (!quantity || quantity <= 0) {
            showPremiumPopup(
                "Invalid Quantity",
                "Enter a valid quantity.",
                "error"
            );
            return;
        }

        const beforeStock =
            Number(product.stock || 0);

        let afterStock =
            beforeStock;

        if (
            type === "stock-in" ||
            type === "adjustment-add"
        ) {
            afterStock =
                beforeStock + quantity;
        }

        if (
            type === "stock-out" ||
            type === "adjustment-minus"
        ) {
            afterStock =
                beforeStock - quantity;

            if (afterStock < 0) {
                showPremiumPopup(
                    "Insufficient Stock",
                    "Stock cannot go below zero.",
                    "error"
                );
                return;
            }
        }

        product.stock =
            afterStock;

        const supplier =
            suppliers.find(item => {
                return item.id === supplierId;
            });

        history.push({
            id: Date.now(),
            productId: product.id,
            productName: product.name,
            type,
            quantity,
            beforeStock,
            afterStock,
            supplierId:
                supplier ? supplier.id : null,
            supplierName:
                supplier ? supplier.name : "",
            reference:
                referenceNumber.value.trim(),
            remarks:
                movementRemarks.value.trim(),
            createdAt:
                Date.now()
        });

        saveProducts();
        saveHistory();

        renderAll();

        closeStockModal();

        showPremiumPopup(
            "Stock Updated",
            "Inventory movement saved successfully.",
            "success"
        );
    }
);


/* ACTION EVENTS */

stockMovementBtn.addEventListener(
    "click",
    () => {
        openStockModal();
    }
);

closeModalBtn.addEventListener(
    "click",
    closeStockModal
);

cancelBtn.addEventListener(
    "click",
    closeStockModal
);

stockModal.addEventListener(
    "click",
    event => {
        if (event.target === stockModal) {
            closeStockModal();
        }
    }
);

productSelect.addEventListener(
    "change",
    updateCurrentStockPreview
);

inventoryTableBody.addEventListener(
    "click",
    event => {
        const button =
            event.target.closest(
                "[data-stock-product]"
            );

        if (!button) {
            return;
        }

        const productId =
            Number(button.dataset.stockProduct);

        openStockModal(productId);
    }
);

searchInput.addEventListener("input", () => {
    inventoryCurrentPage = 1;
    renderInventory();
});

stockFilter.addEventListener("change", () => {
    inventoryCurrentPage = 1;
    renderInventory();
});

clearHistoryBtn.addEventListener("click", () => {
    if (history.length === 0) {
        showPremiumPopup(
            "No History",
            "There is no inventory history to clear.",
            "error"
        );
        return;
    }

    clearHistoryModal.classList.remove("hidden");
});

cancelClearHistory.addEventListener("click", () => {
    clearHistoryModal.classList.add("hidden");
});

confirmClearHistory.addEventListener("click", () => {
    history = [];

    saveHistory();

    historyCurrentPage = 1;
    renderHistory();

    clearHistoryModal.classList.add("hidden");

    showPremiumPopup(
        "History Cleared",
        "Inventory movement history has been cleared.",
        "success"
    );
});

/* REFRESH DATA */

function refreshStoredData() {
    products =
        JSON.parse(
            localStorage.getItem(PRODUCT_STORAGE_KEY)
        ) || [];

    suppliers =
        JSON.parse(
            localStorage.getItem(SUPPLIER_STORAGE_KEY)
        ) || [];
}


/* RENDER EVERYTHING */

function renderAll() {
    refreshStoredData();

    renderStats();
    renderInventory();
    renderHistory();

    populateProductSelect();
    populateSupplierSelect();
}


inventoryPrevBtn.addEventListener("click", () => {
    if (inventoryCurrentPage > 1) {
        inventoryCurrentPage--;
        renderInventory();
    }
});

inventoryNextBtn.addEventListener("click", () => {
    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();

    const selectedStockFilter =
        stockFilter.value;

    const filteredProducts =
        products.filter(product => {
            const searchable = `
                ${product.name}
                ${product.sku}
                ${product.barcode}
                ${product.category}
            `.toLowerCase();

            const matchesSearch =
                searchable.includes(searchTerm);

            const productStatus =
                getStockStatus(product);

            const matchesStatus =
                selectedStockFilter === "all" ||
                selectedStockFilter === productStatus;

            return matchesSearch && matchesStatus;
        });

    const totalPages =
        Math.ceil(
            filteredProducts.length /
            inventoryPerPage
        );

    if (inventoryCurrentPage < totalPages) {
        inventoryCurrentPage++;
        renderInventory();
    }
});

historyPrevBtn.addEventListener("click", () => {
    if (historyCurrentPage > 1) {
        historyCurrentPage--;
        renderHistory();
    }
});

historyNextBtn.addEventListener("click", () => {
    const totalPages =
        Math.ceil(
            history.length /
            historyPerPage
        );

    if (historyCurrentPage < totalPages) {
        historyCurrentPage++;
        renderHistory();
    }
});

/* INITIAL LOAD */

renderAll();