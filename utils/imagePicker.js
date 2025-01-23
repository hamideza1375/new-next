export const imagePicker = (mediaType) =>
    new Promise(async (resolve) => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');

        // اگر نوع رسانه عکس باشد، فقط تصاویر را بپذیرد
        if (mediaType === 'photo') {input.setAttribute('accept', 'image/*'); }

        // اگر نوع رسانه ویدیو باشد، فقط ویدیوها را بپذیرد
        else if (mediaType === 'video') {input.setAttribute('accept', 'video/*');}

        // اگر نوع رسانه صدا باشد، فقط فایل‌های صوتی را بپذیرد
        else if (mediaType === 'audio') {input.setAttribute('accept', 'audio/*');}

        // اگر نوع رسانه زیپ یا رار باشد، فقط فایل‌های زیپ و رار را بپذیرد
        else if (mediaType === 'zip' || mediaType === 'rar') {input.setAttribute('accept', '.zip,.rar');}

        input.addEventListener('change', handleChange);
        input.click();

        // وقتی فایل انتخاب شد، آن را برگرداند
        function handleChange() {if (input.files[0]) {resolve(input.files[0]);}}
        input.addEventListener('close', resolve);
    });
