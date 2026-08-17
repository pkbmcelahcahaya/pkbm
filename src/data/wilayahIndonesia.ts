// Dataset Wilayah Indonesia untuk Pendaftaran PKBM Dapodik
export interface WilayahOption {
  provinsi: string;
  kabupaten: {
    nama: string;
    kecamatan: {
      nama: string;
      kelurahan: string[];
    }[];
  }[];
}

export const WILAYAH_INDONESIA: WilayahOption[] = [
  {
    provinsi: 'Jawa Barat',
    kabupaten: [
      {
        nama: 'Kab. Garut',
        kecamatan: [
          {
            nama: 'Singajaya',
            kelurahan: ['Sukawangi', 'Karangagung', 'Pancakarya', 'Girijaya', 'Ciudian', 'Sukaresmi', 'Kebonmangga', 'Cigintung', 'Mekartani']
          },
          {
            nama: 'Garut Kota',
            kelurahan: ['Kota Kulon', 'Kota Wetan', 'Margawati', 'Muara Sanding', 'Paminggir', 'Pakuwon', 'Regol', 'Sukamaju', 'Sukaratu', 'Cimuncang', 'Ciwalen']
          },
          {
            nama: 'Tarogong Kidul',
            kelurahan: ['Haurpanggung', 'Jayaraga', 'Jayawaras', 'Sukabakti', 'Sukagalih', 'Sukakarya', 'Tarogong']
          },
          {
            nama: 'Tarogong Kaler',
            kelurahan: ['Cimanganten', 'Jati', 'Panjiwangi', 'Pasawahan', 'Rancabango', 'Sirnajaya', 'Sukajadi', 'Sukawangi']
          },
          {
            nama: 'Cikajang',
            kelurahan: ['Cikajang', 'Cibodas', 'Cikandang', 'Cipangeurteuk', 'Girijaya', 'Margamulya', 'Mekarsari', 'Padasuka', 'Simpang']
          },
          {
            nama: 'Cisurupan',
            kelurahan: ['Balewangi', 'Cidatar', 'Cisero', 'Cisurupan', 'Pakambangan', 'Pamulihan', 'Situsari', 'Sukawargi', 'Tambakbaya']
          },
          {
            nama: 'Pameungpeuk',
            kelurahan: ['Pameungpeuk', 'Bojong', 'Bojong Kidul', 'Mancagahar', 'Mandalakasih', 'Paas', 'Sirnabakti']
          },
          {
            nama: 'Banyuresmi',
            kelurahan: ['Bagendit', 'Banyuresmi', 'Binakarya', 'Cimurah', 'Karyamukti', 'Karyasari', 'Pamekarsari', 'Sukakarya', 'Sukalaksana', 'Sukamukti', 'Sukasenang']
          }
        ]
      },
      {
        nama: 'Kab. Bandung',
        kecamatan: [
          { nama: 'Baleendah', kelurahan: ['Baleendah', 'Andir', 'Jelekong', 'Malakasari', 'Manggahang', 'Wargamekar'] },
          { nama: 'Banjaran', kelurahan: ['Banjaran', 'Banjaran Wetan', 'Ciapus', 'Kamasan', 'Kiangroke', 'Margahurip', 'Mekarjaya', 'Pasirmulya', 'Sindangpanon', 'Tarajusari'] },
          { nama: 'Ciparay', kelurahan: ['Babakan', 'Ciheulang', 'Cikoneng', 'Ciparay', 'Gunungleutik', 'Manggungharja', 'Mekarsari', 'Pakutandang', 'Sarimahi', 'Serangmekar', 'Sumbersari'] },
          { nama: 'Dayeuhkolot', kelurahan: ['Cangkuang Kulon', 'Cangkuang Wetan', 'Citeureup', 'Dayeuhkolot', 'Pasawahan', 'Sukapura'] },
          { nama: 'Katapang', kelurahan: ['Banyusari', 'Cilampeni', 'Gandasari', 'Katapang', 'Pangauban', 'Sangkanhurip', 'Sukamukti'] },
          { nama: 'Majalaya', kelurahan: ['Biru', 'Bojong', 'Majakerta', 'Majalaya', 'Majasetra', 'Neglasari', 'Padamulya', 'Pasirwangi', 'Sukamaju', 'Sukasari', 'Wangisagara'] },
          { nama: 'Margahayu', kelurahan: ['Margahayu Selatan', 'Margahayu Tengah', 'Sayati', 'Sukamenak', 'Sulaeman'] },
          { nama: 'Pacet', kelurahan: ['Cikawao', 'Cikitu', 'Cinanggela', 'Maruyung', 'Mandalahaji', 'Nagrak', 'Pangauban', 'Sukajaya', 'Sukarame', 'Tanjungwangi'] },
          { nama: 'Pameungpeuk', kelurahan: ['Bojongkunci', 'Bojongmanggu', 'Langonsari', 'Rancamulya', 'Rancatungku', 'Sukasari'] },
          { nama: 'Rancaekek', kelurahan: ['Bojongloa', 'Bojongsalam', 'Cangkuang', 'Haurpugur', 'Jelegong', 'Linggar', 'Nanjungmekar', 'Rancaekek Kulon', 'Rancaekek Wetan', 'Rancaekek Kencana', 'Sangiang', 'Sukamanah', 'Sukamulya', 'Tegalsumedang'] },
          { nama: 'Soreang', kelurahan: ['Cingcin', 'Karamatmulya', 'Panyirapan', 'Pamekaran', 'Sadu', 'Sekarwangi', 'Soreang', 'Sukajadi', 'Sukanagara'] }
        ]
      },
      {
        nama: 'Kota Bandung',
        kecamatan: [
          { nama: 'Andir', kelurahan: ['Campaka', 'Ciroyom', 'Dunguscariang', 'Garuda', 'Kebon Jeruk', 'Maleber'] },
          { nama: 'Astana Anyar', kelurahan: ['Cibadak', 'Karanganyar', 'Karasak', 'Nyengseret', 'Panjunan', 'Pelindung Hewan'] },
          { nama: 'Babakan Ciparay', kelurahan: ['Babakan', 'Babakan Ciparay', 'Cirangrang', 'Margahayu Utara', 'Margasuka', 'Sukahaji'] },
          { nama: 'Batununggal', kelurahan: ['Binong', 'Cibangkong', 'Gumuruh', 'Kacapiring', 'Kebon Gedang', 'Kebon Kangkung', 'Maleer', 'Samoja'] },
          { nama: 'Bojongloa Kaler', kelurahan: ['Babakan Asih', 'Babakan Tarogong', 'Jamika', 'Kopo', 'Suka Asih'] },
          { nama: 'Bojongloa Kidul', kelurahan: ['Cibaduyut', 'Cibaduyut Kidul', 'Cibaduyut Wetan', 'Kebon Lega', 'Karasak', 'Mekarwangi', 'Situsaeur'] },
          { nama: 'Buahbatu', kelurahan: ['Cijawura', 'Jatisari', 'Margasari', 'Sekejati'] },
          { nama: 'Cibeunying Kaler', kelurahan: ['Cigadung', 'Cihaur Geulis', 'Neglasari', 'Sukaluyu'] },
          { nama: 'Cibeunying Kidul', kelurahan: ['Cicadas', 'Cikutra', 'Padasuka', 'Pasirlayung', 'Sukamaju', 'Sukapada'] },
          { nama: 'Coblong', kelurahan: ['Cipaganti', 'Dago', 'Lebak Gede', 'Lebak Siliwangi', 'Sadang Serang', 'Sekeloa'] },
          { nama: 'Kiaracondong', kelurahan: ['Babakan Sari', 'Babakan Surabaya', 'Cicaheum', 'Kebon Jayanti', 'Kebon Kangkung', 'Sukapura'] },
          { nama: 'Lengkong', kelurahan: ['Burangrang', 'Cijagra', 'Cikawao', 'Lingkar Selatan', 'Malabar', 'Palasari', 'Paledang', 'Turangga'] },
          { nama: 'Regol', kelurahan: ['Ancol', 'Balonggede', 'Ciateul', 'Cigereleng', 'Ciseureuh', 'Pasirluyu', 'Pungkur'] },
          { nama: 'Sukajadi', kelurahan: ['Cipedes', 'Pasteur', 'Sukabungah', 'Sukagalih', 'Sukawarna'] }
        ]
      },
      {
        nama: 'Kota Cimahi',
        kecamatan: [
          { nama: 'Cimahi Selatan', kelurahan: ['Cibeber', 'Cibeureum', 'Leuwigajah', 'Melong', 'Pasirkaliki', 'Utama'] },
          { nama: 'Cimahi Tengah', kelurahan: ['Baros', 'Cigugur Tengah', 'Cimahi', 'Karangmekar', 'Padasuka', 'Setiamanah'] },
          { nama: 'Cimahi Utara', kelurahan: ['Cipageran', 'Citeureup', 'Pasirkaliki'] }
        ]
      },
      {
        nama: 'Kab. Bandung Barat',
        kecamatan: [
          { nama: 'Lembang', kelurahan: ['Cibogo', 'Cikahuripan', 'Cikidang', 'Cikole', 'Gudangkahuripan', 'Jayagiri', 'Kayuambon', 'Lembang', 'Pagerwangi', 'Sukajaya', 'Suntenjaya', 'Wangunharja', 'Wangunsari'] },
          { nama: 'Ngamprah', kelurahan: ['Bojongkoneng', 'Cilame', 'Cimanggu', 'Cimareme', 'Gadobangkong', 'Margajaya', 'Mekarsari', 'Ngamprah', 'Pakuhaji', 'Rancapanggung', 'Sukatani'] },
          { nama: 'Padalarang', kelurahan: ['Cempakamekar', 'Ciburuy', 'Cimerang', 'Kertajaya', 'Kertamulya', 'Laksanamekar', 'Padalarang', 'Tagogapu'] },
          { nama: 'Parongpong', kelurahan: ['Cigugur Girang', 'Cihanjuang', 'Cihanjuang Rahayu', 'Cihideung', 'Ciwaruga', 'Karyawangi', 'Sariwangi'] }
        ]
      },
      {
        nama: 'Kab. Bogor',
        kecamatan: [
          { nama: 'Cibinong', kelurahan: ['Cirimekar', 'Ciriung', 'Harapan Jaya', 'Karadenan', 'Nanggewer', 'Nanggewer Mekar', 'Pabuaran', 'Pabuaran Mekar', 'Pakansari', 'Pondok Rajeg', 'Sukahati', 'Tengah'] },
          { nama: 'Cileungsi', kelurahan: ['Cileungsi', 'Cileungsi Kidul', 'Cipenjo', 'Cipeucang', 'Dayeuh', 'Gandoang', 'Jatisari', 'Limusnunggal', 'Mekarsari', 'Mampir', 'Pasir Angin', 'Setu Sari'] },
          { nama: 'Gunung Putri', kelurahan: ['Bojong Kulon', 'Bojong Nangka', 'Cicadas', 'Cikeas Udik', 'Gunung Putri', 'Karanggan', 'Nagrak', 'Tlajung Udik', 'Wanaherang'] }
        ]
      },
      {
        nama: 'Kota Bogor',
        kecamatan: [
          { nama: 'Bogor Barat', kelurahan: ['Balungbangjaya', 'Bubulak', 'Cilendek Barat', 'Cilendek Timur', 'Curug', 'Curugmekar', 'Gunungbatu', 'Loji', 'Margajaya', 'Menteng', 'Pasirjaya', 'Pasirkuda', 'Pasirmulya', 'Semplak', 'Sindangbarang', 'Situgede'] },
          { nama: 'Bogor Selatan', kelurahan: ['Batutulis', 'Bojongkerta', 'Bondongan', 'Cikaret', 'Cipaku', 'Empang', 'Genteng', 'Harjasari', 'Kertamaya', 'Lawanggintung', 'Muarasari', 'Mulyaharja', 'Pakuan', 'Pamoyanan', 'Rancamaya', 'Ranggamekar'] },
          { nama: 'Bogor Tengah', kelurahan: ['Babakan', 'Babakanpasar', 'Cibogor', 'Ciwaringin', 'Gudang', 'Kebonkelapa', 'Pabaton', 'Paledang', 'Panaragan', 'Sempur', 'Tegallega'] },
          { nama: 'Bogor Timur', kelurahan: ['Baranangsiang', 'Katulampa', 'Sindangrasa', 'Sindangbarang', 'Sukasari', 'Tajur'] }
        ]
      },
      {
        nama: 'Kota Bekasi',
        kecamatan: [
          { nama: 'Bekasi Barat', kelurahan: ['Bintara', 'Bintara Jaya', 'Jakasampurna', 'Kota Baru', 'Kranji'] },
          { nama: 'Bekasi Selatan', kelurahan: ['Jaka Mulya', 'Jaka Setia', 'Kayuringin Jaya', 'Mekar Jaya', 'Pekayon Jaya'] },
          { nama: 'Bekasi Timur', kelurahan: ['Aren Jaya', 'Bekasi Jaya', 'Duren Jaya', 'Margahayu'] },
          { nama: 'Bekasi Utara', kelurahan: ['Harapan Baru', 'Harapan Jaya', 'Kaliabang Tengah', 'Marga Mulya', 'Perwira', 'Teluk Pucung'] }
        ]
      },
      {
        nama: 'Kota Depok',
        kecamatan: [
          { nama: 'Beji', kelurahan: ['Beji', 'Beji Timur', 'Kemiri Muka', 'Kukusan', 'Pondok Cina', 'Tanah Baru'] },
          { nama: 'Cimanggis', kelurahan: ['Curug', 'Harjamukti', 'Mekarsari', 'Pasir Gunung Selatan', 'Tugu'] },
          { nama: 'Pancoran Mas', kelurahan: ['Depok', 'Depok Jaya', 'Mampang', 'Pancoran Mas', 'Rangkapan Jaya', 'Rangkapan Jaya Baru'] },
          { nama: 'Sukmajaya', kelurahan: ['Abadijaya', 'Bakti Jaya', 'Cisalak', 'Mekar Jaya', 'Sukmajaya', 'Tirtajaya'] }
        ]
      }
    ]
  },
  {
    provinsi: 'DKI Jakarta',
    kabupaten: [
      {
        nama: 'Jakarta Pusat',
        kecamatan: [
          { nama: 'Gambir', kelurahan: ['Cideng', 'Duri Pulo', 'Gambir', 'Kebon Kelapa', 'Petojo Selatan', 'Petojo Utara'] },
          { nama: 'Kemayoran', kelurahan: ['Cempaka Baru', 'Gunung Sahari Selatan', 'Harapan Mulya', 'Kebon Kosong', 'Kemayoran', 'Serdang', 'Sumur Batu', 'Utan Panjang'] },
          { nama: 'Menteng', kelurahan: ['Cikini', 'Gondangdia', 'Kebon Sirih', 'Menteng', 'Pegangsaan'] },
          { nama: 'Tanah Abang', kelurahan: ['Bendungan Hilir', 'Gelora', 'Kampung Bali', 'Karet Tengsin', 'Kebon Kacang', 'Kebon Melati', 'Petamburan'] }
        ]
      },
      {
        nama: 'Jakarta Selatan',
        kecamatan: [
          { nama: 'Cilandak', kelurahan: ['Cilandak Barat', 'Cipete Selatan', 'Gandaria Selatan', 'Lebak Bulus', 'Pondok Labu'] },
          { nama: 'Kebayoran Baru', kelurahan: ['Cipete Utara', 'Gandaria Utara', 'Gunung', 'Kramat Pela', 'Melawai', 'Petogogan', 'Pulo', 'Rawa Barat', 'Selong', 'Senayan'] },
          { nama: 'Pasar Minggu', kelurahan: ['Cilandak Timur', 'Jati Padang', 'Kebagusan', 'Pasar Minggu', 'Pejaten Barat', 'Pejaten Timur', 'Ragunan'] },
          { nama: 'Tebet', kelurahan: ['Bukit Duri', 'Kebon Baru', 'Manggarai', 'Manggarai Selatan', 'Menteng Dalam', 'Tebet Barat', 'Tebet Timur'] }
        ]
      },
      {
        nama: 'Jakarta Timur',
        kecamatan: [
          { nama: 'Duren Sawit', kelurahan: ['Duren Sawit', 'Klender', 'Malaka Jaya', 'Malaka Sari', 'Pondok Bambu', 'Pondok Kelapa', 'Pondok Kopi'] },
          { nama: 'Jatinegara', kelurahan: ['Bali Mester', 'Bidara Cina', 'Cipinang Besar Selatan', 'Cipinang Besar Utara', 'Cipinang Cempedak', 'Cipinang Muara', 'Kampung Melayu', 'Rawa Bunga'] },
          { nama: 'Kramat Jati', kelurahan: ['Balekambang', 'Batu Ampar', 'Cawang', 'Cililitan', 'Dukuh', 'Kramat Jati', 'Tengah'] },
          { nama: 'Matraman', kelurahan: ['Kayu Manis', 'Kebon Manggis', 'Pal Meriam', 'Pisangan Baru', 'Utan Kayu Selatan', 'Utan Kayu Utara'] }
        ]
      },
      {
        nama: 'Jakarta Barat',
        kecamatan: [
          { nama: 'Kebon Jeruk', kelurahan: ['Duri Kepa', 'Kebon Jeruk', 'Kedoya Selatan', 'Kedoya Utara', 'Kelapa Dua', 'Sukabumi Selatan', 'Sukabumi Utara'] },
          { nama: 'Kembangan', kelurahan: ['Joglo', 'Kembangan Selatan', 'Kembangan Utara', 'Meruya Selatan', 'Meruya Utara', 'Srengseng'] }
        ]
      },
      {
        nama: 'Jakarta Utara',
        kecamatan: [
          { nama: 'Kelapa Gading', kelurahan: ['Kelapa Gading Barat', 'Kelapa Gading Timur', 'Pegangsaan Dua'] },
          { nama: 'Tanjung Priok', kelurahan: ['Kebon Bawang', 'Papanggo', 'Sungai Bambu', 'Sunter Agung', 'Sunter Jaya', 'Tanjung Priok', 'Warakas'] }
        ]
      }
    ]
  },
  {
    provinsi: 'Banten',
    kabupaten: [
      {
        nama: 'Kota Tangerang',
        kecamatan: [
          { nama: 'Ciledug', kelurahan: ['Paninggilan', 'Paninggilan Utara', 'Parung Serab', 'Sudimara Barat', 'Sudimara Jaya', 'Sudimara Selatan', 'Sudimara Timur', 'Tajur'] },
          { nama: 'Cipondoh', kelurahan: ['Cipondoh', 'Cipondoh Indah', 'Cipondoh Makmur', 'Gondrong', 'Kenanga', 'Petir', 'Poris Plawad', 'Poris Plawad Indah', 'Poris Plawad Utara'] },
          { nama: 'Tangerang', kelurahan: ['Babakan', 'Buaran Indah', 'Cikokol', 'Kelapa Indah', 'Sukasari', 'Sukarasa', 'Sukaasih', 'Tanah Tinggi'] }
        ]
      },
      {
        nama: 'Kota Tangerang Selatan',
        kecamatan: [
          { nama: 'Ciputat', kelurahan: ['Cipayung', 'Ciputat', 'Jombang', 'Sawah Baru', 'Sawah Lama', 'Serua', 'Serua Indah'] },
          { nama: 'Pamulang', kelurahan: ['Bambu Apus', 'Benda Baru', 'Kedaung', 'Pamulang Barat', 'Pamulang Timur', 'Pondok Benda', 'Pondok Cabe Ilir', 'Pondok Cabe Udik'] },
          { nama: 'Serpong', kelurahan: ['Buaran', 'Ciater', 'Cilenggang', 'Lengkong Gudang', 'Lengkong Gudang Timur', 'Lengkong Wetan', 'Rawa Buntu', 'Rawa Mekar Jaya', 'Serpong'] }
        ]
      },
      {
        nama: 'Kota Serang',
        kecamatan: [
          { nama: 'Serang', kelurahan: ['Cipare', 'Kagungan', 'Kaligandu', 'Kotabaru', 'Lontarbaru', 'Serang', 'Sukawana', 'Sumurpecung', 'Terondol', 'Unyur'] },
          { nama: 'Kasemen', kelurahan: ['Banten', 'Bendung', 'Kasemen', 'Kasunyatan', 'Kilasah', 'Margaluyu', 'Mesjid Priyayi', 'Pangawinan', 'Sukasaba', 'Terumbu', 'Warung Jaud'] }
        ]
      }
    ]
  },
  {
    provinsi: 'Jawa Tengah',
    kabupaten: [
      {
        nama: 'Kota Semarang',
        kecamatan: [
          { nama: 'Banyumanik', kelurahan: ['Banyumanik', 'Gedawang', 'Jabungan', 'Ngesrep', 'Padangsari', 'Pedalangan', 'Pudakpayung', 'Srondol Kulon', 'Srondol Wetan', 'Sumurboto', 'Tinjomoyo'] },
          { nama: 'Semarang Barat', kelurahan: ['Bojongsalaman', 'Bongsari', 'Cabean', 'Gisikdrono', 'Kalibanteng Kidul', 'Kalibanteng Kulon', 'Karangayu', 'Krobokan', 'Manyaran', 'Ngemplak Simongan', 'Salamanmloyo', 'Tambakharjo', 'Tawangmas', 'Tawangsari', 'Yosorejo'] },
          { nama: 'Semarang Tengah', kelurahan: ['Bangunharjo', 'Brumbungan', 'Gabahan', 'Jagalan', 'Karangkidul', 'Kauman', 'Kembangsari', 'Kranggan', 'Miroto', 'Pandansari', 'Pekunden', 'Pendrikan Kidul', 'Pendrikan Lor', 'Purwodinatan', 'Sekayu'] }
        ]
      },
      {
        nama: 'Kota Surakarta',
        kecamatan: [
          { nama: 'Banjarsari', kelurahan: ['Banyuanyar', 'Banjarsari', 'Gilingan', 'Kadipiro', 'Keprabon', 'Kestalan', 'Ketelan', 'Manahan', 'Mangkubumen', 'Nusukan', 'Punggawan', 'Setabelan', 'Sumber', 'Timuran'] },
          { nama: 'Laweyan', kelurahan: ['Bumi', 'Jajar', 'Karangasem', 'Kerten', 'Laweyan', 'Pajang', 'Panularan', 'Penumping', 'Purwosari', 'Sondakan', 'Sriwedari'] }
        ]
      }
    ]
  },
  {
    provinsi: 'Jawa Timur',
    kabupaten: [
      {
        nama: 'Kota Surabaya',
        kecamatan: [
          { nama: 'Gubeng', kelurahan: ['Airlangga', 'Barata Jaya', 'Gubeng', 'Kertajaya', 'Mojo', 'Pucang Sewu'] },
          { nama: 'Rungkut', kelurahan: ['Kali Rungkut', 'Kedung Baruk', 'Medokan Ayu', 'Penjaringan Sari', 'Rungkut Kidul', 'Wonorejo'] },
          { nama: 'Sukolilo', kelurahan: ['Gebang Putih', 'Keputih', 'Klampis Ngasem', 'Medokan Semampir', 'Menur Pumpungan', 'Nginden Jangkungan', 'Semolowaru'] },
          { nama: 'Tegalsari', kelurahan: ['Dr. Soetomo', 'Kedungdoro', 'Keputran', 'Tegalsari', 'Wonorejo'] }
        ]
      },
      {
        nama: 'Kota Malang',
        kecamatan: [
          { nama: 'Klojen', kelurahan: ['Bareng', 'Gadingasri', 'Kasin', 'Kauman', 'Kiduldalem', 'Klojen', 'Oro-oro Dowo', 'Penanggungan', 'Rampal Celaket', 'Samaan', 'Sukoharjo'] },
          { nama: 'Lowokwaru', kelurahan: ['Dinoyo', 'Jatimulyo', 'Ketawanggede', 'Lowokwaru', 'Merjosari', 'Mojolangu', 'Sumbersari', 'Tasikmadu', 'Tlogomas', 'Tulusrejo', 'Tunggulwulung'] }
        ]
      }
    ]
  },
  {
    provinsi: 'DI Yogyakarta',
    kabupaten: [
      {
        nama: 'Kota Yogyakarta',
        kecamatan: [
          { nama: 'Danurejan', kelurahan: ['Bausasran', 'Suryatmajan', 'Tegal Panggung'] },
          { nama: 'Gondokusuman', kelurahan: ['Baciro', 'Demangan', 'Klitren', 'Kotabaru', 'Terban'] },
          { nama: 'Umbulharjo', kelurahan: ['Giwangan', 'Muja Muju', 'Pandeyan', 'Semaki', 'Sorosutan', 'Tahunan', 'Warungboto'] }
        ]
      },
      {
        nama: 'Kab. Sleman',
        kecamatan: [
          { nama: 'Depok', kelurahan: ['Caturtunggal', 'Condongcatur', 'Maguwoharjo'] },
          { nama: 'Mlati', kelurahan: ['Sendangadi', 'Sinduadi', 'Sumberadi', 'Tirtoadi', 'Tlogoadi'] }
        ]
      }
    ]
  },
  {
    provinsi: 'Sumatera Utara',
    kabupaten: [
      {
        nama: 'Kota Medan',
        kecamatan: [
          { nama: 'Medan Kota', kelurahan: ['Kotamatsum III', 'Mesjid', 'Pasar Baru', 'Pasar Merah Barat', 'Pusat Pasar', 'Sei Rengas I', 'Sitirejo I', 'Sudirejo I', 'Sudirejo II', 'Teladan Barat', 'Teladan Timur', 'Yudha'] },
          { nama: 'Medan Baru', kelurahan: ['Babura', 'Daral', 'Merdeka', 'Padang Bulan', 'Petisah Hulu', 'Titi Rantai'] }
        ]
      }
    ]
  },
  {
    provinsi: 'Sumatera Barat',
    kabupaten: [
      {
        nama: 'Kota Padang',
        kecamatan: [
          { nama: 'Padang Barat', kelurahan: ['Belakang Pondok', 'Berok Nipah', 'Flamboyan Baru', 'Kampung Jao', 'Kampung Olo', 'Kampung Pondok', 'Olo', 'Padang Pasir', 'Purus', 'Rimbo Kaluang', 'Ujung Gurun'] }
        ]
      }
    ]
  },
  {
    provinsi: 'Bali',
    kabupaten: [
      {
        nama: 'Kota Denpasar',
        kecamatan: [
          { nama: 'Denpasar Barat', kelurahan: ['Dauh Puri', 'Dauh Puri Kangin', 'Dauh Puri Kauh', 'Dauh Puri Klod', 'Padangsambian', 'Padangsambian Kaja', 'Padangsambian Klod', 'Pemecutan', 'Pemecutan Klod', 'Tegal Harum', 'Tegal Kerta'] }
        ]
      }
    ]
  },
  {
    provinsi: 'Lainnya / Luar Provinsi Di Atas',
    kabupaten: [
      {
        nama: 'Lainnya (Ketik Manual)',
        kecamatan: [
          { nama: 'Lainnya (Ketik Manual)', kelurahan: ['Lainnya (Ketik Manual)'] }
        ]
      }
    ]
  }
];

export const DAFTAR_PROVINSI = WILAYAH_INDONESIA.map(w => w.provinsi);

export function getKabupatenByProvinsi(provinsi: string): string[] {
  const p = WILAYAH_INDONESIA.find(w => w.provinsi === provinsi);
  if (!p) return ['Lainnya'];
  return p.kabupaten.map(k => k.nama);
}

export function getKecamatanByKabupaten(provinsi: string, kabupaten: string): string[] {
  const p = WILAYAH_INDONESIA.find(w => w.provinsi === provinsi);
  if (!p) return ['Lainnya'];
  const k = p.kabupaten.find(k => k.nama === kabupaten);
  if (!k) return ['Lainnya'];
  return k.kecamatan.map(kc => kc.nama);
}

export function getKelurahanByKecamatan(provinsi: string, kabupaten: string, kecamatan: string): string[] {
  const p = WILAYAH_INDONESIA.find(w => w.provinsi === provinsi);
  if (!p) return ['Lainnya'];
  const k = p.kabupaten.find(k => k.nama === kabupaten);
  if (!k) return ['Lainnya'];
  const kc = k.kecamatan.find(kc => kc.nama === kecamatan);
  if (!kc) return ['Lainnya'];
  return kc.kelurahan;
}
