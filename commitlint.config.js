/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Başlıklar Türkçe yazılıyor, büyük/küçük harf kuralını gevşetmek yerine
    // sadece cümle sonu noktasını ve uzunluğu denetlemek yeterli.
    'subject-case': [0],
    'header-max-length': [2, 'always', 100],
  },
};
