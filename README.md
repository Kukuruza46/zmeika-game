<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

</head>
<body>
  <ol>
    <li>Скачайте или клонируйте проект.</li>
    <li>Откройте терминал (командную строку).</li>
    <li>Соберите Docker-образ с помощью команды:</li>
    <code>docker build -t zmeika-game .</code>
    <li>Запустите контейнер Docker в фоновом режиме и привяжите порт 5173 локальной машины к порту 5173 в контейнере:</li>
    <code>docker run -d -p 5173:5173 zmeika-game</code>
    <li>Откройте веб-браузер и перейдите по адресу:</li>
    <code>http://localhost:5173/</code>
  </ol>
  
  <p>Если приложение не запускается через Docker, выполните следующие действия:</p>
  <ol>
    <li>Убедитесь, что на вашем компьютере установлен Node.js.</li>
    <li>Откройте терминал в корне проекта и выполните команду для установки зависимостей:</li>
    <code>npm install</code>
    <li>Запустите приложение в режиме разработки:</li>
    <code>npm run dev</code>
    <li>После этого откройте веб-браузер и перейдите по адресу:</li>
    <code>http://localhost:5173/</code>
  </ol>
</body>
</html>
