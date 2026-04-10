## main
```sql
CREATE TABLE Personal (
  id INTEGER PRIMARY KEY,
  created_at DATETIME,
  updated_at DATETIME,
  variation TEXT,
  age INTEGER,
  location TEXT,
  visa TEXT,
  citizenship TEXT
);

CREATE TABLE education (
  id INTEGER PRIMARY KEY,
  created_at DATETIME,
  updated_at DATETIME,
  variation TEXT,
  main TEXT,
  degree TEXT,
  school TEXT,
  location TEXT,
  year TEXT
);
```