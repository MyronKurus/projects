# ************************************************************
# Sequel Pro SQL dump
# Version 4529
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: wardensity.com (MySQL 5.5.46-0ubuntu0.12.04.2)
# Database: dendotree
# Generation Time: 2016-03-22 11:20:12 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table tblCats
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tblCats`;

CREATE TABLE `tblCats` (
  `catId` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `catParent` mediumint(8) unsigned DEFAULT NULL,
  `catSiteId` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `catName` varchar(50) NOT NULL DEFAULT '',
  `catType` enum('images','text') NOT NULL DEFAULT 'images',
  `catClicks` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `catOrder` bigint(20) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`catId`),
  KEY `catSiteId` (`catSiteId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `tblCats` WRITE;
/*!40000 ALTER TABLE `tblCats` DISABLE KEYS */;

INSERT INTO `tblCats` (`catId`, `catParent`, `catSiteId`, `catName`, `catType`, `catClicks`, `catOrder`)
VALUES
	(1,NULL,1,'test1','text',0,2),
	(2,NULL,1,'test2','images',0,0),
	(3,2,1,'test2-sub1','images',0,1),
	(4,5,1,'test2-sub2','images',0,0),
	(5,NULL,1,' New Branch ','images',0,1),
	(6,2,1,' New Branch ','images',0,0);

/*!40000 ALTER TABLE `tblCats` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table tblItems
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tblItems`;

CREATE TABLE `tblItems` (
  `itemId` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `itemCatId` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `itemName` text,
  `itemText` text,
  `itemAdded` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `itemClicks` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `itemHomepage` tinyint(4) NOT NULL DEFAULT '1',
  `itemMailform` tinyint(4) NOT NULL DEFAULT '0',
  `itemOrder` bigint(20) unsigned NOT NULL DEFAULT '0',
  `itemWidth` smallint(5) unsigned DEFAULT NULL,
  `itemHeight` smallint(5) unsigned DEFAULT NULL,
  `itemWatermarkType` tinyint(4) NOT NULL DEFAULT '0',
  `itemType` enum('image','text') DEFAULT 'image',
  PRIMARY KEY (`itemId`),
  KEY `itemCatId` (`itemCatId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `tblItems` WRITE;
/*!40000 ALTER TABLE `tblItems` DISABLE KEYS */;

INSERT INTO `tblItems` (`itemId`, `itemCatId`, `itemName`, `itemText`, `itemAdded`, `itemClicks`, `itemHomepage`, `itemMailform`, `itemOrder`, `itemWidth`, `itemHeight`, `itemWatermarkType`, `itemType`)
VALUES
	(8,4,NULL,NULL,'2016-03-18 14:37:38',0,1,0,0,NULL,NULL,0,'image'),
	(10,3,NULL,NULL,'2016-03-18 15:46:16',0,1,0,0,NULL,NULL,0,'image'),
	(11,3,NULL,NULL,'2016-03-18 15:57:25',0,1,0,0,NULL,NULL,0,'image'),
	(17,0,NULL,'','2016-03-19 15:05:34',0,1,0,0,NULL,NULL,0,'image'),
	(18,3,NULL,NULL,'2016-03-21 19:22:24',0,1,0,0,NULL,NULL,0,'image'),
	(19,0,'',NULL,'2016-03-21 19:23:06',0,1,0,0,NULL,NULL,0,'image'),
	(20,0,'',NULL,'2016-03-22 10:43:41',0,1,0,0,NULL,NULL,0,'image'),
	(21,0,'',NULL,'2016-03-22 10:51:25',0,1,0,0,NULL,NULL,0,'image'),
	(22,4,NULL,NULL,'2016-03-22 10:57:31',0,1,0,0,NULL,NULL,0,'image'),
	(23,0,'',NULL,'2016-03-22 10:58:46',0,1,0,0,NULL,NULL,0,'image'),
	(24,1,NULL,NULL,'2016-03-22 11:11:20',0,1,0,0,NULL,NULL,0,'image'),
	(25,6,NULL,NULL,'2016-03-22 11:18:43',0,1,0,0,NULL,NULL,0,'image'),
	(26,6,'bb','','2016-03-22 11:18:47',0,1,0,0,NULL,NULL,0,'text');

