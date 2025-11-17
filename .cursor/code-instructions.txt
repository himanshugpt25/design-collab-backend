Here’s how I’d structure it and the rules I’d follow while writing code.

---

## 1. High-level approach

Goals:

* Separation of concerns (routes/controllers/services/models).
* Easy to test.
* Easy to add new features without touching everything.
* Configurable via env, no hardcoded secrets.
* Centralized logging, error handling, and validation.

I’ll assume **Express + Mongoose + MongoDB**.

---

## 2. Project structure

Example layout:

```text
project-root/
├─ src/
│  ├─ app.js                # Express app setup (no `.listen` here)
│  ├─ server.js             # HTTP server bootstrap
│  ├─ config/
│  │  ├─ index.js           # Reads env, exports config object
│  │  ├─ db.js              # Mongo connection logic
│  │  └─ logger.js          # Logger instance (winston/pino)
│  ├─ api/
│  │  ├─ routes/
│  │  │  ├─ index.js        # Mounts versioned routes
│  │  │  ├─ v1/
│  │  │  │  ├─ auth.routes.js
│  │  │  │  └─ user.routes.js
│  │  ├─ controllers/
│  │  │  ├─ auth.controller.js
│  │  │  └─ user.controller.js
│  │  ├─ services/
│  │  │  ├─ auth.service.js
│  │  │  └─ user.service.js
│  │  ├─ models/
│  │  │  ├─ user.model.js
│  │  │  └─ token.model.js
│  │  ├─ validators/
│  │  │  ├─ auth.validator.js
│  │  │  └─ user.validator.js
│  │  └─ dtos/               # Response mappers, if you want strict contracts
│  ├─ middlewares/
│  │  ├─ error.middleware.js
│  │  ├─ auth.middleware.js
│  │  ├─ validator.middleware.js
│  │  └─ request-logger.middleware.js
│  ├─ utils/
│  │  ├─ ApiError.js
│  │  ├─ asyncHandler.js
│  │  ├─ crypto.js
│  │  └─ pagination.js
│  ├─ jobs/                  # Cron/queue workers (Bull/Agenda/etc.)
│  │  └─ example.job.js
│  ├─ load/
│  │  ├─ express.js          # Attach routes, middlewares
│  │  └─ mongo.js            # Connect DB and handle events
│  └─ docs/
│     └─ openapi.yaml        # API docs (Swagger/OpenAPI)
│
├─ tests/
│  ├─ integration/
│  └─ unit/
├─ .env
├─ .env.example
├─ package.json
├─ .eslintrc.js
├─ .prettierrc
└─ README.md
```

You can compress or expand this depending on complexity, but that’s the pattern.

---

## 3. Responsibility of each layer

### `app.js`

* Create Express app.
* Attach global middlewares.
* Attach routes.
* Attach error handler (as last middleware).
* Export app (do **not** call `.listen()` here).

```js
// src/app.js
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./api/routes');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // or custom logger middleware

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
```

### `server.js`

* Read config.
* Connect DB.
* Start HTTP server.

```js
// src/server.js
const http = require('http');
const app = require('./app');
const config = require('./config');
const connectDb = require('./config/db');
const logger = require('./config/logger');

(async () => {
  try {
    await connectDb();

    const server = http.createServer(app);
    server.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });
  } catch (err) {
    logger.error('Failed to start server', { err });
    process.exit(1);
  }
})();
```

### `config/`

* `index.js` → single source of truth for config.
* `db.js` → Mongo connection using Mongoose, with retry logic and event listeners.
* `logger.js` → configured winston/pino instance.

### `api/models/`

* Define Mongoose schemas and models.
* Add indexes and schema-level validation where possible.
* Add schema methods/statics for model-specific behavior (not generic business logic).

### `api/services/`

* Business logic lives here.
* Services talk to models, external APIs, queues, etc.
* No Express objects (`req`, `res`) here.

### `api/controllers/`

* Thin layer that:

  * Extracts data from `req` (params, body, query, user).
  * Calls service methods.
  * Maps service results to HTTP responses.
* No database logic or heavy business rules here.

### `api/routes/`

* Define REST endpoints and attach middlewares (auth, validators).
* Only routing and wiring, no logic.

### `middlewares/`

* Authentication, authorization.
* Request logging.
* Validation.
* Centralized error handler and 404.

### `utils/`

* Pure helpers: generate IDs, hash passwords, pagination logic, etc.
* No coupling to Express or Mongoose unless really generic.

### `jobs/`

* Background work: emails, cleanups, scheduled tasks.
* Ideally triggered via message queue / Bull / Agenda, not directly in request path.

---

## 4. Code-writing rules I’d follow

### 4.1 General coding conventions

