import { supabase } from '@/integrations/supabase';
import { v4 as uuidv4 } from 'uuid';

export const useStorage = () => {
  const uploadImage = async (file: File) => {
    try {
      if (!file) return null;

      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
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
      const path = url.split('/media/').pop();
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