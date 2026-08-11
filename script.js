// ============================================================
// DAILYWHISK JAVASCRIPT
//
// FEATURES:
// MENU
// SOLD OUT
// DELIVERY AREAS
// DELIVERY FEES
// CART
// CHECKOUT
// PAYMENT
// PAYMENT PROOF
// GOOGLE SHEETS
// SALES TRACKER
// ============================================================



// ============================================================
// GOOGLE APPS SCRIPT URL
// ============================================================

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxEG7zQD_rgJ_qnHuAeCSAu9gTE_BzhTc47TshzpiO3Zx-oyeLMdc0ssfzD7GswoX_g/exec";



// ============================================================
// DATA
// ============================================================

let websiteMenu = [];

let deliveryAreas = [];

let cart = [];

let deliveryFee = 0;

let selectedDeliveryArea = "";



// ============================================================
// ELEMENTS
// ============================================================

const cartItems =
    document.getElementById(
        "cart-items"
    );


const cartTotal =
    document.getElementById(
        "cart-total"
    );


const checkoutTotal =
    document.getElementById(
        "checkout-total"
    );


const checkoutSubtotal =
    document.getElementById(
        "checkout-subtotal"
    );


const checkoutDeliveryFee =
    document.getElementById(
        "checkout-delivery-fee"
    );


const cartButton =
    document.getElementById(
        "cart-button"
    );


const closeCartButton =
    document.getElementById(
        "close-cart"
    );


const checkoutButton =
    document.getElementById(
        "checkout-button"
    );


const closeCheckoutButton =
    document.getElementById(
        "close-checkout"
    );


const cartPanel =
    document.querySelector(
        ".cart"
    );


const checkoutPanel =
    document.querySelector(
        ".checkout"
    );


const cartCount =
    document.getElementById(
        "cart-count"
    );


const deliverySection =
    document.getElementById(
        "delivery-section"
    );


const deliveryAreaSelect =
    document.getElementById(
        "delivery-area"
    );


const deliveryFeeMessage =
    document.getElementById(
        "delivery-fee-message"
    );


const addressField =
    document.getElementById(
        "customer-address"
    );


const addressLabel =
    document.getElementById(
        "address-label"
    );



// ============================================================
// LOAD WEBSITE MENU
// ============================================================

async function loadWebsiteMenu() {

    try {

        const response =
            await fetch(
                GOOGLE_SCRIPT_URL +
                "?action=getMenu"
            );


        const menu =
            await response.json();


        console.log(
            "Website Menu:",
            menu
        );


        if (
            !Array.isArray(menu)
        ) {

            console.error(
                "Invalid menu data:",
                menu
            );

            return;

        }


        websiteMenu =
            menu;


        updateWebsiteMenu();


    } catch (error) {

        console.error(
            "Could not load Website Menu:",
            error
        );

    }

}



// ============================================================
// LOAD DELIVERY AREAS
// ============================================================

async function loadDeliveryAreas() {

    try {

        const response =
            await fetch(
                GOOGLE_SCRIPT_URL +
                "?action=getDeliveryAreas"
            );


        const areas =
            await response.json();


        console.log(
            "Delivery Areas:",
            areas
        );


        if (
            !Array.isArray(areas)
        ) {

            console.error(
                "Invalid delivery area data:",
                areas
            );

            return;

        }


        deliveryAreas =
            areas;


        updateDeliveryDropdown();


    } catch (error) {

        console.error(
            "Could not load Delivery Areas:",
            error
        );

    }

}



// ============================================================
// UPDATE DELIVERY DROPDOWN
// ============================================================

function updateDeliveryDropdown() {

    if (
        !deliveryAreaSelect
    ) {

        return;

    }


    deliveryAreaSelect.innerHTML = `

        <option value="">
            Select your area
        </option>

    `;


    deliveryAreas.forEach(
        function(area) {

            const available =
                String(
                    area.available
                )
                .trim()
                .toLowerCase();


            if (
                available !== "yes"
            ) {

                return;

            }


            const option =
                document.createElement(
                    "option"
                );


            option.value =
                area.area;


            option.textContent =
                area.area +
                " — RM" +
                Number(
                    area.fee
                ).toFixed(2);


            option.dataset.fee =
                Number(
                    area.fee
                );


            deliveryAreaSelect
                .appendChild(
                    option
                );

        }
    );

}



