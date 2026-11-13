export function converterParaWebP(file, larguraMaxima = 800, qualidade = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > larguraMaxima) {
          height = Math.round((height * larguraMaxima) / width);
          width = larguraMaxima;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Falha ao converter imagem para WebP'));
              return;
            }
            const nomeSemExtensao = file.name.replace(/\.[^/.]+$/, '');
            const novoArquivoWebP = new File([blob], `${nomeSemExtensao}.webp`, {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve(novoArquivoWebP);
          },
          'image/webp',
          qualidade
        );
      };

      img.onerror = (error) => reject(error);
    };

    reader.onerror = (error) => reject(error);
  });
}