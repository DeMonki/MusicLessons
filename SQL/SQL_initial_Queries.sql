
--  CREATE TABLE Users (
--     Id int IDENTITY (100, 1) NOT NULL PRIMARY KEY,
--     FirstName VARCHAR(50),
--     LastName VARCHAR(60),
--     UserName VARCHAR(20) UNIQUE,
--     StudioName VARCHAR(60),
--     Email VARCHAR(100) UNIQUE,
--     Password VARCHAR(60)
-- );

--DROP TABLE Users

-- INSERT INTO Users (FirstName, LastName, UserName, StudioName, Email, Password)
--  VALUES ('Paul', 'Jean', 'SuperUser', 'SparkHouse', 'saul@jean.com', 'gzle77'),
--  ('Paul', 'Jon', 'DuperUser', 'KnowHouse', 'Paul@jean.com', 'gzle77'),
--  ('Saul', 'Kean', 'AnotherUser', 'DarkHouse', 'saul@Kean.com', 'grizzle79'),
--  ('Ben', 'Jen', 'DiffUser', 'LightHouse', 'ban@jean.com', 'guuzle73'),
--  ('Matt', 'Hearn', 'BoozerUser', 'Mouse', 'matt@ean.com', 'guzzle33'),
--  ('Sean', 'Spark', 'SparkUser', 'SparkHouse', 'sean@jspark.com', 'jocko23'),
--  ('Fred', 'Gion', 'MyUser', 'Fedora', 'fred@fired.com', 'wacko45');


-- IF NOT EXISTS (SELECT * FROM Users
-- WHERE UserName = 'DeMonki'
-- )
-- INSERT INTO Users (FirstName, LastName, UserName, StudioName, Email, Password)
-- VALUES('Paul', 'Jean', 'SuperUser', 'SparkHouse', 'saul@jean.com', 'gzle77');




SELECT * FROM Users;
