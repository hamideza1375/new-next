type MediaType = 'photo' | 'video' | 'audio' | 'zip' | 'rar' | 'pdf';


export const imagePicker = (mediaType: MediaType): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Validate mediaType
    const validMediaTypes: MediaType[] = ['photo', 'video', 'audio', 'zip', 'rar', 'pdf'];
    if (!validMediaTypes.includes(mediaType)) {
      reject(new Error(`Invalid mediaType: ${mediaType}. Must be one of `));
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none'; // Hide the input element

    // Set accept attribute based on mediaType
    switch (mediaType) {
      case 'photo':
        input.accept = 'image/*';
        break;
      case 'video':
        input.accept = 'video/*';
        break;
      case 'audio':
        input.accept = 'audio/*';
        break;
      case 'zip':
      case 'rar':
        input.accept = '.zip,.rar';
        break;
        case 'pdf':
            input.accept = '.pdf';
            break;
    }

    const handleChange = () => {
      cleanup();
      if (input.files?.[0]) {
        resolve(input.files[0]);
      } else {
        reject(new Error('No file selected'));
      }
    };

    const handleCancel = () => {
      cleanup();
      reject('انتخاب فایل لغو شد');
    };

    const cleanup = () => {
      input.removeEventListener('change', handleChange);
      input.removeEventListener('cancel', handleCancel);
      document.body.removeChild(input);
    };

    input.addEventListener('change', handleChange);
    input.addEventListener('cancel', handleCancel);
    document.body.appendChild(input);
    input.click();
  });
};