export default {
  hello: "Merhaba",
  welcome: "Mağazamıza hoş geldiniz!",
  layout: {
    metadata: {
      title: "E-Ticaret",
      description: "E-Ticaret uygulaması",
      keywords: "E-Ticaret",
    },
  },
  home: {
    description:
      "En kaliteli ürünleri uygun fiyatlarla bulabileceğiniz e-ticaret platformu. Geniş ürün yelpazemizle ihtiyacınız olan her şeyi tek bir noktadan temin edebilirsiniz.",
  },
  notFound: {
    alt: "Bulunamadı",
    backToHome: "Ana sayfaya dön",
  },
  errorPage: {
    welcome: "Hoş geldiniz",
    description:
      "En kaliteli ürünleri uygun fiyatlarla bulabileceğiniz e-ticaret platformu. Geniş ürün yelpazemizle ihtiyacınız olan her şeyi tek bir noktadan temin edebilirsiniz.",
    featuredProductsErrorTitle: "Öne çıkan ürünler yüklenemedi",
    featuredProductsErrorMessage:
      "Öne çıkan ürünler gösterilirken bir sorun oluştu. Lütfen tekrar deneyin.",
    tryAgain: "Tekrar Dene",
    consoleError: "Ana sayfa hatası:",
  },
  profile: {
    sidebar: {
      orders: "Siparişlerim",
      addresses: "Adreslerim",
      reviews: "Değerlendirmelerim",
      editProfile: "Profili Düzenle",
    },
    editModal: {
      title: "Profil Bilgileri",
      description: "Profil bilgilerinizi güncelleyin",
      nameLabel: "Adınız ve Soyadınız",
      namePlaceholder: "Adınız ve Soyadınız",
      emailLabel: "E-posta",
      phoneLabel: "Telefon Numarası",
      phonePlaceholder: "90 (555) 555-55-55",
      birthDateLabel: "Doğum Tarihi",
      pickDate: "Bir tarih seçin",
      saveButton: "Kaydet",
      cancelButton: "İptal",
      validation: {
        nameMin: "İsim en az 2 karakter olmalıdır",
        emailInvalid: "Geçerli bir e-posta girin",
      },
      userNotFound: "Kullanıcı bulunamadı!",
    },
    page: {
      title: "Profil",
      description: "Profil sayfası",
      keywords: "profil, kullanıcı, profil sayfası",
    },
    orders: {
      loginRequired: "Siparişleri görüntülemek için giriş yapmalısınız.",
      client: {
        loadingError: "Siparişler yüklenirken hata oluştu.",
        noOrders: "Sipariş bulunamadı.",
        title: "Siparişlerim",
        orderId: "Sipariş No:",
        status: "Durum: ",
        total: "Toplam: ",
        address: "Adres: ",
        products: "Ürünler:",
      },
    },
    addresses: {
      client: {
        title: "Adreslerim",
        description: "Teslimat adreslerinizi yönetin",
        addNewAddress: "Yeni Adres Ekle",
      },
      list: {
        deleteSuccess: "Adres başarıyla silindi!",
        setDefaultSuccess: "Varsayılan adres güncellendi!",
        addressNotFound: "Adres bulunamadı",
        userNotFound: "Kullanıcı bulunamadı",
        setDefaultError: "Varsayılan adres ayarlanamadı",
        noAddressTitle: "Henüz adres eklenmemiş",
        noAddressDescription: "Teslimata başlamak için bir adres ekleyin",
        defaultAddressLabel: "Adres",
        defaultBadge: "Varsayılan",
        isDefaultHint: "Varsayılan adres",
        setAsDefaultHint: "Varsayılan olarak ayarla",
        editHint: "Düzenle",
        deleteHint: "Sil",
        deleteDialogTitle: "Adresi Sil",
        deleteDialogDescription:
          "Bu adresi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
        cancelButton: "İptal",
        deleteButton: "Sil",
        deletingButton: "Siliniyor...",
      },
      modal: {
        validation: {
          labelRequired: "Adres etiketi gerekli",
          streetRequired: "Sokak adresi gerekli",
          cityRequired: "Şehir gerekli",
          zipCodeRequired: "Posta kodu gerekli",
          countryRequired: "Ülke gerekli",
        },
        addSuccess: "Adres başarıyla eklendi!",
        addError: "Adres eklenirken hata oluştu",
        editSuccess: "Adres başarıyla güncellendi!",
        editError: "Adres güncellenirken hata oluştu",
        addTitle: "Yeni Adres Ekle",
        editTitle: "Adresi Düzenle",
        addDescription: "Teslimat için yeni bir adres ekleyin",
        editDescription: "Adres bilgilerinizi güncelleyin",
        saveButton: "Kaydet",
        updateButton: "Güncelle",
        addingButton: "Ekleniyor...",
        updatingButton: "Güncelleniyor...",
        labelLabel: "Adres Etiketi",
        labelPlaceholder: "Ev, İş, vb.",
        streetLabel: "Sokak Adresi",
        streetPlaceholder: "Cadde, mahalle, apartman no",
        cityLabel: "Şehir",
        cityPlaceholder: "İstanbul",
        zipCodeLabel: "Posta Kodu",
        zipCodePlaceholder: "34000",
        countryLabel: "Ülke",
        countryPlaceholder: "Türkiye",
        defaultCheckbox: "Varsayılan adres olarak ayarla",
        cancelButton: "İptal",
      },
    },
    reviews: {
      page: {
        title: "Değerlendirmelerim",
        description: "Değerlendirmeleriniz burada listelenecektir.",
      },
    },
  },
  products: {
    page: {
      breadcrumb: {
        home: "Ana Sayfa",
        allProducts: "Tüm Ürünler",
      },
      header: {
        title: "Tüm Ürünler",
        description: "Geniş ürün yelpazemizi keşfedin ve ihtiyacınız olan her şeyi bulun",
      },
    },
    sortDropdown: {
      nameAsc: "İsme Göre (A-Z)",
      nameDesc: "İsme Göre (Z-A)",
      priceAsc: "Fiyata Göre (Düşük-Yüksek)",
      priceDesc: "Fiyata Göre (Yüksek-Düşük)",
      placeholder: "Varsayılan Sıralama",
    },
    error: {
      title: "Bir hata oluştu!",
      description: "Ürünleri yüklerken beklenmedik bir sorun oluştu. Lütfen tekrar deneyin.",
      tryAgain: "Tekrar Dene",
    },
    detail: {
      notFound: {
        title: "Ürün Bulunamadı",
        description: "Aradığınız ürün bulunamadı.",
      },
      metadata: {
        titleSuffix: "| E-Ticaret",
        defaultDescription: "ürün detayları.",
        keywords: "e-ticaret, online alışveriş",
      },
      defaultName: "Ürün",
    },
    breadcrumb: {
      products: "Ürünler",
    },
    purchase: {
      quantity: "Miktar:",
      total: "Toplam:",
      addToCart: "Sepete Ekle",
      adding: "Ekleniyor...",
      error: "Ürün sepete eklenirken hata oluştu!",
    },
    outOfStock: {
      title: "Bu ürün şu anda stokta bulunmamaktadır.",
      followUp: "Stok durumu hakkında güncellemeler almak için bizi takip edin.",
    },
    description: {
      title: "Açıklama",
    },
    stock: {
      status: "Stok Durumu:",
      outOfStock: "Stokta Yok",
      inStock: "{count} adet mevcut",
    },
    actions: {
      addedToWishlist: "Ürün favorilere eklendi",
      removedFromWishlist: "Ürün favorilerden kaldırıldı",
      linkCopied: "Ürün linki kopyalandı!",
    },
  },
} as const;
