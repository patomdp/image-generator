// style-transfer.js
const backendUrl = 'https://image-generator-backend-obj1.onrender.com';
const transformStyleAPI = '/api/transform-style';
const imageGeneratorAPI = '/api/image-generator';

function resizeImage(file, maxWidth, maxHeight, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;

        img.onload = function() {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            callback(canvas.toDataURL(file.type));
        };
    };
}

// Uso de la función para redimensionar la imagen antes de enviarla
document.getElementById('transform-btn').addEventListener('click', async () => {
    const prompt = document.getElementById('prompt').value;
    const selectedStyle = document.getElementById('style-select').value;
    const imageInput = document.getElementById('image-upload');
    const resultsDiv = document.getElementById('results');

    if (!prompt || !imageInput.files.length) {
        alert('Por favor, ingresa una descripción y sube una imagen.');
        return;
    }

    const styles = ['photorealistic', 'oil painting', 'watercolor', 'digital art', 'sketch'];
    const usedStyles = [selectedStyle, ...styles.filter(style => style !== selectedStyle).slice(0, 3)];

    // Limpiar resultados anteriores
    resultsDiv.innerHTML = 'Generando transformaciones...';

    resizeImage(imageInput.files[0], 512, 512, async function(resizedImageBase64) {
        resultsDiv.innerHTML = ''; // Limpiar el mensaje de "Generando..."

        for (let i = 0; i < usedStyles.length; i++) {
            const style = usedStyles[i];
            const imageContainer = document.createElement('div');
            // 'http://localhost:5000/api/transform-style'
            try {
                const response = await fetch(backendUrl+transformStyleAPI, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        prompt,
                        imageBase64: resizedImageBase64.split(',')[1], // Enviar solo la parte base64
                        style,
                    }),
                });

                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);

                const img = document.createElement('img');
                img.src = imageUrl;

                const promptText = document.createElement('p');
                promptText.textContent = `Prompt: ${prompt}, ${style}`;

                imageContainer.appendChild(img);
                imageContainer.appendChild(promptText);

                resultsDiv.appendChild(imageContainer);
            } catch (error) {
                console.error('Error:', error);
                imageContainer.innerHTML = 'Error al generar la imagen.';
                resultsDiv.appendChild(imageContainer);
            }
        }
    });
});

// document.getElementById('transform-btn').addEventListener('click', async () => {
//     const prompt = document.getElementById('prompt').value;
//     const selectedStyle = document.getElementById('style-select').value;
//     const imageInput = document.getElementById('image-upload');
//     const resultsDiv = document.getElementById('results');

//     if (!prompt || !imageInput.files.length) {
//         alert('Por favor, ingresa una descripción y sube una imagen.');
//         return;
//     }

//     const styles = ['photorealistic', 'oil painting', 'watercolor', 'digital art', 'sketch'];
//     const usedStyles = [selectedStyle, ...styles.filter(style => style !== selectedStyle).slice(0, 3)];

//     // Limpiar resultados anteriores
//     resultsDiv.innerHTML = 'Generando transformaciones...';

//     // Leer la imagen como base64
//     const reader = new FileReader();
//     reader.onloadend = async function () {
//         const imageBase64 = reader.result.split(',')[1]; // Obtener la parte base64 sin el encabezado

//         resultsDiv.innerHTML = ''; // Limpiar el mensaje de "Generando..."

//         for (let i = 0; i < usedStyles.length; i++) {
//             const style = usedStyles[i];
//             const enhancedPrompt = `${prompt}, ${style}`;
//             const imageContainer = document.createElement('div');

//             try {
//                 const response = await fetch('http://localhost:5000/api/transform-style', {
//                     method: 'POST',
//                     headers: {
//                         // 'x-api-key': 'SG_cd3cf89fdc57b72b', // Reemplaza con tu clave API
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({
//                         prompt,
//                         imageBase64,
//                         style,
//                     }),
//                 });

//                 // const arrayBuffer = await response.arrayBuffer();
//                 // const blob = new Blob([arrayBuffer], { type: 'image/png' });
//                 const blob = await response.blob();
//                 const imageUrl = URL.createObjectURL(blob);

//                 const img = document.createElement('img');
//                 img.src = imageUrl;

//                 const promptText = document.createElement('p');
//                 promptText.textContent = `Prompt: ${enhancedPrompt}`;

//                 imageContainer.appendChild(img);
//                 imageContainer.appendChild(promptText);
//                 // resultsDiv.innerHTML = ''; // Limpiar el mensaje de "Generando..."

//                 resultsDiv.appendChild(imageContainer);
//             } catch (error) {
//                 console.error('Error:', error);
//                 imageContainer.innerHTML = 'Error al generar la imagen.';
//                 resultsDiv.appendChild(imageContainer);
//             }
//         }
//     };
//     reader.readAsDataURL(imageInput.files[0]);
// });
