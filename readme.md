# Component Fetcher

This is a Node.js script that allows you to fetch and add React components from a GitHub repository to your local project. It uses the GitHub API to retrieve the components and the `inquirer` library to provide a command-line interface.

## Usage

1. Install the required dependencies by running `npm install` in the project directory.
2. Run the script with `npm start`.
3. Follow the prompts to either list available components or add a component to your local project.

## Features

- **List Components**: View a list of available components in the specified GitHub repository.
- **Add Component**: Fetch a component from the GitHub repository and add it to your local `components` directory.

## Configuration

The script is configured to fetch components from the `mdhira-ai/dcomponents` repository on GitHub. You can modify the `OWNER`, `REPO`, and `COMPONENTS_PATH` constants at the top of the script to point to a different repository or component location.

## Dependencies

- `inquirer`: Command-line interface for prompting user input.
- `fs`: Node.js file system module for creating directories and writing files.
- `path`: Node.js path module for working with file paths.
- `ora`: Elegant terminal spinner for displaying loading indicators.
- `@octokit/rest`: GitHub API client for interacting with the GitHub API.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).