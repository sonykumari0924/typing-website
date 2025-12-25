//  Light- Dark Theme
const themeToggle = document.getElementById('theme-toggle');

themeToggle?.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    if (isDark) {
        // Main background and text
        document.body.style.backgroundColor = '#000';
        document.body.style.color = '#f5f5f5';

        // Main container area
        document.querySelectorAll('main, .container').forEach(el => {
            el.style.backgroundColor = '#000';
            el.style.color = '#f5f5f5';
        });

        // All cards/sections/containers
        document.querySelectorAll('.bg-white, .bg-gray-50, .shadow-sm, .rounded-xl')
            .forEach(el => {
                el.style.backgroundColor = '#121212'; // unified dark gray
                el.style.color = '#f5f5f5';
                el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.6)';
            });

        // Typing area & container (same shade)
        const typingTextContainer = document.querySelector('.quote-container');
        const textArea = document.getElementById('typing-input');
        if (typingTextContainer) typingTextContainer.style.backgroundColor = '#121212';
        if (textArea) {
            textArea.style.backgroundColor = '#121212';
            textArea.style.color = '#f9fafb';
            textArea.style.borderColor = '#333';
        }

        // Typing text inside area
        const typingText = document.getElementById('typing-text');
        if (typingText) {
            typingText.style.backgroundColor = '#121212';
            typingText.style.color = '#fafafa';
        }

        // Buttons
        document.querySelectorAll('.time-btn, #restart-btn, #end-btn, #redo-btn')
            .forEach(el => {
                el.style.backgroundColor = '#1c1c1c';
                el.style.color = '#f9f9f9';
                el.style.border = '1px solid #333';
            });

        // Tables
        document.querySelectorAll('table, th, td')
            .forEach(el => {
                el.style.backgroundColor = '#121212';
                el.style.color = '#f5f5f5';
                el.style.borderColor = '#333';
            });

        // Muted text & borders
        document.querySelectorAll('.text-gray-500, .text-gray-600, .text-gray-700')
            .forEach(el => el.style.color = '#d1d1d1');
        document.querySelectorAll('.border, .border-gray-200, .divide-gray-200')
            .forEach(el => el.style.borderColor = '#333');
    }

    // ☀️ LIGHT MODE RESET
    else {
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
        document.querySelectorAll('*').forEach(el => {
            el.style.backgroundColor = '';
            el.style.color = '';
            el.style.borderColor = '';
            el.style.boxShadow = '';
            el.style.border = '';
        });
    }
});

// 🌓 Apply saved theme on load
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        themeToggle?.click(); // instantly apply dark mode
    }
});


