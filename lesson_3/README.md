# Lesson 3. Express - фреймворк для веб приложений

- Начало работы с Express.
- Сервер. Маршрутизация, статические файлы
- Обработка форм, POST, GET запросы
- JSON, АJAX
- Конвеер обработки и middleware

## Начало работы с Express

Express представляет собой популярный веб-фреймворк, написанный на JavaScript и работающий внутри среды исполнения node.js.

Он позволяет вам очень просто создать такие возможности в вашем проекте как:

- маршрутизация (роутинг)
- промежуточные обработчики (middleware)
- шаблонизация
- обработка ошибок
- дебаг (отладка)
- интеграция с базами данных

### Middleware (промежуточный обработчик)

Это функция которая имеет доступ к запросу (request) и ответу (response).
Функция может делать любые действия и передавать их результат в response или в следующий middleware.

В экспрессе в middleware есть так же 3й аргумент `next`. Он позволяет перейти сразу к следующемо обработчику события.

Пример:

```
var myLogger = function (req, res, next) {
  console.log('LOGGED');
  next();
};
```

**Для чего можно использовать Middleware:**

- логирование
- отлов ошибок
- преобразование данных с request
- проверка залогинен ли пользователь (аутентификация)

Вот так выглядит использование middleware в коде

```js
var express = require("express");
var app = express();

// создание middleware
var requestTime = function(req, res, next) {
  // Пример: добавляем время к запросу
  req.requestTime = Date.now();
  next();
};

// добавление middleware ко всем роутам
app.use(requestTime);

app.get("/", function(req, res) {
  var responseText = "Hello World!";
  responseText += "Requested at: " + req.requestTime + "";
  res.send(responseText);
});

app.get(
  "/subscribers/:id",
  // добавление middleware к определенному роуту
  function checkIfPaidSubscriber(req, res, next) {
    if (!req.user.hasPaid) {
      // continue handling this request
      next("route");
    }
  },
  function getPaidContent(req, res) {
    PaidContent.find(function(err, doc) {
      if (err) return next(err);
      res.json(doc);
    });
  }
);

app.listen(3000);
```

### Шаблонизация

С помощью Express можно сделать статический сайт, который будет перезагружатся после открытия каждой страницы. Либо же после каждого измненения (если на сайте будет что-то меняться). Как например этот сайт на php https://metanit.com/

Для того чтобы отображать в Express файлы шаблонов, необходимо задать следующие параметры приложения:

**views** - каталог, в котором находятся файлы шаблонов. Например: app.set('views', './views')

**view engine** - используемый шаблонизатор. Например: app.set('view engine', 'pug')

Cначала нам нужно установить шаблонизатор. Например `pug` https://pugjs.org/api/getting-started.html

Следующим шагом создаем шаблон `index.pug`

```
html
  head
    title= title
  body
    h1= message
```

`title` и `message` это переменные вместо которых можно что-то подставить

Затем создаем роут для вывода файла index.pug. Если свойство view engine не задано, необходимо указать расширение файла view. В противном случае, можно не указывать расширение.

```
app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!'});
});
```

При выполнении запроса к домашней странице файл index.pug будет отображаться как HTML.

Статьи:

- http://expressjs.com/ru/guide/using-template-engines.html
- создание своего шаблонизатора http://expressjs.com/ru/advanced/developing-template-engines.html

### Обработка ошибок

Если в JS возникает ошибка что никак не обрабатывается то JS перестает выполнятся дальше. По этому особенно важно отлавливать ошибки в вашем бекенд приложении. Иначе он просто упадет.

Такие функции реализуются с помощью `middleware`, но с указанием для функции обработки ошибок не трех, а четырех аргументов: (err, req, res, next).

Пример:

```
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

Обработчик для обработки ошибок должен быть определен последним, после указания всех app.use() и вызовов роутов;

Пример:

```
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

