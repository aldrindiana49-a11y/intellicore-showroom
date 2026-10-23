const PRODUCT_STORAGE_KEY = "intellicore_grocery_products";
const ORDER_STORAGE_KEY = "intellicore_orders";
const CUSTOMER_STORAGE_KEY = "intellicore_customers";

let products = [];
let orders = [];
let customers = [];

const currentDate =
    document.getElementById("currentDate");

const todaySales =
    document.getElementById("todaySales");

const todayOrdersText =
    document.getElementById("todayOrdersText");

const totalOrders =
    document.getElementById("totalOrders");

const totalProducts =
    document.getElementById("totalProducts");

const totalCustomers =
    document.getElementById("totalCustomers");

const lowStockCount =
    document.getElementById("lowStockCount");

const outOfStockCount =
    document.getElementById("outOfStockCount");

const totalStockQty =
    document.getElementById("totalStockQty");

const inventoryAssetValue =
    document.getElementById(
        "inventoryAssetValue"
    );

const todayDiscount =
    document.getElementById("todayDiscount");

const salesOverviewChart =
    document.getElementById(
        "salesOverviewChart"
    );

let salesOverviewChartInstance = null;

let salesOverviewRange = "week";

const salesOverviewSubtitle =
    document.getElementById(
        "salesOverviewSubtitle"
    );

const rangeSales =
    document.getElementById(
        "rangeSales"
    );

const rangeTransactions =
    document.getElementById(
        "rangeTransactions"
    );

const rangeAverageOrder =
    document.getElementById(
        "rangeAverageOrder"
    );

const salesRangeButtons =
    document.querySelectorAll(
        ".sales-range-btn"
    );

const paymentBreakdown =
    document.getElementById("paymentBreakdown");

const topProductsBody =
    document.getElementById("topProductsBody");

const recentOrdersBody =
    document.getElementById("recentOrdersBody");

const inventoryAlerts =
    document.getElementById("inventoryAlerts");

const summaryGrossSales =
    document.getElementById("summaryGrossSales");

const summaryDiscounts =
    document.getElementById("summaryDiscounts");

const summaryNetSales =
    document.getElementById("summaryNetSales");

const summaryItemsSold =
    document.getElementById("summaryItemsSold");

const summaryAverageOrder =
    document.getElementById("summaryAverageOrder");


