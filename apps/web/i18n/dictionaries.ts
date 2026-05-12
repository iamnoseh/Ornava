import type { Dictionary, Language } from "@/i18n/types";

export const DEFAULT_LANGUAGE: Language = "en";

export const languageOptions: Array<{ value: Language; label: string }> = [
  { value: "en", label: "English" },
  { value: "ru", label: "Русский" },
];

export const dictionaries: Record<Language, Dictionary> = {
  en: {
    languageName: "English",
    nav: {
      features: "Features",
      process: "Process",
      principles: "Principles",
      restoration: "Restoration",
    },
    header: {
      productLabel: "Cultural image restoration",
      themeLight: "Light",
      themeDark: "Dark",
    },
    hero: {
      eyebrow: "AI-assisted heritage restoration",
      title: "Restore historical ornaments with preservation-first AI",
      subtitle:
        "Ornava helps improve the clarity of aged carpets, textile patterns, manuscripts, and cultural artworks while protecting their original geometry, motifs, and character.",
      primaryCta: "Start restoration",
      secondaryCta: "Explore features",
      visualLabel: "Illustrative heritage pattern",
      principles: ["Museum-grade restraint", "Original geometry protected", "Authenticity before beauty"],
    },
    workspace: {
      eyebrow: "Restoration workspace",
      title: "Careful restoration for cultural images",
      description:
        "Upload a source image, choose the restoration strength, and review the restored file only after processing is complete.",
      restoreButton: "Start restoration",
      helper: "Ornava enhances clarity while keeping the original composition intact.",
      noFileError: "Upload a historical image before starting restoration.",
    },
    upload: {
      title: "Upload a historical image",
      description:
        "Add a carpet, ornament, textile pattern, manuscript, or archival artwork for careful restoration.",
      remove: "Remove",
      previewAlt: "Selected historical image preview",
      invalidFile: "Use a JPG, PNG, or WEBP image.",
    },
    controls: {
      modeLabel: "Restoration strength",
      modeHint: "Preservation first",
      aiTitle: "AI Restoration",
      aiDescription: "Enhances clarity with preservation-first AI when available.",
      modes: {
        conservative: { label: "Conservative", description: "Maximum fidelity with subtle enhancement." },
        balanced: { label: "Balanced", description: "Clearer details while preserving the original." },
        strong: { label: "Strong", description: "Stronger recovery for heavily aged images." },
      },
    },
    loading: {
      title: "Restoring with care",
      description: "Improving visibility while preserving motifs, borders, and geometry.",
    },
    result: {
      before: "Original",
      restored: "Restored",
      recordEyebrow: "Restoration record",
      recordTitle: "Review and download",
      download: "Download",
      downloading: "Downloading...",
      downloadError: "The restored image could not be downloaded. Please try again.",
      readyMessage: "Your restoration is ready.",
      fallbackMessage:
        "AI restoration is temporarily unavailable. Ornava completed a preservation-safe restoration instead.",
      statusSuccessBadge: "Restoration completed",
      statusFallbackBadge: "Safe restoration mode used",
      developerDiagnostics: "Developer diagnostics",
      method: "Method",
      methodAi: "AI-assisted restoration",
      methodSafe: "Preservation-safe restoration",
      mode: "Strength",
      status: "Status",
      statusComplete: "Completed",
      technicalDetails: "Developer diagnostics",
      technicalIntro: "Diagnostic information for developers.",
      quotaTitle: "AI restoration unavailable",
      quotaMessage:
        "AI restoration is temporarily unavailable. Ornava completed a preservation-safe restoration instead.",
      successMessage: "Your restoration is ready.",
    },
    features: {
      eyebrow: "Features",
      title: "Built for cultural visual heritage",
      description:
        "Ornava focuses on clarity, reviewability, and restraint for historical ornaments, textiles, manuscripts, and archival artwork.",
      items: [
        {
          title: "Ornament restoration",
          description: "Improve aged ornament images while keeping motifs anchored to the source.",
        },
        {
          title: "Texture and color recovery",
          description: "Recover visibility in faded surfaces with careful contrast and tone handling.",
        },
        {
          title: "Geometry preservation",
          description: "Protect borders, alignment, and original pattern structure during restoration.",
        },
        {
          title: "Before/after review",
          description: "Compare the source image with the completed restoration before downloading.",
        },
        {
          title: "AI-assisted enhancement",
          description: "Use preservation-first AI enhancement when available and appropriate.",
        },
        {
          title: "Safe deterministic restoration",
          description: "Complete a restrained restoration path that does not invent missing details.",
        },
      ],
    },
    process: {
      eyebrow: "Process",
      title: "A measured restoration workflow",
      steps: [
        { title: "Upload", description: "Add a historical ornament, textile, manuscript, or archive image." },
        { title: "Choose restoration strength", description: "Select conservative, balanced, or strong enhancement." },
        { title: "Restore carefully", description: "Ornava improves clarity while preserving the original composition." },
        { title: "Review and download", description: "Inspect the result beside the source image and download the restored file." },
      ],
    },
    principles: {
      eyebrow: "Principles",
      title: "Authenticity before beauty",
      items: ["Preserve motifs", "Preserve borders", "Preserve geometry", "No invented details", "Authenticity before beauty"],
    },
    footer: {
      description:
        "Ornava is an AI-assisted restoration platform for historical ornaments, carpets, textile patterns, manuscripts, and cultural visual heritage.",
      product: "Product",
      languageNote: "Languages: English, Русский",
      copyright: "© 2026 Ornava. All rights reserved.",
    },
    errors: {
      generic: "Restoration could not be completed. Please try again.",
      backendUnavailable: "Ornava could not connect to the restoration service. Please try again shortly.",
      invalidFile: "Unsupported file type. Use JPG, PNG, or WEBP.",
      invalidMime: "The selected file does not appear to be a supported image.",
      fileTooLarge: "The image is too large for restoration.",
      corruptedImage: "This image appears to be corrupted or unreadable.",
      quotaExceeded:
        "AI restoration is temporarily unavailable. Ornava completed a preservation-safe restoration instead.",
      fallback:
        "AI restoration is temporarily unavailable. Ornava completed a preservation-safe restoration instead.",
      providerGeneric:
        "AI restoration is temporarily unavailable. Ornava completed a preservation-safe restoration instead.",
    },
  },
  ru: {
    languageName: "Русский",
    nav: {
      features: "Возможности",
      process: "Процесс",
      principles: "Принципы",
      restoration: "Реставрация",
    },
    header: {
      productLabel: "Реставрация культурных изображений",
      themeLight: "Светлая",
      themeDark: "Тёмная",
    },
    hero: {
      eyebrow: "ИИ для бережной реставрации наследия",
      title: "Реставрация исторических орнаментов с ИИ, который сохраняет оригинал",
      subtitle:
        "Ornava помогает улучшать чёткость старинных ковров, текстильных узоров, рукописей и культурных артефактов, сохраняя их геометрию, мотивы и исторический характер.",
      primaryCta: "Начать реставрацию",
      secondaryCta: "Возможности",
      visualLabel: "Иллюстративный орнамент наследия",
      principles: ["Музейная сдержанность", "Геометрия оригинала защищена", "Подлинность важнее красоты"],
    },
    workspace: {
      eyebrow: "Рабочая область",
      title: "Бережная реставрация культурных изображений",
      description:
        "Загрузите исходное изображение, выберите силу реставрации и просмотрите результат только после завершения обработки.",
      restoreButton: "Начать реставрацию",
      helper: "Ornava улучшает чёткость, сохраняя исходную композицию.",
      noFileError: "Загрузите историческое изображение перед началом реставрации.",
    },
    upload: {
      title: "Загрузите историческое изображение",
      description:
        "Добавьте ковёр, орнамент, текстильный узор, рукопись или архивный артефакт для бережной реставрации.",
      remove: "Удалить",
      previewAlt: "Предпросмотр выбранного исторического изображения",
      invalidFile: "Используйте изображение JPG, PNG или WEBP.",
    },
    controls: {
      modeLabel: "Сила реставрации",
      modeHint: "Сначала сохранение",
      aiTitle: "AI-реставрация",
      aiDescription: "Улучшает чёткость изображения с приоритетом сохранения оригинала.",
      modes: {
        conservative: { label: "Консервативная", description: "Максимальная точность с мягким улучшением." },
        balanced: { label: "Сбалансированная", description: "Более чёткие детали с сохранением оригинала." },
        strong: { label: "Сильная", description: "Более выраженное восстановление для сильно состаренных изображений." },
      },
    },
    loading: {
      title: "Бережная реставрация",
      description: "Улучшаем видимость, сохраняя мотивы, границы и геометрию.",
    },
    result: {
      before: "Оригинал",
      restored: "Результат",
      recordEyebrow: "Запись реставрации",
      recordTitle: "Проверка и скачивание",
      download: "Скачать",
      downloading: "Downloading...",
      downloadError: "The restored image could not be downloaded. Please try again.",
      readyMessage: "Реставрация готова.",
      fallbackMessage:
        "ИИ-реставрация временно недоступна. Ornava выполнила бережное восстановление без изменения оригинала.",
      statusSuccessBadge: "Restoration completed",
      statusFallbackBadge: "Safe restoration mode used",
      developerDiagnostics: "Developer diagnostics",
      method: "Метод",
      methodAi: "ИИ-реставрация",
      methodSafe: "Бережная реставрация",
      mode: "Сила",
      status: "Статус",
      statusComplete: "Готово",
      technicalDetails: "Developer diagnostics",
      technicalIntro: "Диагностическая информация для разработчиков.",
      quotaTitle: "ИИ-реставрация недоступна",
      quotaMessage:
        "ИИ-реставрация временно недоступна. Ornava выполнила бережное восстановление без изменения оригинала.",
      successMessage: "Реставрация готова.",
    },
    features: {
      eyebrow: "Возможности",
      title: "Для культурного визуального наследия",
      description:
        "Ornava помогает повышать читаемость исторических орнаментов, текстиля, рукописей и архивных изображений без переосмысления оригинала.",
      items: [
        {
          title: "Реставрация орнаментов",
          description: "Улучшение состаренных изображений с сохранением мотивов исходника.",
        },
        {
          title: "Восстановление фактуры и цвета",
          description: "Повышение видимости выцветших поверхностей через аккуратную работу с контрастом и тоном.",
        },
        {
          title: "Сохранение геометрии",
          description: "Защита границ, выравнивания и структуры исходного узора при реставрации.",
        },
        {
          title: "Просмотр до и после",
          description: "Сравнение исходного изображения с завершённой реставрацией перед скачиванием.",
        },
        {
          title: "Улучшение с помощью ИИ",
          description: "Бережное ИИ-улучшение, когда оно доступно и уместно для изображения.",
        },
        {
          title: "Безопасная реставрация",
          description: "Сдержанный путь восстановления, который не придумывает недостающие детали.",
        },
      ],
    },
    process: {
      eyebrow: "Процесс",
      title: "Спокойный рабочий процесс реставрации",
      steps: [
        { title: "Загрузка", description: "Добавьте исторический орнамент, текстиль, рукопись или архивное изображение." },
        { title: "Выбор силы реставрации", description: "Выберите консервативное, сбалансированное или сильное улучшение." },
        { title: "Бережное восстановление", description: "Ornava улучшает чёткость, сохраняя исходную композицию." },
        { title: "Просмотр и скачивание", description: "Проверьте результат рядом с исходником и скачайте восстановленный файл." },
      ],
    },
    principles: {
      eyebrow: "Принципы",
      title: "Подлинность важнее красоты",
      items: ["Сохранять мотивы", "Сохранять границы", "Сохранять геометрию", "Не придумывать детали", "Подлинность важнее красоты"],
    },
    footer: {
      description:
        "Ornava — платформа ИИ-реставрации для исторических орнаментов, ковров, текстильных узоров, рукописей и культурного визуального наследия.",
      product: "Продукт",
      languageNote: "Языки: English, Русский",
      copyright: "© 2026 Ornava. Все права защищены.",
    },
    errors: {
      generic: "Не удалось выполнить реставрацию. Попробуйте ещё раз.",
      backendUnavailable: "Ornava не смогла подключиться к сервису реставрации. Попробуйте немного позже.",
      invalidFile: "Формат файла не поддерживается. Используйте JPG, PNG или WEBP.",
      invalidMime: "Выбранный файл не похож на поддерживаемое изображение.",
      fileTooLarge: "Изображение слишком большое для реставрации.",
      corruptedImage: "Изображение повреждено или не читается.",
      quotaExceeded:
        "ИИ-реставрация временно недоступна. Ornava выполнила бережное восстановление без изменения оригинала.",
      fallback:
        "ИИ-реставрация временно недоступна. Ornava выполнила бережное восстановление без изменения оригинала.",
      providerGeneric:
        "ИИ-реставрация временно недоступна. Ornava выполнила бережное восстановление без изменения оригинала.",
    },
  },
};
