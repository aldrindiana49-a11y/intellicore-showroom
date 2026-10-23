const PRODUCT_STORAGE_KEY = "intellicore_grocery_products";
const ORDER_STORAGE_KEY = "intellicore_orders";
const INVENTORY_HISTORY_KEY = "intellicore_inventory_history";
const CART_STORAGE_KEY = "intellicore_current_cart";
const SETTINGS_STORAGE_KEY = "intellicore_pos_settings";
const CUSTOMER_STORAGE_KEY = "intellicore_customers";
const USER_STORAGE_KEY = "intellicore_users";

let products =
    JSON.parse(localStorage.getItem(PRODUCT_STORAGE_KEY)) || [];

let orders =
    JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY)) || [];

let customers =
    JSON.parse(
        localStorage.getItem(
            CUSTOMER_STORAGE_KEY
        )
    ) || [];

let inventoryHistory =
    JSON.parse(localStorage.getItem(INVENTORY_HISTORY_KEY)) || [];

let cart =
    JSON.parse(
        localStorage.getItem(CART_STORAGE_KEY)
    ) || [];

let selectedCustomer = null;

let activeCategory = "all";

const currentDate =
    document.getElementById("currentDate");

const scannerStatus =
    document.getElementById("scannerStatus");

const scannerDot =
    document.getElementById("scannerDot");

const productSearch =
    document.getElementById("productSearch");

const categoryFilter =
    document.getElementById("categoryFilter");

const productGrid =
    document.getElementById("productGrid");

const posCarousel =
    document.getElementById("posCarousel");

const posCarouselImage =
    document.getElementById("posCarouselImage");

const posCarouselDots =
    document.getElementById("posCarouselDots");

let carouselImages = [];

let carouselIndex = 0;

let carouselTimer = null;

const productPagination =
    document.getElementById("productPagination");

const prevPageBtn =
    document.getElementById("prevPageBtn");

const nextPageBtn =
    document.getElementById("nextPageBtn");

const pageInfo =
    document.getElementById("pageInfo");

let currentPage = 1;
const productsPerPage = 16;
let categoryResetTimer;
let searchClearTimer;
let pageResetTimer;

const selectedCustomerCard =
    document.getElementById("selectedCustomerCard");

const selectedCustomerPhoto =
    document.getElementById("selectedCustomerPhoto");

const selectedCustomerName =
    document.getElementById("selectedCustomerName");

const selectedCustomerMeta =
    document.getElementById("selectedCustomerMeta");

const removeSelectedCustomerBtn =
    document.getElementById("removeSelectedCustomerBtn");

const removeCustomerModal =
    document.getElementById("removeCustomerModal");

const cancelRemoveCustomer =
    document.getElementById("cancelRemoveCustomer");

const confirmRemoveCustomer =
    document.getElementById("confirmRemoveCustomer");

const viewSelectedCustomerBtn =
    document.getElementById("viewSelectedCustomerBtn");

const customerDetailsModal =
    document.getElementById("customerDetailsModal");

const closeCustomerDetailsBtn =
    document.getElementById("closeCustomerDetailsBtn");

const customerDetailsPhoto =
    document.getElementById("customerDetailsPhoto");

const customerDetailsName =
    document.getElementById("customerDetailsName");

const customerDetailsMemberId =
    document.getElementById("customerDetailsMemberId");

const customerDetailsPhone =
    document.getElementById("customerDetailsPhone");

const customerDetailsType =
    document.getElementById("customerDetailsType");

const customerDetailsPoints =
    document.getElementById("customerDetailsPoints");

const customerDetailsStatus =
    document.getElementById("customerDetailsStatus");

const cartItems =
    document.getElementById("cartItems");

const cartItemCount =
    document.getElementById("cartItemCount");

const subtotalAmount =
    document.getElementById("subtotalAmount");

const totalAmount =
    document.getElementById("totalAmount");


const discountCategory =
    document.getElementById("discountCategory");

const discountAmountDisplay =
    document.getElementById("discountAmountDisplay");

const discountPolicySummary =
    document.getElementById(
        "discountPolicySummary"
    );

const applyDiscountBtn =
    document.getElementById("applyDiscountBtn");

const clearDiscountBtn =
    document.getElementById("clearDiscountBtn");

const manualDiscountType =
    document.getElementById("manualDiscountType");

const manualDiscountValue =
    document.getElementById("manualDiscountValue");

const requestManualDiscountBtn =
    document.getElementById(
        "requestManualDiscountBtn"
    );

const manualDiscountModal =
    document.getElementById("manualDiscountModal");

const closeManualDiscountModalBtn =
    document.getElementById(
        "closeManualDiscountModalBtn"
    );

const manualReviewType =
    document.getElementById("manualReviewType");

const manualReviewRequested =
    document.getElementById(
        "manualReviewRequested"
    );

const manualReviewAmount =
    document.getElementById(
        "manualReviewAmount"
    );

const manualReviewSubtotal =
    document.getElementById(
        "manualReviewSubtotal"
    );

const manualDiscountReason =
    document.getElementById(
        "manualDiscountReason"
    );

const supervisorBarcode =
    document.getElementById(
        "supervisorBarcode"
    );

const supervisorPin =
    document.getElementById(
        "supervisorPin"
    );

const cancelManualDiscountBtn =
    document.getElementById(
        "cancelManualDiscountBtn"
    );

const approveManualDiscountBtn =
    document.getElementById(
        "approveManualDiscountBtn"
    );

let appliedDiscount = 0;
let appliedDiscountType = null;
let manualDiscountApproval = null;


const paymentMethod =
    document.getElementById("paymentMethod");

const splitPaymentGroup =
    document.getElementById("splitPaymentGroup");

const splitCash =
    document.getElementById("splitCash");

const splitGCash =
    document.getElementById("splitGCash");

const splitMaya =
    document.getElementById("splitMaya");

const splitCard =
    document.getElementById("splitCard");

const splitPaidAmount =
    document.getElementById("splitPaidAmount");

const splitRemainingAmount =
    document.getElementById("splitRemainingAmount");

const quickPayButtons =
    document.querySelectorAll(".quick-pay-btn");

const quickItemCount =
    document.getElementById("quickItemCount");

const quickTotal =
    document.getElementById("quickTotal");

const cashPaymentGroup =
    document.getElementById("cashPaymentGroup");

const cashTendered =
    document.getElementById("cashTendered");

const numericKeypadModal =
    document.getElementById("numericKeypadModal");

const numericKeypadTitle =
    document.getElementById("numericKeypadTitle");

const numericKeypadDisplay =
    document.getElementById("numericKeypadDisplay");

const numericKeypadCloseBtn =
    document.getElementById("numericKeypadCloseBtn");

const numericKeypadCancelBtn =
    document.getElementById("numericKeypadCancelBtn");

const numericKeypadApplyBtn =
    document.getElementById("numericKeypadApplyBtn");

const numericKeypadBackspaceBtn =
    document.getElementById("numericKeypadBackspaceBtn");

let numericKeypadValue = "";
let numericKeypadTarget = null;

const changeAmount =
    document.getElementById("changeAmount");

const clearCartBtn =
    document.getElementById("clearCartBtn");

const checkoutBtn =
    document.getElementById("checkoutBtn");

const premiumPopup =
    document.getElementById("premiumPopup");

const premiumPopupIcon =
    document.getElementById("premiumPopupIcon");

