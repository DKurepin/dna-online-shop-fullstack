document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.createNewUserOrderForm');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const userId = parseInt(document.getElementById('userId').value);
        const address = document.getElementById('address').value;

        const data = {
            userId: userId,
            address: address
        };

        try {
            const response = await fetch('/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            const responseData = await response.json();
            console.log('Order created:', responseData);

            // Перезагрузка страницы
            window.location.reload();

            // Отправка уведомления о успешном создании заказа
            alert('Order created successfully!');
        } catch (error) {
            console.error('Error creating order:', error.message);
            // Добавьте здесь код для обработки ошибки, например, отображение сообщения пользователю
        }
    });
});