// Load cart items from localStorage
var cartItems = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', function () {
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

    // Recalculate the cart totals for the newly added row
    recalculateCart();

    // Add event listener for the input elements with the 'quantity-input' class
    var quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(function (input) {
        input.addEventListener('input', function () {
            updateTotal(input);
        });
    });

    // Add event listener for the remove-item icons
    var removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            var itemId = parseInt(button.dataset.itemId);
            removeItem(itemId);
        });
    });
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
        <td><input type="number" value="1" class="quantity-input"></td>
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

    // Recalculate the cart totals for the newly added row
    recalculateCart();
}