const premiumPopupTitle =
    document.getElementById("premiumPopupTitle");

const premiumPopupMessage =
    document.getElementById("premiumPopupMessage");

const clearCartModal = document.getElementById("clearCartModal");
const cancelClearCart = document.getElementById("cancelClearCart");
const confirmClearCart = document.getElementById("confirmClearCart");

const completeSaleModal =
    document.getElementById("completeSaleModal");

const cancelCompleteSale =
    document.getElementById("cancelCompleteSale");

const confirmCompleteSale =
    document.getElementById("confirmCompleteSale");

const receiptModal =
    document.getElementById("receiptModal");

const receiptContent =
    document.getElementById("receiptContent");

const closeReceiptBtn =
    document.getElementById("closeReceiptBtn");

const printReceiptBtn =
    document.getElementById("printReceiptBtn");

const newSaleBtn =
    document.getElementById("newSaleBtn");


function formatCurrency(value) {
    return `₱${Number(value).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}


function saveProducts() {
    localStorage.setItem(
        PRODUCT_STORAGE_KEY,
        JSON.stringify(products)
    );
}

function saveCart() {
    localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
    );
}

function saveOrders() {
    localStorage.setItem(
        ORDER_STORAGE_KEY,
        JSON.stringify(orders)
    );
}


function saveInventoryHistory() {
    localStorage.setItem(
        INVENTORY_HISTORY_KEY,
        JSON.stringify(inventoryHistory)
    );
}


function refreshProducts() {
    products =
        JSON.parse(localStorage.getItem(PRODUCT_STORAGE_KEY)) || [];
}

function refreshCustomers() {

    customers =
        JSON.parse(
            localStorage.getItem(
                CUSTOMER_STORAGE_KEY
            )
        ) || [];

}

function renderSelectedCustomer() {

    if (!selectedCustomer) {

        selectedCustomerCard.classList.add("hidden");

        return;
    }

    selectedCustomerCard.classList.remove("hidden");

    selectedCustomerName.textContent =
        `${selectedCustomer.firstName} ${selectedCustomer.lastName}`;

    selectedCustomerMeta.textContent =
        `${selectedCustomer.memberId || "No Member ID"} • ${Number(
            selectedCustomer.loyaltyPoints || 0
        ).toFixed(2)} pts`;

    if (selectedCustomer.photo) {

        selectedCustomerPhoto.src =
            selectedCustomer.photo;

        selectedCustomerPhoto.style.display =
            "block";

    } else {

        selectedCustomerPhoto.src = "";

        selectedCustomerPhoto.style.display =
            "none";

    }

}


function openCustomerDetails() {

    if (!selectedCustomer) {

        showPremiumPopup(
            "No Customer Selected",
            "Scan or select a customer first.",
            "error"
        );

        return;
    }

    customerDetailsName.textContent =
        `${selectedCustomer.firstName} ${selectedCustomer.lastName}`;

    customerDetailsMemberId.textContent =
        selectedCustomer.memberId || "—";

    customerDetailsPhone.textContent =
        selectedCustomer.phone || "—";

    customerDetailsType.textContent =
        selectedCustomer.type || "—";

    customerDetailsPoints.textContent =
        `${Number(
            selectedCustomer.loyaltyPoints || 0
        ).toFixed(2)} pts`;

    customerDetailsStatus.textContent =
        selectedCustomer.status || "—";

    customerDetailsStatus.className = "";

    if (selectedCustomer.status === "Active") {
        customerDetailsStatus.classList.add(
            "customer-details-status-active"
        );
    }

    if (selectedCustomer.photo) {

        customerDetailsPhoto.src =
            selectedCustomer.photo;

        customerDetailsPhoto.style.display =
            "block";

    } else {

        customerDetailsPhoto.src = "";

        customerDetailsPhoto.style.display =
            "none";

    }

    customerDetailsModal.classList.remove("hidden");

}

function getLoyaltySettings() {

    const settings =
        JSON.parse(
            localStorage.getItem(
                SETTINGS_STORAGE_KEY
            )
        ) || {};

    return {

        spendAmount:
            Number(
                settings.loyaltySpendAmount
            ) || 200,

        pointsEarned:
            Number(
                settings.loyaltyPointsEarned
            ) || 1

    };

}

function calculateLoyaltyPoints(total) {

    const loyalty =
        getLoyaltySettings();

    if (
        loyalty.spendAmount <= 0 ||
        loyalty.pointsEarned <= 0
    ) {
        return 0;
    }

    const points =
        (Number(total) / loyalty.spendAmount) *
        loyalty.pointsEarned;

    return Number(
        points.toFixed(2)
    );

}


function renderCurrentDate() {
    currentDate.textContent =
        new Date().toLocaleString("en-PH", {
            dateStyle: "medium",
            timeStyle: "short"
        });
}


function renderCategories() {
    const categories = [
        ...new Set(
            products
                .filter(product => product.status === "Active")
                .map(product => product.category)
                .filter(Boolean)
        )
    ];

    categoryFilter.innerHTML = `
        <option value="all">All Categories</option>
    `;

    categories.forEach(category => {
        const option = document.createElement("option");

        option.value = category;
        option.textContent = category;

        categoryFilter.appendChild(option);
    });

    categoryFilter.value = activeCategory;
}

function setupPosCarousel() {

    if (
        !posCarousel ||
        !posCarouselImage ||
        !posCarouselDots
    ) {
        return;
    }

    const settings =
        JSON.parse(
            localStorage.getItem(
                SETTINGS_STORAGE_KEY
            )
        ) || {};

    const enabled =
        settings.posCarouselEnabled === true;

    carouselImages = [
        settings.carouselImage1,
        settings.carouselImage2,
        settings.carouselImage3
    ].filter(Boolean);

    if (
        !enabled ||
        carouselImages.length === 0
    ) {
        posCarousel.classList.add("hidden");
        return;
    }

    posCarousel.classList.remove("hidden");

    carouselIndex = 0;

    renderCarouselSlide();

    startCarouselTimer(
        Number(settings.carouselInterval) || 5000
    );
}

function renderCarouselSlide() {

    if (
        !posCarouselImage ||
        carouselImages.length === 0
    ) {
        return;
    }

    posCarouselImage.src =
        carouselImages[carouselIndex];

    posCarouselDots.innerHTML = "";

    carouselImages.forEach((image, index) => {

        const dot =
            document.createElement("button");

        dot.type = "button";

        dot.className =
            `pos-carousel-dot ${index === carouselIndex
                ? "active"
                : ""
            }`;

        dot.addEventListener(
            "click",
            () => {

                carouselIndex = index;

                renderCarouselSlide();
            }
        );

        posCarouselDots.appendChild(dot);
    });
}


function startCarouselTimer(interval) {

    if (carouselTimer) {
        clearInterval(carouselTimer);
    }

    if (carouselImages.length <= 1) {
        return;
    }

    carouselTimer =
        setInterval(
            () => {

                carouselIndex++;

                if (
                    carouselIndex >=
                    carouselImages.length
                ) {
                    carouselIndex = 0;
                }

                renderCarouselSlide();

            },
            interval
        );
}

function renderProducts() {
    const searchTerm =
        productSearch.value
            .trim()
            .toLowerCase();

    const filteredProducts =
        products.filter(product => {
            const matchesStatus =
                product.status === "Active";

            const matchesCategory =
                activeCategory === "all" ||
                product.category === activeCategory;

            const searchable = `
        ${product.name}
        ${product.sku}
        ${product.barcode}
        ${product.brand}
      `.toLowerCase();

            const matchesSearch =
                searchable.includes(searchTerm);

            return (
                matchesStatus &&
                matchesCategory &&
                matchesSearch
            );
        });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        const aOut = Number(a.stock) <= 0;
        const bOut = Number(b.stock) <= 0;

        if (aOut === bOut) {
            return 0;
        }

        return aOut ? 1 : -1;
    });

    const totalPages =
        Math.ceil(
            sortedProducts.length /
            productsPerPage
        );

    if (currentPage > totalPages) {
        currentPage =
            totalPages || 1;
    }

    const startIndex =
        (currentPage - 1) *
        productsPerPage;

    const endIndex =
        startIndex +
        productsPerPage;

    const paginatedProducts =
        sortedProducts.slice(
            startIndex,
            endIndex
        );

    if (sortedProducts.length > productsPerPage) {
        productPagination.classList.remove("hidden");

        pageInfo.textContent =
            `Page ${currentPage} of ${totalPages}`;

        prevPageBtn.disabled =
            currentPage === 1;

        nextPageBtn.disabled =
            currentPage === totalPages;
    } else {
        productPagination.classList.add("hidden");
    }

    productGrid.innerHTML = "";

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
      <p>No products found.</p>
    `;

        return;
    }

    paginatedProducts.forEach(product => {
        const outOfStock =
            Number(product.stock) <= 0;

        const card =
            document.createElement("article");

        card.className =
            `product-card ${outOfStock ? "disabled" : ""
            }`;

        card.innerHTML = `
  <div class="pos-product-image-wrap">
    ${product.image
                ? `<img src="${product.image}" alt="${product.name}" class="pos-product-image">`
                : `<div class="pos-product-image placeholder">No Image</div>`
            }
  </div>

 <div class="product-title-row">
    <h3 class="product-title">${product.name}</h3>

    <button
        type="button"
        class="title-toggle"
        aria-label="Show full product name"
    >
        ⌄
    </button>
</div>

  <div class="product-meta">
    ${product.sku || "No SKU"}
    ${product.unit ? ` • ${product.unit}` : ""}
  </div>

      <div class="product-bottom">

        <div>
          <div class="product-price">
            ${formatCurrency(product.price)}
          </div>

          <div class="product-stock">
            Stock: ${product.stock}
          </div>
        </div>

      </div>

      <button
        class="add-btn"
        data-add-product="${product.id}"
        ${outOfStock ? "disabled" : ""}
      >
        ${outOfStock
                ? "Out of Stock"
                : "Add to Cart"
            }
      </button>
    `;

        productGrid.appendChild(card);

        const title =
            card.querySelector(".product-title");

        const toggle =
            card.querySelector(".title-toggle");

        if (
            title &&
            toggle &&
            title.scrollWidth <= title.clientWidth
        ) {
            toggle.style.display = "none";
        }
    });
}


