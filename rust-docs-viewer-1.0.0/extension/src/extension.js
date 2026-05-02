"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const vscode = __importStar(require("vscode"));
function activate(context) {
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
    static createOrShow(url, title) {
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
        const panel = vscode.window.createWebviewPanel('rustDocs', title, column || vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true,
        });
        DocsPanel.currentPanel = new DocsPanel(panel, url, title);
    }
    constructor(panel, url, title) {
        this._disposables = [];
        this._panel = panel;
        // Set the webview's initial html content
        this._update(url, title);
        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programmatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    }
    _update(url, title) {
        this._panel.title = title;
        this._panel.webview.html = this._getHtmlForWebview(url);
    }
    dispose() {
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
    _getHtmlForWebview(url) {
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
//# sourceMappingURL=extension.js.map