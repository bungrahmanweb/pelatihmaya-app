import { supabase } from '@/integrations/supabase/client';


export const useStorage = () => {
  const uploadImage = async (file: File) => {
    try {
      if (!file) return null;

  const fileExt = file.name.split('.').pop();
  // simple filename generator to avoid external uuid dependency
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${fileExt ? '.' + fileExt : ''}`;
  const filePath = `pelatihan/${fileName}`;

      const { data, error } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const deleteImage = async (url: string) => {
    try {
      // handle urls like https://xyz.supabase.co/storage/v1/object/public/media/pelatihan/filename.jpg
      // or direct stored path 'pelatihan/filename.jpg'
      let path = url;
      if (url.includes('/storage/v1/object/public/')) {
        path = url.split('/storage/v1/object/public/')[1];
      } else if (url.includes('/media/')) {
        path = url.split('/media/')[1];
      }
      // remove query params
      path = path.split('?')[0];
      if (!path) return;

      const { error } = await supabase.storage
        .from('media')
        .remove([path]);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  };

  return {
    uploadImage,
    deleteImage
  };
};