function addToCart(productId) {
    const product =
        products.find(item => {
            return item.id === productId;
        });

    if (!product) {
        return;
    }

    if (Number(product.stock) <= 0) {
        showPremiumPopup(
            "Out of Stock",
            `${product.name} is currently out of stock.`,
            "error"
        );

        return;
    }

    const existing =
        cart.find(item => {
            return item.productId === productId;
        });

    if (existing) {

        if (existing.quantity >= Number(product.stock)) {
            showPremiumPopup(
                "Stock Limit Reached",
                `Only ${product.stock} unit(s) of ${product.name} are available.`,
                "error"
            );

            return;
        }

        existing.quantity += 1;

    } else {

        cart.push({
            productId: product.id,
            name: product.name,
            sku: product.sku,
            price: Number(product.price),
            quantity: 1,
            availableStock: Number(product.stock)
        });

    }

    const discountCleared =
        clearAppliedDiscountForCartChange();

    saveCart();
    renderCart();

    if (discountCleared) {
        showPremiumPopup(
            "Discount Cleared",
            "Cart changed. Please apply the discount again.",
            "error"
        );
    }
}


function updateQuantity(productId, change) {
    const item =
        cart.find(cartItem => {
            return cartItem.productId === productId;
        });

    if (!item) {
        return;
    }

    const newQuantity =
        item.quantity + change;

    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }

    if (newQuantity > item.availableStock) {
        showPremiumPopup(
            "Stock Limit Reached",
            `Only ${item.availableStock} unit(s) of ${item.name} are available.`,
            "error"
        );

        return;
    }

    item.quantity =
        newQuantity;

    const discountCleared =
        clearAppliedDiscountForCartChange();

    saveCart();
    renderCart();

    if (discountCleared) {
        showPremiumPopup(
            "Discount Cleared",
            "Cart changed. Please apply the discount again.",
            "error"
        );
    }
}


function removeFromCart(productId) {
    cart =
        cart.filter(item => {
            return item.productId !== productId;
        });

    const discountCleared =
        clearAppliedDiscountForCartChange();

    saveCart();
    renderCart();

    if (discountCleared) {
        showPremiumPopup(
            "Discount Cleared",
            "Cart changed. Please apply the discount again.",
            "error"
        );
    }
}


function getSubtotal() {
    return cart.reduce((sum, item) => {
        return sum +
            item.price * item.quantity;
    }, 0);
}

function getDiscountPolicy() {

    const settings =
        JSON.parse(
            localStorage.getItem(
                SETTINGS_STORAGE_KEY
            )
        ) || {};

    return {
        maxDiscountPercent:
            settings.maxDiscountPercent !== undefined
                ? Number(settings.maxDiscountPercent)
                : 5,

        minDiscountPurchase:
            settings.minDiscountPurchase !== undefined
                ? Number(settings.minDiscountPurchase)
                : 100
    };
}

function getManualDiscountPolicy() {

    const settings =
        JSON.parse(
            localStorage.getItem(
                SETTINGS_STORAGE_KEY
            )
        ) || {};

    return {
        enabled:
            settings.manualDiscountEnabled !== undefined
                ? settings.manualDiscountEnabled
                : true,

        maxPercent:
            settings.maxManualDiscountPercent !== undefined
                ? Number(settings.maxManualDiscountPercent)
                : 10,

        requireApproval:
            settings.manualDiscountRequireApproval !== undefined
                ? settings.manualDiscountRequireApproval
                : true,

        approverRoles:
            Array.isArray(
                settings.manualDiscountApproverRoles
            )
                ? settings.manualDiscountApproverRoles
                : [
                    "Owner",
                    "Manager",
                    "Head Cashier"
                ]
    };
}

function getManualDiscountApprover() {
    const users =
        JSON.parse(
            localStorage.getItem(
                USER_STORAGE_KEY
            )
        ) || [];

    const policy =
        getManualDiscountPolicy();

    const allowedRoles =
        new Set([
            "Owner",
            ...(policy.approverRoles || [])
        ]);

    const barcode =
        supervisorBarcode.value.trim();

    const pin =
        supervisorPin.value.trim();

    return users.find(user => {
        const matchesBarcode =
            barcode !== "" &&
            String(user.barcode || "").trim() === barcode;

        const matchesPin =
            pin !== "" &&
            String(user.pin || "").trim() === pin;

        return (
            user.status === "Active" &&
            allowedRoles.has(user.role) &&
            (matchesBarcode || matchesPin)
        );
    }) || null;
}

