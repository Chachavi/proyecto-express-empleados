document
    .getElementById('loginBtn')
    .addEventListener('click', login);

async function login() {

    const email =
        document.getElementById('email').value;

    const password =
        document.getElementById('password').value;

    try {

        const response = await fetch(
            '/auth/login',
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);

            return;
        }

        localStorage.setItem(
            'token',
            data.token
        );

        window.location.href =
            '/dashboard.html';

    }
    catch (error) {

        console.error(error);

        alert('Error al iniciar sesión');
    }
}