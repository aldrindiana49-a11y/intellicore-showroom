const SETTINGS_KEY =
    "intellicore_pos_settings";


const defaultSettings = {

    storeName: "IntelliCore Grocery",

    storeLogo: "",

    branchName: "Main Branch",

    storePhone: "",

    storeEmail: "",

    storeAddress: "",


    terminalName: "POS-01",

    currency: "PHP",

    defaultPayment: "Cash",

    lowStockWarning: 10,


    barcodeAutoAdd: true,

    confirmCheckout: true,

    allowDiscount: true,

    maxDiscountPercent: 5,
    minDiscountPurchase: 100,

    manualDiscountEnabled: true,

    maxManualDiscountPercent: 10,

    manualDiscountRequireApproval: true,

    manualDiscountApproverRoles: [
        "Owner",
        "Manager",
        "Head Cashier"
    ],

    preventNegativeStock: true,

    enableLowStockAlerts: true,

    expiryTracking: true,

    vatEnabled: false,

    vatPercent: 12,

    vatMode: "inclusive",

    receiptProductNameMaxLength: 26,

    receiptPaperSize: "80mm",

    receiptShowSku: true,

    receiptShowBarcode: true,

    receiptBodyTemplate:
        "{{productName}}\nSKU: {{sku}}\nBarcode: {{barcode}}\n{{qty}} x {{price}} = {{lineTotal}}",

    receiptHeader:
        "Thank you for shopping with us!",

    receiptFooter:
        "Please come again.",

    autoPrintReceipt: false,


    customerDisplayEnabled: false,

    customerDisplayImages: true,

    customerDisplayPromos: true,

    posDisplayMode: "image",

    posCarouselEnabled: false,

    carouselInterval: 5000,

    carouselImage1: "",
    carouselImage2: "",
    carouselImage3: "",

    loyaltySpendAmount: 200,

    loyaltyPointsEarned: 1,

    systemMode: "offline"

};


let settings =
    loadSettings();

let currentStoreLogo =
    settings.storeLogo || "";

let currentCarouselImage1 =
    settings.carouselImage1 || "";

let currentCarouselImage2 =
    settings.carouselImage2 || "";

let currentCarouselImage3 =
    settings.carouselImage3 || "";

function loadSettings() {

    const saved =
        localStorage.getItem(
            SETTINGS_KEY
        );


    if (!saved) {

        return {
            ...defaultSettings
        };

    }


    try {

        return {
            ...defaultSettings,
            ...JSON.parse(saved)
        };

    }

    catch (error) {

        console.error(
            "Unable to load settings:",
            error
        );


        return {
            ...defaultSettings
        };

    }

}

const storeLogoInput =
    document.getElementById("storeLogo");

storeLogoInput.addEventListener("change", event => {

    const file = event.target.files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = () => {

        const img = new Image();

        img.onload = () => {

            const canvas =
                document.createElement("canvas");

            const size = 128;

            canvas.width = size;
            canvas.height = size;

            const ctx =
                canvas.getContext("2d");

            ctx.clearRect(
                0,
                0,
                size,
                size
            );

            ctx.drawImage(
                img,
                0,
                0,
                size,
                size
            );

            currentStoreLogo =
                canvas.toDataURL(
                    "image/webp",
                    0.75
                );
        };

        img.src = reader.result;
    };

    reader.readAsDataURL(file);
});

storeLogoInput.addEventListener(
    "change",
    event => {

        const file =
            event.target.files[0];

        if (!file) {
            return;
        }

        const reader =
            new FileReader();

        reader.onload = () => {
            currentStoreLogo =
                reader.result;
        };

        reader.readAsDataURL(file);
    }
);

function handleCarouselImageUpload(
    inputId,
    imageNumber
) {
    const input =
        document.getElementById(inputId);

    if (!input) {
        return;
    }

    input.addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];

            if (!file) {
                return;
            }

            const reader =
                new FileReader();

            reader.onload = () => {

                if (imageNumber === 1) {
                    currentCarouselImage1 =
                        reader.result;
                }

                if (imageNumber === 2) {
                    currentCarouselImage2 =
                        reader.result;
                }

                if (imageNumber === 3) {
                    currentCarouselImage3 =
                        reader.result;
                }
            };

            reader.readAsDataURL(file);
        }
    );
}

handleCarouselImageUpload(
    "carouselImage1",
    1
);

handleCarouselImageUpload(
    "carouselImage2",
    2
);

handleCarouselImageUpload(
    "carouselImage3",
    3
);