app.use(bodyParser());
app.use(methodOverride());
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);
```

Так же в Express предусмотрен встроенный обработчик ошибок, который обрабатывает любые возможные ошибки, встречающиеся в приложении. Этот стандартный обработчик ошибок добавляется в конец всех функций промежуточной обработки(middleware).

### Отладка (debug)

В Express используется внутренний модуль debug для регистрации информации о сопоставлениях маршрутов, используемых функциях промежуточной обработки, режиме приложения и выполнении цикла “запрос-ответ”.

При запуске команды вам в консоли выведутся все операции что были сделаны за определенные время.

Например

```
const debug = require('debug')('http')
const http = require('http')
const name = 'My App';

debug('booting %o', name);

http.createServer(function(req, res){
  debug(req.method + ' ' + req.url);
  res.end('hello\n');
}).listen(3000, function(){
  debug('listening');
});

```

В консоли вы увидите

<img src="./img/1.png" />

Список всех операций и сколько времени заняла каждая их них.

Более детально:

- https://expressjs.com/ru/guide/debugging.html
- https://www.npmjs.com/package/debug

## Руководство по кросс-доменным запросам (CORS)

Обычно запрос XMLHttpRequest может делать запрос только в рамках текущего сайта. При попытке использовать другой домен/порт/протокол – браузер выдаёт ошибку.

Существует современный стандарт XMLHttpRequest, он ещё в состоянии черновика, но предусматривает кросс-доменные запросы и многое другое.

Большинство возможностей этого стандарта уже поддерживаются всеми браузерами, но увы, не в IE9-.

Впрочем, частично кросс-доменные запросы поддерживаются, начиная с IE8, только вместо XMLHttpRequest нужно использовать объект XDomainRequest.

Cross-Origin Resource Sharing (CORS) — механизм, использующий дополнительные HTTP-заголовки, чтобы дать возможность агенту пользователя получать разрешения на доступ к выбранным ресурсам с сервера на источнике (домене), отличном от того, что сайт использует в данный момент. Говорят, что агент пользователя делает запрос с другого источника (cross-origin HTTP request), если источник текущего документа отличается от запрашиваемого ресурса доменом, протоколом или портом.

Пример cross-origin запроса: HTML страница, обслуживаемая сервером с http://domain-a.com, запрашивает <img> src по адресу http://domain-b.com/image.jpg. Сегодня многие страницы загружают ресурсы вроде CSS-стилей, изображений и скриптов с разных доменов, соответствующих разным сетям доставки контента (Content delivery networks, CDNs).

В целях безопасности браузеры ограничивают cross-origin запросы, инициируемые скриптами. Например, XMLHttpRequest и Fetch API следуют политике одного источника (same-origin policy). Это значит, что web-приложения, использующие такие API, могут запрашивать HTTP-ресурсы только с того домена, с которого были загружены, пока не будут использованы CORS-заголовки.

![](CORS_principle.png)

Механизм CORS поддерживает кросс-доменные запросы и передачу данных между браузером и web-серверами по защищенному соединению. Современные браузеры используют CORS в API-контейнерах, таких как XMLHttpRequest или Fetch, чтобы снизить риски, присущие запросам с других источников.

Для работы с кросс-доменными запросами используем библиотеку - Cors

сначала установите Cors в своем приложении.

```javascript
npm i cors
```

после установки cors необходимо подключение модуля к вашему основному файлу

```javascript
const cors = require("cors");
```

И теперь надо передать функции из приложения cors к нашему экземпляру Express с помощью директивы .use
Простой вариант использования модуля для всех маршрутов (Enable All CORS Requests)

```javascript
constexpress = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.get("/products/:id", function(req, res, next) {
  res.json({ msg: "This is CORS-enabled for all origins!" });
});

