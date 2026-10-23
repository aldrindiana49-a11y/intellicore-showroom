const ORDER_STORAGE_KEY = "intellicore_orders";

const PRODUCT_STORAGE_KEY = "intellicore_grocery_products";
const INVENTORY_HISTORY_KEY = "intellicore_inventory_history";

let orders =
    JSON.parse(
        localStorage.getItem(ORDER_STORAGE_KEY)
    ) || [];

let products =
    JSON.parse(
        localStorage.getItem(PRODUCT_STORAGE_KEY)
    ) || [];

let inventoryHistory =
    JSON.parse(
        localStorage.getItem(INVENTORY_HISTORY_KEY)
    ) || [];

let selectedOrderId = null;

let currentPage = 1;
const ordersPerPage = 10;

/* ELEMENTS */

const totalOrders =
    document.getElementById("totalOrders");

const totalSales =
    document.getElementById("totalSales");

const cashSales =
    document.getElementById("cashSales");

const nonCashSales =
    document.getElementById("nonCashSales");

const searchInput =
    document.getElementById("searchInput");

const paymentFilter =
    document.getElementById("paymentFilter");

const statusFilter =
    document.getElementById("statusFilter");

const ordersTableBody =
    document.getElementById("ordersTableBody");

const orderModal =
    document.getElementById("orderModal");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const closeOrderBtn =
    document.getElementById("closeOrderBtn");

const printReceiptBtn =
    document.getElementById("printReceiptBtn");

const modalOrderNumber =
    document.getElementById("modalOrderNumber");

const orderDetails =
    document.getElementById("orderDetails");

const orderPagination =
    document.getElementById("orderPagination");

const prevPageBtn =
    document.getElementById("prevPageBtn");

const nextPageBtn =
    document.getElementById("nextPageBtn");

const pageNumbers =
    document.getElementById("pageNumbers");

const voidOrderModal =
    document.getElementById("voidOrderModal");

const voidOrderMessage =
    document.getElementById("voidOrderMessage");

const cancelVoidOrder =
    document.getElementById("cancelVoidOrder");

const confirmVoidOrder =
    document.getElementById("confirmVoidOrder");

let pendingVoidOrderId = null;

const premiumPopup =
    document.getElementById("premiumPopup");

const premiumPopupIcon =
    document.getElementById("premiumPopupIcon");

const premiumPopupTitle =
    document.getElementById("premiumPopupTitle");

const premiumPopupMessage =
    document.getElementById("premiumPopupMessage");

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


/* CURRENCY */

function formatCurrency(value) {
    return `₱${Number(value || 0).toLocaleString(
        "en-PH",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    )}`;
}


/* DATE */

function formatDate(timestamp) {

    if (!timestamp) {
        return "—";
    }

    return new Date(timestamp).toLocaleString(
        "en-PH",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );

}


/* SAVE */

function saveOrders() {

    localStorage.setItem(
        ORDER_STORAGE_KEY,
        JSON.stringify(orders)
    );

}

function saveProducts() {
    localStorage.setItem(
        PRODUCT_STORAGE_KEY,
        JSON.stringify(products)
    );
}

function saveInventoryHistory() {
    localStorage.setItem(
        INVENTORY_HISTORY_KEY,
        JSON.stringify(inventoryHistory)
    );
}


/* STATS */

function renderStats() {

    const completedOrders =
        orders.filter(order => {
            return order.status === "Completed";
        });


    totalOrders.textContent =
        completedOrders.length;


    const sales =
        completedOrders.reduce(
            (sum, order) => {
                return sum + Number(order.total || 0);
            },
            0
        );


    totalSales.textContent =
        formatCurrency(sales);


    const cash =
        completedOrders.reduce((sum, order) => {

            if (order.paymentMethod === "Cash") {
                return sum + Number(order.total || 0);
            }

            if (
                order.paymentMethod === "Split" &&
                order.splitPayments
            ) {
                return sum +
                    Number(order.splitPayments.Cash || 0);
            }

            return sum;

        }, 0);

    cashSales.textContent =
        formatCurrency(cash);


    const nonCash =
        sales - cash;


    nonCashSales.textContent =
        formatCurrency(nonCash);

}


