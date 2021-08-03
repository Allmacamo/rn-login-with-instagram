# React Native Login With Instagram

Simple package implemeting Instagrams Basic Display API for OAuth.

## How to use it

### Install the package

using yarn

```
yarn add rn-login-with-instagram
```

using npm

```
npm i rn-login-with-instagram
```

### Use it on your React Native app

```
import LoginWithInstagram from 'rn-login-with-instagram'

const [showInstaLogin,setShowInstaLogin] = useState(false)
...
<LoginWithInstagram
    isVisisble={showInstaLogin}
    appId={process.env.INSTAGRAM_APP_ID}
    appSecret={process.env.INSTAGRAM_APP_SECRET}
    redirectUrl=""
    onCancel={() => setShowInstaLogin(false)}
    onError={(error) => handleError(error)}
    onSuccess={(token)=> handleLogin(token)}
/>
```
