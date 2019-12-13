CREATE TABLE IF NOT EXISTS Countries (
    ID INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    COUNTRY VARCHAR(20) NOT NULL,
    ACTIVE BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS Companies (
    ID INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    COUNTRY_ID INT(10) NOT NULL,
    FOREIGN KEY (COUNTRY_ID) REFERENCES Countries(ID),
    CODE VARCHAR(8) NOT NULL,
    NAME VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS Hashtags (
  ID INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  COMPANY_ID INT(10) NOT NULL,
  FOREIGN KEY (COMPANY_ID) REFERENCES Companies(ID),
  HASHTAG VARCHAR(20) NOT NULL,
  TYPE VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS Prices (
    ID INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    COMPANY_ID INT(10) NOT NULL,
    FOREIGN KEY (COMPANY_ID) REFERENCES Companies(ID),
    OPEN FLOAT(8,2) NOT NULL,
    CLOSE FLOAT(8,2) NOT NULL,
    HIGH FLOAT(8,2) NOT NULL,
    LOW FLOAT(8,2) NOT NULL,
    VOLUME INT(10),
    DATE DATE
);

CREATE TABLE IF NOT EXISTS Events (
    ID INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    COMPANY_ID INT(10) NOT NULL,
    FOREIGN KEY (COMPANY_ID) REFERENCES Companies(ID),
    CREATED_DATE DATE NOT NULL,
    TYPE VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS Activities (
    ID INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    EVENT_ID INT(10) NOT NULL,
    FOREIGN KEY (EVENT_ID) REFERENCES Events(ID),
    PRICE_ID INT(10) NOT NULL,
    FOREIGN KEY (PRICE_ID) REFERENCES Prices(ID),
    TYPE VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS Tweets (
    ID INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    EVENT_ID INT(10),
    FOREIGN KEY (EVENT_ID) REFERENCES Events(ID),
    COMPANY_ID INT(10) NOT NULL,
    FOREIGN KEY (COMPANY_ID) REFERENCES Companies(ID),
    TOTAL INT(8) NOT NULL,
    DATE DATE NOT NULL,
    POSITIVE INT(8) NOT NULL,
    NEGATIVE INT(8) NOT NULL,
    NEUTRAL INT(8) NOT NULL
);

CREATE TABLE IF NOT EXISTS TweetBuffs (
    TWEET_ID VARCHAR(15) NOT NULL,
    DATE DATE NOT NULL
);

