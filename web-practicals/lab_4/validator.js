// ============================================================
// Завдання 7 — Валідатор форми
// ============================================================
// Вимоги:
//   1. preventDefault на submit.
//   2. Правила валідації:
//      - Імʼя: не порожнє, мін. 2 символи.
//      - Email: відповідає регексу /^.+@.+\..+$/.
//      - Пароль: мін. 8 символів, хоча б одна цифра.
//      - Confirm: збігається з password.
//   3. Помилки показуються в .error[data-for="<name>"].
//   4. Поле з помилкою отримує клас .invalid.
//   5. При вводі в поле (input event) — помилка зникає.
//   6. Якщо ВСЕ валідно — console.log даних + alert("Зареєстровано!").
//   7. ПЕРЕВІРЯТИ ВСІ ПОЛЯ ОДРАЗУ, не break на першій помилці.
// ============================================================

const form = document.getElementById('register');
const nameInput = form.elements.name;
const emailInput = form.elements.email;
const passwordInput = form.elements.password;
const confirmPasswordInput = form.elements.confirm;
const nameError = document.querySelector('.error[data-for="name"]');
const emailError = document.querySelector('.error[data-for="email"]');
const passwordError = document.querySelector('.error[data-for="password"]');
const confirmError = document.querySelector('.error[data-for="confirm"]');
const regex = /^.+@.+\..+$/;

nameInput.addEventListener('input', () => {
    nameInput.classList.remove('invalid');
    nameError.textContent = '';
});

emailInput.addEventListener('input', () => {
    emailInput.classList.remove('invalid');
    emailError.textContent = '';
});

passwordInput.addEventListener('input', () => {
    passwordInput.classList.remove('invalid');
    passwordError.textContent = '';
});

confirmPasswordInput.addEventListener('input', () => {
    confirmPasswordInput.classList.remove('invalid');
    confirmError.textContent = '';
});

form.addEventListener('submit', (event) => {
    event.preventDefault();

    nameInput.classList.remove('invalid');
    nameError.textContent = '';

    emailInput.classList.remove('invalid');
    emailError.textContent = '';

    passwordInput.classList.remove('invalid');
    passwordError.textContent = '';
    
    confirmPasswordInput.classList.remove('invalid');
    confirmError.textContent = '';

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirm = confirmPasswordInput.value;

    let valid = true;

    if (!name) {
        nameInput.classList.add('invalid');
        nameError.textContent = "Ім'я не може бути порожнім.";
        valid = false;
    } else if (name.length < 2) {
        nameInput.classList.add('invalid');
        nameError.textContent = "Ім'я повинно містити хоча б 2 символи.";
        valid = false;
    }

    if (!regex.test(email)) {
        emailInput.classList.add('invalid');
        emailError.textContent = 'Некоректна адреса електронної пошти.';
        valid = false;
    }

    if (password.length < 8) {
        passwordInput.classList.add('invalid');
        passwordError.textContent = 'Пароль повинен містити мінімум 8 символів.';
        valid = false;
    }

    if (!/\d/.test(password)) {
        passwordInput.classList.add('invalid');
        passwordError.textContent = 'Пароль має містити хоча б одну цифру.';
        valid = false;
    }

    if (password !== confirm) {
        confirmPasswordInput.classList.add('invalid');
        confirmError.textContent = 'Паролі не збігаються.';
        valid = false;
    }

    if (valid) {
        console.log({ name, email, password });
        alert('Зареєстровано!');
    }
});
