# Teknoloji Haberleri

Güncel teknoloji haberlerini tek bir akışta toplayan, Expo (React Native) ile yazılmış bir mobil uygulama.

## Özellikler

- Webrazzi, ShiftDelete.Net, Webtekno ve Donanımhaber'den canlı RSS akışlarını çekip tek bir listede birleştirir.
- Ana ekranda haberler özetleriyle alt alta listelenir; her kartta haberi temsil eden bir görsel bulunur.
- Her kartın altında haberin kaynağı yazılıdır ve dokunulduğunda kaynağın orijinal sayfası açılır.
- Bir habere dokunulduğunda detay ekranında haberin tam görseli, başlığı, içeriği ve kaynağa giden bir buton gösterilir.
- Aşağı çekerek (pull-to-refresh) haberler yeniden yüklenebilir.

## Çalıştırma

```bash
npm install
npm start        # Expo geliştirme sunucusunu başlatır
npm run android  # Android emülatöründe/cihazda çalıştırır
npm run ios       # iOS simülatöründe çalıştırır (macOS gerekir)
npm run web       # Tarayıcıda çalıştırır
```

## Proje yapısı

```
src/
  components/   # NewsCard gibi yeniden kullanılabilir UI bileşenleri
  navigation/    # React Navigation tip tanımları
  screens/       # HomeScreen ve DetailScreen
  services/      # RSS akışlarını çekip birleştiren newsService
  types/         # Paylaşılan TypeScript tipleri
  utils/         # HTML temizleme ve tarih biçimlendirme yardımcıları
```

Haber kaynakları `src/services/newsService.ts` içindeki `FEEDS` listesinden yönetilir; yeni bir RSS kaynağı eklemek için listeye `{ url, name }` eklemek yeterlidir.
