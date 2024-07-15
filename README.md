# Juniper Nexus Discord Bot

Welcome to the Juniper Nexus Discord Bot repository! This bot is designed to enhance the functionality of the Juniper Nexus guild on Discord.

## Table of Contents

-   [Juniper Nexus Discord Bot](#juniper-nexus-discord-bot)
    -   [Table of Contents](#table-of-contents)
    -   [Features](#features)
    -   [Installation](#installation)
    -   [Configuration](#configuration)
    -   [Usage](#usage)
        -   [Development](#development)
        -   [Production](#production)
            -   [Using PM2](#using-pm2)
            -   [Using Docker](#using-docker)
    -   [Contributing](#contributing)
        -   [Pre-commit and Pre-push Hooks](#pre-commit-and-pre-push-hooks)
    -   [License](#license)

## Features

-   **Pre-configured Linting and Formatting:** Includes ESLint and Prettier configurations for consistent code style.
-   **Pre-commit and Pre-push Hooks:** Uses Husky to enforce code quality before committing and pushing changes.
-   **Environment Configuration:** Uses `dotenv` and `zod` for environment variable management and validation.
-   **Structured Command and Event Handling:** Easily add new commands and events with a modular structure.
-   **Error Handling:** Comprehensive error handling for commands and events.

## Installation

To get started with the Juniper Nexus Discord Bot, follow these steps:

1. **Clone the repository**:

    ```sh
    git clone https://github.com/JuniperNexus/discord-bot.git
    cd discord-bot
    ```

2. **Install dependencies**:

    ```sh
    npm install
    ```

3. **Build the project**:
    ```sh
    npm run build
    ```

## Configuration

Create a `.env` file in the root directory of the project or copy the example `.env.example` and add your Discord bot token and other necessary configurations:

```sh
cp .env.example .env
```

Edit the `.env` file with the following values:

```dotenv
# Discord Bot Token
# https://discord.com/developers/applications
TOKEN=

# Discord Bot Client ID
# https://discord.com/developers/applications
CLIENT_ID=

# Discord Guild ID
# https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-
GUILD_ID=

# Discord User ID of the bot owner
# https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-
OWNER_ID=

# Discord Role ID for Juniper Nexus members
JPN_ROLE_ID=

# Discord Role ID for people interested in the Juniper Nexus
INTERESTED_ROLE_ID=

# PostgreSQL Database URL
# https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING
DATABASE_URL=
```

## Usage

### Development

For development with live reloading:

```sh
npm run dev
```

### Production

#### Using PM2

To run the bot in production with PM2:

1. Install PM2 globally (if not already installed):

    ```sh
    npm install -g pm2
    ```

2. Start the bot using PM2:

    ```sh
    pm2 start dist/index.js --name "discord-bot"
    ```

3. Save PM2 Configuration:

    ```sh
    pm2 save
    pm2 startup
    ```

4. To manage the bot process (restart, stop, view logs):

    ```sh
    pm2 restart discord-bot
    pm2 stop discord-bot
    pm2 logs discord-bot
    ```

#### Using Docker

To run the bot in production with Docker:

1. Build and Start the Services:

    ```sh
    docker compose up --build -d
    ```

2. Stopping the Services:

    ```sh
    docker compose down
    ```

## Contributing

We welcome contributions! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch with your feature or bugfix.
3. Ensure your code follows the linting and formatting guidelines.
4. Commit your changes with a descriptive message.
5. Push your branch and create a pull request.

### Pre-commit and Pre-push Hooks

This project uses Husky to run pre-commit and pre-push hooks. Ensure your changes pass all checks by running:

```sh
npm run lint
npm run format:fix
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