// ============================================================
// DELIVERY AREA CHANGE
// ============================================================

if (
    deliveryAreaSelect
) {

    deliveryAreaSelect
        .addEventListener(
            "change",
            function() {

                const selectedOption =
                    this.options[
                        this.selectedIndex
                    ];


                if (
                    !this.value ||
                    !selectedOption
                ) {

                    selectedDeliveryArea =
                        "";

                    deliveryFee =
                        0;


                    if (
                        deliveryFeeMessage
                    ) {

                        deliveryFeeMessage
                            .textContent =
                            "Please select your delivery area.";

                    }


                    updateCheckoutTotals();

                    return;

                }


                selectedDeliveryArea =
                    this.value;


                deliveryFee =
                    Number(
                        selectedOption
                            .dataset
                            .fee
                    ) || 0;


                if (
                    deliveryFeeMessage
                ) {

                    deliveryFeeMessage
                        .textContent =
                        "Delivery fee: RM" +
                        deliveryFee.toFixed(2);

                }


                updateCheckoutTotals();

            }
        );

}



// ============================================================
// UPDATE WEBSITE MENU
// ============================================================

function updateWebsiteMenu() {

    const drinkCards =
        document.querySelectorAll(
            ".drink-card"
        );


    drinkCards.forEach(
        function(card) {

            const nameElement =
                card.querySelector(
                    "h3"
                );


            if (
                !nameElement
            ) {

                return;

            }


            const drinkName =
                nameElement
                    .textContent
                    .trim();


            const menuItem =
                websiteMenu.find(
                    function(item) {

                        return (
                            String(
                                item.drink
                            )
                            .trim()
                            .toLowerCase() ===

                            drinkName
                                .toLowerCase()
                        );

                    }
                );


            if (
                !menuItem
            ) {

                return;

            }



            // ------------------------------------------------
            // PRICE
            // ------------------------------------------------

            const priceElement =
                card.querySelector(
                    ".price"
                );


            if (
                priceElement
            ) {

                priceElement.textContent =
                    "RM" +
                    Number(
                        menuItem.price
                    ).toFixed(2);

            }



            // ------------------------------------------------
            // SOLD OUT
            // ------------------------------------------------

            const isSoldOut =
                String(
                    menuItem.available
                )
                .trim()
                .toLowerCase() ===
                "sold out";


            if (
                isSoldOut
            ) {

                card.classList.add(
                    "sold-out"
                );

            } else {

                card.classList.remove(
                    "sold-out"
                );

            }



            // ------------------------------------------------
            // BUTTON
            // ------------------------------------------------

            const button =
                card.querySelector(
                    "button"
                );


            if (
                !button
            ) {

                return;

            }


            if (
                isSoldOut
            ) {

                button.disabled =
                    true;


                button.textContent =
                    "SOLD OUT";


                button.classList.add(
                    "sold-out-button"
                );


            } else {

                button.disabled =
                    false;


                button.textContent =
                    "ADD TO CART";


                button.classList.remove(
                    "sold-out-button"
                );

            }

        }
    );

}



// ============================================================
// CART OPEN
// ============================================================

if (
    cartButton
) {

    cartButton.addEventListener(
        "click",
        function() {

            cartPanel.classList.add(
                "cart-open"
            );

        }
    );

}



// ============================================================
// CART CLOSE
// ============================================================

if (
    closeCartButton
) {

    closeCartButton.addEventListener(
        "click",
        function() {

            cartPanel.classList.remove(
                "cart-open"
            );

        }
    );

}



// ============================================================
// ADD TO CART
// ============================================================

