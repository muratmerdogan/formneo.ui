## GitHub Copilot Chat

- Extension Version: 0.23.2 (prod)
- VS Code: vscode/1.96.2
- OS: Windows

## Network

User Settings:
```json
  "github.copilot.advanced.debug.useElectronFetcher": true,
  "github.copilot.advanced.debug.useNodeFetcher": false,
  "github.copilot.advanced.debug.useNodeFetchFetcher": true
```

Connecting to https://api.github.com:
- DNS ipv4 Lookup: 140.82.121.5 (93 ms)
- DNS ipv6 Lookup: Error (103 ms): getaddrinfo ENOENT api.github.com
- Proxy URL: None (1 ms)
- Electron fetch (configured): HTTP 200 (420 ms)
- Node.js https: HTTP 200 (297 ms)
- Node.js fetch: HTTP 200 (305 ms)
- Helix fetch: HTTP 200 (374 ms)

Connecting to https://api.githubcopilot.com/_ping:
- DNS ipv4 Lookup: 140.82.113.22 (94 ms)
- DNS ipv6 Lookup: Error (101 ms): getaddrinfo ENOENT api.githubcopilot.com
- Proxy URL: None (30 ms)
- Electron fetch (configured): HTTP 200 (635 ms)
- Node.js https: HTTP 200 (547 ms)
- Node.js fetch: HTTP 200 (572 ms)
- Helix fetch: HTTP 200 (560 ms)

## Documentation

In corporate networks: [Troubleshooting firewall settings for GitHub Copilot](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-firewall-settings-for-github-copilot).