/* TABLE */

function renderOrders() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedPayment =
        paymentFilter.value;


    const selectedStatus =
        statusFilter.value;


    const filteredOrders =
        [...orders]
            .filter(order => {

                const matchesSearch =
                    String(order.orderNumber || "")
                        .toLowerCase()
                        .includes(searchTerm);


                const matchesPayment =
                    selectedPayment === "all" ||
                    order.paymentMethod === selectedPayment;


                const matchesStatus =
                    selectedStatus === "all" ||
                    order.status === selectedStatus;


                return (
                    matchesSearch &&
                    matchesPayment &&
                    matchesStatus
                );

            })
            .sort((a, b) => {
                return Number(b.createdAt) -
                    Number(a.createdAt);
            });


    const totalPages =
        Math.ceil(filteredOrders.length / ordersPerPage);

    if (currentPage > totalPages) {
        currentPage = totalPages || 1;
    }

    const startIndex =
        (currentPage - 1) * ordersPerPage;

    const endIndex =
        startIndex + ordersPerPage;

    const paginatedOrders =
        filteredOrders.slice(startIndex, endIndex);

    ordersTableBody.innerHTML = "";


    if (filteredOrders.length === 0) {

        ordersTableBody.innerHTML = `
      <tr>
        <td
          colspan="9"
          class="empty-row"
        >
          No orders found.
        </td>
      </tr>
    `;

        return;

    }


    paginatedOrders.forEach(order => {

        const itemCount =
            Array.isArray(order.items)
                ? order.items.reduce(
                    (sum, item) => {
                        return sum +
                            Number(item.quantity || 0);
                    },
                    0
                )
                : 0;


        const row =
            document.createElement("tr");


        row.innerHTML = `

      <td class="order-number">
        ${order.orderNumber || "—"}
      </td>


      <td>
        ${formatDate(order.createdAt)}
      </td>


      <td>
        ${itemCount}
      </td>


      <td>
        ${formatCurrency(order.subtotal)}
      </td>


      <td>
        ${formatCurrency(order.discount)}
      </td>


      <td>
        <strong>
          ${formatCurrency(order.total)}
        </strong>
      </td>


      <td>
        <span class="payment-badge">
          ${order.paymentMethod || "—"}
        </span>
      </td>


      <td>

        <span
          class="status ${order.status === "Completed"
                ? "status-completed"
                : "status-cancelled"
            }"
        >
          ${order.status || "Completed"}
        </span>

      </td>


      <td>

        <button
          class="action-btn view-btn"
          data-action="view"
          data-id="${order.id}"
        >
          View
        </button>


        <button
            class="action-btn delete-btn"
            data-action="void"
            data-id="${order.id}"
            >
            Void
        </button>

      </td>

    `;


        ordersTableBody.appendChild(row);

    });

    renderPagination(totalPages);

}

function renderPagination(totalPages) {
    pageNumbers.innerHTML = "";

    if (totalPages <= 1) {
        orderPagination.style.display = "none";
        return;
    }

    orderPagination.style.display = "flex";

    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;

    for (let page = 1; page <= totalPages; page++) {
        const button = document.createElement("button");

        button.type = "button";
        button.textContent = page;

        button.className =
            page === currentPage
                ? "page-btn active"
                : "page-btn";

        button.addEventListener("click", () => {
            currentPage = page;
            renderOrders();
        });

        pageNumbers.appendChild(button);
    }
}


/* VIEW ORDER */