function addToCart(
    drinkName,
    drinkPrice
) {

    const menuItem =
        websiteMenu.find(
            function(item) {

                return (
                    String(
                        item.drink
                    )
                    .trim()
                    .toLowerCase() ===

                    drinkName
                        .trim()
                        .toLowerCase()
                );

            }
        );


    if (
        menuItem &&
        String(
            menuItem.available
        )
        .trim()
        .toLowerCase() ===
        "sold out"
    ) {

        alert(
            drinkName +
            " is currently sold out."
        );

        return;

    }



    const existingItem =
        cart.find(
            function(item) {

                return (
                    item.name ===
                    drinkName
                );

            }
        );


    if (
        existingItem
    ) {

        existingItem.quantity++;


    } else {

        cart.push({

            name:
                drinkName,

            price:
                Number(
                    drinkPrice
                ),

            quantity:
                1

        });

    }


    updateCart();

}



// ============================================================
// CONNECT DRINK BUTTONS
// ============================================================

function connectDrinkButtons() {

    const buttons =
        document.querySelectorAll(
            ".drink-card button"
        );


    buttons.forEach(
        function(button) {

            if (
                button.dataset
                    .dailywhiskConnected ===
                "true"
            ) {

                return;

            }


            button.dataset
                .dailywhiskConnected =
                "true";


            button.addEventListener(
                "click",
                function() {

                    if (
                        button.disabled
                    ) {

                        return;

                    }


                    const card =
                        button.closest(
                            ".drink-card"
                        );


                    if (
                        !card
                    ) {

                        return;

                    }


                    const nameElement =
                        card.querySelector(
                            "h3"
                        );


                    const priceElement =
                        card.querySelector(
                            ".price"
                        );


                    if (
                        !nameElement ||
                        !priceElement
                    ) {

                        return;

                    }


                    const drinkName =
                        nameElement
                            .textContent
                            .trim();


                    const drinkPrice =
                        parseFloat(
                            priceElement
                                .textContent
                                .replace(
                                    "RM",
                                    ""
                                )
                                .trim()
                        );


                    addToCart(
                        drinkName,
                        drinkPrice
                    );

                }
            );

        }
    );

}



// ============================================================
// UPDATE CART
// ============================================================

function updateCart() {

    if (
        !cartItems
    ) {

        return;

    }


    cartItems.innerHTML =
        "";


    let total =
        0;


    let totalQuantity =
        0;


    cart.forEach(
        function(item, index) {

            const itemTotal =
                item.price *
                item.quantity;


            const itemElement =
                document.createElement(
                    "div"
                );


            itemElement.className =
                "cart-item";


            itemElement.innerHTML = `

                <strong>
                    ${item.name}
                </strong>

                <div class="quantity-controls">

                    <button
                        type="button"
                        onclick="decreaseQuantity(${index})"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        type="button"
                        onclick="increaseQuantity(${index})"
                    >
                        +
                    </button>

                </div>

                <p>
                    RM${itemTotal.toFixed(2)}
                </p>

            `;


            cartItems.appendChild(
                itemElement
            );


            total +=
                itemTotal;


            totalQuantity +=
                item.quantity;

        }
    );


    if (
        cart.length === 0
    ) {

        cartItems.innerHTML =
            "<p>Your cart is empty.</p>";

    }


    if (
        cartTotal
    ) {

        cartTotal.textContent =
            total.toFixed(2);

    }


    if (
        cartCount
    ) {

        cartCount.textContent =
            totalQuantity;

    }


    updateCheckoutTotals();

}



// ============================================================
// GET CART SUBTOTAL
// ============================================================

function getCartSubtotal() {

    return cart.reduce(
        function(total, item) {

            return (
                total +
                (
                    item.price *
                    item.quantity
                )
            );

        },
        0
    );

}



// ============================================================
// UPDATE CHECKOUT TOTALS
// ============================================================

