document.getElementById('subscribeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('emailInput').value;
    fetch('/subscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
    })
        .then(response => {
            if (response.ok) {
                alert('Subscription successful');
                document.getElementById('emailInput').value = ''; // Сбрасываем значение поля ввода
            } else {
                alert('Subscription failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
});