/*!40000 ALTER TABLE `tblItems` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table tblSites
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tblSites`;

CREATE TABLE `tblSites` (
  `siteId` mediumint(11) unsigned NOT NULL AUTO_INCREMENT,
  `siteName` varchar(100) NOT NULL DEFAULT '',
  `siteProvider` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `siteType` tinyint(4) NOT NULL DEFAULT '2',
  `siteConId` mediumint(11) unsigned NOT NULL DEFAULT '0',
  `sitePassword` char(32) NOT NULL,
  `siteTheme` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `siteSummons` tinyint(4) NOT NULL DEFAULT '1',
  `siteDiscount` tinyint(3) unsigned DEFAULT '0',
  `siteStatus` enum('active','testing') NOT NULL DEFAULT 'testing',
  `siteActive` tinyint(4) NOT NULL DEFAULT '1',
  `siteText` text,
  `siteDate` date DEFAULT NULL,
  `siteExpires` date DEFAULT NULL,
  `siteLastLogin` datetime DEFAULT NULL,
  `siteExamples` tinyint(4) NOT NULL DEFAULT '0',
  `siteTitle` varchar(50) DEFAULT NULL,
  `siteEmail` varchar(50) DEFAULT NULL,
  `siteHomeText` text,
  `siteHomepageTitle` varchar(100) DEFAULT NULL,
  `siteDescription` text,
  `siteCopyBlock` tinyint(4) NOT NULL DEFAULT '1',
  `siteWatermarkType` tinyint(4) NOT NULL DEFAULT '2',
  `siteColor` enum('000','333','fff') NOT NULL DEFAULT '000',
  `siteFont` enum('Arial','Comic Sans','Courier','Georgia','Tahoma','Times','Lucida','Trebuchet','Verdana') NOT NULL DEFAULT 'Verdana',
  `siteUserCode` text NOT NULL,
  `siteMaxItems` smallint(5) unsigned NOT NULL DEFAULT '100',
  `siteFtp` smallint(6) unsigned NOT NULL DEFAULT '0',
  `siteShowBrand` tinyint(4) NOT NULL DEFAULT '1',
  `siteSocialMedia` text,
  PRIMARY KEY (`siteId`),
  UNIQUE KEY `siteName` (`siteName`),
  KEY `siteConId` (`siteConId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `tblSites` WRITE;
/*!40000 ALTER TABLE `tblSites` DISABLE KEYS */;

INSERT INTO `tblSites` (`siteId`, `siteName`, `siteProvider`, `siteType`, `siteConId`, `sitePassword`, `siteTheme`, `siteSummons`, `siteDiscount`, `siteStatus`, `siteActive`, `siteText`, `siteDate`, `siteExpires`, `siteLastLogin`, `siteExamples`, `siteTitle`, `siteEmail`, `siteHomeText`, `siteHomepageTitle`, `siteDescription`, `siteCopyBlock`, `siteWatermarkType`, `siteColor`, `siteFont`, `siteUserCode`, `siteMaxItems`, `siteFtp`, `siteShowBrand`, `siteSocialMedia`)
VALUES
	(1,'test',1,2,0,'',1,1,0,'testing',1,NULL,NULL,NULL,NULL,0,'TestX',NULL,'HOME',NULL,NULL,1,2,'000','Verdana','',100,0,1,NULL);

/*!40000 ALTER TABLE `tblSites` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table tblSiteUsers
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tblSiteUsers`;

CREATE TABLE `tblSiteUsers` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` char(20) NOT NULL DEFAULT '',
  `password` char(180) DEFAULT NULL,
  `salt` char(180) DEFAULT NULL,
  `siteId` mediumint(11) DEFAULT NULL,
  `sessions` char(180) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `tblSiteUsers` WRITE;
/*!40000 ALTER TABLE `tblSiteUsers` DISABLE KEYS */;

INSERT INTO `tblSiteUsers` (`id`, `username`, `password`, `salt`, `siteId`, `sessions`)
VALUES
	(1,'root','t5HxHmvyKVAtoHelIgeNkmcESUUBYH+ZEK7oZzar8p4=','t30gmrfr8pni56atfwg3t05rubi7nau',NULL,'[\"e0945cf2b37224fc64a3ad7bb2ac3934\",\"51610acbea31df6bae7ca401523f8619\"]');

/*!40000 ALTER TABLE `tblSiteUsers` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
