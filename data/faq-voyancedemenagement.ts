export interface IFaqItem {
    title: string;
    content: string;
}

const VoyanceDemenagement = [
    {
        "title": "Quelle consultation de voyance pour évoquer le déménagement ?",
        "content": "<div><div>\n                                            <div><p>Comme pour tout autre sujet pouvant être évoqué dans le cadre d’une consultation (<a href=\"https://www.esteban-frederic.fr/voyance-amour/\">voyance en amour</a>, <a href=\"https://www.esteban-frederic.fr/voyance-travail-carriere-vais-je-trouver-un-emploi/\">voyance en travail</a>, ou votre avenir de façon générale), il existe plusieurs supports permettant d’être mis en contact avec un <a href=\"https://www.esteban-frederic.fr/\">voyant médium sérieux et reconnu</a>. Si vous souhaitez privilégier la discrétion et évoquer votre situation de façon écrite directement en ligne, la <a href=\"https://www.esteban-frederic.fr/voyance-par-mail/\">voyance par mail</a> offre une solution idéale. Pour dialoguer avec un voyant de vive voix afin de parler de votre déménagement, vous pouvez aussi faire appel à une <a href=\"https://www.esteban-frederic.fr/voyance-par-telephone/\">voyance par téléphone sérieuse</a>, ou encore à la <a href=\"https://www.esteban-frederic.fr/voyance-audiotel/\">voyance en audiotel</a> sans carte bancaire. Quoi qu’il en soit, vous devez bien réfléchir à la question que vous poserez à votre voyant. Vous pouvez par exemple demander des précisions sur le lieu de votre nouveau domicile, quand le déménagement aura lieu, quelles seront ses conséquences, et toutes autres questions pour obtenir l’aide dont vous avez besoin. Vous pourrez ainsi attendre le moment venu en toute quiétude.</p>\n</div>\n                                        </div></div>"
    },
    {
        "title": "Parlez de votre déménagement avec un voyant reconnu",
        "content": "<div><div>\n                                            <div><p>Que ce soit pour savoir si vous allez déménager dans les prochains mois, ou encore connaître l’impact de ce déménagement (sur votre famille, vos enfants, votre conjoint, vos amis…), Esteban Frederic prendra en compte vos attentes et s’aidera de ses outils divinatoires (tarot, astrologie, numérologie, oracles…) pour vous éclairer et obtenir réponse à vos questions dans le cadre d’une <u><a href=\"https://www.esteban-frederic.fr/voyance-immediate/\">voyance immédiate</a></u>. Une fois tous ces éléments pris en compte concernant notamment le choix de votre mode de consultation, vous pourrez dialoguer avec votre voyant medium au sujet de votre déménagement en toute connaissance de cause et dans de bonnes conditions.</p>\n</div>\n                                        </div></div>"
    }
];

export const faqs: Record<string, IFaqItem[]> = {
    "/voyance-demenagement-allez-vous-demenager": VoyanceDemenagement,
};
