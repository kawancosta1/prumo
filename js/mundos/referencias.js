/*
  referencias.js - As Top 20 Referencias Culturais de Cada Personalidade do Prumo
  Contem 17 personalidades x 20 referencias = 340 referencias iconicas da cultura pop, literatura, musica e historia.
*/
"use strict";

const REFERENCIAS_MUNDOS = {
  zen: [
    {
      titulo: "O Livro do Chá",
      autor: "Kakuzo Okakura",
      categoria: "Filosofia & Tradição",
      descricao: "A celebração do wabi-sabi e da harmonia presente na simplicidade da cerimônia do chá.",
      citacao: "A essência do chá está na pureza e na tranquilidade do momento.",
      icone: "🍵"
    },
    {
      titulo: "Siddhartha",
      autor: "Hermann Hesse",
      categoria: "Literatura",
      descricao: "A jornada poética de autodescoberta e a sabedoria eterna das águas do rio que fluem sem pressa.",
      citacao: "A sabedoria não é comunicável; a que um sábio tenta comunicar soa sempre como tolice.",
      icone: "🌊"
    },
    {
      titulo: "Mente Zen, Mente de Principiante",
      autor: "Shunryu Suzuki",
      categoria: "Mindfulness",
      descricao: "O clássico que ensina a manter o coração e a mente abertos, livres de certezas rígidas.",
      citacao: "Na mente de principiante há muitas possibilidades, na do perito há poucas.",
      icone: "🌱"
    },
    {
      titulo: "A Arte da Guerra",
      autor: "Sun Tzu",
      categoria: "Estratégia Clássica",
      descricao: "O tratado ancestral que ensina a maior vitória: vencer sem necessidade da luta.",
      citacao: "A suprema arte da guerra é derrotar o inimigo sem lutar.",
      icone: "📜"
    },
    {
      titulo: "Jardim de Pedras de Ryoan-ji",
      autor: "Mestres de Quioto",
      categoria: "Arquitetura & Contemplação",
      descricao: "O santuário de 15 pedras sobre areia branca desenhada onde nunca se pode ver todas de uma só vez.",
      citacao: "O espaço vazio carrega o peso de todo o universo.",
      icone: "🪨"
    },
    {
      titulo: "A Floresta de Bambu de Sagano",
      autor: "Arashiyama, Quioto",
      categoria: "Natureza Sagrada",
      descricao: "O som do vento sussurrando através das hastes verdes de bambu ao amanhecer.",
      citacao: "Dobre-se como o bambu para não ser quebrado pelo vendaval.",
      icone: "🎋"
    },
    {
      titulo: "Koan Mu de Joshu",
      autor: "Mestre Joshu",
      categoria: "Zen Koan",
      descricao: "O enigma primordial que silencia o intelecto e abre as portas da iluminação súbita.",
      citacao: "Um monge perguntou: Um cão tem natureza de Buda? Joshu respondeu: Mu!",
      icone: "⚡"
    },
    {
      titulo: "A Grande Onda de Kanagawa",
      autor: "Katsushika Hokusai",
      categoria: "Artes Visuais",
      descricao: "A força monumental da natureza e a serenidade do Monte Fuji imóvel no horizonte.",
      citacao: "A crista da onda passa, a montanha permanece serena.",
      icone: "🌊"
    },
    {
      titulo: "O Salto da Rã no Lago Antigo",
      autor: "Matsuo Bashō",
      categoria: "Haikai",
      descricao: "O haicai mais célebre do mundo que sintetiza a eternidade em um único instante de som.",
      citacao: "Lago antigo; / salta a rã / ruído de água.",
      icone: "🐸"
    },
    {
      titulo: "Tao Te Ching",
      autor: "Lao-Tsé",
      categoria: "Filosofia Oriental",
      descricao: "O ensinamento do fluxo natural da vida (Wu Wei), agindo pela não-ação consciente.",
      citacao: "A água é fluida, macia e flexível. No entanto, ela corrói a rocha rígida.",
      icone: "☯️"
    },
    {
      titulo: "O Enso do Mestre Hakuin",
      autor: "Hakuin Ekaku",
      categoria: "Caligrafia Sumi-ê",
      descricao: "O círculo perfeito desenhado num único fôlego, simbolizando a iluminação e o infinito.",
      citacao: "No círculo vazio, nada falta e nada sobra.",
      icone: "⭕"
    },
    {
      titulo: "A Arte do Kintsugi",
      autor: "Artesãos Japoneses",
      categoria: "Filosofia Estética",
      descricao: "A arte ancestral de reparar cerâmicas quebradas com ouro, valorizando suas cicatrizes.",
      citacao: "As fraturas e cicatrizes tornam a peça ainda mais preciosa.",
      icone: "✨"
    },
    {
      titulo: "Banho de Floresta (Shinrin-Yoku)",
      autor: "Tradição Japonesa",
      categoria: "Saúde & Espírito",
      descricao: "A absorção contemplativa da atmosfera das florestas e o aroma calmante do musgo úmido.",
      citacao: "Caminhe sem destino na floresta e deixe os pensamentos assentarem como poeira.",
      icone: "🌲"
    },
    {
      titulo: "O Sino do Templo Bonsho",
      autor: "Santuários Budistas",
      categoria: "Som Sagrado",
      descricao: "As 108 badaladas de bronze profundo que purificam as aflições mundanas na passagem do ano.",
      citacao: "Ao som do sino, a poeira do mundo se desfaz em silêncio.",
      icone: "🔔"
    },
    {
      titulo: "Pavilhão de Prata (Ginkaku-ji)",
      autor: "Ashikaga Yoshimasa",
      categoria: "Espaço Contemplativo",
      descricao: "O templo zen cercado por um cone de areia vulcânica que reflete o luar prateado da noite.",
      citacao: "A luz da lua ilumina igualmente todas as folhas caídas.",
      icone: "🏯"
    },
    {
      titulo: "A Flor de Cerejeira Efêmera",
      autor: "Mono no Aware",
      categoria: "Estética da Impermanência",
      descricao: "A beleza doce e melancólica das pétalas de sakura que florescem e caem em poucos dias.",
      citacao: "A beleza só é tão profunda porque não dura para sempre.",
      icone: "🌸"
    },
    {
      titulo: "A Respiração da Tartaruga",
      autor: "Mestres do Qigong",
      categoria: "Prática Meditativa",
      descricao: "O ritmo respiratório profundo e compassado que desacelera os batimentos e acalma a mente.",
      citacao: "Inspire o universo, expire as tensões do dia.",
      icone: "🐢"
    },
    {
      titulo: "A Flor de Lótus na Lama",
      autor: "Dhammapada",
      categoria: "Metáfora Espiritual",
      descricao: "A flor que nasce imaculada e radiante mesmo a partir das águas mais turvas.",
      citacao: "Tal como a lótus desabrocha pura da lama, a mente sábia floresce no meio do caos.",
      icone: "🪷"
    },
    {
      titulo: "O Caminho do Arco (Kyudo)",
      autor: "Eugen Herrigel",
      categoria: "Zen nas Artes Marciais",
      descricao: "O arqueiro zen que não mira o alvo com os olhos, mas torna-se um com o próprio disparo.",
      citacao: "O arqueiro e o alvo deixam de ser dois; são um só movimento.",
      icone: "🏹"
    },
    {
      titulo: "O Silêncio dos Picos do Himalaia",
      autor: "Tradição Védica",
      categoria: "Solidão Fecunda",
      descricao: "A vastidão branca das neves eternas onde a mente reencontra sua pureza primordial.",
      citacao: "Onde o mundo cala a voz, a alma ouve a si mesma.",
      icone: "🏔️"
    }
  ],

  rock: [
    {
      titulo: "Bohemian Rhapsody",
      autor: "Queen",
      categoria: "Ópera Rock",
      descricao: "A monumental fusão de balada ao piano, ópera barroca e peso de guitarra criada por Freddie Mercury.",
      citacao: "Nothing really matters, anyone can see, nothing really matters to me...",
      icone: "👑"
    },
    {
      titulo: "The Dark Side of the Moon",
      autor: "Pink Floyd",
      categoria: "Rock Progressivo",
      descricao: "O prisma refratando luz e o relógio de corda que dita o ritmo existencial do tempo e da loucura.",
      citacao: "And you run and you run to catch up with the sun, but it's sinking...",
      icone: "🌈"
    },
    {
      titulo: "Smells Like Teen Spirit",
      autor: "Nirvana",
      categoria: "Grunge",
      descricao: "O riff enérgico de quatro acordes que demoliu os anos 80 e colocou a garagem no topo do mundo.",
      citacao: "With the lights out, it's less dangerous. Here we are now, entertain us!",
      icone: "⚡"
    },
    {
      titulo: "Back in Black",
      autor: "AC/DC",
      categoria: "Hard Rock",
      descricao: "As badaladas solenes do sino de ferro e o riff de guitarra mais pesado e triunfante da história.",
      citacao: "Back in black, I hit the sack, I've been too long, I'm glad to be back!",
      icone: "🔔"
    },
    {
      titulo: "Stairway to Heaven",
      autor: "Led Zeppelin",
      categoria: "Classic Rock",
      descricao: "O dedilhado medieval de Jimmy Page que culmina no solo de guitarra mais reverenciado do planeta.",
      citacao: "And it's whispered that soon, if we all call the tune, then the piper will lead us to reason.",
      icone: "🪜"
    },
    {
      titulo: "Master of Puppets",
      autor: "Metallica",
      categoria: "Thrash Metal",
      descricao: "A velocidade frenética das palhetadas de James Hetfield e a orquestração precisa do peso sonoro.",
      citacao: "Master of puppets, I'm pulling your strings, twisting your mind and smashing your dreams!",
      icone: "🎸"
    },
    {
      titulo: "Paranoid",
      autor: "Black Sabbath",
      categoria: "Heavy Metal",
      descricao: "Tony Iommi e Ozzy Osbourne forjando os alicerces do metal nas cinzas industriais de Birmingham.",
      citacao: "Finished with my woman 'cause she couldn't help me with my mind...",
      icone: "🦇"
    },
    {
      titulo: "London Calling",
      autor: "The Clash",
      categoria: "Punk Rock",
      descricao: "Paul Simonon quebrando o contrabaixo no palco e Joe Strummer clamando pelas ruas londrinas.",
      citacao: "The ice age is coming, the sun is zooming in, engines stop running, yet I have no fear!",
      icone: "🇬🇧"
    },
    {
      titulo: "Hotel California",
      autor: "Eagles",
      categoria: "Classic Rock",
      descricao: "A harmonia de doze cordas e a lenda do hotel místico com solo duplo memorável.",
      citacao: "You can check out any time you like, but you can never leave!",
      icone: "🏨"
    },
    {
      titulo: "Comfortably Numb",
      autor: "Pink Floyd",
      categoria: "Rock Psicodélico",
      descricao: "O solo de guitarra transcendental de David Gilmour que parece rasgar o tecido da realidade.",
      citacao: "There is no pain, you are receding, a distant ship smoke on the horizon...",
      icone: "🛸"
    },
    {
      titulo: "Sweet Child O' Mine",
      autor: "Guns N' Roses",
      categoria: "Hard Rock",
      descricao: "A cartola de Slash, o aquecimento de dedos que virou o riff mais assobiado do mundo.",
      citacao: "She's got eyes of the bluest skies, as if they thought of rain...",
      icone: "🌹"
    },
    {
      titulo: "Smoke on the Water",
      autor: "Deep Purple",
      categoria: "Classic Rock",
      descricao: "O primeiro riff que todo guitarrista aprende a tocar na vida, gravado nas cinzas de Montreux.",
      citacao: "Smoke on the water, a fire in the sky!",
      icone: "🔥"
    },
    {
      titulo: "Born to Run",
      autor: "Bruce Springsteen",
      categoria: "Heartland Rock",
      descricao: "O hino de fuga libertária na estrada norte-americana com o saxofone incendiário de Clarence Clemons.",
      citacao: "Baby, we were born to run!",
      icone: "🛣️"
    },
    {
      titulo: "Space Oddity",
      autor: "David Bowie",
      categoria: "Glam Rock & Sci-Fi",
      descricao: "Major Tom flutuando em sua lata de estanho azul acima do mundo, ao som do violão de doze cordas.",
      citacao: "Ground Control to Major Tom, commencing countdown, engines on!",
      icone: "👨‍🚀"
    },
    {
      titulo: "Paint It Black",
      autor: "The Rolling Stones",
      categoria: "Rock 60s",
      descricao: "A batida hipnótica de Charlie Watts e a cítara oriental sombria tocada por Brian Jones.",
      citacao: "I see a red door and I want it painted black...",
      icone: "🚪"
    },
    {
      titulo: "Free Bird",
      autor: "Lynyrd Skynyrd",
      categoria: "Southern Rock",
      descricao: "A balada sulista que se transforma no solo de três guitarras mais explosivo de todos os tempos.",
      citacao: "Lord knows, I can't change, lord help me, I can't change!",
      icone: "🦅"
    },
    {
      titulo: "Kashmir",
      autor: "Led Zeppelin",
      categoria: "Hard Rock Oriental",
      descricao: "A marcha rítmica monumental inspirada nas dunas do Saara e nas montanhas do Oriente.",
      citacao: "Let the sun beat down upon my face, and stars fill my dream...",
      icone: "🏜️"
    },
    {
      titulo: "Iron Man",
      autor: "Black Sabbath",
      categoria: "Heavy Metal",
      descricao: "A voz robótica dizendo 'I am Iron Man' seguida pelo riff de distorção mais emblemático da era analógica.",
      citacao: "Has he lost his mind? Can he see or is he blind?",
      icone: "🤖"
    },
    {
      titulo: "Dream On",
      autor: "Aerosmith",
      categoria: "Power Ballad",
      descricao: "O piano melancólico de Steven Tyler culminando no agudo mais visceral do hard rock setentista.",
      citacao: "Sing with me, sing for the years, sing for the laughter and sing for the tears!",
      icone: "💭"
    },
    {
      titulo: "Heroes",
      autor: "David Bowie",
      categoria: "Art Rock",
      descricao: "A celebração do amor sob a sombra do Muro de Berlim e o feedback infinito da guitarra de Robert Fripp.",
      citacao: "We can be heroes, just for one day!",
      icone: "⭐"
    }
  ],

  emo: [
    {
      titulo: "The Black Parade",
      autor: "My Chemical Romance",
      categoria: "Emocore Operático",
      descricao: "A marcha definitiva da juventude dos anos 2000, com banda marcial sombria e trajes vitorianos.",
      citacao: "When I was a young boy, my father took me into the city to see a marching band...",
      icone: "🥁"
    },
    {
      titulo: "Helena (So Long & Goodnight)",
      autor: "My Chemical Romance",
      categoria: "Goth-Emo",
      descricao: "A dança fúnebre na igreja gótica sob a chuva que definiu o visual de toda uma geração.",
      citacao: "So long and goodnight, so long and goodnight...",
      icone: "⛪"
    },
    {
      titulo: "I Write Sins Not Tragedies",
      autor: "Panic! At The Disco",
      categoria: "Pop Punk Teatral",
      descricao: "O casaco vermelho, a cartola e a porta do casamento escancarada por Brendon Urie.",
      citacao: "I chime in with a 'Haven't you people ever heard of closing the goddamn door?'",
      icone: "🎩"
    },
    {
      titulo: "Sugar, We're Goin Down",
      autor: "Fall Out Boy",
      categoria: "Pop Punk",
      descricao: "A bateria sincopada de Andy Hurley e os versos poéticos suburbanos de Pete Wentz.",
      citacao: "We're going down, down in an earlier round, and sugar, we're going down swinging!",
      icone: "🦌"
    },
    {
      titulo: "Misery Business",
      autor: "Paramore",
      categoria: "Pop Punk",
      descricao: "O cabelo laranja brilhante de Hayley Williams e o riff explosivo de Josh Farro.",
      citacao: "Whoa, I never meant to brag, but I got him where I want him now!",
      icone: "🧡"
    },
    {
      titulo: "Dear Maria, Count Me In",
      autor: "All Time Low",
      categoria: "Pop Punk 2000s",
      descricao: "O hino das tardes de skate e dos murais de recados do MySpace.",
      citacao: "I got your picture, I'm coming with you, dear Maria, count me in!",
      icone: "🛹"
    },
    {
      titulo: "Ohio Is for Lovers",
      autor: "Hawthorne Heights",
      categoria: "Screamo",
      descricao: "A dor da distância e o clássico corte de pulso metafórico que marcou o auge do movimento.",
      citacao: "So cut my wrists and black my eyes, so I can fall asleep tonight or die...",
      icone: "💔"
    },
    {
      titulo: "The Taste of Ink",
      autor: "The Used",
      categoria: "Post-Hardcore",
      descricao: "O grito de libertação do porão para conquistar os palcos do mundo liderado por Bert McCracken.",
      citacao: "Is it worth it? Can you even hear me? It's four in the morning and I'm seeing stars...",
      icone: "🖋️"
    },
    {
      titulo: "Cute Without the 'E'",
      autor: "Taking Back Sunday",
      categoria: "Emo Alternativo",
      descricao: "As duas vozes sobrepostas duelando versos cheios de ironia e ressentimento apaixonado.",
      citacao: "And will you tell all your friends you've got your gun to my head?",
      icone: "🎙️"
    },
    {
      titulo: "The Middle",
      autor: "Jimmy Eat World",
      categoria: "Emo / Indie",
      descricao: "O abraço sonoro reconfortante garantindo que tudo vai ficar bem no final das contas.",
      citacao: "It just takes some time, little girl, you're in the middle of the ride, everything will be just fine!",
      icone: "💛"
    },
    {
      titulo: "Screaming Infidelities",
      autor: "Dashboard Confessional",
      categoria: "Acoustic Emo",
      descricao: "Chris Carrabba com violão acústico e milhares de pessoas cantando em coro aos prantos.",
      citacao: "Your hair, it's everywhere, screaming infidelities and taking its wear...",
      icone: "🎸"
    },
    {
      titulo: "Miss Murder",
      autor: "AFI",
      categoria: "Dark Emo",
      descricao: "A estética gótica apurada de Davey Havok, luvas de renda e linhas de baixo sinistras.",
      citacao: "Hey, Miss Murder, can I? Make beauty stay if I take my life?",
      icone: "🖤"
    },
    {
      titulo: "Welcome to My Life",
      autor: "Simple Plan",
      categoria: "Pop Punk",
      descricao: "O desabafo adolescente de quem se sentia invisível e incompreendido pelo mundo adulto.",
      citacao: "Do you ever feel like breaking down? Do you ever feel out of place?",
      icone: "🌧️"
    },
    {
      titulo: "Seven Years",
      autor: "Saosin",
      categoria: "Post-Hardcore",
      descricao: "O falsete agudo cristalino de Anthony Green e a bateria precisa que redefiniu o gênero.",
      citacao: "I would find a way without, you would find a way without...",
      icone: "⏳"
    },
    {
      titulo: "Cedo ou Tarde",
      autor: "NX Zero",
      categoria: "Emo Nacional",
      descricao: "A canção que tocou em todas as rádios do Brasil, transformando o emocore em fenômeno de massa.",
      citacao: "Cedo ou tarde a gente vai se encontrar, tenho certeza numa bem melhor...",
      icone: "🇧🇷"
    },
    {
      titulo: "Cada Poça Dessa Rua",
      autor: "Fresno",
      categoria: "Emo Nacional",
      descricao: "Lucas Silveira transformando a chuva de Porto Alegre em poesia melancólica pura.",
      citacao: "Cada poça dessa rua tem um pouco de minhas lágrimas...",
      icone: "💧"
    },
    {
      titulo: "1997",
      autor: "Hateen",
      categoria: "Hardcore Melódico",
      descricao: "A ponte perfeita entre o underground da Galeria do Rock e os videoclipes da MTV Brasil.",
      citacao: "E hoje eu sei que tudo aquilo fez sentido...",
      icone: "📼"
    },
    {
      titulo: "The Quiet Things That No One Ever Knows",
      autor: "Brand New",
      categoria: "Emo / Alt Rock",
      descricao: "A batida dinâmica e as confissões murmuradas dentro de um carro em movimento à meia-noite.",
      citacao: "Keep the noise low, she doesn't wanna blow it...",
      icone: "🚗"
    },
    {
      titulo: "Garota Radical",
      autor: "Cine",
      categoria: "Synth-Emo",
      descricao: "A transição cheia de sintetizadores, calças coloridas e franjas desfiadas no final da década.",
      citacao: "Ela é uma garota radical, não liga pra nada...",
      icone: "🌈"
    },
    {
      titulo: "Note to Self",
      autor: "From First to Last",
      categoria: "Post-Hardcore",
      descricao: "A voz jovem e visceral de Sonny Moore (futuro Skrillex) rasgando os alto-falantes.",
      citacao: "Note to self: I miss you terribly!",
      icone: "📝"
    }
  ],

  otaku: [
    {
      titulo: "Akira",
      autor: "Katsuhiro Otomo",
      categoria: "Cyberpunk Clássico",
      descricao: "A moto vermelha de Kaneda derrapando no asfalto de Neo-Tokyo em 1988.",
      citacao: "Kaneda! Tetsuo!",
      icone: "🏍️"
    },
    {
      titulo: "Neon Genesis Evangelion",
      autor: "Hideaki Anno",
      categoria: "Mecha Psicológico",
      descricao: "A Unidade Eva-01 rugindo contra os Anjos sob o tema Cruel Angel's Thesis.",
      citacao: "Shinji, entra logo no robô!",
      icone: "🤖"
    },
    {
      titulo: "Cowboy Bebop",
      autor: "Shinichiro Watanabe",
      categoria: "Space Western",
      descricao: "Spike Spiegel acendendo um cigarro na chuva ao som do jazz inesquecível da banda The Seatbelts.",
      citacao: "See you, Space Cowboy...",
      icone: "🎷"
    },
    {
      titulo: "One Piece",
      autor: "Eiichiro Oda",
      categoria: "Aventura Shonen",
      descricao: "O chapéu de palha herdado de Shanks e o sonho inabalável de encontrar o tesouro no fim dos mares.",
      citacao: "O One Piece existe!",
      icone: "🏴‍☠️"
    },
    {
      titulo: "Dragon Ball Z",
      autor: "Akira Toriyama",
      categoria: "Shonen Lendário",
      descricao: "Goku transformando-se em Super Saiyajin pela primeira vez no planeta Namekusei sob relâmpagos.",
      citacao: "Kamehameha!",
      icone: "🐉"
    },
    {
      titulo: "Naruto",
      autor: "Masashi Kishimoto",
      categoria: "Ninja Shonen",
      descricao: "O garoto solitário no balanço de madeira que nunca voltou atrás em sua palavra.",
      citacao: "Esse é o meu jeito ninja de ser!",
      icone: "🍥"
    },
    {
      titulo: "Hunter x Hunter",
      autor: "Yoshihiro Togashi",
      categoria: "Shonen Complexo",
      descricao: "A complexidade matemática das regras do Nen e o voto inquebrável das correntes de Kurapika.",
      citacao: "Você deve aproveitar os pequenos desvios ao máximo.",
      icone: "🎣"
    },
    {
      titulo: "Berserk",
      autor: "Kentaro Miura",
      categoria: "Dark Fantasy",
      descricao: "Guts empunhando a colossal espada Dragonslayer contra os horrores do Eclipse.",
      citacao: "Mesmo que você tente juntar o que quebrou, nunca voltará a ser o mesmo.",
      icone: "🗡️"
    },
    {
      titulo: "Fullmetal Alchemist: Brotherhood",
      autor: "Hiromu Arakawa",
      categoria: "Alquimia & Shonen",
      descricao: "Os irmãos Elric aprendendo da forma mais dura a lei irrevogável da Troca Equivalente.",
      citacao: "A humanidade não pode obter nada sem antes dar algo em troca.",
      icone: "🦾"
    },
    {
      titulo: "Death Note",
      autor: "Tsugumi Ohba & Takeshi Obata",
      categoria: "Suspense Psicológico",
      descricao: "O duelo genial de intelectos entre Light Yagami e L, pontuado por maçãs e penas de caneta.",
      citacao: "Eu sou a justiça!",
      icone: "📓"
    },
    {
      titulo: "A Viagem de Chihiro",
      autor: "Hayao Miyazaki (Studio Ghibli)",
      categoria: "Animação Clássica",
      descricao: "O trem silencioso que corta os trilhos sobre a água e a casa de banhos dos espíritos antigos.",
      citacao: "Nada do que acontece é esquecido, mesmo que você não se lembre.",
      icone: "🚂"
    },
    {
      titulo: "Princesa Mononoke",
      autor: "Hayao Miyazaki",
      categoria: "Fantasia Épica",
      descricao: "A princesa criada por lobos gigantes lutando pela floresta ancestral intocada.",
      citacao: "Viver é a coisa mais difícil de todas.",
      icone: "🐺"
    },
    {
      titulo: "Your Name (Kimi no Na wa)",
      autor: "Makoto Shinkai",
      categoria: "Romance & Ficção",
      descricao: "O cometa Tiamat riscando o céu noturno e o cordão trançado de fios vermelhos do destino.",
      citacao: "Qual é o seu nome?",
      icone: "☄️"
    },
    {
      titulo: "Attack on Titan (Shingeki no Kyojin)",
      autor: "Hajime Isayama",
      categoria: "Épico Sombrio",
      descricao: "Os soldados com DMT cruzando os ares de Trost gritando pelo futuro da humanidade.",
      citacao: "Dediquem seus corações! (Sasageyo!)",
      icone: "🧱"
    },
    {
      titulo: "Bleach",
      autor: "Tite Kubo",
      categoria: "Sobrenatural",
      descricao: "Ichigo Kurosaki empunhando a Zangetsu e liberando a Bankai de lua negra pela primeira vez.",
      citacao: "Bankai: Tensa Zangetsu!",
      icone: "🌙"
    },
    {
      titulo: "JoJo's Bizarre Adventure",
      autor: "Hirohiko Araki",
      categoria: "Ação Estilizada",
      descricao: "As poses teatrais inconfundíveis, os Stands sobrenaturais e a jornada secular da família Joestar.",
      citacao: "Yare yare daze...",
      icone: "⭐"
    },
    {
      titulo: "Ghost in the Shell",
      autor: "Mamoru Oshii",
      categoria: "Cyberpunk Filosófico",
      descricao: "A Major Motoko Kusanagi mergulhando nos arranha-céus cinzentos de New Port City.",
      citacao: "A rede é vasta e infinita.",
      icone: "🧠"
    },
    {
      titulo: "Sailor Moon",
      autor: "Naoko Takeuchi",
      categoria: "Mahou Shoujo",
      descricao: "A heroína de uniforme de marinheira lutando pelo amor e pela justiça à luz da lua cheia.",
      citacao: "Pelo poder do prisma lunar, eu vou punir você!",
      icone: "🌙"
    },
    {
      titulo: "Demon Slayer (Kimetsu no Yaiba)",
      autor: "Koyoharu Gotouge",
      categoria: "Ação Sobrenatural",
      descricao: "A caixa de madeira nas costas de Tanjiro e a espetacular animação da Dança do Deus do Fogo.",
      citacao: "Respiração da Água, Décima Forma!",
      icone: "🌊"
    },
    {
      titulo: "Jujutsu Kaisen",
      autor: "Gege Akutami",
      categoria: "Dark Shonen",
      descricao: "Satoru Gojo retirando a venda preta para liberar o Infinito e a Expansão de Domínio.",
      citacao: "Ryoiki Tenkai: Muryokusho!",
      icone: "👁️"
    }
  ],

  gamer: [
    {
      titulo: "The Legend of Zelda: Ocarina of Time",
      autor: "Nintendo",
      categoria: "Aventura Épica",
      descricao: "A Master Sword sendo retirada do pedestal no Templo do Tempo ao som de Song of Storms.",
      citacao: "It's dangerous to go alone! Take this.",
      icone: "🗡️"
    },
    {
      titulo: "Super Mario World",
      autor: "Shigeru Miyamoto",
      categoria: "Plataforma Clássica",
      descricao: "A capa amarela de voar pelas colinas de Dinosaur Land e o atalho secreto da Star Road.",
      citacao: "Thank you Mario! But our princess is in another castle!",
      icone: "🍄"
    },
    {
      titulo: "Dark Souls",
      autor: "Hidetaka Miyazaki (FromSoftware)",
      categoria: "Action RPG",
      descricao: "A fogueira acesa no meio da escuridão de Lordran e o gesto solene de louvar o sol.",
      citacao: "Praise the Sun! \\[-]/",
      icone: "🔥"
    },
    {
      titulo: "Half-Life 2",
      autor: "Valve Software",
      categoria: "FPS Revolucionário",
      descricao: "Gordon Freeman empunhando o pé-de-cabra e a Gravity Gun pelas ruas distópicas de City 17.",
      citacao: "Rise and shine, Mister Freeman. Rise and shine.",
      icone: "☢️"
    },
    {
      titulo: "Portal",
      autor: "Valve Software",
      categoria: "Puzzle Sci-Fi",
      descricao: "A inteligência artificial GLaDOS guiando Chell pelas câmaras de teste com a arma de portais.",
      citacao: "The cake is a lie.",
      icone: "🎂"
    },
    {
      titulo: "Minecraft",
      autor: "Markus 'Notch' Persson",
      categoria: "Sandbox Infinito",
      descricao: "A primeira noite cavando a terra para se abrigar dos monstros ao som da trilha suave de C418.",
      citacao: "Never dig straight down!",
      icone: "⛏️"
    },
    {
      titulo: "DOOM (1993)",
      autor: "id Software",
      categoria: "FPS Pai do Gênero",
      descricao: "A escopeta calibre 12 estourando demônios nos corredores de Phobos ao som de guitarras sintetizadas.",
      citacao: "Rip and tear, until it is done!",
      icone: "👹"
    },
    {
      titulo: "Final Fantasy VII",
      autor: "Square",
      categoria: "JRPG Monumental",
      descricao: "Cloud Strife descendo do trem em Midgar com a Buster Sword e o tema One-Winged Angel de Sephiroth.",
      citacao: "Anata no koto wa wasurenai...",
      icone: "☄️"
    },
    {
      titulo: "The Witcher 3: Wild Hunt",
      autor: "CD Projekt RED",
      categoria: "RPG Aberto",
      descricao: "Geralt de Rivia cavalgando Carpeado pelos ventos de Velen e jogando uma partida relaxante de Gwent.",
      citacao: "Wind's howling...",
      icone: "🐺"
    },
    {
      titulo: "Metal Gear Solid",
      autor: "Hideo Kojima",
      categoria: "Stealth Cinematográfico",
      descricao: "A exclamação vermelha sobre os guardas de Shadow Moses e a lendária caixa de papelão espiã.",
      citacao: "Snake? Snake?! Snaaaake!",
      icone: "📦"
    },
    {
      titulo: "Chrono Trigger",
      autor: "Dream Team (Sakaguchi, Horii, Toriyama)",
      categoria: "JRPG Histórico",
      descricao: "A máquina do tempo Epoch cruzando eras desde a pré-história até o fim dos tempos.",
      citacao: "O tempo flui como um rio, e a história pode ser mudada.",
      icone: "⏰"
    },
    {
      titulo: "Shadow of the Colossus",
      autor: "Fumito Ueda",
      categoria: "Obra de Arte Interativa",
      descricao: "Wander e seu fiel cavalo Agro escalando gigantes de pedra e pelo em uma terra desolada.",
      citacao: "Thy next foe is...",
      icone: "🗿"
    },
    {
      titulo: "BioShock",
      autor: "Ken Levine",
      categoria: "Immersive Sim",
      descricao: "A descida para a cidade subaquática de Rapture e a frase de controle mental mais famosa dos jogos.",
      citacao: "Would you kindly...",
      icone: "🌊"
    },
    {
      titulo: "Red Dead Redemption 2",
      autor: "Rockstar Games",
      categoria: "Faroeste Cinematográfico",
      descricao: "Arthur Morgan olhando para o nascer do sol no topo da montanha com o coração em paz.",
      citacao: "I gave you all I had...",
      icone: "🤠"
    },
    {
      titulo: "God of War (2018)",
      autor: "Santa Monica Studio",
      categoria: "Ação Mitológica",
      descricao: "O Machado Leviathan voando de volta para a mão de Kratos enquanto ele educa seu filho pelas neves nórdicas.",
      citacao: "Don't be sorry. Be better.",
      icone: "🪓"
    },
    {
      titulo: "Street Fighter II",
      autor: "Capcom",
      categoria: "Luta Competitiva",
      descricao: "Ryu e Ken soltando Hadoukens nas docas de São Francisco e a voz clássica do narrador dizendo 'Fight!'.",
      citacao: "You must defeat Sheng Long to stand a chance!",
      icone: "🥊"
    },
    {
      titulo: "Halo: Combat Evolved",
      autor: "Bungie",
      categoria: "Sci-Fi FPS",
      descricao: "O canto gregoriano místico do menu inicial e o Master Chief pousando na misteriosa megaestrutura anelar.",
      citacao: "This cave is not a natural formation...",
      icone: "🪐"
    },
    {
      titulo: "Castlevania: Symphony of the Night",
      autor: "Konami",
      categoria: "Metroidvania",
      descricao: "Alucard entrando nos portões do castelo com sua capa fluida e a virada surpreendente do castelo invertido.",
      citacao: "What is a man? A miserable little pile of secrets!",
      icone: "🧛"
    },
    {
      titulo: "Hollow Knight",
      autor: "Team Cherry",
      categoria: "Metroidvania Indie",
      descricao: "O pequeno cavaleiro descansando no banco de ferro de Hallownest ao som das gotas da Cidade das Lágrimas.",
      citacao: "No mind to think. No will to break.",
      icone: "🪲"
    },
    {
      titulo: "Cyberpunk 2077",
      autor: "CD Projekt RED",
      categoria: "Cyberpunk RPG",
      descricao: "Johnny Silverhand com seu braço cromado olhando para os arranha-céus reluzentes sob a chuva de Night City.",
      citacao: "Wake up, samurai. We have a city to burn.",
      icone: "🦾"
    }
  ],

  programador: [
    {
      titulo: "The C Programming Language",
      autor: "Brian Kernighan & Dennis Ritchie",
      categoria: "Fundação da Computação",
      descricao: "O livro definitivo que introduziu o primeiro 'Hello, World!' e estruturou os pilares de todos os sistemas.",
      citacao: "printf(\"hello, world\\n\");",
      icone: "📖"
    },
    {
      titulo: "O Kernel do Linux",
      autor: "Linus Torvalds",
      categoria: "Open Source",
      descricao: "A mensagem despretensiosa em 1991 anunciando um sistema operacional livre 'apenas por diversão'.",
      citacao: "I'm doing a (free) operating system (just a hobby, won't be big and professional).",
      icone: "🐧"
    },
    {
      titulo: "A Máquina de Turing",
      autor: "Alan Turing",
      categoria: "História da Ciência",
      descricao: "O modelo matemático abstrato que decifrou o código Enigma e provou o que é computável no universo.",
      citacao: "Às vezes são as pessoas de quem ninguém espera nada que fazem as coisas que ninguém imagina.",
      icone: "⚙️"
    },
    {
      titulo: "O Primeiro Algoritmo",
      autor: "Ada Lovelace",
      categoria: "Pioneira dos Códigos",
      descricao: "As notas visionárias escritas para o motor analítico de Babbage, concebendo a computação além dos números.",
      citacao: "A máquina analítica tece padrões algébricos assim como o tear de Jacquard tece flores.",
      icone: "👑"
    },
    {
      titulo: "O Primeiro Bug Físico",
      autor: "Grace Hopper",
      categoria: "História dos Sistemas",
      descricao: "A mariposa literal encontrada presa nos relés do computador Harvard Mark II em 1947.",
      citacao: "First actual case of bug being found.",
      icone: "🦋"
    },
    {
      titulo: "Clean Code",
      autor: "Robert C. Martin (Uncle Bob)",
      categoria: "Boas Práticas",
      descricao: "O manifesto de engenharia de software defendendo a regra do escoteiro: deixe o código mais limpo do que encontrou.",
      citacao: "Qualquer tolo pode escrever código que um computador entenda. Bons programadores escrevem código que humanos entendem.",
      icone: "🧹"
    },
    {
      titulo: "The Matrix: Digital Rain",
      autor: "Lana & Lilly Wachowski",
      categoria: "Cultura Hacker",
      descricao: "A cascata de caracteres verdes descendo verticalmente em monitores CRT pretos.",
      citacao: "There is no spoon.",
      icone: "🟩"
    },
    {
      titulo: "O Repositório Git",
      autor: "Linus Torvalds",
      categoria: "Controle de Versão",
      descricao: "O grafo direcionado acíclico que transformou para sempre a colaboração e a engenharia distribuída.",
      citacao: "git commit -m 'initial commit'",
      icone: "🌳"
    },
    {
      titulo: "O Patinho de Borracha (Rubber Duck)",
      autor: "The Pragmatic Programmer",
      categoria: "Metodologia de Debug",
      descricao: "A técnica comprovada de explicar linha por linha o código para um brinquedo inerte até o erro se revelar.",
      citacao: "Explique para o pato. Ele ouve em silêncio e nunca julga.",
      icone: "🦆"
    },
    {
      titulo: "Stack Overflow Answer #1",
      autor: "Comunidade de Desenvolvedores",
      categoria: "Salvação Noturna",
      descricao: "A resposta aceita com o selo verde de 2011 que salvou centenas de milhares de deploys de madrugada.",
      citacao: "This solved my issue, thank you so much!",
      icone: "✅"
    },
    {
      titulo: "A Batalha Vim vs Emacs",
      autor: "Cultura Unix",
      categoria: "Fidelidade de Editor",
      descricao: "A lendária guerra santa dos editores de texto no terminal e o labirinto clássico de sair do Vim.",
      citacao: ":wq!",
      icone: "⌨️"
    },
    {
      titulo: "O Guia do Mochileiro das Galáxias: 42",
      autor: "Douglas Adams",
      categoria: "Humor Nerd",
      descricao: "A resposta definitiva para a pergunta fundamental sobre a vida, o universo e tudo mais.",
      citacao: "Don't Panic! A resposta é 42.",
      icone: "🌌"
    },
    {
      titulo: "Apollo 11 Guidance Computer",
      autor: "Margaret Hamilton",
      categoria: "Software Crítico",
      descricao: "O código impresso em pilhas de papel da altura de sua criadora que permitiu o pouso lunar sem travamento.",
      citacao: "O software assíncrono evitou que o alarme 1202 abortasse o pouso da Apollo 11.",
      icone: "🚀"
    },
    {
      titulo: "The Art of Computer Programming",
      autor: "Donald Knuth",
      categoria: "Teoria dos Algoritmos",
      descricao: "A monumental enciclopédia matemática e os lendários cheques de recompensa para quem encontrasse um erro.",
      citacao: "Premature optimization is the root of all evil.",
      icone: "📚"
    },
    {
      titulo: "RFC 1149: IP sobre Pombos-Correio",
      autor: "D. Waitzman (IETF)",
      categoria: "Redes & Sátira",
      descricao: "A especificação formal e bem-humorada de transporte de pacotes TCP/IP por aves em pleno voo.",
      citacao: "A standard for the transmission of IP datagrams on avian carriers.",
      icone: "🕊️"
    },
    {
      titulo: "O Bug do Milênio (Y2K)",
      autor: "Engenheiros Globais",
      categoria: "História Tecnológica",
      descricao: "A vigília planetária no réveillon de 1999 para garantir que os dois dígitos de data não parassem o mundo.",
      citacao: "00 não é 1900. O deploy da virada funcionou.",
      icone: "🎆"
    },
    {
      titulo: "Espaços vs Tabs",
      autor: "Silicon Valley (Série)",
      categoria: "Debate Sagrado",
      descricao: "A incompatibilidade amorosa de Richard Hendricks baseada na indentação por 4 espaços ou tabulação.",
      citacao: "I use spaces. Four spaces.",
      icone: "␣"
    },
    {
      titulo: "Teoria da Informação",
      autor: "Claude Shannon",
      categoria: "Pai da Era Digital",
      descricao: "O artigo seminal de 1948 que definiu a unidade básica de informação do universo: o bit.",
      citacao: "A incerteza é medida pela entropia da mensagem.",
      icone: "💡"
    },
    {
      titulo: "Unix Epoch",
      autor: "Laboratórios Bell",
      categoria: "Tempo dos Computadores",
      descricao: "O início da contagem dos segundos da era moderna dos sistemas: 00:00:00 UTC de 1º de janeiro de 1970.",
      citacao: "timestamp: 0",
      icone: "⏱️"
    },
    {
      titulo: "Paleta Monokai & Dracula Theme",
      autor: "Wimer Hazenberg & Zeno Rocha",
      categoria: "Estética de Código",
      descricao: "Os tons de roxo, rosa, verde e ciano que protegem os olhos dos programadores durante a noite.",
      citacao: "Syntax highlighting é carinho para a mente cansada.",
      icone: "🎨"
    }
  ],

  bruxo: [
    {
      titulo: "Macbeth e o Caldeirão das Bruxas",
      autor: "William Shakespeare",
      categoria: "Teatro Clássico",
      descricao: "O encantamento rimado ao redor do caldeirão borbulhante na charneca escocesa escura.",
      citacao: "Double, double toil and trouble; fire burn and cauldron bubble!",
      icone: "🍲"
    },
    {
      titulo: "Hécate na Encruzilhada",
      autor: "Mitologia Grega",
      categoria: "Arquetipo Noturno",
      descricao: "A guardiã das encruzilhadas, senhora das tochas flamejantes, da lua minguante e dos cães noturnos.",
      citacao: "Onde três caminhos se encontram, o véu entre os mundos se afina.",
      icone: "🗝️"
    },
    {
      titulo: "O Grimório de São Cipriano",
      autor: "Tradição Oculta Ibérica",
      categoria: "Livro das Sombras",
      descricao: "O lendário tomo encadernado em couro escuro com fechos de latão e fórmulas arcanas ancestrais.",
      citacao: "As palavras gravadas a tinta de nogueira guardam segredos que o tempo não apaga.",
      icone: "📖"
    },
    {
      titulo: "Circe na Ilha de Ea",
      autor: "Homero (A Odisseia)",
      categoria: "Mitologia Clássica",
      descricao: "A feiticeira soberana dos venenos e encantamentos que transformava os marinheiros em animais.",
      citacao: "Com um toque de sua vara mágica e uma poção de mel selvagem, a forma humana se desfez.",
      icone: "🍷"
    },
    {
      titulo: "O Herbário de Hildegarda de Bingen",
      autor: "Santa Hildegarda",
      categoria: "Fitoterapia Medieval",
      descricao: "Os segredos botânicos da mandrágora, do sabugueiro e das ervas curativas da floresta profunda.",
      citacao: "Toda planta carrega em suas folhas a assinatura da cura do mundo.",
      icone: "🌿"
    },
    {
      titulo: "Baba Yaga e a Casa com Pés de Galinha",
      autor: "Folclore Eslavo",
      categoria: "Contos Ancestrais",
      descricao: "A bruxa anciã que voa pelo céu dentro de um pilão de ferro e vive numa cabana que gira sobre patas gigantes.",
      citacao: "Cabana, vire as costas para a floresta e a frente para mim!",
      icone: "🏚️"
    },
    {
      titulo: "As Bruxas de Salem",
      autor: "Arthur Miller",
      categoria: "História & Memória",
      descricao: "O julgamento do século XVII na Nova Inglaterra e a resistência daquelas que conheciam os remédios da terra.",
      citacao: "Não há nada mais perigoso do que o medo que finge ser virtude.",
      icone: "⚖️"
    },
    {
      titulo: "A Raiz da Mandrágora",
      autor: "Botânica Oculta",
      categoria: "Lendas da Terra",
      descricao: "A raiz com forma humana que solta um grito ensurdecedor ao ser arrancada sob o luar.",
      citacao: "Colha com respeito à meia-noite e proteja os ouvidos com cera pura.",
      icone: "🌱"
    },
    {
      titulo: "O Caldeirão de Cerridwen",
      autor: "Mitologia Celta",
      categoria: "Sabedoria das Águas",
      descricao: "A poção fervida por um ano e um dia para destilar apenas três gotas da iluminação cósmica (Awen).",
      citacao: "Três gotas do caldeirão conferem o saber de tudo o que foi e tudo o que há de vir.",
      icone: "💧"
    },
    {
      titulo: "Morgana Le Fay em Avalon",
      autor: "Ciclo Arturiano",
      categoria: "Lenda Mística",
      descricao: "A sacerdotisa da ilha das maçãs envolta em brumas eternas, guardiã dos mistérios de Excalibur.",
      citacao: "As brumas de Avalon só se abrem para quem sabe navegar com o coração.",
      icone: "🌫️"
    },
    {
      titulo: "A Noite de Walpurgis",
      autor: "Fausto de Goethe",
      categoria: "Literatura Alemã",
      descricao: "A reunião mágica anual nas montanhas de Harz, onde as fogueiras queimam alto sob as estrelas de abril.",
      citacao: "Pelas encostas do Brocken, o vento sopra segredos antigos.",
      icone: "🔥"
    },
    {
      titulo: "O Espelho de Obsidiana",
      autor: "Artes de Vidência",
      categoria: "Adivinhação",
      descricao: "A lâmina de pedra vulcânica negra polida usada para enxergar através do véu dos tempos.",
      citacao: "Olhe no fundo do espelho negro sem piscar até que a sombra comece a sussurrar.",
      icone: "🪞"
    },
    {
      titulo: "O Corvo de Edgar Allan Poe",
      autor: "Edgar Allan Poe",
      categoria: "Poesia Gótica",
      descricao: "A ave negra pousada sobre o busto de Atena, guardiã dos mistérios e do luto eterno.",
      citacao: "Quoth the Raven: Nevermore.",
      icone: "🦅"
    },
    {
      titulo: "O Livro das Sombras",
      autor: "Tradição Wicca & Folk",
      categoria: "Prática Natural",
      descricao: "O diário manuscrito de receitas lunares, correspondências de cristais e cânticos de proteção.",
      citacao: "Sem fazer mal a ninguém, faz o que quiseres.",
      icone: "✨"
    },
    {
      titulo: "O Atame Cerimonial",
      autor: "Instrumento Mágico",
      categoria: "Direcionamento de Energia",
      descricao: "A adaga de cabo escuro que não corta a matéria, mas desenha círculos de proteção no ar.",
      citacao: "Pela ponta do aço negro, consagro este círculo sagrado.",
      icone: "🗡️"
    },
    {
      titulo: "A Vela de Cera de Abelha",
      autor: "Luz Sagrada",
      categoria: "Elemento Fogo",
      descricao: "A queima aromática dourada de mel e resina que dissipa energias pesadas de qualquer ambiente.",
      citacao: "Uma única vela no quarto afugenta a mais densa escuridão.",
      icone: "🕯️"
    },
    {
      titulo: "A Teia de Aranha Cintilante",
      autor: "Geometria da Natureza",
      categoria: "Símbolo de Destino",
      descricao: "A teia orvalhada ao amanhecer que lembra que tudo na criação está intrinsecamente conectado.",
      citacao: "Nenhum fio se move sozinho sem que a teia inteira sinta a vibração.",
      icone: "🕸️"
    },
    {
      titulo: "O Voo Noturno de Vassoura",
      autor: "Iconografia Popular",
      categoria: "Símbolo de Transcendência",
      descricao: "A metáfora do espírito que se eleva acima das preocupações terrenas para contemplar as estrelas.",
      citacao: "A vassoura não voa por madeira, mas pela leveza de quem sabe sonhar alto.",
      icone: "🧹"
    },
    {
      titulo: "O Poço dos Desejos",
      autor: "Folclore Europeu",
      categoria: "Águas Profundas",
      descricao: "O poço de pedras cobertas de musgo onde se joga uma moeda de cobre sussurrando um segredo.",
      citacao: "O que a água profunda guarda, o coração não esquece.",
      icone: "🪙"
    },
    {
      titulo: "O Pentagrama dos Elementos",
      autor: "Geometria Hermética",
      categoria: "Equilíbrio Cósmico",
      descricao: "A estrela de cinco pontas unindo Terra, Ar, Fogo, Água sob o domínio harmônico do Espírito.",
      citacao: "Em perfeito equilíbrio, os quatro pilares sustentam a luz interior.",
      icone: "⭐"
    }
  ],

  feiticeiro: [
    {
      titulo: "Mago Merlin de Camelot",
      autor: "Ciclo Arturiano",
      categoria: "Arquétipo do Sábio",
      descricao: "O profeta conselheiro de reis que conhecia os segredos do tempo e a linguagem dos dragões.",
      citacao: "O futuro não é fixo como uma pedra, ele se molda a cada escolha no presente.",
      icone: "🧙‍♂️"
    },
    {
      titulo: "Doutor Estranho e o Olho de Agamotto",
      autor: "Marvel Comics",
      categoria: "Artes Místicas",
      descricao: "As mandalas de luz geométrica desenhadas no ar e o controle dos fios dourados do tempo.",
      citacao: "Dormammu, eu vim barganhar!",
      icone: "👁️"
    },
    {
      titulo: "Gandalf em Khazad-dûm",
      autor: "J.R.R. Tolkien (O Senhor dos Anéis)",
      categoria: "Alta Fantasia",
      descricao: "O cajado luminoso e a espada Glamdring barrando a passagem da sombra do Balrog na ponte de pedra.",
      citacao: "You shall not pass!",
      icone: "⚔️"
    },
    {
      titulo: "A Grande Obra Alquímica",
      autor: "Nicolau Flamel",
      categoria: "Alquimia Clássica",
      descricao: "A busca lendária pela Pedra Filosofal e a transmutação espiritual das imperfeições da alma em ouro puro.",
      citacao: "Solve et coagula: dissolva e reconstrua com paciência infinita.",
      icone: "💎"
    },
    {
      titulo: "O Caibalion e as Sete Leis",
      autor: "Três Iniciados",
      categoria: "Filosofia Hermética",
      descricao: "Os axiomas de Hermes Trismegisto sobre o princípio da vibração, correspondência e mentalismo.",
      citacao: "O Todo é Mente; o Universo é Mental.",
      icone: "📜"
    },
    {
      titulo: "O Feiticeiro de Terramar",
      autor: "Ursula K. Le Guin",
      categoria: "Literatura Fantástica",
      descricao: "O jovem mago Ged aprendendo que dominar as forças do mundo exige conhecer o verdadeiro nome de cada coisa.",
      citacao: "Para acender uma vela, é preciso lançar uma sombra.",
      icone: "🐉"
    },
    {
      titulo: "O Universo Infinito de Giordano Bruno",
      autor: "Giordano Bruno",
      categoria: "Astronomia & Esoterismo",
      descricao: "O filósofo renascentista que visualizou círculos mágicos e a existência de mundos infinitos no cosmos.",
      citacao: "Se o Todo é infinito, não há centro nem limites para a luz.",
      icone: "🌌"
    },
    {
      titulo: "A Lente Espectral de Newton",
      autor: "Sir Isaac Newton",
      categoria: "Óptica e Alquimia",
      descricao: "O prisma de vidro que dividiu o feixe de luz solar invisível nas sete cores do arco-íris cósmico.",
      citacao: "A luz branca carrega em seu seio todas as cores da criação.",
      icone: "🌈"
    },
    {
      titulo: "O Manto Estelar e as Constelações",
      autor: "Tradição Astral",
      categoria: "Cartografia Celeste",
      descricao: "O manto bordado com fios de prata refletindo a posição exata das estrelas guia no firmamento.",
      citacao: "Quem sabe ler o teto do mundo nunca se perde na escuridão da terra.",
      icone: "✨"
    },
    {
      titulo: "O Cristal de Mana Pulsante",
      autor: "Alta Fantasia",
      categoria: "Fonte de Poder",
      descricao: "A gema multifacetada que levita suavemente emitindo uma luz azul ciano reconfortante.",
      citacao: "A energia flui para onde a concentração e a pureza de intenção apontam.",
      icone: "💠"
    },
    {
      titulo: "O Feitiço Expecto Patronum",
      autor: "Harry Potter",
      categoria: "Magia Branca",
      descricao: "A condensação de uma memória de pura felicidade que ganha a forma de um guardião prateado luminoso.",
      citacao: "A felicidade pode ser encontrada mesmo nas horas mais sombrias, se alguém se lembrar de acender a luz.",
      icone: "🦌"
    },
    {
      titulo: "Paracelso e os Quatro Elementais",
      autor: "Paracelso",
      categoria: "Alquimia Renascentista",
      descricao: "A sabedoria oculta dos gnomos da terra, ondinas da água, silfos do ar e salamandras do fogo.",
      citacao: "A natureza é o maior livro aberto de magia que o homem pode contemplar.",
      icone: "🔥"
    },
    {
      titulo: "O Relógio Astronômico de Praga",
      autor: "Mestres Relojoeiros de 1410",
      categoria: "Engenharia Mágica",
      descricao: "O mecanismo esotérico que calcula as fases da lua, os signos zodiacais e o tempo solar.",
      citacao: "As engrenagens do tempo cantam a sinfonia dos planetas em volta do sol.",
      icone: "⚙️"
    },
    {
      titulo: "O Báculo do Tempestuoso",
      autor: "Tradição das Varinhas",
      categoria: "Canalizador de Relâmpagos",
      descricao: "A haste de madeira de carvalho com núcleo de meteoro que canaliza as tempestades do céu.",
      citacao: "O trovão avisa, mas é o relâmpago que rasga o horizonte.",
      icone: "⚡"
    },
    {
      titulo: "O Livro dos Mortos e a Pesagem da Alma",
      autor: "Mitologia Egípcia",
      categoria: "Sabedoria Funerária",
      descricao: "A balança sagrada de Anúbis onde o coração do mago é pesado contra a leveza da pena da verdade de Maat.",
      citacao: "Que seu coração seja tão leve quanto uma pena ao final da grande jornada.",
      icone: "🪶"
    },
    {
      titulo: "A Chave de Enoch",
      autor: "John Dee & Edward Kelley",
      categoria: "Alta Magia Cerimonial",
      descricao: "A linguagem angélica cósmica decodificada no espelho de cristal do astrólogo real elisabetano.",
      citacao: "Os nomes das estrelas foram entalhados no firmamento antes do primeiro amanhecer.",
      icone: "🔑"
    },
    {
      titulo: "O Círculo de Transmutação Geométrico",
      autor: "Fullmetal Alchemist",
      categoria: "Geometria Mágica",
      descricao: "As linhas precisas desenhadas com giz branco que canalizam as forças tectônicas da crosta terrestre.",
      citacao: "Compreensão, decomposição e recomposição.",
      icone: "⭕"
    },
    {
      titulo: "A Quinta-Essência (O Éter)",
      autor: "Aristóteles & Alquimistas",
      categoria: "Cosmologia Antiga",
      descricao: "O elemento imponderável e sutil que preenche o espaço sideral e conecta o pensamento à matéria.",
      citacao: "O quinto elemento é a respiração do próprio cosmos.",
      icone: "🌌"
    },
    {
      titulo: "O Portal Interdimensional",
      autor: "Ficção Arcana",
      categoria: "Dobra Espacial",
      descricao: "O vórtice elíptico de luz violeta e partículas cósmicas que une dois pontos distantes do universo.",
      citacao: "A distância é apenas uma ilusão para quem aprende a dobrar a luz.",
      icone: "🌀"
    },
    {
      titulo: "A Ampulheta de Areia Astral",
      autor: "Cronologia Arcana",
      categoria: "Relíquia do Tempo",
      descricao: "O vidro soprado em cujo interior caem grãos brilhantes de poeira estelar marcando ciclos cósmicos.",
      citacao: "Cada grão que cai já viu o nascimento e a morte de uma galáxia.",
      icone: "⏳"
    }
  ],

  cleanboy: [
    {
      titulo: "A Mágica da Arrumação",
      autor: "Marie Kondo",
      categoria: "Organização Consciente",
      descricao: "O método KonMari de agradecer aos objetos e preservar ao seu redor apenas o que desperta alegria no peito.",
      citacao: "Fique apenas com o que toca seu coração com alegria.",
      icone: "✨"
    },
    {
      titulo: "Less is More (Menos é Mais)",
      autor: "Mies van der Rohe",
      categoria: "Arquitetura Moderna",
      descricao: "A clareza dos espaços abertos, vigas limpas de aço e grandes painéis de vidro banhados por luz natural.",
      citacao: "Menos é mais. Deus está nos detalhes.",
      icone: "🏢"
    },
    {
      titulo: "Os 10 Princípios do Bom Design",
      autor: "Dieter Rams (Braun)",
      categoria: "Design Funcional",
      descricao: "A filosofia seminal que inspirou toda a tecnologia minimalista contemporânea: o bom design é o mínimo de design.",
      citacao: "Menos, mas melhor.",
      icone: "📻"
    },
    {
      titulo: "Revista Kinfolk",
      autor: "Nathan Williams",
      categoria: "Slow Living",
      descricao: "A celebração do ritmo lento, refeições caseiras compartilhadas com amigos e manhãs de domingo tranquilas.",
      citacao: "Viver devagar não é perder tempo; é saborear o que realmente importa.",
      icone: "📖"
    },
    {
      titulo: "O Ritual de Skincare Coreano",
      autor: "Tradição K-Beauty",
      categoria: "Autocuidado & Glow",
      descricao: "Os passos meticulosos de hidratação e proteção solar que deixam a pele viçosa com efeito glass skin.",
      citacao: "Cuidar de si mesmo é uma forma diária de respeito ao templo do seu corpo.",
      icone: "🧴"
    },
    {
      titulo: "A Cerâmica Artesanal Noborigama",
      autor: "Mestres Oleiros",
      categoria: "Artesanato Autêntico",
      descricao: "Tigelas e xícaras de terracota moldadas no torno manual com esmaltes naturais e queima a lenha.",
      citacao: "Nenhuma peça é idêntica à outra; cada curva carrega o toque da mão que a criou.",
      icone: "🏺"
    },
    {
      titulo: "A Camisa de Linho Cru",
      autor: "Alfaiataria Mediterrânea",
      categoria: "Moda Atemporal",
      descricao: "O caimento arejado e natural do linho puro em tons areia que fica mais bonito quanto mais é usado.",
      citacao: "A elegância verdadeira nunca precisa de esforço visível.",
      icone: "👔"
    },
    {
      titulo: "A Planta Monstera Deliciosa",
      autor: "Design Botânico Urbano",
      categoria: "Selva Particular",
      descricao: "A exuberância das folhas verdes recortadas iluminadas pelo sol matinal na sala de estar.",
      citacao: "Uma folha verde viva no canto do cômodo renova o ar da casa e da mente.",
      icone: "🪴"
    },
    {
      titulo: "O Difusor de Bergamota e Cedro",
      autor: "Perfumaria de Ambiente",
      categoria: "Assinatura Olfativa",
      descricao: "As varetas de bambu em frasco de vidro âmbar liberando notas cítricas e amadeiradas pelo quarto.",
      citacao: "O aroma suave de casa limpa acalma o sistema nervoso no primeiro suspiro.",
      icone: "🌿"
    },
    {
      titulo: "A Cafeteira Chemex de Vidro",
      autor: "Dr. Peter Schlumbohm",
      categoria: "Café Especial",
      descricao: "A ampulheta de borossilicato com colar de madeira e laço de couro para um café limpo e aromático.",
      citacao: "Extrair um bom café coado é um momento sagrado de paciência diária.",
      icone: "☕"
    },
    {
      titulo: "A Luminária Akari de Isamu Noguchi",
      autor: "Isamu Noguchi",
      categoria: "Escultura de Luz",
      descricao: "A cúpula de papel de arroz japonês washi e bambu que transforma a lâmpada em luar difuso.",
      citacao: "A luz de uma Akari não ilumina o quarto; ela aquece o ar ao redor.",
      icone: "🏮"
    },
    {
      titulo: "A Cadeira de Palhinha Cesca",
      autor: "Marcel Breuer (Bauhaus)",
      categoria: "Mobiliário Histórico",
      descricao: "A curva tubular contínua de aço cromado combinada com a leveza da palha vienense entrelaçada.",
      citacao: "O aço traz a força da indústria; a palhinha traz o calor do artesão.",
      icone: "🪑"
    },
    {
      titulo: "A Filosofia Muji",
      autor: "Mujirushi Ryohin",
      categoria: "Design sem Rótulo",
      descricao: "A beleza funcional dos produtos sem logotipo, materiais puros e embalagens transparentes.",
      citacao: "Não é 'isto é o que eu quero', é 'isto é suficiente e perfeito'.",
      icone: "🏷️"
    },
    {
      titulo: "A Vela de Soja com Pavio de Madeira",
      autor: "Velas Artesanais",
      categoria: "Aconchego Auditivo",
      descricao: "A cera vegetal natural derretendo suavemente com o som crepitante de uma lareira em miniatura.",
      citacao: "O crepitar do pavio de madeira é a trilha sonora perfeita para a leitura noturna.",
      icone: "🕯️"
    },
    {
      titulo: "O Espelho Orgânico Ondulado",
      autor: "Design Contemporâneo",
      categoria: "Fluidez Visual",
      descricao: "O espelho sem bordas rígidas com curvas livres como uma poça de água cintilante na parede.",
      citacao: "A vida não tem cantos retos pontiagudos; permita-se fluir em curvas suaves.",
      icone: "🪞"
    },
    {
      titulo: "O Matcha Latte Cerimonial",
      autor: "Chá Verde de Uji",
      categoria: "Nutrição & Foco",
      descricao: "O pó esmeralda batido com batedor chasen de bambu até formar uma espuma aveludada verde-clara.",
      citacao: "Energia estável e mente clara, sem as oscilações bruscas da pressa.",
      icone: "🍵"
    },
    {
      titulo: "O Caderno Midori MD Paper",
      autor: "Papelaria Japonesa",
      categoria: "Escrita Tátil",
      descricao: "A folha lisa e cremosa onde a tinta da caneta desliza sem sangrar para o verso.",
      citacao: "Colocar palavras no papel limpo é desatar os nós do pensamento.",
      icone: "📓"
    },
    {
      titulo: "A Toalha de Algodão Waffle",
      autor: "Têxtil Orgânico",
      categoria: "Sensação Tátil",
      descricao: "A textura alveolar em colmeia que seca com maciez e traz a sensação revigorante de um spa em casa.",
      citacao: "O toque suave do algodão cru acolhe o cansaço do corpo.",
      icone: "🛁"
    },
    {
      titulo: "A Frigideira de Ferro Le Creuset",
      autor: "Culinária Consciente",
      categoria: "Gastronomia Afetiva",
      descricao: "O ferro fundido esmaltado em tom neutro que cozinha lentamente legumes frescos no azeite.",
      citacao: "Cozinhar sua própria comida com ingredientes frescos é o maior ato de independência.",
      icone: "🍳"
    },
    {
      titulo: "O Banho de Sais do Mar Morto",
      autor: "Termalismo Natural",
      categoria: "Relaxamento Fisiológico",
      descricao: "A água morna enriquecida com minerais e gotas de óleo de lavanda para encerrar o dia em paz.",
      citacao: "Deixe a água morna levar embora todo o peso que você não precisa carregar.",
      icone: "🫧"
    }
  ],

  coach: [
    {
      titulo: "Os 7 Hábitos das Pessoas Eficazes",
      autor: "Stephen Covey",
      categoria: "Liderança Pessoal",
      descricao: "O clássico transformador que ensina a começar qualquer jornada com o objetivo final bem claro na mente.",
      citacao: "Comece com o fim em mente. Seja proativo.",
      icone: "🎯"
    },
    {
      titulo: "Hábitos Atômicos",
      autor: "James Clear",
      categoria: "Melhoria Contínua",
      descricao: "O poder exponencial de melhorar apenas 1% todos os dias através de pequenos sistemas consistentes.",
      citacao: "Você não sobe ao nível dos seus objetivos; você cai ao nível dos seus sistemas.",
      icone: "⚛️"
    },
    {
      titulo: "Pai Rico, Pai Pobre",
      autor: "Robert Kiyosaki",
      categoria: "Inteligência Financeira",
      descricao: "A ruptura de mentalidade entre trabalhar por dinheiro ou construir ativos que trabalhem por você.",
      citacao: "Os ricos compram ativos; os pobres compram passivos pensando que são ativos.",
      icone: "💰"
    },
    {
      titulo: "O Poder do Hábito",
      autor: "Charles Duhigg",
      categoria: "Neurociência Comportamental",
      descricao: "A anatomia da repetição: entender a deixa, executar a nova rotina e colher a recompensa positiva.",
      citacao: "A mudança pode não ser rápida, mas com tempo e esforço, quase qualquer hábito pode ser remodelado.",
      icone: "🔄"
    },
    {
      titulo: "Quem Pensa Enriquece",
      autor: "Napoleon Hill",
      categoria: "Mentalidade de Vitória",
      descricao: "A análise de décadas das mentes mais brilhantes e a descoberta da força do desejo ardente inabalável.",
      citacao: "O que a mente do homem pode conceber e acreditar, ela pode conquistar.",
      icone: "💡"
    },
    {
      titulo: "Mindset: A Nova Psicologia do Sucesso",
      autor: "Carol S. Dweck",
      categoria: "Psicologia Cognitiva",
      descricao: "A libertação do mindset fixo em direção ao mindset de crescimento, onde o erro é apenas combustível para o aprendizado.",
      citacao: "O teste do sucesso não é a ausência de dificuldades, mas a capacidade de aprender com elas.",
      icone: "🧠"
    },
    {
      titulo: "Essencialismo: A Disciplinada Busca por Menos",
      autor: "Greg McKeown",
      categoria: "Foco Radical",
      descricao: "A arte corajosa de dizer 'não' para o bom a fim de poder dedicar energia máxima ao que é verdadeiramente extraordinário.",
      citacao: "Menos, porém melhor. Se não for um 'sim' absoluto, então é um 'não'.",
      icone: "⚡"
    },
    {
      titulo: "A Arte de Fazer Acontecer (GTD)",
      autor: "David Allen",
      categoria: "Gestão do Tempo",
      descricao: "O método definitivo para esvaziar a mente de pendências e focar totalmente na ação do momento presente.",
      citacao: "Sua mente é para ter ideias, não para segurá-las.",
      icone: "📥"
    },
    {
      titulo: "O Homem Mais Rico da Babilônia",
      autor: "George S. Clason",
      categoria: "Sabedoria Financeira Antiga",
      descricao: "As parábolas ancestrais sobre guardar uma parte de tudo o que se ganha para construir o futuro.",
      citacao: "Pague a si mesmo primeiro. Faça seu ouro multiplicar-se em servos leais.",
      icone: "🪙"
    },
    {
      titulo: "Princípios: Vida e Trabalho",
      autor: "Ray Dalio (Bridgewater)",
      categoria: "Estratégia de Decisão",
      descricao: "A prática da transparência radical e a coragem de encarar a realidade dos fatos sem autoengano.",
      citacao: "Dor + Reflexão = Progresso.",
      icone: "📊"
    },
    {
      titulo: "O Milagre da Manhã",
      autor: "Hal Elrod",
      categoria: "Rotina Extraordinária",
      descricao: "O método dos Salvadores da Vida (Life S.A.V.E.R.S.) para iniciar o dia com meditação, afirmação e leitura focada.",
      citacao: "Como você acorda a cada manhã determina o ritmo de todo o seu dia.",
      icone: "🌅"
    },
    {
      titulo: "Antifrágil: Coisas que se Beneficiam com o Caos",
      autor: "Nassim Nicholas Taleb",
      categoria: "Resiliência Máxima",
      descricao: "Ser melhor do que resiliente: ser capaz de usar o estresse, a volatilidade e as crises para crescer ainda mais forte.",
      citacao: "O vento apaga a vela fraca, mas aviva o grande incêndio.",
      icone: "🛡️"
    },
    {
      titulo: "A Regra 10X",
      autor: "Grant Cardone",
      categoria: "Escala & Ambição",
      descricao: "Multiplicar as metas e o esforço por dez para garantir que nenhum imprevisto impeça a conquista do resultado.",
      citacao: "O sucesso não é uma opção; é seu dever, obrigação e responsabilidade.",
      icone: "🚀"
    },
    {
      titulo: "A Jornada do Herói",
      autor: "Joseph Campbell",
      categoria: "Narrativa Existencial",
      descricao: "O chamado à aventura, a travessia do limiar, o enfrentamento dos dragões e o retorno transformador com o elixir.",
      citacao: "A caverna em que você tem medo de entrar guarda o tesouro que você procura.",
      icone: "🗡️"
    },
    {
      titulo: "O Quadro Kanban de Alta Performance",
      autor: "Metodologias Ágeis",
      categoria: "Produtividade Visual",
      descricao: "A clareza absoluta de fluxo de trabalho dividida em Backlog, To Do, In Progress e Done.",
      citacao: "Limite o trabalho em andamento (WIP) e conclua antes de começar de novo.",
      icone: "📋"
    },
    {
      titulo: "O Relógio Cronógrafo Suíço",
      autor: "Precisão Mecânica",
      categoria: "Domínio do Tempo",
      descricao: "O ponteiro de segundos que não mente e lembra que cada minuto gasto deve valer seu peso em ouro.",
      citacao: "O tempo é o único recurso finito que não pode ser recuperado depois de gasto.",
      icone: "⌚"
    },
    {
      titulo: "O Café Espresso Duplo com Crema Ouro",
      autor: "Foco Matinal",
      categoria: "Impulso de Produtividade",
      descricao: "A dose concentrada de cafeína sem açúcar para iniciar reuniões decisivas com foco cirúrgico.",
      citacao: "Foco afiado, visão desobstruída e execução impecável.",
      icone: "☕"
    },
    {
      titulo: "O Banho Gelado (Protocolo Wim Hof)",
      autor: "Wim Hof",
      categoria: "Domínio da Fisiologia",
      descricao: "A imersão na água fria matinal treinando o córtex pré-frontal para não hesitar diante do desconforto.",
      citacao: "Controle sua respiração e você controlará qualquer adversidade.",
      icone: "🧊"
    },
    {
      titulo: "O Pitch Deck de 10 Slides",
      autor: "Vale do Silício",
      categoria: "Comunicação Persuasiva",
      descricao: "A capacidade executiva de condensar um negócio bilionário em poucos minutos de clareza arrebatadora.",
      citacao: "Se você não consegue explicar em três minutos, você ainda não entendeu direito.",
      icone: "📑"
    },
    {
      titulo: "O Toque do Sino da Bolsa",
      autor: "Mercado Financeiro Global",
      categoria: "Símbolo de Conquista",
      descricao: "O sino que abre o pregão das maiores empresas do mundo celebrando a inovação e o crescimento.",
      citacao: "O mercado recompensa quem resolve problemas reais com consistência inabalável.",
      icone: "🔔"
    }
  ],

  forrozeiro: [
    {
      titulo: "Asa Branca",
      autor: "Luiz Gonzaga & Humberto Teixeira",
      categoria: "Hino do Sertão",
      descricao: "O canto sagrado que deu voz à saudade e à força inquebrantável do povo nordestino.",
      citacao: "Quando oiei a terra ardendo / Qual fogueira de São João...",
      icone: "🕊️"
    },
    {
      titulo: "Eu Só Quero um Xodó",
      autor: "Dominguinhos & Anastácia",
      categoria: "Xote Romântico",
      descricao: "A doçura inconfundível do fole da sanfona e a poesia sincera de quem busca um abraço acolhedor.",
      citacao: "Que falta eu sinto de um bem / Que falta me faz um xodó...",
      icone: "🪗"
    },
    {
      titulo: "Sebastiana",
      autor: "Jackson do Pandeiro",
      categoria: "Coco & Baião",
      descricao: "A cadência rítmica sincopada do Rei do Ritmo que faz até os pés mais cansados dançarem no salão.",
      citacao: "Convidei a comadre Sebastiana pra dançar e xaxar na Paraíba!",
      icone: "🪘"
    },
    {
      titulo: "Feira de Mangaio",
      autor: "Sivuca & Glorinha Gadelha",
      categoria: "Forró Sinfônico",
      descricao: "A explosão de cores, cheiros de fumo de rolo e temperos do maior retrato musical da feira nordestina.",
      citacao: "Fumo de rolo, arreio de gibão, carcaça de jumento, e o que mais tiver...",
      icone: "🧺"
    },
    {
      titulo: "Esperando na Janela",
      autor: "Gilberto Gil (Targino Gondim)",
      categoria: "Xote Contemporâneo",
      descricao: "A sanfona alegre que embalou o Brasil inteiro e conquistou o Grammy com o ritmo do arrasta-pé.",
      citacao: "Ainda me lembro do seu caminhar / Seu jeito de olhar, eu me lembro bem...",
      icone: "🪟"
    },
    {
      titulo: "Morena Tropicana",
      autor: "Alceu Valença",
      categoria: "Frevo-Forró Elétrico",
      descricao: "O calor das ladeiras de Olinda transformado em poesia cheia de suco de caju e manga rosa.",
      citacao: "Da manga rosa quero o gosto e o sumo / Melão maduro, sapoti, juá...",
      icone: "🥭"
    },
    {
      titulo: "De Volta pro Aconchego",
      autor: "Elba Ramalho (Dominguinhos/Nando Cordel)",
      categoria: "Balada Forrozeira",
      descricao: "A voz arrebatadora da Rainha do São João celebrando a volta para os braços de quem se ama.",
      citacao: "Estou de volta pro meu aconchego / Trazendo no peito uma saudade...",
      icone: "🏡"
    },
    {
      titulo: "Procurando Tu",
      autor: "Trio Nordestino",
      categoria: "Forró Pé-de-Serra",
      descricao: "A formação clássica de sanfona, zabumba e triângulo animando as noites de poeira levantada.",
      citacao: "Eu tava procurando tu / Num forró em Caruaru...",
      icone: "🔺"
    },
    {
      titulo: "Xote dos Milagres",
      autor: "Falamansa (Tato)",
      categoria: "Forró Universitário",
      descricao: "A energia jovem que invadiu as capitais nos anos 2000 espalhando alegria e mensagens de positividade.",
      citacao: "Rindo à toa, não tem preço que pague a paz de um sorriso bom...",
      icone: "✨"
    },
    {
      titulo: "Meu Vaqueiro, Meu Peão",
      autor: "Banda Mastruz com Leite",
      categoria: "Forró Eletrônico",
      descricao: "O marco inicial da explosão das grandes bandas de forró com guitarras e metais nos palcos de vaquejada.",
      citacao: "Vem meu vaqueiro, meu lindo peão, você é o dono do meu coração!",
      icone: "🐎"
    },
    {
      titulo: "Coração",
      autor: "Dorgival Dantas",
      categoria: "Poesia de Fole",
      descricao: "As composições apaixonadas do Poeta do Forró que foram gravadas pelos maiores nomes do país.",
      citacao: "Coração, pra que se apaixonar? / Se você sabe que depois vai chorar...",
      icone: "💔"
    },
    {
      titulo: "Tareco e Mariola",
      autor: "Flávio José (Petrúcio Amorim)",
      categoria: "Defesa das Raízes",
      descricao: "A declaração de amor orgulhosa à comida simples e aos costumes do interior do Nordeste.",
      citacao: "Não repare se eu não sei falar bonito / Me criei comendo tareco e mariola...",
      icone: "🍯"
    },
    {
      titulo: "O São João de Campina Grande e Caruaru",
      autor: "Tradição Junina",
      categoria: "Maior Festa do Mundo",
      descricao: "O Parque do Povo iluminado por milhares de bandeirolas e trinta dias ininterruptos de dança e fogos.",
      citacao: "É São João! O Nordeste inteiro acende a fogueira no coração.",
      icone: "🎆"
    },
    {
      titulo: "A Xilogravura de J. Borges",
      autor: "J. Borges (Bezerros-PE)",
      categoria: "Arte Popular Nordestina",
      descricao: "O corte na madeira de umburana que imprime as capas dos folhetos de cordel com monstros e vaqueiros.",
      citacao: "Na tábua de madeira nasce a história que o povo recita de cor.",
      icone: "🪵"
    },
    {
      titulo: "O Chapéu de Couro do Sertanejo",
      autor: "Vaqueiros da Caatinga",
      categoria: "Armadura Cultural",
      descricao: "O chapéu meia-lua de couro cru batido que protege o rosto contra os espinhos pontiagudos do jurema.",
      citacao: "Couro duro para aguentar a seca, alma nobre para abraçar o irmão.",
      icone: "🤠"
    },
    {
      titulo: "O Baião de Dois com Queijo Coalho",
      autor: "Culinária Sertaneja",
      categoria: "Banquete Afetivo",
      descricao: "A mistura farta de feijão de corda, arroz, manteiga de garrafa e queijo tostado na chapa.",
      citacao: "Sustança pura que alimenta o corpo para aguentar o arrasta-pé até o dia clarear.",
      icone: "🧀"
    },
    {
      titulo: "Marinês, a Rainha do Xaxado",
      autor: "Marinês e Sua Gente",
      categoria: "Pioneira do Ritmo",
      descricao: "A primeira mulher a liderar um grupo de forró com sanfona no peito nos palcos do Brasil.",
      citacao: "A mulher sertaneja canta alto e dança com a cabeça erguida.",
      icone: "👑"
    },
    {
      titulo: "A Dança do Xaxado",
      autor: "Bando de Lampião",
      categoria: "Dança Tradicional",
      descricao: "O som característico do sapato de couro arrastando no chão de terra batida (xa-xa-xa).",
      citacao: "No ritmo do xaxado, a poeira sobe e a tristeza vai embora.",
      icone: "👞"
    },
    {
      titulo: "A Flor Branca do Mandacaru",
      autor: "Botânica da Caatinga",
      categoria: "Símbolo de Esperança",
      descricao: "O cacto verdejante cuja flor branca se abre na noite anunciando que a chuva farta se aproxima.",
      citacao: "Mandacaru quando fulora na seca / É o sinal que a chuva chega no sertão...",
      icone: "🌵"
    },
    {
      titulo: "A Toalha de Chita Colorida",
      autor: "Têxtil Folclórico",
      categoria: "Estética Junina",
      descricao: "O tecido de algodão com flores gigantescas e cores vibrantes que veste os salões de festa junina.",
      citacao: "Cor viva na mesa e sorriso no rosto para espantar qualquer frio.",
      icone: "🌺"
    }
  ],

  funkeiro: [
    {
      titulo: "Furacão 2000: O Som Nervoso",
      autor: "Rômulo Costa & Equipe",
      categoria: "Pioneirismo Carioca",
      descricao: "O paredão colossal de caixas de som empilhadas que fazia estremecer as quadras do Rio de Janeiro.",
      citacao: "Furacão dois mil... o som que bota pra quebrar!",
      icone: "🔊"
    },
    {
      titulo: "Glamurosa (Rainha do Funk)",
      autor: "MC Marcinho",
      categoria: "Funk Melody",
      descricao: "O clássico romântico e elegante do Príncipe do Funk que nunca falta em nenhuma celebração brasileira.",
      citacao: "Glamurosa, rainha do funk, poderosa, olhar de diamante...",
      icone: "👑"
    },
    {
      titulo: "Nosso Sonho & Conquista",
      autor: "Claudinho & Buchecha",
      categoria: "Funk Melody Pop",
      descricao: "A simpatia contagiante e as coreografias que levaram o funk das favelas diretamente para todas as casas do país.",
      citacao: "Nosso sonho não vai terminar! Desse jeito você me desmonta...",
      icone: "🎤"
    },
    {
      titulo: "Rap da Felicidade",
      autor: "Cidinho & Doca",
      categoria: "Hino Social",
      descricao: "O manifesto definitivo pela paz e dignidade da juventude periférica cantado com orgulho e bravura.",
      citacao: "Eu só quero é ser feliz, andar tranquilamente na favela onde eu nasci...",
      icone: "🕊️"
    },
    {
      titulo: "Plaquê de 100",
      autor: "MC Guimê",
      categoria: "Funk Ostentação",
      descricao: "O estouro do movimento paulistano exaltando a conquista material fruto do trabalho e da música.",
      citacao: "Contando os plaquê de 100, dentro de um Citroën...",
      icone: "💵"
    },
    {
      titulo: "O Menino Encantou a Quebrada",
      autor: "MC Kevin",
      categoria: "Espírito de Rua",
      descricao: "A energia vibrante, os risos e a fé inabalável do artista que inspirou milhares de jovens das comunidades.",
      citacao: "Pra quem desacreditou, foi só questão de tempo!",
      icone: "✨"
    },
    {
      titulo: "Maçã Verde & Século do Progresso",
      autor: "MC Hariel",
      categoria: "Funk Consciente",
      descricao: "As letras maduras da Zona Norte de São Paulo que alertam a juventude sobre o valor da vida e da família.",
      citacao: "O progresso é certo se você mantiver a postura correta na caminhada.",
      icone: "🍏"
    },
    {
      titulo: "O Império Audiovisual KondZilla",
      autor: "Konrad Dantas",
      categoria: "Cultura Visual",
      descricao: "O maior canal de música da América Latina, com estética de iluminação cinematográfica e enquadramentos perfeitos.",
      citacao: "Favela venceu na tela grande do mundo todo.",
      icone: "🎬"
    },
    {
      titulo: "Funk Brasil 1989",
      autor: "DJ Marlboro",
      categoria: "Marco Zero",
      descricao: "A fita histórica gravada em sampler analógico que adaptou o Miami Bass para a cadência do tamborzão brasileiro.",
      citacao: "A batida que começou tudo no toca-fitas do carro.",
      icone: "🎛️"
    },
    {
      titulo: "Me Sinto Abençoado",
      autor: "MC Poze do Rodo",
      categoria: "Trap-Funk Melódico",
      descricao: "O flow rouco e visceral celebrando a volta por cima contra todas as probabilidades da vida.",
      citacao: "Vim de baixo, sofri bastante, mas hoje me sinto abençoado!",
      icone: "🙏"
    },
    {
      titulo: "O Falcão do Funk",
      autor: "MC Daniel",
      categoria: "Carisma & Alegria",
      descricao: "A celebração da humildade, valorização das mães e a certeza de que sonhar alto não custa nada.",
      citacao: "Falcão no céu, fé em Deus e amor no coração pela família.",
      icone: "🦅"
    },
    {
      titulo: "Boladona",
      autor: "Tati Quebra-Barraco",
      categoria: "Empoderamento Feminino",
      descricao: "A voz destemida que colocou as mulheres da Cidade de Deus no centro do microfone do baile.",
      citacao: "Sou mulher guerreira, falo o que penso sem medo de ninguém!",
      icone: "🔥"
    },
    {
      titulo: "O Baile do Dennis",
      autor: "Dennis DJ",
      categoria: "Pirotecnia de Arena",
      descricao: "As montagens eletrizantes com lasers sincronizados e efeitos pirotécnicos que lotam estádios inteiros.",
      citacao: "Agora o coro vai comecar... Dennis DJ no comando!",
      icone: "🎆"
    },
    {
      titulo: "O Passinho dos Crias",
      autor: "Dançarinos da Favela",
      categoria: "Patrimônio Cultural",
      descricao: "A dança acrobática sincopada nos pés, declarada patrimônio imaterial do Estado do Rio de Janeiro.",
      citacao: "Perna de mola e ponta de pé: quem domina o passinho desafia a gravidade.",
      icone: "👟"
    },
    {
      titulo: "Cerol na Mão",
      autor: "Bonde do Tigrão",
      categoria: "Hit Planetário",
      descricao: "A coreografia explosiva que viajou o mundo todo e tocou nos quatro cantos do globo no início dos anos 2000.",
      citacao: "Quer dançar? Quer dançar? O Tigrão vai te ensinar!",
      icone: "🐅"
    },
    {
      titulo: "Rabetão e os Fluxos de SP",
      autor: "MC Lan",
      categoria: "Era dos Fluxos",
      descricao: "A explosão de criatividade e espontaneidade das caixas de som nas esquinas de São Paulo.",
      citacao: "Novos tempos, novas batidas, o som não para nunca.",
      icone: "📻"
    },
    {
      titulo: "O Óculos Juliet com Lente Penny",
      autor: "Estética Oakley",
      categoria: "Ícone de Moda",
      descricao: "A armação de metal esculpido com lentes espelhadas coloridas que é a coroa suprema do estilo chavoso.",
      citacao: "Juliet no rosto, postura de vencedor e olhar focado no futuro.",
      icone: "🕶️"
    },
    {
      titulo: "O Risco na Sobrancelha e o Degradê",
      autor: "Barbeiros da Quebrada",
      categoria: "Estética & Arte",
      descricao: "O corte navalhado milimetricamente na régua mais alta, símbolo de capricho e auto-estima impecável.",
      citacao: "Cabelo na régua, autoestima lá no alto e pronto pra vencer a semana.",
      icone: "💈"
    },
    {
      titulo: "A Moto com Escapamento Cromado",
      autor: "Cultura de Duas Rodas",
      categoria: "Conquista Pessoal",
      descricao: "O ronco do motor de quatro cilindros polido na garagem como troféu de noites viradas trabalhando.",
      citacao: "Conquista suada vale o dobro de cada gota derramada.",
      icone: "🏍️"
    },
    {
      titulo: "O Baile da Gaiola e a Noite da Lapa",
      autor: "Cultura Carioca",
      categoria: "Celebração Urbana",
      descricao: "A multidão festejando sob as estrelas ao som do tamborzão de 150 BPM até o raiar do sol.",
      citacao: "A favela é arte, é festa, é povo alegre que sabe celebrar a vida.",
      icone: "🎉"
    }
  ],

  pagodeiro: [
    {
      titulo: "Fundo de Quintal no Cacique de Ramos",
      autor: "Almir Guineto, Bira Presidente e Mestre Sombrinha",
      categoria: "Berço do Pagode",
      descricao: "As rodas embaixo da tamarineira sagrada onde nasceram o repique de mão e o banjo de quatro cordas.",
      citacao: "Se você não viu, não sabe o que é o samba na raiz do Cacique de Ramos.",
      icone: "🌳"
    },
    {
      titulo: "Deixa a Vida Me Levar",
      autor: "Zeca Pagodinho (Serginho Meriti/Eri do Cais)",
      categoria: "Filosofia Popular",
      descricao: "A maior lição de leveza e sabedoria popular brasileira: aceitar os desvios da vida sem perder o sorriso.",
      citacao: "Deixa a vida me levar, vida leva eu! Sou feliz e agradeço por tudo que Deus me deu!",
      icone: "🍺"
    },
    {
      titulo: "A Madrinha Beth Carvalho",
      autor: "Beth Carvalho",
      categoria: "Guardiã do Samba",
      descricao: "A voz inconfundível que descobriu e revelou os maiores poetas e instrumentistas do pagode brasileiro.",
      citacao: "Vou festejar, vou festejar! O teu castigo vai a cavalo...",
      icone: "👑"
    },
    {
      titulo: "Deixa Acontecer Naturalmente",
      autor: "Grupo Revelação (Xande de Pilares)",
      categoria: "Hino das Rodas",
      descricao: "O refrão que une desconhecidos em qualquer mesa de bar em um coro afinado e apaixonado.",
      citacao: "Deixa acontecer naturalmente, eu não quero ver você chorar...",
      icone: "🍻"
    },
    {
      titulo: "Me Apaixonei Pela Pessoa Errada",
      autor: "Exaltasamba (Chrigor & Thiaguinho)",
      categoria: "Romantismo 90s",
      descricao: "A canção que dominou o país no final dos anos 90, contando a clássica desventura de amar sem ser correspondido.",
      citacao: "Me apaixonei pela pessoa errada, ninguém sabe o quanto que eu estou sofrendo...",
      icone: "💔"
    },
    {
      titulo: "Cheia de Manias",
      autor: "Raça Negra (Luiz Carlos)",
      categoria: "Clássico Imortal",
      descricao: "A introdução orquestrada com metais e o refrão 'Didididiê' cantado em uníssono de norte a sul.",
      citacao: "Cheia de manias, toda dengosa, menina bonita, sabe que é gostosa...",
      icone: "🎷"
    },
    {
      titulo: "Depois do Prazer",
      autor: "Só Pra Contrariar (Alexandre Pires)",
      categoria: "Pagode Elegante",
      descricao: "O arranjo vocal sofisticado e a interpretação dramática que levou o grupo a vender milhões de discos.",
      citacao: "Tô fazendo amor com outra pessoa, mas meu coração vai ser pra sempre seu...",
      icone: "🌹"
    },
    {
      titulo: "Tô Te Filmando (Sorria)",
      autor: "Os Travessos (Rodriguinho)",
      categoria: "Pagode R&B",
      descricao: "A mistura moderna de pagode com harmonias do R&B americano que marcou a virada do milênio.",
      citacao: "Sorria, que eu tô te filmando! Sorria, o coração tá te olhando...",
      icone: "📹"
    },
    {
      titulo: "Assim Você Mata o Papai",
      autor: "Sorriso Maroto (Bruno Cardoso)",
      categoria: "Pagode Pop",
      descricao: "A descontração bem-humorada de uma das bandas mais consistentes e inovadoras do gênero.",
      citacao: "Ai se eu te pego, ai ai se eu te pego... Assim você mata o papai!",
      icone: "😄"
    },
    {
      titulo: "Lancinho & Camisa 10",
      autor: "Turma do Pagode",
      categoria: "Energia de Roda",
      descricao: "A alegria de uma turma de amigos de São Paulo transformando o pagode de mesa em um show de alta energia.",
      citacao: "É um lancinho, não é namoro... Mas quando ela me chama, eu vou correndo!",
      icone: "⚽"
    },
    {
      titulo: "Pirata e Tesouro",
      autor: "Ferrugem",
      categoria: "Voz de Ouro",
      descricao: "A extensão vocal potente e emotiva que conquistou a nova geração de amantes do samba e pagode.",
      citacao: "Nosso amor é pirata e tesouro, é feito de prata e ouro...",
      icone: "💎"
    },
    {
      titulo: "Péssimo Negócio",
      autor: "Dilsinho",
      categoria: "Pagode Romântico",
      descricao: "A estética pop romântica com refrões marcantes que redefiniu o gênero nos streamings modernos.",
      citacao: "Eu fiz um péssimo negócio quando te deixei ir embora...",
      icone: "📉"
    },
    {
      titulo: "Churrasquinho do Menos É Mais",
      autor: "Grupo Menos É Mais",
      categoria: "Viral Global",
      descricao: "A gravação espontânea de roda de samba com churrasqueira acesa que acumulou bilhões de visualizações.",
      citacao: "Gente boa reunida, carne no prato e samba no pé: não precisa de mais nada.",
      icone: "🥩"
    },
    {
      titulo: "Coisinha do Pai & Eu e Você Sempre",
      autor: "Jorge Aragão",
      categoria: "Poeta Maior",
      descricao: "As harmonias refinadas e as melodias eternas do compositor mais respeitado do samba nacional.",
      citacao: "Logo, logo assim que puder, vou te buscar de onde estiver...",
      icone: "🎼"
    },
    {
      titulo: "O Show Tem Que Continuar",
      autor: "Arlindo Cruz (Sombrinha/Luiz Carlos da Vila)",
      categoria: "Hino de Resiliência",
      descricao: "A lição de que mesmo nas maiores tristezas, a vida e a arte nunca podem parar de brilhar.",
      citacao: "O teu choro já não toca meu coração... O show tem que continuar!",
      icone: "🎭"
    },
    {
      titulo: "O Mundo É Um Moinho",
      autor: "Cartola",
      categoria: "Raiz da Mangueira",
      descricao: "A poesia visceral e delicada do mestre do morro da Mangueira aconselhando sua filha.",
      citacao: "Preste atenção, o mundo é um moinho, vai triturar teus sonhos tão mesquinhos...",
      icone: "🌺"
    },
    {
      titulo: "O Pandeiro com Platinelas de Inox",
      autor: "Luthieria de Samba",
      categoria: "Coração Rítmico",
      descricao: "O instrumento afinado no fogo com pele de cabra que dita o balanço inconfundível da mesa.",
      citacao: "Quem segura o pandeiro com amor conduz o coração da roda inteira.",
      icone: "🥁"
    },
    {
      titulo: "O Balde de Inox com Gelo",
      autor: "Costume de Boteco",
      categoria: "Símbolo de Confraternização",
      descricao: "O balde suado com garrafas de cerveja geladíssima descansando entre os copos americanos.",
      citacao: "Cerveja trincando de gelada e conversa boa que não tem hora pra acabar.",
      icone: "🧊"
    },
    {
      titulo: "A Churrasqueira de Tijolinho à Vista",
      autor: "Domingo em Família",
      categoria: "Gastronomia Afetiva",
      descricao: "A fumaça perfumada de carvão bom, pão de alho tostando e linguiça artesanal na tábua.",
      citacao: "O pagode só é completo quando a carne chia na brasa e os amigos batem na palma da mão.",
      icone: "🔥"
    },
    {
      titulo: "O Chapéu Panamá Branco",
      autor: "Elegância da Lapa",
      categoria: "Figurino Tradicional",
      descricao: "A fita preta ao redor do chapéu de palha fino e a camisa de malha listrada do sambista clássico.",
      citacao: "Malandragem com respeito, elegância na postura e ritmo no sapato.",
      icone: "🎩"
    }
  ],

  rapper: [
    {
      titulo: "Sobrevivendo no Inferno",
      autor: "Racionais MC's (Mano Brown, Edi Rock, Ice Blue, KL Jay)",
      categoria: "Obra-Prima Nacional",
      descricao: "O álbum divisor de águas que narrou com crueza cirúrgica a realidade da periferia paulistana.",
      citacao: "Vozes do inferno dizem: 'Pecou? Paga!'. 60% dos internos têm menos de 25 anos...",
      icone: "✝️"
    },
    {
      titulo: "O Rap É Compromisso",
      autor: "Sabotage (O Maestro do Canão)",
      categoria: "Lenda do Brooklin",
      descricao: "A poesia das vielas cantada com flow inconfundível por um dos maiores talentos que o país já viu.",
      citacao: "O rap é compromisso, não é viagem! Se pá tamo aí pra qualquer situação...",
      icone: "🎙️"
    },
    {
      titulo: "All Eyez on Me",
      autor: "2Pac (Tupac Shakur)",
      categoria: "West Coast Hip-Hop",
      descricao: "A intensidade poética, as dores e a paixão de uma lenda imortal com sua bandana amarrada na testa.",
      citacao: "I won't deny it, I'm a straight ridah, you don't wanna mess with me!",
      icone: "👑"
    },
    {
      titulo: "Ready to Die",
      autor: "The Notorious B.I.G. (Biggie Smalls)",
      categoria: "East Coast Classic",
      descricao: "O storytelling cinematográfico impecável nas ruas do Brooklyn com ritmo e métrica irrepreensíveis.",
      citacao: "It was all a dream, I used to read Word Up! magazine...",
      icone: "🗽"
    },
    {
      titulo: "AmarElo: É Tudo Pra Ontem",
      autor: "Emicida",
      categoria: "Rap Lírico & Memória",
      descricao: "A ponte magistral unindo a herança do samba ancestral de dona Ivone Lara ao rap contemporâneo.",
      citacao: "Ano passado eu morri, mas esse ano eu não morro!",
      icone: "💛"
    },
    {
      titulo: "Nó na Orelha",
      autor: "Criolo",
      categoria: "Vanguarda Urbana",
      descricao: "A denúncia afetuosa e cortante da solidão dos arranha-céus cinzentos da maior metrópole do país.",
      citacao: "Não existe amor em SP! Os bares estão cheios de almas tão vazias...",
      icone: "🏙️"
    },
    {
      titulo: "Falcão: Meninos do Tráfico",
      autor: "MV Bill & Celso Athayde",
      categoria: "Rap & Consciência Social",
      descricao: "A obra jornalística e musical pioneira denunciando a vulnerabilidade dos jovens nas comunidades.",
      citacao: "Traficando informação para quem tem fome de verdade.",
      icone: "🦅"
    },
    {
      titulo: "Que País É Esse?",
      autor: "Gabriel o Pensador",
      categoria: "Crônica Social",
      descricao: "As rimas afiadas de crítica política que fizeram milhões de jovens refletirem na década de 90.",
      citacao: "Muda, que quando a gente muda o mundo muda com a gente!",
      icone: "🧠"
    },
    {
      titulo: "A Procura da Batida Perfeita",
      autor: "Marcelo D2",
      categoria: "Fusão Hip-Hop & Samba",
      descricao: "A mistura orgânica do cavaquinho e da cuíca aos scratches pesados e rimas de skate.",
      citacao: "Eu sou o samba, eu sou o rap, eu sou a mistura que nunca se esquece.",
      icone: "🛹"
    },
    {
      titulo: "Abaixo de Zero: Hello Hell",
      autor: "Black Alien",
      categoria: "Técnica & Redenção",
      descricao: "O retorno triunfal do letrista mais técnico do Brasil, com dicção cirúrgica e batidas de Papatinho.",
      citacao: "Quem tem um amigo tem tudo, quem não tem nada tem a poesia...",
      icone: "🧊"
    },
    {
      titulo: "Bluesman",
      autor: "Baco Exu do Blues",
      categoria: "Poesia & Desconstrução",
      descricao: "O manifesto baiano que resgatou o blues como essência e raiz de toda arte negra moderna.",
      citacao: "Tudo que era preto e bonito eles chamavam de blues. Se o rap é o novo blues, então sou bluesman!",
      icone: "🎷"
    },
    {
      titulo: "Olho de Tigre (Ladrão)",
      autor: "Djonga",
      categoria: "Força & Representatividade",
      descricao: "A frase visceral gravada a ferro e fogo nos corações de uma geração inteira de jovens brasileiros.",
      citacao: "Sensação de que o mundo é nosso... Fogo nos racistas!",
      icone: "🐅"
    },
    {
      titulo: "Enter the Wu-Tang (36 Chambers)",
      autor: "Wu-Tang Clan",
      categoria: "Filosofia Hip-Hop & Kung-Fu",
      descricao: "Os nove MCs de Staten Island unindo a estética dos filmes de samurai às batidas sujas de RZA.",
      citacao: "Wu-Tang Clan ain't nuttin ta f' wit!",
      icone: "⚔️"
    },
    {
      titulo: "To Pimp a Butterfly",
      autor: "Kendrick Lamar",
      categoria: "História Musical",
      descricao: "A obra-prima ganhadora do Prêmio Pulitzer que fundiu jazz espiritual, funk psicodélico e poesia viva.",
      citacao: "We gon' be alright! Do you hear me, do you feel me? We gon' be alright!",
      icone: "🦋"
    },
    {
      titulo: "Illmatic (1994)",
      autor: "Nas",
      categoria: "Bíblia da Métrica",
      descricao: "Aos vinte anos de idade, Nas escreveu o disco de rimas mais influente e copiado de todos os tempos.",
      citacao: "I never sleep, 'cause sleep is the cousin of death.",
      icone: "📓"
    },
    {
      titulo: "A Batalha da Aldeia (BDA)",
      autor: "Freestyle Brasileiro",
      categoria: "Duelo de Rimas",
      descricao: "A praça dos estudantes em Barueri onde milhares de pessoas se reúnem para ver a mente brilhar no improviso.",
      citacao: "Bate na palma da mão, três, dois, um... Rima!",
      icone: "⚔️"
    },
    {
      titulo: "O Nike Air Force 1 Branco",
      autor: "Cultura Sneakerhead",
      categoria: "Estética Visual Hip-Hop",
      descricao: "O tênis de couro branco imaculado que desde 1982 é a tela em branco dos passos do hip-hop mundial.",
      citacao: "Tênis limpo no pé, cabeça erguida e rima afiada na ponta da língua.",
      icone: "👟"
    },
    {
      titulo: "A Lata de Spray com Bico Fat Cap",
      autor: "Arte do Graffiti",
      categoria: "Colorindo a Cidade",
      descricao: "O traço largo e expressivo que transforma viadutos cinzentos em galerias de arte a céu aberto.",
      citacao: "A parede cinzenta cala, a tinta colorida grita a verdade.",
      icone: "🎨"
    },
    {
      titulo: "O Boombox Portátil dos Anos 80",
      autor: "Som de Calçada",
      categoria: "Caixa Acústica de Rua",
      descricao: "O rádio prateado com fita cassete apoiado no ombro durante os círculos de breakdance na praça.",
      citacao: "Onde o som bate forte no peito, a rua se torna nosso quintal.",
      icone: "📻"
    },
    {
      titulo: "O Toca-Discos Technics SL-1200",
      autor: "Cultura Turntablism",
      categoria: "Instrumento do DJ",
      descricao: "O prato de tração direta onde o DJ transforma o vinil em instrumento musical com scratches manuais.",
      citacao: "O risco da agulha no vinil é a assinatura mecânica da nossa cultura.",
      icone: "🎛️"
    }
  ],

  sertanejo: [
    {
      titulo: "O Menino da Porteira",
      autor: "Tião Carreiro & Pardinho (Teddy Vieira)",
      categoria: "Clássico da Viola",
      descricao: "A toada caipira imortal do menino que abria a porteira para a boiada passar nas curvas de Ouro Fino.",
      citacao: "Toda vez que eu viajava pela Estrada de Ouro Fino / De longe eu avistava a figura de um menino...",
      icone: "🚪"
    },
    {
      titulo: "Chico Mineiro",
      autor: "Tonico & Tinoco (Francisco Ribeiro)",
      categoria: "Coração do Brasil",
      descricao: "A amizade leal dos boiadeiros na estrada de ferro contada com a pureza e a emoção das vozes caipiras.",
      citacao: "Fizemos a derradeira viagem / Para o sertão de Goiás...",
      icone: "🚂"
    },
    {
      titulo: "Evidências",
      autor: "Chitãozinho & Xororó (José Augusto/Paulo Sérgio)",
      categoria: "Hino do Brasil",
      descricao: "A canção mais cantada e celebrada da história do país, unindo todas as idades e classes sociais.",
      citacao: "E nessa loucura de dizer que não te quero / Vou negando as aparências, disfarçando as evidências!",
      icone: "🎤"
    },
    {
      titulo: "Pense em Mim",
      autor: "Leandro & Leonardo",
      categoria: "Romantismo Sertanejo",
      descricao: "O hit retumbante que colocou o sertanejo romântico dos anos 90 no topo absoluto de todas as paradas.",
      citacao: "Pense em mim, chore por mim, liga pra mim, não, não liga pra ele!",
      icone: "📞"
    },
    {
      titulo: "É o Amor",
      autor: "Zezé Di Camargo & Luciano",
      categoria: "Fenômeno Popular",
      descricao: "A composição que emocionou o país e originou o clássico filme 'Dois Filhos de Francisco'.",
      citacao: "É o amor que mexe com minha cabeça e me deixa assim...",
      icone: "❤️"
    },
    {
      titulo: "Estrada da Vida",
      autor: "Milionário & José Rico",
      categoria: "As Gargantas de Ouro",
      descricao: "A metáfora da jornada da vida acompanhada pelos trompetes mariachi e agudos inacreditáveis.",
      citacao: "Nesta longa estrada da vida, vou correndo e não posso parar...",
      icone: "🛣️"
    },
    {
      titulo: "Telefone Mudo & As Andorinhas",
      autor: "Trio Parada Dura",
      categoria: "Modão Tradicional",
      descricao: "A voz inconfundível de Creone, Barrerito e Mangabinha nos bailes de chão batido das madrugadas.",
      citacao: "Eu quero que risque o meu nome da sua agenda / Pois não tenho mais interesse em você...",
      icone: "☎️"
    },
    {
      titulo: "Tocando em Frente",
      autor: "Almir Sater & Renato Teixeira",
      categoria: "Filosofia Sertaneja",
      descricao: "A lição definitiva de serenidade, paciência e sabedoria contemplando o tempo passar sem pressa.",
      citacao: "Ando devagar porque já tive pressa e levo esse sorriso porque já chorei demais...",
      icone: "🌾"
    },
    {
      titulo: "Estou Apaixonado (Estoy Enamorado)",
      autor: "João Paulo & Daniel",
      categoria: "Balada Sertaneja",
      descricao: "A harmonia impecável da dupla de Brotas que marcou casamentos e histórias de amor no Brasil todo.",
      citacao: "Estou apaixonado e este amor é tão grande / Que dentro do peito, quase não cabe...",
      icone: "💑"
    },
    {
      titulo: "Amo Noite e Dia",
      autor: "Jorge & Mateus",
      categoria: "Sertanejo Universitário",
      descricao: "Os pioneiros que modernizaram o gênero com guitarras elétricas, baterias pop e carisma sem limites.",
      citacao: "Tempo, por favor, me dá mais tempo / Pra eu poder te olhar mais um momento...",
      icone: "⏰"
    },
    {
      titulo: "Liberdade Provisória & Cuida Bem Dela",
      autor: "Henrique & Juliano",
      categoria: "Sofrência Acústica",
      descricao: "Os irmãos de Tocantins que conquistaram os maiores recordes dos streamings com letras apaixonadas.",
      citacao: "Cuida bem dela, você não vai conhecer alguém melhor que ela...",
      icone: "💔"
    },
    {
      titulo: "Infiel (A Rainha da Sofrência)",
      autor: "Marília Mendonça",
      categoria: "Revolução Feminina",
      descricao: "A maior compositora da história recente do sertanejo que deu voz, força e protagonismo às mulheres.",
      citacao: "I-n-f-i-e-l, eu quero ver você olhar nos olhos dela e mentir!",
      icone: "👑"
    },
    {
      titulo: "10% & Medo Bobo",
      autor: "Maiara & Maraisa",
      categoria: "Festa & Emoção",
      descricao: "A sincronia perfeita das irmãs gêmeas que levantaram multidões nos maiores festivais do país.",
      citacao: "Garçom, troca o DVD, que essa moda me faz sofrer... E o coração tá com 10% de bateria!",
      icone: "🍻"
    },
    {
      titulo: "Balada Boa (Tchê Tcherere)",
      autor: "Gusttavo Lima",
      categoria: "Explosão Global",
      descricao: "O Embaixador que levou o som do sertanejo dançante para as baladas da Europa e das Américas.",
      citacao: "Gatinha assanhada, você tá querendo o quê? Eu quero você!",
      icone: "🎉"
    },
    {
      titulo: "Meteoro da Paixão",
      autor: "Luan Santana",
      categoria: "Pop Sertanejo",
      descricao: "O estouro meteórico do jovem cantor que renovou toda a base de fãs da música brasileira.",
      citacao: "Te dei o sol, te dei o mar pra ganhar seu coração / Você é raio de saudade, meteoro da paixão!",
      icone: "☄️"
    },
    {
      titulo: "A Festa do Peão de Barretos",
      autor: "Tradição de Rodeio",
      categoria: "Maior Arena da América",
      descricao: "O estádio de rodeio projetado por Oscar Niemeyer e a montaria épica em touros bravos de 1 tonelada.",
      citacao: "Segura, peão! Oito segundos que consagram a vida de um guerreiro de arena.",
      icone: "🐂"
    },
    {
      titulo: "A Viola Caipira Rozini de 10 Cordas",
      autor: "Luthieria Sertaneja",
      categoria: "Alma da Roça",
      descricao: "O instrumento de madeira nobre cujo ponteado em pares de cordas de aço ecoa nas manhãs ensolaradas.",
      citacao: "Viola chorosa que canta a alegria da colheita e chora a saudade de quem partiu.",
      icone: "🪕"
    },
    {
      titulo: "A Fivela de Touro em Prata Velha",
      autor: "Indumentária Caipira",
      categoria: "Símbolo de Coragem",
      descricao: "A fivela esculpida com cabeças de touro e ramos de trigo que fecha o cinto de couro de boi.",
      citacao: "Brilho de prata na cintura e coração humilde que respeita a terra.",
      icone: "🥈"
    },
    {
      titulo: "O Café no Coador de Pano com Broa",
      autor: "Cozinha da Roça",
      categoria: "Acolhimento da Fazenda",
      descricao: "O aroma do café coado lentamente na chaleira esmaltada sobre o fogão a lenha de tijolos quentes.",
      citacao: "Na mesa da fazenda tem sempre uma xícara quente e um pedaço de broa pra quem chega de viagem.",
      icone: "☕"
    },
    {
      titulo: "O Berrante de Chifre e a Boiada",
      autor: "Cultura Pantaneira",
      categoria: "Comunicação no Sertão",
      descricao: "O toque longo e melodioso que reúne a manada e ecoa pelos chapadões e várzeas do Pantanal.",
      citacao: "O som do berrante corta a névoa da manhã chamando a boiada pro destino certo.",
      icone: "📯"
    }
  ],

  trapper: [
    {
      titulo: "Astroworld & Sicko Mode",
      autor: "Travis Scott (feat. Drake)",
      categoria: "Psicodelia de Trap",
      descricao: "A montanha-russa sonora com três mudanças súbitas de beat que redefiniu os shows de estádio mundiais.",
      citacao: "Sun is down, freezin' cold, that's how we already know winter's here...",
      icone: "🎢"
    },
    {
      titulo: "Máquina do Tempo",
      autor: "Matuê (30PRAUM)",
      categoria: "Pioneirismo Brasileiro",
      descricao: "O álbum de estreia histórico que quebrou todos os recordes do Spotify Brasil e colocou o trap no topo.",
      citacao: "Entrei na máquina do tempo e fui parar lá na frente...",
      icone: "⏳"
    },
    {
      titulo: "M4 & Minha Vida É um Filme",
      autor: "Teto",
      categoria: "Melodic Trap",
      descricao: "A ascensão fulminante do garoto da Bahia com melodias contagiosas e flow incomparável.",
      citacao: "Joguei o som na rede e a vida virou um filme de cinema!",
      icone: "🎬"
    },
    {
      titulo: "Coração de Gelo & Felina",
      autor: "WIU",
      categoria: "Produção Sofisticada",
      descricao: "O virtuosismo da produção eletrônica brasileira unindo instrumentos analógicos a subgraves 808 perfeitos.",
      citacao: "Ela tem o coração de gelo, mas quando a gente se encontra derrete tudo...",
      icone: "❄️"
    },
    {
      titulo: "Mask Off & DS2",
      autor: "Future",
      categoria: "Pai do Trap de Atlanta",
      descricao: "O sample de flauta clássica e o estilo sombrio do artista que definiu as batidas do gênero moderno.",
      citacao: "Percocets, molly, Percocets... Chase a check, never chase a bitch!",
      icone: "🪈"
    },
    {
      titulo: "Bad and Boujee & Culture",
      autor: "Migos (Quavo, Offset, Takeoff)",
      categoria: "Triplets Flow",
      descricao: "O flow cadenciado em tercinas rápidas que se tornou a assinatura mundial de toda uma década.",
      citacao: "Raindrops, drop tops, smokin' on cookie in the hotbox!",
      icone: "💎"
    },
    {
      titulo: "Whole Lotta Red",
      autor: "Playboi Carti",
      categoria: "Rage / Punk Trap",
      descricao: "A energia anárquica dos sintetizadores distorcidos e a voz em falsete agudo que criou uma legião de seguidores.",
      citacao: "JumpOutTheHouse, JumpOutTheHouse!",
      icone: "🩸"
    },
    {
      titulo: "XO Tour Llif3",
      autor: "Lil Uzi Vert",
      categoria: "Emo Trap",
      descricao: "A melancolia espacial com sintetizadores cintilantes gravada em Paris após uma desilusão amorosa.",
      citacao: "Push me to the edge, all my friends are dead...",
      icone: "🛸"
    },
    {
      titulo: "Melhor Só & Superação",
      autor: "KayBlack",
      categoria: "Trap de Quebrada",
      descricao: "A vivência real da Zona Leste de São Paulo traduzida em melodias afiadas sobre superação de dores.",
      citacao: "Quem me viu chorando ontem, hoje me vê vencendo na fé!",
      icone: "🖤"
    },
    {
      titulo: "Dos Prédios Deluxe",
      autor: "Veigh",
      categoria: "Hitmaker Nacional",
      descricao: "A conquista do topo global do Spotify como a maior estreia brasileira com batidas densas e autênticas.",
      citacao: "Direto dos prédios pro topo do mundo, sem esquecer de onde a gente veio.",
      icone: "🏢"
    },
    {
      titulo: "Mainstreet Records",
      autor: "Orochi",
      categoria: "Gravadora Independente",
      descricao: "A transição magistral do campeão da Batalha do Tanque para fundador da maior força do trap nacional.",
      citacao: "Da batalha de rua pro comando da gravadora que dita o ritmo da cidade.",
      icone: "🛣️"
    },
    {
      titulo: "Heroes & Villains",
      autor: "Metro Boomin",
      categoria: "Arquiteto Sonoro",
      descricao: "A orquestração cinematográfica e os bordões icônicos do produtor mais reverenciado da música urbana.",
      citacao: "If Young Metro don't trust you, I'm gon' shoot you!",
      icone: "🦹"
    },
    {
      titulo: "O Casaco Puffer 3M Reflexivo",
      autor: "Visual Trap Noturno",
      categoria: "Estética Visual",
      descricao: "O tecido prateado que brilha intensamente contra o flash das câmeras na escuridão dos clubes.",
      citacao: "Luz que brilha no escuro para quem nunca aceitou ser invisível.",
      icone: "🧥"
    },
    {
      titulo: "A Corrente de Ouro Iced Out",
      autor: "Joalheria Urbana",
      categoria: "Status de Sucesso",
      descricao: "Os elos cravejados de diamantes e zircônias polidas com pingentes personalizados gigantescos.",
      citacao: "O gelo no pescoço reflete o fogo de quem trabalhou sem parar até chegar ao topo.",
      icone: "🧊"
    },
    {
      titulo: "As Luzes de Neon Violeta e Ciano",
      autor: "Cenografia Sci-Fi",
      categoria: "Atmosfera de Vídeo",
      descricao: "Os tons frios de neon cortando a névoa dos cenários industriais nos clipes modernos.",
      citacao: "Cores que pintam a madrugada fria com a eletricidade da nossa música.",
      icone: "🟣"
    },
    {
      titulo: "A Onda Sub-Grave 808 Saturada",
      autor: "Engenharia de Áudio",
      categoria: "Tremor Físico",
      descricao: "A frequência ultra-baixa com distorção harmônica que faz vibrar o peito e o volante do carro.",
      citacao: "O subgrave não é só para ouvir com os ouvidos; é para sentir com os ossos.",
      icone: "〰️"
    },
    {
      titulo: "O Copo Duplo de Acrílico Lilás",
      autor: "Ícone Estético",
      categoria: "Símbolo de Estilo",
      descricao: "A estética visual inconfundível dos copos sobrepostos com gelo e canudos estilizados.",
      citacao: "Detalhe visual que marca a assinatura dos vídeos da cultura trap.",
      icone: "🥤"
    },
    {
      titulo: "Os Grillz Prateados",
      autor: "Odontologia Artística",
      categoria: "Acessório Dental",
      descricao: "A capa de metal polido e brilhante sobre os dentes que brilha toda vez que o artista sorri.",
      citacao: "Sorriso metálico que reflete os holofotes do palco na arena lotada.",
      icone: "😁"
    },
    {
      titulo: "Os Tênis Balenciaga Triple S",
      autor: "Alta Costura Desconstruída",
      categoria: "Sneaker Chunky",
      descricao: "O calçado de solado triplo exagerado que virou a assinatura visual do streetwear moderno.",
      citacao: "Passos firmes com estilo futurista desfilando pelas calçadas do mundo.",
      icone: "👟"
    },
    {
      titulo: "A Batalha do Tanque (São Gonçalo)",
      autor: "Celeiro de Rimas",
      categoria: "Raiz da Improvisação",
      descricao: "A praça histórica no Rio de Janeiro que revelou os maiores nomes que hoje dominam os festivais.",
      citacao: "Foi no calor da roda de rima que forjamos as armas líricas que conquistaram o país.",
      icone: "🛡️"
    }
  ],

  vovo: [
    {
      titulo: "Dona Benta no Sítio do Picapau Amarelo",
      autor: "Monteiro Lobato",
      categoria: "Literatura da Infância",
      descricao: "A avó acolhedora sentada na cadeira de balanço da varanda contando as maravilhas da mitologia e das estrelas.",
      citacao: "No terreiro do sítio, toda história é possível se você olhar com os olhos do coração.",
      icone: "🏡"
    },
    {
      titulo: "O Bolo de Fubá com Erva-Doce",
      autor: "Receita Secreta de Família",
      categoria: "Culinária Afetiva",
      descricao: "O aroma inconfundível de bolo quentinho saindo do forno que perfuma a casa toda nas tardes de chuva.",
      citacao: "Comida de vó não tem receita no papel; tem pitadas generosas de carinho e paciência.",
      icone: "🥮"
    },
    {
      titulo: "O Café no Bule de Ágata Azul",
      autor: "Tradição Caipira",
      categoria: "Pausa da Tarde",
      descricao: "O bule esmaltado aquecido na chama suave com café coado no filtro de pano macio.",
      citacao: "Senta aqui um minutinho, toma um café fresco e conta pra mim como foi o seu dia.",
      icone: "☕"
    },
    {
      titulo: "A Lata de Biscoito com Linhas e Botões",
      autor: "Mistério Doméstico Eterno",
      categoria: "Arqueologia Afetiva",
      descricao: "A famosa lata de biscoitos amanteigados dinamarqueses que ao ser aberta revela carretéis de linha colorida.",
      citacao: "Nunca tem biscoito, mas tem conserto para qualquer rasgão na vida.",
      icone: "🧵"
    },
    {
      titulo: "A Poltrona de Veludo Bordô com Orelhas",
      autor: "Mobiliário Nostálgico",
      categoria: "Refúgio Supremo",
      descricao: "O encosto macio e acolhedor onde se repousa para ouvir histórias antigas e descansar as pernas cansadas.",
      citacao: "Neste cantinho do mundo, nada de ruim tem permissão para entrar.",
      icone: "🛋️"
    },
    {
      titulo: "O Relógio Cuco de Madeira Esculpida",
      autor: "Mestres da Floresta Negra",
      categoria: "Companheiro do Tempo",
      descricao: "O passarinho de madeira que abre a portinha de hora em hora cantando com o balanço do pêndulo de pinha.",
      citacao: "O tempo passa com calma para quem sabe saborear cada minuto sem pressa.",
      icone: "🕰️"
    },
    {
      titulo: "Os Álbuns de Fotos em Preto e Branco",
      autor: "Memória da Família",
      categoria: "Tesouro do Tempo",
      descricao: "As fotos amareladas com bordas recortadas em ziguezague guardando os sorrisos de jovens de outras décadas.",
      citacao: "A saudade é a forma que o amor encontra para ficar por perto para sempre.",
      icone: "📷"
    },
    {
      titulo: "O Pote de Vidro com Balas de Mel e Canela",
      autor: "Cristaleira da Sala",
      categoria: "Doçura Reservada",
      descricao: "A cristaleira com copos de cristal onde sempre há um pote guardado esperando a visita dos netos.",
      citacao: "Pega uma bala para adoçar o caminho de volta para casa.",
      icone: "🍬"
    },
    {
      titulo: "A Toalha em Ponto Cruz Bordada à Mão",
      autor: "Artesanato Paciente",
      categoria: "Dedicação Pura",
      descricao: "Meses de dedicação bordando flores e frutas na toalha de mesa de linho que só é usada nos dias de festa.",
      citacao: "Cada ponto na toalha é um pensamento bom dedicado a quem vai se sentar ao redor dela.",
      icone: "🪡"
    },
    {
      titulo: "O Radinho de Pilha Transistor Semp",
      autor: "Voz Amiga da Tarde",
      categoria: "Companhia Diária",
      descricao: "A voz suave do locutor de rádio, as modas antigas e a transmissão do jogo de futebol na mesa da cozinha.",
      citacao: "O radinho ligado baixinho parece que enche a casa toda de vida.",
      icone: "📻"
    },
    {
      titulo: "O Chá de Camomila com Hortelã da Horta",
      autor: "Farmácia Natural",
      categoria: "Cura do Coração",
      descricao: "As folhas colhidas na hora no canteiro do quintal para acalmar as dores de barriga e as aflições do peito.",
      citacao: "Toma esse chazinho quente, cobre os pés e dorme um pouco que amanhã tudo melhora.",
      icone: "🍵"
    },
    {
      titulo: "A Sapato de Pelica com Meia de Lã",
      autor: "Conforto dos Passos",
      categoria: "Caminhar Sereno",
      descricao: "O calçado confortável e macio que não aperta os calos e caminha com serenidade pelo assoalho encerado.",
      citacao: "Quem já correu muito na vida aprende a apreciar o valor do passo suave.",
      icone: "🧦"
    },
    {
      titulo: "A Horta de Quintal com Alecrim e Boldo",
      autor: "Sabedoria das Ervas",
      categoria: "Conexão com a Terra",
      descricao: "Os vasos de barro com terra preta e esterco onde crescem os temperos que dão gosto especial a cada panela.",
      citacao: "Uma muda de alecrim plantada no portão traz alegria e saúde pra quem entra.",
      icone: "🌱"
    },
    {
      titulo: "O Pão Sovado com Manteiga de Fazenda",
      autor: "Fornada da Manhã",
      categoria: "Alimento Sagrado",
      descricao: "A massa fofa que descansou sob o pano de prato até dobrar de tamanho antes de ir ao forno dourar.",
      citacao: "O pão feito em casa partilhado na mesa mata a fome do corpo e alimenta a união.",
      icone: "🍞"
    },
    {
      titulo: "O Terço de Madeira Benzido na Matriz",
      autor: "Oração Protetora",
      categoria: "Fé Inabalável",
      descricao: "As contas de madeira polidas pelo toque constante dos dedos rezando pela saúde e proteção de cada filho e neto.",
      citacao: "A oração de vó é um escudo invisível que acompanha você por onde quer que você ande.",
      icone: "📿"
    },
    {
      titulo: "O Espelho Antigo com Moldura de Jacarandá",
      autor: "Mobiliário Centenário",
      categoria: "Testemunha dos Anos",
      descricao: "O vidro bisotado que já refletiu a mocidade, o casamento, os filhos bebês e as rugas abençoadas da velhice.",
      citacao: "As rugas no rosto são apenas os caminhos desenhados por onde os sorrisos passaram.",
      icone: "🪞"
    },
    {
      titulo: "A Manta de Retalhos Colorida",
      autor: "Costura de Memórias",
      categoria: "Calor Afetivo",
      descricao: "A coberta feita com pedacinhos de vestidos antigos, camisas e cortinas que aquece até a noite mais gélida de inverno.",
      citacao: "Cada retalho tem uma história de um tempo bom que agora nos aquece juntos.",
      icone: "🧶"
    },
    {
      titulo: "Os Provérbios Sábios da Vida",
      autor: "Sabedoria Oral Popular",
      categoria: "Filosofia dos Séculos",
      descricao: "As frases certeiras que desarmavam qualquer briga e ensinavam a ter paciência com os tropeços do caminho.",
      citacao: "Quem tem pressa come cru; a água silenciosa é a que cava a rocha mais funda.",
      icone: "💬"
    },
    {
      titulo: "O Guarda-Chuva Preto de Madeira",
      autor: "Proteção contra Tempestades",
      categoria: "Amparo Fiel",
      descricao: "A armação de aço resistente com cabo curvo de madeira escura que nunca virava mesmo nos piores temporais.",
      citacao: "Não tenha medo da chuva; ela só vem para molhar a terra e fazer a semente brotar.",
      icone: "☂️"
    },
    {
      titulo: "O Abraço que Faz o Tempo Parar",
      autor: "Amor Incondicional",
      categoria: "Maior Força do Mundo",
      descricao: "Aquele abraço quentinho com cheiro de lavanda e talco onde todas as dores e dúvidas do mundo desaparecem.",
      citacao: "Não importa o tamanho que você tenha, aqui você sempre terá o colo da vó.",
      icone: "👵"
    }
  ]
};

