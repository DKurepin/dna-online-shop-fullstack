document.querySelectorAll('.productCartDeleteButton').forEach(button => {
    button.addEventListener('click', async function(event) {
        event.preventDefault();

        const userProductId = this.getAttribute('data-user-product-id'); // Получаем userProductId из data атрибута

        fetch(`/user-product/${userProductId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userProductId: parseInt(userProductId)
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
});