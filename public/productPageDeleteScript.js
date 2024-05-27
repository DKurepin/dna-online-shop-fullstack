document.getElementById('deleteProductForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Предотвращаем стандартное поведение отправки формы

    const id = document.getElementById('productId').value;
    console.log('id:', id);

    fetch(`/product/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: parseInt(id)
        })
    })
        .then(response => {
            if (response.ok) {
                alert('Product deleted');
                window.location.href = '/';
            } else {
                alert('Error deleting product');
            }
        })
});