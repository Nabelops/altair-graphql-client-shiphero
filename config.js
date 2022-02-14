// Change to your username and password
const creds = {username: "me@email.com", password: "Change-Me!!"};

const nowInSeconds = () => Date.now() / 1000;
const authUrl = 'https://public-api.shiphero.com/auth/token';
const refreshUrl = 'https://public-api.shiphero.com/auth/refresh';
const tokenExpiry = localStorage.getItem("expires_in") || 0;

// function to save the token to storage for both initial username sign in
// and for token that is refreshed
const saveToLocal = (res) => {
  localStorage.setItem("access_token", res.access_token);
  localStorage.setItem('expires_in', nowInSeconds() + res.expires_in);
  localStorage.setItem('refresh_token', res.refresh_token);
}

// Check if token exists in local storage
if (tokenExpiry) {
    if (nowInSeconds() >= tokenExpiry) {
        const refreshToken = localStorage.getItem('refresh_token');
        const res = await altair.helpers.request('POST', authUrl, {params: {refresh_token: refreshToken}});
        saveToLocal(res)
    }
} else {
  // if no token run initial sign in with username and passwor
  // change values to your username and password

    const res = await altair.helpers.request('POST', authUrl, {params: creds});
    saveToLocal(res);
}

// get token that has was saved to local storage
const token = localStorage.getItem("access_token");

// Override environmental variable to token so it can be used in header
altair.helpers.setEnvironment('access_token', token);

