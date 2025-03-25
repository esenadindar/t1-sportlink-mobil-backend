import fs from 'fs';
import path from 'path';
import pool from '../config/database';

async function initializeDatabase() {
  try {
    // SQL dosyasını oku
    const sqlFile = path.join(__dirname, 'init.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf-8');

    // Veritabanı bağlantısını al
    const client = await pool.connect();

    try {
      // SQL komutlarını çalıştır
      await client.query(sqlContent);
      console.log('Veritabanı tabloları başarıyla oluşturuldu');
    } finally {
      // Bağlantıyı serbest bırak
      client.release();
    }
  } catch (error) {
    console.error('Veritabanı başlatılırken hata oluştu:', error);
    process.exit(1);
  } finally {
    // Havuzu kapat
    await pool.end();
  }
}

// Script doğrudan çalıştırıldığında
if (require.main === module) {
  initializeDatabase();
}

export default initializeDatabase; 