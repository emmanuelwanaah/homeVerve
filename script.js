var bar = document.getElementById('bar');
var close = document.getElementById('close');
var nav = document.getElementById('navbar');
if (bar) {
bar.addEventListener('click', () =>{
    nav.classList.add('show');
});
};
if (close) {
    close.addEventListener('click', () =>{
        nav.classList.remove('show');
    })
}
var mainimg = document.getElementById('Mainimg');
var smallimg = document.getElementsByClassName('small-img');

smallimg[0].onclick = function() {
    mainimg.src = smallimg[0].src;
};

smallimg[1].onclick = function() {
    mainimg.src = smallimg[1].src;
};

smallimg[2].onclick = function() {
    mainimg.src = smallimg[2].src;
};

smallimg[3].onclick = function() {
    mainimg.src = smallimg[3].src;
};
smallimg[4].onclick = function() {
    mainimg.src = smallimg[4].src;
};


document.addEventListener('DOMContentLoaded', function () {
    // Attach event listeners for input elements with the 'quantity-input' class
    var quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(function (input) {
        input.addEventListener('input', function () {
            updateTotal(input);
        });
    });

    // Attach event listeners for elements with the 'remove-item' class
    var removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            var itemId = parseInt(button.dataset.itemId);
            removeItem(itemId);
        });
    });

    // Load cart items from localStorage
    var cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Get the cart table body
    var cartTableBody = document.getElementById('cart').getElementsByTagName('tbody')[0];

    // Loop through cart items and create rows
    cartItems.forEach(function (item, index) {
        appendCartItem(cartTableBody, item, index);
    });

    // Check if cart has items, then display the cart
    if (cartItems.length > 0) {
        // Hide all rows except the last one (newly added row)
        var cartRows = document.querySelectorAll('#cart tbody tr');
        cartRows.forEach(function (row, index) {
            if (index !== cartRows.length - 1) {
                row.style.display = 'none';
            }
        });

        // Display the cart table
        document.getElementById('cart').style.display = 'block';
    }

    // Recalculate the cart totals
    recalculateCart();
});

function appendCartItem(cartTableBody, item, index) {
    // Create a new row
    var newRow = document.createElement('tr');

    // Set the ID of the new row to make it unique
    newRow.id = 'row-' + (index + 1);

    // Set the content of the new row
    newRow.innerHTML = `
        <td><i class="far fa-times-circle remove-item" data-item-id="${index + 1}"></i></td>
        <td><img src="${item.imageSrc}" alt=""></td>
        <td class="product-name">${item.productName}</td>
        <td class="product-price">${item.productPrice}</td>
        <td><input type="number" value="1" class="quantity-input" onchange="updateTotal(this)"></td>
        <td class="total-price">${item.productPrice}</td>
    `;

    // Append the new row to the cart table body
    cartTableBody.appendChild(newRow);

    // Add a click event listener to the remove-item icon
    var removeIcon = newRow.querySelector('.remove-item');
    if (removeIcon) {
        removeIcon.addEventListener('click', function () {
            removeItem(index + 1); // Adjust for 1-based index
        });
    }
}

function addToCart(imageSrc, productName, productPrice) {
    // Create a new cart item
    var newItem = {
        imageSrc: imageSrc,
        productName: productName,
        productPrice: productPrice
    };

    // Add the new item to the cartItems array
    cartItems.push(newItem);

    // Save the updated cartItems array to localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));

    // Append the new item to the cart display
    appendCartItem(cartTableBody, newItem, cartItems.length - 1);

    // Recalculate the cart totals
    recalculateCart();
}
function removeItem(itemId) {
    // Construct the ID of the row to be removed
    var rowId = 'row-' + itemId;

    // Find the row with the corresponding ID
    var row = document.getElementById(rowId);

    // Check if the row exists before attempting to remove
    if (row) {
        // Remove the row from the DOM
        row.remove();

        // Clear the item from local storage
        clearItemFromLocalStorage(itemId);

        // Recalculate the cart totals
        recalculateCart();
    }
}


function updateTotal(input) {
    // Find the parent row
    var row = input.parentNode.parentNode;

    // Get the product price and quantity
    var price = parseFloat(row.querySelector('.product-price').innerText.replace('$', ''));
    var quantity = parseInt(input.value);

    // Calculate the subtotal
    var subtotal = price * quantity;

    // Update the total-price cell in the same row
    row.querySelector('.total-price').innerText = '$ ' + subtotal.toFixed(2);

    // Check if the quantity is 0, and if so, remove the row
    if (quantity === 0) {
        row.remove();

        // Clear the item from local storage
        var itemId = parseInt(row.id.split('-')[1]);
        clearItemFromLocalStorage(itemId);
    }

    // Recalculate the overall cart subtotal and total
    recalculateCart();
}

function recalculateCart() {
    var visibleRows = document.querySelectorAll('#cart tbody tr:not([style*="display: none"])');
    var cartSubtotal = 0;

    // Loop through each visible row and update the cart subtotal
    visibleRows.forEach(function (row) {
        var subtotal = parseFloat(row.querySelector('.total-price').innerText.replace('$', ''));
        cartSubtotal += subtotal;
    });

    // Update the cart subtotal and total price cells in the Subtotal section
    document.querySelector('.cartsubtotal').innerText = '$ ' + cartSubtotal.toFixed(2);
    document.querySelector('.totalprice strong').innerText = '$ ' + cartSubtotal.toFixed(2);
    updatePayPalTotal(cartSubtotal);
}

// ...

function clearItemFromLocalStorage(itemId) {
    // Load cart items from localStorage
    var cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Find the index of the item with the specified itemId
    var itemIndex = cartItems.findIndex(function (item) {
        return item.itemId === itemId;
    });

    // Remove the item from the cartItems array
    if (itemIndex !== -1) {
        cartItems.splice(itemIndex, 1);
    }

    // Save the updated cartItems array to localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));
}

// ...
function updatePayPalTotal(totalAmount) {
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: totalAmount.toFixed(2) // Ensure the value has two decimal places
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                alert('Transaction completed by ' + details.payer.name.given_name);
                // Call your server to save the transaction details
            });
        }
    }).render('#paypal-button-container');
}

// Initial calculation when the page loads
recalculateCart();
