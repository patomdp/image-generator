const generateBtn = document.getElementById('generate');
const promptInput = document.getElementById('prompt');
const negativePromptInput = document.getElementById('negative-prompt');
const stepsInput = document.getElementById('steps');
const guidanceInput = document.getElementById('guidance');
const widthSelect = document.getElementById('width');
const heightSelect = document.getElementById('height');
const resultDiv = document.getElementById('result');
const loadingDiv = document.getElementById('loading');


function enhancePrompt(userPrompt, index) {
    const styles = ['photorealistic', 'oil painting', 'watercolor', 'digital art', 'sketch', 'anime style', 'pop art', 'impressionist', 'surrealist', 'minimalist'];
    const lighting = ['natural light', 'studio lighting', 'dramatic lighting', 'soft light', 'backlight', 'neon lighting', 'golden hour', 'moonlight', 'harsh sunlight', 'candlelight'];
    const angles = ['front view', 'side view', 'bird\'s eye view', 'low angle shot', 'close-up', 'extreme close-up', 'dutch angle', 'over-the-shoulder', 'wide shot', 'fisheye lens'];
    const additionalDetails = [
        'in a bustling city', 'in a serene forest', 'underwater', 'in outer space', 
        'during a thunderstorm', 'at sunset', 'in a dream-like state', 'with vibrant colors',
        'with a retro feel', 'in a post-apocalyptic world', 'with a steampunk aesthetic',
        'in a fantasy realm', 'with a cyberpunk vibe', 'in a fairy tale setting'
    ];

    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const randomLighting = lighting[Math.floor(Math.random() * lighting.length)];
    const randomAngle = angles[Math.floor(Math.random() * angles.length)];
    const randomDetail = additionalDetails[Math.floor(Math.random() * additionalDetails.length)];

    let enhancedPrompt = `${userPrompt}, ${randomStyle}, ${randomLighting}, ${randomAngle}, ${randomDetail}, highly detailed, 8k resolution`;

    // Añadir variaciones adicionales basadas en el índice
    switch(index) {
        case 0:
            enhancedPrompt += ', vibrant colors, sharp focus';
            break;
        case 1:
            enhancedPrompt += ', muted tones, soft edges';
            break;
        case 2:
            enhancedPrompt += ', high contrast, dramatic shadows';
            break;
        case 3:
            enhancedPrompt += ', ethereal atmosphere, dreamy quality';
            break;
    }

    console.log(`Prompt completo para imagen ${index + 1}:`, enhancedPrompt);
    return enhancedPrompt;
}

async function generateImage(prompt, container) {
    try {
        const response = await axios.post(
            'https://api.segmind.com/v1/sdxl1.0-txt2img',
            {
                prompt: prompt,
                negative_prompt: negativePromptInput.value,
                samples: 1,
                scheduler: "dpmpp_2m",
                num_inference_steps: parseInt(stepsInput.value),
                guidance_scale: parseFloat(guidanceInput.value),
                seed: -1,  // Usar -1 para semilla aleatoria
                img_width: parseInt(widthSelect.value),
                img_height: parseInt(heightSelect.value),
            },
            {
                headers: {
                    'x-api-key': 'SG_cd3cf89fdc57b72b',
                    'Content-Type': 'application/json',
                },
                responseType: 'arraybuffer',
            }
        );

        const blob = new Blob([response.data], { type: 'image/png' });
        const imageUrl = URL.createObjectURL(blob);
        const img = document.createElement('img');
        img.src = imageUrl;
        container.innerHTML = '';
        container.appendChild(img);
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = 'Error al generar la imagen.';
    }
}

generateBtn.addEventListener('click', async () => {
    const userPrompt = promptInput.value;
    if (!userPrompt) {
        alert('Por favor, ingresa una descripción para la imagen.');
        return;
    }

    loadingDiv.style.display = 'block';
    resultDiv.innerHTML = '';

    for (let i = 0; i < 4; i++) {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';
        imageContainer.innerHTML = `
            <div>
                <div class="spinner"></div>
                <div class="generating-text">Generando</div>
            </div>
        `;
        resultDiv.appendChild(imageContainer);

        const enhancedPrompt = enhancePrompt(userPrompt, i);
        generateImage(enhancedPrompt, imageContainer);
    }

    loadingDiv.style.display = 'none';
});