// ---------- PARAGRAPHS ----------
const paragraphs = {
    "1min": [
        "The sun rises in the east and sets in the west. Every morning, the sky looks bright and full of colors. Birds fly out of their nests to find food. People start their day by getting ready for work or school. Some go for a walk, while others make breakfast. It is a peaceful time of the day. Fresh air and soft light make everyone feel happy. The world slowly wakes up, and a new day begins with hope and joy.",
        "A dog is a loyal and friendly animal. It loves to play and run around. Many people keep dogs as pets in their homes. Dogs guard the house and make people feel safe. They understand simple words and commands. Feeding and caring for a dog is fun. A happy dog wags its tail and loves to spend time with its owner.",
        "Rainy days are cool and refreshing. The sound of raindrops makes the air calm. Children love to play in the rain and jump in puddles. Plants and trees look green and fresh after the rain. Some people enjoy a cup of tea or coffee while watching the rain. It brings peace and joy to many hearts.",
        "Books are our best friends. They give us knowledge and help us learn new things. Reading a good book can take us to a different world. We can learn about history, science, and stories from around the world. Books never get tired of teaching us. Everyone should make reading a daily habit.",
        "The beach is a wonderful place to visit. The sound of the waves and the cool breeze feel so relaxing. Children build sandcastles and collect shells. People walk along the shore and enjoy the sunset. The sea looks endless and beautiful. It is a perfect place to rest and feel happy."
    ],
    "2min": [
        "Morning is the best time of the day. The air is cool and fresh. Birds sing on the trees, and the sun slowly rises in the sky. People start their day with new energy. Some go for a walk or do yoga to stay healthy. Others read the newspaper or drink tea. Streets become busy as children get ready for school and adults go to work. The morning reminds us that every day is a new beginning. It gives us a chance to do better than yesterday and to be thankful for what we have.",
        "A garden is a beautiful place full of life. There are flowers of many colors and butterflies flying around. Green plants make the air fresh and clean. Many people love gardening because it helps them relax. They water the plants, remove weeds, and take care of flowers with love. In the evening, sitting in the garden brings peace after a long day. Birds come back to rest, and the cool breeze feels nice. A garden teaches us patience because plants take time to grow. It also reminds us to care for nature and enjoy its beauty.",
        "Technology has become a big part of our lives. We use phones, computers, and the internet every day. It helps us talk to people who are far away and learn new things quickly. Students use technology to study and watch online classes. Workers use it to do their jobs faster. But it is also important to use technology wisely. Spending too much time on screens can harm our eyes and health. We should take breaks, go outside, and spend time with family and friends. Technology is good when we use it in balance.",
        "Festivals bring happiness and togetherness. People decorate their homes, wear new clothes, and share sweets. Families gather to celebrate with love and joy. Children wait for festivals because they get gifts and tasty food. Each festival teaches us something special—some teach unity, others teach kindness and gratitude. It is a time to forget worries and enjoy with our loved ones. Lights, music, and laughter make the atmosphere bright. Festivals make our culture rich and colorful. They remind us that happiness grows when we share it."
    ],
    "5min": [
        "Life is a journey filled with lessons, challenges, and opportunities. Every person faces both happy and difficult times, but what truly matters is how we deal with them. Success does not come overnight; it requires hard work, patience, and dedication. People who stay focused and believe in themselves can achieve great things. Sometimes, failure may make us feel sad, but it also teaches us to try again with more strength. Each experience, whether good or bad, helps us grow as individuals. We should always be thankful for what we have and keep working toward our goals. Life becomes more meaningful when we help others and spread kindness. A small act of care or a smile can brighten someone’s day. When we stay positive and hopeful, even the hardest days become easier to face.",
        "The importance of time cannot be ignored. Time once lost can never be brought back. Many people waste hours on unimportant things, not realizing that every minute counts. Successful people value their time and plan their day wisely. They set goals, make schedules, and avoid distractions. Managing time helps us finish tasks on time and stay relaxed. Students should make a timetable for study, rest, and play. Working people should balance their job and personal life properly. Time management also helps reduce stress and improve focus. It is better to do one task properly than to do many things carelessly. Everyone has the same twenty-four hours a day, but only those who use them wisely make real progress. So, time should be respected and used carefully every single day.",
        "Nature is the greatest gift to humanity. It gives us air to breathe, water to drink, and food to eat. Trees, rivers, mountains, and animals make our planet beautiful. Sadly, human activities like pollution, deforestation, and overuse of resources are harming nature. If we continue to damage the environment, future generations will suffer. To protect our planet, we must plant more trees, reduce plastic waste, and save water. Even small actions, like turning off lights when not needed or recycling waste, can make a big difference. Governments and citizens should work together for a greener Earth. Nature gives us peace and balance, and it is our duty to protect it. A clean and green environment is the key to a healthy life and a better future for everyone.",
        "Education is the foundation of a strong society. It helps people gain knowledge, build character, and understand the world. With education, a person can make smart decisions and contribute positively to the community. Schools and colleges play a major role in shaping young minds. Teachers guide students to think critically and solve problems. However, education is not limited to books; it also includes learning life skills, values, and discipline. In today’s world, technology has made education easier and more accessible. Online classes and digital resources allow people to learn from anywhere. Yet, it is important to stay focused and not misuse this freedom. True education teaches respect, honesty, and empathy. A well-educated person helps others grow and makes the world a better place to live."
    ],
    "10min": [
        "The modern world is shaped by technology and constant innovation. Every day, new discoveries change the way we live, work, and communicate. The digital revolution has connected people across the globe, making information easily accessible and creating endless opportunities for collaboration. However, this progress also brings challenges that require wisdom and balance. The rise of artificial intelligence, for instance, raises concerns about ethics, privacy, and employment. Machines may work faster than humans, but they lack empathy and moral understanding. Society must ensure that technology serves humanity, not the other way around. Education plays a crucial role in this transformation. Beyond knowledge, people must develop creativity, adaptability, and critical thinking. In workplaces, learning new skills has become essential for survival. Globalization has further connected nations through trade and communication, but it also brings competition and inequality. Cooperation and respect for diversity are necessary to achieve true progress. Mental health is another vital aspect often overlooked in this fast-moving world. The pressure to succeed and stay productive can lead to stress and burnout. Balancing technology with mindfulness helps maintain emotional well-being. In conclusion, modern life offers countless opportunities and responsibilities. Real advancement lies not in powerful machines but in wise, compassionate people. A future built on empathy, balance, and shared progress will ensure that both technology and humanity thrive together.",
        "Advancements in science and technology have dramatically transformed the way humans interact with the world. From communication to transportation, every aspect of daily life has been reshaped by innovation. The internet allows people to access vast amounts of information instantly, while smartphones and digital platforms have made global communication effortless and instantaneous. At the same time, these rapid changes introduce new challenges, such as cybersecurity threats, data privacy concerns, and the risk of social isolation. Balancing progress with responsibility is essential for individuals and societies alike. Education must equip people not only with academic knowledge but also with critical thinking, creativity, and the ability to adapt to rapid change. Developing emotional intelligence, resilience, and ethical reasoning is equally important as mastering technical skills. Societies that invest in both technological advancement and human development are more likely to thrive sustainably. Furthermore, individuals must learn to manage their digital lives consciously, ensuring that technology enhances well-being rather than diminishes it. By combining thoughtful decision-making with innovation, humanity can create a future that is both advanced and humane, where progress serves people and the planet responsibly. Awareness of social, ethical, and environmental impacts is crucial to making informed choices. By fostering collaboration, empathy, and lifelong learning, humans can maximize the benefits of technology while minimizing potential harms.",
        "Climate change and environmental sustainability are among the most urgent issues facing the modern world. Human activities, including industrialization, deforestation, and overconsumption of natural resources, have led to rising global temperatures, unpredictable weather patterns, and significant loss of biodiversity. Addressing these challenges requires global cooperation, scientific innovation, and social responsibility at every level. Governments, businesses, communities, and individuals must work together to reduce carbon emissions, conserve resources, and adopt environmentally sustainable practices. Education plays a crucial role in raising awareness and encouraging responsible behavior, helping people understand the long-term consequences of their actions. Even small daily actions, such as recycling, conserving water, using renewable energy, and reducing waste, can collectively make a significant difference. Technological advancements, including electric vehicles, solar power, and energy-efficient systems, offer tools to mitigate environmental damage, but they must be implemented thoughtfully. Ultimately, protecting the planet requires a careful balance between progress and sustainability. By acting consciously and prioritizing ecological health, humanity can ensure a safe and prosperous future for generations to come. Collaboration, innovation, and personal responsibility are all necessary to address these pressing challenges effectively. A future that values environmental stewardship alongside social and economic growth will be both sustainable and equitable for all living beings.",
        "Once upon a time in a small village nestled between green hills and sparkling rivers, there lived a curious young girl named Anaya who loved exploring nature and learning about the world around her. Every morning, she would wander through the forests, observe birds and animals, and collect interesting leaves, stones, and flowers. One day, while following a narrow path near the riverbank, she discovered an old, hidden book lying under a tree. The pages were worn, and the handwriting was delicate, yet the words inside spoke of adventures, distant lands, and remarkable inventions from centuries ago. Anaya was fascinated and began reading every word with great care, imagining herself traveling to the places described in the book. Over the next few weeks, she shared stories from the book with her friends, inspiring them to explore, ask questions, and be creative. Encouraged by her curiosity, the villagers started planting gardens, building small workshops, and inventing useful tools to make life easier. Soon, the village transformed into a place full of learning, innovation, and excitement, attracting travelers and scholars from nearby towns. Anaya realized that knowledge could change lives when shared and that curiosity, perseverance, and imagination were more valuable than gold or treasures. As she grew older, she continued her journeys, documenting new discoveries and inspiring the next generation to explore the world with open hearts and minds. Her story became a reminder that even small actions, guided by passion and creativity, can transform communities, awaken minds, and leave a lasting mark on the world for generations to come."
    ]
};

