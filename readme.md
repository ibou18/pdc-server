## Server APi basé sur Lagui+

Bienvenue sur l'API REST dédiée à la gestion d'un système de gestion, développée sous Node.js et Express avec une base de données PostgreSQL et l'ORM Sequelize.

Cette API fournit une interface pour la gestion des utilisateurs, des publications et des comptes rendus. Elle permet de réaliser des opérations CRUD (Create, Read, Update, Delete) sur ces différentes entités.

Les routes sont sécurisées avec des tokens d'authentification JWT, permettant ainsi de limiter l'accès aux fonctionnalités de l'API à des utilisateurs authentifiés.

La documentation de l'API est disponible à l'adresse suivante : [Doc a venir]. Elle vous permettra de comprendre les différentes routes et méthodes disponibles, ainsi que les différents paramètres acceptés.

Voici les principales fonctionnalités offertes par cette API :

Gestion des utilisateurs : création de compte, authentification, récupération et modification des informations de profil.
Gestion des films et séries : ajout, suppression, modification et récupération des informations (titre, bande annonce, genre, Tarif,etc.).
Gestion des locations : création d'une location pour un utilisateur donné, mise à jour de l'état de la location , récupération des locations en cours ou terminées pour un utilisateur donné.

Cette API a été développée avec Node.js et Express pour offrir une performance optimale et une grande flexibilité dans la mise en place de nouvelles fonctionnalités. La base de données PostgreSQL a été choisie pour sa stabilité et sa robustesse, tandis que l'ORM Sequelize facilite la gestion de la base de données.