function saveSettings() {

    settings = {

        storeName:
            document
                .getElementById("storeName")
                .value
                .trim(),

        storeLogo:
            currentStoreLogo,

        branchName:
            document
                .getElementById("branchName")
                .value
                .trim(),

        storePhone:
            document
                .getElementById("storePhone")
                .value
                .trim(),

        storeEmail:
            document
                .getElementById("storeEmail")
                .value
                .trim(),

        storeAddress:
            document
                .getElementById("storeAddress")
                .value
                .trim(),


        terminalName:
            document
                .getElementById("terminalName")
                .value
                .trim(),

        currency:
            document
                .getElementById("currency")
                .value,

        defaultPayment:
            document
                .getElementById("defaultPayment")
                .value,

        lowStockWarning:
            Number(
                document
                    .getElementById("lowStockWarning")
                    .value
            ),


        barcodeAutoAdd:
            document
                .getElementById("barcodeAutoAdd")
                .checked,

        confirmCheckout:
            document
                .getElementById("confirmCheckout")
                .checked,

        allowDiscount:
            document
                .getElementById("allowDiscount")
                .checked,

        maxDiscountPercent:
            Number(
                document
                    .getElementById("maxDiscountPercent")
                    .value
            ) || 0,

        minDiscountPurchase:
            Number(
                document
                    .getElementById("minDiscountPurchase")
                    .value
            ) || 0,

        manualDiscountEnabled:
            document
                .getElementById("manualDiscountEnabled")
                .checked,

        maxManualDiscountPercent:
            Number(
                document
                    .getElementById("maxManualDiscountPercent")
                    .value
            ) || 0,

        manualDiscountRequireApproval:
            document
                .getElementById(
                    "manualDiscountRequireApproval"
                )
                .checked,

        manualDiscountApproverRoles: [
            "Owner",

            document
                .getElementById("manualApproverManager")
                .checked
                ? "Manager"
                : null,

            document
                .getElementById("manualApproverHeadCashier")
                .checked
                ? "Head Cashier"
                : null
        ].filter(Boolean),

        preventNegativeStock:
            document
                .getElementById("preventNegativeStock")
                .checked,

        enableLowStockAlerts:
            document
                .getElementById("enableLowStockAlerts")
                .checked,

        expiryTracking:
            document
                .getElementById("expiryTracking")
                .checked,

        vatEnabled:
            document
                .getElementById("vatEnabled")
                .checked,

        vatPercent:
            Number(
                document
                    .getElementById("vatPercent")
                    .value
            ) || 0,

        vatMode:
            document
                .getElementById("vatMode")
                .value,

        receiptProductNameMaxLength:
            Number(
                document
                    .getElementById(
                        "receiptProductNameMaxLength"
                    )
                    .value
            ) || 26,

        receiptPaperSize:
            document
                .getElementById("receiptPaperSize")
                .value,

        receiptShowSku:
            document
                .getElementById("receiptShowSku")
                .checked,

        receiptShowBarcode:
            document
                .getElementById("receiptShowBarcode")
                .checked,


        receiptHeader:
            document
                .getElementById("receiptHeader")
                .value
                .trim(),

        receiptFooter:
            document
                .getElementById("receiptFooter")
                .value
                .trim(),

        autoPrintReceipt:
            document
                .getElementById("autoPrintReceipt")
                .checked,


        customerDisplayEnabled:
            document
                .getElementById("customerDisplayEnabled")
                .checked,

        customerDisplayImages:
            document
                .getElementById("customerDisplayImages")
                .checked,

        customerDisplayPromos:
            document
                .getElementById("customerDisplayPromos")
                .checked,

        posDisplayMode:
            document
                .getElementById("posDisplayMode")
                .value,

        posCarouselEnabled:
            document
                .getElementById("posCarouselEnabled")
                .checked,

        carouselInterval:
            Number(
                document
                    .getElementById("carouselInterval")
                    .value
            ) || 5000,

        carouselImage1:
            currentCarouselImage1,

        carouselImage2:
            currentCarouselImage2,

        carouselImage3:
            currentCarouselImage3,

        loyaltySpendAmount:
            Number(
                document
                    .getElementById(
                        "loyaltySpendAmount"
                    )
                    .value
            ) || 200,

        loyaltyPointsEarned:
            Number(
                document
                    .getElementById(
                        "loyaltyPointsEarned"
                    )
                    .value
            ) || 1,

        systemMode:
            getSelectedSystemMode()

    };


    localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(settings)
    );

    showSaveMessage();

    window.dispatchEvent(
        new Event("intellicore-settings-updated")
    );

}


