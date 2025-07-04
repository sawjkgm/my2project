// Функция для получения новостей с разных источников
async function getNews() {
    try {
        // Получаем контейнер для новостей
        const newsContainer = document.querySelector('.latest-news');
        const loader = newsContainer.querySelector('.loader');

        // Показываем индикатор загрузки
        if (loader) loader.style.display = 'block';

        // Очищаем существующие новости (только статьи)
        const articlesToRemove = newsContainer.querySelectorAll('article.news-item');
        articlesToRemove.forEach(article => newsContainer.removeChild(article));

        // Массив источников новостей с их RSS-фидами
        const newsSources = [
            {
                url: 'https://habr.com/ru/news/',
                rss: 'https://habr.com/ru/rss/news/',
                name: 'Хабр'
            },
            {
                url: 'https://hi-tech.mail.ru/news/',
                rss: 'https://hi-tech.mail.ru/rss/news/',
                name: 'Hi-Tech Mail.ru'
            }
        ];

        // Для каждого источника получаем новости
        for (const source of newsSources) {
            try {
                // Используем CORS прокси для обхода ограничений
                const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(source.rss)}`);
                const text = await response.text();

                // Парсим XML
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(text, "text/xml");

                // Получаем первую новость
                const item = xmlDoc.querySelector('item');
                if (item) {
                    const title = item.querySelector('title').textContent;
                    const link = item.querySelector('link').textContent;

                    // Создаем статью
                    const article = document.createElement('article');
                    article.className = 'news-item';

                    // Создаем заголовок с реальным названием новости
                    const titleElement = document.createElement('h2');
                    titleElement.textContent = title;

                    // Создаем ссылку на новость
                    const linkElement = document.createElement('a');
                    linkElement.href = link;
                    linkElement.target = '_blank';
                    linkElement.textContent = 'Подробнее';

                    // Добавляем элементы в статью
                    article.appendChild(titleElement);
                    article.appendChild(linkElement);

                    // Добавляем статью в контейнер
                    newsContainer.appendChild(article);
                }
            } catch (error) {
                console.error(`Ошибка при получении новостей с ${source.name}:`, error);

                // В случае ошибки создаем заголовок с сообщением об ошибке
                const article = document.createElement('article');
                article.className = 'news-item';

                const titleElement = document.createElement('h2');
                titleElement.textContent = `Не удалось загрузить новости с ${source.name}`;

                const linkElement = document.createElement('a');
                linkElement.href = source.url;
                linkElement.target = '_blank';
                linkElement.textContent = 'Перейти на сайт';

                article.appendChild(titleElement);
                article.appendChild(linkElement);
                newsContainer.appendChild(article);
            }
        }

    } catch (error) {
        console.error('Ошибка при получении новостей:', error);
    } finally {
        // Скрываем индикатор загрузки
        const newsContainer = document.querySelector('.latest-news');
        const loader = newsContainer.querySelector('.loader');
        if (loader) loader.style.display = 'none';
    }
}

// Загружаем новости при загрузке страницы
window.addEventListener('DOMContentLoaded', getNews);