function formatCurrency(value) {
    return `₱${Number(value || 0).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}


function refreshData() {
    products =
        JSON.parse(localStorage.getItem(PRODUCT_STORAGE_KEY)) || [];

    orders =
        JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY)) || [];

    customers =
        JSON.parse(localStorage.getItem(CUSTOMER_STORAGE_KEY)) || [];
}


function isToday(timestamp) {
    const date = new Date(timestamp);
    const today = new Date();

    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
}


function getCompletedOrders() {
    return orders.filter(order => {
        return order.status === "Completed";
    });
}


function getTodayOrders() {
    return getCompletedOrders().filter(order => {
        return isToday(order.createdAt);
    });
}


function renderHeader() {
    currentDate.textContent =
        new Date().toLocaleDateString("en-PH", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
}


function renderMainStats() {
    const completed =
        getCompletedOrders();

    const today =
        getTodayOrders();

    const salesToday =
        today.reduce((sum, order) => {
            return sum + Number(order.total || 0);
        }, 0);

    todaySales.textContent =
        formatCurrency(salesToday);

    todayOrdersText.textContent =
        `${today.length} ${today.length === 1
            ? "order"
            : "orders"
        } today`;

    totalOrders.textContent =
        completed.length;

    totalProducts.textContent =
        products.length;

    totalCustomers.textContent =
        customers.length;
}


function getStockStatus(product) {
    const stock =
        Number(product.stock || 0);

    const reorder =
        Number(product.reorderLevel || 0);

    if (stock <= 0) {
        return "out";
    }

    if (stock <= reorder) {
        return "low";
    }

    return "normal";
}


function renderInventorySummary() {
    const lowStock =
        products.filter(product => {
            return getStockStatus(product) === "low";
        });

    const outStock =
        products.filter(product => {
            return getStockStatus(product) === "out";
        });

    const totalQty =
        products.reduce((sum, product) => {
            return sum + Number(product.stock || 0);
        }, 0);

    const assetValue =
        products.reduce(
            (sum, product) => {
                return sum +
                    (
                        Number(product.cost || 0) *
                        Number(product.stock || 0)
                    );
            },
            0
        );

    const todayOrders =
        getTodayOrders();

    const discount =
        todayOrders.reduce((sum, order) => {
            return sum + Number(order.discount || 0);
        }, 0);

    lowStockCount.textContent =
        lowStock.length;

    outOfStockCount.textContent =
        outStock.length;

    totalStockQty.textContent =
        totalQty.toLocaleString("en-PH");

    if (inventoryAssetValue) {
        inventoryAssetValue.textContent =
            formatCurrency(assetValue);
    }

    todayDiscount.textContent =
        formatCurrency(discount);
}

function renderSalesOverview() {

    if (!salesOverviewChart) {
        return;
    }

    const completedOrders =
        getCompletedOrders();

    const labels = [];
    const salesData = [];

    const now =
        new Date();


    // DAY
    if (salesOverviewRange === "day") {

        if (salesOverviewSubtitle) {
            salesOverviewSubtitle.textContent =
                "Hourly sales for today.";
        }

        for (let hour = 0; hour < 24; hour++) {

            const start =
                new Date();

            start.setHours(
                hour,
                0,
                0,
                0
            );

            const end =
                new Date(start);

            end.setHours(
                hour + 1
            );

            const sales =
                completedOrders
                    .filter(order => {

                        const orderDate =
                            new Date(
                                order.createdAt
                            );

                        return (
                            orderDate >= start &&
                            orderDate < end
                        );
                    })
                    .reduce(
                        (sum, order) =>
                            sum +
                            Number(
                                order.total || 0
                            ),
                        0
                    );

            labels.push(
                start.toLocaleTimeString(
                    "en-PH",
                    {
                        hour: "numeric"
                    }
                )
            );

            salesData.push(sales);
        }
    }


    // WEEK
    else if (
        salesOverviewRange === "week"
    ) {

        if (salesOverviewSubtitle) {
            salesOverviewSubtitle.textContent =
                "Sales performance for the last 7 days.";
        }

        for (let i = 6; i >= 0; i--) {

            const start =
                new Date();

            start.setHours(
                0,
                0,
                0,
                0
            );

            start.setDate(
                start.getDate() - i
            );

            const end =
                new Date(start);

            end.setDate(
                end.getDate() + 1
            );

            const sales =
                completedOrders
                    .filter(order => {

                        const orderDate =
                            new Date(
                                order.createdAt
                            );

                        return (
                            orderDate >= start &&
                            orderDate < end
                        );
                    })
                    .reduce(
                        (sum, order) =>
                            sum +
                            Number(
                                order.total || 0
                            ),
                        0
                    );

            labels.push(
                start.toLocaleDateString(
                    "en-PH",
                    {
                        month: "short",
                        day: "numeric"
                    }
                )
            );

            salesData.push(sales);
        }
    }


    // MONTH
    else if (
        salesOverviewRange === "month"
    ) {

        if (salesOverviewSubtitle) {
            salesOverviewSubtitle.textContent =
                "Daily sales for the current month.";
        }

        const year =
            now.getFullYear();

        const month =
            now.getMonth();

        const daysInMonth =
            new Date(
                year,
                month + 1,
                0
            ).getDate();

        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {

            const start =
                new Date(
                    year,
                    month,
                    day
                );

            const end =
                new Date(
                    year,
                    month,
                    day + 1
                );

            const sales =
                completedOrders
                    .filter(order => {

                        const orderDate =
                            new Date(
                                order.createdAt
                            );

                        return (
                            orderDate >= start &&
                            orderDate < end
                        );
                    })
                    .reduce(
                        (sum, order) =>
                            sum +
                            Number(
                                order.total || 0
                            ),
                        0
                    );

            labels.push(
                String(day)
            );

            salesData.push(sales);
        }
    }


    // YEAR
    else {

        if (salesOverviewSubtitle) {
            salesOverviewSubtitle.textContent =
                "Monthly sales for the current year.";
        }

        const year =
            now.getFullYear();

        for (
            let month = 0;
            month < 12;
            month++
        ) {

            const start =
                new Date(
                    year,
                    month,
                    1
                );

            const end =
                new Date(
                    year,
                    month + 1,
                    1
                );

            const sales =
                completedOrders
                    .filter(order => {

                        const orderDate =
                            new Date(
                                order.createdAt
                            );

                        return (
                            orderDate >= start &&
                            orderDate < end
                        );
                    })
                    .reduce(
                        (sum, order) =>
                            sum +
                            Number(
                                order.total || 0
                            ),
                        0
                    );

            labels.push(
                start.toLocaleDateString(
                    "en-PH",
                    {
                        month: "short"
                    }
                )
            );

            salesData.push(sales);
        }
    }


    let rangeOrders = [];

    if (salesOverviewRange === "day") {

        rangeOrders =
            getTodayOrders();

    }

    else if (salesOverviewRange === "week") {

        const start =
            new Date();

        start.setHours(0, 0, 0, 0);
        start.setDate(start.getDate() - 6);

        rangeOrders =
            completedOrders.filter(order => {
                return new Date(order.createdAt) >= start;
            });

    }

    else if (salesOverviewRange === "month") {

        rangeOrders =
            completedOrders.filter(order => {

                const orderDate =
                    new Date(order.createdAt);

                return (
                    orderDate.getFullYear() ===
                    now.getFullYear() &&
                    orderDate.getMonth() ===
                    now.getMonth()
                );
            });

    }

    else {

        rangeOrders =
            completedOrders.filter(order => {

                const orderDate =
                    new Date(order.createdAt);

                return (
                    orderDate.getFullYear() ===
                    now.getFullYear()
                );
            });
    }


    const totalRangeSales =
        rangeOrders.reduce(
            (sum, order) =>
                sum + Number(order.total || 0),
            0
        );

    const averageRangeOrder =
        rangeOrders.length > 0
            ? totalRangeSales / rangeOrders.length
            : 0;


    if (rangeSales) {
        rangeSales.textContent =
            formatCurrency(totalRangeSales);
    }

    if (rangeTransactions) {
        rangeTransactions.textContent =
            rangeOrders.length;
    }

    if (rangeAverageOrder) {
        rangeAverageOrder.textContent =
            formatCurrency(averageRangeOrder);
    }

    if (salesOverviewChartInstance) {
        salesOverviewChartInstance.destroy();
    }


    salesOverviewChartInstance =
        new Chart(
            salesOverviewChart,
            {
                type: "line",

                data: {
                    labels: labels,

                    datasets: [
                        {
                            label: "Sales",
                            data: salesData,
                            borderWidth: 3,
                            tension: 0.35,
                            fill: true
                        }
                    ]
                },

                options: {
                    responsive: true,
                    maintainAspectRatio: false,

                    plugins: {
                        legend: {
                            display: false
                        },

                        tooltip: {
                            callbacks: {
                                label: context => {
                                    return "Sales: " +
                                        formatCurrency(
                                            context.raw
                                        );
                                }
                            }
                        }
                    },

                    scales: {
                        x: {
                            ticks: {
                                maxRotation: 0,
                                autoSkip: true,
                                maxTicksLimit:
                                    salesOverviewRange === "month"
                                        ? 10
                                        : 12
                            },

                            grid: {
                                display: false
                            }
                        },

                        y: {
                            beginAtZero: true,

                            ticks: {
                                callback: value => {
                                    return "₱" +
                                        Number(value)
                                            .toLocaleString(
                                                "en-PH"
                                            );
                                }
                            }
                        }
                    }
                }
            }
        );
}

function renderPaymentBreakdown() {
    const today =
        getTodayOrders();

    const payments = {};

    today.forEach(order => {
        const method =
            order.paymentMethod || "Unknown";

        if (!payments[method]) {
            payments[method] = {
                count: 0,
                total: 0
            };
        }

        payments[method].count += 1;

        payments[method].total +=
            Number(order.total || 0);
    });

    paymentBreakdown.innerHTML = "";

    const entries =
        Object.entries(payments);

    if (entries.length === 0) {
        paymentBreakdown.innerHTML = `
      <div class="empty-state">
        No sales today.
      </div>
    `;

        return;
    }

    entries.forEach(([method, data]) => {
        const element =
            document.createElement("div");

        element.className =
            "payment-item";

        element.innerHTML = `
      <div class="payment-info">

        <strong>
          ${method}
        </strong>

        <span>
          ${data.count}
          ${data.count === 1
                ? "transaction"
                : "transactions"
            }
        </span>

      </div>

      <div class="payment-value">
        ${formatCurrency(data.total)}
      </div>
    `;

        paymentBreakdown.appendChild(element);
    });
}


function renderTopProducts() {
    const today =
        getTodayOrders();

    const productSales = {};

    today.forEach(order => {
        if (!Array.isArray(order.items)) {
            return;
        }

        order.items.forEach(item => {
            const key =
                String(item.productId);

            if (!productSales[key]) {
                productSales[key] = {
                    name: item.name,
                    quantity: 0,
                    sales: 0
                };
            }

            productSales[key].quantity +=
                Number(item.quantity || 0);

            productSales[key].sales +=
                Number(item.total || 0);
        });
    });

    const ranked =
        Object.values(productSales)
            .sort((a, b) => {
                return b.quantity - a.quantity;
            })
            .slice(0, 5);

    topProductsBody.innerHTML = "";

    if (ranked.length === 0) {
        topProductsBody.innerHTML = `
      <tr>
        <td colspan="3" class="empty-state">
          No product sales today.
        </td>
      </tr>
    `;

        return;
    }

    ranked.forEach(item => {
        const row =
            document.createElement("tr");

        row.innerHTML = `
      <td>
        <strong>
          ${item.name}
        </strong>
      </td>

      <td>
        ${item.quantity}
      </td>

      <td>
        ${formatCurrency(item.sales)}
      </td>
    `;

        topProductsBody.appendChild(row);
    });
}


function renderRecentOrders() {
    const recent =
        [...getCompletedOrders()]
            .sort((a, b) => {
                return Number(b.createdAt) -
                    Number(a.createdAt);
            })
            .slice(0, 7);

    recentOrdersBody.innerHTML = "";

    if (recent.length === 0) {
        recentOrdersBody.innerHTML = `
      <tr>
        <td colspan="4" class="empty-state">
          No orders yet.
        </td>
      </tr>
    `;

        return;
    }

    recent.forEach(order => {
        const row =
            document.createElement("tr");

        row.innerHTML = `
      <td>
        <strong>
          ${order.orderNumber}
        </strong>
      </td>

      <td>
        ${new Date(order.createdAt)
                .toLocaleTimeString(
                    "en-PH",
                    {
                        hour: "numeric",
                        minute: "2-digit"
                    }
                )}
      </td>

      <td>
        ${formatCurrency(order.total)}
      </td>

      <td>
        ${order.paymentMethod}
      </td>
    `;

        recentOrdersBody.appendChild(row);
    });
}


function renderInventoryAlerts() {
    const alerts =
        products
            .filter(product => {
                const status =
                    getStockStatus(product);

                return (
                    status === "low" ||
                    status === "out"
                );
            })
            .sort((a, b) => {
                return Number(a.stock) -
                    Number(b.stock);
            })
            .slice(0, 8);

    inventoryAlerts.innerHTML = "";

    if (alerts.length === 0) {
        inventoryAlerts.innerHTML = `
      <div class="empty-state">
        Inventory levels are healthy.
      </div>
    `;

        return;
    }

    alerts.forEach(product => {
        const status =
            getStockStatus(product);

        const element =
            document.createElement("div");

        element.className =
            "alert-item";

        element.innerHTML = `
      <div class="alert-product">

        <strong>
          ${product.name}
        </strong>

        <span>
          Reorder Level:
          ${product.reorderLevel || 0}
        </span>

      </div>

      <div
        class="alert-stock ${status === "out"
                ? "alert-out"
                : "alert-low"
            }"
      >
        ${status === "out"
                ? "Out of Stock"
                : `Stock: ${product.stock}`
            }
      </div>
    `;

        inventoryAlerts.appendChild(element);
    });
}


function renderTodaySummary() {
    const today =
        getTodayOrders();

    const subtotal =
        today.reduce((sum, order) => {
            return sum +
                Number(order.subtotal || 0);
        }, 0);

    const discounts =
        today.reduce((sum, order) => {
            return sum +
                Number(order.discount || 0);
        }, 0);

    const netSales =
        today.reduce((sum, order) => {
            return sum +
                Number(order.total || 0);
        }, 0);

    const itemsSold =
        today.reduce((sum, order) => {
            if (!Array.isArray(order.items)) {
                return sum;
            }

            const qty =
                order.items.reduce(
                    (itemSum, item) => {
                        return itemSum +
                            Number(item.quantity || 0);
                    },
                    0
                );

            return sum + qty;
        }, 0);

    const average =
        today.length > 0
            ? netSales / today.length
            : 0;

    summaryGrossSales.textContent =
        formatCurrency(subtotal);

    summaryDiscounts.textContent =
        formatCurrency(discounts);

    summaryNetSales.textContent =
        formatCurrency(netSales);

    summaryItemsSold.textContent =
        itemsSold.toLocaleString("en-PH");

    summaryAverageOrder.textContent =
        formatCurrency(average);
}

salesRangeButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            salesOverviewRange =
                button.dataset.range;

            salesRangeButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            renderSalesOverview();
        }
    );

});

function renderDashboard() {
    refreshData();

    renderHeader();
    renderMainStats();
    renderInventorySummary();
    renderSalesOverview();
    renderPaymentBreakdown();
    renderTopProducts();
    renderRecentOrders();
    renderInventoryAlerts();
    renderTodaySummary();
}


renderDashboard();