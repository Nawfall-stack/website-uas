import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// 1. Inisialisasi Supabase (Bisa diekstrak ke file terpisah nanti jika mau di-refactor)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Definisi Tipe Data
interface MateriContent {
  sections: { heading: string; body: string }[];
}

interface SoalContent {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface BankItem {
  id: number;
  title: string;
  category: string;
  type: string;
  content: MateriContent | SoalContent;
}

// 3. Komponen Server
// Next.js otomatis menyuntikkan (inject) nilai URL ke dalam 'params'
export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data, error } = await supabase.from('bank_materi').select('*').eq('id', Number(id)).single<BankItem>();

  if (error || !data) {
    notFound();
  }

  const item = data;

  return (
    <div>
      {/* Tombol kembali ke halaman indexing */}
      <Link href="/">← Kembali ke Daftar</Link>

      <hr />

      {/* Bagian Header Detail */}
      <h1>{item.title}</h1>
      <ul>
        <li>
          <strong>Kategori:</strong> {item.category}
        </li>
        <li>
          <strong>Tipe:</strong> {item.type}
        </li>
      </ul>

      <br />

      {/* Area Konten Utama */}
      <div>
        {item.type.toLowerCase() === 'materi' && <RenderMateri content={item.content as MateriContent} />}

        {item.type.toLowerCase() === 'soal' && <RenderSoal content={item.content as SoalContent} />}
      </div>
    </div>
  );
}

function RenderMateri({ content }: { content: MateriContent }) {
  if (!content || !content.sections) return <p>Format JSON materi tidak valid.</p>;

  return (
    <div>
      {content.sections.map((sec, index) => (
        <div key={index}>
          <h2>{sec.heading}</h2>
          <p>{sec.body}</p>
        </div>
      ))}
    </div>
  );
}

function RenderSoal({ content }: { content: SoalContent }) {
  if (!content || !content.question) return <p>Format JSON soal tidak valid.</p>;

  return (
    <div>
      <h2>{content.question}</h2>

      <ul>
        {content.options?.map((opt, index) => (
          <li key={index}>{opt}</li>
        ))}
      </ul>

      <details>
        <summary>Lihat Jawaban & Pembahasan</summary>
        <div>
          <p>
            <strong>Jawaban Benar:</strong> {content.correct_answer}
          </p>
          <p>
            <strong>Pembahasan:</strong> {content.explanation}
          </p>
        </div>
      </details>
    </div>
  );
}
