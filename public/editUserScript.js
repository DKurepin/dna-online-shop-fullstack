document.querySelector('.editUserForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Предотвращаем стандартное поведение отправки формы

    const id = document.getElementById('id').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const address = document.getElementById('address').value;
    console.log('id:', id);
    console.log('username:', username);
    console.log('password:', password );
    console.log('phoneNumber:', phoneNumber);
    console.log('address:', address);

    fetch(`../../`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: parseInt(id),
            username: username,
            password: password,
            phoneNumber: phoneNumber,
            address: address
        })
    })
        .then(response => {
            if (response.ok) {
                alert('User info updated');
                window.location.href = `/users/page/edit/${id}`;
            } else {
                alert('Error updating user info');
            }
        })
});