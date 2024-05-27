document.querySelector('.editProductForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Предотвращаем стандартное поведение отправки формы

    const id = document.getElementById('id').value;
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
    const photo = document.getElementById('photo').value;
    const stock = document.getElementById('stock').value;
    const categoryId = document.getElementById('categoryId').value;
    console.log('id:', id);
    console.log('name:', name);
    console.log('price:', price);
    console.log('description:', description);
    console.log('photo:', photo);
    console.log('stock:', stock);
    console.log('categoryId:', categoryId);

    fetch(`../`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: parseInt(id),
            name: name,
            price: parseInt(price),
            description: description,
            photo: photo,
            stock: parseInt(stock),
            categoryId: parseInt(categoryId)
        })
    })
        .then(response => {
            if (response.ok) {
                alert('Product info updated');
                window.location.href = `/product/${id}`;
            } else {
                alert('Error updating product info');
            }
        })
});