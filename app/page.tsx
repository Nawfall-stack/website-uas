'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// 1. Definisi Tipe Data (Interface)
// Ini memberi tahu TypeScript bentuk data yang akan kita terima dari Supabase
interface BankItem {
  id: number;
  title: string;
  category: string;
  type: string;
}

// 2. Inisialisasi Supabase
// Kita menggunakan `as string` karena TypeScript menganggap process.env bisa saja bernilai undefined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

const categories: string[] = ['All', 'Bahasa Indonesia', 'Matematika', 'Rekayasa Perangkat Lunak'];
const types: string[] = ['All', 'Materi', 'Soal'];

export default function IndexingPage() {
  // 3. Menambahkan Generic Type pada useState
  const [bankData, setBankData] = useState<BankItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      let query = supabase.from('bank_materi').select('*');

      if (selectedCategory !== 'All') {
        query = query.eq('category', selectedCategory);
      }

      if (selectedType !== 'All') {
        query = query.eq('type', selectedType);
      }

      if (searchQuery !== '') {
        query = query.or(`title.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,type.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error(error.message);
      } else {
        setBankData(data as BankItem[]);
      }

      setIsLoading(false);
    }

    loadData();
  }, [searchQuery, selectedCategory, selectedType]);

  return (
    <div>
      <h1>Bank Materi dan Soal (Supabase + TypeScript)</h1>

      <div>
        <label>Cari: </label>
        {/* Menambahkan React.ChangeEvent untuk event handler jika ingin dipisah, 
            meskipun secara inline TypeScript biasanya sudah bisa menebak (infer) otomatis */}
        <input type="text" placeholder="Ketik judul, kategori atau value ..." value={searchQuery} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)} />

        <label> Kategori: </label>
        <select value={selectedCategory} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label> Tipe: </label>
        <select value={selectedType} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedType(e.target.value)}>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <hr />

      <div>
        <h2>Hasil Pencarian: {bankData.length} item</h2>

        {isLoading ? (
          <p>Memuat data dari database...</p>
        ) : (
          <ul>
            {bankData.length > 0 ? (
              bankData.map((item) => (
                <li key={item.id}>
                  {/* Karena kita sudah memakai interface BankItem, 
                      mengetik 'item.' akan otomatis memunculkan auto-complete: id, title, category, type */}
                  <Link href={`/detail/${item.id}`}>
                    <strong>{item.title}</strong>
                  </Link>
                  <br />
                  <small>
                    Kategori: {item.category} | Tipe: {item.type}
                  </small>
                </li>
              ))
            ) : (
              <p>Data tidak ditemukan.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