function populateSettings() {

    document.getElementById(
        "storeName"
    ).value =
        settings.storeName;


    document.getElementById(
        "branchName"
    ).value =
        settings.branchName;


    document.getElementById(
        "storePhone"
    ).value =
        settings.storePhone;


    document.getElementById(
        "storeEmail"
    ).value =
        settings.storeEmail;


    document.getElementById(
        "storeAddress"
    ).value =
        settings.storeAddress;


    document.getElementById(
        "terminalName"
    ).value =
        settings.terminalName;


    document.getElementById(
        "currency"
    ).value =
        settings.currency;


    document.getElementById(
        "defaultPayment"
    ).value =
        settings.defaultPayment;


    document.getElementById(
        "lowStockWarning"
    ).value =
        settings.lowStockWarning;


    document.getElementById(
        "barcodeAutoAdd"
    ).checked =
        settings.barcodeAutoAdd;


    document.getElementById(
        "confirmCheckout"
    ).checked =
        settings.confirmCheckout;


    document.getElementById(
        "allowDiscount"
    ).checked =
        settings.allowDiscount;

    document.getElementById(
        "maxDiscountPercent"
    ).value =
        settings.maxDiscountPercent ?? 5;

    document.getElementById(
        "minDiscountPurchase"
    ).value =
        settings.minDiscountPurchase ?? 100;

    document.getElementById(
        "manualDiscountEnabled"
    ).checked =
        settings.manualDiscountEnabled ?? true;

    document.getElementById(
        "maxManualDiscountPercent"
    ).value =
        settings.maxManualDiscountPercent ?? 10;

    document.getElementById(
        "manualDiscountRequireApproval"
    ).checked =
        settings.manualDiscountRequireApproval ?? true;

    const approverRoles =
        settings.manualDiscountApproverRoles || [
            "Owner",
            "Manager",
            "Head Cashier"
        ];

    document.getElementById(
        "manualApproverManager"
    ).checked =
        approverRoles.includes("Manager");

    document.getElementById(
        "manualApproverHeadCashier"
    ).checked =
        approverRoles.includes("Head Cashier");

    document.getElementById(
        "preventNegativeStock"
    ).checked =
        settings.preventNegativeStock;


    document.getElementById(
        "enableLowStockAlerts"
    ).checked =
        settings.enableLowStockAlerts;


    document.getElementById(
        "expiryTracking"
    ).checked =
        settings.expiryTracking;

    document.getElementById(
        "vatEnabled"
    ).checked =
        settings.vatEnabled ?? false;

    document.getElementById(
        "vatPercent"
    ).value =
        settings.vatPercent ?? 12;

    document.getElementById(
        "vatMode"
    ).value =
        settings.vatMode || "inclusive";

    document.getElementById(
        "receiptProductNameMaxLength"
    ).value =
        settings.receiptProductNameMaxLength ?? 26;

    document.getElementById(
        "receiptPaperSize"
    ).value =
        settings.receiptPaperSize || "80mm";

    document.getElementById(
        "receiptShowSku"
    ).checked =
        settings.receiptShowSku ?? true;

    document.getElementById(
        "receiptShowBarcode"
    ).checked =
        settings.receiptShowBarcode ?? true;


    document.getElementById(
        "receiptHeader"
    ).value =
        settings.receiptHeader;


    document.getElementById(
        "receiptFooter"
    ).value =
        settings.receiptFooter;


    document.getElementById(
        "autoPrintReceipt"
    ).checked =
        settings.autoPrintReceipt;


    document.getElementById(
        "customerDisplayEnabled"
    ).checked =
        settings.customerDisplayEnabled;


    document.getElementById(
        "customerDisplayImages"
    ).checked =
        settings.customerDisplayImages;


    document.getElementById(
        "customerDisplayPromos"
    ).checked =
        settings.customerDisplayPromos;

    document.getElementById(
        "posDisplayMode"
    ).value =
        settings.posDisplayMode || "image";

    document.getElementById(
        "posCarouselEnabled"
    ).checked =
        settings.posCarouselEnabled || false;

    document.getElementById(
        "carouselInterval"
    ).value =
        String(settings.carouselInterval || 5000);

    const carouselPreview1 =
        document.getElementById("carouselPreview1");

    if (carouselPreview1) {

        if (settings.carouselImage1) {
            carouselPreview1.src =
                settings.carouselImage1;

            carouselPreview1.style.display =
                "block";
        } else {
            carouselPreview1.style.display =
                "none";
        }
    }

    document.getElementById(
        "loyaltySpendAmount"
    ).value =
        settings.loyaltySpendAmount ?? 200;


    document.getElementById(
        "loyaltyPointsEarned"
    ).value =
        settings.loyaltyPointsEarned ?? 1;


    const modeInput =
        document.querySelector(
            `input[name="systemMode"][value="${settings.systemMode}"]`
        );


    if (modeInput) {
        modeInput.checked = true;
    }


    updateHybridNotice();

}


