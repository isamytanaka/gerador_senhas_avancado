document.addEventListener('DOMContentLoaded', () => {
    const passwordLength = document.getElementById('passwordLength');
    const lengthDisplay = document.getElementById('lengthDisplay');
    const generateButton = document.getElementById('generateButton');
    const generatedPassword = document.getElementById('generatedPassword');
    const copyButton = document.getElementById('copyButton');
    const saveButton = document.getElementById('saveButton');
    const generateMultipleButton = document.getElementById('generateMultipleButton');
    const strengthBars = document.querySelectorAll('.bar');
    const strengthText = document.getElementById('strengthText');

    const checkboxes = {
        uppercase: document.getElementById('includeUppercase'),
        lowercase: document.getElementById('includeLowercase'),
        numbers: document.getElementById('includeNumbers'),
        symbols: document.getElementById('includeSymbols')
    };

    const characterSets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    passwordLength.addEventListener('input', () => {
        lengthDisplay.textContent = passwordLength.value;
    });

    function calculatePasswordStrength() {
        const selectedTypes = Object.values(checkboxes)
            .filter(checkbox => checkbox.checked).length;
        const length = parseInt(passwordLength.value);

        strengthBars.forEach((bar, index) => {
            bar.classList.remove('active');
        });

        if (selectedTypes === 0) {
            strengthText.textContent = 'Selecione os tipos de caracteres';
            return;
        }

        if (length < 8) {
            strengthText.textContent = 'Muito Curta';
            strengthBars[0].classList.add('active');
        } else if (length < 12) {
            strengthText.textContent = 'Fraca';
            strengthBars[0].classList.add('active');
            strengthBars[1].classList.add('active');
        } else if (selectedTypes < 3) {
            strengthText.textContent = 'Média';
            strengthBars[0].classList.add('active');
            strengthBars[1].classList.add('active');
            strengthBars[2].classList.add('active');
        } else {
            strengthText.textContent = 'Forte';
            strengthBars.forEach(bar => bar.classList.add('active'));
        }
    }

    function generatePassword() {
        let charset = '';
        Object.entries(checkboxes).forEach(([type, checkbox]) => {
            if (checkbox.checked) {
                charset += characterSets[type];
            }
        });

        if (charset === '') {
            showNotification('Selecione pelo menos um tipo de caractere', 'error');
            return;
        }

        const length = parseInt(passwordLength.value);
        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        generatedPassword.value = password;
        calculatePasswordStrength();
    }

    function copyPassword() {
        if (generatedPassword.value) {
            navigator.clipboard.writeText(generatedPassword.value)
                .then(() => {
                    showNotification('Senha copiada com sucesso!', 'success');
                })
                .catch(err => {
                    showNotification('Erro ao copiar senha', 'error');
                });
        }
    }

    function savePassword() {
        if (generatedPassword.value) {
            const savedPasswords = JSON.parse(localStorage.getItem('savedPasswords') || '[]');
            savedPasswords.push({
                password: generatedPassword.value,
                date: new Date().toLocaleString()
            });
            localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));
            showNotification('Senha salva com sucesso!', 'success');
        }
    }

    function generateMultiplePasswords() {
        const numberOfPasswords = 5;
        const multiplePasswords = [];

        for (let i = 0; i < numberOfPasswords; i++) {
            let charset = '';
            Object.entries(checkboxes).forEach(([type, checkbox]) => {
                if (checkbox.checked) {
                    charset += characterSets[type];
                }
            });

            const length = parseInt(passwordLength.value);
            let password = '';
            for (let j = 0; j < length; j++) {
                password += charset.charAt(Math.floor(Math.random() * charset.length));
            }
            multiplePasswords.push(password);
        }

        // Abrir modal com senhas geradas
        const savedPasswordsList = document.getElementById('savedPasswordsList');
        savedPasswordsList.innerHTML = '';
        multiplePasswords.forEach((pwd, index) => {
            const li = document.createElement('li');
            li.textContent = `Senha ${index + 1}: ${pwd}`;
            savedPasswordsList.appendChild(li);
        });

        const modal = document.getElementById('savedPasswordsModal');
        modal.style.display = 'block';

        const closeModal = document.querySelector('.close');
        closeModal.onclick = () => {
            modal.style.display = 'none';
        };

        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };
    }

    function showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.style.display = 'block';
        notification.style.backgroundColor = type === 'success' ? '#2ecc71' : '#e74c3c';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    Object.values(checkboxes).forEach(checkbox => {
        checkbox.addEventListener('change', calculatePasswordStrength);
    });

    passwordLength.addEventListener('input', calculatePasswordStrength);

    generateButton.addEventListener('click', generatePassword);
    copyButton.addEventListener('click', copyPassword);
    saveButton.addEventListener('click', savePassword);
    generateMultipleButton.addEventListener('click', generateMultiplePasswords);

    // Inicializar força da senha
    calculatePasswordStrength();
});