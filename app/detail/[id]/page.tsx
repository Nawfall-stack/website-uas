import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { notFound } from "next/navigation";

// 1. Inisialisasi Supabase (Bisa diekstrak ke file terpisah nanti jika mau di-refactor)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Definisi Tipe Data
interface BankItem {
  id: number;
  title: string;
  category: string;
  type: string;
  content : string;
}

// 3. Komponen Server
// Next.js otomatis menyuntikkan (inject) nilai URL ke dalam 'params'
export default async function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("bank_materi")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (error || !data) {
    notFound();
  }

  const item = data as BankItem;

  return (
    <div>
      {/* Tombol kembali ke halaman indexing */}
      <Link href="/">
        ← Kembali ke Daftar
      </Link>
      
      <hr />

      {/* Bagian Header Detail */}
      <h1>{item.title}</h1>
      <ul>
        <li><strong>Kategori:</strong> {item.category}</li>
        <li><strong>Tipe:</strong> {item.type}</li>
      </ul>

      <br />

      {/* Area Konten Utama */}
      <div>
        <p>
          <em>
            {item.content}
          </em>
        </p>
      </div>
    </div>
  );
}