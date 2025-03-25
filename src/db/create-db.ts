import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function createDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: 'postgres' // Ana veritabanına bağlan
  });

  try {
    await client.connect();
    
    // Veritabanının var olup olmadığını kontrol et
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME || 'sportlink']
    );

    // Veritabanı yoksa oluştur
    if (result.rowCount === 0) {
      await client.query(`CREATE DATABASE ${process.env.DB_NAME || 'sportlink'}`);
      console.log('Veritabanı başarıyla oluşturuldu');
    } else {
      console.log('Veritabanı zaten mevcut');
    }
  } catch (err) {
    console.error('Veritabanı oluşturulurken hata:', err instanceof Error ? err.message : err);
  } finally {
    await client.end();
  }
}

// Script doğrudan çalıştırıldığında
if (require.main === module) {
  createDatabase();
}

export default createDatabase; 