async function loadHeader() {

    const container =
        document.getElementById("header-container");

    if (!container) {
        return;
    }


    try {

        const response =
            await fetch("../../components/header.html");


        if (!response.ok) {
            throw new Error(
                "Unable to load header."
            );
        }


        const html =
            await response.text();


        container.innerHTML =
            html;

        applyHeaderUserSession();

        applyHeaderSettings();

        setHeaderPageTitle();

        setupSidebarToggle();


    }

    catch (error) {

        console.error(
            "Header loading error:",
            error
        );

    }

}

function applyHeaderSettings() {

    const SETTINGS_KEY =
        "intellicore_pos_settings";

    const savedSettings =
        JSON.parse(
            localStorage.getItem(SETTINGS_KEY)
        ) || {};

    const headerStoreName =
        document.getElementById(
            "headerStoreName"
        );

    if (headerStoreName) {
        headerStoreName.textContent =
            savedSettings.storeName ||
            "IntelliCore Grocery";
    }

    const headerStoreLogo =
        document.getElementById(
            "headerStoreLogo"
        );

    if (headerStoreLogo) {
        headerStoreLogo.src =
            savedSettings.storeLogo ||
            "../../assets/images/store-logo.png";
    }
}

function setHeaderPageTitle() {

    const titleElement =
        document.getElementById(
            "headerPageTitle"
        );


    if (!titleElement) {
        return;
    }


    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .replace(".html", "");


    const pageTitles = {

        dashboard: "Dashboard",

        pos: "POS Terminal",

        products: "Products",

        categories: "Categories",

        inventory: "Inventory",

        orders: "Orders",

        customers: "Customers",

        suppliers: "Suppliers",

        reports: "Reports",

        settings: "Settings"

    };


    titleElement.textContent =
        pageTitles[currentPage] ||
        "IntelliCore POS";

}


function setupSidebarToggle() {

    const button =
        document.getElementById(
            "sidebarToggleBtn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "sidebar-collapsed"
            );

        }
    );

}

window.addEventListener(
    "intellicore-settings-updated",
    () => {
        applyHeaderSettings();
    }
);

function applyHeaderUserSession() {

    const HEADER_SESSION_KEY =
        "intellicore_current_user";

    const headerUserName =
        document.getElementById(
            "headerUserName"
        );

    const headerUserRole =
        document.getElementById(
            "headerUserRole"
        );

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );

    const loggedInUser =
        JSON.parse(
            localStorage.getItem(
                HEADER_SESSION_KEY
            )
        );

    if (loggedInUser) {

        if (headerUserName) {
            headerUserName.textContent =
                loggedInUser.fullName || "User";
        }

        if (headerUserRole) {
            headerUserRole.textContent =
                loggedInUser.role || "Role";
        }

        if (
            loggedInUser.role === "Cashier" &&
            window.location.pathname.includes(
                "/modules/pos/"
            )
        ) {

            const sidebarToggleBtn =
                document.getElementById(
                    "sidebarToggleBtn"
                );

            if (sidebarToggleBtn) {
                sidebarToggleBtn.style.display =
                    "none";
            }
        }
    }

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            () => {

                localStorage.removeItem(
                    HEADER_SESSION_KEY
                );

                window.location.href =
                    "../../modules/login/login.html";
            }
        );
    }
}

loadHeader();

