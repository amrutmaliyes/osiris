import { create } from 'zustand';

const useProgressStore = create((set) => ({
  chapterProgress: {},
  contentProgress: {},
  
  setChapterProgress: (chapter, progress) => 
    set((state) => ({
      chapterProgress: {
        ...state.chapterProgress,
        [chapter]: progress
      }
    })),
  
  setContentProgress: (content, progress) =>
    set((state) => ({
      contentProgress: {
        ...state.contentProgress,
        [content]: progress
      }
    })),
    
  resetProgress: () => 
    set({ chapterProgress: {}, contentProgress: {} })
}));

export default useProgressStore; 