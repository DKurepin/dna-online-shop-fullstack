document.addEventListener('DOMContentLoaded', async () => {
    const preloader = document.getElementById('preloader');

    try {
        let randomId = Math.floor(Math.random() * 10) + 1;
        const userDataUrl = `https://jsonplaceholder.typicode.com/users/${randomId}`;

        const userResponse = await fetch(userDataUrl);
        const user = await userResponse.json();

        const {
            username,
            name,
            email,
            phone,
            address: { street, suite, city, zipcode },
            id
        } = user;

        const usernameElement = document.getElementById('user-username');
        const nameElement = document.getElementById('user-name');
        const emailElement = document.getElementById('user-email');
        const phoneElement = document.getElementById('user-phone');
        const idElement = document.getElementById('user-id');
        const addressElement = document.getElementById('user-address');

        if (usernameElement) usernameElement.textContent = username;
        if (nameElement) nameElement.textContent = name;
        if (emailElement) emailElement.textContent = email;
        if (phoneElement) phoneElement.textContent = phone;
        if (idElement) idElement.textContent = id;
        if (addressElement) addressElement.textContent = `${street}, ${suite}, ${city}, ${zipcode}`;

        const randomIdBetween0and5000 = Math.floor(Math.random() * 5000);
        const avatarUrl = `https://jsonplaceholder.typicode.com/photos/${user.id + randomIdBetween0and5000}`;

        const avatarResponse = await fetch(avatarUrl);
        const avatar = await avatarResponse.json();

        const avatarElement = document.getElementById('user-avatar');
        if (avatarElement) avatarElement.src = avatar.url;
    } catch (error) {
        console.error('Error fetching data:', error);
        preloader.style.display = 'none';
        const errorElement = document.getElementById('error-message');
        if (errorElement) errorElement.textContent = '⚠️ Something went wrong!';
    } finally {
        preloader.style.display = 'none';
    }
});
