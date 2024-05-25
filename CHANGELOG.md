# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2024-05-25

### Features

-   Refactored leveling commands and events to use voice channel time tracking for XP calculation.
-   Added time conversion utility (`convertTime`) for time spent in voice channels.
-   Updated `leaderboard` command to use `voice_levels` table and ordered by `time_spent`.
-   Refactored `rank` command to display time spent in minutes.
-   Refactored `xp` command to display time spent in minutes.
-   Updated `voiceStateUpdate` event to track time spent in voice channels and calculate XP based on that.

### Changes

-   Modified `src/commands/leveling/leaderboard.ts`
-   Modified `src/commands/leveling/rank.ts`
-   Modified `src/commands/leveling/xp.ts`
-   Added `src/utils/convertTime.ts`
-   Modified `src/events/voiceStateUpdate.ts`

### Breaking Changes

-   These changes require migration of the database schema from the old `levels` table to the new `voice_levels` table for voice channel time tracking.

## [1.6.0] - 2024-05-24

### Added

-   Modified start script to include build step. (Updated start script)
-   Standardized npm scripts by adding the 'run' command. (Updated npm scripts)
-   Replaced pnpm with npm in various script commands. (Replaced pnpm with npm in scripts)
-   Updated Node.js version to 19.9.0 in the GitHub Actions workflow. (Updated Node.js version in build workflow)

## [1.5.0] - 2024-05-24

### Added

-   Added voiceStateUpdate event handling:
    -   voiceStateUpdate.ts: Track user XP and levels based on time spent in voice channels.
-   Added automated build and deploy workflow to production:
    -   Added .github/workflows/publish.yaml.
-   Added permissions and concurrency settings to publish workflow:
    -   Permissions for id-token write and contents read.
    -   Concurrency settings to ensure only one workflow can run per branch.

### Changed

-   Updated GitHub token for production deployment.

## [1.4.0] - 2024-05-24

### Added

-   Added leveling commands and events:
    -   leaderboard.ts: Display server XP leaderboard.
    -   rank.ts: Show user's rank based on XP.
    -   xp.ts: Show user's XP and level.
    -   serverinfo.ts: Show server information.
    -   translate.ts: Translate text between languages.
-   Added messageCreate.ts event to track user XP and levels.
-   Introduces a command cooldown system to prevent spamming. (Added cooldown mechanism)
-   Enhanced error handling and user experience in commands and events:
    -   help.ts: Enhanced error handling and options display.
    -   info.ts: Renamed 'users' to 'memberCount', improved information display.
    -   leaderboard.ts: Standardized naming and loading messages.
    -   serverinfo.ts and userinfo.ts: Simplified guild and user information retrieval.
    -   interactionCreate.ts: Added command cooldowns and improved error handling.
    -   messageCreate.ts: Enhanced level-up notifications and error handling.
    -   ready.ts: Improved bot presence status and error handling.
-   Enhanced error handling in Supabase queries:
    -   get-event.ts and get-user.ts.

### Changed

-   Refactored to improve error handling and user experience in commands and events.
-   Reorganized command structure:
    -   Renamed 'serverinfo.ts' and 'userinfo.ts' to 'server.ts' and 'user.ts', respectively.
    -   Moved 'uptime.ts' and 'info.ts' to the 'miscellaneous' category.
    -   Moved 'server.ts', 'user.ts', and 'avatar.ts' to the 'general' category.
-   Updated client intents in index.ts with a placeholder for future voice state implementation.
-   Improved command and event loading logic in registry.ts to filter out non-TypeScript files and backup files.
-   Updated .gitignore to exclude backup files.

### Removed

-   Removed deprecated utility commands: help.ts, ping.ts.

## [1.3.0] - 2024-05-23

### Added

-   Added new currency commands:
    -   balance.ts: Check user balance.
    -   give.ts: Give currency to a user.
    -   remove.ts: Remove currency from a user.
-   Added general commands:
    -   help.ts: Display help information.
    -   info.ts: Display bot information.
    -   uptime.ts: Display bot uptime.
-   Added utility commands:
    -   avatar.ts: Display user avatar.
    -   userinfo.ts: Display user information.
-   Added Supabase integration:
    -   src/libs/supabase/get-event.ts: Fetch events from Supabase.
    -   src/libs/supabase/get-user.ts: Fetch user data from Supabase.
    -   src/services/supabase/index.ts: Supabase service initialization.
    -   Supabase types: src/types/Supabase/Database.ts, src/types/Supabase/DatabaseGenerated.ts.
-   Added new configuration files:
    -   Renamed src/config.ts to src/config/env.ts.
    -   Added src/config/index.ts, src/config/info.ts.
-   Enhanced existing utilities:
    -   Updated utils: formatBytes.ts, index.ts, logger.ts, registry.ts.
-   Updated package.json and pnpm-lock.yaml to include new dependencies and scripts.

### Changed

-   Updated ESLint configuration to adjust rules for Prettier and TypeScript. (Updated .eslintrc.json)
-   Changed license to MIT and main file to src/index.ts in package.json.
-   Added engines field to specify Node.js version >= 19.9.0 in package.json.
-   Updated config.ts to include OWNER_ID for development mode restrictions.
-   Modified interactionCreate.ts to use OWNER_ID for development mode checks.
-   Refactored index.ts for improved structure.
-   Updated interactionCreate.ts to reflect changes in command handling.
-   Corrected indentation in compose.yaml.
-   Updated YAML overrides and parser settings in .prettierrc.json.

### Removed

-   Removed deprecated utility commands: help.ts, ping.ts.

## [1.2.1] - 2024-05-24

### Changed

-   Updated 'supabase' package to version 1.169.4 in package.json and pnpm-lock.yaml.

## [1.2.0] - 2024-05-23

### Added

-   Added command cooldown mechanism to prevent command spamming.

## [1.1.0] - 2024-05-23

### Added

-   Added help command to list all available commands and their details.

## [1.0.0] - 2024-05-22

### Added

-   Added initial setup for Discord bot. (Added src/discord-bot/\*)
