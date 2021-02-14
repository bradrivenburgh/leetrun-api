CREATE TABLE run_entries (
    id TEXT PRIMARY KEY NOT NULL,
    date TEXT NOT NULL,
    location TEXT NOT NULL,
    distance TEXT NOT NULL,
    hours TEXT NOT NULL,
    minutes TEXT NOT NULL,
    seconds TEXT NOT NULL,
    notes TEXT,
    public BOOLEAN NOT NULL
);
