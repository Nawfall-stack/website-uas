# Dokumentasi Struktur JSON Materi

## Tujuan

AI harus menghasilkan materi pembelajaran dalam format JSON yang sesuai dengan struktur database `bank_materi`. Output **hanya berupa JSON yang valid**, tanpa penjelasan tambahan, markdown, atau komentar.

---

# Struktur Utama

```json
{
  "sections": [
    {
      "title": "Nama Bagian",
      "blocks": []
    }
  ]
}
```

* Root object harus memiliki properti `sections`.
* `sections` berupa array.
* Setiap section memiliki:

  * `title`
  * `blocks`

---

# Struktur Section

```json
{
  "title": "Pendahuluan",
  "blocks": []
}
```

### Aturan

* `title` adalah judul bagian.
* `blocks` berisi kumpulan konten yang akan dirender secara berurutan.
* Satu section boleh memiliki banyak block.

Contoh:

```json
{
  "title": "Rukun Iman",
  "blocks": [
    {
      "type": "heading",
      "text": "Pengertian"
    },
    {
      "type": "paragraph",
      "text": "Rukun iman adalah..."
    }
  ]
}
```

---

# Jenis Block

AI hanya boleh menggunakan tipe berikut.

## 1. Heading

Untuk judul kecil.

```json
{
  "type": "heading",
  "text": "Pengertian"
}
```

---

## 2. Paragraph

Untuk penjelasan materi.

```json
{
  "type": "paragraph",
  "text": "Materi dijelaskan menggunakan beberapa kalimat yang mudah dipahami."
}
```

Gunakan beberapa paragraph apabila penjelasan panjang.

---

## 3. Quote

Untuk ayat, hadits, kutipan tokoh, rumus penting, definisi, atau catatan khusus.

```json
{
  "type": "quote",
  "text": "Sesungguhnya amal itu tergantung niatnya."
}
```

---

## 4. List

Untuk daftar poin.

```json
{
  "type": "list",
  "items": [
    "Poin pertama",
    "Poin kedua",
    "Poin ketiga"
  ]
}
```

Minimal dua item.

---

# Contoh Lengkap

```json
{
  "sections": [
    {
      "title": "Pendahuluan",
      "blocks": [
        {
          "type": "heading",
          "text": "Apa itu Rukun Iman?"
        },
        {
          "type": "paragraph",
          "text": "Rukun iman adalah enam pokok keimanan yang wajib diyakini oleh setiap muslim."
        }
      ]
    },
    {
      "title": "Isi Materi",
      "blocks": [
        {
          "type": "heading",
          "text": "Enam Rukun Iman"
        },
        {
          "type": "list",
          "items": [
            "Iman kepada Allah",
            "Iman kepada Malaikat",
            "Iman kepada Kitab-kitab Allah",
            "Iman kepada Rasul-rasul Allah",
            "Iman kepada Hari Akhir",
            "Iman kepada Qada dan Qadar"
          ]
        },
        {
          "type": "quote",
          "text": "Rasul telah beriman kepada apa yang diturunkan kepadanya dari Tuhannya... (QS. Al-Baqarah: 285)"
        },
        {
          "type": "paragraph",
          "text": "Setiap muslim wajib meyakini keenam rukun iman tersebut karena menjadi dasar aqidah Islam."
        }
      ]
    }
  ]
}
```

---

# Pedoman Pembuatan Materi

AI harus membuat materi yang:

* Sesuai dengan judul yang diminta.
* Disusun secara runtut dari dasar menuju pembahasan.
* Menggunakan bahasa yang mudah dipahami.
* Memiliki beberapa section apabila materi cukup panjang.
* Menggunakan heading untuk subjudul.
* Menggunakan paragraph untuk penjelasan.
* Menggunakan list bila terdapat poin-poin.
* Menggunakan quote untuk kutipan penting, ayat, hadits, definisi, atau rumus.

---

# Aturan Penting

1. Output harus JSON yang valid.
2. Jangan menghasilkan markdown.
3. Jangan menghasilkan penjelasan di luar JSON.
4. Jangan menambahkan field selain:

   * `sections`
   * `title`
   * `blocks`
   * `type`
   * `text`
   * `items`
5. Urutan block harus sesuai alur pembelajaran.
6. Semua string harus menggunakan tanda kutip ganda (`"`).
7. Tidak boleh ada koma yang berlebihan (trailing comma).
8. Semua block harus berada di dalam `blocks`.
9. Semua section harus berada di dalam `sections`.

---

# Kriteria Materi yang Baik

Setiap materi sebaiknya memiliki:

* Pendahuluan
* Penjelasan konsep
* Contoh (jika relevan)
* Ringkasan atau poin-poin penting
* Kutipan penting (opsional)

---

# Output yang Diharapkan

AI hanya mengembalikan objek JSON seperti berikut.

```json
{
  "sections": [
    {
      "title": "...",
      "blocks": [
        {
          "type": "heading",
          "text": "..."
        },
        {
          "type": "paragraph",
          "text": "..."
        }
      ]
    }
  ]
}
```
