const ORDER_STORAGE_KEY =
    "intellicore_orders";

const PRODUCT_STORAGE_KEY =
    "intellicore_grocery_products";

const EXPENSE_STORAGE_KEY =
    "intellicore_expenses";


let orders =
    JSON.parse(
        localStorage.getItem(ORDER_STORAGE_KEY)
    ) || [];


let products =
    JSON.parse(
        localStorage.getItem(PRODUCT_STORAGE_KEY)
    ) || [];

let expenses =
    JSON.parse(
        localStorage.getItem(EXPENSE_STORAGE_KEY)
    ) || [];

let filteredExpenses = [];

let filteredOrders = [];


/* ELEMENTS */

const startDate =
    document.getElementById("startDate");

const endDate =
    document.getElementById("endDate");

const paymentFilter =
    document.getElementById("paymentFilter");

const applyFilterBtn =
    document.getElementById("applyFilterBtn");

const resetFilterBtn =
    document.getElementById("resetFilterBtn");

const exportCsvBtn =
    document.getElementById("exportCsvBtn");

const printReportBtn =
    document.getElementById("printReportBtn");


const totalSales =
    document.getElementById("totalSales");

const totalOrders =
    document.getElementById("totalOrders");

const totalDiscount =
    document.getElementById("totalDiscount");

const averageOrder =
    document.getElementById("averageOrder");

const grossProfit =
    document.getElementById("grossProfit");

const totalExpenses =
    document.getElementById(
        "totalExpenses"
    );

const netProfit =
    document.getElementById(
        "netProfit"
    );

const paymentBreakdown =
    document.getElementById("paymentBreakdown");

const topProductsBody =
    document.getElementById("topProductsBody");

const categorySalesBody =
    document.getElementById("categorySalesBody");

const transactionsBody =
    document.getElementById("transactionsBody");

const expensesReportBody =
    document.getElementById(
        "expensesReportBody"
    );

/* HELPERS */

function formatCurrency(value) {

    return `₱${Number(value || 0)
        .toLocaleString(
            "en-PH",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )}`;

}


function formatDate(timestamp) {

    return new Date(timestamp)
        .toLocaleString(
            "en-PH",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );

}


function getProductById(id) {

    return products.find(product => {
        return Number(product.id) === Number(id);
    });

}


/* FILTER */

function filterOrders() {

    const start =
        startDate.value
            ? new Date(
                `${startDate.value}T00:00:00`
            ).getTime()
            : null;


    const end =
        endDate.value
            ? new Date(
                `${endDate.value}T23:59:59`
            ).getTime()
            : null;


    const payment =
        paymentFilter.value;

    filteredExpenses =
        expenses.filter(expense => {

            const expenseDate =
                new Date(
                    `${expense.date}T00:00:00`
                ).getTime();


            const matchesStart =
                !start ||
                expenseDate >= start;


            const matchesEnd =
                !end ||
                expenseDate <= end;


            return (
                matchesStart &&
                matchesEnd
            );

        });

    filteredOrders =
        orders.filter(order => {

            if (order.status !== "Completed") {
                return false;
            }


            const orderDate =
                Number(order.createdAt);


            const matchesStart =
                !start ||
                orderDate >= start;


            const matchesEnd =
                !end ||
                orderDate <= end;


            const matchesPayment =
                payment === "all" ||
                order.paymentMethod === payment;


            return (
                matchesStart &&
                matchesEnd &&
                matchesPayment
            );

        });


    renderAll();

}


/* SUMMARY */

function renderSummary() {

    const sales =
        filteredOrders.reduce(
            (sum, order) => {
                return sum +
                    Number(order.total || 0);
            },
            0
        );


    const discounts =
        filteredOrders.reduce(
            (sum, order) => {
                return sum +
                    Number(order.discount || 0);
            },
            0
        );


    const orderCount =
        filteredOrders.length;


    const average =
        orderCount > 0
            ? sales / orderCount
            : 0;

    const expenseTotal =
        filteredExpenses.reduce(
            (sum, expense) => {
                return sum +
                    Number(
                        expense.amount || 0
                    );
            },
            0
        );


    const gross =
        calculateGrossProfit();


    const net =
        gross - expenseTotal;


    totalSales.textContent =
        formatCurrency(sales);


    totalOrders.textContent =
        orderCount;


    totalDiscount.textContent =
        formatCurrency(discounts);


    averageOrder.textContent =
        formatCurrency(average);


    grossProfit.textContent =
        formatCurrency(gross);

    totalExpenses.textContent =
        formatCurrency(
            expenseTotal
        );

    netProfit.textContent =
        formatCurrency(
            net
        );

}


