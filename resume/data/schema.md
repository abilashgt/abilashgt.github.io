## resume_data.db

```
# sqlite3 resume_data.db
```

## version
```sql
CREATE TABLE version (
    id INTEGER PRIMARY KEY,
    version_date DATE,
    version_text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## main
```sql
CREATE TABLE contacts (
  id INTEGER PRIMARY KEY,
  version_id INTEGER,
  linkedin TEXT,
  email TEXT,
  phone TEXT
);

CREATE TABLE personal (
  id INTEGER PRIMARY KEY,
  version_id INTEGER,
  age INTEGER,
  location TEXT,
  visa TEXT,
  citizenship TEXT
);

CREATE TABLE education (
  id INTEGER PRIMARY KEY,
  version_id INTEGER,
  main TEXT,
  degree TEXT,
  school TEXT,
  university TEXT,
  location TEXT,
  year TEXT
);
```