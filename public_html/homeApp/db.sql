SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

CREATE SCHEMA IF NOT EXISTS `houseman` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ;
USE `houseman` ;

-- -----------------------------------------------------
-- Table `houseman`.`quarter`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `houseman`.`quarter` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `type` CHAR(2) NOT NULL ,
  `number` VARCHAR(30) NOT NULL ,
  `location` VARCHAR(100) NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `index2` (`type` ASC, `location` ASC, `number` ASC) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `houseman`.`person`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `houseman`.`person` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `name` VARCHAR(100) NOT NULL ,
  `office` VARCHAR(100) NULL ,
  `post` VARCHAR(100) NULL ,
  `gender` CHAR(1) NULL DEFAULT NULL ,
  `email` VARCHAR(80) NULL DEFAULT NULL ,
  `phone` VARCHAR(11) NULL DEFAULT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `index2` (`name` ASC, `office` ASC, `post` ASC) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `houseman`.`allocation`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `houseman`.`allocation` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `date_order` DATE NOT NULL ,
  `date_valid` DATE NULL DEFAULT NULL ,
  `date_possess` DATE NULL DEFAULT NULL ,
  `date_vacate` DATE NULL DEFAULT NULL ,
  `quarter_id` INT(11) NOT NULL ,
  `person_id` INT(11) NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_allocation_quarter1` (`quarter_id` ASC) ,
  INDEX `fk_allocation_person1` (`person_id` ASC) ,
  CONSTRAINT `fk_allocation_quarter1`
    FOREIGN KEY (`quarter_id` )
    REFERENCES `houseman`.`quarter` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_allocation_person1`
    FOREIGN KEY (`person_id` )
    REFERENCES `houseman`.`person` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `houseman`.`old_allocate`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `houseman`.`old_allocate` (
  `id` INT NOT NULL ,
  `date_order` DATE NOT NULL ,
  `date_valid` DATE NULL ,
  `date_possess` DATE NULL ,
  `date_vacate` DATE NULL ,
  `quarter_id` INT(11) NOT NULL ,
  `person_id` INT(11) NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_old_allocate_quarter1` (`quarter_id` ASC) ,
  INDEX `fk_old_allocate_person1` (`person_id` ASC) ,
  CONSTRAINT `fk_old_allocate_quarter1`
    FOREIGN KEY (`quarter_id` )
    REFERENCES `houseman`.`quarter` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_old_allocate_person1`
    FOREIGN KEY (`person_id` )
    REFERENCES `houseman`.`person` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;

CREATE VIEW allquarters AS
SELECT  q.id,q.type, q.location, q.number,
        a.date_order, a.date_valid, a.date_possess, a.date_vacate,
        p.name, p.office,p.post,
        case WHEN a.date_order IS NULL THEN 'unallotted'
             WHEN a.date_vacate IS NOT NULL THEN 'vacant'
             WHEN a.date_valid < CURDATE() THEN 'illegal'
             ELSE 'allotted' END AS status,
        CONCAT_WS(' ',q.location,q.number,p.name,p.post,p.office) as description
FROM quarter q
LEFT JOIN allocation a ON q.id = a.quarter_id
LEFT JOIN person p ON a.person_id = p.id;

-- -----------------------------------------------------
-- Table `houseman`.`users`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `houseman`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `username` VARCHAR(45) NOT NULL ,
  `password` VARCHAR(45) NOT NULL ,
  `name` VARCHAR(50) NULL ,
  `role` INT NOT NULL DEFAULT 4 ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

INSERT INTO `houseman`.`users` (`id`,`username`,`password`,`name`,`role`) VALUES (1,'admin','70e113da910470d08177f3f95b13d8ff','Admin',1);
