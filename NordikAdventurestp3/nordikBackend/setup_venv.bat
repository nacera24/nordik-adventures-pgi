@echo off
echo Création de l'environnement virtuel pour les dépendances
python -m venv nordikVenv

echo Activation de l'environnement virtuel
call nordikVenv\Scripts\activate

echo Installation des dépendances
pip install -r package_requirements.txt

echo Fini!