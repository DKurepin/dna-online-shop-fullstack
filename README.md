# dna-online-shop
### Сайт концепт-магазина для покупки одежды/аксессуаров
### Курепин Даниил Денисович M33031
<img width="1438" alt="image" src="https://github.com/DKurepin/dna-online-shop-fullstack/assets/91544570/dec01f0b-16f3-4a66-826a-54af84abf0c3">
![shop_vid-ezgif com-video-to-gif-converter](https://github.com/DKurepin/dna-online-shop-fullstack/assets/91544570/4b75aa33-308b-467a-8ba7-c0a5226df004)


### Описание сущностей из модели данных:
* ```User``` - сущность, характеризующая пользвателя с атрибутами: имя пользователя, почта, номер телефона, пароль, адрес, уникальный id
* ```Category``` - сущность, характеризующая категорию продукта, артибуты: название категории, уникальный id.
* ```Product``` - сущность, характеризующая продукт (какую-то вещь в моем случае) с атрибутами: название, ссылка на фото, описание, цена (float), наличие на складе (количество), к какой категории относится (ссылается на categoryId у ```Category```)
* ```Order``` - сущность, характеризующая заказ юзера, атрибуты: уникальный id, id пользователя, общая стоимость заказа, дата создания, дата когда последний раз обновлялся, статус (enum), адрес.
* ```OrderDetails``` - сущность, характеризующая детали заказа юзера по конкретному продукту. Атрибуты: уникальный id, id заказа, id продукта, количество продукта, цена за штуку, общая стоимость (количество * цена за шт.), дата создания и дата обновления.
* ```Subscription``` - сущность, характеризующая подписку на рассылку. Атрибуты: уникальный id, почта уникальная, дата создания и дата обновления, id юзера (если юзер с такой почтой есть).
![shopdb_scheme_updated.png](shopdb_scheme_updated.png)
