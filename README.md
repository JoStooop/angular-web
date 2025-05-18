 Практика по?
1. Observable + (pipe) + subscribe
2. httpClient

***
Добавил в проект:
- Настройки editorconfig - из DBA
- Добавил алиасы импорта для @base - статья [medium](https://medium.com/@thepawanluhana/angular-alias-import-with-typescript-d8e79dd9e5d)

***
Дока Angular:
1. Активная ссылка в header [дока](https://angular.dev/api/router/RouterLinkActive)
2. Работа с location [дока](https://angular.dev/api/common/Location#usage-notes)
3. в [доке](https://angular.dev/guide/http/making-requests#http-observables) тоже была рекомендация внизу в (Best practices) чтобы выносить в сервис запросы 

***
Вопросы:
1. Необходимо ли добавлять в каждый компонент - standalone: true
2. Необходимо ли try-catch в loadPosts?
3. Надо делать отписку от subscribe. И какие бывают сценарии утечки памяти?
4. Страница Error, при клике "назад" страница перезагружается (должно ли так быть?)
5. `@Input() post!: Post` - или `?` - как такие вещи лучше обрабатывать?

***
Проблемы:
1. Структурирование проекта (в каких дирректориях должны находиться какие файлы)
2. Не работает Фильр и Поиск вместе
3. При каждом переходе с стр. на стр. данные снова загр. (БАГ или ФИЧА?)
