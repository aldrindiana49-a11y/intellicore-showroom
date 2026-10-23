const STORAGE_KEY = "intellicore_grocery_products";

const CATEGORY_STORAGE_KEY = "intellicore_categories";

const BRAND_STORAGE_KEY =
    "intellicore_brands";

let brands =
    JSON.parse(
        localStorage.getItem(BRAND_STORAGE_KEY)
    ) || [];

let categories =
    JSON.parse(
        localStorage.getItem(CATEGORY_STORAGE_KEY)
    ) || [];

let products = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
    {
        id: 1,
        name: "Coca-Cola 1.5L",
        sku: "BEV-0001",
        barcode: "4801981111111",
        category: "Beverages",
        brand: "Coca-Cola",
        unit: "BOTTLE",
        cost: 55,
        price: 68,
        stock: 24,
        reorderLevel: 10,
        expiry: "2027-01-15",
        supplier: "Sample Beverage Supplier",
        status: "Active"
    },
    {
        id: 2,
        name: "Corned Beef 150g",
        sku: "CAN-0001",
        barcode: "4801982222222",
        category: "Canned Goods",
        brand: "Sample Brand",
        unit: "CAN",
        cost: 34,
        price: 42,
        stock: 8,
        reorderLevel: 12,
        expiry: "2028-05-20",
        supplier: "Sample Grocery Distributor",
        status: "Active"
    }
];

const productTableBody =
    document.getElementById("productTableBody");

const productModal =
    document.getElementById("productModal");

const productForm =
    document.getElementById("productForm");

const addProductBtn =
    document.getElementById("addProductBtn");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const cancelBtn =
    document.getElementById("cancelBtn");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const productPagination =
    document.getElementById("productPagination");

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

const deleteProductModal =
    document.getElementById("deleteProductModal");

const deleteProductMessage =
    document.getElementById("deleteProductMessage");

const cancelDeleteProduct =
    document.getElementById("cancelDeleteProduct");

const confirmDeleteProduct =
    document.getElementById("confirmDeleteProduct");

let pendingDeleteProductId = null;

let currentPage = 1;
const productsPerPage = 10;

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
        "error",
        "success"
    );

    if (type === "error") {
        premiumPopup.classList.add("error");
        premiumPopupIcon.textContent = "!";
    } else {
        premiumPopup.classList.add("success");
        premiumPopupIcon.textContent = "✓";
    }

    clearTimeout(premiumPopup.hideTimer);

    premiumPopup.hideTimer = setTimeout(() => {
        premiumPopup.classList.add("hidden");
    }, 2200);
}

const modalTitle =
    document.getElementById("modalTitle");

const productId =
    document.getElementById("productId");

const productName =
    document.getElementById("productName");

const productImageInput =
    document.getElementById("productImage");

const imagePreview =
    document.getElementById("imagePreview");

let currentProductImage = "";

const productSku =
    document.getElementById("productSku");

const productBarcode =
    document.getElementById("productBarcode");

const productCategory =
    document.getElementById("productCategory");

const productBrand =
    document.getElementById("productBrand");

const productUnit =
    document.getElementById("productUnit");

const productSupplier =
    document.getElementById("productSupplier");

const productCost =
    document.getElementById("productCost");

const productPrice =
    document.getElementById("productPrice");

const productStock =
    document.getElementById("productStock");

const productReorderLevel =
    document.getElementById("productReorderLevel");

const productExpiry =
    document.getElementById("productExpiry");

const productStatus =
    document.getElementById("productStatus");

function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {

        if (!file) {
            resolve("");
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = error => {
            reject(error);
        };

        reader.readAsDataURL(file);

    });
}

productImageInput.addEventListener(
    "change",
    async event => {

        const file =
            event.target.files[0];

        if (!file) {
            imagePreview.src = "";
            imagePreview.classList.add("hidden");
            return;
        }

        const imageData =
            await convertFileToBase64(file);

        currentProductImage = imageData;

        imagePreview.src =
            imageData;

        imagePreview.classList.remove(
            "hidden"
        );

    }
);

function saveProducts() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(products)
    );
}

