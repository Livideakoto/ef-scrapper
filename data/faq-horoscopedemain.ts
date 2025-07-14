export interface IFaqItem {
    title: string;
    content: string;
}

const HoroscopeDemain = [
    {
        "title": "Qu’est-ce que l'horoscope de demain ?",
        "content": "<div><div>\n                                            <div><p>&nbsp;</p>\n<p>Votre horoscope de demain est basé sur la position des planètes en fonction de votre date de naissance.</p>\n<p>Le <a href=\"https://www.esteban-frederic.fr/theme-astral/\">thème astral</a> est plus précis car il comprend en plus le lieu et l’heure de naissance,</p>\n<p>Votre horoscope de demain vous révèle les grands moments de la journée à venir.</p>\n<p>Découvrez ce que demain vous réserve. Les étoiles et planètes changent de position pour apporter quelque chose&nbsp; de nouveau dans votre vie.</p>\n</div>\n                                        </div></div>"
    },
    {
        "title": "L’horoscope de demain est-il fiable ?",
        "content": "<div><div>\n                                            <div><p>&nbsp;</p>\n<p>Notre horoscope de demain est aussi fiable et précis que le professionnalisme de l’astrologue qui les réalise.</p>\n<p>Nous étudions minutieusement les mouvements planétaires et préparons l’horoscope de demain de chaque signe du zodiaque, qui vous annonce tous les événements du lendemain.</p>\n<p>&nbsp;</p>\n</div>\n                                        </div></div>"
    },
    {
        "title": "Que révèle l'horoscope de demain ?",
        "content": "<div><div>\n                                            <div><p>&nbsp;</p>\n<p>Votre horoscope de demain gratuit vous renseigne sur ce que vous réserve l’avenir et vous donne des conseils dans tous les domaines.</p>\n<p>Prenez des mesures de précaution pour les phases négatives, et tirer le meilleur parti des bons moments en profitant de notre horoscope de demain.</p>\n<p>&nbsp;</p>\n</div>\n                                        </div></div>"
    },
    {
        "title": "Comment lire son horoscope de demain ?",
        "content": "<div><div>\n                                            <div><p>&nbsp;</p>\n<p>Pour découvrir votre horoscope de demain, il vous suffit de cliquer sur votre signe astrologique. Vous découvrirez alors votre horoscope de demain et pourrez anticiper les évènements à venir.</p>\n</div>\n                                        </div></div>"
    },
    {
        "title": "Quels sont les signes présents dans l’horoscope de demain ?",
        "content": "<div><div>\n                                            <div><p>&nbsp;</p>\n<p>Les 12 signes du zodiaque sont présents dans l’horoscope de demain : bélier, taureau, gémeaux, cancer, lion, vierge, balance, scorpion, sagittaire, capricorne, verseau, poissons.</p>\n</div>\n                                        </div></div>"
    }
];

export const faqs: Record<string, IFaqItem[]> = {
    "/horoscope-demain": HoroscopeDemain,
};
