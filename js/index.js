// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления
const minWeightInput = document.querySelector('.minweight__input'); // поле с минимальным весом
const maxWeightInput = document.querySelector('.maxweight__input'); // поле с максимальным весом

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  // TODO: очищаем fruitsList от вложенных элементов,
  // чтобы заполнить актуальными данными из fruits
  fruitsList.innerHTML = '';

  for (let i = 0; i < fruits.length; i++) {
    // TODO: формируем новый элемент <li> при помощи document.createElement,
    // и добавляем в конец списка fruitsList при помощи document.appendChild
    const newElementList = document.createElement('li');
    const classColor = getClassColor(fruits[i].color);

    newElementList.className = `fruit__item ${classColor}`;
    newElementList.innerHTML = `<div class="fruit__info">
        <div>index: ${i}</div>
        <div>kind: ${fruits[i].kind}</div>
        <div>color: ${fruits[i].color}</div>
        <div>weight (кг): ${fruits[i].weight}</div>
      </div>`;

    fruitsList.appendChild(newElementList);
  }
};

// получение стиля для цвета
const getClassColor = (color) => {
  switch (color) {
    case 'фиолетовый':
      return 'fruit_violet';

    case 'зеленый':
    case 'зелёный':
      return 'fruit_green';

    case 'розово-красный':
    case 'розовый':
      return 'fruit_carmazin';

    case 'желтый':
    case 'жёлтый':
      return 'fruit_yellow';

    case 'светло-коричневый':
    case 'коричневый':
      return 'fruit_lightbrown';

    case 'красный':
      return 'fruit_red';

    case 'синий':
    case 'голубой':
    case 'светло-синий':
      return 'fruit_blue';

    case 'черный':
    case 'чёрный':
      return 'fruit_black';

    case 'белый':
      return 'fruit_white';

    case 'оранжевый':
      return 'fruit_orange';

    default:
      return 'fruit_violet';
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];
  let i = 0;
  let randomArr = [];
  let arr = [];

  // ATTENTION: сейчас при клике вы запустите бесконечный цикл и браузер зависнет
  while (fruits.length > 0) {
    // TODO: допишите функцию перемешивания массива
    //
    // Подсказка: находим случайный элемент из fruits, используя getRandomInt
    // вырезаем его из fruits и вставляем в result.
    // ex.: [1, 2, 3], [] => [1, 3], [2] => [3], [2, 1] => [], [2, 1, 3]
    // (массив fruits будет уменьшатся, а result заполняться)
    let j = getRandomInt(0, fruits.length - 1);
    randomArr[i] = j;
    result[i] = fruits[j];
    fruits.splice(j, 1);
    arr[i] = 0;
    i++;
  }

  fruits = result;

  // Проверяем, перемешались данные или нет
  if (isNotShuffleFruits(arr, randomArr)) {
    alert('Данные не перемешались');
  }
};

let isNotShuffleFruits = (arr1, arr2) => {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  const minWeight = minWeightInput.value !== '' ? parseFloat(minWeightInput.value) : 0;
  const maxWeight = parseFloat(maxWeightInput.value);

  if (minWeight > maxWeight || isNaN(minWeight) || isNaN(maxWeight)) {
    fruits = JSON.parse(fruitsJSON);
  } else {
    const result = fruits.filter((item) => {
      const weight = item.weight;
      return weight >= minWeight && weight <= maxWeight;
    });

    fruits = result;
  }
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  return parseInt(a, 16) > parseInt(b, 16);
};

// функция перемещения элементов
const swap = (arr, firstIndex, secondIndex) => {
  const temp = arr[firstIndex];
  arr[firstIndex] = arr[secondIndex];
  arr[secondIndex] = temp;
};

const partition = (arr, left, right, comparation) => {
  let indexPivot = Math.floor((right + left) / 2);
  let pivot = getColorHex(rgb(arr[indexPivot].color));
  let i = left;
  let j = right;

  while (i <= j) {
    let colorI = getColorHex(rgb(arr[i].color));
    let colorJ = getColorHex(rgb(arr[j].color));

    while (comparation(pivot, colorI)) {
      i++;
      colorI = getColorHex(rgb(arr[i].color));
    }

    while (comparation(colorJ, pivot)) {
      j--;
      colorJ = getColorHex(rgb(arr[j].color));
    }

    if (i <= j) {
      swap(arr, i, j);
      i++;
      j--;
    }
  }

  return i;
}

const quickSortFunc = (arr, comparation, left, right) => {
  let index;

  if (arr.length > 1) {
    left = (typeof left !== 'number') ? 0 : left;
    right = (typeof right !== 'number') ? arr.length - 1 : right;

    index = partition(arr, left, right, comparation);

    if (left < index - 1) {
      quickSortFunc(arr, comparation, left, index - 1);
    }

    if (index < right) {
      quickSortFunc(arr, comparation, index, right);
    }
  }
}

// получаем цвет из CSS класса в формате rbg
const rgb = (color) => {
  const elem = document.querySelector(`.${getClassColor(color)}`);
  return getComputedStyle(elem).getPropertyValue('background-color');
};

// преобразуем цвет из rgb в hex
// и получаем число в 16-ричной системе исчисления
const getColorHex = (rgb) => { 
  rgb = rgb.match(/^rgb\((\d+), \s*(\d+), \s*(\d+)\)$/); 
  
  function hexCode(i)
  { 
      return ('0' + parseInt(i).toString(16)).slice(-2); 
  } 
  return hexCode(rgb[1]) + hexCode(rgb[2]) + hexCode(rgb[3]); 
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    // TODO: допишите функцию сортировки пузырьком
    const n = arr.length;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - 1 - i; j++) {
        const color1 = getColorHex(rgb(arr[j].color));
        const color2 = getColorHex(rgb(arr[j + 1].color));

        if (comparation(color1, color2)) {
          swap(arr, j + 1, j);
        }
      }
    }
  },

  quickSort(arr, comparation) {
    // TODO: допишите функцию быстрой сортировки
    quickSortFunc(arr, comparation);    
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
    sortTimeLabel.textContent = sortTime;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  // TODO: переключать значение sortKind между 'bubbleSort' / 'quickSort'
  sortKind = sortKind === 'bubbleSort' ? 'quickSort' : 'bubbleSort';
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  // TODO: вывести в sortTimeLabel значение 'sorting...'
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  // TODO: вывести в sortTimeLabel значение sortTime
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  // TODO: создание и добавление нового фрукта в массив fruits
  // необходимые значения берем из kindInput, colorInput, weightInput
  const inputKind = kindInput.value;
  const inputColor = colorInput.value;
  const inputWeight = parseFloat(weightInput.value);

  if (inputKind !== '' && inputColor !== '' && ! isNaN(inputWeight)) {
    let arr = {'kind': inputKind, 'color': inputColor.toLowerCase(), 'weight': inputWeight};
    fruits.push(arr);
    display();

    // очищаем поля ввода
    kindInput.value = '';
    colorInput.value = '';
    weightInput.value = '';
  } else {
    if (inputKind === '') {
      alert('Не заполнено поле kind (Название фрукта).');
    } else if (inputColor === '') {
      alert('Не заполнено поле color (Цвет фрукта).');
    } else if (isNaN(inputWeight)) {
      alert('Не заполнено, либо введено некорректное значение веса. Вес должен быть числом.');
    }
  }
});
