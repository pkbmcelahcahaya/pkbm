import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type LanguageCode = 'id' | 'en' | 'ar' | 'ja' | 'ko' | 'ms' | 'su' | 'jv' | 'de';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', dir: 'ltr' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', dir: 'ltr' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', dir: 'ltr' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', dir: 'ltr' },
  { code: 'su', name: 'Sundanese', nativeName: 'Basa Sunda', flag: '🇮🇩', dir: 'ltr' },
  { code: 'jv', name: 'Javanese', nativeName: 'Basa Jawa', flag: '🇮🇩', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  id: {
    // Navigation & Common
    'nav.home': 'Beranda',
    'nav.catalog': 'Katalog Modul',
    'nav.curriculum': 'Kurikulum Paket B & C',
    'nav.profile': 'Profil PKBM',
    'nav.guide': 'Panduan Pengguna',
    'nav.ppdb': 'PPDB 2026',
    'nav.checkStatus': 'Cek Status Berkas',
    'nav.login': 'Masuk Portal',
    'nav.logout': 'Keluar',
    'nav.register': 'Daftar Siswa',
    'nav.sync': 'Status Sinkronisasi',
    'nav.notifications': 'Notifikasi',
    'nav.theme.light': 'Mode Terang',
    'nav.theme.dark': 'Mode Gelap',
    'nav.language': 'Bahasa',

    // Mobile Bottom Nav
    'mob.home': 'Beranda',
    'mob.learn': 'Belajar',
    'mob.curriculum': 'Kurikulum',
    'mob.guide': 'Panduan',
    'mob.account': 'Akun',

    // Public Home
    'hero.badge': 'Platform Resmi Pembelajaran Daring & Kurikulum Kesetaraan',
    'hero.title': 'Pendidikan Kesetaraan Berkualitas untuk Masa Depan Cerah',
    'hero.subtitle': 'Layanan pembelajaran digital modern untuk Paket B (Setara SMP) dan Paket C (Setara SMA) berbasis Google Cloud.',
    'hero.cta.ppdb': 'Daftar PPDB 2026',
    'hero.cta.curriculum': 'Lihat Kurikulum',
    'hero.cta.check': 'Cek Status Berkas',
    'hero.cta.login': 'Masuk Portal Belajar',
    'hero.accessNotice': 'Modul dapat dipelajari secara interaktif dan diunduh oleh Warga Belajar resmi PKBM Celah Cahaya.',
    
    // Stats & Features
    'stat.activeLearners': 'Warga Belajar Aktif',
    'stat.certifiedTutors': 'Tutor Bersertifikasi',
    'stat.modulesAvailable': 'Modul Kesetaraan',
    'stat.graduationRate': 'Tingkat Kelulusan',
    
    // Catalog & Search
    'catalog.title': 'Katalog Modul Pembelajaran',
    'catalog.subtitle': 'Pilih paket dan mata pelajaran untuk mulai membaca buku teks digital dan kuis 100 soal',
    'catalog.all': 'Semua Paket',
    'catalog.paketB': 'Paket B (Setara SMP)',
    'catalog.paketC': 'Paket C (Setara SMA)',
    'catalog.searchPlaceholder': 'Cari judul modul, mata pelajaran, atau kata kunci...',
    'catalog.filterMapel': 'Filter Mata Pelajaran',
    'catalog.sortLatest': 'Terbaru',
    'catalog.sortAZ': 'Nama (A-Z)',
    'catalog.sortPopular': 'Paling Banyak Dibaca',
    'catalog.locked': 'Terkunci (Masuk untuk Membaca)',
    'catalog.readNow': 'Buka Modul',
    'catalog.takeQuiz': 'Kuis 100 Soal',
    'catalog.noResults': 'Tidak ada modul yang sesuai dengan pencarian Anda.',

    // Student Dashboard
    'dash.welcome': 'Selamat Datang',
    'dash.tab.overview': 'Ringkasan Belajar',
    'dash.tab.modules': 'Modul Pelajaran',
    'dash.tab.meet': 'Tatap Muka Virtual',
    'dash.tab.tasks': 'Tugas Mandiri',
    'dash.tab.exams': 'Ulangan & Ujian',
    'dash.progressTitle': 'Progres Belajar Keseluruhan',
    'dash.completedModules': 'Modul Selesai',
    'dash.inProgress': 'Sedang Dipelajari',
    'dash.averageQuizScore': 'Rata-rata Kuis',
    'dash.continueReading': 'Lanjutkan Membaca Terakhir',
    'dash.upcomingSchedule': 'Jadwal Tatap Muka Terdekat',
    'dash.pendingTasks': 'Tugas Belum Dikumpulkan',
    'dash.activeExams': 'Ujian / Ulangan Aktif',
    'dash.printKts': 'Cetak Kartu Tanda Siswa (KTS)',
    'dash.editProfile': 'Pengaturan Akun',

    // Reader & Digital Textbook
    'reader.toc': 'Daftar Isi Modul',
    'reader.readingProgress': 'Progres Membaca',
    'reader.fontSize': 'Ukuran Teks',
    'reader.readingMode': 'Mode Teks Digital',
    'reader.driveMode': 'Pratinjau Asli (PDF/Drive)',
    'reader.bookmark': 'Simpan ke Favorit',
    'reader.bookmarked': 'Tersimpan',
    'reader.downloadPdf': 'Unduh Dokumen',
    'reader.prevPage': 'Sebelumnya',
    'reader.nextPage': 'Selanjutnya',
    'reader.page': 'Halaman',
    'reader.finishAndQuiz': 'Selesaikan & Mulai Kuis 100 Soal',
    'reader.searchInDoc': 'Cari dalam modul...',

    // General Actions & Feedback
    'btn.save': 'Simpan',
    'btn.cancel': 'Batal',
    'btn.close': 'Tutup',
    'btn.confirm': 'Konfirmasi',
    'btn.submit': 'Kirimkan',
    'btn.back': 'Kembali',
    'btn.retry': 'Coba Lagi',
    'btn.viewDetails': 'Lihat Detail',
  },

  en: {
    // Navigation & Common
    'nav.home': 'Home',
    'nav.catalog': 'Module Catalog',
    'nav.curriculum': 'Package B & C Curriculum',
    'nav.profile': 'Institution Profile',
    'nav.guide': 'User Guide',
    'nav.ppdb': 'Admissions 2026',
    'nav.checkStatus': 'Check Admission Status',
    'nav.login': 'Sign In',
    'nav.logout': 'Sign Out',
    'nav.register': 'Register Student',
    'nav.sync': 'Data Sync Status',
    'nav.notifications': 'Notifications',
    'nav.theme.light': 'Light Mode',
    'nav.theme.dark': 'Dark Mode',
    'nav.language': 'Language',

    // Mobile Bottom Nav
    'mob.home': 'Home',
    'mob.learn': 'Learn',
    'mob.curriculum': 'Curriculum',
    'mob.guide': 'Guide',
    'mob.account': 'Account',

    // Public Home
    'hero.badge': 'Official Online Learning & Equivalency Curriculum Platform',
    'hero.title': 'Quality Equivalency Education for a Brighter Future',
    'hero.subtitle': 'Modern digital learning platform for Package B (Junior High) and Package C (Senior High) integrated with Google Cloud.',
    'hero.cta.ppdb': 'Admissions 2026',
    'hero.cta.curriculum': 'View Curriculum',
    'hero.cta.check': 'Check Document Status',
    'hero.cta.login': 'Enter Learning Portal',
    'hero.accessNotice': 'Modules can be read interactively and downloaded by registered learners of PKBM Celah Cahaya.',

    // Stats & Features
    'stat.activeLearners': 'Active Learners',
    'stat.certifiedTutors': 'Certified Tutors',
    'stat.modulesAvailable': 'Equivalency Modules',
    'stat.graduationRate': 'Graduation Rate',

    // Catalog & Search
    'catalog.title': 'Learning Module Catalog',
    'catalog.subtitle': 'Select your educational package and subject to start reading digital textbooks and taking 100-question quizzes',
    'catalog.all': 'All Packages',
    'catalog.paketB': 'Package B (Junior High Eq.)',
    'catalog.paketC': 'Package C (Senior High Eq.)',
    'catalog.searchPlaceholder': 'Search by title, subject, or keyword...',
    'catalog.filterMapel': 'Filter by Subject',
    'catalog.sortLatest': 'Newest',
    'catalog.sortAZ': 'Name (A-Z)',
    'catalog.sortPopular': 'Most Read',
    'catalog.locked': 'Locked (Sign in to read)',
    'catalog.readNow': 'Open Module',
    'catalog.takeQuiz': '100-Question Quiz',
    'catalog.noResults': 'No modules found matching your search.',

    // Student Dashboard
    'dash.welcome': 'Welcome',
    'dash.tab.overview': 'Learning Overview',
    'dash.tab.modules': 'Course Modules',
    'dash.tab.meet': 'Virtual Classroom',
    'dash.tab.tasks': 'Assignments',
    'dash.tab.exams': 'Exams & Quizzes',
    'dash.progressTitle': 'Overall Learning Progress',
    'dash.completedModules': 'Completed Modules',
    'dash.inProgress': 'In Progress',
    'dash.averageQuizScore': 'Average Quiz Score',
    'dash.continueReading': 'Continue Where You Left Off',
    'dash.upcomingSchedule': 'Upcoming Virtual Class',
    'dash.pendingTasks': 'Pending Assignments',
    'dash.activeExams': 'Active Exams',
    'dash.printKts': 'Print Student ID Card (KTS)',
    'dash.editProfile': 'Account Settings',

    // Reader & Digital Textbook
    'reader.toc': 'Table of Contents',
    'reader.readingProgress': 'Reading Progress',
    'reader.fontSize': 'Text Size',
    'reader.readingMode': 'Digital Text Mode',
    'reader.driveMode': 'Original Preview (PDF/Drive)',
    'reader.bookmark': 'Bookmark',
    'reader.bookmarked': 'Bookmarked',
    'reader.downloadPdf': 'Download Document',
    'reader.prevPage': 'Previous',
    'reader.nextPage': 'Next',
    'reader.page': 'Page',
    'reader.finishAndQuiz': 'Finish & Take 100-Question Quiz',
    'reader.searchInDoc': 'Search within module...',

    // General Actions & Feedback
    'btn.save': 'Save',
    'btn.cancel': 'Cancel',
    'btn.close': 'Close',
    'btn.confirm': 'Confirm',
    'btn.submit': 'Submit',
    'btn.back': 'Back',
    'btn.retry': 'Retry',
    'btn.viewDetails': 'View Details',
  },

  ar: {
    // Navigation & Common (Arabic RTL)
    'nav.home': 'الرئيسية',
    'nav.catalog': 'فهرس الوحدات',
    'nav.curriculum': 'منهاج الحزمتين B و C',
    'nav.profile': 'ملف المؤسسة',
    'nav.guide': 'دليل المستخدم',
    'nav.ppdb': 'التسجيل 2026',
    'nav.checkStatus': 'التحقق من حالة القبول',
    'nav.login': 'تسجيل الدخول',
    'nav.logout': 'تسجيل الخروج',
    'nav.register': 'تسجيل طالب جديد',
    'nav.sync': 'حالة المزامنة',
    'nav.notifications': 'الإشعارات',
    'nav.theme.light': 'الوضع المضيء',
    'nav.theme.dark': 'الوضع المظلم',
    'nav.language': 'اللغة',

    // Mobile Bottom Nav
    'mob.home': 'الرئيسية',
    'mob.learn': 'تعلّم',
    'mob.curriculum': 'المنهاج',
    'mob.guide': 'الدليل',
    'mob.account': 'الحساب',

    // Public Home
    'hero.badge': 'المنصة الرسمية للتعلم الإلكتروني ومنهاج التعليم الموازي',
    'hero.title': 'تعليم موازي عالي الجودة لمستقبل واعد ومشرق',
    'hero.subtitle': 'منصة تعليم رقمي حديثة للحزمة B (المتوسطة) والحزمة C (الثانوية) متكاملة مع سحابة جوجل.',
    'hero.cta.ppdb': 'التسجيل لعام 2026',
    'hero.cta.curriculum': 'عرض المناهج',
    'hero.cta.check': 'التحقق من حالة الوثائق',
    'hero.cta.login': 'دخول بوابة التعلم',
    'hero.accessNotice': 'يمكن دراسة الوحدات التعليمية بشكل تفاعلي وتنزيلها من قبل الطلاب المسجلين رسمياً.',

    // Stats & Features
    'stat.activeLearners': 'الطلاب النشطون',
    'stat.certifiedTutors': 'المعلمون المعتمدون',
    'stat.modulesAvailable': 'الوحدات التعليمية',
    'stat.graduationRate': 'نسبة التخرج',

    // Catalog & Search
    'catalog.title': 'فهرس الوحدات التعليمية',
    'catalog.subtitle': 'اختر الحزمة التعليمية والمادة لبدء قراءة الكتب الرقمية واختبار الـ 100 سؤال',
    'catalog.all': 'جميع الحزم',
    'catalog.paketB': 'الحزمة B (المرحلة الإعدادية)',
    'catalog.paketC': 'الحزمة C (المرحلة الثانوية)',
    'catalog.searchPlaceholder': 'ابحث بالعنوان، المادة، أو الكلمات المفتاحية...',
    'catalog.filterMapel': 'تصفية حسب المادة',
    'catalog.sortLatest': 'الأحدث',
    'catalog.sortAZ': 'الاسم (أ-ي)',
    'catalog.sortPopular': 'الأكثر قراءة',
    'catalog.locked': 'مغلق (سجل الدخول للقراءة)',
    'catalog.readNow': 'فتح الوحدة',
    'catalog.takeQuiz': 'اختبار 100 سؤال',
    'catalog.noResults': 'لم يتم العثور على وحدات مطابقة لبحثك.',

    // Student Dashboard
    'dash.welcome': 'مرحباً بك',
    'dash.tab.overview': 'ملخص التعلم',
    'dash.tab.modules': 'الوحدات الدراسية',
    'dash.tab.meet': 'الفصول الافتراضية',
    'dash.tab.tasks': 'الواجبات',
    'dash.tab.exams': 'الامتحانات والاختبارات',
    'dash.progressTitle': 'التقدم الدراسي العام',
    'dash.completedModules': 'الوحدات المكتملة',
    'dash.inProgress': 'قيد الدراسة',
    'dash.averageQuizScore': 'متوسط درجات الاختبار',
    'dash.continueReading': 'متابعة القراءة السابقة',
    'dash.upcomingSchedule': 'الجلسة الافتراضية القادمة',
    'dash.pendingTasks': 'الواجبات المعلقة',
    'dash.activeExams': 'الامتحانات النشطة',
    'dash.printKts': 'طباعة بطاقة الطالب (KTS)',
    'dash.editProfile': 'إعدادات الحساب',

    // Reader & Digital Textbook
    'reader.toc': 'فهرس المحتويات',
    'reader.readingProgress': 'تقدم القراءة',
    'reader.fontSize': 'حجم الخط',
    'reader.readingMode': 'وضع القراءة الرقمي',
    'reader.driveMode': 'العرض الأصلي (PDF)',
    'reader.bookmark': 'إضافة إلى المفضلة',
    'reader.bookmarked': 'محفوظ',
    'reader.downloadPdf': 'تحميل الملف',
    'reader.prevPage': 'السابق',
    'reader.nextPage': 'التالي',
    'reader.page': 'صفحة',
    'reader.finishAndQuiz': 'إتمام وبدء اختبار الـ 100 سؤال',
    'reader.searchInDoc': 'بحث داخل الوحدة...',

    // General Actions & Feedback
    'btn.save': 'حفظ',
    'btn.cancel': 'إلغاء',
    'btn.close': 'إغلاق',
    'btn.confirm': 'تأكيد',
    'btn.submit': 'إرسال',
    'btn.back': 'رجوع',
    'btn.retry': 'إعادة المحاولة',
    'btn.viewDetails': 'عرض التفاصيل',
  },

  ja: {
    // Japanese
    'nav.home': 'ホーム',
    'nav.catalog': 'モジュール一覧',
    'nav.curriculum': 'パッケージB・Cカリキュラム',
    'nav.profile': '教育施設概要',
    'nav.guide': '利用ガイド',
    'nav.ppdb': '2026年度 入学案内',
    'nav.checkStatus': '出願状況確認',
    'nav.login': 'ログイン',
    'nav.logout': 'ログアウト',
    'nav.register': '受講生新規登録',
    'nav.sync': '同期ステータス',
    'nav.notifications': 'お知らせ',
    'nav.theme.light': 'ライトモード',
    'nav.theme.dark': 'ダークモード',
    'nav.language': '言語切替',

    // Mobile Bottom Nav
    'mob.home': 'ホーム',
    'mob.learn': '学習',
    'mob.curriculum': 'カリキュラム',
    'mob.guide': 'ガイド',
    'mob.account': 'アカウント',

    // Public Home
    'hero.badge': '公式オンライン学習＆同等教育カリキュラムプラットフォーム',
    'hero.title': '未来を拓く質の高い同等教育プログラム',
    'hero.subtitle': 'Google Cloudと連携したパッケージB（中学校相当）およびパッケージC（高校相当）の最新学習プラットフォーム。',
    'hero.cta.ppdb': '2026年度 出願受付中',
    'hero.cta.curriculum': 'カリキュラムを確認',
    'hero.cta.check': '書類審査状況を確認',
    'hero.cta.login': '学習ポータルへ入室',
    'hero.accessNotice': 'PKBM Celah Cahayaの正規受講生は全教材を閲覧・ダウンロード可能です。',

    // Stats & Features
    'stat.activeLearners': '在籍受講生数',
    'stat.certifiedTutors': '認定指導員',
    'stat.modulesAvailable': '学習モジュール数',
    'stat.graduationRate': '修了・卒業率',

    // Catalog & Search
    'catalog.title': 'デジタル学習教材カタログ',
    'catalog.subtitle': '教育パッケージと科目を選択して、デジタル教科書の閲覧や100問テストに挑戦できます',
    'catalog.all': 'すべてのパッケージ',
    'catalog.paketB': 'パッケージB (中学校相当)',
    'catalog.paketC': 'パッケージC (高校相当)',
    'catalog.searchPlaceholder': 'タイトル、科目名、キーワードで検索...',
    'catalog.filterMapel': '科目で絞り込み',
    'catalog.sortLatest': '新着順',
    'catalog.sortAZ': '五十音・ABC順',
    'catalog.sortPopular': '人気・閲覧数順',
    'catalog.locked': '要ログイン（受講生限定）',
    'catalog.readNow': '教材を開く',
    'catalog.takeQuiz': '100問テスト',
    'catalog.noResults': '検索条件に該当する教材が見つかりませんでした。',

    // Student Dashboard
    'dash.welcome': 'ようこそ',
    'dash.tab.overview': '学習サマリー',
    'dash.tab.modules': '教材モジュール',
    'dash.tab.meet': 'オンライン講義',
    'dash.tab.tasks': '課題提出',
    'dash.tab.exams': '試験・テスト',
    'dash.progressTitle': '学習進捗度',
    'dash.completedModules': '修了教材数',
    'dash.inProgress': '学習中',
    'dash.averageQuizScore': 'テスト平均点',
    'dash.continueReading': '前回の続きから読む',
    'dash.upcomingSchedule': '次回のオンライン講義',
    'dash.pendingTasks': '未提出の課題',
    'dash.activeExams': '実施中の試験',
    'dash.printKts': '受講生証（KTS）発行・印刷',
    'dash.editProfile': 'アカウント設定',

    // Reader & Digital Textbook
    'reader.toc': '目次',
    'reader.readingProgress': '読書進捗',
    'reader.fontSize': '文字サイズ',
    'reader.readingMode': 'デジタルテキストモード',
    'reader.driveMode': 'PDF原本プレビュー',
    'reader.bookmark': 'お気に入り追加',
    'reader.bookmarked': '保存済み',
    'reader.downloadPdf': 'ファイルをダウンロード',
    'reader.prevPage': '前へ',
    'reader.nextPage': '次へ',
    'reader.page': 'ページ',
    'reader.finishAndQuiz': '読了して100問テストを開始',
    'reader.searchInDoc': '教材内を検索...',

    // General Actions & Feedback
    'btn.save': '保存',
    'btn.cancel': 'キャンセル',
    'btn.close': '閉じる',
    'btn.confirm': '確認',
    'btn.submit': '送信',
    'btn.back': '戻る',
    'btn.retry': '再試行',
    'btn.viewDetails': '詳細を見る',
  },

  ko: {
    // Korean
    'nav.home': '홈',
    'nav.catalog': '모듈 카탈로그',
    'nav.curriculum': '패키지 B·C 교육과정',
    'nav.profile': '기관 소개',
    'nav.guide': '이용 가이드',
    'nav.ppdb': '2026 신입생 모집',
    'nav.checkStatus': '접수 상태 확인',
    'nav.login': '포털 로그인',
    'nav.logout': '로그아웃',
    'nav.register': '학습자 신규 등록',
    'nav.sync': '동기화 현황',
    'nav.notifications': '알림',
    'nav.theme.light': '라이트 모드',
    'nav.theme.dark': '다크 모드',
    'nav.language': '언어 선택',

    // Mobile Bottom Nav
    'mob.home': '홈',
    'mob.learn': '학습',
    'mob.curriculum': '교육과정',
    'mob.guide': '가이드',
    'mob.account': '내 계정',

    // Public Home
    'hero.badge': '공식 온라인 학습 및 평생 학력인정 교육과정 플랫폼',
    'hero.title': '밝은 미래를 위한 고품질 학력인정 교육',
    'hero.subtitle': 'Google Cloud 기반의 패키지 B(중등 과정) 및 패키지 C(고등 과정) 현대식 디지털 학습 포털.',
    'hero.cta.ppdb': '2026 신입생 지원',
    'hero.cta.curriculum': '교육과정 보기',
    'hero.cta.check': '서류 상태 조회',
    'hero.cta.login': '학습 포털 입장',
    'hero.accessNotice': 'PKBM Celah Cahaya 정식 등록 학습자는 모든 교재를 온라인에서 열람 및 다운로드할 수 있습니다.',

    // Stats & Features
    'stat.activeLearners': '재학생 수',
    'stat.certifiedTutors': '공인 튜터',
    'stat.modulesAvailable': '학습 모듈',
    'stat.graduationRate': '졸업 및 합격률',

    // Catalog & Search
    'catalog.title': '학습 교재 카탈로그',
    'catalog.subtitle': '과정과 과목을 선택하여 디지털 교과서를 읽고 100문항 퀴즈를 풀 수 있습니다',
    'catalog.all': '전체 과정',
    'catalog.paketB': '패키지 B (중학교 과정)',
    'catalog.paketC': '패키지 C (고등학교 과정)',
    'catalog.searchPlaceholder': '교재명, 과목, 키워드로 검색...',
    'catalog.filterMapel': '과목별 필터',
    'catalog.sortLatest': '최신순',
    'catalog.sortAZ': '가나다순',
    'catalog.sortPopular': '인기순',
    'catalog.locked': '로그인 필요',
    'catalog.readNow': '교재 열람',
    'catalog.takeQuiz': '100문항 퀴즈',
    'catalog.noResults': '검색 결과와 일치하는 교재가 없습니다.',

    // Student Dashboard
    'dash.welcome': '환영합니다',
    'dash.tab.overview': '학습 개요',
    'dash.tab.modules': '교과 모듈',
    'dash.tab.meet': '실시간 화상 수업',
    'dash.tab.tasks': '과제 제출',
    'dash.tab.exams': '시험 및 평가',
    'dash.progressTitle': '전체 학습 진도율',
    'dash.completedModules': '완료한 모듈',
    'dash.inProgress': '학습 중',
    'dash.averageQuizScore': '퀴즈 평균 점수',
    'dash.continueReading': '최근 읽던 교재 이어보기',
    'dash.upcomingSchedule': '예정된 화상 수업',
    'dash.pendingTasks': '미제출 과제',
    'dash.activeExams': '진행 중인 시험',
    'dash.printKts': '학생증(KTS) 발급/인쇄',
    'dash.editProfile': '계정 설정',

    // Reader & Digital Textbook
    'reader.toc': '목차',
    'reader.readingProgress': '읽기 진행률',
    'reader.fontSize': '글자 크기',
    'reader.readingMode': '디지털 텍스트 모드',
    'reader.driveMode': 'PDF 원본 보기',
    'reader.bookmark': '북마크',
    'reader.bookmarked': '저장됨',
    'reader.downloadPdf': 'PDF 다운로드',
    'reader.prevPage': '이전',
    'reader.nextPage': '다음',
    'reader.page': '페이지',
    'reader.finishAndQuiz': '완독 후 100문항 퀴즈 풀기',
    'reader.searchInDoc': '교재 내용 검색...',

    // General Actions & Feedback
    'btn.save': '저장',
    'btn.cancel': '취소',
    'btn.close': '닫기',
    'btn.confirm': '확인',
    'btn.submit': '제출',
    'btn.back': '뒤로',
    'btn.retry': '다시 시도',
    'btn.viewDetails': '상세보기',
  },

  ms: {
    // Malay
    'nav.home': 'Laman Utama',
    'nav.catalog': 'Katalog Modul',
    'nav.curriculum': 'Kurikulum Pakej B & C',
    'nav.profile': 'Profil Institusi',
    'nav.guide': 'Panduan Pengguna',
    'nav.ppdb': 'Pendaftaran 2026',
    'nav.checkStatus': 'Semak Status Dokumen',
    'nav.login': 'Log Masuk',
    'nav.logout': 'Log Keluar',
    'nav.register': 'Daftar Pelajar',
    'nav.sync': 'Status Penyelarasan',
    'nav.notifications': 'Pemberitahuan',
    'nav.theme.light': 'Mod Cerah',
    'nav.theme.dark': 'Mod Gelap',
    'nav.language': 'Bahasa',

    // Mobile Bottom Nav
    'mob.home': 'Utama',
    'mob.learn': 'Belajar',
    'mob.curriculum': 'Kurikulum',
    'mob.guide': 'Panduan',
    'mob.account': 'Akaun',

    // Public Home
    'hero.badge': 'Platform Rasmi Pembelajaran Dalam Talian & Kurikulum Kesetaraan',
    'hero.title': 'Pendidikan Kesetaraan Berkualiti untuk Masa Depan Cerah',
    'hero.subtitle': 'Perkhidmatan pembelajaran digital moden untuk Pakej B (Setaraf Menengah Rendah) dan Pakej C (Setaraf Menengah Atas) berasaskan Google Cloud.',
    'hero.cta.ppdb': 'Daftar PPDB 2026',
    'hero.cta.curriculum': 'Lihat Kurikulum',
    'hero.cta.check': 'Semak Status Berkas',
    'hero.cta.login': 'Masuk Portal Belajar',
    'hero.accessNotice': 'Modul boleh dibaca secara interaktif dan dimuat turun oleh Warga Belajar PKBM Celah Cahaya yang sah.',

    // Stats & Features
    'stat.activeLearners': 'Warga Belajar Aktif',
    'stat.certifiedTutors': 'Tutor Bertauliah',
    'stat.modulesAvailable': 'Modul Kesetaraan',
    'stat.graduationRate': 'Kadar Kelulusan',

    // Catalog & Search
    'catalog.title': 'Katalog Modul Pembelajaran',
    'catalog.subtitle': 'Pilih pakej dan mata pelajaran untuk mula membaca buku teks digital dan kuiz 100 soalan',
    'catalog.all': 'Semua Pakej',
    'catalog.paketB': 'Pakej B (Setaraf Menengah Rendah)',
    'catalog.paketC': 'Pakej C (Setaraf Menengah Atas)',
    'catalog.searchPlaceholder': 'Cari tajuk modul, mata pelajaran, atau kata kunci...',
    'catalog.filterMapel': 'Tapis Mata Pelajaran',
    'catalog.sortLatest': 'Terkini',
    'catalog.sortAZ': 'Nama (A-Z)',
    'catalog.sortPopular': 'Paling Banyak Dibaca',
    'catalog.locked': 'Terkunci (Log masuk untuk membaca)',
    'catalog.readNow': 'Buka Modul',
    'catalog.takeQuiz': 'Kuiz 100 Soalan',
    'catalog.noResults': 'Tiada modul yang sepadan dengan carian anda.',

    // Student Dashboard
    'dash.welcome': 'Selamat Datang',
    'dash.tab.overview': 'Ringkasan Belajar',
    'dash.tab.modules': 'Modul Pelajaran',
    'dash.tab.meet': 'Kelas Maya',
    'dash.tab.tasks': 'Tugasan',
    'dash.tab.exams': 'Ujian & Peperiksaan',
    'dash.progressTitle': 'Kemajuan Keseluruhan',
    'dash.completedModules': 'Modul Selesai',
    'dash.inProgress': 'Sedang Dipelajari',
    'dash.averageQuizScore': 'Purata Skor Kuiz',
    'dash.continueReading': 'Sambung Bacaan Terakhir',
    'dash.upcomingSchedule': 'Jadual Kelas Maya Terdekat',
    'dash.pendingTasks': 'Tugasan Belum Dihantar',
    'dash.activeExams': 'Ujian Aktif',
    'dash.printKts': 'Cetak Kad Pelajar (KTS)',
    'dash.editProfile': 'Tetapan Akaun',

    // Reader & Digital Textbook
    'reader.toc': 'Isi Kandungan',
    'reader.readingProgress': 'Kemajuan Membaca',
    'reader.fontSize': 'Saiz Teks',
    'reader.readingMode': 'Mod Teks Digital',
    'reader.driveMode': 'Pratonton Asal (PDF/Drive)',
    'reader.bookmark': 'Simpan ke Kegemaran',
    'reader.bookmarked': 'Tersimpan',
    'reader.downloadPdf': 'Muat Turun Dokumen',
    'reader.prevPage': 'Sebelumnya',
    'reader.nextPage': 'Seterusnya',
    'reader.page': 'Halaman',
    'reader.finishAndQuiz': 'Selesaikan & Mula Kuiz 100 Soalan',
    'reader.searchInDoc': 'Cari dalam modul...',

    // General Actions & Feedback
    'btn.save': 'Simpan',
    'btn.cancel': 'Batal',
    'btn.close': 'Tutup',
    'btn.confirm': 'Sahkan',
    'btn.submit': 'Hantar',
    'btn.back': 'Kembali',
    'btn.retry': 'Cuba Semula',
    'btn.viewDetails': 'Lihat Butiran',
  },

  su: {
    // Sundanese (Local language for Garut / West Java)
    'nav.home': 'Tepas (Home)',
    'nav.catalog': 'Katalog Modul',
    'nav.curriculum': 'Kurikulum Paket B & C',
    'nav.profile': 'Profil Lembaga',
    'nav.guide': 'Pituduh Pamake',
    'nav.ppdb': 'Daptar PPDB 2026',
    'nav.checkStatus': 'Pariksa Berkas',
    'nav.login': 'Lebet Portal',
    'nav.logout': 'Kaluar',
    'nav.register': 'Daptar Siswa Anyar',
    'nav.sync': 'Status Singkronisasi',
    'nav.notifications': 'Wawaran',
    'nav.theme.light': 'Mode Caang',
    'nav.theme.dark': 'Mode Poek',
    'nav.language': 'Basa',

    // Mobile Bottom Nav
    'mob.home': 'Tepas',
    'mob.learn': 'Diajar',
    'mob.curriculum': 'Kurikulum',
    'mob.guide': 'Pituduh',
    'mob.account': 'Akun',

    // Public Home
    'hero.badge': 'Layanan Diajar Daring & Kurikulum Kasaruaan Resmi',
    'hero.title': 'Atikan Kasaruaan Berkualitas pikeun Mangsa Hareup Cahaya',
    'hero.subtitle': 'Layanan pangajaran digital modern kanggo Paket B (Satingkat SMP) sareng Paket C (Satingkat SMA) dumasar Google Cloud.',
    'hero.cta.ppdb': 'Daptar PPDB 2026',
    'hero.cta.curriculum': 'Tingal Kurikulum',
    'hero.cta.check': 'Cek Status Berkas',
    'hero.cta.login': 'Lebet Portal Diajar',
    'hero.accessNotice': 'Modul tiasa diaos sareng diunduh sacara lengkep ku Warga Belajar resmi PKBM Celah Cahaya.',

    // Stats & Features
    'stat.activeLearners': 'Warga Belajar Aktif',
    'stat.certifiedTutors': 'Tutor Bersertifikat',
    'stat.modulesAvailable': 'Modul Kasaruaan',
    'stat.graduationRate': 'Tingkat Kalulusan',

    // Catalog & Search
    'catalog.title': 'Katalog Modul Pangajaran',
    'catalog.subtitle': 'Pilih paket sareng mata pelajaran pikeun ngawitan maos buku digital sareng kuis 100 patarosan',
    'catalog.all': 'Sadaya Paket',
    'catalog.paketB': 'Paket B (Satingkat SMP)',
    'catalog.paketC': 'Paket C (Satingkat SMA)',
    'catalog.searchPlaceholder': 'Milari judul modul, mata pelajaran, atanapi kecap konci...',
    'catalog.filterMapel': 'Saring Mata Pelajaran',
    'catalog.sortLatest': 'Panganyarna',
    'catalog.sortAZ': 'Nami (A-Z)',
    'catalog.sortPopular': 'Pangseueurna Diaos',
    'catalog.locked': 'Dikoncil (Lebet heula kanggo maos)',
    'catalog.readNow': 'Buka Modul',
    'catalog.takeQuiz': 'Kuis 100 Soal',
    'catalog.noResults': 'Teu aya modul anu cocog sareng pamilarian anjeun.',

    // Student Dashboard
    'dash.welcome': 'Wilujeng Sumping',
    'dash.tab.overview': 'Ringkesan Diajar',
    'dash.tab.modules': 'Modul Pangajaran',
    'dash.tab.meet': 'Tatap Muka Online',
    'dash.tab.tasks': 'Pancen (Tugas)',
    'dash.tab.exams': 'Ulangan & Ujian',
    'dash.progressTitle': 'Kamajuan Diajar Sakurilingna',
    'dash.completedModules': 'Modul Rengse',
    'dash.inProgress': 'Keur Diajar',
    'dash.averageQuizScore': 'Rata-rata Peunteun Kuis',
    'dash.continueReading': 'Teraskeun Maos Pamungkas',
    'dash.upcomingSchedule': 'Jadwal Tatap Muka Pangcaketna',
    'dash.pendingTasks': 'Pancen Teu Acan Dikintun',
    'dash.activeExams': 'Ujian / Ulangan Hurung',
    'dash.printKts': 'Citak Kartu Murid (KTS)',
    'dash.editProfile': 'Setelan Akun',

    // Reader & Digital Textbook
    'reader.toc': 'Daptar Eusi',
    'reader.readingProgress': 'Kamajuan Maos',
    'reader.fontSize': 'Ukuran Hurup',
    'reader.readingMode': 'Mode Teks Digital',
    'reader.driveMode': 'Pratinjau Asli (PDF/Drive)',
    'reader.bookmark': 'Tandaan Karesep',
    'reader.bookmarked': 'Kacatet',
    'reader.downloadPdf': 'Unduh Dokumen',
    'reader.prevPage': 'Sateuacanna',
    'reader.nextPage': 'Salajengna',
    'reader.page': 'Kaca',
    'reader.finishAndQuiz': 'Rengsekeun & Mimitian Kuis 100 Soal',
    'reader.searchInDoc': 'Milari dina modul...',

    // General Actions & Feedback
    'btn.save': 'Simpen',
    'btn.cancel': 'Batal',
    'btn.close': 'Tutup',
    'btn.confirm': 'Kompirmasi',
    'btn.submit': 'Kintunkeun',
    'btn.back': 'Mulang',
    'btn.retry': 'Cobi Deui',
    'btn.viewDetails': 'Tingal Rincian',
  },

  jv: {
    // Javanese
    'nav.home': 'Kaca Ngarep',
    'nav.catalog': 'Katalog Modul',
    'nav.curriculum': 'Kurikulum Paket B & C',
    'nav.profile': 'Profil Lembaga',
    'nav.guide': 'Pituduh Pangguna',
    'nav.ppdb': 'Daftar PPDB 2026',
    'nav.checkStatus': 'Cek Berkas',
    'nav.login': 'Mlebu Portal',
    'nav.logout': 'Metu',
    'nav.register': 'Daftar Siswa Anyar',
    'nav.sync': 'Status Sinkronisasi',
    'nav.notifications': 'Wara-wara',
    'nav.theme.light': 'Mode Padhang',
    'nav.theme.dark': 'Mode Peteng',
    'nav.language': 'Basa',

    // Mobile Bottom Nav
    'mob.home': 'Ngarep',
    'mob.learn': 'Sinau',
    'mob.curriculum': 'Kurikulum',
    'mob.guide': 'Pituduh',
    'mob.account': 'Akun',

    // Public Home
    'hero.badge': 'Platform Resmi Sinau Daring & Kurikulum Kesetaraan',
    'hero.title': 'Pendhidhikan Kesetaraan Kualitas kanggo Masa Depan Padhang',
    'hero.subtitle': 'Layanan pasinaon digital modern kanggo Paket B (Setara SMP) lan Paket C (Setara SMA) kanthi Google Cloud.',
    'hero.cta.ppdb': 'Daftar PPDB 2026',
    'hero.cta.curriculum': 'Deleng Kurikulum',
    'hero.cta.check': 'Cek Status Berkas',
    'hero.cta.login': 'Mlebu Portal Sinau',
    'hero.accessNotice': 'Modul bisa diwaca interaktif lan diundhuh dening Warga Belajar resmi PKBM Celah Cahaya.',

    // Stats & Features
    'stat.activeLearners': 'Warga Belajar Aktif',
    'stat.certifiedTutors': 'Tutor Bersertifikat',
    'stat.modulesAvailable': 'Modul Kesetaraan',
    'stat.graduationRate': 'Tingkat Kelulusan',

    // Catalog & Search
    'catalog.title': 'Katalog Modul Pasinaon',
    'catalog.subtitle': 'Pilih paket lan mata pelajaran kanggo miwiti maca buku digital lan kuis 100 pitakon',
    'catalog.all': 'Kabeh Paket',
    'catalog.paketB': 'Paket B (Setara SMP)',
    'catalog.paketC': 'Paket C (Setara SMA)',
    'catalog.searchPlaceholder': 'Golek judul modul, mata pelajaran, utawa tembung kunci...',
    'catalog.filterMapel': 'Saring Mata Pelajaran',
    'catalog.sortLatest': 'Paling Anyar',
    'catalog.sortAZ': 'Jeneng (A-Z)',
    'catalog.sortPopular': 'Paling Akeh Diwaca',
    'catalog.locked': 'Dikunci (Mlebu dhisik kanggo maca)',
    'catalog.readNow': 'Bukak Modul',
    'catalog.takeQuiz': 'Kuis 100 Soal',
    'catalog.noResults': 'Ora ana modul sing cocog karo panggolekan sampeyan.',

    // Student Dashboard
    'dash.welcome': 'Sugeng Rawuh',
    'dash.tab.overview': 'Ringkesan Sinau',
    'dash.tab.modules': 'Modul Piwulangan',
    'dash.tab.meet': 'Tatap Muka Virtual',
    'dash.tab.tasks': 'Tugas Mandhiri',
    'dash.tab.exams': 'Ulangan & Ujian',
    'dash.progressTitle': 'Kemajuan Sinau Sakabehe',
    'dash.completedModules': 'Modul Rampung',
    'dash.inProgress': 'Lagi Disinau',
    'dash.averageQuizScore': 'Rata-rata Nilai Kuis',
    'dash.continueReading': 'Banjurake Maca Pungkasan',
    'dash.upcomingSchedule': 'Jadwal Kelas Virtual Paling Cedhak',
    'dash.pendingTasks': 'Tugas Durung Dikumpulake',
    'dash.activeExams': 'Ujian / Ulangan Aktif',
    'dash.printKts': 'Cithak Kertu Siswa (KTS)',
    'dash.editProfile': 'Setelan Akun',

    // Reader & Digital Textbook
    'reader.toc': 'Pratélan Isi',
    'reader.readingProgress': 'Kemajuan Maca',
    'reader.fontSize': 'Ukuran Tulisan',
    'reader.readingMode': 'Mode Teks Digital',
    'reader.driveMode': 'Pratinjau Asli (PDF/Drive)',
    'reader.bookmark': 'Tandhani Favorit',
    'reader.bookmarked': 'Kasimpen',
    'reader.downloadPdf': 'Undhuh Berkas',
    'reader.prevPage': 'Sadurunge',
    'reader.nextPage': 'Sabanjure',
    'reader.page': 'Kaca',
    'reader.finishAndQuiz': 'Rampungake & Miwiti Kuis 100 Soal',
    'reader.searchInDoc': 'Golek ing njero modul...',

    // General Actions & Feedback
    'btn.save': 'Simpen',
    'btn.cancel': 'Batal',
    'btn.close': 'Tutup',
    'btn.confirm': 'Konfirmasi',
    'btn.submit': 'Kirim',
    'btn.back': 'Bali',
    'btn.retry': 'Baleni Maneh',
    'btn.viewDetails': 'Deleng Rincian',
  },

  de: {
    // German
    'nav.home': 'Startseite',
    'nav.catalog': 'Modulkatalog',
    'nav.curriculum': 'Lehrplan Paket B & C',
    'nav.profile': 'Einrichtungsprofil',
    'nav.guide': 'Benutzerhandbuch',
    'nav.ppdb': 'Anmeldung 2026',
    'nav.checkStatus': 'Bewerbungsstatus prüfen',
    'nav.login': 'Anmelden',
    'nav.logout': 'Abmelden',
    'nav.register': 'Lernenden registrieren',
    'nav.sync': 'Synchronisationsstatus',
    'nav.notifications': 'Benachrichtigungen',
    'nav.theme.light': 'Heller Modus',
    'nav.theme.dark': 'Dunkler Modus',
    'nav.language': 'Sprache',

    // Mobile Bottom Nav
    'mob.home': 'Start',
    'mob.learn': 'Lernen',
    'mob.curriculum': 'Lehrplan',
    'mob.guide': 'Handbuch',
    'mob.account': 'Konto',

    // Public Home
    'hero.badge': 'Offizielle Plattform für Online-Lernen & Äquivalenzlehrplan',
    'hero.title': 'Hochwertige Äquivalenzbildung für eine erfolgreiche Zukunft',
    'hero.subtitle': 'Moderne digitale Lernplattform für Paket B (Sekundarstufe I) und Paket C (Sekundarstufe II) integriert mit Google Cloud.',
    'hero.cta.ppdb': 'Anmeldung 2026',
    'hero.cta.curriculum': 'Lehrplan einsehen',
    'hero.cta.check': 'Dokumentenstatus prüfen',
    'hero.cta.login': 'Lernportal betreten',
    'hero.accessNotice': 'Module können von registrierten Lernenden des PKBM Celah Cahaya interaktiv gelesen und heruntergeladen werden.',

    // Stats & Features
    'stat.activeLearners': 'Aktive Lernende',
    'stat.certifiedTutors': 'Zertifizierte Tutoren',
    'stat.modulesAvailable': 'Verfügbare Module',
    'stat.graduationRate': 'Erfolgsquote',

    // Catalog & Search
    'catalog.title': 'Lernmodul-Katalog',
    'catalog.subtitle': 'Wählen Sie Ihr Bildungspaket und Fach, um digitale Lehrbücher zu lesen und 100-Fragen-Quizze zu absolvieren',
    'catalog.all': 'Alle Pakete',
    'catalog.paketB': 'Paket B (Sekundarstufe I Äquiv.)',
    'catalog.paketC': 'Paket C (Sekundarstufe II Äquiv.)',
    'catalog.searchPlaceholder': 'Nach Titel, Fach oder Stichwort suchen...',
    'catalog.filterMapel': 'Nach Fach filtern',
    'catalog.sortLatest': 'Neueste',
    'catalog.sortAZ': 'Name (A-Z)',
    'catalog.sortPopular': 'Meistgelesen',
    'catalog.locked': 'Gesperrt (Zur Ansicht anmelden)',
    'catalog.readNow': 'Modul öffnen',
    'catalog.takeQuiz': '100-Fragen-Quiz',
    'catalog.noResults': 'Keine passenden Module für Ihre Suche gefunden.',

    // Student Dashboard
    'dash.welcome': 'Herzlich Willkommen',
    'dash.tab.overview': 'Lernübersicht',
    'dash.tab.modules': 'Kursmodule',
    'dash.tab.meet': 'Virtuelles Klassenzimmer',
    'dash.tab.tasks': 'Aufgaben',
    'dash.tab.exams': 'Prüfungen & Tests',
    'dash.progressTitle': 'Gesamter Lernfortschritt',
    'dash.completedModules': 'Abgeschlossene Module',
    'dash.inProgress': 'In Bearbeitung',
    'dash.averageQuizScore': 'Durchschnittliche Quiznote',
    'dash.continueReading': 'Zuletzt gelesenes Modul fortsetzen',
    'dash.upcomingSchedule': 'Nächste Online-Sitzung',
    'dash.pendingTasks': 'Ausstehende Aufgaben',
    'dash.activeExams': 'Aktive Prüfungen',
    'dash.printKts': 'Schülerausweis drucken (KTS)',
    'dash.editProfile': 'Kontoeinstellungen',

    // Reader & Digital Textbook
    'reader.toc': 'Inhaltsverzeichnis',
    'reader.readingProgress': 'Lesefortschritt',
    'reader.fontSize': 'Schriftgröße',
    'reader.readingMode': 'Digitaler Textmodus',
    'reader.driveMode': 'Originalvorschau (PDF/Drive)',
    'reader.bookmark': 'Lesezeichen setzen',
    'reader.bookmarked': 'Gespeichert',
    'reader.downloadPdf': 'Dokument herunterladen',
    'reader.prevPage': 'Zurück',
    'reader.nextPage': 'Weiter',
    'reader.page': 'Seite',
    'reader.finishAndQuiz': 'Abschließen & 100-Fragen-Quiz starten',
    'reader.searchInDoc': 'Im Modul suchen...',

    // General Actions & Feedback
    'btn.save': 'Speichern',
    'btn.cancel': 'Abbrechen',
    'btn.close': 'Schließen',
    'btn.confirm': 'Bestätigen',
    'btn.submit': 'Einreichen',
    'btn.back': 'Zurück',
    'btn.retry': 'Wiederholen',
    'btn.viewDetails': 'Details ansehen',
  }
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  isRTL: boolean;
  currentOption: LanguageOption;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('pkbm_language');
    if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
      return saved as LanguageCode;
    }
    return 'id';
  });

  const currentOption = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  const isRTL = currentOption.dir === 'rtl';

  useEffect(() => {
    localStorage.setItem('pkbm_language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    if (isRTL) {
      document.documentElement.classList.add('rtl-mode');
    } else {
      document.documentElement.classList.remove('rtl-mode');
    }
  }, [language, isRTL]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to Indonesian
    if (TRANSLATIONS.id[key]) {
      return TRANSLATIONS.id[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, currentOption }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useI18n must be used within a LanguageProvider');
  }
  return context;
};
