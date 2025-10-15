# AI Agent Instructions for Trader App GUI

## Mandatory Rules for AI Agents

### 1. No Useless Comments

Do not add unnecessary comments. Code should be self-explanatory through clear naming and structure.

### 2. Always Analyze Before Modifying

Before making any changes, thoroughly examine the current code state as it may have been modified between prompts/sessions. Use search and view tools to understand existing implementations.

### 3. Task Completion Protocol

Once all assigned tasks are completed, do not attempt to run the project or open preview unless explicitly requested by the user.

### 4. Formatting and Lint Errors

Ignore lint errors related to formatting (such as missing newlines, indentation, spacing, etc.) as the user will handle code formatting themselves. Focus only on functional and structural lint errors.

## Project-Specific Context

This is an Angular trading application with the following key characteristics:

- Uses Angular with TypeScript
- Implements signal-based state management
- Follows reactive programming patterns with RxJS
- Uses void methods for fire-and-forget operations
- Prefers direct service method calls over subscription boilerplate
- Uses effects for handling signal updates

## Code Style Preferences

- Use TypeScript strict mode
- Prefer functional programming patterns
- Use Angular signals for state management
- Implement proper error handling
- Follow Angular best practices for component lifecycle
- Use meaningful variable and method names
- Keep components focused and single-responsibility

## Component Development Rules

### Signal Usage

- All components MUST use Angular signals for state management
- Avoid traditional reactive patterns with subscriptions in favor of signals and effects

### File Structure

- All new components MUST have separate template (.html) and style (.scss) files
- Do not use inline templates or styles in component decorators

### Interface and Type Placement Guidelines

- Interfaces and types used only within a component's folder: `<component>.interfaces.ts`
- Interfaces and types used by parent and sibling components: `<parent-component>.interfaces.ts`
- Interfaces and types used across different parent components: `/src/models/` directory

### Constants and Enums Placement Guidelines

- Constants and enums used only within a component's folder: `<component>.constants.ts`
- Constants and enums used by parent and sibling components: `<parent-component>.constants.ts`
- Constants and enums used across different parent components: `/src/constants.ts` (global constants file)
