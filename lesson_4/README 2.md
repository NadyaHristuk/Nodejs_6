


####    MongoDriver
   MongoDB Native  -https://github.com/mongodb/node-mongodb-native
   
   Mongoose https://www.npmjs.com/package/mongoose
   
#### Для чего нужно и не нужно использовать?
       Сильные стороны MongoDB
            - Большие объемы данных
            - Гибкая модель данных (schemeless)
            - Простота
          
        Слабые стороны MongoDB
            Нормализация
            
		Так для чего нужно?
            	- Быстрые прототипы
                - Блоги
                - Эксперименты
                - проект на хакатоне

##Установка и начало работы с MongoDB

 Установка и начало работы с MongoDB на Windows - https://metanit.com/nosql/mongodb/1.2.php

c:/mongodb/data/db - создать такие папочки
c:/mongodb/log - mongo.log - тут создать этот файл для логов

Запускаем по Виндой от имени администратора терминал - в папке mongodb 

mongod --directoryperdb --dbpath c:\mongodb\data\db --logpath c:\mongodb\log\mongo.log --logappend --rest --install

И нажать - Enter

И теперь можно проверить работает ли наша Монга - введя в консоли - net start MongoDB
				

## Express mongodb

Простая разработка приложений на Node.js и MongoDB с помощью Mongoose
Node.js и MongoDB  -- это пара, каждый из которой создан друг для друга. Умение использовать JSON сверх меры и JavaScript делают разработку очень простой. 

CRUD это то, что необходимо для большинства разрабатываемых приложений. Ведь информацию нужно постоянно создавать, читать, редактировать и удалять.

Сегодня мы разберем примеры кода для обработки операций CRUD в приложении, использующем Node.js, ExpressJS и MongoDB. Воспользуемся популярным Node-пакетом, mongoose .

Эти примеры кода использовались для создания Node.js RESTful API , так как при создании API необходимо использование операций CRUD. Для того, чтобы увидеть эти команды в действии, прочитайте этот пост. Эта статья есть нечто большее, чем ссылка на различные команды и способы их использования.

#### Что такое Mongoose?

mongoose -- пакет объектного моделирования для Node, который в основном работает как ORM, которые вы можете встретить в других языках (вроде Eloquent for Laravel).

Mongoose позволяет нам обращаться к MongoDB с помощью команд CRUD просто и легко. Для использования mongoose добавьте ее в свой Node-проект следующей командой:

`$ npm i mongoose`

Теперь, когда пакет установлен, просто прикрепите его к проекту:

`const mongoose = require('mongoose');`

Также необходимо подключиться к MongoDB (локальной или внешней):

`mongoose.connect('mongodb://aaa:1235@ds241489.mlab.com:41489/test_base');`

Переходим к командам.

##### Определение модели

Перед тем, как работать с CRUD-операциями, нам необходима mongoose-модель. Эти модели -- это конструкторы, которые мы определяем. Они представляют (схематически) документы, которые могут быь сохранены и извлечены из БД. 

##### Mongoose схема.
mongoose схема -- это то, что используется для определения атрибутов для наших документов.

Mongoose методы. Методы могут также быть определены в mongoose схеме.

##### Пример модели для Users

```javascript
// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: Boolean,
  location: String,
  meta: {
    age: Number,
    website: String
  },
  created_at: Date,
  updated_at: Date
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
```

Здесь рассмотрено, как схема определяется. Надо сначала прикрутить  mongoose и mongoose.Schema. Затем мы можем определить атрибуты в нашей userSchema для всего, что необходимо в профиле нашего юзера  user. Также заметьте, как можно определить вложенные объекты как в атрибуте meta.

Разрешенные типы данных SchemaTypes:
·         String
·         Number
·         Date
·         Buffer
·         Boolean
·         Mixed
·         ObjectId
·         Array

Затем создадим mongoose модель вызовом mongoose.model. Также можно создать специальные методы. Удобное, кстати, место для создания метода  хэширования пароля 

#### Пользовательский метод

