# Miss.d
Notifications for when events *don't* happen

## Running

Clone and run with the following commands:

```bash
npm install -g sails
git clone https://github.com/TheConnMan/missd.git
cd missd
npm install
sails lift
```

Then navigate to <http://127.0.0.1:1337>. **NOTE:** Please read the OAuth section below to configure the authentication providers.

## OAuth

This app uses GitHub OAuth for authentication. Create a [GitHub app](https://github.com/settings/applications/new) and make sure to use the full URL you will use to run this app during configuration.

Once the apps are created you need to pass in the Client ID and Client Secret variables as the following environment variables:

- **GitHub** - GITHUB_ID, GITHUB_SECRET

Finally, pass in the **SERVER_URL** variable as the full URL of your application.

### Local Dev

For easier local dev you can copy /config/oauth.js to /config/local.js (which is under .gitignore) and replace the OAuth variables with you application credentials. This removes the need to run the app with the OAuth environment variables every time.

You can also run the app with automatic restart on code change
```bash
npm run dev
```

## Running in Docker

Docker is the easiest way to run **Miss.d**. Run with `docker build -t missd .` and `docker run -d -p 80:80 missd`. The OAuth environment variables are omitted from the `docker run` command, so add them in once you have followed the above instructions (e.g. `docker run -d -e GITHUB_ID=[my-id] -e GITHUB_SECRET=[my-secret] -e SERVER_URL=http://127.0.0.1 -p 80:80 missd`).

## UI Proxy
This API can be run with a separately hosted UI by proxying all non-API calls to the UI. Use the following environment variables to configure the proxy:

- PROXY_ENABLED (default: false) - Toggle for the proxy
- PROXY_URL (default: http://localhost:4200) - URL to proxy non-API requests to

## Running with MySQL

The default database is on disk, so it is recommended to run **Miss.d** with a MySQL DB in production. Use the following environment variables:

- MYSQL_HOST (MySQL will be used as the datastore if this is supplied)
- MYSQL_USER (default: sails)
- MYSQL_PASSWORD (default: sails)
- MYSQL_DB (default: sails)

The easiest way to run a MySQL instance is to run it in Docker using the following command:

```bash
docker run -d -p 3306:3306 -e MYSQL_DATABASE=sails -e MYSQL_USER=sails -e MYSQL_PASSWORD=sails -e MYSQL_RANDOM_ROOT_PASSWORD=true mysql
```

## Additional Environment Variables
**NOTE:** If the AWS credentials and emails settings are not injected emails notifications will not be sent

- FLUENTD_HOST - If provided this project will log through FluentD
- REDIS_HOST - Redis host location
- AWS_ACCESS_KEY_ID (Optional) - AWS ID for sending SES email
- AWS_SECRET_ACCESS_KEY (Optional) - AWS secret key for sending SES email
- FROM_EMAIL (Optional) - Email address notifications will be from
