async function loadSidebar() {
    const container = document.getElementById("sidebar-container");

    if (!container) {
        return;
    }

    const response = await fetch("../../components/sidebar.html");

    const html = await response.text();

    container.innerHTML = html;

    applySidebarPermissions();

    setActiveSidebarLink();

}

function setActiveSidebarLink() {
    const currentPage =
        window.location.pathname.split("/").pop();

    const links =
        document.querySelectorAll(".nav-link");

    links.forEach(link => {
        const linkPage =
            link.getAttribute("href").split("/").pop();

        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });
}

function applySidebarPermissions() {

    const SESSION_STORAGE_KEY =
        "intellicore_current_user";

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                SESSION_STORAGE_KEY
            )
        );

    if (!currentUser) {
        return;
    }

    if (currentUser.role === "Owner") {
        return;
    }

    if (currentUser.role === "Cashier") {

        document.body.classList.add(
            "sidebar-collapsed"
        );
    }

    const permissions =
        currentUser.permissions || {};

    const permissionLinks =
        document.querySelectorAll(
            "[data-permission]"
        );

    permissionLinks.forEach(link => {

        const permission =
            link.dataset.permission;

        if (!permissions[permission]) {
            link.style.display = "none";
        }
    });
}

loadSidebar();