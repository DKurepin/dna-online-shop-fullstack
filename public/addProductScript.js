document.querySelector('.addProductForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Предотвращаем стандартное поведение отправки формы

    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
    const stock = document.getElementById('stock').value;
    const category = document.getElementById('categoryId').value;
    const photo = document.getElementById('photo').value;
    console.log('name:', name);
    console.log('price:', price);
    console.log('description:', description);
    console.log('category:', category);
    console.log('stock:', stock);
    console.log('photo:', photo);

    fetch(`/product`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            price: parseInt(price),
            description: description,
            stock: parseInt(stock),
            categoryId: parseInt(category),
            photo: photo
        })
    })
        .then(response => {
            if (response.ok) {
                alert('Product added');
                window.location.href = `/`;
            } else {
                alert('Error adding product');
            }
        })
});
