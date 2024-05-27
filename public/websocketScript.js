const socket = io('https://dna-online-shop.onrender.com/');

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('updateMessage', (update) => {
    const { type, payload } = update;
    switch (type) {
        case 'PRODUCT_CREATED':
            const notyf = new Notyf({
                duration: 10000,
                position: {
                    x: 'right',
                    y: 'top',
                }});
            notyf.success(`Товар: ${payload.name} добавлен на сайт!`);
            console.log('Product created:', payload);
            break;
        case 'PRODUCT_DELETED':
            const notyfDeleted = new Notyf({
                duration: 10000,
                position: {
                    x: 'right',
                    y: 'top',
                }});
            notyfDeleted.error(`Товар: ${payload.name} удален с сайта!`);
            console.log('Product deleted:', payload);
            break;
        case 'PRODUCT_UPDATED':
            const notyfUpdated = new Notyf({
                duration: 10000,
                position: {
                    x: 'right',
                    y: 'top',
                },
                types: [
                    {
                        type: 'warning',
                        background: 'orange',
                    }
                ]
            });
            notyfUpdated.open({
                type: 'warning',
                message: `Товар: ${payload.name} обновлен!`,
            })
            console.log('Product updated:', payload);
            break;
        default:
            console.log('Unknown update type:', type);
    }
});