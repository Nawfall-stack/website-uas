import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// 1. Inisialisasi Supabase (Bisa diekstrak ke file terpisah nanti jika mau di-refactor)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Definisi Tipe Data
type Block =
  | {
      type: "heading";
      text: string;
    }
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "list";
      items: string[];
    }
  | {
      type: "quote";
      text: string;
      author?: string;
    };

interface MateriContent {
  blocks: Block[];
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

const isArabicText = (text: string): boolean => {
  if (!text) return false;
  // Regex untuk mendeteksi blok karakter Arabic
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
};

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
      <h1 dir={isArabicText(item.title) ? 'rtl' : 'ltr'}>{item.title}</h1>
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
  if (!content?.blocks) return <p>Format JSON tidak valid.</p>;
  

  const contentString = content.blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
        case "paragraph":
        case "quote":
          return block.text;
        case "list":
          return block.items.join(" ");
      }
    })
    .join(" ");

  const isArabic = isArabicText(contentString);

  return (
    <div dir={isArabic ? "rtl" : "ltr"} lang={isArabic ? "ar" : "id"}>
      {content.blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return <h2 key={index}>{block.text}</h2>;

          case "paragraph":
            return <p key={index}>{block.text}</p>;

          case "list":
            return (
              <ul key={index}>
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );

          case "quote":
            return (
              <blockquote key={index}>
                <p>{block.text}</p>
                {block.author && <footer>— {block.author}</footer>}
              </blockquote>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

function RenderSoal({ content }: { content: SoalContent }) {
  if (!content || !content.question) return <p>Format JSON soal tidak valid.</p>;

const contentString = `${content.question} ${content.options?.join(' ')} ${content.explanation}`;
  const isArabic = isArabicText(contentString);

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} 
      lang={isArabic ? 'ar' : 'id'}>
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