* Use **ES modules or CommonJS consistently**. Don’t mix styles.
* Use **async/await everywhere**; avoid raw `.then().catch()` chains in app code.
* Enforce style with **ESLint + Prettier**. No manual formatting wars.
* Use **strict mode** or TypeScript if possible.
* Small functions, single responsibility; break down long controllers/services.

### 4.2 Environment & config

* All environment-dependent values (DB URL, JWT secret, ports, etc.) come from `process.env`.
* Use a config layer that:

  * Validates required env vars on startup.
  * Exposes a typed/structured config object.

Example:

```js
// src/config/index.js
require('dotenv').config();

const required = (name) => {
  if (!process.env[name]) throw new Error(`Missing required env var: ${name}`);
  return process.env[name];
};

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  mongodbUri: required('MONGODB_URI'),
  jwtSecret: required('JWT_SECRET'),
  logLevel: process.env.LOG_LEVEL || 'info',
};
```

Never commit `.env`, keep `.env.example` updated.

### 4.3 Mongo/Mongoose best practices

* Always define **indexes** for fields used in search/filtering.
* Use **lean queries** (`.lean()`) for read-only operations to get plain objects.
* Avoid unbounded collections; consider TTL indexes for logs or sessions.
* Don’t expose Mongo `_id` directly if it leaks internals; map to `id`.
* Wrap all DB operations in **services** (controllers never call `Model` directly, ideally).

### 4.4 Validation

* Validate **at the edges** (request boundary).
* Use a schema validation library (Joi, Yup, Zod, express-validator).
* Keep validation schemas in `validators/` and use a generic validator middleware.

Example validator middleware:

```js
// src/middlewares/validator.middleware.js
const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
  const data = {
    body: req.body,
    params: req.params,
    query: req.query,
  };
  const { error, value } = schema.validate(data, { abortEarly: false, allowUnknown: true });

  if (error) {
    return next(new ApiError(400, 'Validation error', error.details));
  }

  Object.assign(req, value); // or assign req.body/params individually
  return next();
};

module.exports = validate;
```

### 4.5 Error handling

* No `try/catch` in every controller: wrap controllers with an async handler, and use one centralized error middleware.

```js
// src/utils/asyncHandler.js
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

Custom error class:

```js
// src/utils/ApiError.js
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

module.exports = ApiError;
```

Error middleware:

```js
// src/middlewares/error.middleware.js
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, 'Not found'));
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isOperational = err instanceof ApiError;

  if (!isOperational) {
    logger.error('Unexpected error', { err, path: req.path });
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(err.details && { details: err.details }),
  });
};

module.exports = { errorHandler, notFoundHandler };
```

Instructions to self:

* Always throw `ApiError` for known/expected issues (not found, validation, auth).
* Never send raw error objects to the client (no stack traces in production).

### 4.6 Logging

* Use a real logger (winston/pino), **not** `console.log` except for local debugging.
* Standard pattern:

  * `logger.info` for normal events.
  * `logger.warn` for suspicious/edge cases.
  * `logger.error` for failures.
* Log structured JSON (message + context object) so tools can parse it.
* Include correlation/request IDs if you need tracing (middleware adds `req.id` and logger includes it).

### 4.7 Security

* Use **helmet** for default security headers.
* Configure **CORS** correctly – only allow trusted origins in production.
* Sanitize input:

  * Use validation schemas.
  * Consider libraries that prevent NoSQL injection (`express-mongo-sanitize`).
* Hash passwords with **bcrypt** (or argon2), never store them in plain text.
* Use **JWT** or sessions for auth:

  * Short-lived access tokens, longer-lived refresh tokens if needed.
  * Store secrets in env.
* Rate limiting on sensitive routes (login, signup, password reset) using `express-rate-limit`.
* Don’t expose stack traces or internals in error messages.

### 4.8 Code organization rules

* **Controller rules**

  * No database calls directly.
  * No complex business rules.
  * Only translate HTTP → service args, service result → HTTP.

* **Service rules**

  * Orchestrate multiple model calls.
  * Implement business logic.
  * Transactions (if needed with Mongo sessions).
  * Throw `ApiError` for known failures.

* **Model rules**

  * Data shape & constraints.
  * Simple helpers related to that model (e.g., `userSchema.methods.isPasswordMatch`).

* **Utils**

  * Pure helpers, no side effects, reusable across layers.

### 4.9 Testing

* Use **Jest** or **Mocha + Chai**.
* Structure:

  * `tests/unit` for utils, services (mock models).
  * `tests/integration` for API endpoints using `supertest`.
* For tests:

  * Use a separate test DB.
  * Clear DB between tests (or use in-memory Mongo).

### 4.10 API design & docs

* Version APIs (`/api/v1/...`).
* Consistent response shape:

  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```

  or

  ```json
  {
    "success": false,
    "message": "Error message",
    "details": [...]
  }
  ```
