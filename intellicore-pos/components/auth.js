const SESSION_STORAGE_KEY =
    "intellicore_current_user";

const currentUser =
    JSON.parse(
        localStorage.getItem(
            SESSION_STORAGE_KEY
        )
    );

if (!currentUser) {

    window.location.href =
        "../../modules/login/login.html";
}