# AngularStarter

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.12.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

Démontré :
Angular fundamentals
├── ✅ Components
├── ✅ Templates
├── ✅ Property binding
├── ✅ Event binding
├── ✅ Routing
├── ✅ RouterOutlet
├── ✅ Route parameters
└── ✅ Lazy loading

Modern Angular
├── ✅ Standalone
├── ✅ Signals
├── ✅ computed()
├── ✅ @if
├── ✅ @for
├── ✅ track
├── 🟡 OnPush
└── ⬜ effect()

Architecture
├── ✅ Feature-oriented
├── ✅ Feature routing
├── ✅ Models
├── ⬜ Store
├── ⬜ Data access layer
└── ⬜ UI components

Rendering
├── ✅ CSR
├── ✅ Prerender / SSG
└── 🟡 SSR

Forms
├── ⬜ Reactive Forms
├── ⬜ Typed Forms
├── ⬜ Validation
└── ⬜ FormArray

HTTP
├── ⬜ HttpClient
├── ⬜ RxJS
├── ⬜ Interceptors
├── ⬜ Error handling
└── ⬜ API layer

Security
├── ⬜ OIDC
├── ⬜ Guards
├── ⬜ JWT
└── ⬜ Permissions

Advanced
├── ⬜ inject()
├── ⬜ @defer
├── ⬜ input()
├── ⬜ output()
└── ⬜ Signals ↔ RxJS

RoadMap :

ProjectList
2
│
3
▼
4
ProjectStore
5
│
6
├── private _projects
7
│ ↓
8
│ signal()
9
│
10
├── projects
11
│ ↓
12
│ asReadonly()
13
│
14
└── computed(...)


SCENARIOS A VALIDER :
✅ Login
   accessToken → Signal
   refreshToken → HttpOnly

✅ Requête API
   Authorization: Bearer accessToken

✅ F5
   accessToken perdu
   refresh automatique
   accessToken restauré
   refreshToken rotaté

✅ Access token expiré
   API → 401
   refresh → 200
   requête rejouée → 200

✅ Plusieurs 401
   un seul /refresh

✅ Logout
   accessToken supprimé
   refreshToken révoqué/supprimé

✅ F5 après logout
   session non restaurée

PUIS CREER LES ECRANS 
V1 :

/samples (backend déjà modifié pour faire de la pagination)
  Liste
  Recherche
  Filtres
  Pagination (ok)

V2 :
historique / audit
duplication d’un sample
export CSV/Excel
import en masse
sélection multiple et actions groupées
archivage plutôt que suppression physique
dashboard avec quelques statistiques
favoris / samples récemment consultés

Objectif :
                 ANGULAR STARTER (Créer le README adapté)

 Authentication                  Architecture
 ├── JWT                         ├── Lazy loading
 ├── HttpOnly refresh            ├── Feature architecture
 ├── Rotation                    ├── Signals
 ├── Interceptor                 └── Typed models
 └── Guards

 Data                            UX
 ├── HttpClient                  ├── Loading
 ├── CRUD                        ├── Empty state
 ├── Filtering                   ├── Errors
 ├── Pagination                  ├── Toasts
 └── Cache                       └── Responsive

 Forms                           Quality
 ├── Typed reactive forms       ├── Unit tests
 ├── Validation                 ├── Component tests
 ├── Async validation           ├── HTTP tests
 └── Unsaved changes            ├── E2E
                                └── lint / CI