function updateDiscountPolicySummary() {

    const subtotal =
        getSubtotal();

    const policy =
        getDiscountPolicy();

    if (
        discountCategory.value === "senior-pwd"
    ) {
        discountPolicySummary.innerHTML =
            `
            Senior / PWD Discount<br>
            Eligible products only.
            `;

        return;
    }

    const maxAllowedAmount =
        subtotal *
        (
            policy.maxDiscountPercent / 100
        );

    discountPolicySummary.innerHTML =
        `
        Max Regular Discount:
        ${policy.maxDiscountPercent}%<br>

        Minimum Purchase:
        ${formatCurrency(
            policy.minDiscountPurchase
        )}<br>

        Maximum Allowed:
        ${formatCurrency(
            maxAllowedAmount
        )}<br>

        Applied Discount:
        ${formatCurrency(
            appliedDiscount
        )}
        `;
}

function getDiscountAmount() {

    const subtotal =
        getSubtotal();

    return Math.min(
        Math.max(appliedDiscount, 0),
        subtotal
    );
}

function getTotal() {
    return Math.max(
        getSubtotal() - getDiscountAmount(),
        0
    );
}

function clearAppliedDiscountForCartChange() {
    if (!appliedDiscountType) {
        return false;
    }

    appliedDiscount = 0;
    appliedDiscountType = null;
    manualDiscountApproval = null;

    return true;
}

function updateSplitPaymentSummary() {
    const total = getTotal();

    const cash = Number(splitCash.value) || 0;
    const gcash = Number(splitGCash.value) || 0;
    const maya = Number(splitMaya.value) || 0;
    const card = Number(splitCard.value) || 0;

    const paid = cash + gcash + maya + card;
    const remaining = Math.max(total - paid, 0);

    splitPaidAmount.textContent = formatCurrency(paid);
    splitRemainingAmount.textContent = formatCurrency(remaining);
}

function getChange() {
    if (paymentMethod.value !== "Cash") {
        return 0;
    }

    const tendered =
        Number(cashTendered.value) || 0;

    const total =
        getTotal();

    return Math.max(
        tendered - total,
        0
    );
}


function renderCart() {
    cartItems.innerHTML = "";

    const totalQty =
        cart.reduce((sum, item) => {
            return sum + item.quantity;
        }, 0);

    cartItemCount.textContent =
        `${totalQty} ${totalQty === 1 ? "item" : "items"
        }`;

    quickItemCount.textContent =
        `${totalQty} ${totalQty === 1 ? "Item" : "Items"}`;

    if (cart.length === 0) {
        cartItems.innerHTML = `
      <div class="empty-cart">
        Your cart is empty.
      </div>
    `;
    } else {
        cart.forEach(item => {
            const itemTotal =
                item.price * item.quantity;

            const product =
                products.find(product => {
                    return product.id === item.productId;
                });

            const image =
                product?.image || "";

            const element =
                document.createElement("div");

            element.className =
                "cart-item";

            element.innerHTML = `
        
            <div class="cart-item-product">

    <div class="cart-item-image-wrap">
        ${image
                    ? `<img src="${image}" alt="${item.name}" class="cart-item-image">`
                    : `<div class="cart-item-image placeholder">No Image</div>`
                }
    </div>

    <div class="cart-item-info">
        <h4>
            ${item.name}
        </h4>

        <div class="cart-item-price">
            ${formatCurrency(item.price)}
            × ${item.quantity}
        </div>
    </div>

</div>


        <div>

          <div class="cart-item-total">
            ${formatCurrency(itemTotal)}
          </div>

          <div class="cart-controls">

            <button
              class="qty-btn"
              data-action="minus"
              data-id="${item.productId}"
            >
              −
            </button>

            <span class="qty-display">
              ${item.quantity}
            </span>

            <button
              class="qty-btn"
              data-action="plus"
              data-id="${item.productId}"
            >
              +
            </button>

            <button
              class="remove-btn"
              data-action="remove"
              data-id="${item.productId}"
            >
              ×
            </button>

          </div>

        </div>
      `;

            cartItems.appendChild(element);
        });
    }

    subtotalAmount.textContent =
        formatCurrency(getSubtotal());

    totalAmount.textContent =
        formatCurrency(getTotal());

    quickTotal.textContent =
        formatCurrency(getTotal());

    changeAmount.textContent =
        formatCurrency(getChange());

    if (paymentMethod.value === "Split") {
        updateSplitPaymentSummary();
    }

    discountAmountDisplay.textContent =
        formatCurrency(appliedDiscount);

    clearDiscountBtn.disabled =
        appliedDiscount <= 0;

    updateDiscountPolicySummary();
}


let scannerStatusTimer;

function updateScannerStatus(message, type = "ready") {
    const scannerStatus =
        document.getElementById("scannerStatus");

    const scannerDot =
        document.getElementById("scannerDot");

    if (!scannerStatus || !scannerDot) {
        return;
    }

    scannerStatus.textContent = message;

    scannerDot.classList.remove(
        "scanner-success",
        "scanner-error"
    );

    if (type === "success") {
        scannerDot.classList.add("scanner-success");
    }

    if (type === "error") {
        scannerDot.classList.add("scanner-error");
    }

    clearTimeout(scannerStatusTimer);

    if (type !== "ready") {
        scannerStatusTimer = setTimeout(() => {
            scannerStatus.textContent = "Scanner Ready";

            scannerDot.classList.remove(
                "scanner-success",
                "scanner-error"
            );
        }, 2000);
    }
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

    premiumPopup.hideTimer = setTimeout(() => {
        premiumPopup.classList.add("hidden");
    }, 2200);
}

function handleBarcode(value) {
    const code = String(value || "").trim();

    if (!code) {
        return;
    }

    refreshProducts();

    refreshCustomers();

    const customer =
        customers.find(item => {

            const barcode =
                String(item.barcode || "").trim();

            return (
                item.status === "Active" &&
                barcode === code
            );

        });

    if (customer) {

        selectedCustomer = customer;

        renderSelectedCustomer();

        showPremiumPopup(
            "Customer Found",
            `${customer.firstName} ${customer.lastName}`,
            "success"
        );

        updateScannerStatus(
            `Customer: ${customer.firstName} ${customer.lastName}`,
            "success"
        );

        productSearch.value = "";
        productSearch.focus();

        return;
    }

    const product = products.find(item => {
        const barcode =
            String(item.barcode || "").trim();

        const sku =
            String(item.sku || "").trim();

        return (
            item.status === "Active" &&
            (
                barcode === code ||
                sku.toLowerCase() === code.toLowerCase()
            )
        );
    });

    if (!product) {
        updateScannerStatus(
            "Barcode Not Found",
            "error"
        );

        showPremiumPopup(
            "Barcode Not Found",
            `No product matches ${code}.`,
            "error"
        );

        productSearch.select();
        return;
    }

    addToCart(product.id);

    updateScannerStatus(
        `Scanned: ${product.name}`,
        "success"
    );

    showPremiumPopup(
        "Product Added",
        `${product.name} added to cart.`,
        "success"
    );

    productSearch.value = "";
    productSearch.focus();
}

