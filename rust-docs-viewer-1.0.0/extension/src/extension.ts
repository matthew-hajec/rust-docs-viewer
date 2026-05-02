import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let openBook = vscode.commands.registerCommand('rust-docs-viewer.openBook', () => {
        DocsPanel.createOrShow('https://doc.rust-lang.org/book/', 'Rust Book');
    });

    let openStd = vscode.commands.registerCommand('rust-docs-viewer.openStd', () => {
        DocsPanel.createOrShow('https://doc.rust-lang.org/std/', 'Rust Standard Library');
    });

    // Add status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'rust-docs-viewer.openBook';
    statusBarItem.text = '$(book) Rust Docs';
    statusBarItem.tooltip = 'Open Rust Book';
    statusBarItem.show();

    context.subscriptions.push(openBook, openStd, statusBarItem);
}

class DocsPanel {
    public static currentPanel: DocsPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(url: string, title: string) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        // If we already have a panel, show it.
        if (DocsPanel.currentPanel) {
            DocsPanel.currentPanel._panel.reveal(column);
            DocsPanel.currentPanel._update(url, title);
            return;
        }

        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(
            'rustDocs',
            title,
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
            }
        );

        DocsPanel.currentPanel = new DocsPanel(panel, url, title);
    }

    private constructor(panel: vscode.WebviewPanel, url: string, title: string) {
        this._panel = panel;

        // Set the webview's initial html content
        this._update(url, title);

        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programmatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    }

    private _update(url: string, title: string) {
        this._panel.title = title;
        this._panel.webview.html = this._getHtmlForWebview(url);
    }

    public dispose() {
        DocsPanel.currentPanel = undefined;

        // Clean up our resources
        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private _getHtmlForWebview(url: string) {
        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Rust Documentation</title>
                <style>
                    body, html {
                        margin: 0;
                        padding: 0;
                        height: 100%;
                        width: 100%;
                        overflow: hidden;
                    }
                    iframe {
                        border: none;
                        width: 100%;
                        height: 100%;
                    }
                </style>
            </head>
            <body>
                <iframe src="${url}"></iframe>
            </body>
            </html>`;
    }
}