function formatCurrency(value) {
    return `₱${Number(value).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

function formatDate(dateValue) {
    if (!dateValue) {
        return "—";
    }

    const date = new Date(`${dateValue}T00:00:00`);

    return date.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

function populateCategoryOptions() {
    productCategory.innerHTML = `
        <option value="">Select Category</option>
    `;

    categories
        .filter(category => category.status === "Active")
        .forEach(category => {
            const option = document.createElement("option");

            option.value = category.name;
            option.textContent = category.name;

            productCategory.appendChild(option);
        });
}

function populateBrandOptions() {

    productBrand.innerHTML = `
        <option value="No Brand">
            No Brand
        </option>
    `;

    brands
        .filter(brand =>
            brand.status === "Active" &&
            brand.name !== "No Brand"
        )
        .forEach(brand => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                brand.name;

            option.textContent =
                brand.name;

            productBrand.appendChild(
                option
            );
        });
}

function renderProducts() {
    const searchTerm =
        searchInput.value.trim().toLowerCase();

    const selectedCategory =
        categoryFilter.value;

    const filteredProducts = products.filter(product => {
        const searchableText = `
      ${product.name}
      ${product.sku}
      ${product.barcode}
      ${product.brand}
      ${product.supplier}
    `.toLowerCase();

        const matchesSearch =
            searchableText.includes(searchTerm);

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const totalPages =
        Math.ceil(filteredProducts.length / productsPerPage);

    if (currentPage > totalPages) {
        currentPage = totalPages || 1;
    }

    const startIndex =
        (currentPage - 1) * productsPerPage;

    const endIndex =
        startIndex + productsPerPage;

    const paginatedProducts =
        filteredProducts.slice(startIndex, endIndex);

    productTableBody.innerHTML = "";

    if (filteredProducts.length === 0) {
        productTableBody.innerHTML = `
      <tr>
        <td colspan="14" class="empty-row">
          No products found.
        </td>
      </tr>
    `;

        productPagination.style.display = "none";
        return;
    }

    paginatedProducts.forEach(product => {
        const isLowStock =
            Number(product.stock) <=
            Number(product.reorderLevel);

        const row = document.createElement("tr");

        row.innerHTML = `
  <td>
    <div class="product-info">
      ${product.image
                ? `<img src="${product.image}" alt="${product.name}" class="product-thumb">`
                : `<div class="product-thumb placeholder">No Image</div>`
            }

      <strong>${product.name}</strong>
    </div>
  </td>

      <td>${product.sku}</td>

      <td>${product.barcode || "—"}</td>

      <td>${product.category}</td>

      <td>${product.brand || "—"}</td>

      <td>${product.unit}</td>

      <td>${formatCurrency(product.cost)}</td>

      <td>${formatCurrency(product.price)}</td>

      <td class="${isLowStock ? "low-stock" : ""}">
        ${product.stock}
      </td>

      <td>${product.reorderLevel}</td>

      <td>${formatDate(product.expiry)}</td>

      <td>${product.supplier || "—"}</td>

      <td>
        <span
          class="status ${product.status === "Active"
                ? "status-active"
                : "status-inactive"
            }"
        >
          ${product.status}
        </span>
      </td>

      <td>
        <button
          class="action-btn edit-btn"
          data-action="edit"
          data-id="${product.id}"
        >
          Edit
        </button>

        <button
          class="action-btn delete-btn"
          data-action="delete"
          data-id="${product.id}"
        >
          Delete
        </button>
      </td>
    `;

        productTableBody.appendChild(row);
    });

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    pageNumbers.innerHTML = "";

    if (totalPages <= 1) {
        productPagination.style.display = "none";
        return;
    }

    productPagination.style.display = "flex";

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
            renderProducts();
        });

        pageNumbers.appendChild(button);
    }
}

function openModal() {
    productModal.classList.remove("hidden");
}

function closeModal() {
    productModal.classList.add("hidden");
    productForm.reset();
    productId.value = "";
}

function getProductFormData() {
    return {
        id: Number(productId.value) || Date.now(),

        name:
            productName.value.trim(),

        image: currentProductImage,

        sku:
            productSku.value.trim(),

        barcode:
            productBarcode.value.trim(),

        category:
            productCategory.value,

        brand:
            productBrand.value.trim(),

        unit:
            productUnit.value,

        supplier:
            productSupplier.value.trim(),

        cost:
            Number(productCost.value),

        price:
            Number(productPrice.value),

        stock:
            Math.max(0, Math.floor(Number(productStock.value) || 0)),

        reorderLevel:
            Math.max(0, Math.floor(Number(productReorderLevel.value) || 0)),

        expiry:
            productExpiry.value,

        status:
            productStatus.value
    };
}

function fillProductForm(product) {
    productId.value =
        product.id;

    productName.value =
        product.name;

    productSku.value =
        product.sku;

    productBarcode.value =
        product.barcode || "";

    productCategory.value =
        product.category;

    productBrand.value =
        product.brand || "";

    productUnit.value =
        product.unit;

    productSupplier.value =
        product.supplier || "";

    productCost.value =
        product.cost;

    productPrice.value =
        product.price;

    productStock.value =
        product.stock;

    productReorderLevel.value =
        product.reorderLevel;

    productExpiry.value =
        product.expiry || "";

    productStatus.value =
        product.status;

    currentProductImage =
        product.image || "";

    if (currentProductImage) {
        imagePreview.src =
            currentProductImage;

        imagePreview.classList.remove(
            "hidden"
        );
    } else {
        imagePreview.src = "";

        imagePreview.classList.add(
            "hidden"
        );
    }

    productImageInput.value = "";
}

function editProduct(id) {
    const product = products.find(
        item => item.id === id
    );

    if (!product) {
        return;
    }

    modalTitle.textContent = "Edit Product";

    categories =
        JSON.parse(
            localStorage.getItem(CATEGORY_STORAGE_KEY)
        ) || [];

    populateCategoryOptions();

    brands =
        JSON.parse(
            localStorage.getItem(BRAND_STORAGE_KEY)
        ) || [];

    populateBrandOptions();

    fillProductForm(product);

    openModal();
}

function deleteProduct(id) {
    const product = products.find(
        item => item.id === id
    );

    if (!product) {
        return;
    }

    pendingDeleteProductId = id;

    deleteProductMessage.textContent =
        `Delete "${product.name}"?`;

    deleteProductModal.classList.remove("hidden");
}

cancelDeleteProduct.addEventListener("click", () => {
    pendingDeleteProductId = null;
    deleteProductModal.classList.add("hidden");
});

confirmDeleteProduct.addEventListener("click", () => {

    if (pendingDeleteProductId === null) {
        return;
    }

    products =
        products.filter(
            item =>
                item.id !== pendingDeleteProductId
        );

    saveProducts();

    renderProducts();

    deleteProductModal.classList.add("hidden");

    pendingDeleteProductId = null;

    showPremiumPopup(
        "Product Deleted",
        "Product deleted successfully.",
        "success"
    );
});

addProductBtn.addEventListener("click", () => {
    productForm.reset();
    productId.value = "";

    currentProductImage = "";

    productImageInput.value = "";

    imagePreview.src = "";

    imagePreview.classList.add("hidden");

    productStatus.value = "Active";

    modalTitle.textContent = "Add Product";

    categories =
        JSON.parse(
            localStorage.getItem(CATEGORY_STORAGE_KEY)
        ) || [];

    populateCategoryOptions();

    brands =
        JSON.parse(
            localStorage.getItem(BRAND_STORAGE_KEY)
        ) || [];

    populateBrandOptions();

    openModal();
});

closeModalBtn.addEventListener(
    "click",
    closeModal
);

cancelBtn.addEventListener(
    "click",
    closeModal
);


productForm.addEventListener(
    "submit",
    event => {
        event.preventDefault();

        const productData =
            getProductFormData();

        const editingId =
            Number(productId.value);

        const duplicateSku = products.some(product => {
            return (
                product.sku.toLowerCase() ===
                productData.sku.toLowerCase() &&
                product.id !== editingId
            );
        });

        if (duplicateSku) {
            showPremiumPopup(
                "Duplicate SKU",
                "SKU already exists.",
                "error"
            );
            return;
        }

        if (productData.barcode) {
            const duplicateBarcode = products.some(product => {
                return (
                    product.barcode ===
                    productData.barcode &&
                    product.id !== editingId
                );
            });

            if (duplicateBarcode) {
                showPremiumPopup(
                    "Duplicate Barcode",
                    "Barcode already exists.",
                    "error"
                );
                return;
            }
        }

        if (editingId) {
            products = products.map(product => {
                return product.id === editingId
                    ? productData
                    : product;
            });
        } else {
            products.push(productData);
        }

        saveProducts();
        renderProducts();
        closeModal();

        showPremiumPopup(
            editingId
                ? "Product Updated"
                : "Product Added",
            editingId
                ? "Product updated successfully."
                : "Product added successfully.",
            "success"
        );
    }
);

productTableBody.addEventListener(
    "click",
    event => {
        const button =
            event.target.closest("[data-action]");

        if (!button) {
            return;
        }

        const id =
            Number(button.dataset.id);

        const action =
            button.dataset.action;

        if (action === "edit") {
            editProduct(id);
        }

        if (action === "delete") {
            deleteProduct(id);
        }
    }
);

searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderProducts();
});

categoryFilter.addEventListener("change", () => {
    currentPage = 1;
    renderProducts();
});

prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderProducts();
    }
});

nextPageBtn.addEventListener("click", () => {
    const searchTerm =
        searchInput.value.trim().toLowerCase();

    const selectedCategory =
        categoryFilter.value;

    const filteredProducts =
        products.filter(product => {
            const searchableText = `
                ${product.name}
                ${product.sku}
                ${product.barcode}
                ${product.brand}
                ${product.supplier}
            `.toLowerCase();

            const matchesSearch =
                searchableText.includes(searchTerm);

            const matchesCategory =
                selectedCategory === "all" ||
                product.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });

    const totalPages =
        Math.ceil(filteredProducts.length / productsPerPage);

    if (currentPage < totalPages) {
        currentPage++;
        renderProducts();
    }
});

renderProducts();