```javascript
// grab the things we need
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a schema
const userSchema ...

// custom method to add string to end of name
// you can create more important methods like name validations or formatting
// you can also do queries and find similar users 
userSchema.methods.dudify = function() {
  // add some stuff to the users name
  this.name = this.name + '-dude'; 

  return this.name;
};

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
```

##ПРИМЕР ИСПОЛЬЗОВАНИЯ

ТЕПЕРЬ У НАС ЕСТЬ ПОЛЬЗОВАТЕЛЬСКАЯ МОДЕЛЬ И МЕТОД, КОТОРЫЙ МОЖНО ВЫЗВАТЬ В КОДЕ:

```javascript
// if our user.js file is at app/models/user.js
var User = require('./app/models/user');
  
// create a new user called chris
var chris = new User({
  name: 'Chris',
  username: 'sevilayha',
  password: 'password' 
});

// call the custom method. this will just add -dude to his name
// user will now be Chris-dude
chris.dudify(function(err, name) {
  if (err) throw err;

  console.log('Your new name is ' + name);
});

// call the built-in save method to save to the database
chris.save(function(err) {
  if (err) throw err;

  console.log('User saved successfully!');
});
```

Это бесполезный пользовательский метод, но мысль в том, чтобы научиться создавать пользовательские методы и использовать их. Эту методику можно использовать для того, чтобы убедиться, что пароль hashed перед сохранением, для сравнения паролей, найти пользователей со сходными атрибутами и т. д.

###Выполнение функции перед сохранением

Допустим, мы хотим иметь переменную created_at для фиксации времени создания записи. Можно использовать схему Schema pre метод для того, чтобы некоторые операции были выполнены перед сохранением объекта.

Ниже приведен код, который необходимо добавить к нашей схеме для того, чтобы сохранялась дата в переменной created_at при первом сохранении, и в updated_at при каждом последующем:

```javascript
// on every save, add the date
userSchema.pre('save', function(next) {
  // get the current date
   currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

```
Теперь при каждом сохранении будет добавляться дата. Также это отличное место для хэширования паролей и проверки, не введен ли простой текст.

Мы также можем определить еще некоторые вещи в схемах и моделях, такие как статика и индексы. Для дополнительной информации -- mongoose docs.

### Создание

Мы будем использовать метод User, созданный ранее. Встроенный в модели mongoose save метод используется для создания user:

```javascript
// grab the user model
var User = require('./app/models/user');

// create a new user
var newUser = User({
  name: 'Peter Quill', //req.body.name
  username: 'starlord55',//req.body.username
  password: 'password',//req.body.password
  admin: true
});

// save the user
newUser.save(function(err) {
  if (err) throw err;

  console.log('User created!');
});

```


### Чтение

Может быть много причин для запроса базы данных пользователей (users). Может понадобиться отдельный пользователь, группа похожих пользователей, все пользователи и другие разные сценарии. Ниже несколько примеров:

```javascript
Find all (найти все)
// get all the users
User.find({}, function(err, users) {
  if (err) throw err;

  // object of all the users
  console.log(users);
});
//Find one (найти один)
// get the user starlord55
User.find({ username: 'starlord55' }, function(err, user) {
  if (err) throw err;

  // object of the user
  console.log(user);
});

//Find by ID (Найти по ID)
// get a user with ID of 1
User.findById(1, function(err, user) {
  if (err) throw err;

  // show the one user
  console.log(user);
});
```

### Запросы

**Можно также пользоваться синтаксисом MongoDB query** 

```javascript
// get any admin that was created in the past month

// get the date 1 month ago
let monthAgo = new Date();
monthAgo.setMonth(monthAgo.getMonth() - 1);

User.find({ admin: true }).where('created_at').gt(monthAgo).exec(function(err, users) {
  if (err) throw err;

  // show the admins in the past month
  console.log(users);
});
```

#### Редактирование (обновление)

Здесь мы будем находить отдельного пользователя, изменять некоторые атрибуты и затем сохранять.

Получить пользователя, затем обновить

