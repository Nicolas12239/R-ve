-- Rêve — schéma de la base de données (MariaDB / MySQL)
-- Importable directement dans phpMyAdmin, ou via `npm run db:setup`.

CREATE DATABASE IF NOT EXISTS `reve`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `reve`;

-- Les œuvres (récits en vers)
CREATE TABLE IF NOT EXISTS `works` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug`        VARCHAR(191) NOT NULL,
  `title`       VARCHAR(255) NOT NULL,
  `cover_title` VARCHAR(120) NOT NULL,
  `subtitle`    VARCHAR(255) NULL,
  `theme`       VARCHAR(160) NULL,
  `excerpt`     TEXT NULL,
  `epigraphs`   TEXT NULL COMMENT 'JSON : [{text, source}]',
  `content`     MEDIUMTEXT NOT NULL COMMENT 'Une ligne vide sépare chaque vers',
  `cover`       TEXT NOT NULL COMMENT 'JSON : {motif, palette, seed, titlePos}',
  `published`   TINYINT(1) NOT NULL DEFAULT 1,
  `views`       INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_works_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Les « j'aime » sur les œuvres (un par visiteur anonyme)
CREATE TABLE IF NOT EXISTS `work_likes` (
  `work_id`    INT UNSIGNED NOT NULL,
  `visitor_id` CHAR(36) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`work_id`, `visitor_id`),
  CONSTRAINT `fk_wl_work` FOREIGN KEY (`work_id`) REFERENCES `works` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Les commentaires : texte, « écrit » (vers partagés), sticker et/ou photo.
-- parent_id pointe toujours vers un commentaire de premier niveau (fil façon TikTok).
CREATE TABLE IF NOT EXISTS `comments` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `work_id`    INT UNSIGNED NOT NULL,
  `parent_id`  INT UNSIGNED NULL,
  `reply_to`   VARCHAR(40) NULL,
  `visitor_id` CHAR(36) NOT NULL,
  `author`     VARCHAR(40) NOT NULL,
  `kind`       ENUM('texte', 'ecrit') NOT NULL DEFAULT 'texte',
  `body`       TEXT NULL,
  `sticker`    VARCHAR(40) NULL,
  `image`      VARCHAR(120) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_comments_work` (`work_id`, `parent_id`, `created_at`),
  CONSTRAINT `fk_c_work`   FOREIGN KEY (`work_id`)   REFERENCES `works` (`id`)    ON DELETE CASCADE,
  CONSTRAINT `fk_c_parent` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Les « j'aime » sur les commentaires
CREATE TABLE IF NOT EXISTS `comment_likes` (
  `comment_id` INT UNSIGNED NOT NULL,
  `visitor_id` CHAR(36) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`, `visitor_id`),
  CONSTRAINT `fk_cl_comment` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
