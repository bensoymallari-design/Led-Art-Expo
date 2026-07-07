# Led-Art-Expo

A two-app React Native Expo system for local-only WLAN LED art control and playback.

- `sender-app`: content management, layout editing, receiver discovery, and local network transfer.
- `receiver-app`: local display, receiver advertisement, content cache, and auto-play.
- `shared`: TypeScript contracts, protocol helpers, and network utilities used by both apps.

All application features are designed for offline local network operation. mDNS/Bonjour, UDP, WebSocket, and HTTP services require Expo development builds or native targets that include the listed native modules; Expo Go can still run the UI with graceful network fallbacks.
