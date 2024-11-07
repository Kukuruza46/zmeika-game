скачать, открыть докер
docker build -t zmeika-game .
docker run -d -p 5173:5173 zmeika-game
далее перейти на http://localhost:5173/

Если докер не открывать:
npm install
npm run dev
открыть http://localhost:5173/ 
