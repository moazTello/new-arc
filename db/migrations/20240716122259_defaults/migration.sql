-- This is an empty migration.

-- make id start from 1001
INSERT INTO Project (
  "id",
  "createdAt",
  "updatedAt",
  "recordingDate",
  "code",
  "name",
  "client",
  "serverNumber"
) VALUES (
  1000,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  "p999",
  "n999",
  "c999",
  1
);

DELETE FROM Project WHERE "id"=1000;

-- default servers record 
INSERT INTO Servers (
  "id",
  "count",
  "createdAt",
  "updatedAt"
) VALUES (
  1,
  6,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- default project types
INSERT INTO Type (
  "name",
  "updatedAt"
) VALUES 
  ("Video", CURRENT_TIMESTAMP),
  ("Audio", CURRENT_TIMESTAMP),
  ("Podcast", CURRENT_TIMESTAMP),
  ("Marketing", CURRENT_TIMESTAMP),
  ("Public Relations", CURRENT_TIMESTAMP),
  ("Motion Graphic", CURRENT_TIMESTAMP),
  ("Design", CURRENT_TIMESTAMP),
  ("Web Development", CURRENT_TIMESTAMP),
  ("Events", CURRENT_TIMESTAMP);
