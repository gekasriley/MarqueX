const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'carden.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS garage_cars (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER,
    status TEXT DEFAULT 'current',
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT,
    category TEXT NOT NULL,
    hero_image TEXT,
    author TEXT,
    read_time INTEGER DEFAULT 5,
    published_at TEXT DEFAULT (datetime('now')),
    featured INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS bookmarks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    article_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (article_id) REFERENCES articles(id),
    UNIQUE(user_id, article_id)
  );

  CREATE TABLE IF NOT EXISTS listings (
    id TEXT PRIMARY KEY,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    color TEXT,
    mileage TEXT,
    condition TEXT,
    price INTEGER,
    price_label TEXT,
    platform TEXT NOT NULL,
    platform_logo TEXT,
    listing_type TEXT NOT NULL,
    listing_url TEXT,
    image_url TEXT,
    investment_grade INTEGER DEFAULT 0,
    body_style TEXT,
    description TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS market_data (
    id TEXT PRIMARY KEY,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year_label TEXT,
    data_year INTEGER NOT NULL,
    avg_price INTEGER NOT NULL,
    trend_pct REAL DEFAULT 0,
    era TEXT,
    price_tier TEXT
  );

  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    date TEXT NOT NULL,
    end_date TEXT,
    location TEXT NOT NULL,
    venue TEXT,
    event_type TEXT NOT NULL,
    description TEXT,
    featured_cars TEXT,
    ticket_url TEXT,
    image_url TEXT,
    featured INTEGER DEFAULT 0,
    region TEXT
  );

  CREATE TABLE IF NOT EXISTS saved_events (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    event_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id),
    UNIQUE(user_id, event_id)
  );

  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS replies (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    body TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS upvotes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(user_id, target_type, target_id)
  );

  CREATE TABLE IF NOT EXISTS auction_results (
    id TEXT PRIMARY KEY,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER,
    sale_price INTEGER NOT NULL,
    estimate_low INTEGER,
    estimate_high INTEGER,
    auction_house TEXT NOT NULL,
    sale_date TEXT NOT NULL,
    lot_number TEXT,
    notable INTEGER DEFAULT 0,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS hot_ten (
    id TEXT PRIMARY KEY,
    rank INTEGER NOT NULL,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year_range TEXT,
    current_value TEXT,
    trend TEXT,
    rationale TEXT,
    rarity TEXT DEFAULT 'Collectible',
    quarter TEXT
  );

  CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

module.exports = db;
