CREATE TABLE run_entries (
    id TEXT NOT NULL,
    date_created DATE NOT NULL
    location TEXT NOT NULL,
    distance TEXT NOT NULL,
    hours TEXT NOT NULL,
    minutes TEXT NOT NULL,
    seconds TEXT NOT NULL,
    notes TEXT,
    public BOOLEAN NOT NULL,
);
