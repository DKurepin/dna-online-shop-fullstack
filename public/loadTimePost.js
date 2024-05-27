(function () {
  // Функция для отправки запроса и обработки времени ответа
  function fetchAndProcessResponseTime() {
    // Отправляем POST запрос на сервер
    fetch(window.location.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Указываем, что отправляем JSON
      },
      body: JSON.stringify({}) // Пустое тело запроса, если вам не нужно отправлять данные
    })
      .then(response => {
        // Получаем значение заголовка X-Response-Time
        let responseTime = parseInt(response.headers.get('X-Response-Time'));
        return responseTime;
      })
      .then(responseTime => {
        // Далее ваш код для вычисления времени загрузки страницы и обновления содержимого футера
        let pageLoadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        let connectionTime = responseTime; // Мы используем responseTime для connectionTime
        pageLoadTime = pageLoadTime - connectionTime;
        let overallTime = responseTime + connectionTime;
        let footer = document.querySelector('footer');
        let footerText = document.createElement("p");
        footerText.innerHTML = `Page Load Time: ${pageLoadTime}ms + Server Response Time: ${overallTime}ms`;
        footer.appendChild(footerText);
      })
      .catch(error => {
        console.error('Error fetching X-Response-Time header:', error);
      });
  }

  window.addEventListener("load", () => {
    // При загрузке страницы вызываем функцию fetchAndProcessResponseTime
    fetchAndProcessResponseTime();
  });
})();
