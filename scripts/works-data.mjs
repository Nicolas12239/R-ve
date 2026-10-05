// Les trois premiers récits de Rêve, insérés lors de `npm run db:setup`.
// Chaque ligne du texte est séparée par une ligne vide : une ligne = un vers.

const lines = (s) =>
  s
    .trim()
    .split(/\n\s*\n/)
    .map((l) => l.trim())
    .join("\n\n");

export const works = [
  {
    slug: "cette-guerre-silencieuse",
    title: "Cette guerre silencieuse que l’amour livre contre le passé",
    cover_title: "Guerre silencieuse",
    subtitle: null,
    theme: "Amour · Passé · Acceptation",
    excerpt: "Il ne souffre pas de jalousie. Il souffre d’être arrivé après.",
    epigraphs: [
      {
        text: "L’amour est fort comme la mort… les grandes eaux ne peuvent éteindre l’amour.",
        source: "Cantique des Cantiques 8:6-7",
      },
    ],
    cover: { motif: "sanctuaire", palette: "rose", seed: 7, titlePos: "top" },
    content: lines(`
Il existe des douleurs qui ne trouvent leur origine ni dans la trahison, ni dans le mensonge, ni même dans l’absence.

Des douleurs plus discrètes.

Plus pudiques.

Des douleurs dont on rougit presque tant elles semblent injustifiables.

Et pourtant…

Elles n’en demeurent pas moins réelles.

L’amour possède cette étrange faculté d’exiger de nous une grandeur que notre condition humaine peine parfois à atteindre.

Nous savons, par la raison, que celui ou celle que nous aimons a vécu avant notre arrivée.

Qu’il y eut d’autres regards.

D’autres conversations.

D’autres mains effleurées.

D’autres histoires.

La raison l’accepte.

Mais le cœur…

Le cœur, lui, résiste encore.

Il ne souffre pas de jalousie.

Il souffre d’être arrivé après.

Je ne t’en veux pas.

Comment le pourrais-je ?

Tu ne me devais rien avant que nos chemins ne se croisent.

Tu n’avais aucune promesse à honorer envers un homme qui n’existait pas encore dans ton histoire.

Tu étais libre.

Libre d’aimer.

Libre d’essayer.

Libre de te tromper.

Libre d’apprendre.

Et cette liberté, je ne la condamnerai jamais.

Car c’est aussi elle qui t’a conduite jusqu’à moi.

Pourtant, il serait malhonnête de prétendre que cette vérité ne m’atteint jamais.

Il m’arrive parfois de ressentir cette amertume silencieuse.

Cette émotion dont on ne parle presque jamais.

Cette pensée qui surgit sans prévenir lorsque les souvenirs du passé croisent les regards du présent.

Il m’arrive de me retrouver parmi ceux qui, avant moi, ont occupé une place dans ton histoire.

Et soudain, sans qu’aucun mot ne soit prononcé, le silence devient lourd.

Je souris.

Je participe aux conversations.

Mais quelque chose, au fond de moi, vacille.

Je me surprends à imaginer des instants que je n’ai jamais vécus.

À reconstruire des scènes dont j’ignore tout.

À souffrir d’images que mon esprit invente davantage qu’il ne les connaît.

Alors je comprends que certaines blessures ne viennent pas de la réalité.

Elles naissent de l’imagination.

L’imagination…

Cette faculté sublime qui permet aux poètes d’écrire les plus beaux vers, mais qui offre aussi à l’homme amoureux les plus cruelles des tortures.

Parce que lorsque l’on aime profondément, l’être aimé cesse d’être une simple rencontre.

Il devient un sanctuaire.

Une terre sacrée.

Et le cœur, dans son élan le plus absolu, nourrit parfois un désir impossible : celui d’avoir été le premier pèlerin de ce sanctuaire.

Non par orgueil.

Mais parce qu’il aurait voulu être le premier à contempler cette beauté qui, aujourd’hui, lui paraît sans égale.

Voilà toute mon amertume.

Elle ne réside pas dans ton passé.

Elle réside dans mon incapacité, certains jours, à empêcher mon âme d’imaginer ce qu’elle n’a jamais connu.

Je ne voudrais pas te posséder.

L’amour véritable ne possède pas.

Il accueille.

Mais il m’arrive d’éprouver cette faiblesse profondément humaine : celle de souhaiter, l’espace d’un instant, que l’histoire eût commencé avec nous.

Puis la conscience reprend doucement sa place.

Je me rappelle que l’amour ne consiste pas à effacer le passé.

Il consiste à construire un avenir suffisamment vaste pour qu’il cesse de nous effrayer.

Je comprends alors que les hommes qui ont traversé ton existence n’ont jamais été mes rivaux.

Ils appartiennent à une époque qui n’est plus.

Moi, je suis celui qui espère appartenir à ton lendemain.

Et cette différence change tout.

Car ce ne sont pas les premiers chapitres d’un livre qui en déterminent la beauté.

C’est sa conclusion.

Alors, à quoi bon me consumer contre des souvenirs que je ne peux modifier ?

À quoi bon livrer bataille contre le temps lui-même ?

Le passé est un pays où nul ne peut retourner.

Mais l’avenir…

L’avenir demeure cette terre vierge sur laquelle il nous appartient encore d’écrire.

Alors oui.

Il y aura sans doute d’autres instants où cette amertume reviendra me visiter.

Je ne prétendrai pas être devenu assez sage pour ne plus jamais vaciller.

Je suis un homme.

Et les hommes portent parfois des blessures que la logique ne parvient pas à guérir.

Mais je refuse de laisser cette douleur devenir plus grande que mon amour.

Car si aimer consiste aussi à accepter l’histoire de l’autre, alors je choisirai cette acceptation, même lorsqu’elle me coûtera.

Je choisirai de traverser cette souffrance plutôt que de m’éloigner de toi.

Je choisirai de faire taire mes inquiétudes plutôt que de laisser le passé voler notre présent.

Je choisirai, encore et toujours, de te choisir.

Parce qu’au terme de toutes mes réflexions, de toutes mes insomnies et de toutes mes batailles intérieures, une seule certitude demeure intacte.

Tu es la femme que mon âme a reconnue.

Ma moitié.

Mon refuge.

Mon plus beau combat.

Et si aimer signifie parfois apprendre à embrasser ce qui nous blesse sans jamais cesser d’aimer, alors je porterai cette amertume comme on porte une cicatrice : non comme le souvenir d’une défaite, mais comme la preuve qu’un cœur peut souffrir profondément… sans jamais renoncer à celui qu’il a librement choisi.
`),
  },
  {
    slug: "de-l-abandon",
    title: "De l’abandon, ou la plus noble manière d’aimer",
    cover_title: "L’Abandon",
    subtitle: null,
    theme: "Amour · Confiance · Abandon",
    excerpt:
      "L’amour n’a jamais eu pour vocation de nous compléter. Il a pour vocation de nous révéler.",
    epigraphs: [
      {
        text: "Il n’y a pas de plus grand amour que de donner sa vie pour ceux que l’on aime.",
        source: "Jean 15:13",
      },
      {
        text: "Aimer, ce n’est pas se regarder l’un l’autre ; c’est regarder ensemble dans la même direction.",
        source: "Antoine de Saint-Exupéry",
      },
      { text: "Là où est ton trésor, là aussi sera ton cœur.", source: "Matthieu 6:21" },
    ],
    cover: { motif: "refuge", palette: "sauge", seed: 3, titlePos: "bottom" },
    content: lines(`
Il est une forme d’amour que notre époque ne comprend plus.

Une forme si exigeante qu’elle effraie les prudents, scandalise les calculateurs et déconcerte les cœurs devenus méfiants.

Cette forme d’amour porte un nom que beaucoup confondent avec la faiblesse.

Je l’appelle l’abandon.

Ne te méprends pas sur le sens de ce mot.

Je ne parle pas de cet abandon qui consiste à renoncer à soi-même jusqu’à disparaître dans l’existence d’autrui.

Je ne parle pas davantage de cette dépendance maladive qui fait d’un être humain l’ombre d’un autre.

Je parle de cet abandon infiniment plus rare : celui par lequel une âme choisit librement de déposer entre les mains d’une autre tout ce qu’elle possède de plus fragile.

Ses peurs.

Ses cicatrices.

Ses espérances.

Ses insuffisances.

Son avenir.

En vérité, s’abandonner à celui ou celle que l’on aime n’est pas perdre sa liberté.

C’est choisir, en pleine conscience, celui entre les mains duquel cette liberté cessera d’être une solitude.

Le monde nous enseigne à bâtir des remparts.

À nous protéger.

À conserver une porte de sortie au cas où les promesses se briseraient.

À aimer sans jamais nous livrer entièrement.

Comme si le véritable courage consistait à ne jamais souffrir.

Pourtant, les plus grands esprits ont compris que l’amour ne s’accommode pas des demi-mesures.

Saint Augustin écrivait : « Là où est l’amour, il n’y a pas de labeur ; ou si labeur il y a, ce labeur lui-même est aimé. »

Comment pourrait-on aimer tout en demeurant retranché derrière ses murailles ?

Comment espérer être profondément connu lorsque l’on ne montre que la façade de son être ?

L’amour véritable commence précisément là où cesse la représentation.

Il naît lorsque deux êtres cessent de jouer le rôle qu’ils imaginent devoir incarner pour avoir enfin le courage d’être.

Je voudrais aujourd’hui te parler de cet abandon parce qu’il est le plus beau cadeau que tu m’aies inconsciemment appris à désirer.

Avant toi, je croyais qu’aimer consistait à protéger mon cœur.

Puis je t’ai rencontrée.

Et j’ai compris que l’amour ne consiste pas à préserver son cœur.

Il consiste à trouver la personne devant laquelle il devient enfin possible de cesser de le protéger.

Tu ignores sans doute ce que tu as fait naître en moi.

Tu m’as donné envie de déposer les armes.

Non par faiblesse.

Mais parce que, pour la première fois, je n’avais plus envie de gagner contre quelqu’un.

J’avais envie de construire avec quelqu’un.

Tu m’as appris que la confiance est infiniment plus difficile que la passion.

La passion consume.

La confiance, elle, édifie.

La passion s’impose.

La confiance se mérite.

Et lorsque cette confiance devient suffisamment profonde, il se produit un phénomène presque sacré.

Nous cessons d’aimer pour ce que l’autre nous apporte.

Nous commençons à aimer pour ce qu’il devient en notre présence.

Voilà le véritable miracle.

Car l’amour n’a jamais eu pour vocation de nous compléter.

Il a pour vocation de nous révéler.

Je me découvre davantage depuis que je t’aime que pendant toutes les années où je croyais me connaître.

Je découvre des forces que j’ignorais posséder.

Une patience que je ne soupçonnais pas.

Une douceur que je croyais incompatible avec ma nature.

Tu n’as pas changé qui je suis.

Tu m’as révélé celui que j’étais capable de devenir.

Voilà pourquoi je refuse de considérer l’amour comme une émotion.

Une émotion passe.

L’amour véritable est une transformation.

Il est cette lente métamorphose par laquelle deux êtres deviennent mutuellement les jardiniers de leur propre humanité.

L’apôtre Paul écrivait que « l’amour est patient, l’amour est plein de bonté ; il ne cherche point son intérêt. » (1 Corinthiens 13.)

Longtemps, j’ai cru que ce passage décrivait une vertu.

Aujourd’hui, je comprends qu’il décrit un chemin.

Car aimer véritablement exige une mort.

Non la mort du corps.

Mais celle de l’orgueil.

La mort de cette nécessité permanente d’avoir raison.

La mort de cette peur de paraître vulnérable.

La mort de cet instinct qui nous pousse à retenir toujours une partie de nous-mêmes de peur qu’elle ne soit blessée.

Alors seulement naît l’abandon.

Et cet abandon n’appauvrit pas l’homme.

Il le magnifie.

Car il n’existe aucune grandeur à vivre une vie entière sans jamais avoir eu le courage de remettre son âme entre les mains d’un être digne de la recevoir.

À toi qui liras peut-être ces lignes sans mesurer l’étendue de ce que tu représentes pour moi, laisse-moi te confier une vérité que mon cœur répète en silence depuis si longtemps.

Je ne souhaite pas seulement partager mes jours avec toi.

Je souhaite te confier ce qu’il y a de plus précieux en moi : cette partie de mon âme que je n’ai jamais offerte à personne.

Je veux que tu connaisses mes failles sans qu’elles diminuent ton regard.

Je veux que tu voies mes peurs sans qu’elles altèrent ton estime.

Je veux que tu puisses déposer les tiennes contre mon épaule avec la certitude qu’elles y trouveront refuge.

Je ne rêve pas d’une femme parfaite.

Je rêve d’un sanctuaire réciproque.

D’un lieu où nous n’aurions plus besoin d’être forts.

Où nos silences seraient compris avant même d’être expliqués.

Où nos mains parleraient parfois mieux que nos lèvres.

Si un jour tu me demandais ce que signifie réellement t’aimer, je ne répondrais ni par des promesses grandioses ni par des serments que le temps pourrait éprouver.

Je te répondrais simplement ceci :

Je veux devenir cet endroit où ton âme n’aura plus jamais peur de se reposer.

Et si Dieu, dans son infinie sagesse, m’accordait la grâce de marcher un jour à tes côtés jusqu’au terme de mon existence, alors je considérerais que toute ma vie n’aura été qu’une longue préparation à cet unique privilège :

Celui de m’être abandonné à toi avec une confiance si entière qu’elle m’aura, paradoxalement, rendu plus libre que je ne l’ai jamais été.
`),
  },
  {
    slug: "que-celui-qui-voit-croie",
    title: "Que celui qui voit, croie",
    cover_title: "L’Éveil",
    subtitle: "Que celui qui ne voit pas, ouvre ses paupières et ses yeux.",
    theme: "Psychologie · Lucidité · Désir",
    excerpt: "Voir clairement ne signifie pas cesser d’aimer.",
    epigraphs: [],
    cover: { motif: "eveil", palette: "lavande", seed: 11, titlePos: "top" },
    content: lines(`
Il est des vérités qui ne se révèlent qu’à ceux qui acceptent de regarder au-delà de leurs espérances.

Aujourd’hui, nous nous attarderons sur un sujet dont la seule évocation suffit à ébranler les certitudes les plus solidement ancrées ; un sujet que d’aucuns qualifieraient de profondément heartbreaker : cette confrontation brutale entre ce que nous désirons ardemment et ce qui est.

Des mots, des silences, des gestes, des regards et, surtout, des actions nous sont continuellement présentés. Pourtant, nous persistons à ne retenir que ce qui nourrit nos aspirations.

Comme une mystérieuse mécanique céleste — ce que certains esprits assimileraient à l’effet papillon — l’existence tisse sous nos yeux un réseau subtil de causes, de conséquences et de signes. Mais rares sont ceux qui osent s’aventurer sur ce pont suspendu entre le réel et le désir.

Pourquoi ?

La réponse, bien qu’évidente, demeure difficile à accepter : nous n’aimons pas la vérité lorsqu’elle contrarie nos rêves.

Nous rejetons instinctivement tout ce qui menace l’édifice fragile de nos espérances.

Il y a peu, nous évoquions la métacognition : cet état d’éveil où l’esprit cesse de subir son existence pour commencer à l’observer.

À la lumière de cette conscience nouvelle, il devient impératif d’apprendre à discerner et à accueillir les signaux que la vie place sur notre chemin.

Car l’éveil n’est pas la capacité de voir davantage.

Il est le courage d’accepter ce que l’on voit.

Mon aveuglement, quant à lui, ne procédait pas d’une incapacité à comprendre.

Je percevais les signes.

Je déchiffrais les silences.

Je reconnaissais les distances.

Mais je m’efforçais désespérément de les effacer, de les minimiser, de les reléguer au second plan.

Je ne refusais pas de voir.

Je refusais d’accepter.

Sachez qu’il existe une frontière ténue, mais fondamentale, entre garder foi et demeurer crédule face aux faits.

Et j’appartenais à cette catégorie d’êtres qui, par attachement à leurs espérances, se détournent volontairement de l’évidence.

On me voyait.

Mais jamais de la manière dont j’aspirais à être vu.

Alors je ruminais.

Mes nuits s’étiraient dans une interminable procession de pensées, tantôt lucides, tantôt illusoires.

Chaque silence devenait une énigme.

Chaque détail, une interprétation.

Chaque absence, une blessure.

J’ai tenté, avec l’obstination des cœurs épris, de contraindre l’univers à épouser la forme de mes désirs.

Je me suis accroché à cette maxime que l’on répète avec une conviction presque religieuse :

« Il suffit d’y croire pour que cela arrive. »

Mais certaines vérités échappent à la volonté.

Certaines réalités demeurent insensibles à l’intensité de nos sentiments.

Peu à peu, cette phrase perdit toute résonance en moi.

Je me sentais égaré.

Dépouillé d’une part essentielle de mon être.

Comme si mon existence s’était soudainement vidée de sa substance.

Puis survint ce que j’appelle aujourd’hui l’éveil.

Je cessai de demander : pourquoi ?

Et je commençai enfin à me demander : comment ?

Comment pouvais-je continuer à espérer malgré l’évidence ?

Comment pouvais-je ignorer ce qui se manifestait avec tant de clarté ?

Comment mon désir avait-il acquis un pouvoir si grand qu’il parvenait à déformer ma perception du réel ?

Et c’est alors que je compris une chose essentielle.

Même la plus rigoureuse des sciences demeure impuissante face à certains phénomènes.

Car l’amour n’obéit ni aux lois de la logique, ni aux équations de la raison.

L’amour transcende les démonstrations.

Il persiste là où toute rationalité exigerait son renoncement.

Et savez-vous ce qui m’émerveille davantage encore ?

Malgré cet éveil.

Malgré cette lucidité nouvelle.

Malgré l’acceptation progressive de ce qui est.

Une part de moi demeure convaincue que cette femme, celle dont la simple évocation fait naître en moi des vertiges et des constellations entières, est celle que mon âme a choisie.

Celle pour qui je serais prêt à affronter vents et marées.

Celle qui continue d’habiter mes pensées avec la même intensité qu’au premier jour.

Paradoxe sublime et douloureux : voir clairement ne signifie pas cesser d’aimer.

Au fil du temps, pourtant, une autre révélation s’impose à moi.

À travers elle, ce n’est pas seulement l’amour que je découvre.

C’est moi-même.

Je me redécouvre dans mes excès, dans mes espoirs, dans mes failles et dans ma capacité inouïe à ressentir.

Et cette rencontre avec moi-même, aussi déroutante soit-elle, demeure peut-être la plus fascinante de toutes…
`),
  },
];
