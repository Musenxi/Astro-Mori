import { defineMoriConfig } from 'astro-mori';

export default defineMoriConfig({
  title: 'MORI',
  description: '一本安静的个人刊物：文章、游记、照片。',
  accent: '#002fa7',
  categories: [
    { id: 'journeys', zh: '游记', en: 'Journeys', empty: '没写游记' },
    { id: 'essays', zh: '随笔', en: 'Essays', empty: '没写随笔' },
    { id: 'reading', zh: '读书', en: 'Reading', empty: '没写读书笔记' },
    { id: 'photography', zh: '摄影', en: 'Photographs', empty: '没发照片' },
    { id: 'tech', zh: '技术', en: 'Technology', empty: '没写技术文章' },
  ],
  home: {
    direction: 'h',
    editorNote: '这一期没有主题。几篇文章写于不同的季节，放在一起，只是因为它们都写完了。',
  },
});
