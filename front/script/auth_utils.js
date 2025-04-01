async function checkToken() {
    const {api_url} = JSON.parse(localStorage.getItem('config') || '{}');
    if (localStorage.getItem('token') && api_url) {
        const res = await fetch(`${api_url}/validate`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!res.ok) {
            localStorage.removeItem('token');
        } else {
            window.location.href = "house_share.html";
        }
    }
}

function displayError(errorElem, message) {
    errorElem.innerText = message;
    errorElem.style.display = 'block';
}

function checkPassword(password, passwordDouble) {
    const errors = [];
    if (password !== passwordDouble) errors.push('Passwords do not match');
    if (password.length < 8) errors.push('Password must be at least 8 characters');
    if (!password.match(/[A-Z]/) && !password.match(/[0-9]/)) errors.push('Password must contain at least one uppercase letter or one number');
    return errors;
}

export {checkToken, displayError, checkPassword};