* Maintain **OpenAPI/Swagger** docs in `src/docs/openapi.yaml` or with annotations.
* Document auth, rate limits, and error codes.

### 4.11 Git & deployment discipline

* Small, focused commits with meaningful messages.
* `.gitignore` includes node_modules, logs, and `.env`.
* Use a process manager like **PM2** or run under Docker in prod.
* Health check endpoint `/health` that returns simple status and maybe DB connectivity info.

---

INSTRUCTIONS : To write any code, strictly follow these SOLID principles as given below with examples.

---

## How the structure maps to SOLID

### 1. Single Responsibility Principle (SRP)

SRP is mostly handled by the separation into:

* **Controllers** → only deal with HTTP (req/res).
* **Services** → contain business logic.
* **Models** → data shape + persistence logic.
* **Middlewares** → cross-cutting concerns per request (auth, logging, validation).
* **Utils** → pure helper functions.

To actually respect SRP, you’d enforce rules like:

* A controller should only:

  * Parse input from `req`.
  * Call 1–2 service methods.
  * Return a response.
* A service function should have *one job*: e.g. `createUser`, `updateProfile`, `issueToken`. If it starts doing 6 things, split it.

---

### 2. Open/Closed Principle (OCP)

The layering already helps, but in Node/Express you’d focus on extension via composition, not modification:

* Add new routes by creating new controller/service files instead of editing old ones.
* Use configuration/strategy objects instead of `if (type === 'A') ... else if (type === 'B') ...` all over the place.

Example:

Instead of:

```js
if (provider === 'google') {
  // google login flow
} else if (provider === 'github') {
  // github login flow
}
```

Do:

```js
// auth.service.js
const providers = {
  google: googleAuthProvider,
  github: githubAuthProvider,
};

async function loginWithProvider(providerName, payload) {
  const provider = providers[providerName];
  if (!provider) throw new ApiError(400, 'Unsupported provider');
  return provider.login(payload);
}
```

Adding a new provider becomes adding a new module + map entry, not editing core logic.

---

### 3. Liskov Substitution Principle (LSP)

In plain JS, LSP is more about **not breaking expectations**:

* If your service returns a “User DTO”, always include the same fields (`id`, `email`, `role`, etc.).
* If you wrap models (e.g. repository pattern), make sure the wrapper behaves like the thing it replaces from the perspective of the caller.

For example, if `UserRepository.findByEmail(email)` sometimes returns `null` and sometimes throws, that breaks substitutability. Pick one contract and stick to it.

---

### 4. Interface Segregation Principle (ISP)

We apply ISP by **splitting modules by concern** instead of big “god” modules:

* Instead of one giant `user.service.js` with 30 functions, have:

  * `userProfile.service.js`
  * `userAuth.service.js`
  * `userSettings.service.js`

Same for routes:

* `user.routes.js` can import specific controllers that each expose focused methods.

And by designing **narrow services**:

* A controller needing “read-only user info” should depend on a small `UserQueryService`, not a mega service that can also delete accounts, send emails, etc.

---

### 5. Dependency Inversion Principle (DIP)

The structure is already layered, but to be closer to DIP:

* Higher-level modules depend on **abstractions**, not concrete implementations.

In Node, this often means passing dependencies into constructors/functions instead of requiring them inside:

```js
// user.service.js
module.exports = (deps) => {
  const { userModel, mailer } = deps;

  const createUser = async (payload) => {
    const user = await userModel.create(payload);
    await mailer.sendWelcomeEmail(user.email);
    return user;
  };

  return { createUser };
};
```

Then in your wiring layer:

```js
// load/containers.js
const UserModel = require('../api/models/user.model');
const mailer = require('../infra/mailer');
const createUserService = require('../api/services/user.service');

const userService = createUserService({ userModel: UserModel, mailer });
module.exports = { userService };
```

Controllers now depend on `userService` (an abstraction) rather than knowing about Mongoose or specific mail libraries. In tests, you can inject fake dependencies easily.

---

## Extra instructions I’d consciously follow for SOLID

When *writing* the code, I’d keep a few hard rules:

1. **Controllers never import models directly.**
   Always go through services → keeps layers clean and DIP-ish.

2. **Services don’t know about Express.**
   No `req`, `res`, `next`, no HTTP status codes inside services — they just throw domain errors (`ApiError`) or return data.

3. **No “god” files.**
   If a file:

   * Is > 300–400 lines, or
   * Has > 8–10 exported functions
     → consider splitting it.

4. **Stable interfaces for services.**

   * Decide what a “User” object looks like outside your service and stick to it.
   * If underlying data changes (Mongo → another DB), the service contract stays same.

5. **Imports point only “downwards”.**

   * `controllers` → can import services, utils.
   * `services` → can import models, utils.
   * `models` → never import controllers/services.
   * Circular deps = red flag.

---


