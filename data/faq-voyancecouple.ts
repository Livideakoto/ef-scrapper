export interface IFaqItem {
    title: string;
    content: string;
}

const VoyanceCouple = [
    {
        "title": "Découvrez votre compatibilité amoureuse",
        "content": "<div><div>\n                                            <div><p>Pour avoir des premiers éléments de réponse, n’hésitez pas avoir recours au tirage de tarot gratuit proposé dans la rubrique <a href=\"https://www.esteban-frederic.fr/tarologie-divinatoire-gratuite/\">Tarologie</a>. Une voyance de couple (non gratuite) pourra ensuite donner des indications plus précises. Vous pourrez également demander des précisions sur un point particulier pour mieux comprendre comment améliorer votre relation ou éviter certaines erreurs.<br>\nSi la consultation de voyance de couple proposée sur notre plateforme n’est pas gratuite, elle s’adapte toutefois à tous les budgets tout en prenant en compte vos préférences personnelles. A titre d’exemple, certains privilégieront la discrétion d’une voyance par mail, tandis que d’autres souhaiteront être au contact avec des voyants par le biais d’une <a href=\"https://www.esteban-frederic.fr/voyance-par-telephone/\">voyance par téléphone</a> ou d’un tchat Skype. Cette voyance de couple permettra d’aborder votre vie amoureuse sous toutes ses formes, de façon plus complète et exhaustive que dans le cadre d’une voyance gratuite.</p>\n</div>\n                                        </div></div>"
    },
    {
        "title": "Voyance de couple : obtenez rapidement réponses à vos questions",
        "content": "<div><div>\n                                            <div><p>Parfois, le temps qu’il faut pour avoir réponse à une question et savoir ce que vous réserve votre futur sentimental peut sembler long. Je vous garantis une réponse rapide pour lever vos doutes au plus vite et pour de bon : <a href=\"https://www.esteban-frederic.fr/voyance-audiotel/\">voyance audiotel sans attente</a>, ou encore <a href=\"https://www.esteban-frederic.fr/voyance-par-mail/\">voyance par mail rapide</a> (sous 48h). Il vous appartient ensuite de choisir le support avec lequel vous vous sentiez bien à l’aise pour évoquer peut-être l’amour de votre vie dans le cadre de cette voyance de couple.<br>\nIl existe sans doute de bonnes raisons de démarrer une voyance de couple avec votre conjoint. Avec une consultation de qualité, vous pouvez obtenir sans plus attendre l’aide dont vous avez besoin pour mettre toutes les chances de votre côté. N’hésitez donc pas à consulter pour profiter immédiatement des bienfaits des arts divinatoires.</p>\n</div>\n                                        </div></div>"
    }
];

export const faqs: Record<string, IFaqItem[]> = {
    "/voyance-de-couple": VoyanceCouple,
};