function updateCheckoutTotals() {

    const subtotal =
        getCartSubtotal();


    const total =
        subtotal +
        deliveryFee;


    if (
        checkoutSubtotal
    ) {

        checkoutSubtotal.textContent =
            subtotal.toFixed(2);

    }


    if (
        checkoutDeliveryFee
    ) {

        checkoutDeliveryFee.textContent =
            deliveryFee.toFixed(2);

    }


    if (
        checkoutTotal
    ) {

        checkoutTotal.textContent =
            total.toFixed(2);

    }

}



// ============================================================
// QUANTITY
// ============================================================

function increaseQuantity(
    index
) {

    if (
        !cart[index]
    ) {

        return;

    }


    cart[index].quantity++;


    updateCart();

}



function decreaseQuantity(
    index
) {

    if (
        !cart[index]
    ) {

        return;

    }


    cart[index].quantity--;


    if (
        cart[index].quantity <= 0
    ) {

        cart.splice(
            index,
            1
        );

    }


    updateCart();

}



// ============================================================
// ORDER TYPE
// ============================================================

const orderTypeButtons =
    document.querySelectorAll(
        'input[name="order-type"]'
    );


orderTypeButtons.forEach(
    function(radio) {

        radio.addEventListener(
            "change",
            function() {


                // ============================================
                // DELIVERY
                // ============================================

                if (
                    this.value ===
                    "delivery"
                ) {

                    if (
                        deliverySection
                    ) {

                        deliverySection
                            .classList.add(
                                "delivery-visible"
                            );

                    }


                    if (
                        addressField
                    ) {

                        addressField
                            .style
                            .display =
                            "block";


                        addressField
                            .required =
                            true;

                    }


                    if (
                        addressLabel
                    ) {

                        addressLabel
                            .style
                            .display =
                            "block";

                    }

                }



                // ============================================
                // PICKUP
                // ============================================

                if (
                    this.value ===
                    "pickup"
                ) {

                    if (
                        deliverySection
                    ) {

                        deliverySection
                            .classList.remove(
                                "delivery-visible"
                            );

                    }


                    selectedDeliveryArea =
                        "";


                    deliveryFee =
                        0;


                    if (
                        deliveryAreaSelect
                    ) {

                        deliveryAreaSelect
                            .value =
                            "";

                    }


                    if (
                        deliveryFeeMessage
                    ) {

                        deliveryFeeMessage
                            .textContent =
                            "Please select your delivery area.";

                    }


                    if (
                        addressField
                    ) {

                        addressField
                            .style
                            .display =
                            "none";


                        addressField
                            .required =
                            false;


                        addressField
                            .value =
                            "";

                    }


                    if (
                        addressLabel
                    ) {

                        addressLabel
                            .style
                            .display =
                            "none";

                    }


                    updateCheckoutTotals();

                }

            }
        );

    }
);



// ============================================================
// CHECKOUT
// ============================================================

if (
    checkoutButton
) {

    checkoutButton.addEventListener(
        "click",
        function() {

            if (
                cart.length === 0
            ) {

                alert(
                    "Your cart is empty."
                );

                return;

            }


            cartPanel.classList.remove(
                "cart-open"
            );


            checkoutPanel.classList.add(
                "checkout-open"
            );


            updateCheckoutTotals();

        }
    );

}



if (
    closeCheckoutButton
) {

    closeCheckoutButton.addEventListener(
        "click",
        function() {

            checkoutPanel.classList.remove(
                "checkout-open"
            );

        }
    );

}



// ============================================================
// PAYMENT
// ============================================================

const paymentButtons =
    document.querySelectorAll(
        'input[name="payment-method"]'
    );


const qrPayment =
    document.getElementById(
        "qr-payment"
    );


const paymentProof =
    document.getElementById(
        "payment-proof"
    );


const paymentScreenshot =
    document.getElementById(
        "payment-screenshot"
    );


