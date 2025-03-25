import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Veritabanı bağlantı havuzu yapılandırması
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'sportlink',
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20, // Maksimum bağlantı sayısı
  idleTimeoutMillis: 30000, // Boşta kalan bağlantıların timeout süresi
  connectionTimeoutMillis: 2000 // Bağlantı timeout süresi
});

// Bağlantıyı test et
async function testConnection() {
  try {
    const client = await pool.connect();
    try {
      await client.query('SELECT NOW()');
      console.log('PostgreSQL veritabanına başarıyla bağlanıldı');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Veritabanına bağlanırken hata oluştu:', err instanceof Error ? err.message : err);
  }
}

testConnection();

// Havuzdaki hataları dinle
pool.on('error', (err) => {
  console.error('Beklenmeyen havuz hatası:', err.message);
});

export default pool; 