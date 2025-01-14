import type { DeepPartial } from "../DeepPartial";
import type { Translation } from "../i18n-types";

const chat: DeepPartial<Translation["chat"]> = {
    intro: "How su twóje powěsći:",
    enter: "Napišćo powěsć...",
    menu: {
        visitCard: "Wizitna kórtka",
        addFriend: "Pśijaśela / pśijaśelku pśidaś",
    },
    typing: "pišo...",
    users: "wužywarje",
    userList: {
        disconnected: "Getrennt",
        isHere: "Jo na toś tej kórśe",
        inAnotherMap: "Na drugej kórśe",
        in: "na ",
        teleport: "Teleport",
        search: "Jadnorje pytaj!",
        walkTo: "Hyś k",
        teleporting: "Teleportěrowanje...",
        businessCard: "Wizitna kórtka",
    },
    connecting: "Zwězanje ze serwerom prezence...",
    waitingInit: "Cakajucy na inicializěrowanje serwera...",
    waitingData: "Cakajucy na wužywaŕske daty...",
    searchUser: "Pytaś wužywarja, kórtu atd. ...",
    searchChat: "Pytaś kanal, powěsć atd. ...",
    role: {
        admin: "administrator",
        member: "cłonk",
        visitor: "woglědaŕ",
    },
    status: {
        online: "online",
        away: "njepśibytny",
        unavailable: "njestoj k dipoziciji",
    },
    logIn: "Zalogowaś se",
    signIn: "Dejš se registrěrowaś abo zalogowaś, aby wšykne funkcije chata se wužywali!",
    invite: "Pśepšosyś",
    roomEmpty: "Ta śpa jo prozna. Pśepšos kolegu abo pśijaśela, aby se tebje pśizamknuł!",
    userOnline: "wužywaŕ jo online",
    usersOnline: "wužywarje su online",
    open: "Wótcyniś",
    me: "Ja",
    you: "Ty",
    ban: {
        title: "Blokěrowaś",
        content: "Wužywarja {userName} z aktualnego swěta wugnaś. Administrator móžo tu akciju zasej anulěrowaś.",
        ban: "Togo wužywarja blokěrowaś",
    },
    loading: "Lodujo se",
    loadingUsers: "Lodowanje wužywarjow...",
    load: "Lodowaś",
    rankUp: "Pówušyś",
    rankDown: "Degraděrowaś",
    reinit: "Wótnowotki inicializěrowaś",
    enterText: "Zapódaj powěsć...",
    timeLine: {
        title: "Twója chronika chata",
        open: "Wótcyń swóju chroniku!",
        description: "Historija powěsćow a tšojenjow",
        incoming: "{userName} pśistupijo k diskusiji",
        outcoming: "{userName} spušćijo dikusiju",
    },
    form: {
        placeholder: "Napiš powěsć...",
        typing: " pišo...",
        application: {
            klaxoon: {
                title: "Klaxoon",
                description: "Pósćel klaxoon do chata!",
            },
            youtube: {
                title: "YouTube",
                description: "Pósćel youtube-video do chata!",
            },
            googleDocs: {
                title: "Google Docs",
                description: "Pósćel google-docs-dokument do chata!",
            },
            googleSlides: {
                title: "Google Slides",
                description: "Pósćel google-slides-prezentaciju do chata!",
            },
            googleSheets: {
                title: "Google Sheets",
                description: "Pósćel google-sheets-dokument do chata!",
            },
            eraser: {
                title: "Eraser",
                description: "Pósćel Eraser-toflu do chata!",
            },
            googleDrive: {
                title: "Google Drive",
                description: "Pósćel google-drive-dokument do chata!",
            },
            excalidraw: {
                title: "Excalidraw",
                description: "Pósćel Excalidraw do chata!",
            },
            cards: {
                title: "Karty",
                description: "Pósćel karty do chata!",
            },
            weblink: {
                error: "URL njejo płaśeca",
            },
        },
    },
    notification: {
        discussion: "co z tobu diskutěrowaś",
        message: "sćelo powěsć",
        forum: "w forumje",
    },
    see: "Wiźeś",
    show: "Pokazaś",
    less: "Mjenjej",
    more: "Wěcej",
    sendBack: "Slědk pósłaś",
    delete: "Wulašowaś",
    messageDeleted: "Tu powěsć jo wulašował ",
    emoji: {
        icon: "Symbol k wótcynjenju abo zacynjenju wuzwólonego emoji-menija",
        search: "Emoje pytaś...",
        categories: {
            recents: "Gano wužyte",
            smileys: "Smileys & emocije",
            people: "Cłowjeki & śěło",
            animals: "Zwěrjeta & natura",
            food: "Jěź & piśe",
            activities: "Aktiwity",
            travel: "Drogowanje & městnosći",
            objects: "Objekty",
            symbols: "Symbole",
            flags: "Fony",
            custom: "Wót wužywarja wustajone",
        },
        notFound: "Žedne emojije njejsu se namakali",
    },
    said: "jo gronił:",
    reply: "Wótegroniś",
    react: "Reagěrowaś",
    copy: "Kopěrowaś",
    copied: "Kopěrowane!",
    file: {
        fileContentNoEmbed: "Wopśimjeśe njedajo se woglědaś. Musyśo jo ześěgnuś dołoj",
        download: "Ześěgnuś",
        openCoWebsite: "Na co-webboku wótcyniś",
        copy: "Link kopěrowaś",
        tooBig: "Dataja {fileName} jo pśewjelika {maxFileSize}.",
        notLogged: "Wy musyśo zalogowane byś, aby dataju górjej lodowali.",
    },
    needRefresh: "Cas Wašogo zwězanja jo se dokóńcował. Aktualizěrujśo bok, aby se naspjet z chatom zwězali.",
    refresh: "Aktualizěrowaś",
    upgrade: "Upgrade",
    upgradeToSeeMore: "Upgrade, aby wěcej powěsćow wiźeli",
    disabled: "Ta funkcija jo deaktiwěrowana.",
    disabledByAdmin: "Tu funkciju jo administrator deaktiwěrował.",
    anAdmin: "administrator",
    messageDeletedByYou: "Wy sćo tu powěsć wulašowali",
    waiting: "Cakajucy",
};

export default chat;
