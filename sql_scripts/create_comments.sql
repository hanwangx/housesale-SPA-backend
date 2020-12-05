CREATE TABLE comments (
  ID INT NOT NULL AUTO_INCREMENT,  
  allText TEXT NOT NULL,
  dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
  dateModified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  articleID INT NOT NULL,
  authorID INT NOT NULL,
  PRIMARY KEY (ID),
  FOREIGN KEY (authorID) REFERENCES users (ID) ON DELETE CASCADE,
  FOREIGN KEY (articleID) REFERENCES articles (ID) ON DELETE CASCADE
);
