# Rust Documentation Viewer

A simple VS Code extension to view the Rust Book and the Standard Library documentation directly within the editor.

## Features

- **Open Rust Book**: Opens the official Rust Book in a webview panel.
- **Open Standard Library Docs**: Opens the official Rust Standard Library documentation in a webview panel.

## Usage

1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
2. Type `Rust: Open Rust Book` or `Rust: Open Standard Library Docs`.
3. The documentation will open in a new tab within VS Code.

## How it works

The extension uses a VS Code Webview with an `iframe` to display the official documentation from `doc.rust-lang.org`.