const hindiParagraphs = {
    "1min": [
        "सूरज पूर्व दिशा से निकलता है और पश्चिम दिशा में अस्त होता है। हर सुबह आकाश चमकीला और रंगों से भरा लगता है। पक्षी अपने घोंसलों से उड़कर खाना ढूंढते हैं। लोग अपने काम या स्कूल के लिए तैयार होने लगते हैं। कुछ लोग टहलने जाते हैं, जबकि कुछ नाश्ता बनाते हैं। यह दिन का शांत समय होता है। ताजी हवा और हल्की रोशनी सभी को खुश करती है। दुनिया धीरे-धीरे जागती है और एक नया दिन आशा और खुशी के साथ शुरू होता है।",
        "कुत्ता वफादार और दोस्ताना जानवर है। यह खेलना और दौड़ना पसंद करता है। कई लोग कुत्तों को अपने घर में पालतू बनाते हैं। कुत्ते घर की सुरक्षा करते हैं और लोगों को सुरक्षित महसूस कराते हैं। वे सरल शब्दों और आदेशों को समझते हैं। कुत्ते को खाना खिलाना और देखभाल करना मजेदार होता है। खुश कुत्ता अपनी पूँछ हिलाता है और अपने मालिक के साथ समय बिताना पसंद करता है।",
        "बारिश के दिन ठंडे और ताजगी भरे होते हैं। बारिश की बूँदों की आवाज हवा को शांत कर देती है। बच्चे बारिश में खेलना और गड्ढों में कूदना पसंद करते हैं। बारिश के बाद पौधे और पेड़ हरे और ताजगी भरे दिखाई देते हैं। कुछ लोग चाय या कॉफ़ी पीते हुए बारिश का आनंद लेते हैं। यह कई लोगों के दिलों में शांति और खुशी लाता है।",
        "किताबें हमारे सबसे अच्छे दोस्त हैं। वे हमें ज्ञान देती हैं और नई चीजें सीखने में मदद करती हैं। एक अच्छी किताब पढ़ना हमें एक अलग दुनिया में ले जा सकता है। हम इतिहास, विज्ञान और दुनियाभर की कहानियों के बारे में जान सकते हैं। किताबें हमें पढ़ाने से कभी थकती नहीं हैं। हर किसी को पढ़ना अपनी रोजमर्रा की आदत बनानी चाहिए।",
        "समुद्र तट घूमने के लिए अद्भुत स्थान है। लहरों की आवाज़ और ठंडी हवा बहुत आरामदायक लगती है। बच्चे रेत के महल बनाते हैं और शंख इकट्ठा करते हैं। लोग तट पर चलते हैं और सूर्यास्त का आनंद लेते हैं। समुद्र अंतहीन और सुंदर दिखाई देता है। यह आराम करने और खुश महसूस करने के लिए एक आदर्श जगह है।"
    ],
    "2min": [
        "सुबह दिन का सबसे अच्छा समय होता है। हवा ठंडी और ताजी होती है। पक्षी पेड़ों पर गाते हैं और सूरज धीरे-धीरे आकाश में उगता है। लोग नई ऊर्जा के साथ अपने दिन की शुरुआत करते हैं। कुछ लोग टहलने जाते हैं या योग करते हैं। अन्य लोग अखबार पढ़ते हैं या चाय पीते हैं। सड़कें व्यस्त हो जाती हैं क्योंकि बच्चे स्कूल के लिए तैयार होते हैं और बड़े काम पर जाते हैं। सुबह हमें याद दिलाती है कि हर दिन एक नई शुरुआत है। यह हमें कल से बेहतर करने और जो हमारे पास है उसके लिए आभारी होने का अवसर देती है।",
        "बाग एक सुंदर जगह है जो जीवन से भरी होती है। यहाँ विभिन्न रंगों के फूल और तितलियाँ उड़ती रहती हैं। हरे पौधे हवा को ताजा और साफ बनाते हैं। कई लोग बागवानी पसंद करते हैं क्योंकि यह उन्हें आराम देती है। वे पौधों को पानी देते हैं, जंगली घास निकालते हैं और फूलों की देखभाल प्यार से करते हैं। शाम को बाग में बैठना लंबे दिन के बाद शांति देता है। पक्षी वापस आते हैं और ठंडी हवा सुखद लगती है। बाग हमें धैर्य सिखाता है क्योंकि पौधे बढ़ने में समय लेते हैं। यह हमें प्रकृति की देखभाल करना और उसकी सुंदरता का आनंद लेना भी याद दिलाता है।"
    ],
    "5min": [
        "जीवन एक यात्रा है जिसमें पाठ, चुनौतियाँ और अवसर भरे होते हैं। हर व्यक्ति को सुखद और कठिन समय का सामना करना पड़ता है, लेकिन वास्तव में महत्वपूर्ण यह है कि हम उनसे कैसे निपटते हैं। सफलता तुरंत नहीं मिलती; इसके लिए मेहनत, धैर्य और समर्पण की आवश्यकता होती है। जो लोग ध्यान केंद्रित रखते हैं और खुद पर विश्वास करते हैं, वे बड़ी उपलब्धियां हासिल कर सकते हैं। कभी-कभी असफलता हमें दुखी कर सकती है, लेकिन यह हमें अधिक ताकत के साथ फिर से प्रयास करना सिखाती है। हर अनुभव, अच्छा या बुरा, हमें व्यक्तित्व के रूप में बढ़ने में मदद करता है। हमें हमेशा जो कुछ हमारे पास है उसके लिए आभारी रहना चाहिए और अपने लक्ष्य की ओर काम करते रहना चाहिए। जीवन अधिक सार्थक बन जाता है जब हम दूसरों की मदद करते हैं और दया फैलाते हैं। एक छोटा सा सहयोग या मुस्कान किसी का दिन उज्ज्वल कर सकती है। जब हम सकारात्मक और आशावादी रहते हैं, तो सबसे कठिन दिन भी आसान हो जाते हैं।"
    ],
    "10min": [
        "आधुनिक दुनिया तकनीक और निरंतर नवाचार से आकार ले रही है। हर दिन नई खोजें हमारे जीवन, काम और संचार के तरीके को बदल रही हैं। डिजिटल क्रांति ने लोगों को पूरी दुनिया में जोड़ दिया है, जिससे जानकारी आसानी से उपलब्ध हो जाती है और सहयोग के लिए असीम अवसर पैदा होते हैं। लेकिन इस प्रगति के साथ चुनौतियाँ भी आती हैं, जो बुद्धिमत्ता और संतुलन की मांग करती हैं। कृत्रिम बुद्धिमत्ता के उदय ने नैतिकता, गोपनीयता और रोजगार के बारे में चिंताएँ बढ़ा दी हैं। मशीनें तेजी से काम कर सकती हैं, लेकिन उनमें सहानुभूति और नैतिक समझ नहीं होती। समाज को यह सुनिश्चित करना चाहिए कि तकनीक मानवता की सेवा करे, न कि इसके विपरीत। शिक्षा इस परिवर्तन में महत्वपूर्ण भूमिका निभाती है। ज्ञान से परे, लोगों को रचनात्मकता, अनुकूलन क्षमता और आलोचनात्मक सोच विकसित करनी चाहिए। कार्यस्थलों में नए कौशल सीखना आवश्यक हो गया है। वैश्वीकरण ने राष्ट्रों को व्यापार और संचार के माध्यम से जोड़ा है, लेकिन यह प्रतिस्पर्धा और असमानता भी लाता है। सहयोग और विविधता का सम्मान करना सच्ची प्रगति प्राप्त करने के लिए आवश्यक है। मानसिक स्वास्थ्य भी एक महत्वपूर्ण पहलू है जिसे अक्सर इस तेज़ दुनिया में नजरअंदाज किया जाता है। सफलता और उत्पादक बने रहने का दबाव तनाव और थकावट पैदा कर सकता है। तकनीक और मननशीलता का संतुलन भावनात्मक कल्याण बनाए रखने में मदद करता है। निष्कर्ष रूप में, आधुनिक जीवन अनगिनत अवसर और जिम्मेदारियाँ प्रस्तुत करता है। वास्तविक उन्नति शक्तिशाली मशीनों में नहीं, बल्कि बुद्धिमान और सहानुभूतिपूर्ण लोगों में निहित है।"
    ]
};