function generateOrderNumber() {
    const now = new Date();

    const date =
        `${now.getFullYear()}` +
        `${String(now.getMonth() + 1).padStart(2, "0")}` +
        `${String(now.getDate()).padStart(2, "0")}`;

    const sequence =
        String(orders.length + 1)
            .padStart(5, "0");

    return `ICS-${date}-${sequence}`;
}

function openNumericKeypad(target, title = "Enter Amount") {
    numericKeypadTarget = target;

    numericKeypadTitle.textContent = title;

    numericKeypadValue =
        target.value && Number(target.value) > 0
            ? String(Number(target.value))
            : "";

    if (
        target === manualDiscountValue &&
        manualDiscountType.value === "percent"
    ) {
        numericKeypadDisplay.textContent =
            numericKeypadValue
                ? `${Number(numericKeypadValue)}%`
                : "0%";
    } else {
        numericKeypadDisplay.textContent =
            numericKeypadValue
                ? formatCurrency(Number(numericKeypadValue))
                : formatCurrency(0);
    }

    numericKeypadModal.classList.remove("hidden");
}

let pendingManualDiscount = 0;

requestManualDiscountBtn.addEventListener("click", () => {

    if (appliedDiscountType === "regular") {
        showPremiumPopup(
            "Discount Already Applied",
            "Clear the Regular Discount before requesting a Manual Discount.",
            "error"
        );

        return;
    }

    const subtotal =
        getSubtotal();

    const type =
        manualDiscountType.value;

    const value =
        Number(manualDiscountValue.value) || 0;


    const policy =
        getManualDiscountPolicy();

    if (!policy.enabled) {
        showPremiumPopup(
            "Manual Discount Disabled",
            "Manual discount is disabled in Settings.",
            "error"
        );

        return;
    }

    if (
        type === "percent" &&
        value > policy.maxPercent
    ) {
        showPremiumPopup(
            "Discount Limit Exceeded",
            `Maximum manual discount is ${policy.maxPercent}%.`,
            "error"
        );

        return;
    }

    if (
        type === "amount" &&
        subtotal > 0 &&
        (value / subtotal) * 100 > policy.maxPercent
    ) {
        showPremiumPopup(
            "Discount Limit Exceeded",
            `Maximum manual discount is ${policy.maxPercent}%.`,
            "error"
        );

        return;
    }

    if (subtotal <= 0) {
        showPremiumPopup(
            "No Items",
            "Add products to the cart first.",
            "error"
        );

        return;
    }

    if (value <= 0) {
        showPremiumPopup(
            "Invalid Discount",
            "Enter a manual discount value.",
            "error"
        );

        return;
    }

    if (type === "percent") {

        pendingManualDiscount =
            subtotal * (value / 100);

        manualReviewType.textContent =
            "Percentage";

        manualReviewRequested.textContent =
            `${value}%`;

    } else {

        pendingManualDiscount =
            Math.min(value, subtotal);

        manualReviewType.textContent =
            "Amount";

        manualReviewRequested.textContent =
            formatCurrency(value);
    }

    if (!policy.requireApproval) {
        appliedDiscount =
            pendingManualDiscount;

        appliedDiscountType =
            "manual";

        manualDiscountApproval = {
            approvedByUserId: null,
            approvedByName: "No Approval Required",
            approvedByRole: null,
            reason: "Approval disabled in Settings",
            approvedAt: Date.now()
        };

        renderCart();

        showPremiumPopup(
            "Discount Applied",
            "Manual discount applied without supervisor approval.",
            "success"
        );

        return;
    }

    manualReviewAmount.textContent =
        formatCurrency(
            pendingManualDiscount
        );

    manualReviewSubtotal.textContent =
        formatCurrency(subtotal);

    manualDiscountReason.value = "";
    supervisorBarcode.value = "";
    supervisorPin.value = "";

    approveManualDiscountBtn.disabled = true;

    manualDiscountModal.classList.remove(
        "hidden"
    );

    supervisorBarcode.focus();
});

function closeManualDiscountModal() {
    manualDiscountModal.classList.add("hidden");

    manualDiscountReason.value = "";
    supervisorBarcode.value = "";
    supervisorPin.value = "";
}

closeManualDiscountModalBtn.addEventListener(
    "click",
    closeManualDiscountModal
);

cancelManualDiscountBtn.addEventListener(
    "click",
    closeManualDiscountModal
);

function updateManualDiscountApprovalState() {
    const approver =
        getManualDiscountApprover();

    const hasReason =
        manualDiscountReason.value.trim() !== "";

    approveManualDiscountBtn.disabled =
        !(approver && hasReason);
}

supervisorBarcode.addEventListener(
    "input",
    updateManualDiscountApprovalState
);

supervisorPin.addEventListener(
    "input",
    updateManualDiscountApprovalState
);

manualDiscountReason.addEventListener(
    "change",
    updateManualDiscountApprovalState
);

function showInvalidApproverToast() {
    const barcode =
        supervisorBarcode.value.trim();

    const pin =
        supervisorPin.value.trim();

    if (!barcode && !pin) {
        return;
    }

    const approver =
        getManualDiscountApprover();

    if (!approver) {
        showPremiumPopup(
            "Invalid Approver",
            "Wrong barcode/PIN or user is not authorized.",
            "error"
        );
    }
}

supervisorBarcode.addEventListener(
    "change",
    showInvalidApproverToast
);

supervisorPin.addEventListener(
    "change",
    showInvalidApproverToast
);

approveManualDiscountBtn.addEventListener(
    "click",
    () => {
        const approver =
            getManualDiscountApprover();

        if (!approver) {
            approveManualDiscountBtn.disabled = true;

            showPremiumPopup(
                "Approval Failed",
                "Invalid supervisor barcode or PIN.",
                "error"
            );

            return;
        }

        if (
            manualDiscountReason.value.trim() === ""
        ) {
            showPremiumPopup(
                "Reason Required",
                "Select a manual discount reason.",
                "error"
            );

            return;
        }

        manualDiscountApproval = {
            approvedByUserId: approver.id,
            approvedByName: approver.fullName,
            approvedByRole: approver.role,
            reason: manualDiscountReason.value.trim(),
            approvedAt: Date.now()
        };

        appliedDiscount =
            pendingManualDiscount;

        appliedDiscountType =
            "manual";

        renderCart();

        closeManualDiscountModal();

        showPremiumPopup(
            "Discount Approved",
            `Approved by ${approver.fullName}.`,
            "success"
        );
    }
);

clearDiscountBtn.addEventListener(
    "click",
    () => {
        appliedDiscount = 0;
        appliedDiscountType = null;
        manualDiscountApproval = null;

        discountAmountDisplay.textContent =
            formatCurrency(0);

        clearDiscountBtn.disabled = true;

        renderCart();

        showPremiumPopup(
            "Discount Removed",
            "Applied discount has been cleared.",
            "success"
        );
    }
);

