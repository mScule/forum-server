-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.6.7-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for forum_db
CREATE DATABASE IF NOT EXISTS `forum_db` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `forum_db`;

-- Dumping structure for table forum_db.publications
CREATE TABLE IF NOT EXISTS `publications` (
  `publication_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `type` enum('post','comment') NOT NULL,
  `title` char(255) NOT NULL,
  `content` text NOT NULL,
  `private` bit(1) NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`publication_id`),
  UNIQUE KEY `title` (`title`),
  UNIQUE KEY `content` (`content`) USING HASH,
  KEY `fk_publications_users` (`user_id`),
  CONSTRAINT `fk_publications_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.

-- Dumping structure for table forum_db.users
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` char(50) NOT NULL,
  `email` varchar(345) NOT NULL,
  `password` char(255) NOT NULL,
  `image` mediumblob DEFAULT NULL,
  `disabled` bit(1) NOT NULL,
  `forum_api_key` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `password` (`password`),
  UNIQUE KEY `forum_api_key` (`forum_api_key`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.

-- Dumping structure for table forum_db.votes
CREATE TABLE IF NOT EXISTS `votes` (
  `publication_id` int(11) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `vote` enum('upvote','downvote') NOT NULL,
  KEY `fk_votes_user_id` (`user_id`) USING BTREE,
  KEY `fk_votes_publications` (`publication_id`),
  CONSTRAINT `fk_votes_publications` FOREIGN KEY (`publication_id`) REFERENCES `publications` (`publication_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_votes_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