```javascript
// get a user with ID of 1
User.findById(1, function(err, user) {
  if (err) throw err;

  // change the users location
  user.location = 'uk';

  // save the user
  user.save(function(err) {
    if (err) throw err;

    console.log('User successfully updated!');
  });
});
```

Следует помнить, что мы создали функцию для изменения updated_at даты, это будет также происходить при сохранении save.

**Найти и обновить**

Есть более простой метод, в котором нет необходимости извлекать пользователя, модифицировать и затем сохранять. Можно простоприменить mongodb команду findAndModify.

```javascript
// find the user starlord55
// update him to starlord 88
User.findOneAndUpdate({ username: 'starlord55' }, { username: 'starlord88' }, (err, user)=> {
  if (err) throw err;

  // we have the updated user returned to us
  console.log(user);
});
```

**Найти по ID и обновить**

```javascript
// find the user with id 4
// update username to starlord 88
User.findByIdAndUpdate(4, { username: 'starlord88' }, (err, user) => {
  if (err) throw err;

  // we have the updated user returned to us
  console.log(user);
});
```


### Удаление

**Получить USER, потом удалить**

```javascript
// get the user starlord55
User.find({ username: 'starlord55' }, (err, user) =>{
  if (err) throw err;

  // delete him
  user.remove(function(err) {
    if (err) throw err;

    console.log('User successfully deleted!');
  });
});
```

**Найти и удалить**

```javascript
// find the user with id 4
User.findOneAndRemove({ username: 'starlord55' }, (err) => {
  if (err) throw err;

  // we have deleted the user
  console.log('User deleted!');
});
```
**Найти по ID и удалить**

```javascript
// find the user with id 4
User.findByIdAndRemove(4, (err) =>{
  if (err) throw err;

  // we have deleted the user
  console.log('User deleted!');
});
```

---

## Node.js и PostgreSQL

Для простоты мы будем использовать SQL в следующем примере. Мой выбор — PostgreSQL.

Чтобы запустить PostgreSQL, вам необходимо установить его на свой компьютер. Если вы используете Mac, вы можете использовать Homebrew для установки PostgreSQL. В противном случае, если вы работаете в Linux, вы можете установить его с помощью своего диспетчера пакетов.

![](NodeHeroEbook-TheComplete-010.png)