applyDiscountBtn.addEventListener("click", () => {

    const subtotal =
        getSubtotal();

    const category =
        discountCategory.value;

    if (appliedDiscountType === "manual") {
        showPremiumPopup(
            "Discount Already Applied",
            "Clear the Manual Discount before applying a Regular Discount.",
            "error"
        );

        return;
    }

    appliedDiscount = 0;
    appliedDiscountType = null;
    manualDiscountApproval = null;

    if (subtotal <= 0) {
        showPremiumPopup(
            "No Items",
            "Add products to the cart first.",
            "error"
        );

        discountAmountDisplay.textContent =
            formatCurrency(0);

        return;
    }

    if (category === "senior-pwd") {
        showPremiumPopup(
            "Senior / PWD Discount",
            "Senior/PWD product eligibility is not configured yet.",
            "error"
        );

        discountAmountDisplay.textContent =
            formatCurrency(0);

        renderCart();
        return;
    }

    const policy =
        getDiscountPolicy();

    if (
        subtotal <
        policy.minDiscountPurchase
    ) {
        showPremiumPopup(
            "Discount Not Allowed",
            `Minimum purchase is ${formatCurrency(
                policy.minDiscountPurchase
            )}.`,
            "error"
        );

        discountAmountDisplay.textContent =
            formatCurrency(0);

        renderCart();
        return;
    }

    appliedDiscount =
        subtotal *
        (
            policy.maxDiscountPercent / 100
        );

    appliedDiscount =
        Math.min(
            appliedDiscount,
            subtotal
        );

    appliedDiscountType = "regular";

    discountAmountDisplay.textContent =
        formatCurrency(appliedDiscount);

    renderCart();

    showPremiumPopup(
        "Discount Applied",
        `${policy.maxDiscountPercent}% regular discount applied.`,
        "success"
    );
});

manualDiscountValue.addEventListener(
    "click",
    () => {

        const title =
            manualDiscountType.value === "percent"
                ? "Manual Discount %"
                : "Manual Discount Amount";

        openNumericKeypad(
            manualDiscountValue,
            title
        );
    }
);

cashTendered.addEventListener("click", () => {
    openNumericKeypad(
        cashTendered,
        "Cash Tendered"
    );
});


document
    .querySelectorAll(".numeric-keypad-grid button")
    .forEach(button => {

        button.addEventListener("click", () => {

            const key = button.dataset.key;

            if (key === "clear") {
                numericKeypadValue = "";
            }
            else if (key === ".") {

                if (!numericKeypadValue.includes(".")) {

                    numericKeypadValue =
                        numericKeypadValue
                            ? numericKeypadValue + "."
                            : "0.";
                }
            }
            else {

                numericKeypadValue += key;

            }

            numericKeypadDisplay.textContent =
                numericKeypadValue
                    ? formatCurrency(
                        Number(numericKeypadValue)
                    )
                    : formatCurrency(0);

        });

    });


numericKeypadBackspaceBtn.addEventListener(
    "click",
    () => {

        numericKeypadValue =
            numericKeypadValue.slice(0, -1);

        numericKeypadDisplay.textContent =
            numericKeypadValue
                ? formatCurrency(
                    Number(numericKeypadValue)
                )
                : formatCurrency(0);

        if (numericKeypadTarget) {
            numericKeypadTarget.value =
                numericKeypadValue;
        }
    }
);


function closeNumericKeypad() {

    numericKeypadModal.classList.add("hidden");

    numericKeypadTarget = null;
    numericKeypadValue = "";

}


numericKeypadCancelBtn.addEventListener(
    "click",
    closeNumericKeypad
);


numericKeypadCloseBtn.addEventListener(
    "click",
    closeNumericKeypad
);


numericKeypadApplyBtn.addEventListener(
    "click",
    () => {

        if (!numericKeypadTarget) {
            return;
        }

        let finalValue =
            Number(numericKeypadValue || 0);


        numericKeypadTarget.value =
            finalValue.toFixed(2);

        numericKeypadTarget.dispatchEvent(
            new Event("input", {
                bubbles: true
            })
        );

        closeNumericKeypad();

    }
);

