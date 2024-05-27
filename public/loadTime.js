(function () {
    window.addEventListener("load", () => {
        fetch(window.location.href)
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
    });
})();