app.listen(80, function() {
  console.log("CORS-enabled web server listening on port 80");
});
```

или вот такой вариант, с расширенными настройками

```javascript
let allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // allow requests from any other server
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE"); // allow these verbs
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Cache-Control"
  );
};
app.use(allowCrossDomain); // plumbing it in as middleware
```

## Зачем нужны lock файлы в npm

Это файл, который генерируется автоматически и хранит в себе полное дерево всех зависимостей с версиями. И после его генерации все пакеты устанавливаются по новой с версиями и зависимостями, которые там указаны.

По умолчанию в npm, при установке пакетов у вас автоматически создается и обновляется файл package-lock.json. Вам не нужно ничего дополнительно делать. Вы просто должны закоммитить этот файл также, как и обычный файл проекта в репозиторий.

Если же вы используете yarn, вместо npm, то у вас также автоматически генерируется файл yarn.lock, который лочит все версии.

##О логгировании в Node.js
https://habr.com/ru/post/209436/ - о целях логирования

Morgan был создан для ведения журнала таким образом, что серверы, на Apache и Nginx, регистрируются в error_log или access_log.
Morgan, предназначен для автоматического ведения запросов, ответов и связанных с ними данных.

```
const morgan = require('morgan');
//This tells express to log via morgan
//and morgan to log in the "dev" pre-defined format
app.use(morgan('dev'));
```

Morgan: еще одно промежуточное ПО для регистрации HTTP-запросов для Node.js. Упрощает процесс регистрации запросов к вашему приложению. Вы можете думать о Моргане как о помощнике, который собирает журналы с вашего сервера - журналы ваших запросов. Экономит время разработчиков, поскольку им не нужно вручную создавать общие журналы. Он стандартизирует и автоматически создает журналы запросов.

```
var express = require('express')
var morgan = require('morgan')

var app = express()

//use morgan middleware
app.use(morgan('combined'))

app.get('/', function (req, res) {
  res.send('hello, world!')
})


//server is listening
app.listen(3000, function () {
	console.log("Server started...");
	console.log("Morgan logger with express...");
})

```

После запуска сервера в консоли можно увидеть следующее сообщение
[![](http://www.goodbehind.com/wp-content/uploads/2018/02/Screenshot-from-2018-02-04-18-05-02.png)](http://http://www.goodbehind.com/wp-content/uploads/2018/02/Screenshot-from-2018-02-04-18-05-02.png)


И вот видео в котором объясняеться как подключиться к MongoDB Atlas - https://www.youtube.com/watch?v=KKyag6t98g8 - - в видео нужное обьяснение до 7 минуты - именно настройка кластера и получение ссылки, остальное уже не нужно


### Задание:
- Сделать основу бекенд приложения (по примеру в папочке express-test_03)
- Создать `json` с затратами
  - Скачать этот `json` - costs-mock.json
  - Расширить по примеру еще 5 тратами
  - Сохранить `json` под названием `all-costs.json` по адресу `src/db/costs`

- Сделать роутинг

- В роутинге должны быть следующие пути:
    - GET `/costs` в ответе должны прийти все товары (из `all-costs.json`)
    
   - GET `/costs/:id` в ответе возможность получить данные какой-либо траты по `id
      На сервер приходит `GET localhost:3001/costs/12345` 
      Ищете товар по `id` в `all-costs.json`
      Отправляете пользователю ответ в виде:

      ```json

      {
      "status": "success", 
      "products": [{
      "id": 19112831,
      "name": "Пицца Пепперони с томатами",
      "description": "",
      "price": "100",
      "currency": "UAN",
      "created": "21-07-2019",
      "modified": "23-07-2019",
      "categories": ["food"]
      }]
      }

```

 - GET `/costs/?category="food"` в ответе возможность получить данные нескольких продуктов по категориям

- На сервер приходит `GET localhost:3001/costs/?category="food"` 
- Ищете товары по `id` в `all-costs.json`
- Отправляете пользователю ответ в таком же виде как и в ответе выше.


Если в `all-costs.json` нет товаров что вы ищите, то ответ должен быть:

```json

{
 "status": "no products", 
 "products": []
}
```      

#### Требования
   - Приложение должно лежать в отдельном вашем репозитории с названием `wallet-server-goit`
   - Все задание нужно делать в ветке `homework-1`
   - После того как закончите задание нужно сделать pull request в ветку `master`

