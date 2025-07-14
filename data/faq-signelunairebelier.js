"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faqs = void 0;
const SigneLunaireBelier = [
    {
        "title": "Réactif",
        "content": "<div><p><span style=\"font-weight: 400;\">Votre capacité à mobiliser vos énergies est prononcée. Vous puisez à un niveau instinctif les ressources intérieures dont vous avez besoin. Lorsque vous identifiez un objectif que vous souhaitez poursuivre, vous pouvez le faire avec une précision presque militaire, en supprimant toutes les distractions dans votre quête pour atteindre votre objectif. Vous avez le genre de tempérament qui se nourrit de travail acharné et de persévérance. Enthousiaste, vous avez pourtant du mal à terminer ce que vous commencez, ou à faire des compromis pour prendre en compte les besoins des autres. Pour ces raisons, vous pouvez rencontrer des difficultés avec d’autres personnes qui sont incapables de réagir aussi facilement que vous, ou lorsque la négociation est nécessaire.</span></p></div>"
    },
    {
        "title": "Un pionnier",
        "content": "<div><p><span style=\"font-weight: 400;\">En tant que pionnier, vous constaterez probablement que vous êtes attiré par des voies d’expression qui vous permettent de faire votre «&nbsp;propre truc&nbsp;». Vous pouvez avoir un talent particulier pour reconnaître la graine d’une idée, le potentiel d’une opportunité. Votre nature émotionnelle est telle que vous vous sentez vivant lorsque vous commencez quelque chose de nouveau. L’énergie nécessaire pour faire évoluer quelque chose enflamme toute votre passion et vous donne une concentration immédiate.</span><span style=\"font-weight: 400;\"><br>\n</span><span style=\"font-weight: 400;\">Vous êtes réactif, impatient et enthousiaste, donc adapté à tout type d’opportunité de travail indépendant ou de contrat. Le Bélier est un signe de vision combiné à l’action. Trouvez des moyens de faire avancer vos propres projets et vous résisterez probablement aux tentatives des autres de vous définir.</span></p></div>"
    },
    {
        "title": "Simple et direct",
        "content": "<div><p><span style=\"font-weight: 400;\">Le Bélier est considéré comme l’ « enfant du zodiaque », et se caractérise par de l’impétuosité, de l’innocence et de la sensibilité, ce qui signifie que vous direz tout ce qui vous passe par la tête. Pourtant, vous pouvez facilement être blessé si les autres font de même. Vous êtes en effet fortement affecté par les critiques et pouvez être arrêté net par des propos méchants. Vous vous précipitez lorsque vous êtes sûr de vous, mais très affecté lorsque les autres ne sont pas d’accord.</span></p></div>"
    },
    {
        "title": "Courageux",
        "content": "<div><p><span style=\"font-weight: 400;\">Vous possédez un courage pour affronter l’inconnu, ce qui signifie que vous remettez rarement en question la route à suivre. Votre esprit vaillant peut être votre meilleur atout mais aussi votre talon d’Achille. Vous pouvez complètement sous-estimer les actions calculées de ceux qui ont une réponse émotionnelle plus complexe, ou vous pouvez involontairement blesser les autres avec vos propres mots irréfléchis.</span></p></div>"
    },
    {
        "title": "Honnête",
        "content": "<div><p><span style=\"font-weight: 400;\">Vous pouvez être quelque peu déconcerté par ceux qui sont prêts à utiliser des méthodes sournoises ou calculatrices, car votre style de relation est assez simple et généralement honnête, caractérisé par l’expression directe, l’honnêteté, la franchise et le manque de ruse. Les personnes nées avec la Lune en Bélier ont tendance à réagir rapidement aux circonstances, et vous pouvez parfois parler avant d’avoir réfléchi. Vous pouvez vous mettre en colère facilement, mais vous vous en remettrez aussi rapidement. Vous êtes plus à l’aise avec les personnes qui vous laissent être vous-même et reconnaissez qu’il y a rarement de la malveillance ou des intentions cachées lorsque vous dites ce que vous pensez.</span></p></div>"
    },
    {
        "title": "Un tempérament vif",
        "content": "<div><p><span style=\"font-weight: 400;\">Le Bélier est lié à la planète Mars, le dieu de la guerre. Vous pouvez parfois être agressif, avec un tempérament vif et peu de patience lorsqu’il s’agit d’obtenir ce que vous voulez. Vos réactions ont tendance à être spontanées et directes. Vous vous fiez à votre intuition, prenant des décisions rapidement avant de passer à la suite. Votre nature émotionnelle peut faire que vous avez tendance à vous lancer assez rapidement dans les choses, en particulier les amitiés.</span></p></div>"
    },
    {
        "title": "Intuitif",
        "content": "<div><p><span style=\"font-weight: 400;\">Vous prenez vos décisions en fonction de vos sentiments et vous vous précipiterez avec plaisir. Cela peut entraîner des erreurs de jugement si vous dépassez les limites, jusqu’à ce que vous appreniez à équilibrer cette tendance avec le bon sens. Essayez de passer un peu de temps à découvrir ce que les autres pensent et ressentent vraiment avant de passer à l’action. Pour de meilleurs résultats, vous devez apprendre à faire confiance à votre intuition, mais tempérer l’action directe avec une considération équilibrée pour trouver la bonne approche.</span></p></div>"
    },
    {
        "title": "Idéaliste",
        "content": "<div><p><span style=\"font-weight: 400;\">Vous êtes à la fois noble d’esprit et naturellement idéaliste. Pour cette raison, vous vous battez pour des idées ou des personnes qui vous tiennent à cœur. Le Bélier incarne les qualités du guerrier spirituel. Vous vous souciez peut-être peu de l’argent ou du prestige, mais vous pouvez être motivé à déplacer des montagnes si un idéal ou un individu est en jeu. Vous avez des idéaux élevés et croyez en la vérité et la justice.</span><span style=\"font-weight: 400;\"><br>\n</span><span style=\"font-weight: 400;\">Trouver des moyens de canaliser votre nature guerrière vers des résultats tangibles devrait s’avérer gratifiant pour vous, et lorsque vous sentirez que vous « menez le bon combat », vous vous sentirez en paix en vous-même.</span></p></div>"
    },
    {
        "title": "Soleil en Bélier + Lune en Bélier",
        "content": "<div><p><span style=\"font-weight: 400;\">Si vous avez le Bélier pour signe solaire et lunaire, vous pouvez vous attendre à une personnalité dominée par ce signe de feu. Cela signifie que vous êtes plein de bravoure, d’optimisme et avez une attitude entreprenante. Mais vous lutterez également contre l’insouciance et un tempérament colérique. Il faudra du travail pour garder vos émotions négatives et vos décisions pulsionnelles sous contrôle, mais une fois que vous y parviendrez, vos traits positifs transparaîtront.</span></p></div>"
    },
    {
        "title": "Soleil en Taureau + Lune en Bélier",
        "content": "<div><p><span style=\"font-weight: 400;\">Le Bélier et le Taureau sont tous les deux incroyablement têtus. Ces natifs sont prêt à tout quand ils pensent avoir raison, même pour des questions insignifiantes. Cependant, ce jumelage présente également des avantages. Les Taureaux peuvent être un peu coincés dans leurs habitudes, mais la lune en Bélier injectera le feu et la spontanéité nécessaires dans cette personnalité, créant une personnalité qui prend des décisions judicieuses mais capable de toujours s’amuser.</span></p><p><span style=\"font-weight: 400;\">&nbsp;</span></p></div>"
    },
    {
        "title": "Soleil en Gémeaux + Lune en Bélier",
        "content": "<div><p><span style=\"font-weight: 400;\">Cette combinaison est fortement optimiste et peut s’entendre avec pratiquement n’importe qui. La vie est une fête ! Cependant, comme le Bélier et le Gémeaux aiment tous les deux les montées d’adrénaline, gare à l’imprudence et aux situations dangereuses !</span></p></div>"
    },
    {
        "title": "Solei en Cancer + Lune en Bélier",
        "content": "<div><p><span style=\"font-weight: 400;\">Les Cancers peuvent être quelque peu maussades et dépressifs, donc une grande force de ce couple soleil/lune est qu’une lune Bélier ajoutera un peu d’optimisme et de vivacité afin que le Cancer ne soit pas dans le marasme aussi souvent.&nbsp;</span></p></div>"
    },
    {
        "title": "Soleil en Lion + Lune en Bélier",
        "content": "<div><p><span style=\"font-weight: 400;\">Lion et Bélier se complètent vraiment, il s’agit donc d’un fort duo soleil/lune. Les deux signes de feu sont des fonceurs courageux et optimistes qui aiment prendre les choses en main, alors attendez-vous à ce que ces qualités brillent. De plus, l’énergie lunaire joyeuse du Bélier peut convaincre un Lion de se lâcher de temps en temps.</span></p><p><span style=\"font-weight: 400;\">&nbsp;</span></p></div>"
    },
    {
        "title": "Soleil en Vierge Soleil + Lune en Bélier",
        "content": "<div><p><span style=\"font-weight: 400;\">La Vierge et le Bélier ne sont pas des signes très similaires : la Vierge est fiable, réfléchie et un peu tendue. Le Bélier, en revanche, est un casse-cou fougueux qui saute d’une chose à l’autre. Cependant, les différences entre ces signes solaires et lunaires s’harmonisent bien. Avoir un signe de lune Bélier peut aider la Vierge à prendre des décisions plus facilement, plutôt que de se laisser piéger dans un cycle d’indécision.&nbsp;&nbsp;</span></p></div>"
    },
    {
        "title": "Soleil en Balance + Lune en Bélier",
        "content": "<div><p><span style=\"font-weight: 400;\">La Balance et le Bélier peuvent s’entendre à merveille lorsqu’ils sont en groupe, mais lorsqu’une personne a cette combinaison soleil/lune, cela peut causer quelques problèmes. Les deux signes sont connus pour être impulsifs et imprudents, donc lorsqu’une Balance a une lune en Bélier, il n’y a tout simplement aucun aspect de sa personnalité disposé à exploiter les pauses.&nbsp;&nbsp;</span></p></div>"
    },
    {
        "title": "Soleil en Scorpion + Lune en Bélier",
        "content": "<div><p><span style=\"font-weight: 400;\">Il y a des avantages et des inconvénients ici. Le Scorpion est naturellement fermé émotionnellement et peut conserver des sentiments négatifs pendant longtemps. Avoir une lune Bélier aide à voir les aspects les plus ensoleillés de la vie et à prendre les choses comme elles viennent.&nbsp;</span></p></div>"
    },
    {
        "title": "Soleil en Sagittaire + Lune en Bélier",
        "content": "<div><p><span style=\"font-weight: 400;\">Les signes du Sagittaire et du Bélier sont très similaires, il n’y aura donc pas beaucoup de conflit intérieur.. Les deux signes sont aventureux, indépendants et optimistes, et les personnes avec cette combinaison soleil/lune aiment la vie en général. Cependant, comme ni le signe solaire ni le signe lunaire ne sont connus pour réfléchir aux décisions, cela génère parfois des soucis.&nbsp;</span></p></div>"
    },
    {
        "title": "Soleil en Capricorne + Lune en Bélier",
        "content": "<div><p><span style=\"font-weight: 400;\">Le Capricorne – le signe connu pour être fiable, travailleur et stressé bénéficie grandement d’avoir un signe de lune en Bélier. La vivacité du Bélier est juste ce qu’il faut pour amener le Capricorne à injecter du plaisir et de la créativité dans sa vie, et peut vraiment améliorer les pensées intérieures du Capricorne et son opinion de lui-même.</span></p></div>"
    },
    {
        "title": "Soleil en Verseau + Lune en Bélier",
        "content": "<div><p><span style=\"font-weight: 400;\">Lorsqu’un Verseau – un signe connu pour être intelligent et drôle – a une lune en Bélier, ces traits ne font que se renforcer, faisant de ces personnes des êtres brillants. Le caractère instable du Bélier peut provoquer un certain malaise chez le Verseau par ailleurs équilibré, mais, dans l’ensemble, cette combinaison soleil/lune crée des personnes heureuses et intéressantes.</span></p></div>"
    },
    {
        "title": "Soleil en Poissons + Lune en Bélier",
        "content": "<div><p><span style=\"font-weight: 400;\">Cela peut être une combinaison difficile. Les deux signes sont très en phase avec leurs émotions, mais ils les expriment de différentes manières. Ce duo soleil/lune peut créer un Poissons qui oscille entre pleurs et excès de colère. Cependant, les Poissons peuvent être extrêmement insipides et avoir du mal à s’exprimer, et un signe de lune Bélier peut les rendre plus affirmés et disposés à défendre les choses qui comptent pour eux.</span></p><p><span style=\"font-weight: 400;\">Pour en savoir plus, n’hésitez pas à parcourir notre rubrique</span><a href=\"https://www.esteban-frederic.fr/astrologie/\"> <span style=\"font-weight: 400;\">Astrologie</span></a><span style=\"font-weight: 400;\"> !</span></p><p></p></div>"
    },
];
exports.faqs = {
    "/signe-lunaire/belier": SigneLunaireBelier,
};
