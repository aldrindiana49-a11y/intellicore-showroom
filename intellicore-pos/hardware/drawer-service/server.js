const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "IntelliCore Drawer Service is running."
    });
});

app.post("/open-drawer", async (req, res) => {
    try {
        console.log("Cash drawer open request received.");

        // Placeholder muna.
        // Actual ESC/POS printer command ilalagay natin next.

        res.json({
            success: true,
            message: "Drawer open command received."
        });
    } catch (error) {
        console.error("Drawer error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to open cash drawer."
        });
    }
});

const PORT = 3001;

app.listen(PORT, () => {
    console.log(
        `IntelliCore Drawer Service running at http://localhost:${PORT}`
    );
});