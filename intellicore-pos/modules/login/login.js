const USER_STORAGE_KEY =
    "intellicore_users";

const SESSION_STORAGE_KEY =
    "intellicore_current_user";


const loginForm =
    document.getElementById("loginForm");

const loginUsername =
    document.getElementById("loginUsername");

const loginPin =
    document.getElementById("loginPin");

const loginMessage =
    document.getElementById("loginMessage");


loginForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        let users =
            JSON.parse(
                localStorage.getItem(
                    USER_STORAGE_KEY
                )
            ) || [];

        if (users.length === 0) {

            users.push({
                id: Date.now(),
                fullName: "System Owner",
                username: "owner",
                role: "Owner",
                status: "Active",
                pin: "1234",
                permissions: {},
                updatedAt: Date.now()
            });

            localStorage.setItem(
                USER_STORAGE_KEY,
                JSON.stringify(users)
            );
        }

        const username =
            loginUsername.value
                .trim()
                .toLowerCase();

        const pin =
            loginPin.value.trim();

        const user =
            users.find(item => {

                return (
                    String(item.username || "")
                        .toLowerCase() ===
                    username &&

                    String(item.pin || "") ===
                    pin
                );
            });

        if (!user) {

            loginMessage.textContent =
                "Invalid username or PIN.";

            return;
        }

        if (user.status !== "Active") {

            loginMessage.textContent =
                "This user account is inactive.";

            return;
        }

        const sessionUser = {
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            role: user.role,
            permissions: user.permissions || {},
            loginAt: Date.now()
        };

        localStorage.setItem(
            SESSION_STORAGE_KEY,
            JSON.stringify(sessionUser)
        );

        if (user.role === "Cashier") {

            window.location.href =
                "../pos/pos.html";

        } else {

            window.location.href =
                "../dashboard/dashboard.html";
        }
    }
);