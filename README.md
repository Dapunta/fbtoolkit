## API Documentation

### Host

  ```rb
  https://dapuntaxd.pythonanywhere.com
  ```

### Login

- Login with Email & Password
  ```
  /facebook-api/login?email={email}&password={password}
  ```

- Login with Cookie
  ```
  /facebook-api/login?cookie={cookie}
  ```

### Token

- Token
  ```
  /facebook-api/token?type={type}&cookie={cookie}
  ```
    - `type` --> `'eaag'` or `'eaab'`
      ```
      single --> 'type=eaag'
      multi  --> 'type=eaag,eaab'
      ```

### Post

- Get List Post
  ```
  /facebook-api/post?token={token_eaag}&cookie={cookie}
  ```

- 