-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: nordikadventuresdb
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `api_achat`
--

DROP TABLE IF EXISTS `api_achat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_achat` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `commande_id` bigint DEFAULT NULL,
  `fournisseur_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `commande_id` (`commande_id`),
  KEY `api_achat_fournisseur_id_3a5214d3_fk_api_fournisseur_id` (`fournisseur_id`),
  CONSTRAINT `api_achat_commande_id_80b1746e_fk_api_commande_id` FOREIGN KEY (`commande_id`) REFERENCES `api_commande` (`id`),
  CONSTRAINT `api_achat_fournisseur_id_3a5214d3_fk_api_fournisseur_id` FOREIGN KEY (`fournisseur_id`) REFERENCES `api_fournisseur` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_achat`
--

LOCK TABLES `api_achat` WRITE;
/*!40000 ALTER TABLE `api_achat` DISABLE KEYS */;
INSERT INTO `api_achat` VALUES (1,1,4),(2,2,1),(3,3,2),(4,4,2),(5,5,7),(6,6,8),(7,7,4),(8,8,7),(9,9,1),(10,10,1);
/*!40000 ALTER TABLE `api_achat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_activite`
--

DROP TABLE IF EXISTS `api_activite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_activite` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `dateActivite` datetime(6) NOT NULL,
  `client_id` bigint DEFAULT NULL,
  `employe_id` bigint DEFAULT NULL,
  `commande_client_id` bigint DEFAULT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `fichier` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `page_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_activite_client_id_120ed123_fk_api_client_id` (`client_id`),
  KEY `api_activite_employe_id_170970f2_fk_api_employe_id` (`employe_id`),
  KEY `api_activite_commande_client_id_13e2630b_fk_api_comma` (`commande_client_id`),
  CONSTRAINT `api_activite_client_id_120ed123_fk_api_client_id` FOREIGN KEY (`client_id`) REFERENCES `api_client` (`id`),
  CONSTRAINT `api_activite_commande_client_id_13e2630b_fk_api_comma` FOREIGN KEY (`commande_client_id`) REFERENCES `api_commandeclient` (`id`),
  CONSTRAINT `api_activite_employe_id_170970f2_fk_api_employe_id` FOREIGN KEY (`employe_id`) REFERENCES `api_employe` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_activite`
--

LOCK TABLES `api_activite` WRITE;
/*!40000 ALTER TABLE `api_activite` DISABLE KEYS */;
INSERT INTO `api_activite` VALUES (1,'2025-12-22 12:17:41.164040',1,2,NULL,'AJOUTE DE DOCUMENT','crm/React_App.pdf',NULL,'PDF'),(2,'2025-12-22 20:24:04.067511',3,2,NULL,'Appeler le client pour confirmer l’adresse.','',NULL,'APPEL');
/*!40000 ALTER TABLE `api_activite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_client`
--

DROP TABLE IF EXISTS `api_client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_client` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nomUtilisateur` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courriel` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `statut` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `panier_id` bigint DEFAULT NULL,
  `derniere_activite` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `panier_id` (`panier_id`),
  CONSTRAINT `api_client_panier_id_6a9cc8e1_fk_api_panier_id` FOREIGN KEY (`panier_id`) REFERENCES `api_panier` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_client`
--

LOCK TABLES `api_client` WRITE;
/*!40000 ALTER TABLE `api_client` DISABLE KEYS */;
INSERT INTO `api_client` VALUES (1,'Lina','lina@yahoo.fr','lina@yahoo.fr','lina1234','fidele',1,'2025-12-22 18:36:31.442107'),(2,'Amine','amine@yahoo.fr','amine@yahoo.fr','amine2025','prospect',2,'2025-12-22 18:38:07.129553'),(3,'Sedra','sedra@yahoo.com','sedra@yahoo.com','sedra2025','actif',3,'2025-12-22 20:24:04.072487');
/*!40000 ALTER TABLE `api_client` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_commande`
--

DROP TABLE IF EXISTS `api_commande`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_commande` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `statut` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sous_total` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `tps` decimal(10,2) NOT NULL,
  `tvq` decimal(10,2) NOT NULL,
  `date_commande` datetime(6) NOT NULL,
  `date_reception` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_commande`
--

LOCK TABLES `api_commande` WRITE;
/*!40000 ALTER TABLE `api_commande` DISABLE KEYS */;
INSERT INTO `api_commande` VALUES (1,'EN_ATTENTE',0.00,0.00,0.00,0.00,'2025-12-20 22:59:53.926760',NULL),(2,'EN_ATTENTE',299.00,343.78,14.95,29.83,'2025-12-20 22:59:53.926760',NULL),(3,'RECEPTIONNEE',34.00,39.09,1.70,3.39,'2025-12-20 22:59:53.926760','2025-12-21 18:04:08.213128'),(4,'RECEPTIONNEE',54.00,62.09,2.70,5.39,'2025-12-20 22:59:53.926760','2025-12-20 23:14:19.701178'),(5,'RECEPTIONNEE',188.00,216.15,9.40,18.75,'2025-12-20 23:43:13.634743','2025-12-20 23:44:34.538384'),(6,'RECEPTIONNEE',145.00,166.71,7.25,14.46,'2025-12-20 23:58:01.886954','2025-12-20 23:59:48.080187'),(7,'RECEPTIONNEE',32.00,36.79,1.60,3.19,'2025-12-21 16:59:24.119573','2025-12-22 07:21:56.877189'),(8,'RECEPTIONNEE',177.00,203.51,8.85,17.66,'2025-12-21 18:05:33.151819','2025-12-21 18:07:05.279138'),(9,'RECEPTIONNEE',484.00,556.48,24.20,48.28,'2025-12-22 18:02:01.152657','2025-12-22 18:03:23.119178'),(10,'RECEPTIONNEE',299.00,343.78,14.95,29.83,'2025-12-22 20:18:09.528259','2025-12-22 20:19:27.443584');
/*!40000 ALTER TABLE `api_commande` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_commandeclient`
--

DROP TABLE IF EXISTS `api_commandeclient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_commandeclient` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `statut` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_creation` datetime(6) NOT NULL,
  `date_expedition` datetime(6) DEFAULT NULL,
  `client_id` bigint NOT NULL,
  `facture_id` bigint NOT NULL,
  `date_fermeture` datetime(6) DEFAULT NULL,
  `date_preparation` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `facture_id` (`facture_id`),
  KEY `api_commandeclient_client_id_a8fc509d_fk_api_client_id` (`client_id`),
  CONSTRAINT `api_commandeclient_client_id_a8fc509d_fk_api_client_id` FOREIGN KEY (`client_id`) REFERENCES `api_client` (`id`),
  CONSTRAINT `api_commandeclient_facture_id_bd60c9d5_fk_api_facture_id` FOREIGN KEY (`facture_id`) REFERENCES `api_facture` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_commandeclient`
--

LOCK TABLES `api_commandeclient` WRITE;
/*!40000 ALTER TABLE `api_commandeclient` DISABLE KEYS */;
INSERT INTO `api_commandeclient` VALUES (1,'EXPEDIEE','2025-12-21 19:27:20.061187','2025-12-21 19:39:46.482461',1,5,NULL,NULL),(2,'PAYEE','2025-12-21 21:45:01.700778',NULL,1,6,NULL,NULL),(3,'PREPARATION','2025-12-21 22:22:05.604545',NULL,1,7,NULL,'2025-12-21 22:22:54.934052'),(4,'PAYEE','2025-12-22 05:02:05.507440',NULL,1,8,NULL,NULL),(5,'PAYEE','2025-12-22 05:08:27.311657',NULL,1,9,NULL,NULL),(6,'PAYEE','2025-12-22 05:12:03.961827',NULL,1,10,NULL,NULL),(7,'PAYEE','2025-12-22 05:16:09.450535',NULL,1,11,NULL,NULL),(8,'PAYEE','2025-12-22 05:17:55.917149',NULL,1,12,NULL,NULL),(9,'PAYEE','2025-12-22 05:20:53.674071',NULL,1,13,NULL,NULL),(10,'PAYEE','2025-12-22 05:29:45.820764',NULL,1,14,NULL,NULL),(11,'PAYEE','2025-12-22 05:30:48.402685',NULL,1,15,NULL,NULL),(12,'PAYEE','2025-12-22 05:31:54.782769',NULL,1,16,NULL,NULL),(13,'PAYEE','2025-12-22 05:35:42.703358',NULL,1,17,NULL,NULL),(14,'PAYEE','2025-12-22 05:42:57.480021',NULL,1,18,NULL,NULL),(15,'FERMEE','2025-12-22 05:49:16.198865',NULL,1,19,'2025-12-22 06:06:24.901752',NULL),(16,'PAYEE','2025-12-22 05:53:12.142821',NULL,1,20,NULL,NULL),(17,'EXPEDIEE','2025-12-22 05:56:31.190103','2025-12-22 06:06:36.286104',1,21,NULL,NULL),(18,'FERMEE','2025-12-22 06:05:41.917903',NULL,1,22,'2025-12-22 06:06:29.308833',NULL),(19,'PAYEE','2025-12-22 10:11:11.386714',NULL,1,23,NULL,NULL),(20,'PAYEE','2025-12-22 12:19:40.130811',NULL,1,24,NULL,NULL),(21,'PREPARATION','2025-12-22 17:58:15.505073',NULL,1,25,NULL,'2025-12-22 18:00:24.289755'),(22,'PAYEE','2025-12-22 18:36:31.436886',NULL,1,26,NULL,NULL),(23,'PREPARATION','2025-12-22 20:10:02.259385',NULL,3,27,NULL,'2025-12-22 20:12:24.077746');
/*!40000 ALTER TABLE `api_commandeclient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_employe`
--

DROP TABLE IF EXISTS `api_employe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_employe` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nomUtilisateur` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courriel` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `panier_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `panier_id` (`panier_id`),
  CONSTRAINT `api_employe_panier_id_3d04c05b_fk_api_panier_id` FOREIGN KEY (`panier_id`) REFERENCES `api_panier` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_employe`
--

LOCK TABLES `api_employe` WRITE;
/*!40000 ALTER TABLE `api_employe` DISABLE KEYS */;
INSERT INTO `api_employe` VALUES (1,'Nacera','nacera@nordik.com','nacera@nordik.com','nacera1234','magasinier',NULL),(2,'Enrik','enrik@nordik.com','enrik@nordik.com','enrik123','agentclientele',NULL),(3,'Lylia','lylia@nordik.com','lylia@nordik.com','lylia1234','comptable',NULL),(4,'Amine','amine@nordik.com','amine@nordik.com','amine1234','gestionnaire',NULL);
/*!40000 ALTER TABLE `api_employe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_facture`
--

DROP TABLE IF EXISTS `api_facture`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_facture` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ParametresFiscaux_id` bigint DEFAULT NULL,
  `date` datetime(6) NOT NULL,
  `montant_ht` decimal(10,2) NOT NULL,
  `montant_taxes` decimal(10,2) NOT NULL,
  `montant_ttc` decimal(10,2) NOT NULL,
  `statut` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_facture_ParametresFiscaux_id_d44d6bde_fk_api_param` (`ParametresFiscaux_id`),
  CONSTRAINT `api_facture_ParametresFiscaux_id_d44d6bde_fk_api_param` FOREIGN KEY (`ParametresFiscaux_id`) REFERENCES `api_parametresfiscaux` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_facture`
--

LOCK TABLES `api_facture` WRITE;
/*!40000 ALTER TABLE `api_facture` DISABLE KEYS */;
INSERT INTO `api_facture` VALUES (1,NULL,'2025-12-21 09:24:34.253156',4436.00,664.29,5100.29,'PAYEE'),(2,NULL,'2025-12-21 17:27:23.976086',88.00,13.18,101.18,'PAYEE'),(3,NULL,'2025-12-21 18:02:48.348591',597.00,89.40,686.40,'PAYEE'),(5,NULL,'2025-12-21 19:27:20.052164',58.00,8.69,66.69,'PAYEE'),(6,NULL,'2025-12-21 21:45:01.698574',687.00,102.88,789.88,'PAYEE'),(7,NULL,'2025-12-21 22:22:05.602956',648.00,97.04,745.04,'PAYEE'),(8,NULL,'2025-12-22 05:02:05.504837',48.00,7.19,55.19,'PAYEE'),(9,NULL,'2025-12-22 05:08:27.310344',88.00,13.18,101.18,'PAYEE'),(10,NULL,'2025-12-22 05:12:03.960642',308.00,46.12,354.12,'PAYEE'),(11,NULL,'2025-12-22 05:16:09.449407',69.00,10.33,79.33,'PAYEE'),(12,NULL,'2025-12-22 05:17:55.915966',59.00,8.84,67.84,'PAYEE'),(13,NULL,'2025-12-22 05:20:53.671698',59.00,8.84,67.84,'PAYEE'),(14,NULL,'2025-12-22 05:29:45.818301',19.00,2.85,21.85,'PAYEE'),(15,NULL,'2025-12-22 05:30:48.401455',149.00,22.31,171.31,'PAYEE'),(16,NULL,'2025-12-22 05:31:54.780424',299.00,44.78,343.78,'PAYEE'),(17,NULL,'2025-12-22 05:35:42.701532',39.00,5.84,44.84,'PAYEE'),(18,NULL,'2025-12-22 05:42:57.478023',299.00,44.78,343.78,'PAYEE'),(19,NULL,'2025-12-22 05:49:16.197678',299.00,44.78,343.78,'PAYEE'),(20,NULL,'2025-12-22 05:53:12.139877',299.00,44.78,343.78,'PAYEE'),(21,NULL,'2025-12-22 05:56:31.188870',69.00,10.33,79.33,'PAYEE'),(22,NULL,'2025-12-22 06:05:41.915861',499.00,74.73,573.73,'PAYEE'),(23,NULL,'2025-12-22 10:11:11.383752',49.00,7.34,56.34,'PAYEE'),(24,NULL,'2025-12-22 12:19:40.127765',39.00,5.84,44.84,'PAYEE'),(25,NULL,'2025-12-22 17:58:15.502761',149.00,22.31,171.31,'PAYEE'),(26,NULL,'2025-12-22 18:36:31.435795',1958.00,293.21,2251.21,'PAYEE'),(27,NULL,'2025-12-22 20:10:02.255938',1446.00,216.54,1662.54,'PAYEE');
/*!40000 ALTER TABLE `api_facture` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_fournisseur`
--

DROP TABLE IF EXISTS `api_fournisseur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_fournisseur` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_fournisseur`
--

LOCK TABLES `api_fournisseur` WRITE;
/*!40000 ALTER TABLE `api_fournisseur` DISABLE KEYS */;
INSERT INTO `api_fournisseur` VALUES (1,'AventureX'),(2,'TrekSupply'),(3,'MontNord'),(4,'NordPack'),(5,'NordWear'),(6,'ArcticLine'),(7,'TechTrail'),(8,'EstWear'),(9,'NordWear'),(10,'WestWear');
/*!40000 ALTER TABLE `api_fournisseur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_itempanier`
--

DROP TABLE IF EXISTS `api_itempanier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_itempanier` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantite` int unsigned NOT NULL,
  `panier_id` bigint NOT NULL,
  `produit_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_itempanier_panier_id_7681a62c_fk_api_panier_id` (`panier_id`),
  KEY `api_itempanier_produit_id_8a9b55c4_fk_api_produit_id` (`produit_id`),
  CONSTRAINT `api_itempanier_panier_id_7681a62c_fk_api_panier_id` FOREIGN KEY (`panier_id`) REFERENCES `api_panier` (`id`),
  CONSTRAINT `api_itempanier_produit_id_8a9b55c4_fk_api_produit_id` FOREIGN KEY (`produit_id`) REFERENCES `api_produit` (`id`),
  CONSTRAINT `api_itempanier_chk_1` CHECK ((`quantite` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_itempanier`
--

LOCK TABLES `api_itempanier` WRITE;
/*!40000 ALTER TABLE `api_itempanier` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_itempanier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_lignecommande`
--

DROP TABLE IF EXISTS `api_lignecommande`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_lignecommande` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantite` int unsigned NOT NULL,
  `commande_id` bigint NOT NULL,
  `produit_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_lignecommande_commande_id_927e5548_fk_api_commande_id` (`commande_id`),
  KEY `api_lignecommande_produit_id_5fa753ab_fk_api_produit_id` (`produit_id`),
  CONSTRAINT `api_lignecommande_commande_id_927e5548_fk_api_commande_id` FOREIGN KEY (`commande_id`) REFERENCES `api_commande` (`id`),
  CONSTRAINT `api_lignecommande_produit_id_5fa753ab_fk_api_produit_id` FOREIGN KEY (`produit_id`) REFERENCES `api_produit` (`id`),
  CONSTRAINT `api_lignecommande_chk_1` CHECK ((`quantite` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_lignecommande`
--

LOCK TABLES `api_lignecommande` WRITE;
/*!40000 ALTER TABLE `api_lignecommande` DISABLE KEYS */;
INSERT INTO `api_lignecommande` VALUES (1,3,1,97),(2,2,1,98),(3,1,2,91),(4,2,2,95),(5,1,3,93),(6,1,3,101),(7,1,4,93),(8,1,4,101),(9,1,4,113),(10,1,5,116),(11,1,5,117),(12,1,5,119),(13,1,5,120),(14,1,6,121),(15,1,7,98),(16,1,8,116),(17,1,8,117),(18,1,8,119),(19,1,9,91),(20,1,9,92),(21,1,9,95),(22,1,10,91),(23,2,10,95);
/*!40000 ALTER TABLE `api_lignecommande` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_lignecommandeclient`
--

DROP TABLE IF EXISTS `api_lignecommandeclient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_lignecommandeclient` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantite` int unsigned NOT NULL,
  `commande_id` bigint NOT NULL,
  `produit_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_lignecommandecli_commande_id_77b304d9_fk_api_comma` (`commande_id`),
  KEY `api_lignecommandeclient_produit_id_7dd61d54_fk_api_produit_id` (`produit_id`),
  CONSTRAINT `api_lignecommandecli_commande_id_77b304d9_fk_api_comma` FOREIGN KEY (`commande_id`) REFERENCES `api_commandeclient` (`id`),
  CONSTRAINT `api_lignecommandeclient_produit_id_7dd61d54_fk_api_produit_id` FOREIGN KEY (`produit_id`) REFERENCES `api_produit` (`id`),
  CONSTRAINT `api_lignecommandeclient_chk_1` CHECK ((`quantite` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_lignecommandeclient`
--

LOCK TABLES `api_lignecommandeclient` WRITE;
/*!40000 ALTER TABLE `api_lignecommandeclient` DISABLE KEYS */;
INSERT INTO `api_lignecommandeclient` VALUES (1,1,1,112),(2,1,1,101),(3,1,2,92),(4,1,2,95),(5,1,2,112),(6,1,3,92),(7,1,3,95),(8,1,4,101),(9,1,4,96),(10,1,5,96),(11,1,5,93),(12,1,6,99),(13,1,6,97),(14,1,7,114),(15,1,8,110),(16,1,9,93),(17,1,10,101),(18,1,11,95),(19,1,12,91),(20,1,13,112),(21,1,14,91),(22,1,15,91),(23,1,16,91),(24,1,17,114),(25,1,18,92),(26,1,19,113),(27,1,20,112),(28,1,21,95),(29,22,22,105),(30,1,23,91),(31,2,23,92),(32,1,23,95);
/*!40000 ALTER TABLE `api_lignecommandeclient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_lignefacture`
--

DROP TABLE IF EXISTS `api_lignefacture`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_lignefacture` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantite` int unsigned NOT NULL,
  `facture_id` bigint NOT NULL,
  `produit_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_lignefacture_facture_id_12165e87_fk_api_facture_id` (`facture_id`),
  KEY `api_lignefacture_produit_id_a6441580_fk_api_produit_id` (`produit_id`),
  CONSTRAINT `api_lignefacture_facture_id_12165e87_fk_api_facture_id` FOREIGN KEY (`facture_id`) REFERENCES `api_facture` (`id`),
  CONSTRAINT `api_lignefacture_produit_id_a6441580_fk_api_produit_id` FOREIGN KEY (`produit_id`) REFERENCES `api_produit` (`id`),
  CONSTRAINT `api_lignefacture_chk_1` CHECK ((`quantite` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_lignefacture`
--

LOCK TABLES `api_lignefacture` WRITE;
/*!40000 ALTER TABLE `api_lignefacture` DISABLE KEYS */;
INSERT INTO `api_lignefacture` VALUES (1,3,1,92),(2,10,1,116),(3,1,1,95),(4,1,2,96),(5,1,2,110),(6,2,3,95),(7,1,3,91),(8,1,5,112),(9,1,5,101),(10,1,6,92),(11,1,6,95),(12,1,6,112),(13,1,7,92),(14,1,7,95),(15,1,8,101),(16,1,8,96),(17,1,9,96),(18,1,9,93),(19,1,10,99),(20,1,10,97),(21,1,11,114),(22,1,12,110),(23,1,13,93),(24,1,14,101),(25,1,15,95),(26,1,16,91),(27,1,17,112),(28,1,18,91),(29,1,19,91),(30,1,20,91),(31,1,21,114),(32,1,22,92),(33,1,23,113),(34,1,24,112),(35,1,25,95),(36,22,26,105),(37,1,27,91),(38,2,27,92),(39,1,27,95);
/*!40000 ALTER TABLE `api_lignefacture` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_mouvementstock`
--

DROP TABLE IF EXISTS `api_mouvementstock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_mouvementstock` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantite` int unsigned NOT NULL,
  `dateMouvement` datetime(6) NOT NULL,
  `estAjout` tinyint(1) NOT NULL,
  `motif` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `produit_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_mouvementstock_produit_id_bd2521ee_fk_api_produit_id` (`produit_id`),
  CONSTRAINT `api_mouvementstock_produit_id_bd2521ee_fk_api_produit_id` FOREIGN KEY (`produit_id`) REFERENCES `api_produit` (`id`),
  CONSTRAINT `api_mouvementstock_chk_1` CHECK ((`quantite` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_mouvementstock`
--

LOCK TABLES `api_mouvementstock` WRITE;
/*!40000 ALTER TABLE `api_mouvementstock` DISABLE KEYS */;
INSERT INTO `api_mouvementstock` VALUES (1,1,'2025-12-20 22:24:18.554944',1,'Réception commande #4',93),(2,1,'2025-12-20 22:24:18.570645',1,'Réception commande #4',101),(3,1,'2025-12-20 22:24:18.577290',1,'Réception commande #4',113),(4,1,'2025-12-20 23:44:34.520398',1,'Réception commande #5',116),(5,1,'2025-12-20 23:44:34.529635',1,'Réception commande #5',117),(6,1,'2025-12-20 23:44:34.533517',1,'Réception commande #5',119),(7,1,'2025-12-20 23:44:34.536714',1,'Réception commande #5',120),(8,1,'2025-12-20 23:59:48.076211',1,'Réception commande #6',121),(9,1,'2025-12-21 18:04:08.196026',1,'Réception commande #3',93),(10,1,'2025-12-21 18:04:08.210718',1,'Réception commande #3',101),(11,1,'2025-12-21 18:07:05.269874',1,'Réception commande #8',116),(12,1,'2025-12-21 18:07:05.274814',1,'Réception commande #8',117),(13,1,'2025-12-21 18:07:05.277938',1,'Réception commande #8',119),(14,1,'2025-12-22 07:21:56.871782',1,'Réception commande #7',98),(15,1,'2025-12-22 18:03:23.102693',1,'Réception commande #9',91),(16,1,'2025-12-22 18:03:23.114039',1,'Réception commande #9',92),(17,1,'2025-12-22 18:03:23.118025',1,'Réception commande #9',95),(18,1,'2025-12-22 20:19:27.426659',1,'Réception commande #10',91),(19,2,'2025-12-22 20:19:27.441930',1,'Réception commande #10',95);
/*!40000 ALTER TABLE `api_mouvementstock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_paiement`
--

DROP TABLE IF EXISTS `api_paiement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_paiement` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` datetime(6) NOT NULL,
  `montant` decimal(10,2) NOT NULL,
  `mode` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `facture_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `api_paiement_facture_id_a1f33030_fk_api_facture_id` (`facture_id`),
  CONSTRAINT `api_paiement_facture_id_a1f33030_fk_api_facture_id` FOREIGN KEY (`facture_id`) REFERENCES `api_facture` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_paiement`
--

LOCK TABLES `api_paiement` WRITE;
/*!40000 ALTER TABLE `api_paiement` DISABLE KEYS */;
INSERT INTO `api_paiement` VALUES (1,'2025-12-21 09:24:34.280939',5100.29,'carte',1),(2,'2025-12-21 17:27:23.982102',101.18,'carte',2),(3,'2025-12-21 18:02:48.354563',686.40,'carte',3),(4,'2025-12-21 19:27:20.068579',66.69,'carte',5),(5,'2025-12-21 21:45:01.708994',789.88,'carte',6),(6,'2025-12-21 22:22:05.611190',745.04,'carte',7),(7,'2025-12-22 05:02:05.522333',55.19,'carte',8),(8,'2025-12-22 05:08:27.316994',101.18,'carte',9),(9,'2025-12-22 05:12:03.967418',354.12,'carte',10),(10,'2025-12-22 05:16:09.454040',79.33,'carte',11),(11,'2025-12-22 05:17:55.920106',67.84,'carte',12),(12,'2025-12-22 05:20:53.678228',67.84,'carte',13),(13,'2025-12-22 05:29:45.824473',21.85,'carte',14),(14,'2025-12-22 05:30:48.406232',171.31,'carte',15),(15,'2025-12-22 05:31:54.786604',343.78,'carte',16),(16,'2025-12-22 05:35:42.706251',44.84,'carte',17),(17,'2025-12-22 05:42:57.485664',343.78,'carte',18),(18,'2025-12-22 05:49:16.201411',343.78,'carte',19),(19,'2025-12-22 05:53:12.146874',343.78,'carte',20),(20,'2025-12-22 05:56:31.192639',79.33,'carte',21),(21,'2025-12-22 06:05:41.921585',573.73,'carte',22),(22,'2025-12-22 10:11:11.411449',56.34,'carte',23),(23,'2025-12-22 12:19:40.140954',44.84,'carte',24),(24,'2025-12-22 17:58:15.509555',171.31,'carte',25),(25,'2025-12-22 18:36:31.440222',2251.21,'carte',26),(26,'2025-12-22 20:10:02.268820',1662.54,'carte',27);
/*!40000 ALTER TABLE `api_paiement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_paiementachat`
--

DROP TABLE IF EXISTS `api_paiementachat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_paiementachat` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` datetime(6) DEFAULT NULL,
  `montant_paye` decimal(10,2) NOT NULL,
  `solde` decimal(10,2) NOT NULL,
  `statut` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mode` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `commande_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `commande_id` (`commande_id`),
  CONSTRAINT `api_paiementachat_commande_id_61bd889b_fk_api_commande_id` FOREIGN KEY (`commande_id`) REFERENCES `api_commande` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_paiementachat`
--

LOCK TABLES `api_paiementachat` WRITE;
/*!40000 ALTER TABLE `api_paiementachat` DISABLE KEYS */;
INSERT INTO `api_paiementachat` VALUES (1,'2025-12-20 17:37:55.649891',343.78,0.00,'PAYE','carte',2),(2,'2025-12-20 19:16:41.214874',39.09,0.00,'PAYE','virement',3),(3,'2025-12-20 20:44:22.729582',62.09,0.00,'PAYE','carte',4),(4,'2025-12-20 23:43:52.863139',216.15,0.00,'PAYE','carte',5),(5,'2025-12-20 23:59:06.826176',166.71,0.00,'PAYE','carte',6),(6,NULL,0.00,36.79,'EN_ATTENTE','carte',7),(7,'2025-12-21 18:06:29.469351',203.51,0.00,'PAYE','carte',8),(8,'2025-12-22 18:02:45.989712',556.48,0.00,'PAYE','carte',9),(9,'2025-12-22 20:18:53.881527',343.78,0.00,'PAYE','carte',10);
/*!40000 ALTER TABLE `api_paiementachat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_panier`
--

DROP TABLE IF EXISTS `api_panier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_panier` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_panier`
--

LOCK TABLES `api_panier` WRITE;
/*!40000 ALTER TABLE `api_panier` DISABLE KEYS */;
INSERT INTO `api_panier` VALUES (1),(2),(3);
/*!40000 ALTER TABLE `api_panier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_parametresfiscaux`
--

DROP TABLE IF EXISTS `api_parametresfiscaux`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_parametresfiscaux` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `codeTaxe` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `taux` decimal(6,5) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_parametresfiscaux`
--

LOCK TABLES `api_parametresfiscaux` WRITE;
/*!40000 ALTER TABLE `api_parametresfiscaux` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_parametresfiscaux` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_produit`
--

DROP TABLE IF EXISTS `api_produit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_produit` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `coutAchat` decimal(10,2) NOT NULL,
  `statut` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `seuilReapprovisionnement` int unsigned NOT NULL,
  `quantite_dispo` int unsigned NOT NULL,
  `stockMinimum` int unsigned NOT NULL,
  `prixVente` decimal(10,2) NOT NULL,
  `categorieProduit` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `delaiLivraison` int unsigned NOT NULL,
  `fournisseur_id` bigint NOT NULL,
  `image` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `api_produit_sku_2716aec9_uniq` (`sku`),
  KEY `api_produit_fournisseur_id_2e7d9117_fk_api_fournisseur_id` (`fournisseur_id`),
  CONSTRAINT `api_produit_fournisseur_id_2e7d9117_fk_api_fournisseur_id` FOREIGN KEY (`fournisseur_id`) REFERENCES `api_fournisseur` (`id`),
  CONSTRAINT `api_produit_chk_1` CHECK ((`seuilReapprovisionnement` >= 0)),
  CONSTRAINT `api_produit_chk_2` CHECK ((`quantite_dispo` >= 0)),
  CONSTRAINT `api_produit_chk_3` CHECK ((`stockMinimum` >= 0)),
  CONSTRAINT `api_produit_chk_4` CHECK ((`delaiLivraison` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_produit`
--

LOCK TABLES `api_produit` WRITE;
/*!40000 ALTER TABLE `api_produit` DISABLE KEYS */;
INSERT INTO `api_produit` VALUES (91,'Tente légère 2 places','NC-TNT-001',149.00,'actif',5,14,4,299.00,'Tentes & abris',10,1,'produits/NC-TNT-001.jpg'),(92,'Tente familiale 6 places','NC-TNT-002',260.00,'actif',3,4,2,499.00,'Tentes & abris',14,1,'produits/NC-TNT-002.jpg'),(93,'Toile imperméable 3x3 m','NC-TNT-003',25.00,'actif',8,25,5,59.00,'Tentes & abris',7,2,'produits/NC-TNT-003.jpg'),(94,'Tapis de sol isolant','NC-TNT-004',18.00,'actif',10,40,6,39.00,'Tentes & abris',6,3,'produits/NC-TNT-004.jpg'),(95,'Abri cuisine pliable','NC-TNT-005',75.00,'actif',4,7,3,149.00,'Tentes & abris',9,1,'produits/NC-TNT-005.jpg'),(96,'Mât télescopique alu','NC-TNT-006',12.00,'actif',10,27,6,29.00,'Tentes & abris',5,2,'produits/NC-TNT-006.jpg'),(97,'Sac à dos 50 L étanche','NC-SAC-001',65.00,'actif',6,19,4,139.00,'Sacs & portage',8,4,'produits/NC-SAC-001.jpg'),(98,'Sac de jour 25 L','NC-SAC-002',32.00,'actif',8,26,5,79.00,'Sacs & portage',7,4,'produits/NC-SAC-002.jpg'),(99,'Sac de couchage -10°C','NC-SAC-003',80.00,'actif',5,14,3,169.00,'Sacs & portage',10,3,'produits/NC-SAC-003.jpg'),(100,'Tapis autogonflant','NC-SAC-004',25.00,'actif',10,35,5,59.00,'Sacs & portage',6,3,'produits/NC-SAC-004.jpg'),(101,'Housse imperméable sac à dos','NC-SAC-005',9.00,'actif',10,39,6,19.00,'Sacs & portage',5,2,'produits/NC-SAC-005.jpg'),(102,'Bâtons de marche carbone','NC-SAC-006',35.00,'actif',5,18,3,79.00,'Sacs & portage',9,2,'produits/NC-SAC-006.jpg'),(103,'Chandail thermique homme','NC-VET-001',22.00,'actif',15,50,10,59.00,'Vêtements techniques',6,5,'produits/NC-VET-001.jpg'),(104,'Chandail thermique femme','NC-VET-002',22.00,'actif',15,48,10,59.00,'Vêtements techniques',6,5,'produits/NC-VET-002.jpg'),(105,'Pantalon de randonnée homme','NC-VET-003',38.00,'actif',8,8,4,89.00,'Vêtements techniques',8,5,'produits/NC-VET-003.jpg'),(106,'Pantalon de randonnée femme','NC-VET-004',38.00,'actif',8,32,4,89.00,'Vêtements techniques',8,5,'produits/NC-VET-004.jpg'),(107,'Manteau coupe-vent','NC-VET-005',55.00,'actif',5,20,3,129.00,'Vêtements techniques',10,6,'produits/NC-VET-005.jpg'),(108,'Tuque en laine mérinos','NC-VET-006',10.00,'actif',10,40,6,29.00,'Vêtements techniques',5,6,'produits/NC-VET-006.jpg'),(109,'Gants isolants Hiver+','NC-VET-007',18.00,'actif',8,25,4,45.00,'Vêtements techniques',6,6,'produits/NC-VET-007.jpg'),(110,'Réchaud portatif','NC-ACC-001',25.00,'actif',5,18,3,59.00,'Accessoires & cuisine',7,2,'produits/NC-ACC-001.jpg'),(111,'Bouteille isotherme 1L','NC-ACC-002',12.00,'actif',12,40,8,29.00,'Accessoires & cuisine',5,3,'produits/NC-ACC-002.jpg'),(112,'Lampe frontale 300 lumens','NC-ACC-003',14.00,'actif',10,31,6,39.00,'Accessoires & cuisine',6,1,'produits/NC-ACC-003.jpg'),(113,'Ensemble vaisselle 4 pers.','NC-ACC-004',20.00,'actif',8,25,5,49.00,'Accessoires & cuisine',7,2,'produits/NC-ACC-004.jpg'),(114,'Filtre à eau compact','NC-ACC-005',28.00,'actif',5,16,3,69.00,'Accessoires & cuisine',8,1,'produits/NC-ACC-005.jpg'),(115,'Couteau multifonction','NC-ACC-006',15.00,'actif',10,28,6,39.00,'Accessoires & cuisine',6,4,'produits/NC-ACC-006.jpg'),(116,'Montre GPS plein air','NC-ELE-001',120.00,'actif',3,2,2,279.00,'Électronique & navigation',12,7,'produits/NC-ELE-001.jpg'),(117,'Chargeur solaire 20W','NC-ELE-002',35.00,'actif',5,20,3,79.00,'Électronique & navigation',8,7,'produits/NC-ELE-002.jpg'),(118,'Boussole de précision','NC-ELE-003',9.00,'actif',12,40,8,24.00,'Électronique & navigation',5,2,'produits/NC-ELE-003.jpg'),(119,'Radio météo portable','NC-ELE-004',22.00,'actif',5,17,3,49.00,'Électronique & navigation',7,7,'produits/NC-ELE-004.jpg'),(120,'Lampe USB rechargeable','NC-ELE-005',11.00,'actif',10,36,6,25.00,'Électronique & navigation',5,7,'produits/NC-ELE-005.jpg'),(121,'Parka Nordik Explorer','NA-PARKA-001',145.00,'actif',4,20,5,249.99,'Vêtements d’hiver',2,8,'produits/NA-PARKA-001.JPG');
/*!40000 ALTER TABLE `api_produit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_satisfaction`
--

DROP TABLE IF EXISTS `api_satisfaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_satisfaction` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `note` int NOT NULL,
  `commentaire` longtext COLLATE utf8mb4_unicode_ci,
  `date_creation` datetime(6) NOT NULL,
  `client_id` bigint NOT NULL,
  `commande_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `commande_id` (`commande_id`),
  KEY `api_satisfaction_client_id_974cf422_fk_api_client_id` (`client_id`),
  CONSTRAINT `api_satisfaction_client_id_974cf422_fk_api_client_id` FOREIGN KEY (`client_id`) REFERENCES `api_client` (`id`),
  CONSTRAINT `api_satisfaction_commande_id_9d6a84ad_fk_api_commandeclient_id` FOREIGN KEY (`commande_id`) REFERENCES `api_commandeclient` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_satisfaction`
--

LOCK TABLES `api_satisfaction` WRITE;
/*!40000 ALTER TABLE `api_satisfaction` DISABLE KEYS */;
INSERT INTO `api_satisfaction` VALUES (1,5,NULL,'2025-12-22 05:18:06.552856',1,8),(2,4,NULL,'2025-12-22 05:20:58.169363',1,9),(3,5,'MERCI ','2025-12-22 06:05:54.401369',1,18),(4,4,'merci pour le produit','2025-12-22 10:11:23.391834',1,19),(5,4,NULL,'2025-12-22 12:19:42.210141',1,20),(6,5,'MERCI','2025-12-22 17:58:27.207202',1,21),(7,5,NULL,'2025-12-22 18:36:33.543009',1,22),(8,5,'bon produit','2025-12-22 20:10:50.596099',3,23);
/*!40000 ALTER TABLE `api_satisfaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_vente`
--

DROP TABLE IF EXISTS `api_vente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_vente` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `client_id` bigint DEFAULT NULL,
  `facture_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `facture_id` (`facture_id`),
  KEY `api_vente_client_id_6587d855_fk_api_client_id` (`client_id`),
  CONSTRAINT `api_vente_client_id_6587d855_fk_api_client_id` FOREIGN KEY (`client_id`) REFERENCES `api_client` (`id`),
  CONSTRAINT `api_vente_facture_id_7ad0ae52_fk_api_facture_id` FOREIGN KEY (`facture_id`) REFERENCES `api_facture` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_vente`
--

LOCK TABLES `api_vente` WRITE;
/*!40000 ALTER TABLE `api_vente` DISABLE KEYS */;
INSERT INTO `api_vente` VALUES (1,1,1),(2,1,2),(3,1,3),(4,1,5),(5,1,6),(6,1,7),(7,1,8),(8,1,9),(9,1,10),(10,1,11),(11,1,12),(12,1,13),(13,1,14),(14,1,15),(15,1,16),(16,1,17),(17,1,18),(18,1,19),(19,1,20),(20,1,21),(21,1,22),(22,1,23),(23,1,24),(24,1,25),(25,1,26),(26,3,27);
/*!40000 ALTER TABLE `api_vente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add commande',7,'add_commande'),(26,'Can change commande',7,'change_commande'),(27,'Can delete commande',7,'delete_commande'),(28,'Can view commande',7,'view_commande'),(29,'Can add facture',8,'add_facture'),(30,'Can change facture',8,'change_facture'),(31,'Can delete facture',8,'delete_facture'),(32,'Can view facture',8,'view_facture'),(33,'Can add fournisseur',9,'add_fournisseur'),(34,'Can change fournisseur',9,'change_fournisseur'),(35,'Can delete fournisseur',9,'delete_fournisseur'),(36,'Can view fournisseur',9,'view_fournisseur'),(37,'Can add panier',10,'add_panier'),(38,'Can change panier',10,'change_panier'),(39,'Can delete panier',10,'delete_panier'),(40,'Can view panier',10,'view_panier'),(41,'Can add parametres fiscaux',11,'add_parametresfiscaux'),(42,'Can change parametres fiscaux',11,'change_parametresfiscaux'),(43,'Can delete parametres fiscaux',11,'delete_parametresfiscaux'),(44,'Can view parametres fiscaux',11,'view_parametresfiscaux'),(45,'Can add achat',12,'add_achat'),(46,'Can change achat',12,'change_achat'),(47,'Can delete achat',12,'delete_achat'),(48,'Can view achat',12,'view_achat'),(49,'Can add paiement',13,'add_paiement'),(50,'Can change paiement',13,'change_paiement'),(51,'Can delete paiement',13,'delete_paiement'),(52,'Can view paiement',13,'view_paiement'),(53,'Can add employe',14,'add_employe'),(54,'Can change employe',14,'change_employe'),(55,'Can delete employe',14,'delete_employe'),(56,'Can view employe',14,'view_employe'),(57,'Can add client',15,'add_client'),(58,'Can change client',15,'change_client'),(59,'Can delete client',15,'delete_client'),(60,'Can view client',15,'view_client'),(61,'Can add produit',16,'add_produit'),(62,'Can change produit',16,'change_produit'),(63,'Can delete produit',16,'delete_produit'),(64,'Can view produit',16,'view_produit'),(65,'Can add mouvement stock',17,'add_mouvementstock'),(66,'Can change mouvement stock',17,'change_mouvementstock'),(67,'Can delete mouvement stock',17,'delete_mouvementstock'),(68,'Can view mouvement stock',17,'view_mouvementstock'),(69,'Can add ligne facture',18,'add_lignefacture'),(70,'Can change ligne facture',18,'change_lignefacture'),(71,'Can delete ligne facture',18,'delete_lignefacture'),(72,'Can view ligne facture',18,'view_lignefacture'),(73,'Can add ligne commande',19,'add_lignecommande'),(74,'Can change ligne commande',19,'change_lignecommande'),(75,'Can delete ligne commande',19,'delete_lignecommande'),(76,'Can view ligne commande',19,'view_lignecommande'),(77,'Can add item panier',20,'add_itempanier'),(78,'Can change item panier',20,'change_itempanier'),(79,'Can delete item panier',20,'delete_itempanier'),(80,'Can view item panier',20,'view_itempanier'),(81,'Can add vente',21,'add_vente'),(82,'Can change vente',21,'change_vente'),(83,'Can delete vente',21,'delete_vente'),(84,'Can view vente',21,'view_vente'),(85,'Can add activite',22,'add_activite'),(86,'Can change activite',22,'change_activite'),(87,'Can delete activite',22,'delete_activite'),(88,'Can view activite',22,'view_activite'),(89,'Can add paiement achat',23,'add_paiementachat'),(90,'Can change paiement achat',23,'change_paiementachat'),(91,'Can delete paiement achat',23,'delete_paiementachat'),(92,'Can view paiement achat',23,'view_paiementachat'),(93,'Can add ligne commande client',24,'add_lignecommandeclient'),(94,'Can change ligne commande client',24,'change_lignecommandeclient'),(95,'Can delete ligne commande client',24,'delete_lignecommandeclient'),(96,'Can view ligne commande client',24,'view_lignecommandeclient'),(97,'Can add commande client',25,'add_commandeclient'),(98,'Can change commande client',25,'change_commandeclient'),(99,'Can delete commande client',25,'delete_commandeclient'),(100,'Can view commande client',25,'view_commandeclient'),(101,'Can add satisfaction',26,'add_satisfaction'),(102,'Can change satisfaction',26,'change_satisfaction'),(103,'Can delete satisfaction',26,'delete_satisfaction'),(104,'Can view satisfaction',26,'view_satisfaction');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext COLLATE utf8mb4_unicode_ci,
  `object_repr` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(12,'api','achat'),(22,'api','activite'),(15,'api','client'),(7,'api','commande'),(25,'api','commandeclient'),(14,'api','employe'),(8,'api','facture'),(9,'api','fournisseur'),(20,'api','itempanier'),(19,'api','lignecommande'),(24,'api','lignecommandeclient'),(18,'api','lignefacture'),(17,'api','mouvementstock'),(13,'api','paiement'),(23,'api','paiementachat'),(10,'api','panier'),(11,'api','parametresfiscaux'),(16,'api','produit'),(26,'api','satisfaction'),(21,'api','vente'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(5,'contenttypes','contenttype'),(6,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2025-12-18 21:10:10.252029'),(2,'auth','0001_initial','2025-12-18 21:10:10.829828'),(3,'admin','0001_initial','2025-12-18 21:10:10.961601'),(4,'admin','0002_logentry_remove_auto_add','2025-12-18 21:10:10.982373'),(5,'admin','0003_logentry_add_action_flag_choices','2025-12-18 21:10:11.017849'),(6,'api','0001_initial','2025-12-18 21:10:12.339853'),(7,'contenttypes','0002_remove_content_type_name','2025-12-18 21:10:12.454378'),(8,'auth','0002_alter_permission_name_max_length','2025-12-18 21:10:12.520384'),(9,'auth','0003_alter_user_email_max_length','2025-12-18 21:10:12.563240'),(10,'auth','0004_alter_user_username_opts','2025-12-18 21:10:12.575259'),(11,'auth','0005_alter_user_last_login_null','2025-12-18 21:10:12.634384'),(12,'auth','0006_require_contenttypes_0002','2025-12-18 21:10:12.637420'),(13,'auth','0007_alter_validators_add_error_messages','2025-12-18 21:10:12.644957'),(14,'auth','0008_alter_user_username_max_length','2025-12-18 21:10:12.716358'),(15,'auth','0009_alter_user_last_name_max_length','2025-12-18 21:10:12.788825'),(16,'auth','0010_alter_group_name_max_length','2025-12-18 21:10:12.815079'),(17,'auth','0011_update_proxy_permissions','2025-12-18 21:10:12.842910'),(18,'auth','0012_alter_user_first_name_max_length','2025-12-18 21:10:12.912739'),(19,'sessions','0001_initial','2025-12-18 21:10:12.950325'),(20,'api','0002_produit_image_alter_produit_sku','2025-12-19 00:42:47.360732'),(21,'api','0003_alter_achat_commande','2025-12-20 10:20:22.767371'),(22,'api','0004_remove_commande_parametresfiscaux_and_more','2025-12-20 17:37:31.423395'),(23,'api','0005_commande_date_commande_commande_date_reception','2025-12-20 22:59:54.058097'),(24,'api','0006_alter_paiementachat_date','2025-12-20 23:57:35.047617'),(25,'api','0007_remove_facture_statut_facture_date_and_more','2025-12-21 07:59:28.369210'),(26,'api','0008_facture_statut','2025-12-21 09:24:01.354115'),(27,'api','0009_commandeclient_lignecommandeclient','2025-12-21 19:26:58.309289'),(28,'api','0010_commandeclient_date_fermeture_and_more','2025-12-21 21:20:22.446596'),(29,'api','0011_satisfaction','2025-12-22 04:23:45.801168'),(30,'api','0012_client_derniere_activite_alter_activite_dateactivite','2025-12-22 09:32:08.684578'),(31,'api','0013_alter_client_derniere_activite','2025-12-22 09:53:41.255128'),(32,'api','0014_remove_activite_vente_activite_commande_client_and_more','2025-12-22 11:02:06.712228');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `session_data` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-22 16:39:35