function checkout() {
    if (cart.length === 0) {
        showPremiumPopup(
            "Cart Empty",
            "Add at least one product before completing the sale.",
            "error"
        );

        return;
    }

    refreshProducts();

    for (const cartItem of cart) {
        const product =
            products.find(item => {
                return item.id === cartItem.productId;
            });

        if (!product) {
            showPremiumPopup(
                "Product Not Found",
                `${cartItem.name} is no longer available in the product list.`,
                "error"
            );

            return;
        }

        if (
            Number(product.stock) <
            cartItem.quantity
        ) {
            showPremiumPopup(
                "Insufficient Stock",
                `${cartItem.name} does not have enough available stock.`,
                "error"
            );

            return;
        }
    }

    const subtotal =
        getSubtotal();

    const discount =
        getDiscountAmount();

    const total =
        getTotal();

    const method =
        paymentMethod.value;

    if (method === "Split") {
        const splitTotal =
            (Number(splitCash.value) || 0) +
            (Number(splitGCash.value) || 0) +
            (Number(splitMaya.value) || 0) +
            (Number(splitCard.value) || 0);

        if (Math.abs(splitTotal - total) > 0.009) {
            showPremiumPopup(
                splitTotal < total
                    ? "Incomplete Split Payment"
                    : "Split Payment Exceeds Total",

                splitTotal < total
                    ? `Remaining balance is ${formatCurrency(total - splitTotal)}.`
                    : `Payment exceeds the total by ${formatCurrency(splitTotal - total)}.`,

                "error"
            );

            return;
        }
    }

    let splitPayments = null;

    if (method === "Split") {
        splitPayments = {
            Cash: Number(splitCash.value) || 0,
            GCash: Number(splitGCash.value) || 0,
            Maya: Number(splitMaya.value) || 0,
            Card: Number(splitCard.value) || 0
        };
    }

    const tendered =
        method === "Cash"
            ? Number(cashTendered.value) || 0
            : total;

    if (
        method === "Cash" &&
        tendered < total
    ) {
        showPremiumPopup(
            "Insufficient Cash",
            `Tendered amount is less than the total of ${formatCurrency(total)}.`,
            "error"
        );

        cashTendered.focus();
        cashTendered.select();

        return;
    }

    const orderNumber =
        generateOrderNumber();

    const createdAt =
        Date.now();

    const orderItems =
        cart.map(item => {
            return {
                productId: item.productId,
                name: item.name,
                sku: item.sku,
                price: item.price,
                quantity: item.quantity,
                total:
                    item.price * item.quantity
            };
        });

    cart.forEach(cartItem => {
        const product =
            products.find(item => {
                return item.id === cartItem.productId;
            });

        const beforeStock =
            Number(product.stock);

        const afterStock =
            beforeStock - cartItem.quantity;

        product.stock =
            afterStock;

        inventoryHistory.push({
            id:
                Date.now() +
                Math.random(),

            productId:
                product.id,

            productName:
                product.name,

            type:
                "stock-out",

            quantity:
                cartItem.quantity,

            beforeStock,
            afterStock,

            supplierId:
                null,

            supplierName:
                "",

            reference:
                orderNumber,

            remarks:
                "POS Sale",

            createdAt
        });
    });

    const order = {
        id: Date.now(),
        orderNumber,
        customerId:
            selectedCustomer?.id || null,

        customerName:
            selectedCustomer
                ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}`
                : "",

        memberId:
            selectedCustomer?.memberId || "",

        customerType:
            selectedCustomer?.type || "",

        pointsEarned:
            selectedCustomer
                ? calculateLoyaltyPoints(total)
                : 0,
        items: orderItems,
        subtotal,
        discount,
        discountType:
            appliedDiscountType,
        manualDiscountApproval:
            manualDiscountApproval,
        total,
        paymentMethod: method,
        splitPayments,
        tendered,
        change:
            method === "Cash"
                ? tendered - total
                : 0,
        status: "Completed",
        createdAt
    };

    orders.push(order);

    if (
        selectedCustomer &&
        order.pointsEarned > 0
    ) {

        refreshCustomers();

        customers =
            customers.map(customer => {

                if (
                    Number(customer.id) ===
                    Number(selectedCustomer.id)
                ) {

                    return {
                        ...customer,

                        loyaltyPoints:
                            Number(
                                (
                                    Number(
                                        customer.loyaltyPoints || 0
                                    ) +
                                    Number(
                                        order.pointsEarned || 0
                                    )
                                ).toFixed(2)
                            )
                    };

                }

                return customer;

            });


        localStorage.setItem(
            CUSTOMER_STORAGE_KEY,
            JSON.stringify(customers)
        );

    }

    saveProducts();
    saveOrders();
    saveInventoryHistory();

    /*
const shouldOpenDrawer =
    method === "Cash" ||
    (
        method === "Split" &&
        Number(splitPayments?.Cash || 0) > 0
    );

if (shouldOpenDrawer) {
    openCashDrawer();
}
*/

    showReceipt(order);

    cart = [];

    selectedCustomer = null;
    saveCart();

    appliedDiscount = 0;
    appliedDiscountType = null;
    manualDiscountApproval = null;

    discountAmountDisplay.textContent =
        formatCurrency(0);

    cashTendered.value = "";
    splitCash.value = 0;
    splitGCash.value = 0;
    splitMaya.value = 0;
    splitCard.value = 0;

    splitPaidAmount.textContent = formatCurrency(0);
    splitRemainingAmount.textContent = formatCurrency(0);
    refreshProducts();

    renderCategories();
    renderProducts();
    renderCart();
    renderSelectedCustomer();
}

function renderReceiptItemTemplate(
    item,
    product,
    receiptSettings
) {
    const maxLength =
        receiptSettings.productNameMaxLength;

    let productName =
        String(item.name || "");

    if (productName.length > maxLength) {
        productName =
            productName.slice(
                0,
                maxLength
            ) + "...";
    }

    const sku =
        receiptSettings.showSku
            ? (item.sku || "—")
            : "";

    const barcode =
        receiptSettings.showBarcode
            ? (product?.barcode || "—")
            : "";

    let template =
        receiptSettings.bodyTemplate;

    template = template
        .replaceAll(
            "{{productName}}",
            productName
        )
        .replaceAll(
            "{{sku}}",
            sku
        )
        .replaceAll(
            "{{barcode}}",
            barcode
        )
        .replaceAll(
            "{{qty}}",
            String(item.quantity)
        )
        .replaceAll(
            "{{price}}",
            formatCurrency(item.price)
        )
        .replaceAll(
            "{{lineTotal}}",
            formatCurrency(item.total)
        );

    return template;
}

function getReceiptSettings() {
    const settings =
        JSON.parse(
            localStorage.getItem(
                SETTINGS_STORAGE_KEY
            )
        ) || {};

    return {
        header:
            settings.receiptHeader ||
            "Thank you for shopping with us!",

        footer:
            settings.receiptFooter ||
            "Please come again.",

        productNameMaxLength:
            Number(
                settings.receiptProductNameMaxLength
            ) || 26,

        showSku:
            settings.receiptShowSku !== undefined
                ? settings.receiptShowSku
                : true,

        showBarcode:
            settings.receiptShowBarcode !== undefined
                ? settings.receiptShowBarcode
                : true,

        bodyTemplate:
            settings.receiptBodyTemplate ||
            "{{productName}}\nSKU: {{sku}}\nBarcode: {{barcode}}\n{{qty}} x {{price}} = {{lineTotal}}"
    };
}

function showReceipt(order) {

    const receiptSettings =
        getReceiptSettings();

    receiptContent.innerHTML = `

    <div class="receipt-store">

    <h3>
        ${receiptSettings.header}
    </h3>

    </div>

    <div class="receipt-line">

      <span>
        Order
      </span>

      <strong>
        ${order.orderNumber}
      </strong>

    </div>


    <div class="receipt-line">

      <span>
        Date
      </span>

      <span>
        ${new Date(order.createdAt)
            .toLocaleString("en-PH")}
      </span>

    </div>

    ${order.customerId
            ? `
        <div class="receipt-line">
            <span>Customer</span>
            <span>${order.customerName}</span>
        </div>

        <div class="receipt-line">
            <span>Member ID</span>
            <span>${order.memberId || "—"}</span>
        </div>

        <div class="receipt-line">
            <span>Points Earned</span>
            <span>${Number(order.pointsEarned || 0).toFixed(2)} pts</span>
        </div>
    `
            : ""
        }

    <div class="receipt-items">

      ${order.items.map(item => {
            const product =
                products.find(product => product.id === item.productId);

            const image =
                product?.image || "";

            return `

<div class="receipt-item receipt-item-with-image">

    <div class="receipt-item-image-wrap">
        ${image
                    ? `<img src="${image}" alt="${item.name}" class="receipt-item-image">`
                    : `<div class="receipt-item-image placeholder">No Image</div>`
                }
    </div>

        <div class="receipt-item-content">

                <div class="receipt-item-template">
                    ${renderReceiptItemTemplate(
                    item,
                    product,
                    receiptSettings
                )
                    .split("\n")
                    .map(line => `<div>${line}</div>`)
                    .join("")}
                </div>

        </div>

    </div>

`;
        }).join("")}

    </div>


    <div class="receipt-line">

      <span>Subtotal</span>

      <span>
        ${formatCurrency(order.subtotal)}
      </span>

    </div>


    <div class="receipt-line">

      <span>Discount</span>

      <span>
        -${formatCurrency(order.discount)}
      </span>

    </div>

${order.discountType
            ? `
    <div class="receipt-line">
        <span>Discount Type</span>
        <span>
            ${order.discountType === "manual"
                ? "Manual Discount"
                : "Regular Discount"}
        </span>
    </div>
    `
            : ""
        }


    <div class="receipt-line receipt-total">

      <span>Total</span>

      <span>
        ${formatCurrency(order.total)}
      </span>

    </div>

<div class="receipt-line">
    <span>Payment</span>
    <span>${order.paymentMethod}</span>
</div>


    ${order.paymentMethod === "Split" && order.splitPayments
            ? `
        ${order.splitPayments.Cash > 0
                ? `
                <div class="receipt-line">
                    <span>Cash</span>
                    <span>${formatCurrency(order.splitPayments.Cash)}</span>
                </div>
            `
                : ""
            }

        ${order.splitPayments.GCash > 0
                ? `
                <div class="receipt-line">
                    <span>GCash</span>
                    <span>${formatCurrency(order.splitPayments.GCash)}</span>
                </div>
            `
                : ""
            }

        ${order.splitPayments.Maya > 0
                ? `
                <div class="receipt-line">
                    <span>Maya</span>
                    <span>${formatCurrency(order.splitPayments.Maya)}</span>
                </div>
            `
                : ""
            }

        ${order.splitPayments.Card > 0
                ? `
                <div class="receipt-line">
                    <span>Card</span>
                    <span>${formatCurrency(order.splitPayments.Card)}</span>
                </div>
            `
                : ""
            }
    `
            : ""
        }


    ${order.paymentMethod === "Cash"
            ? `
          <div class="receipt-line">

            <span>
              Cash
            </span>

            <span>
              ${formatCurrency(order.tendered)}
            </span>

          </div>


          <div class="receipt-line">

            <span>
              Change
            </span>

            <span>
              ${formatCurrency(order.change)}
            </span>

          </div>
        `
            : ""
        }

        <div class="receipt-store">

        <p>
            ${receiptSettings.footer}
        </p>

    </div>

  `;

    receiptModal.classList.remove("hidden");
}


function resetSale() {
    receiptModal.classList.add("hidden");

    productSearch.focus();
}


productGrid.addEventListener(
    "click",
    event => {

        const titleToggle =
            event.target.closest(".title-toggle");

        if (titleToggle) {
            const card =
                titleToggle.closest(".product-card");

            const title =
                card.querySelector(".product-title");

            title.classList.toggle("expanded");

            titleToggle.textContent =
                title.classList.contains("expanded")
                    ? "⌃"
                    : "⌄";

            return;
        }

        const button =
            event.target.closest(
                "[data-add-product]"
            );

        if (!button) {
            return;
        }

        const productId =
            Number(
                button.dataset.addProduct
            );

        addToCart(productId);
    }
);


categoryFilter.addEventListener("change", () => {
    activeCategory = categoryFilter.value;
    currentPage = 1;

    renderProducts();

    clearTimeout(categoryResetTimer);

    if (activeCategory !== "all") {
        categoryResetTimer = setTimeout(() => {
            activeCategory = "all";
            categoryFilter.value = "all";
            currentPage = 1;

            renderProducts();
        }, 10000);
    }
});


cartItems.addEventListener(
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

        const productId =
            Number(button.dataset.id);

        if (action === "plus") {
            updateQuantity(
                productId,
                1
            );
        }

        if (action === "minus") {
            updateQuantity(
                productId,
                -1
            );
        }

        if (action === "remove") {
            removeFromCart(productId);
        }
    }
);

productSearch.addEventListener("input", () => {
    currentPage = 1;
    renderProducts();

    clearTimeout(searchClearTimer);

    if (productSearch.value.trim() !== "") {
        searchClearTimer = setTimeout(() => {
            productSearch.value = "";
            currentPage = 1;
            renderProducts();
        }, 10000);
    }
});


productSearch.addEventListener(
    "keydown",
    event => {
        if (event.key !== "Enter") {
            return;
        }

        handleBarcode(productSearch.value);
    }
);


cashTendered.addEventListener(
    "input",
    renderCart
);

[splitCash, splitGCash, splitMaya, splitCard]
    .forEach(input => {
        input.addEventListener(
            "input",
            updateSplitPaymentSummary
        );
    });


function syncPaymentUI(method) {

    paymentMethod.value = method;

    quickPayButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.payment === method
        );
    });
}

paymentMethod.addEventListener("change", () => {
    const method = paymentMethod.value;

    syncPaymentUI(method);

    if (method === "Cash") {
        cashPaymentGroup.style.display = "flex";
        splitPaymentGroup.classList.add("hidden");

    } else if (method === "Split") {
        cashPaymentGroup.style.display = "none";
        splitPaymentGroup.classList.remove("hidden");

        cashTendered.value = "";

    } else {
        cashPaymentGroup.style.display = "none";
        splitPaymentGroup.classList.add("hidden");

        cashTendered.value = "";
    }

    renderCart();
});


clearCartBtn.addEventListener("click", () => {
    if (cart.length === 0) {
        return;
    }

    clearCartModal.classList.remove("hidden");
});

cancelClearCart.addEventListener("click", () => {
    clearCartModal.classList.add("hidden");
});

confirmClearCart.addEventListener("click", () => {
    cart = [];

    appliedDiscount = 0;
    appliedDiscountType = null;
    manualDiscountApproval = null;

    saveCart();
    renderCart();

    clearCartModal.classList.add("hidden");

    showPremiumPopup(
        "Cart Cleared",
        "Current order has been cleared.",
        "success"
    );
});

checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
        showPremiumPopup(
            "Cart Empty",
            "Add at least one product before completing the sale.",
            "error"
        );
        return;
    }

    completeSaleModal.classList.remove("hidden");
});

cancelCompleteSale.addEventListener("click", () => {
    completeSaleModal.classList.add("hidden");
});

confirmCompleteSale.addEventListener("click", () => {
    completeSaleModal.classList.add("hidden");
    checkout();
});


closeReceiptBtn.addEventListener(
    "click",
    resetSale
);


newSaleBtn.addEventListener(
    "click",
    resetSale
);


printReceiptBtn.addEventListener(
    "click",
    () => {
        window.print();
    }
);


quickPayButtons.forEach(button => {
    button.addEventListener("click", () => {
        const method = button.dataset.payment;

        paymentMethod.value = method;

        paymentMethod.dispatchEvent(
            new Event("change")
        );

        quickPayButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
    });
});

function shuffleProductsOnce() {
    for (let i = products.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [products[i], products[j]] =
            [products[j], products[i]];
    }
}

viewSelectedCustomerBtn.addEventListener(
    "click",
    openCustomerDetails
);


closeCustomerDetailsBtn.addEventListener(
    "click",
    () => {

        customerDetailsModal.classList.add("hidden");

    }
);

removeSelectedCustomerBtn.addEventListener(
    "click",
    () => {

        if (!selectedCustomer) {
            return;
        }

        removeCustomerModal.classList.remove("hidden");

    }
);


cancelRemoveCustomer.addEventListener(
    "click",
    () => {

        removeCustomerModal.classList.add("hidden");

    }
);


confirmRemoveCustomer.addEventListener(
    "click",
    () => {

        selectedCustomer = null;

        renderSelectedCustomer();

        removeCustomerModal.classList.add("hidden");

        showPremiumPopup(
            "Customer Removed",
            "Customer has been removed from the current order.",
            "success"
        );

        productSearch.focus();

    }
);

removeCustomerModal.addEventListener(
    "click",
    event => {

        if (event.target === removeCustomerModal) {

            removeCustomerModal.classList.add("hidden");

        }

    }
);

function initializePOS() {

    refreshProducts();

    shuffleProductsOnce();

    renderCurrentDate();
    renderCategories();

    setupPosCarousel();

    renderProducts();
    renderCart();
    renderSelectedCustomer();

    productSearch.focus();
}

initializePOS();

function startPageResetTimer() {
    clearTimeout(pageResetTimer);

    pageResetTimer = setTimeout(() => {
        currentPage = 1;
        renderProducts();
    }, 300000);
}

prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderProducts();

        startPageResetTimer();
    }
});

nextPageBtn.addEventListener("click", () => {
    const searchTerm =
        productSearch.value.trim().toLowerCase();

    const filteredProducts =
        products.filter(product => {
            const matchesStatus =
                product.status === "Active";

            const matchesCategory =
                activeCategory === "all" ||
                product.category === activeCategory;

            const searchable = `
                ${product.name}
                ${product.sku}
                ${product.barcode}
                ${product.brand}
            `.toLowerCase();

            const matchesSearch =
                searchable.includes(searchTerm);

            return (
                matchesStatus &&
                matchesCategory &&
                matchesSearch
            );
        });

    const totalPages =
        Math.ceil(
            filteredProducts.length /
            productsPerPage
        );

    if (currentPage < totalPages) {
        currentPage++;
        renderProducts();

        startPageResetTimer();
    }
});