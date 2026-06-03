// щоб потім не шукати кожен раз заново то шукаємо по айді і в змінну
const grid   = document.getElementById('pokemon-grid');   
const prev   = document.getElementById('btn-prev');       
const next   = document.getElementById('btn-next');       
const page   = document.getElementById('page-info');      
const search = document.getElementById('search-input');   
const loader = document.getElementById('loading-indicator');
const error  = document.getElementById('error-message');   
const modal  = document.getElementById('modal-overlay');   
const body   = document.getElementById('modal-body');      

const closeBtn = document.querySelector('#modal-close');  

const LIMIT = 20;      
let offset   = 0;      
let pokemons = [];     
let controller = null; // зберігає поточний запит щоб можна було його скасувати
const cache  = {};     // кеш, щоб не качати повторно

// зберігає тільки рядки тому масив конвертуємо JSON.stringify в рядок JSON.parse в масив
// || [] якщо перший запуск то беремо порожній масив
let favs = JSON.parse(localStorage.getItem('favs')) || [];


// async - всередині можна використовувати await
// await зупиняє виконання і чекає поки запит завершиться
async function load() {
  // якщо попередній запит ще йде то вбиваємо його
  // бо юзер міг швидко клацнути кнопку двічі
  if (controller) controller.abort();
  controller = new AbortController(); //  пульт керування запитом

  loader.classList.remove('hidden'); 
  grid.classList.add('hidden');      
  error.classList.add('hidden');    

  try {
    // GET запит до pokeapi
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`,
      { signal: controller.signal } // прив'язуємо до контролера щоб міг скасуватись
    );

    // res конверт з відповіддю .json() відкриваємо і читаємо 
    // повертає об'єкт
    const data = await res.json();

    // після першого запиту ми отримуємо тільки базову інформацію про покемонів (ім'я і url з деталями)
    // тому для кожного покемона робимо окремий запит за деталями 
    // Promise.all запускає всі 20 запитів паралельно так швидше
    pokemons = await Promise.all(data.results.map(async p => {
      // витягуємо id з кінця url
      const id = p.url.split('/').filter(Boolean).pop();

      // перевіряємо чи є в кеші
      if (cache[id]) return cache[id];

      // якщо в кеші немає качаємо і одразу зберігаємо в кеш
      const detail = await fetch(p.url, { signal: controller.signal });
      return cache[id] = await detail.json(); 
    }));

    render(pokemons); // малюємо картки на сторінці

    page.textContent = `Сторінка ${offset / LIMIT + 1}`; // оновлюємо номер сторінки

    // блокування кнопки назад якщо ми на першій сторінці, інакше розблокування
    prev.disabled = (offset === 0); 
  } catch (err) {
    // ігноруємо бо ми самі скасували через  controller.abort()
    if (err.name !== 'AbortError') error.classList.remove('hidden');
  } finally {
    loader.classList.add('hidden'); //прибираємо лоудер
  }
}

// малювання карток 
function render(list) {
  grid.innerHTML = list.length ? '' : '<p class="status-message">Нічого не знайдено</p>'; // очищуємо сітку або "нічого не знайдено"

  grid.classList.remove('hidden');

  // для кожного покемона створюємо картку
  list.forEach(p => {
    const card = document.createElement('div');

    card.className = `pokemon-card ${favs.includes(p.id) ? 'is-favorite' : ''}`; // перевірка на "улюбленого" покемончіка

    card.dataset.id = p.id; // зберігаємо id в data-id 

   // лейзі лоудінг, заповнюємо хтмл картки, якщо немаж то ставимо пустий рядок
    card.innerHTML = `
      <button class="fav-btn">★</button>
      <img src="${p.sprites.front_default || ''}" loading="lazy" alt="${p.name}">
      <h3>${p.name}</h3>
      <div class="types-container">
        ${p.types.map(t => `<span class="type-badge">${t.type.name}</span>`).join('')}
      </div>
    `;

    grid.appendChild(card); // додаємо в кінець 
  });
}

// обробка кліків на кнопки сторінок
next.onclick = () => { offset += LIMIT; load(); };
prev.onclick = () => { offset -= LIMIT; load(); };

// один обробник на всю сітку
// event delegation, подія спливає догори по дом
grid.onclick = (e) => {
  const card = e.target.closest('.pokemon-card');

  if (!card) return; // валідація кліку

  const id = Number(card.dataset.id); // дістаємо id з data-id і претворбємо в число

  if (e.target.classList.contains('fav-btn')) { // клік на кнопку "улюблене"
    // додаємо або прибираємо id з масиву улюблених
    favs = favs.includes(id) ? favs.filter(i => i !== id) : [...favs, id];             

    card.classList.toggle('is-favorite');

    localStorage.setItem('favs', JSON.stringify(favs)); // збереження в локал сторедж

  } else {
    // відкриваємо модалку з деталями
    const p = cache[id]; // дані вже є в кеші бо ми їх завантажили в load()

    body.innerHTML = `
      <h2>${p.name.toUpperCase()}</h2>
      <img src="${p.sprites.other['official-artwork'].front_default || p.sprites.front_default}" style="width:150px;">
      <p>Зріст: <strong>${p.height / 10} м</strong> | Вага: <strong>${p.weight / 10} кг</strong></p>
      ${p.stats.map(s => `<p>${s.stat.name}: <strong>${s.base_stat}</strong></p>`).join('')}
    `;
    
    modal.classList.remove('hidden');
  }
};

// обробка кліку на хрестик
closeBtn.onclick = () => modal.classList.add('hidden');
// клік мимо теж закриває
// e.target === modal перевіряємо що клікнули саме фон
modal.onclick = (e) => {
  if (e.target === modal) modal.classList.add('hidden');
};

// спрацьовує після кожного введення
search.oninput = (e) => {
  const query = e.target.value.toLowerCase().trim();
  render(pokemons.filter(p => p.name.includes(query)));
};

// запускаємо додаток
load();