// ---------- ELEMENTS ----------
const typingInput = document.getElementById('typing-input');
const typingTextDiv = document.getElementById('typing-text');
const controls = document.getElementById('controls');
const restartBtn = document.getElementById('restart-btn');
const endBtn = document.getElementById('end-btn');
const redoBtn = document.getElementById('redo-btn');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const consistencyDisplay = document.getElementById('consistency');
const timerDisplay = document.getElementById('timer');
const resultsBody = document.getElementById('results-body');

// Level
const progressLevelText = document.querySelector('.progress-level');

//Sound effect
const soundToggle = document.getElementById('sound-toggle');
const wrongSound = new Audio('sounds/wrong.mp3');
const levelUpSound = new Audio('sounds/levelup.mp3');

let lastTypedIndex = -1;
let prevInputValue = '';


// Disable copy, paste, cut, and right-click on typing input
typingInput.addEventListener('paste', e => e.preventDefault());
typingInput.addEventListener('copy', e => e.preventDefault());
typingInput.addEventListener('cut', e => e.preventDefault());
typingInput.addEventListener('contextmenu', e => e.preventDefault());

typingInput.addEventListener('input', () => {
    updateLiveStats();
    highlightErrors();

    // current raw value
    const value = typingInput.value;
    // only proceed if user has added characters (not deletion)
    const grew = value.length > prevInputValue.length;

    // Detect word-completion by checking if the last char typed is a space or newline
    if (grew) {
        const lastChar = value[value.length - 1];
        if (lastChar === ' ' || lastChar === '\n') {
            // Completed a word — evaluate it
            const inputWords = value.trim().split(/\s+/);
            const referenceWords = currentParagraph.split(' ');

            const idx = inputWords.length - 1; // index of the word just completed
            if (idx > lastTypedIndex) {
                // strip leading/trailing punctuation for a fair compare
                const typedWord = inputWords[idx].replace(/^[^\w\u00C0-\u024F]+|[^\w\u00C0-\u024F]+$/g, '');
                const refWordRaw = (referenceWords[idx] || '');
                const refWord = refWordRaw.replace(/^[^\w\u00C0-\u024F]+|[^\w\u00C0-\u024F]+$/g, '');

                if (soundToggle && soundToggle.checked) {
                    if (typedWord !== refWord) {
                        // only play wrong sound when mismatch
                        wrongSound.play().catch(() => {/* ignore play errors */ });
                    }
                }

                lastTypedIndex = idx;
            }
        }
    }

    // store current value for next input event diffing
    prevInputValue = value;
});




