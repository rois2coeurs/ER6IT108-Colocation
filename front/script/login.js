const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    }
    const res = await fetch('http://localhost:8090/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    const resData = await res.json();
    console.log(resData);
    if(res.ok) {
        localStorage.setItem('token', resData.token);
        alert("Login successful");
    } else {
        alert("Login failed");
    }
})