// Funcoes de utilidade
function obterReferenciasDoMundo(mundo) {
  return REFERENCIAS_MUNDOS[mundo] || [];
}

function obterReferenciaAleatoria(mundo) {
  const lista = obterReferenciasDoMundo(mundo);
  if (!lista.length) return null;
  return lista[Math.floor(Math.random() * lista.length)];
}

function contarReferenciasMundos() {
  return Object.values(REFERENCIAS_MUNDOS).reduce((total, lista) => total + lista.length, 0);
}

function listarMundosComReferencias() {
  return Object.keys(REFERENCIAS_MUNDOS);
}

function gerarCardReferencia(ref) {
  if (!ref) return "";
  return `
    <div class="card-referencia-mundo">
      <div class="card-ref-topo">
        <span class="card-ref-badge-categoria">${ref.categoria}</span>
        <span class="card-ref-icone">${ref.icone}</span>
      </div>
      <div class="card-ref-corpo">
        <div class="card-ref-titulo">${ref.titulo}</div>
        <div class="card-ref-autor">${ref.autor}</div>
        <div class="card-ref-descricao">${ref.descricao}</div>
      </div>
      <div class="card-ref-citacao">"${ref.citacao}"</div>
    </div>
  `;
}

function renderizarGaleriaReferencias(mundo) {
  const refs = obterReferenciasDoMundo(mundo);
  if (!refs.length) return `<div class="aviso-vazio">Nenhuma referência encontrada para ${mundo}.</div>`;

  return `
    <div class="painel-referencias-mundo" data-mundo="${mundo}">
      <div class="grid-referencias-mundo">
        ${refs.map(gerarCardReferencia).join("")}
      </div>
    </div>
  `;
}

// Exportacao segura
if (typeof window !== "undefined") {
  window.REFERENCIAS_MUNDOS = REFERENCIAS_MUNDOS;
  window.obterReferenciasDoMundo = obterReferenciasDoMundo;
  window.obterReferenciaAleatoria = obterReferenciaAleatoria;
  window.contarReferenciasMundos = contarReferenciasMundos;
  window.listarMundosComReferencias = listarMundosComReferencias;
  window.gerarCardReferencia = gerarCardReferencia;
  window.renderizarGaleriaReferencias = renderizarGaleriaReferencias;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    REFERENCIAS_MUNDOS,
    obterReferenciasDoMundo,
    obterReferenciaAleatoria,
    contarReferenciasMundos,
    listarMundosComReferencias,
    gerarCardReferencia,
    renderizarGaleriaReferencias
  };
}