function getSelectedSystemMode() {

    const selected =
        document.querySelector(
            'input[name="systemMode"]:checked'
        );


    return selected
        ? selected.value
        : "offline";

}


function updateHybridNotice() {

    const mode =
        getSelectedSystemMode();


    const notice =
        document.getElementById(
            "hybridNotice"
        );


    if (mode === "hybrid") {

        notice.classList.remove(
            "hidden"
        );

    }

    else {

        notice.classList.add(
            "hidden"
        );

    }

}


function showSaveMessage() {

    const message =
        document.getElementById(
            "saveMessage"
        );


    message.classList.remove(
        "hidden"
    );


    setTimeout(() => {

        message.classList.add(
            "hidden"
        );

    }, 2500);

}


function resetSettings() {

    const confirmed =
        confirm(
            "Reset all POS settings to default values?"
        );


    if (!confirmed) {
        return;
    }


    settings = {
        ...defaultSettings
    };


    localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(settings)
    );


    populateSettings();


    alert(
        "Settings have been reset."
    );

}


document
    .getElementById("saveAllBtn")
    .addEventListener(
        "click",
        saveSettings
    );


document
    .getElementById("resetSettingsBtn")
    .addEventListener(
        "click",
        resetSettings
    );


document
    .querySelectorAll(
        'input[name="systemMode"]'
    )
    .forEach(input => {

        input.addEventListener(
            "change",
            updateHybridNotice
        );

    });


document
    .getElementById("upgradeBtn")
    .addEventListener(
        "click",
        () => {

            /*
            Later papunta ito sa:
            ../../modules/upgrade/upgrade.html
            */

            alert(
                "Upgrade module will be available soon."
            );

        }
    );


populateSettings();

const viewReceiptSampleBtn =
    document.getElementById(
        "viewReceiptSampleBtn"
    );

const receiptSampleModal =
    document.getElementById(
        "receiptSampleModal"
    );

const closeReceiptSampleBtn =
    document.getElementById(
        "closeReceiptSampleBtn"
    );

const receiptSampleContent =
    document.getElementById(
        "receiptSampleContent"
    );

viewReceiptSampleBtn.addEventListener(
    "click",
    () => {
        receiptSampleContent.innerHTML = `
            <div style="text-align:center;font-weight:700;margin-bottom:12px;">
                ${document.getElementById("receiptHeader").value || "Thank you for shopping with us!"}
            </div>

            <div style="display:flex;justify-content:space-between;">
                <span>Order</span>
                <strong>ICS-20261016-00001</strong>
            </div>

            <div style="display:flex;justify-content:space-between;">
                <span>Date</span>
                <span>10/16/2026 10:00 PM</span>
            </div>

            <hr>

            <div style="display:flex;justify-content:space-between;font-weight:700;">
                <span>Corned Beef 150g</span>
                <span>₱42.00</span>
            </div>

            <div>
                ${document.getElementById("receiptShowSku").checked
                ? "CAN-0001"
                : ""
            }

                ${document.getElementById("receiptShowBarcode").checked
                ? " 4801982222222"
                : ""
            }
            </div>

            <div style="display:flex;justify-content:space-between;">
                <span>3 x ₱42.00</span>
                <span>₱126.00</span>
            </div>

            <hr>

            <div style="display:flex;justify-content:space-between;">
                <span>Subtotal</span>
                <span>₱126.00</span>
            </div>

            <div style="display:flex;justify-content:space-between;">
                <span>Discount</span>
                <span>-₱8.82</span>
            </div>

            <div style="display:flex;justify-content:space-between;font-weight:700;">
                <span>TOTAL</span>
                <span>₱117.18</span>
            </div>

            <hr>

            <div style="display:flex;justify-content:space-between;">
                <span>Payment</span>
                <span>Cash</span>
            </div>

            <div style="display:flex;justify-content:space-between;">
                <span>Cash</span>
                <span>₱500.00</span>
            </div>

            <div style="display:flex;justify-content:space-between;">
                <span>Change</span>
                <span>₱382.82</span>
            </div>

            <div style="text-align:center;margin-top:14px;">
                ${document.getElementById("receiptFooter").value || "Please come again."}
            </div>
        `;

        receiptSampleModal.classList.remove(
            "hidden"
        );
    }
);

closeReceiptSampleBtn.addEventListener(
    "click",
    () => {
        receiptSampleModal.classList.add(
            "hidden"
        );
    }
);