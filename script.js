const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d'); // Получаем контекст для рисования

const scale = 20; // Размер клетки
const rows = canvas.height / scale; // Количество рядов (по высоте)
const columns = canvas.width / scale; // Количество столбцов (по ширине)

let snake; // Переменная для змейки
let fruit; // Переменная для еды
let direction; // Переменная для направления движения змейки

// Инициализация игры
(function setup() {
    snake = new Snake(); // Создаем змейку
    fruit = new Fruit(); // Создаем еду
    direction = "right"; // Начальное направление (вправо)
    window.addEventListener("keydown", changeDirection); // Слушаем нажатия клавиш
    window.setInterval(gameLoop, 1000 / 10); // Запускаем игровой цикл с частотой 10 кадров в секунду
})();

// Главный игровой цикл
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очистка экрана

    snake.update(); // Обновление состояния змейки
    snake.draw(); // Отображение змейки

    fruit.draw(); // Отображение еды

    if (snake.eat(fruit)) { // Если змейка съела еду
        fruit = new Fruit(); // Создаём новую еду
    }

    if (snake.collide()) { // Если змейка столкнулась с собой или границей
        alert('Game Over!'); // Сообщение о конце игры
        snake = new Snake(); // Перезапуск змейки
    }
}

// Класс для змейки
function Snake() {
    this.snakeArray = [{ x: 5, y: 5 }]; // Начальная позиция змейки
    this.length = 4; // Длина змейки

    // Обновление состоянии змейки
    this.update = function () {
        let head = this.snakeArray[this.snakeArray.length - 1];

        let newHead;
        if (direction === 'right') {
            newHead = { x: head.x + 1, y: head.y };
        } else if (direction === 'left') {
            newHead = { x: head.x - 1, y: head.y };
        } else if (direction === 'up') {
            newHead = { x: head.x, y: head.y - 1};
        } else if (direction === 'down') {
            newHead = { x: head.x, y: head.y + 1};
        }

        this.snakeArray.push(newHead); // Добавляем новую голову в змейку
        if (this.snakeArray.length > this.length) {
            this.snakeArray.shift(); // Убираем хвост, если змейка не растет
        }
    };

    // Рисование змейки
    this.draw = function () {
        for (let i = 0; i < this.snakeArray.length; i++) {
            let part = this.snakeArray[i];
            ctx.fillStyle = i === this.snakeArray.length - 1 ? "green" : "white"; // Зеленая голова
            ctx.fillRect(part.x * scale, part.y * scale, scale, scale); // Рисуем каждый сегмент
        }
    };

    // Проверка, съела ли змейка еду
    this.eat = function (fruit) {
        let head = this.snakeArray[this.snakeArray.length - 1];
        if (head.x === fruit.x && head.y === fruit.y) {
            this.length++; // Увеличиваем длину змейки
            return true;
        }
        return false;
    };

    // Проверка на столкновение
    this.collide = function () {
        let head = this.snakeArray[this.snakeArray.length - 1];
        // Столкновение с границей
        if (head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows) {
            return true;
        }
        // Столкновение с самим собой
        for (let i = 0; i < this.snakeArray.length - 1; i++) {
            if (this.snakeArray[i].x === head.x && this.snakeArray[i].y === head.y) {
                return true;
            }
        }
        return false;
    };
}

// Класс для еды
function Fruit() {
    this.x = Math.floor(Math.random() * columns); // Случайная позиция по горизонтали
    this.y = Math.floor(Math.random() * rows); // Случайная позиция по вертикали

    // Рисование еды
    this.draw = function () {
        ctx.fillStyle = "red"; // Красный цвет для еды
        ctx.fillRect(this.x * scale, this.y * scale, scale, scale); // Рисуем еду
    };
}

// Изменения направления змейки
function changeDirection(event) {
    if (event.keyCode === 37 && direction !== 'right') {
        direction = 'left';
    } else if (event.keyCode === 38 && direction !== 'down') {
        direction = 'up';
    } else if (event.keyCode === 39 && direction !== 'left') {
        direction = 'right';
    } else if (event.keyCode === 40 && direction !== 'up') {
        direction = 'down';
    }
}