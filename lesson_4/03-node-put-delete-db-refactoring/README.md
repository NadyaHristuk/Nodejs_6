# Рефактор работы с Mongoclient

put метод.

```
app.put('/artists/:id', function (req, res) {
db.collection('artists').updateOne(
{ \_id: ObjectID(req.params.id) },
{ name: req.body.name },
function (err, result) {
if (err) {
console.log(err);
return res.sendStatus(500);
}
res.sendStatus(200);
})
})
```

Здесь мы вызываем updateOne на коллекцию исполнителей. Первым аргументом идет обьект с полями, по которым мы ищем елемент, который хотим обновить. Вторым аргументом идет обьект данных, которые мы хотим обновить и третьим идет callback, где мы проверяем успешно ли мы обновили запись и если все хорошо, то возвращаем статус 200.

Delete реализовывается по тому же принципу

```
app.delete('/artists/:id', function (req, res) {
db.collection('artists').deleteOne(
{ \_id: ObjectID(req.params.id) },
function (err, result) {
if (err) {
console.log(err);
return res.sendStatus(500);
}
res.sendStatus(200);
})
})
```

Здесь мы применяем deleteOne на коллекцию. Первым аргументом идет обьект с полями по которым мы ищем елемент, а вторым callback, где мы возвращаем success или error.

Мы закончили с вами реализацию API на nodejs, но у нас сервер уже занимает 100 строчек и чем больше мы будем реализовывать, тем сложнее его будет поддерживать. Давайте разобьем его на несколько файлов.

Для начала мы можем вынести работу с базой данных в отдельный файл. Мы хотим, чтобы мы могли работать с базой из любого файла написав

```
var db = require('./db');
```

Давайте создадим новый файл db.js и реализуем обетку вокруг метода connect. Мы хотим, чтобы он работал так же как и раньше, но сохранял в локальную переменную db. Также мы хотим, чтобы connect был синглтоном, если коннект к базе у нас уже есть, то мы не открываем еще один коннект а возвращаем существующий.

```
var MongoClient = require('mongodb').MongoClient;

var state = {
db: null
};

exports.connect = function (url, done) {
if (state.db) {
return done();
}

MongoClient.connect(url, function (err, db) {
if (err) {
return done(err);
}
state.db = db;
done()
});
}
```

Теперь давайте заменим код коннекта в index.js на нашу реализацию.

```
var db = require('./db');
db.connect('mongodb://localhost:27017/api', function (err, database) {
if (err) {
return console.log(err);
}
app.listen(3012, function () {
console.log('API app started');
})
})
```

Мы убрали весь код, который записывал базу данных в переменную и саму переменную из index.js. Наш код стал немного чище.

Если мы перезапустим сейчас наш сервер, то connect будет работать правильно, но db.collection будет бросать ошибку, так как такого метода у нас нет. Давайте добавим метод get, который будет возвращать db, с которой мы сможем работать.

```
exports.get = function () {
return state.db;
}
```

Теперь все места, где мы используем db.collection нам нужно заменить на db.get().collection.

```
db.get().collection('artists')
```
