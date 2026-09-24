Installation et exécution du projet en local (React + Django)



Ce projet utilise une architecture frontend React et backend Django (API REST).

Pour valider le prototype en environnement local , suivre les étapes ci-dessous.





1) Installation de la base de données



Ouvrir MySQL Workbench



Aller dans Server → Data Import



Sélectionner le fichier Dump20251222.sql



Cliquer sur Start Import



Vérifier que la base de données est créée et contient les tables





3) Lancement du backend (API Django)

Dans un terminal, se placer dans le dossier nordikBackend puis exécuter :

.\nordikVenv\Scripts\Activate.ps1

pip install -r requirements.txt

 python manage.py makemigrations

 python manage.py migrate

 python manage.py runserver



Backend disponible sur :

http://127.0.0.1:8000/






3) Lancement du frontend (React)



Ouvrir un terminal dans le dossier frontend



Installer les dépendances



Lancer l’application React



Commandes à exécuter :



      npm install

      npm start





Le site web est accessible à l’adresse :



http://localhost:3000/



4) Identifiants de connexion (comptes de test)



Les comptes suivants sont fournis pour tester les différents rôles du système :



Magasinier



          Identifiant : nacera@nordik.com



          Mot de passe : nacera1234



Comptable



     Identifiant : lylia@nordik.com



     Mot de passe : lylia1234



Agent clientèle



    Identifiant : enrik@nordik.com



     Mot de passe : enrik123


Client

Identifiant : sedra@yahoo.com

Mot de passe : sedra2025