function openOrderDetails(id) {

    const order =
        orders.find(item => {
            return Number(item.id) === Number(id);
        });


    if (!order) {
        return;
    }


    selectedOrderId =
        order.id;


    modalOrderNumber.textContent =
        order.orderNumber;


    const itemsHtml =
        Array.isArray(order.items)
            ? order.items.map(item => {

                return `

            <div class="order-item">

              <div class="order-item-name">
                ${item.name}
              </div>


              <div class="order-item-info">

                <span>
                  ${item.quantity}
                  ×
                  ${formatCurrency(item.price)}
                </span>


                <strong>
                  ${formatCurrency(item.total)}
                </strong>

              </div>

            </div>

          `;

            }).join("")
            : "";


    orderDetails.innerHTML = `

    <div class="detail-row">
      <span>Order Number</span>

      <strong>
        ${order.orderNumber}
      </strong>
    </div>

    ${order.paymentMethod === "Split" && order.splitPayments
            ? `
        <div class="detail-row">
          <span>Cash</span>
          <strong>
            ${formatCurrency(order.splitPayments.Cash || 0)}
          </strong>
        </div>

        <div class="detail-row">
          <span>GCash</span>
          <strong>
            ${formatCurrency(order.splitPayments.GCash || 0)}
          </strong>
        </div>

        <div class="detail-row">
          <span>Maya</span>
          <strong>
            ${formatCurrency(order.splitPayments.Maya || 0)}
          </strong>
        </div>

        <div class="detail-row">
          <span>Card</span>
          <strong>
            ${formatCurrency(order.splitPayments.Card || 0)}
          </strong>
        </div>
    `
            : ""
        }

    <div class="detail-row">
      <span>Date</span>

      <strong>
        ${formatDate(order.createdAt)}
      </strong>
    </div>


    <div class="detail-row">
      <span>Status</span>

      <strong>
        ${order.status}
      </strong>
    </div>


    <div class="order-items">

      <h3>Items</h3>

      ${itemsHtml}

    </div>


    <div class="detail-row">
      <span>Subtotal</span>

      <strong>
        ${formatCurrency(order.subtotal)}
      </strong>
    </div>


    <div class="detail-row">
      <span>Discount</span>

      <strong>
        -${formatCurrency(order.discount)}
      </strong>
    </div>

${order.discountType
            ? `
    <div class="detail-row">
        <span>Discount Type</span>

        <strong>
            ${order.discountType === "manual"
                ? "Manual Discount"
                : "Regular Discount"}
        </strong>
    </div>
    `
            : ""
        }

        ${order.discountType === "manual" &&
            order.manualDiscountApproval
            ? `
    <div class="detail-row">
        <span>Approved By</span>

        <strong>
            ${order.manualDiscountApproval.approvedByName || "—"}
        </strong>
    </div>

    <div class="detail-row">
        <span>Approver Role</span>

        <strong>
            ${order.manualDiscountApproval.approvedByRole || "—"}
        </strong>
    </div>

    <div class="detail-row">
        <span>Reason</span>

        <strong>
            ${order.manualDiscountApproval.reason || "—"}
        </strong>
    </div>

    <div class="detail-row">
        <span>Approved At</span>

        <strong>
            ${formatDate(
                order.manualDiscountApproval.approvedAt
            )}
        </strong>
    </div>
    `
            : ""
        }

    <div class="detail-row grand-total">
      <span>Total</span>

      <strong>
        ${formatCurrency(order.total)}
      </strong>
    </div>


    <div class="detail-row">
      <span>Payment Method</span>

      <strong>
        ${order.paymentMethod}
      </strong>
    </div>


    ${order.paymentMethod === "Cash"
            ? `

          <div class="detail-row">
            <span>Cash Tendered</span>

            <strong>
              ${formatCurrency(order.tendered)}
            </strong>
          </div>


          <div class="detail-row">
            <span>Change</span>

            <strong>
              ${formatCurrency(order.change)}
            </strong>
          </div>

        `
            : ""
        }

  `;


    orderModal.classList.remove("hidden");

}


/* CLOSE */

function closeOrderModal() {

    orderModal.classList.add("hidden");

    selectedOrderId = null;

}


/* Void */