// Sidebar stats
const statsWPM = document.querySelector('.bg-primary.h-2');
const statsAccuracy = document.querySelector('.bg-green-500.h-2');
const statsConsistency = document.querySelector('.bg-blue-500.h-2');
const statsValues = document.querySelectorAll('.text-sm.font-medium');

// Progress ring
const progressCircle = document.querySelector('.progress-ring__circle');
const progressText = document.querySelector('.progress-ring text');

// Quick Settings toggles
const punctuationToggle = document.getElementById('punctuation-toggle');
const numberToggle = document.getElementById('number-toggle');

let typingStarted = false;
let startTime;
let timerInterval;
let totalTime = 60;
let timeLeft = totalTime;
let currentTime = "1min";
let currentParagraph = "";
let overallTests = [];

// Level requirements
const levelRequirements = [
    { wpm: 20, accuracy: 70 }, // Level 1
    { wpm: 25, accuracy: 75 }, // Level 2
    { wpm: 30, accuracy: 80 }, // Level 3
    { wpm: 35, accuracy: 85 }, // Level 4
    { wpm: 40, accuracy: 90 }  // Level 5
];

// ---------- LEVEL SYSTEM ----------
let currentLevel = 1;
let levelProgress = 0;
const testsPerLevel = 5;

//--------------customise button------------
const customizeBtn = document.querySelector('button i.fas.fa-cog').parentElement;
const customModal = document.getElementById('customModal');
const closeModal = document.getElementById('closeModal');
const applyBtn = document.getElementById('applyCustomization');
const languageSelect = document.getElementById('languageSelect');
const customTimeInput = document.getElementById('customTime');
const customTextInput = document.getElementById('customText');

