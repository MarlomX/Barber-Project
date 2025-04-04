CREATE DATABASE  IF NOT EXISTS `barberdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `barberdb`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: barberdb
-- ------------------------------------------------------
-- Server version	8.0.41

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
-- Dumping data for table `agendamento`
--

LOCK TABLES `agendamento` WRITE;
/*!40000 ALTER TABLE `agendamento` DISABLE KEYS */;
INSERT INTO `agendamento` VALUES (1,'Pendente',1,1,1,1),(2,'Pendente',2,2,1,2),(3,'Pendente',3,3,1,3),(4,'Pendente',4,4,2,1),(5,'Pendente',5,5,2,2),(6,'Pendente',6,6,2,3),(7,'Pendente',7,7,3,1),(8,'Pendente',8,8,3,2),(9,'Pendente',9,9,3,3),(10,'Pendente',10,1,1,4),(11,'Pendente',11,4,2,4),(12,'Pendente',12,7,3,4);
/*!40000 ALTER TABLE `agendamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `barbeiro`
--

LOCK TABLES `barbeiro` WRITE;
/*!40000 ALTER TABLE `barbeiro` DISABLE KEYS */;
INSERT INTO `barbeiro` VALUES (1,'João Barbeiro'),(2,'Roberto Estilo'),(3,'Felipe Designer');
/*!40000 ALTER TABLE `barbeiro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES (1,'Carlos Silva','carlos@email.com','senha123'),(2,'Ana Souza','ana@email.com','senha123'),(3,'Pedro Oliveira','pedro@email.com','senha123'),(4,'Mariana Lima','mariana@email.com','senha123'),(5,'Fernando Costa','fernando@email.com','senha123'),(6,'Beatriz Almeida','beatriz@email.com','senha123'),(7,'Lucas Mendes','lucas@email.com','senha123'),(8,'Julia Rocha','julia@email.com','senha123'),(9,'Gabriel Martins','gabriel@email.com','senha123'),(10,'Larissa Campos','larissa@email.com','senha123'),(11,'Ricardo Teixeira','ricardo@email.com','senha123'),(12,'Sofia Ferreira','sofia@email.com','senha123');
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `corte`
--

LOCK TABLES `corte` WRITE;
/*!40000 ALTER TABLE `corte` DISABLE KEYS */;
INSERT INTO `corte` VALUES (1,'Corte Simples',30,'corte_simples.jpg',1),(2,'Degradê',40,'degrade.jpg',1),(3,'Navalhado',50,'navalhado.jpg',1),(4,'Corte Moderno',35,'moderno.jpg',2),(5,'Riscado',45,'riscado.jpg',2),(6,'Undercut',55,'undercut.jpg',2),(7,'Moicano',32,'moicano.jpg',3),(8,'Samurai',50,'samurai.jpg',3),(9,'Buzz Cut',28,'buzzcut.jpg',3);
/*!40000 ALTER TABLE `corte` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `fila`
--

LOCK TABLES `fila` WRITE;
/*!40000 ALTER TABLE `fila` DISABLE KEYS */;
INSERT INTO `fila` VALUES (1,'2024-04-10');
/*!40000 ALTER TABLE `fila` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `fila_barbeiro`
--

LOCK TABLES `fila_barbeiro` WRITE;
/*!40000 ALTER TABLE `fila_barbeiro` DISABLE KEYS */;
INSERT INTO `fila_barbeiro` VALUES (1,1,1,5),(2,1,2,5),(3,1,3,5);
/*!40000 ALTER TABLE `fila_barbeiro` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-03 17:36:13