Для получения дополнительной информации ознакомьтесь с этим отличным [руководством](http://www.techrepublic.com/blog/diy-it-guy/diy-a-postgresql-database-server-setup-anyone-can-handle/) по началу работы с вашей первой базой данных.

Если вы планируете использовать инструмент для просмотра базы данных, я бы рекомендовал утилиту для командной строки — `psql`. Она поставляется вместе с сервером PostgreSQL. Вот небольшая [инструкция](http://www.postgresonline.com/downloads/special_feature/postgresql83_psql_cheatsheet.pdf), которая пригодится, если вы начнёте использовать `psql`.

Если вам не нравится интерфейс командной строки, вы можете использовать [pgAdmin](https://www.pgadmin.org/), который является инструментом с открытым исходным кодом и предназначен для администрирования PostgreSQL.

Обратите внимание, что SQL — это сам по себе язык программирования. Мы не будем рассматривать все его возможности, а только наиболее простые. Если вам потребуется глубже изучить SQL, то в интернете есть много отличных онлайн-курсов, охватывающих все основы [PostgreSQL](https://www.pluralsight.com/courses/postgresql-getting-started).

## Взаимодействие Node.js с базой данных

Во-первых, мы должны создать базу данных, которую мы будем использовать. Для этого введите следующую команду в терминал: `createdb node_hero`.

Затем мы должны создать таблицу для наших пользователей.

```sql
CREATE TABLE users(
  name VARCHAR(20),
  age SMALLINT
);
```

Наконец, мы можем вернуться к программированию. Вот как вы можете взаимодействовать с вашей базой данных через вашу программу на Node.js:

```javascript
'use strict'

const pg = require('pg')
const conString = 'postgres://username:password@ localhost/node_hero' // Убедитесь, что вы указали данные от вашей базы данных

pg.connect(conString, function (err, client, done) {
  if (err) {
    return console.error('error fetching client from pool', err)
  }
  client.query('SELECT $1::varchar AS my_first_query', ['node hero'], function (err, result) {
    done()

    if (err) {
      return console.error('error happened during query', err)
    }
    console.log(result.rows[0])
    process.exit(0)
  })
})
```

Это был простой пример — "hello world" в PostgreSQL. Обратите внимание, что первым параметром является строка, которая является нашей SQL-командой, второй параметр представляет собой массив значений, которыми мы хотели бы параметризовать наш запрос.

Большой ошибкой с точки зрения безопасности был бы ввод данных, пришедших от пользователя, в том виде, в котором они были переданы. Приведённая выше функция `client.query` защищает вас от SQL-инъекций, являющихся распространённым видом атаки, когда злоумышленник пытается внедрить в запрос произвольный SQL-код. Всегда учитывайте это при создании любого приложения, в котором возможен ввод данных со стороны пользователя. Чтобы узнать больше, ознакомьтесь с нашим [контрольным списком безопасности Node.js-приложений](https://blog.risingstack.com/node-js-security-checklist/).

*Примечание переводчика: обычно никто не пишет SQL-запросы руками, вместо этого используют так называемые конструкторы запросов (query builder), например [sequelize](http://docs.sequelizejs.com/) и [knex](http://knexjs.org/).*

Давайте продолжим наш предыдущий пример.

```javascript
app.post('/users', function (req, res, next) {
  const user = req.body

  pg.connect(conString, function (err, client, done) {
    if (err) {
      // Передача ошибки в обработчик express
      return next(err)
    }
    client.query('INSERT INTO users (name, age) VALUES ($1, $2);', [user.name, user.age], function (err, result) {
      done() // Этот коллбек сигнализирует драйверу pg, что соединение может быть закрыто или возвращено в пул соединений
      if (err) {
        // Передача ошибки в обработчик express
        return next(err)
      }
      res.send(200)
    })
  })
})
```

Достижение разблокировано: пользователь сохранён в базе данных! :) Теперь давайте попробуем прочитать эти данные. Затем добавим в наше приложение новый роут для поиска пользователей.

```javascript
app.get('/users', function (req, res, next {
  pg.connect(conString, function (err, client, done) {
    if (err) {
      // Передача ошибки в обработчик express
      return next(err)
    }
    client.query('SELECT name, age FROM users;', [], function (err, result) {
      done()
      if (err) {
        // Передача ошибки в обработчик express
        return next(err)
      }
      res.json(result.rows)
    })
  })
})
```

## Это было не так сложно, не так ли?

Теперь вы можете запустить любой сложный SQL-запрос, который вы только сможете вообразить, в вашем Node.js-приложении.

>  *С помощью этой техники вы можете постоянно хранить данные в своём приложении, а благодаря трудолюбивой команде разработчиков модуля node-postgres это проще простого.*

Мы рассмотрели все основы, которые вы должны знать об использовании баз данных в Node.js. Теперь попробуйте создать что-то самостоятельно.

---

## “Работа с нереляционными БД” (на примере MongoDB)

```js
 use test
```
Теперь в качестве текущей будет установлена БД test.

Если мы хотим узнать, какая бд используется в текущей момент, то мы можем воспользоваться командой db:
```js
db
==> test
```
Используя команду ```db.stats()```, можно получить статистику по текущей базе данных
статистику по коллекции users: ```db.users.stats()```

### Для добавления в коллекцию могут использоваться три ее метода:
- ```insertOne()```: добавляет один документ
- ```insertMany()```: добавляет несколько документов
- ```insert()```: может добавлять как один, так и несколько документов
```js
db.cats.insertOne({name: 'barsik', age: 3, characteristics: ['гадит в тапки', 'дает себя гладить', 'рябой']})
```
Некоторые ограничения при использовании имен ключей:
1. Символ ```$``` не может быть первым символом в имени ключа
2. Имя ключа не может содержать символ точки .
3. Имя ```_id``` не рекомендуется использовать
```js
db.cats.insertMany([{name: 'Lama', age: 2, characteristics: ['гадит в лоток', 'не дает себя гладить', 'серый']}, {name: 'Liza', age: 4, characteristics: ['гадит в лоток', 'дает себя гладить', 'белый']}])

db.cats.insert([{name: 'Boris', age: 12, characteristics: ['гадит в лоток', 'не дает себя гладить', 'серый']}, {name: 'Murzik', age: 1, characteristics: ['гадит в лоток', 'дает себя гладить', 'черный']}])
```
### Для вывода документов в более удобном наглядном представлении мы можем добавить вызов метода ```pretty()```:
```js
db.cats.find().pretty()

db.cats.find({age: {$lte: 3}, characteristics: 'дает себя гладить'}).pretty()
```
### Проекция:
```js
db.cats.find({age: {$lte: 3}, characteristics: 'дает себя гладить'}, {name: 0}).pretty()

db.cats.find({age: {$lte: 3}, characteristics: 'дает себя гладить'}, {name: 1, age: 1}).pretty()
```
### Запрос к вложенным объектам
```js
db.cats.insert({name: 'Dariy', age: 10, characteristics: ['гадит в лоток', 'не дает себя гладить', 'серый'], owners: {name: 'Nata', age: 23, adress: 'Poltava'}})

db.cats.find({'owners.name': 'Nata'})
```
### Настройка запросов и сортировка:
```js
db.cats.find().limit(3) - первые три
db.cats.find().skip(3) - пропустить первые три
db.cats.find().sort({name: 1}) 

db.cats.findOne({age: {$lte: 3}})
```
### Курсоры
Результат выборки, получаемой с помощью функции ```find```, называется курсором
Курсоры инкапсулируют в себе наборы получаемых из бд объектов. Используя синтаксис языка javascript и методы курсоров, мы можем вывести полученные документы на экран и как-то их обработать. 
```js
var cursor = db.cats.find();
while(cursor.hasNext()){
	obj = cursor.next();
	print(obj["name"]);
}
```
### С помощью функции count() можно получить число элементов в коллекции:
```js
db.cats.count()
db.cats.find({age: {$lte: 3}}).count()
```

### В MongoDB в запросах можно использовать условные конструкции с помощью операторов сравнения:

- ```$eq``` - (равно)
- ```$gt``` - (больше чем)
- ```$lt``` - (меньше чем)
- ```$gte``` - (больше или равно)
- ```$lte``` - (меньше или равно)
```js
db.cats.find ({age: {$lte: 10, $gte:2}})
```
### Поиск по массивам и операторы ```$in, $nin, $all```
Оператор ```$in``` определяет массив возможных выражений и ищет те ключи, значение которых имеется в массиве:
```js
db.cats.find({age: {$in : [2, 10]}})
```
Противоположным образом действует оператор ```$nin``` - он определяет массив возможных выражений и ищет те ключи, значение которых отсутствует в этом массиве
```js
db.cats.find({age: {$nin : [2, 10]}})
```
Оператор ```$all``` похож на ```$in```: он также определяет массив возможных выражений, но требует, чтобы документы имели весь определяемый набор выражений. 
```js
db.cats.find ({"characteristics": {$all : ["гадит в лоток", "дает себя гладить"]}})
```

#### Оператор ```$size```
Оператор ```$size``` используется для нахождения документов, в которых массивы имеют число элементов, равным значению ```$size```. 
```js
db.cats.find({"characteristics": {$size:3}})
```
#### Оператор ```$exists```
Оператор ```$exists``` позволяет извлечь только те документы, в которых определенный ключ присутствует или отсутствует. 
```js
db.cats.find({owners: {$exists:true}})
```
#### Оператор ```$type```
Оператор ```$type``` извлекает только те документы, в которых определенный ключ имеет значение определенного типа, например, строку или число
```js
db.cats.find({age: {$type:"number"}})
```

#### Оператор ```$regex```
Оператор ```$regex``` задает регулярное выражение, которому должно соответствовать значение поля.
```js 
db.cats.find({name: {$regex:"L"}})
```

#### Оператор ```$or```
```js
db.cats.find({$or: [{name: {$regex:"L"}}, {age: {$lte: 3}}]})
```
#### Оператор ```$and```
```js
db.cats.find({$and: [{name: {$regex:"L"}}, {age: {$lte: 3}}]})
```

### Метод save
В этот документ в качестве поля можно передать параметр ```_id```. Если метод находит документ с таким значением ```_id```, то документ обновляется. Если же с подобным ```_id``` нет документов, то документ вставляется.
```js
db.cats.save({"_id": ObjectId("5a571b186a51cf10a4383303"), name: "Bars", age: 3})
```
### Метод update
Более детальную настройку при обновлении предлагает функция update. Она принимает три параметра:

1. ```query```: принимает запрос на выборку документа, который надо обновить
2. ```objNew```: представляет документ с новой информацией, который заместит старый при обновлении

3. ```options```: определяет дополнительные параметры при обновлении документов. Может принимать два аргумента: ```upsert``` и ```multi```.

Если параметр ```upsert``` имеет значение true, что mongodb будет обновлять документ, если он найден, и создавать новый, если такого документа нет. Если же он имеет значение false, то mongodb не будет создавать новый документ, если запрос на выборку не найдет ни одного документа.

Параметр ```multi``` указывает, должен ли обновляться первый элемент в выборке (используется по умолчанию, если данный параметр не указан) или же должны обновляться все документы в выборке.
```js
db.cats.update({name : "Bars"}, {name: "Tom", age : 5}, {upsert: true})
```
оператор ```$set``` - если документ не содержит обновляемое поле, то оно создается
```js
db.cats.update({name : "Tom"}, {$set: {characteristics: ['гадит в лоток', 'не дает себя гладить', 'серый']}})
```
Указав значение ```multi:true```, мы можем обновить все документы выборки
```js
{multi:true}
```
Для удаления отдельного ключа используется оператор ```$unset```:
```js
db.cats.update({name : "Tom"}, {$unset: {age: 1}})
```

### Метод updateOne и updateMany
Метод ```updateOne``` похож на метод ```update``` за тем исключением, что он обновляет только один документ.
Если необходимо обновить все документы, соответствующие некоторому критерию, то применяется метод ```updateMany()```:

### Массивы

#### Оператор ```$push```
```js
db.cats.updateOne({name : "Tom"}, {$push: {characteristics: "вонюч"}})
db.cats.updateOne({name : "Tom"}, {$push: {characteristics: {$each: ["храпит", "злой"]}}})
```

#### Оператор ```$addToSet```
Оператор ```$addToSet``` подобно оператору ```$push``` добавляет объекты в массив. Отличие состоит в том, что ```$addToSet``` добавляет данные, если их еще нет в массиве:
```js
db.cats.update({name : "Lama"}, {$addToSet: {characteristics: "безумен"}})
```
#### Оператор ```$pop``` 
Позволяет удалять элемент из массива:
```js
db.cats.update({name : "Tom"}, {$pop: {characteristics: 1}})
```
> 1 конец массива
> -1 начало массива

#### Оператор ```$pull ```
Удаляет по значению
```js
db.cats.update({name : "Tom"}, {$pull: {characteristics: "серый"}})
```
#### Оператор ```$pullAll```
А если мы хотим удалить не одно значение, а сразу несколько, тогда мы можем:
```js
db.cats.update({name : "Tom"}, {$pullAll: {characteristics: ["не дает себя гладить", "вонюч", "храпит"]}})
```

### Удаление

Для удаления документов в MongoDB предусмотрен метод ```remove```:
```js
db.cats.remove({name : "Tom"})
db.cats.remove({name : "Tom"}, true) - once
db.cats.remove({name : "Tom"}, false) - default multi 
```