// Open modal
customizeBtn.addEventListener('click', () => {
    customModal.classList.remove('hidden');
});

// Close modal
closeModal.addEventListener('click', () => {
    customModal.classList.add('hidden');
});

// Close modal when clicking outside modal content
customModal.addEventListener('click', (e) => {
    if (e.target === customModal) customModal.classList.add('hidden');
});

// Apply customization
applyBtn.addEventListener('click', () => {
    const customText = customTextInput.value.trim();
    const customTime = parseInt(customTimeInput.value);
    const selectedLanguage = languageSelect.value; // "english" or "hindi"

    // Set paragraph based on language and time
    if (customText) {
        currentParagraph = customText; // user custom paragraph
    } else {
        if (selectedLanguage === "hindi") {
            const set = hindiParagraphs[currentTime] || hindiParagraphs["1min"];
            currentParagraph = set[Math.floor(Math.random() * set.length)];
        } else {
            const set = paragraphs[currentTime] || paragraphs["1min"];
            currentParagraph = set[Math.floor(Math.random() * set.length)];
        }
    }

    // Set custom time if valid
    if (customTime >= 1 && customTime <= 30) {
        totalTime = customTime * 60;
        timeLeft = totalTime;
    }

    typingTextDiv.textContent = currentParagraph;
    timerDisplay.textContent = formatTime(totalTime);
    resetTest(); // reset typing area with new values
    customModal.classList.add('hidden');
});



