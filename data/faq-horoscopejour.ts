export interface IFaqItem {
    title: string;
    content: string;
}

const HoroscopeJour = [
    {
        "title": "Qu’est-ce qu’un horoscope du jour ?",
        "content": "<div><div>\n                                            <div><p>Votre horoscope est&nbsp; calculé à partir des positions des planètes dans le zodiaque en fonction de votre date de naissance.</p>\n<p>Le <a href=\"https://www.esteban-frederic.fr/theme-astral/\">thème astral</a> comprend quant à lui&nbsp; le lieu et l’heure de naissance. L’horoscope du jour est une version simplifiée puisqu’il tient compte uniquement de votre signe solaire.</p>\n<p>&nbsp;</p>\n</div>\n                                        </div></div>"
    },
    {
        "title": "L’horoscope du jour est-il fiable ?",
        "content": "<div><div>\n                                            <div><p>Notre horoscope du jour est basé sur des calculs astrologiques réalisés par des professionnels.</p>\n</div>\n                                        </div></div>"
    },
    {
        "title": "Pourquoi lire son horoscope du jour ?",
        "content": "<div><div>\n                                            <div><p>Votre horoscope du jour vous révèle les tendances de votre journée. Cela vous permet de mieux vous préparer aux évènements et d’anticiper.</p>\n<p>Vous vous demandez quel est votre horoscope du jour ?</p>\n<p>Ne cherchez pas plus loin. Votre horoscope quotidien gratuit n’est qu’à un clic. Cliquez sur votre signe solaire pour savoir ce que vous réserve votre horoscope du jour. Planifiez votre journée en conséquence et restez loin des choses qui apportent de la négativité à votre journée. Supprimez l’imprévisibilité et sachez précisément ce qui doit être fait aujourd’hui avec horoscope du jour.</p>\n<p>Chaque jour est différent et apporte de nouveaux défis et cadeaux, lisez votre horoscope du jour pour être préparé aux événements qui se produisent aujourd’hui.</p>\n<p>&nbsp;</p>\n</div>\n                                        </div></div>"
    },
    {
        "title": "Comment lire son horoscope du jour?",
        "content": "<div><div>\n                                            <div><p>Pour découvrir votre horoscope du jour, cliquez sur votre signe astrologique. Votre horoscope du jour vous dévoile les moments forts de votre journée.</p>\n</div>\n                                        </div></div>"
    },
    {
        "title": "Quels sont les signes présents dans l’horoscope du jour ?",
        "content": "<div><div>\n                                            <div><p>Les 12 signes du zodiaque sont présents dans l’horoscope : bélier, taureau, gémeaux, cancer, lion, vierge, balance, scorpion, sagittaire, capricorne, verseau, poissons.</p>\n</div>\n                                        </div></div>"
    }
];

export const faqs: Record<string, IFaqItem[]> = {
    "/horoscope-jour": HoroscopeJour,
};
