function addToCart(imageSrc, productName, productPrice) {
    // Load existing cart items from localStorage
    var cartItems = JSON.parse(localStorage.getItem('cart')) || [];

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
    updateCartDisplay();
    console.log('Local Storage:', localStorage);
}