// ---------- FUNCTIONS ----------

// Load paragraph based on selected time
function loadParagraph() {
    const set = paragraphs[currentTime]; // use currentTime
    let text = set[Math.floor(Math.random() * set.length)];

    if (punctuationToggle?.checked) {
        const punctuationMarks = ['.', ',', ';', ':', '?', '!'];
        text = text.split(' ').map(word => Math.random() < 0.2 ? word + punctuationMarks[Math.floor(Math.random() * punctuationMarks.length)] : word).join(' ');
    }

    if (numberToggle?.checked) {
        text = text.split(' ').map(word => Math.random() < 0.1 ? word + Math.floor(Math.random() * 100) : word).join(' ');
    }

    currentParagraph = text;
    typingTextDiv.innerHTML = currentParagraph;
}

// -------------------Format seconds to mm:ss-----------------------
function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

// ------------------Start typing listener-------------------------
function startTypingListener() {
    if (!typingStarted) {
        typingStarted = true;
        typingInput.disabled = false;
        typingInput.focus();
        controls.classList.remove('hidden');
        startTime = Date.now();
        startTimer();
        document.removeEventListener('keydown', startTypingListener);
    }
}

// ------------------------Start timer----------------------------------
function startTimer() {
    timeLeft = totalTime;
    timerDisplay.textContent = formatTime(timeLeft);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = formatTime(timeLeft);
        updateLiveStats();
        if (timeLeft <= 0) endTest();
    }, 1000);
}

// -----------------Update live stats---------------------------------
function updateLiveStats() {
    if (!typingStarted) return;
    const typedTime = (Date.now() - startTime) / 60000;
    const inputWords = typingInput.value.trim().split(/\s+/);
    const referenceWords = currentParagraph.split(' ');
    let correctWords = 0, correctChars = 0;

    referenceWords.forEach((word, i) => {
        const typed = inputWords[i] || '';
        if (typed === word) {
            correctWords++;
            correctChars += word.length;
        } else {
            for (let j = 0; j < Math.min(typed.length, word.length); j++) {
                if (typed[j] === word[j]) correctChars++;
            }
        }
    });

    const wpm = Math.round(correctWords / typedTime) || 0;
    const accuracy = Math.round((correctChars / (inputWords.join('').length || 1)) * 100) || 100;
    const consistency = Math.round((correctWords / referenceWords.length) * 100) || 0;

    wpmDisplay.textContent = wpm;
    accuracyDisplay.textContent = accuracy + '%';
    consistencyDisplay.textContent = consistency + '%';
}

// -------------------Highlight errors-------------------------------
function highlightErrors() {
    const inputWords = typingInput.value.trim().split(/\s+/);
    const referenceWords = currentParagraph.split(' ');
    let display = '';
    referenceWords.forEach((word, i) => {
        const typed = inputWords[i] || '';
        display += typed === word || typed === '' ? word + ' ' : `<span style="color:#ef4444;text-decoration:underline">${word}</span> `;
    });
    typingTextDiv.innerHTML = display.trim();
}

// ----------------End test-------------------------------
function endTest() {
    typingInput.disabled = true;
    clearInterval(timerInterval);
    updateLiveStats();
    saveResult();
    resetTypingArea();
}

