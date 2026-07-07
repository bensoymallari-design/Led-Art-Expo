# Led-Art-Expo

A two-app React Native Expo system for local-only WLAN LED art control and playback.

- `sender-app`: content management, layout editing, receiver discovery, and local network transfer.
- `receiver-app`: local display, receiver advertisement, content cache, and auto-play.
- `shared`: TypeScript contracts, protocol helpers, and network utilities used by both apps.

All application features are designed for offline local network operation. mDNS/Bonjour, UDP, WebSocket, and HTTP services require Expo development builds or native targets that include the listed native modules; Expo Go can still run the UI with graceful network fallbacks.

## Install

Use Node 18 or Node 20. Expo SDK 50 can fail on Windows with newer Node versions because Metro tries to create shim folders for newer built-in modules such as `node:sea`, which contains a colon and is not a valid Windows folder name.

Recommended:

```bash
node -v
npm install
npm run typecheck
```

If `node -v` shows Node 22 or newer, install Node 20 LTS, then reinstall dependencies.

## Windows troubleshooting

If `npm run start` fails with:

```text
ENOENT: no such file or directory, mkdir '.expo\metro\externals\node:sea'
```

switch to Node 20 LTS and rebuild dependencies:

```bash
node -v
```

If the version is `v22.x` or newer:

```bash
cd "C:\Users\HPVS-BPXL-12\Desktop\Led Art By jhon\Led-Art-Expo"
rmdir /s /q node_modules
rmdir /s /q sender-app\.expo
rmdir /s /q receiver-app\.expo
del package-lock.json
npm install
cd sender-app
npm run start -- --clear
```

With nvm-windows:

```bash
nvm install 20
nvm use 20
node -v
npm install
cd sender-app
npm run start -- --clear
```
