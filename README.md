# 🔁 @antdevx/vite-plugin-hmr-sync

A minimal and powerful Vite plugin that **synchronizes Hot Module Reloading (HMR)** across multiple Vite apps — perfect for **micro-frontends**, **monorepos**, or **Module Federation** setups.

> When one app rebuilds, others automatically reload in development. No manual refresh, no stale modules.

---

## 🧠 Use Case: Micro-Frontend in Dev Mode

You have:

- A **Host App** that dynamically loads **Remote Apps** using Module Federation or import maps.
- All apps run separately using their own `vite dev` servers.
- You want the **Host** to automatically reload when a **Remote** rebuilds.

Without this plugin:  
You must manually reload the browser to see updates from the remote.

**With this plugin:**

1. **Remote App** uses `notifyOnRebuild()` to ping the host when it finishes rebuilding.
2. **Host App** uses `listenForRemoteRebuilds()` to receive the ping and trigger a hot reload.

> 🔥 You stay in sync across apps in development — like magic.

---

## 📦 Installation

```bash
npm install @antdevx/vite-plugin-hmr-sync --save-dev
```

---

## 🧩 Example Setup

### 📁 Project Structure

```bash
.
├── host-app/
│   └── vite.config.ts
│
└── remote-app/
    └── vite.config.ts
```

---

### 🔌 Host App Setup

```ts
// host-app/vite.config.ts
import { defineConfig } from 'vite';
import { listenForRemoteRebuilds } from '@antdevx/vite-plugin-hmr-sync';

export default defineConfig({
  plugins: [
    listenForRemoteRebuilds({
      allowedApps: ['remote-app'],
      endpoint: '/on-child-rebuild',
      hotPayload: { type: 'full-reload', path: '*' },
      onRebuild: (appName) => {
        console.log(`[host-app] 🔁 Triggered by: ${appName}`);
      }
    })
  ],
  server: {
    port: 5173
  }
});
```

---

### 🔔 Remote App Setup

```ts
// remote-app/vite.config.ts
import { defineConfig } from 'vite';
import { notifyOnRebuild } from '@antdevx/vite-plugin-hmr-sync';

export default defineConfig({
  plugins: [
    notifyOnRebuild({
      appName: 'remote-app',
      hostUrl: 'http://localhost:5173', // Host app's dev server
      endpoint: '/on-child-rebuild',
      notifyOnSuccessOnly: true
    })
  ],
  server: {
    port: 5174
  }
});
```

---

## ⚙️ API Reference

### `listenForRemoteRebuilds(options)`

Listens for incoming HTTP requests from other apps to trigger HMR.

| Option           | Type                      | Default                          | Description |
|------------------|---------------------------|----------------------------------|-------------|
| `endpoint`       | `string`                  | `'/on-child-rebuild'`            | Path to listen for rebuild requests |
| `allowedApps`    | `string[]`                | `undefined`                      | Apps allowed to trigger rebuild |
| `hotPayload`     | `HMRPayload`              | `{ type: 'full-reload', path: '*' }` | HMR payload sent to Vite client |
| `onRebuild`      | `(appName, server) => {}` | `undefined`                      | Callback after rebuild |
| `suppressLogs`   | `boolean`                 | `false`                          | Hide logs |

---

### `notifyOnRebuild(options | appName)`

Notifies a remote server (e.g., host app) after a successful rebuild.

| Option               | Type      | Default                        | Description |
|----------------------|-----------|--------------------------------|-------------|
| `appName`            | `string`  | _Required_                     | Name of the app notifying |
| `hostUrl`            | `string`  | `'http://127.0.0.1:9000'`      | URL of host to notify |
| `endpoint`           | `string`  | `'/on-child-rebuild'`          | Path to ping on host |
| `method`             | `string`  | `'GET'`                        | HTTP method used |
| `notifyOnSuccessOnly`| `boolean` | `true`                         | Skip if build fails |
| `suppressLogs`       | `boolean` | `false`                        | Hide logs |

---

## 🔗 Workflow Overview

```
[remote-app] buildEnd() 🔔
      ↓
Sends request to host endpoint `/on-child-rebuild?app=remote-app`
      ↓
[host-app] listens and validates app name
      ↓
Triggers Vite's `server.ws.send(hotPayload)` → 🔁 Full page reload
```

---

## 🥪 Development Tips

- Use different ports for each app in `vite.config.ts`.
- Ensure app names match in `notifyOnRebuild(appName)` and `allowedApps` on the host.
- Combine with Vite’s native `server.proxy` to load remotes via `localhost`.

---

## 💡 Troubleshooting

| Problem | Fix |
|--------|-----|
| Nothing reloads | Make sure the host server and endpoint are reachable from the remote. |
| 403 Forbidden | Ensure `allowedApps` includes the correct `appName`. |
| Silent fails | Set `suppressLogs: false` to enable debugging logs. |
| Partial updates not working | Try changing `hotPayload` from `'full-reload'` to a more specific HMR type. |

---

## 👥 Contributors

Maintained by [@antdevx](https://github.com/antdevx)

---

## 📜 License

MIT © antdevx

---

## 🙌 Like it?

Star ⭐ the repo and share with others using Vite and micro-frontends!