/* GROSS PROFIT */

function calculateGrossProfit() {

    let profit = 0;


    filteredOrders.forEach(order => {

        if (!Array.isArray(order.items)) {
            return;
        }


        order.items.forEach(item => {

            const product =
                getProductById(item.productId);


            const cost =
                product
                    ? Number(product.cost || 0)
                    : 0;


            const sellingPrice =
                Number(item.price || 0);


            const quantity =
                Number(item.quantity || 0);


            profit +=
                (sellingPrice - cost) *
                quantity;

        });

    });


    return profit;

}


/* PAYMENT BREAKDOWN */

function renderPaymentBreakdown() {

    const payments = {};


    filteredOrders.forEach(order => {

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


    const methods =
        Object.entries(payments);


    if (methods.length === 0) {

        paymentBreakdown.innerHTML = `
      <p class="empty-row">
        No payment data.
      </p>
    `;

        return;

    }


    methods.forEach(
        ([method, data]) => {

            const item =
                document.createElement("div");


            item.className =
                "breakdown-item";


            item.innerHTML = `

        <div class="breakdown-label">

          <strong>
            ${method}
          </strong>

          <span>
            ${data.count}
            ${data.count === 1
                    ? "order"
                    : "orders"
                }
          </span>

        </div>


        <div class="breakdown-value">
          ${formatCurrency(data.total)}
        </div>

      `;


            paymentBreakdown.appendChild(item);

        }
    );

}


/* TOP PRODUCTS */

function renderTopProducts() {

    const productSales = {};


    filteredOrders.forEach(order => {

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
            .sort(
                (a, b) =>
                    b.quantity - a.quantity
            )
            .slice(0, 10);


    topProductsBody.innerHTML = "";


    if (ranked.length === 0) {

        topProductsBody.innerHTML = `
      <tr>
        <td
          colspan="3"
          class="empty-row"
        >
          No product sales data.
        </td>
      </tr>
    `;

        return;

    }


    ranked.forEach(item => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

      <td class="product-name">
        ${item.name}
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


/* CATEGORY SALES */

function renderCategorySales() {

    const categories = {};


    filteredOrders.forEach(order => {

        if (!Array.isArray(order.items)) {
            return;
        }


        order.items.forEach(item => {

            const product =
                getProductById(
                    item.productId
                );


            const category =
                product?.category ||
                "Uncategorized";


            if (!categories[category]) {

                categories[category] = {
                    quantity: 0,
                    sales: 0
                };

            }


            categories[category].quantity +=
                Number(item.quantity || 0);


            categories[category].sales +=
                Number(item.total || 0);

        });

    });


    const categoryList =
        Object.entries(categories)
            .sort(
                (a, b) =>
                    b[1].sales -
                    a[1].sales
            );


    categorySalesBody.innerHTML = "";


    if (categoryList.length === 0) {

        categorySalesBody.innerHTML = `
      <tr>
        <td
          colspan="3"
          class="empty-row"
        >
          No category sales data.
        </td>
      </tr>
    `;

        return;

    }


    categoryList.forEach(
        ([category, data]) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

        <td>
          <strong>
            ${category}
          </strong>
        </td>

        <td>
          ${data.quantity}
        </td>

        <td>
          ${formatCurrency(data.sales)}
        </td>

      `;


            categorySalesBody
                .appendChild(row);

        }
    );

}

function renderExpensesReport() {

    expensesReportBody.innerHTML = "";


    const sortedExpenses =
        [...filteredExpenses]
            .sort(
                (a, b) =>
                    new Date(b.date) -
                    new Date(a.date)
            );


    if (sortedExpenses.length === 0) {

        expensesReportBody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="empty-row"
                >
                    No expenses found.
                </td>
            </tr>
        `;

        return;
    }


    sortedExpenses.forEach(expense => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${new Date(
            `${expense.date}T00:00:00`
        ).toLocaleDateString(
            "en-PH",
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        )}
            </td>

            <td>
                ${expense.category}
            </td>

            <td>
                ${expense.description}
            </td>

            <td>
                <strong>
                    ${formatCurrency(
            expense.amount
        )}
                </strong>
            </td>

            <td>
                ${expense.paymentMethod}
            </td>

            <td>
                ${expense.reference || "—"}
            </td>

        `;


        expensesReportBody.appendChild(
            row
        );

    });
}

/* TRANSACTIONS */

function renderTransactions() {

    transactionsBody.innerHTML = "";


    const sortedOrders =
        [...filteredOrders]
            .sort(
                (a, b) =>
                    Number(b.createdAt) -
                    Number(a.createdAt)
            );


    if (sortedOrders.length === 0) {

        transactionsBody.innerHTML = `
      <tr>
        <td
          colspan="7"
          class="empty-row"
        >
          No transactions found.
        </td>
      </tr>
    `;

        return;

    }


    sortedOrders.forEach(order => {

        const totalItems =
            Array.isArray(order.items)
                ? order.items.reduce(
                    (sum, item) => {
                        return sum +
                            Number(
                                item.quantity || 0
                            );
                    },
                    0
                )
                : 0;


        const row =
            document.createElement("tr");


        row.innerHTML = `

      <td class="order-number">
        ${order.orderNumber}
      </td>

      <td>
        ${formatDate(order.createdAt)}
      </td>

      <td>
        ${totalItems}
      </td>

      <td>
        ${formatCurrency(
            order.subtotal
        )}
      </td>

      <td>
        ${formatCurrency(
            order.discount
        )}
      </td>

      <td>
        <strong>
          ${formatCurrency(
            order.total
        )}
        </strong>
      </td>

      <td>
        ${order.paymentMethod}
      </td>

    `;


        transactionsBody
            .appendChild(row);

    });

}


/* EXPORT CSV */

function exportCsv() {

    if (filteredOrders.length === 0) {

        alert(
            "No transactions available to export."
        );

        return;

    }


    const rows = [

        [
            "Order Number",
            "Date",
            "Items",
            "Subtotal",
            "Discount",
            "Total",
            "Payment Method"
        ]

    ];


    filteredOrders.forEach(order => {

        const itemCount =
            Array.isArray(order.items)
                ? order.items.reduce(
                    (sum, item) =>
                        sum +
                        Number(
                            item.quantity || 0
                        ),
                    0
                )
                : 0;


        rows.push([
            order.orderNumber,
            formatDate(order.createdAt),
            itemCount,
            Number(order.subtotal || 0),
            Number(order.discount || 0),
            Number(order.total || 0),
            order.paymentMethod
        ]);

    });

    rows.push([]);

    rows.push([
        "EXPENSES"
    ]);

    rows.push([
        "Date",
        "Category",
        "Description",
        "Amount",
        "Payment Method",
        "Reference"
    ]);


    filteredExpenses.forEach(expense => {

        rows.push([
            expense.date,
            expense.category,
            expense.description,
            Number(expense.amount || 0),
            expense.paymentMethod,
            expense.reference || ""
        ]);

    });

    const csvContent =
        rows
            .map(row =>
                row
                    .map(value => {

                        const safe =
                            String(value)
                                .replace(/"/g, '""');

                        return `"${safe}"`;

                    })
                    .join(",")
            )
            .join("\n");


    const blob =
        new Blob(
            [csvContent],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href =
        url;


    link.download =
        `intellicore-sales-report-${Date.now()}.csv`;


    document.body
        .appendChild(link);


    link.click();


    document.body
        .removeChild(link);


    URL.revokeObjectURL(url);

}


/* RESET */

function resetFilters() {

    startDate.value = "";
    endDate.value = "";
    paymentFilter.value = "all";

    filteredOrders =
        orders.filter(order => {
            return order.status === "Completed";
        });

    filteredExpenses =
        [...expenses];

    renderAll();

}


/* REFRESH DATA */

function refreshData() {

    orders =
        JSON.parse(
            localStorage.getItem(
                ORDER_STORAGE_KEY
            )
        ) || [];


    products =
        JSON.parse(
            localStorage.getItem(
                PRODUCT_STORAGE_KEY
            )
        ) || [];


    expenses =
        JSON.parse(
            localStorage.getItem(
                EXPENSE_STORAGE_KEY
            )
        ) || [];
}


/* RENDER ALL */

function renderAll() {

    renderSummary();

    renderPaymentBreakdown();

    renderTopProducts();

    renderCategorySales();

    renderExpensesReport();

    renderTransactions();

}


/* EVENTS */

applyFilterBtn.addEventListener(
    "click",
    filterOrders
);


resetFilterBtn.addEventListener(
    "click",
    resetFilters
);


printReportBtn.addEventListener(
    "click",
    () => {
        window.print();
    }
);


exportCsvBtn.addEventListener(
    "click",
    exportCsv
);


/* INITIALIZE */

function initializeReports() {

    refreshData();


    filteredOrders =
        orders.filter(order => {
            return order.status === "Completed";
        });

    filteredExpenses =
        [...expenses];

    renderAll();

}


initializeReports();