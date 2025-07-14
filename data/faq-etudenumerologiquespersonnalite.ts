export interface IFaqItem {
    title: string;
    content: string;
}

const EtudeNumerologiquesPersonnalite = [
    {
        "title": "Étudiez votre personnalité grâce à la numérologie !",
        "content": "<div><div>\n                                            <div><p>À partir de vos prénoms, de votre nom de famille et de votre date de naissance, les numérologues sont capables de produire des études de personnalité fiables et de très haute volée. Il est également possible, et parfois même recommandé, de renseigner des informations concernant une tierce personne – l’être aimé par exemple – afin de mieux cerner sa personnalité et ses particularités. En amour comme dans la vie quotidienne la plus banale qui soit, une étude de personnalité par la numérologie permet de mieux se connaître et d’être donc plus réceptif et mieux préparé face aux événements.</p>\n</div>\n                                        </div></div>"
    },
    {
        "title": "Numérologie et personnalité : un travail sérieux, honnête et en toute discrétion",
        "content": "<div><div>\n                                            <div><p>Il s’agit en effet de mettre en avant les principales caractéristiques d’un être intérieur et l’aspect des grands cycles de sa vie. La numérologie des études de personnalité est très utile pour mieux cerner le fonctionnement des individus qui vous sont chers : enfants, conjoint, parents, amis, relations professionnelles, etc. Pour cela, il vous suffit de commander votre étude <span style=\"color: #535353;\">détaillée.</span></p>\n</div>\n                                        </div></div>"
    },
    {
        "title": "Votre étude de numérologie complète sérieuse et précise",
        "content": "<div><div>\n                                            <div><p>Cette étude est totalement personnelle et strictement confidentielle. Votre étude de personnalité par la numérologie comprendra l’analyse de tout les aspects de votre vie qui comporte : votre nom d’expression, votre élan spirituel, votre moi intime, votre nombre actif, votre nombre d’hérédité, votre pierre angulaire, votre grille d’inclusion, votre jour de naissance, votre chemin de vie, votre nombre de vie, votre nombre d’excentricité, et votre initiation spirituelle. Il faudra que vous puissiez communiquer votre nom, prénom, ainsi que <strong>votre date de naissance</strong> dans le formulaire ci-dessous une fois le paiement effectué, en n’oubliant pas de préciser votre adresse mail, pour le renvoi de celle-ci. Votre étude vous sera transmise dans un délai de 48h maximum. Votre étude peut aussi considérer une tierce personne, n’hésitez pas à nous le signaler.</p>\n<p style=\"text-align: center;\">\n</p></div>\n                                        </div></div>"
    }
];

export const faqs: Record<string, IFaqItem[]> = {
    "/etudes-numerologiques/etude-numerologique-personnalite/": EtudeNumerologiquesPersonnalite,
};
