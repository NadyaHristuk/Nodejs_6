# Модели и контроллеры в Express

Мы уже вынесли всю работу с базой из файла server.js. Теперь мы можем реализовывать контроллеры и модели. Они позволят нам разделить логику приложения на правильные части.

В моделях мы будет хранить все методы, которые взаимодействуют с базой. Например мы можем описать модель Track, Artist, Playlist. В нашем случае мы создадим модель Artist у которой будут методы all, findById, add, update, delete.

Давайте добавим папку models и создадим в ней artists.

Добавим метод all, который будет принимать callback, находить в базе записи и возвращать в callback в виде err и docs. Этот метод не знает ничего про сервер, роутинг и API. Он работает только с базой и в коллбек отдает данные. Что это за callback ему без разницы.

```
var db = require('../db');

exports.all = function (cb) {
db.get().collection('artists').find().toArray(function (err, docs) {
cb(err, docs);
})
}
```

Теперь давайте добавим папку controllers и файл artists. Давайте добавим метод all, который будет получать функцию с req, res и отдавать данные.

```
var Artists = require('../models/artists');

exports.all = function (req, res) {
Artists.all(function (err, docs) {
if (err) {
console.log(err);
return res.sendStatus(500);
}
res.send(docs);
})
}
```

Мы импортируем в контроллер нашу модель и описываем метод all, который принимает аргументы req, res и вызывает метод модели all. Как вы видите контроллер отвечает за работу с реквестом и респонзом, но он ничего не знает о базе данных и откуда берутся данные. Это очень хорошо, так как позволяет в модели брать данные откуда угодно, не меняя при этом все приложение.

Теперь нам осталось импортировать наш контроллер в index.js

```
var artistsController = require('./controllers/artists');
app.get('/artists', artistsController.all)
```

Теперь мы можем упростить наш роутинг до вызова метода контроллера.

Давайте точно так же порефакторим оставшиеся методы.

Добавим метод findById и импортируем ObjectID так он нам нужен здесь.

```
var ObjectID = require('mongodb').ObjectID

exports.findById = function (id, cb) {
db.get().collection('artists').findOne({ \_id: ObjectID(id) }, function (err, doc) {
cb(err, doc);
})
}
```

На вход мы принимаем id и коллбек. Точно так же как и в предыдущем случае мы работаем только с данными о request, response модель ничего не знает.

Добавляем метод к контроллеру

```
exports.findById = function (req, res) {
Artists.findById(req.params.id, function (err, doc) {
if (err) {
console.log(err);
return res.sendStatus(500);
}
res.send(doc);
})
}
```

Вызываем метод из модели и передаем id и коллбек на вход.

В index.js сокращаем вызов до

```
app.get('/artists/:id', artistsController.findById)
```

Теперь рефакторим создание исполнителей

Добавим метод create в модель

```
exports.create = function (artist, cb) {
db.get().collection('artists').insert(artist, function (err, result) {
cb(err, result);
})
}
```

и метод create в контроллер

```
exports.create = function (req, res) {
var artist = {
name: req.body.name
};
Artists.create(artist, function (err) {
if (err) {
console.log(err);
return res.sendStatus(500);
}
res.send(artist);
})
}
```

Вызовем в index.js artistsController.create

```
app.post('/artists', artistsController.create)
```

Давайте проверим, что post по прежнему работает.

Теперь рефакторим put

```
exports.update = function (id, newData, cb) {
db.get().collection('artists').updateOne(
{ \_id: ObjectID(id) },
newData,
function (err, result) {
cb(err, result);
}
)
}
```

Создаем метод update, который принимает id и новые данные

```
exports.update = function (req, res) {
var newData = {
name: req.body.name
}
Artists.update(req.params.id, newData, function (err) {
if (err) {
console.log(err);
return res.sendStatus(500);
}
res.sendStatus(200);
})
}
```

Описываем метод в контроллере и вызываем в роуте update

```
app.put('/artists/:id', artistsController.update)
```

И нам осталось поменять только delete метод

```
exports.delete = function (req, res) {
Artists.delete(req.params.id, function (err) {
if (err) {
console.log(err);
return res.sendStatus(500);
}
res.sendStatus(200);
})
}
app.delete('/artists/:id', artistsController.delete)
```

Зарефакторили весь наш проект разбим код по логическим частям. Наш сервер сейчас очень чистый, так как всю логику мы из него вынесли. Такая структура проекта очень легко скейлится. Вы можете добавлять новые модели и контроллеры в API соблюдая такую же структуру.

Если у вас возникли какие-то вопросы или комментарии, пишите их прямо под этим видео.
