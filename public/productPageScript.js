document.getElementById('addToCartForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Предотвращаем стандартное поведение отправки формы

    // const userId = document.getElementById('userId').value;
    const quantity = document.getElementById('quantity').value;
    const productId = document.getElementById('productId').value;
    // console.log('userId:', userId);
    console.log('quantity:', quantity);
    console.log('productId:', productId);

    fetch('/user-product', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            // userId: parseInt(userId),
            quantity: parseInt(quantity),
            productId: parseInt(productId)
        })
    })
        .then(response => {
            if (response.ok) {
                alert('Товар добавлен в корзину');
                document.getElementById('userId').value = '';
                document.getElementById('quantity').value = '';
            } else {
                alert('Ошибка добавления товара в корзину');
            }
        });
});