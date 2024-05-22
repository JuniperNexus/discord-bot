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

    ```bash
    git clone https://github.com/JuniperNexus/discord-bot.git
    cd discord-bot
    ```

2. **Install dependencies**:

    ```bash
    pnpm install
    ```

3. **Build the project**:
    ```bash
    pnpm build
    ```

## Configuration

Create a `.env` file in the root directory of the project and add your Discord bot token and other necessary configurations:

```bash
NODE_ENV="production"
TOKEN="YOUR_DISCORD_BOT_TOKEN"
CLIENT_ID="YOUR_DISCORD_BOT_CLIENT_ID"
GUILD_ID="YOUR_DISCORD_GUILD_ID"
```

## Usage

### Development

For development with live reloading:

```bash
pnpm dev
```

### Production

#### Using PM2

To run the bot in production with PM2:

1. Install PM2 globally (if not already installed):

    ```bash
    npm install -g pm2
    ```

2. Start the bot using PM2:

    ```bash
    pm2 start dist/index.js --name "discord-bot"
    ```

3. Save PM2 Configuration:

    ```bash
    pm2 save
    pm2 startup
    ```

4. To manage the bot process (restart, stop, view logs):

    ```bash
    pm2 restart discord-bot
    pm2 stop discord-bot
    pm2 logs discord-bot
    ```

#### Using Docker

To run the bot in production with Docker:

1. Build and Start the Services:

    ```bash
    docker compose up --build -d
    ```

2. Stopping the Services:

    ```bash
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

```bash
pnpm lint
pnpm format:fix
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