// ------------------Save results----------------------------
function saveResult() {
    const wpm = parseInt(wpmDisplay.textContent);
    const accuracy = parseInt(accuracyDisplay.textContent);
    const consistency = parseInt(consistencyDisplay.textContent);

    overallTests.push({ wpm, accuracy, consistency });

    const total = overallTests.length;
    const avgWPM = Math.round(overallTests.reduce((a, b) => a + b.wpm, 0) / total);
    const avgAccuracy = Math.round(overallTests.reduce((a, b) => a + b.accuracy, 0) / total);
    const avgConsistency = Math.round(overallTests.reduce((a, b) => a + b.consistency, 0) / total);

    statsValues[0].textContent = avgWPM;
    statsValues[1].textContent = avgAccuracy + '%';
    statsValues[2].textContent = avgConsistency + '%';

    statsWPM.style.width = Math.min(avgWPM, 100) + '%';
    statsAccuracy.style.width = avgAccuracy + '%';
    statsConsistency.style.width = avgConsistency + '%';

    // ----- Level Progression -----
    const { wpm: requiredWPM, accuracy: requiredAccuracy } = levelRequirements[currentLevel];

    if (wpm >= requiredWPM && accuracy >= requiredAccuracy) {
        levelProgress++;
    }

    // Upgrade level if enough tests passed
    if (levelProgress >= testsPerLevel && currentLevel < levelRequirements.length - 1) {
        levelProgress = 0;
        currentLevel++;
        progressLevelText.textContent = `Level ${currentLevel}`;
        if (soundToggle.checked) levelUpSound.play();
        alert(`🎉 Congrats! You reached Level ${currentLevel}!`);
    }

    const circleCircumference = 2 * Math.PI * 50;
    const levelPercent = (levelProgress / testsPerLevel) * 100;
    const progressCircle = document.querySelector('.progress-ring__circle');
    const progressText = document.querySelector('.progress-ring__percent');

    progressCircle.style.strokeDashoffset = circleCircumference * (1 - levelPercent / 100);
    progressText.textContent = `${Math.round(levelPercent)}%`;

    // Update level text below the circle
    progressLevelText.textContent = `Level ${currentLevel}`;

    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td class="px-6 py-4 text-gray-700">${formattedDate}</td>
        <td class="px-6 py-4 text-gray-700">${wpm}</td>
        <td class="px-6 py-4 text-gray-700">${accuracy}%</td>
        <td class="px-6 py-4 text-gray-700">${totalTime / 60} min</td>
        <td class="px-6 py-4 text-gray-700">Consistency: ${consistency}%</td>
    `;
    if (resultsBody.children.length === 1 && resultsBody.children[0].children[0].colSpan === 5) {
        resultsBody.innerHTML = '';
    }
    resultsBody.prepend(tr);
}

// ----------------------Reset typing area-------------------
function resetTypingArea() {
    typingInput.value = '';
    typingInput.disabled = false;
    typingTextDiv.textContent = currentParagraph;
    controls.classList.add('hidden');
    typingStarted = false;
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '0%';
    consistencyDisplay.textContent = '0%';
    timerDisplay.textContent = formatTime(totalTime);
    document.addEventListener('keydown', startTypingListener);
    lastTypedIndex = -1;
    prevInputValue = '';
}

// Reset test
function resetTest() {
    clearInterval(timerInterval);
    resetTypingArea();
}

// ---------- EVENT LISTENERS ----------

// Time buttons
const timeButtons = document.querySelectorAll('.time-btn');
timeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        timeButtons.forEach(b => b.classList.remove('bg-indigo-500', 'text-white'));
        btn.classList.add('bg-indigo-500', 'text-white');

        currentTime = btn.dataset.time;
        totalTime = parseInt(currentTime) * 60;
        timeLeft = totalTime;
        timerDisplay.textContent = formatTime(totalTime);
        loadParagraph();
        resetTest();
    });
});

// Control buttons
restartBtn.addEventListener('click', resetTest);
endBtn.addEventListener('click', endTest);
redoBtn.addEventListener('click', () => {
    loadParagraph();
    resetTest();
});

// Typing input
typingInput.addEventListener('input', () => {
    updateLiveStats();
    highlightErrors();
});

// Quick Settings toggles
punctuationToggle?.addEventListener('change', () => {
    loadParagraph();
    resetTest();
});
numberToggle?.addEventListener('change', () => {
    loadParagraph();
    resetTest();
});

// ---------- INITIAL LOAD ----------
window.onload = function () {
    currentTime = "1min";
    totalTime = 60;
    loadParagraph();
    timerDisplay.textContent = formatTime(totalTime);
    typingInput.disabled = false;
    document.addEventListener('keydown', startTypingListener);
};
// Quick Settings toggles visual behavior
document.querySelectorAll('.flex.items-center.cursor-pointer').forEach(label => {
    const input = label.querySelector('input[type="checkbox"]');
    const track = label.querySelector('.block');
    const dot = label.querySelector('.dot');

    // Set initial state
    if (input.checked) {
        track.style.backgroundColor = '#6366f1';
        dot.style.transform = 'translateX(24px)';
    } else {
        track.style.backgroundColor = '#ccc';
        dot.style.transform = 'translateX(0px)';
    }

    // Toggle on change
    input.addEventListener('change', () => {
        if (input.checked) {
            track.style.backgroundColor = '#6366f1'; // indigo when ON
            dot.style.transform = 'translateX(24px)';
        } else {
            track.style.backgroundColor = '#ccc'; // gray when OFF
            dot.style.transform = 'translateX(0px)';
        }
    });
});
