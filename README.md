# Présentation de l'application

Angular Starter est une application de gestion de catalogue de samples développée avec Angular 21.

L'application permet aux utilisateurs authentifiés de consulter, rechercher, administrer et analyser un ensemble de samples tout en bénéficiant d'une expérience moderne basée sur les dernières fonctionnalités Angular.

---

# Principales fonctionnalités

## Authentification et Sécurité

L'application dispose d'un système complet d'authentification basé sur JWT.

Fonctionnalités :

- Connexion utilisateur
- Déconnexion sécurisée
- Protection des pages via Guards
- Gestion automatique des tokens via Interceptor HTTP
- Gestion des droits d'accès
- Restauration automatique de session

---

## Gestion des Samples

Le cœur de l'application repose sur un catalogue de samples.

Chaque sample peut être :

- Consulté
- Créé
- Modifié
- Dupliqué
- Archivé dans la corbeille
- Supprimé définitivement

---

## Recherche et Filtrage

Le catalogue dispose de fonctionnalités avancées de recherche permettant aux utilisateurs de retrouver rapidement les données souhaitées.

Filtres disponibles :

- Recherche par libellé
- Filtrage par statut
- Filtrage par catégorie
- Filtrage Actif / Inactif
- Filtrage Favoris uniquement
- Consultation de la corbeille

Les filtres sont combinables afin d'affiner précisément les résultats.

---

## Gestion des Favoris

Chaque utilisateur peut personnaliser son expérience en enregistrant des samples dans ses favoris.

Fonctionnalités :

- Ajout aux favoris
- Retrait des favoris
- Vue filtrée sur les favoris de l'utilisateur connecté

Les favoris sont propres à chaque utilisateur.

---

## Corbeille et Archivage

L'application privilégie une stratégie d'archivage plutôt que de suppression immédiate.

Fonctionnalités :

- Mise en corbeille
- Consultation de la corbeille
- Archivage partagé entre les utilisateurs
- Suppression définitive si nécessaire

Cette approche permet une meilleure traçabilité et réduit les risques de suppression accidentelle.

---

## Import et Export

Afin de faciliter les traitements en masse, l'application propose des mécanismes d'import et d'export.

### Import

- Import Excel en masse
- Validation des données importées
- Gestion des erreurs ligne par ligne

### Export

- Export CSV
- Export Excel
- Export des éléments sélectionnés uniquement

---

## Actions Groupées

Les utilisateurs peuvent sélectionner plusieurs samples afin d'appliquer des actions en masse.

Actions disponibles :

- Export des éléments sélectionnés
- Duplication de plusieurs samples
- Archivage groupé
- Activation groupée

---

## Dashboard et Statistiques

L'application propose un tableau de bord permettant de suivre les principaux indicateurs métier.

Indicateurs disponibles :

- Nombre total de samples
- Nombre de samples actifs
- Nombre de samples inactifs
- Nombre de favoris
- Nombre de samples archivés

Visualisations :

- Répartition par statut
- Répartition par catégorie
- Évolution des créations dans le temps

Le dashboard permet d'obtenir rapidement une vision globale du catalogue.

---

# Architecture Fonctionnelle

```text
Utilisateur
│
├── Authentification
│   ├── Login
│   ├── Logout
│   ├── Guard
│   └── Interceptor JWT
│
├── Catalogue de Samples
│   ├── Consultation
│   ├── Recherche
│   ├── Filtres
│   ├── CRUD
│   ├── Favoris
│   └── Corbeille
│
├── Traitements de Masse
│   ├── Import Excel
│   ├── Export CSV / Excel
│   └── Actions Groupées
│
└── Dashboard
    ├── KPI
    ├── Statistiques
    └── Graphiques
```

# Cas d'usage couverts

✅ Authentification sécurisée

✅ Gestion complète du cycle de vie d'un sample

✅ Recherche multicritère

✅ Gestion des favoris par utilisateur

✅ Archivage et corbeille

✅ Import massif de données

✅ Export sélectif de données

✅ Analyse statistique et reporting

✅ Interface moderne Angular 21 basée sur Signals et Standalone Components

# 🚧 Travaux en cours

Bien que l'application couvre déjà l'ensemble des fonctionnalités métier principales, plusieurs axes d'amélioration sont prévus afin de renforcer la qualité, la traçabilité et la maintenabilité de la solution.

---

## 🧪 Stratégie de Tests

La couverture applicative sera complétée par la mise en place d'une stratégie de tests complète.

### Tests Unitaires

Objectif :

- Validation de la logique métier
- Tests des services Angular
- Tests des Guards
- Tests des Interceptors
- Tests des Stores et Signals

Prévu :

```text
⬜ Tests unitaires des composants
⬜ Tests unitaires des services
⬜ Tests unitaires des Guards
⬜ Tests unitaires des Interceptors
⬜ Tests unitaires des Stores/Signals
```

### Tests d'Intégration

Prévu :

```text
⬜ Tests HttpClient
⬜ Tests d'intégration API
⬜ Validation des scénarios d'authentification
```

### Tests End-to-End

Les principaux parcours utilisateurs seront automatisés :

```text
⬜ Connexion / Déconnexion
⬜ Consultation du catalogue
⬜ Création d'un sample
⬜ Modification d'un sample
⬜ Gestion des favoris
⬜ Gestion de la corbeille
⬜ Import Excel
⬜ Export CSV / Excel
⬜ Consultation du Dashboard
```

---

## 📝 Historisation des Actions

Afin d'améliorer la traçabilité des opérations réalisées sur les samples, une fonctionnalité d'historisation sera ajoutée.

### Objectifs

- Suivre les modifications effectuées sur les samples
- Conserver un journal des actions utilisateur
- Faciliter les audits
- Améliorer l'investigation des incidents

### Entité cible

```java
@Entity
class SampleHistory {

    Long id;

    Long sampleId;

    HistoryAction action;

    String changedBy;

    LocalDateTime changedAt;

    @Lob
    String details;
}
```

### Actions Historisées

```text
⬜ Création
⬜ Modification
⬜ Duplication
⬜ Mise en favori
⬜ Retrait des favoris
⬜ Archivage
⬜ Restauration
⬜ Suppression définitive
⬜ Import en masse
```

### Interface Utilisateur Prévue

```text
Sample
└── Détail
    └── Historique
        ├── Timeline des événements
        ├── Auteur de l'action
        ├── Date de modification
        ├── Détail des changements
        └── Commentaires
```

---

## 🎯 Objectif Final

À terme, Angular Starter a vocation à proposer :

✅ Authentification sécurisée JWT

✅ Gestion complète d'un catalogue métier

✅ Dashboard et reporting

✅ Import / Export de données

✅ Actions groupées

✅ Architecture Angular moderne (Signals, Standalone, Lazy Loading)

✅ Historisation des actions

✅ Couverture de tests complète

✅ Base réutilisable pour des projets Angular d'entreprise