function voidOrder(id) {

    const order =
        orders.find(item => {
            return Number(item.id) === Number(id);
        });

    if (!order) {
        return;
    }

    if (order.status === "Voided") {
        showPremiumPopup(
            "Already Voided",
            "This transaction has already been voided.",
            "error"
        );

        return;
    }

    pendingVoidOrderId = id;

    voidOrderMessage.textContent =
        `Void transaction "${order.orderNumber}"?`;

    voidOrderModal.classList.remove("hidden");
}

cancelVoidOrder.addEventListener("click", () => {
    pendingVoidOrderId = null;
    voidOrderModal.classList.add("hidden");
});

confirmVoidOrder.addEventListener("click", () => {

    if (pendingVoidOrderId === null) {
        return;
    }

    const order =
        orders.find(item => {
            return Number(item.id) === Number(pendingVoidOrderId);
        });

    if (!order) {
        return;
    }

    order.status = "Voided";

    order.voidedAt = Date.now();

    order.voidReason = "Manual void";

    const voidedAt = Date.now();

    order.items.forEach(item => {

        const product =
            products.find(product => {
                return Number(product.id) === Number(item.productId);
            });

        if (!product) {
            return;
        }

        const beforeStock =
            Number(product.stock || 0);

        const quantityReturned =
            Number(item.quantity || 0);

        const afterStock =
            beforeStock + quantityReturned;

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
                "stock-in",

            quantity:
                quantityReturned,

            beforeStock,
            afterStock,

            supplierId: null,

            supplierName: "",

            reference:
                order.orderNumber,

            remarks:
                "Void Reversal",

            createdAt:
                voidedAt
        });
    });

    saveOrders();
    saveProducts();
    saveInventoryHistory();

    renderAll();

    voidOrderModal.classList.add("hidden");

    pendingVoidOrderId = null;

    showPremiumPopup(
        "Transaction Voided",
        "The transaction has been voided successfully.",
        "success"
    );
});

/* TABLE ACTIONS */

ordersTableBody.addEventListener(
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


        if (action === "view") {

            openOrderDetails(id);

        }


        if (action === "void") {

            voidOrder(id);

        }

    }
);


searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderOrders();
});

paymentFilter.addEventListener("change", () => {
    currentPage = 1;
    renderOrders();
});

statusFilter.addEventListener("change", () => {
    currentPage = 1;
    renderOrders();
});


/* CLOSE BUTTONS */

closeModalBtn.addEventListener(
    "click",
    closeOrderModal
);


closeOrderBtn.addEventListener(
    "click",
    closeOrderModal
);


orderModal.addEventListener(
    "click",
    event => {

        if (event.target === orderModal) {

            closeOrderModal();

        }

    }
);


/* PRINT */

printReceiptBtn.addEventListener(
    "click",
    () => {

        if (!selectedOrderId) {
            return;
        }

        window.print();

    }
);


/* REFRESH */

function refreshOrders() {

    orders =
        JSON.parse(
            localStorage.getItem(ORDER_STORAGE_KEY)
        ) || [];

}


/* RENDER ALL */

function renderAll() {

    refreshOrders();

    renderStats();

    renderOrders();

}


/* INITIALIZE */

prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderOrders();
    }
});

nextPageBtn.addEventListener("click", () => {
    const searchTerm =
        searchInput.value.trim().toLowerCase();

    const selectedPayment =
        paymentFilter.value;

    const selectedStatus =
        statusFilter.value;

    const filteredOrders =
        [...orders].filter(order => {

            const matchesSearch =
                String(order.orderNumber || "")
                    .toLowerCase()
                    .includes(searchTerm);

            const matchesPayment =
                selectedPayment === "all" ||
                order.paymentMethod === selectedPayment;

            const matchesStatus =
                selectedStatus === "all" ||
                order.status === selectedStatus;

            return (
                matchesSearch &&
                matchesPayment &&
                matchesStatus
            );
        });

    const totalPages =
        Math.ceil(filteredOrders.length / ordersPerPage);

    if (currentPage < totalPages) {
        currentPage++;
        renderOrders();
    }
});

renderAll();