paymentButtons.forEach(
    function(radio) {

        radio.addEventListener(
            "change",
            function() {


                // ============================================
                // QR PAYMENT
                // ============================================

                if (
                    this.value ===
                    "qr"
                ) {

                    if (
                        qrPayment
                    ) {

                        qrPayment.style.display =
                            "block";

                    }


                    if (
                        paymentProof
                    ) {

                        paymentProof.style.display =
                            "block";

                    }


                    if (
                        paymentScreenshot
                    ) {

                        paymentScreenshot.required =
                            true;

                    }

                }



                // ============================================
                // CASH
                // ============================================

                if (
                    this.value ===
                    "cash"
                ) {

                    if (
                        qrPayment
                    ) {

                        qrPayment.style.display =
                            "none";

                    }


                    if (
                        paymentProof
                    ) {

                        paymentProof.style.display =
                            "none";

                    }


                    if (
                        paymentScreenshot
                    ) {

                        paymentScreenshot.required =
                            false;


                        paymentScreenshot.value =
                            "";

                    }

                }

            }
        );

    }
);



// ============================================================
// FILE TO BASE64
// ============================================================

function fileToBase64(
    file
) {

    return new Promise(
        function(
            resolve,
            reject
        ) {

            const reader =
                new FileReader();


            reader.onload =
                function() {

                    const result =
                        reader.result;


                    const base64 =
                        result.split(
                            ","
                        )[1];


                    resolve(
                        base64
                    );

                };


            reader.onerror =
                function(error) {

                    reject(
                        error
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}



// ============================================================
// SEND ORDER TO GOOGLE SHEETS
// ============================================================

async function sendOrderToGoogleSheets(
    orderData
) {

    try {

        await fetch(
            GOOGLE_SCRIPT_URL,
            {

                method:
                    "POST",

                mode:
                    "no-cors",

                headers: {

                    "Content-Type":
                        "text/plain;charset=utf-8"

                },

                body:
                    JSON.stringify(
                        orderData
                    )

            }
        );


        return true;


    } catch (error) {

        console.error(
            "Google Sheets error:",
            error
        );


        return false;

    }

}



// ============================================================
// PLACE ORDER
// ============================================================

const checkoutForm =
    document.getElementById(
        "checkout-form"
    );


if (
    checkoutForm
) {

    checkoutForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();



            // ================================================
            // CUSTOMER
            // ================================================

            const customerName =
                document.getElementById(
                    "customer-name"
                )
                .value
                .trim();


            const phone =
                document.getElementById(
                    "customer-phone"
                )
                .value
                .trim();



            // ================================================
            // ORDER TYPE
            // ================================================

            const selectedOrderType =
                document.querySelector(
                    'input[name="order-type"]:checked'
                );


            if (
                !selectedOrderType
            ) {

                alert(
                    "Please select Pickup or Delivery."
                );

                return;

            }


            const orderType =
                selectedOrderType.value;



            // ================================================
            // DELIVERY VALIDATION
            // ================================================

            if (
                orderType ===
                "delivery"
            ) {

                if (
                    !selectedDeliveryArea
                ) {

                    alert(
                        "Please select your delivery area."
                    );

                    return;

                }

            }



            // ================================================
            // ADDRESS
            // ================================================

            const address =
                addressField
                    ? addressField.value.trim()
                    : "";


            if (
                orderType ===
                "delivery" &&
                !address
            ) {

                alert(
                    "Please enter your delivery address."
                );

                return;

            }



            // ================================================
            // NOTES
            // ================================================

            const notes =
                document.getElementById(
                    "customer-notes"
                )
                .value
                .trim();



            // ================================================
            // PAYMENT
            // ================================================

            const selectedPayment =
                document.querySelector(
                    'input[name="payment-method"]:checked'
                );


            if (
                !selectedPayment
            ) {

                alert(
                    "Please select a payment method."
                );

                return;

            }


            const paymentMethod =
                selectedPayment.value;



            // ================================================
            // PAYMENT PROOF
            // ================================================

            let paymentProofData =
                null;


            if (
                paymentMethod ===
                "qr"
            ) {

                if (
                    !paymentScreenshot ||
                    paymentScreenshot.files.length === 0
                ) {

                    alert(
                        "Please upload your payment proof before placing your order."
                    );

                    return;

                }


                const file =
                    paymentScreenshot
                        .files[0];


                if (
                    file.size >
                    5 * 1024 * 1024
                ) {

                    alert(
                        "Payment proof must be smaller than 5MB."
                    );

                    return;

                }


                const base64 =
                    await fileToBase64(
                        file
                    );


                paymentProofData = {

                    name:
                        file.name,

                    type:
                        file.type,

                    data:
                        base64

                };

            }



            // ================================================
            // ITEMS TEXT
            // ================================================

            const items =
                cart
                    .map(
                        function(item) {

                            return (
                                item.name +
                                " x " +
                                item.quantity
                            );

                        }
                    )
                    .join(
                        ", "
                    );



            // ================================================
            // TOTALS
            // ================================================

            const subtotal =
                getCartSubtotal();


            const finalTotal =
                subtotal +
                deliveryFee;



            // ================================================
            // ORDER DATA
            // ================================================

            const orderData = {

                customerName:
                    customerName,

                phone:
                    phone,

                orderType:
                    orderType,

                deliveryArea:
                    orderType === "delivery"
                        ? selectedDeliveryArea
                        : "Pickup",

                deliveryFee:
                    orderType === "delivery"
                        ? deliveryFee.toFixed(2)
                        : "0.00",

                address:
                    address,

                notes:
                    notes,

                paymentMethod:
                    paymentMethod === "qr"
                        ? "QR Payment"
                        : "Cash",

                paymentStatus:
                    paymentMethod === "qr"
                        ? "Proof Uploaded"
                        : "Cash",

                paymentProof:
                    paymentProofData,

                items:
                    items,

                // IMPORTANT
                // Complete cart sent to Apps Script
                // for Sales Tracker.

                cartItems:
                    cart.map(
                        function(item) {

                            return {

                                name:
                                    item.name,

                                quantity:
                                    Number(
                                        item.quantity
                                    ),

                                price:
                                    Number(
                                        item.price
                                    )

                            };

                        }
                    ),

                subtotal:
                    subtotal.toFixed(2),

                total:
                    finalTotal.toFixed(2)

            };



            // ================================================
            // BUTTON
            // ================================================

            const placeOrderButton =
                document.getElementById(
                    "place-order-button"
                );


            if (
                placeOrderButton
            ) {

                placeOrderButton.disabled =
                    true;


                placeOrderButton.textContent =
                    "SENDING ORDER...";

            }



            // ================================================
            // SEND
            // ================================================

            const sent =
                await sendOrderToGoogleSheets(
                    orderData
                );



            // ================================================
            // CONFIRMATION
            // ================================================

            const confirmation =
                document.getElementById(
                    "confirmation"
                );


            const confirmationMessage =
                document.getElementById(
                    "confirmation-message"
                );


            const confirmationType =
                document.getElementById(
                    "confirmation-type"
                );


            const confirmationArea =
                document.getElementById(
                    "confirmation-area"
                );


            const confirmationPayment =
                document.getElementById(
                    "confirmation-payment"
                );


            const confirmationProof =
                document.getElementById(
                    "confirmation-proof"
                );


            const confirmationTotal =
                document.getElementById(
                    "confirmation-total"
                );



            if (
                confirmationMessage
            ) {

                confirmationMessage.textContent =
                    sent
                        ? "Thank you, " +
                          customerName +
                          "! Your order has been received."
                        : "Your order has been submitted. Please contact DailyWhisk if needed.";

            }



            if (
                confirmationType
            ) {

                confirmationType.textContent =
                    orderType === "pickup"
                        ? "Pickup"
                        : "Delivery";

            }



            if (
                confirmationArea
            ) {

                confirmationArea.textContent =
                    orderType === "delivery"
                        ? selectedDeliveryArea +
                          " (RM" +
                          deliveryFee.toFixed(2) +
                          ")"
                        : "Pickup";

            }



            if (
                confirmationPayment
            ) {

                confirmationPayment.textContent =
                    paymentMethod === "qr"
                        ? "QR Payment"
                        : "Cash";

            }



            if (
                confirmationProof
            ) {

                confirmationProof.textContent =
                    paymentMethod === "qr"
                        ? "Uploaded successfully"
                        : "Not required";

            }



            if (
                confirmationTotal
            ) {

                confirmationTotal.textContent =
                    finalTotal.toFixed(2);

            }



            if (
                checkoutPanel
            ) {

                checkoutPanel.classList.remove(
                    "checkout-open"
                );

            }



            if (
                confirmation
            ) {

                confirmation.classList.add(
                    "confirmation-open"
                );

            }



            // ================================================
            // CLEAR CART
            // ================================================

            cart = [];


            updateCart();


            checkoutForm.reset();



            // ================================================
            // RESET DELIVERY
            // ================================================

            selectedDeliveryArea =
                "";


            deliveryFee =
                0;


            if (
                deliveryAreaSelect
            ) {

                deliveryAreaSelect.value =
                    "";

            }


            if (
                deliverySection
            ) {

                deliverySection
                    .classList.remove(
                        "delivery-visible"
                    );

            }


            if (
                deliveryFeeMessage
            ) {

                deliveryFeeMessage
                    .textContent =
                    "Please select your delivery area.";

            }



            // ================================================
            // RESET ADDRESS
            // ================================================

            if (
                addressField
            ) {

                addressField.style.display =
                    "none";


                addressField.required =
                    false;

            }


            if (
                addressLabel
            ) {

                addressLabel.style.display =
                    "none";

            }



            // ================================================
            // RESET PAYMENT
            // ================================================

            if (
                qrPayment
            ) {

                qrPayment.style.display =
                    "block";

            }


            if (
                paymentProof
            ) {

                paymentProof.style.display =
                    "block";

            }


            if (
                paymentScreenshot
            ) {

                paymentScreenshot.required =
                    true;

            }



            // ================================================
            // RESET BUTTON
            // ================================================

            if (
                placeOrderButton
            ) {

                placeOrderButton.disabled =
                    false;


                placeOrderButton.textContent =
                    "PLACE ORDER";

            }

        }
    );

}



// ============================================================
// CONFIRMATION CLOSE
// ============================================================

const closeConfirmation =
    document.getElementById(
        "close-confirmation"
    );


const backToMenu =
    document.getElementById(
        "back-to-menu"
    );


if (
    closeConfirmation
) {

    closeConfirmation.addEventListener(
        "click",
        function() {

            const confirmation =
                document.getElementById(
                    "confirmation"
                );


            if (
                confirmation
            ) {

                confirmation
                    .classList.remove(
                        "confirmation-open"
                    );

            }

        }
    );

}



if (
    backToMenu
) {

    backToMenu.addEventListener(
        "click",
        function() {

            const confirmation =
                document.getElementById(
                    "confirmation"
                );


            if (
                confirmation
            ) {

                confirmation
                    .classList.remove(
                        "confirmation-open"
                    );

            }


            window.scrollTo({

                top: 0,

                behavior:
                    "smooth"

            });

        }
    );

}



// ============================================================
// INITIAL SETUP
// ============================================================

if (
    qrPayment
) {

    qrPayment.style.display =
        "block";

}


if (
    paymentProof
) {

    paymentProof.style.display =
        "block";

}


if (
    paymentScreenshot
) {

    paymentScreenshot.required =
        true;

}


if (
    addressField
) {

    addressField.style.display =
        "none";


    addressField.required =
        false;

}


if (
    addressLabel
) {

    addressLabel.style.display =
        "none";

}


if (
    deliverySection
) {

    deliverySection
        .classList.remove(
            "delivery-visible"
        );

}



// ============================================================
// CONNECT BUTTONS
// ============================================================

connectDrinkButtons();



// ============================================================
// LOAD GOOGLE SHEET DATA
// ============================================================

loadWebsiteMenu();

loadDeliveryAreas();



// ============================================================
// INITIAL CART
// ============================================================

updateCart();