/* Content is intentionally separate from layout. Add, disable or reorder brands here. */
const frameSet = id => Array.from({ length: 6 }, (_, index) => `${id}-frame-${index + 1}.webp`);
const defineBrand = record => {
  const { home = {}, campaign = {}, campaigns = [], collections = [], frames = frameSet(record.id), ...identity } = record;
  const primaryCampaign = {
    id: 'current', status: 'active', title: record.chapter, story: record.note,
    poster: `${record.id}-panorama.webp`,
    fragments: frames.map(image => ({ poster: `${record.id}-panorama.webp`, hoverImage: image, hoverVideo: null })),
    ...campaign,
  };
  const primaryCollection = {
    id: 'current', status: 'active', title: record.chapter,
    story: record.note, campaignId: primaryCampaign.id,
    productIds: record.products.map(product => product.id),
  };
  return {
    enabled: true,
    ...identity,
    hero: identity.hero || primaryCampaign.poster,
    home: { poster: frames[2], hoverImage: frames[0], hoverVideo: null, ...home },
    campaigns: [primaryCampaign, ...campaigns],
    featuredCampaignId: identity.featuredCampaignId || primaryCampaign.id,
    collections: [primaryCollection, ...collections],
    featuredCollectionId: identity.featuredCollectionId || primaryCollection.id,
    frames,
  };
};

window.KURI_DATA = {
  homeEditorial: {
    leadBrandId: 'sutura',
    pairedBrandIds: ['bies', 'oficio'],
    featuredProductIds: ['umbral-0', 'vertice-0', 'orilla-0', 'aro-0'],
  },
  categories: {
    outerwear: 'Abrigos y chaquetas',
    dresses: 'Vestidos',
    accessories: 'Accesorios',
    archive: 'Vintage y segunda mano',
    tailoring: 'Sastrería',
    knitwear: 'Punto y artesanía',
    streetwear: 'Streetwear',
    experimental: 'Experimental',
    unisex: 'Unisex',
  },
  brands: [
    defineBrand({
      id: 'umbral', name: 'Umbral', mark:'U/', order: 10, identity: 'underground', motif: 'Noche / lona / metal',
      hero: 'umbral-alt.webp',
      audience: 'Para quienes hacen suya la ciudad después del cierre.',
      story: 'Umbral nació de reparar chaquetas de trabajo para amigos que montaban escenarios. Conservamos las costuras visibles y el peso de las telas.',
      chapter: 'Turno de noche', intro: 'Ropa para atravesar la ciudad.',
      note: 'Lona lavada, metal gastado y siluetas que dejan espacio al cuerpo.',
      home: { poster: 'umbral-alt.webp', hoverImage: 'umbral-frame-1.webp', hoverVideo: 'umbral-alt.mp4' },
      products: [
        { id:'umbral-0', name:'Chaqueta de lona lavada', detail:'Lona de algodón · grafito', price:168, image:'umbral-look.webp', sizes:['S','M','L'], categories:['outerwear','unisex'] },
        { id:'umbral-1', name:'Pieza de archivo 01', detail:'Costuras y metal', price:92, image:'umbral-detail.webp', sizes:['Única'], categories:['accessories'] },
        { id:'umbral-2', name:'Chaqueta Umbral', detail:'Corte amplio · edición corta', price:184, image:'umbral-frame-3.webp', sizes:['S','M','L'], categories:['outerwear','unisex'] },
      ],
    }),
    defineBrand({
      id:'bies', name:'Casa Bies', mark:'cb', order:20, identity:'atelier', motif:'Corte / caída / giro',
      hero:'bies-alt.webp',
      audience:'Para quien elige un vestido por cómo se mueve.',
      story:'En Casa Bies cada patrón empieza sobre el cuerpo en movimiento. El taller prueba la caída antes de cerrar una sola costura.',
      chapter:'Estudio del giro', intro:'Vestidos que siguen el movimiento.',
      note:'Cortes al bies, luz de taller y tejidos que encuentran su forma al andar.',
      home:{poster:'bies-alt.webp',hoverImage:'bies-frame-1.webp',hoverVideo:'bies-alt.mp4'},
      products:[
        {id:'bies-0',name:'Vestido al bies',detail:'Rosa empolvado · largo',price:215,image:'bies-look.webp',sizes:['XS','S','M','L'],categories:['dresses']},
        {id:'bies-1',name:'Estudio del dobladillo',detail:'Tejido ligero · rosa',price:138,image:'bies-detail.webp',sizes:['S','M','L'],categories:['dresses','accessories']},
        {id:'bies-2',name:'Vestido de taller',detail:'Espalda abierta · edición corta',price:240,image:'bies-frame-3.webp',sizes:['XS','S','M'],categories:['dresses']},
      ],
    }),
    defineBrand({
      id:'relevo',name:'Relevo',mark:'R·',order:30,identity:'archive',motif:'Hallazgo / reparación / memoria',
      hero:'relevo-look.webp',
      audience:'Para quien quiere conocer la vida anterior de una prenda.',
      story:'Relevo encuentra piezas usadas, registra sus marcas y repara lo necesario sin borrar lo que el tiempo dejó. Cada etiqueta cuenta procedencia y cuidado.',
      chapter:'Cuaderno de hallazgos',intro:'La ropa guarda otras vidas.',
      note:'Hallazgos de segunda mano, piel marcada por el tiempo y prendas listas para volver a salir.',
      home:{poster:'relevo-look.webp',hoverImage:'relevo-frame-1.webp',hoverVideo:'relevo-look.mp4'},
      products:[
        {id:'relevo-0',name:'Blazer de piel recuperada',detail:'Piel vintage · caramelo',price:126,image:'relevo-look.webp',sizes:['M'],categories:['outerwear','archive']},
        {id:'relevo-1',name:'Pañuelo de archivo',detail:'Seda estampada · segunda mano',price:34,image:'relevo-detail.webp',sizes:['Única'],categories:['accessories','archive']},
        {id:'relevo-2',name:'Chaqueta setenta',detail:'Pieza única · revisada',price:112,image:'relevo-frame-3.webp',sizes:['L'],categories:['outerwear','archive']},
      ],
    }),
    defineBrand({
      id:'plano',name:'Plano',mark:'P□',order:40,identity:'grid',motif:'Volumen / precisión / uso',
      hero:'plano-alt.webp',
      audience:'Para cuerpos que no necesitan una etiqueta de género.',
      story:'Plano trabaja con un patrón base y lo desplaza unos centímetros hasta que la prenda encuentra otro equilibrio. El ajuste lo decide quien la lleva.',
      chapter:'Patrón abierto',intro:'Formas para todos los cuerpos.',
      note:'Volúmenes precisos, hombros definidos y prendas concebidas para durar más de una temporada.',
      home:{poster:'plano-alt.webp',hoverImage:'plano-frame-1.webp',hoverVideo:'plano-alt.mp4'},
      products:[
        {id:'plano-0',name:'Abrigo de estructura',detail:'Algodón técnico · crudo',price:228,image:'plano-look.webp',sizes:['S','M','L'],categories:['outerwear','unisex']},
        {id:'plano-1',name:'Estudio de hombro',detail:'Línea unisex · algodón',price:96,image:'plano-detail.webp',sizes:['S','M','L'],categories:['accessories','unisex']},
        {id:'plano-2',name:'Sobrecamisa modular',detail:'Corte amplio · unisex',price:154,image:'plano-frame-3.webp',sizes:['S','M','L'],categories:['outerwear','unisex']},
      ],
    }),
    defineBrand({
      id:'vertice',name:'Vértice',mark:'V↗',order:50,identity:'court',motif:'Pista / velocidad / código',
      audience:'Para quienes mezclan ropa de pista y calle sin cambiarse.',
      story:'Vértice empezó interviniendo ropa deportiva encontrada en mercadillos. La diagonal roja sigue siendo la marca de cada prenda.',
      chapter:'Línea de fuga',intro:'La pista continúa después del partido.',
      note:'Nailon técnico, volúmenes sueltos y una diagonal que no se queda quieta.',
      products:[
        {id:'vertice-0',name:'Cortavientos Diagonal',detail:'Nailon azul cobalto · panel rojo',price:145,image:'vertice-product-1.webp',sizes:['XS','S','M','L'],categories:['outerwear','streetwear','unisex']},
        {id:'vertice-1',name:'Pantalón de pista',detail:'Algodón técnico · antracita',price:98,image:'vertice-product-2.webp',sizes:['S','M','L'],categories:['streetwear','unisex']},
        {id:'vertice-2',name:'Chaqueta de calentamiento',detail:'Cierre frontal · edición corta',price:162,image:'vertice-product-3.webp',sizes:['S','M','L'],categories:['streetwear','outerwear']},
      ],
    }),
    defineBrand({
      id:'oficio',name:'Oficio',mark:'O—',order:60,identity:'tailor',motif:'Taller / corte / permanencia',
      audience:'Para quien lleva la sastrería fuera de la oficina.',
      story:'Oficio corta pocos trajes y deja margen para arreglarlos años después. La primera prueba ocurre siempre en el taller, junto a la mesa de corte.',
      chapter:'La segunda prueba',intro:'Un traje se construye para vivir dentro.',
      note:'Lana azul tinta, hombro limpio y costuras pensadas para volver a abrirse.',
      products:[
        {id:'oficio-0',name:'Americana Taller',detail:'Lana fría · azul tinta',price:325,image:'oficio-product-1.webp',sizes:['S','M','L'],categories:['tailoring','unisex']},
        {id:'oficio-1',name:'Pantalón de pinza',detail:'Lana ligera · cintura alta',price:185,image:'oficio-product-2.webp',sizes:['S','M','L'],categories:['tailoring']},
        {id:'oficio-2',name:'Chaleco de prueba',detail:'Forro crudo · cierre interior',price:165,image:'oficio-product-3.webp',sizes:['S','M','L'],categories:['tailoring']},
      ],
    }),
    defineBrand({
      id:'trenza',name:'Trenza',mark:'T≋',order:70,identity:'loom',motif:'Lana / mano / invierno',
      audience:'Para quien reconoce una prenda por el tacto antes que por la etiqueta.',
      story:'Trenza reúne tejedoras de dos generaciones. Una pequeña irregularidad en el punto revela qué manos hicieron cada pieza.',
      chapter:'Punto de origen',intro:'Cada hebra conserva una mano.',
      note:'Lana rústica suavizada, mezclas tierra y puntadas que no buscan repetirse exactamente.',
      products:[
        {id:'trenza-0',name:'Cárdigan Terracota',detail:'Lana tejida a mano · óxido',price:198,image:'trenza-product-1.webp',sizes:['S','M','L'],categories:['knitwear','unisex']},
        {id:'trenza-1',name:'Bufanda de telar',detail:'Lana natural · pieza corta',price:76,image:'trenza-product-2.webp',sizes:['Única'],categories:['knitwear','accessories']},
        {id:'trenza-2',name:'Jersey de hebra vista',detail:'Punto grueso · avena',price:164,image:'trenza-product-3.webp',sizes:['S','M','L'],categories:['knitwear']},
      ],
    }),
    defineBrand({
      id:'orilla',name:'Orilla',mark:'O~',order:80,identity:'coast',motif:'Sal / lino / aire',
      audience:'Para quienes llevan el verano sin disfrazarlo.',
      story:'Orilla trabaja con talleres pequeños cerca del mar. Lavamos el lino antes de cortarlo para que la prenda cambie lo menos posible después.',
      chapter:'La línea del agua',intro:'El lino aprende del viento.',
      note:'Prendas ligeras, piedra caliza y sombras largas al final de la tarde.',
      products:[
        {id:'orilla-0',name:'Camisa de sal',detail:'Lino lavado · arena',price:119,image:'orilla-product-1.webp',sizes:['S','M','L'],categories:['unisex']},
        {id:'orilla-1',name:'Pantalón de terraza',detail:'Lino crudo · corte amplio',price:138,image:'orilla-product-2.webp',sizes:['S','M','L'],categories:['unisex']},
        {id:'orilla-2',name:'Sobrecamisa de verano',detail:'Lino medio · piedra',price:155,image:'orilla-product-3.webp',sizes:['S','M','L'],categories:['outerwear','unisex']},
      ],
    }),
    defineBrand({
      id:'sutura',name:'Sutura',mark:'S/',order:90,identity:'construct',motif:'Corte / unión / riesgo',
      audience:'Para quien quiere ver cómo está construida la ropa.',
      story:'Sutura desmonta patrones clásicos y deja a la vista algunas decisiones del taller. Las puntadas rojas señalan dónde podría comenzar otra versión.',
      chapter:'Costura abierta',intro:'La prenda muestra su estructura.',
      note:'Paneles asimétricos, hilván rojo y volúmenes que cambian desde cada ángulo.',
      products:[
        {id:'sutura-0',name:'Abrigo Ensamble',detail:'Paños reconstruidos · pizarra',price:285,image:'sutura-product-1.webp',sizes:['S','M','L'],categories:['experimental','outerwear','unisex']},
        {id:'sutura-1',name:'Panel de prueba',detail:'Algodón y costura expuesta',price:116,image:'sutura-product-2.webp',sizes:['S','M','L'],categories:['experimental']},
        {id:'sutura-2',name:'Capa Hilván',detail:'Silueta modular · gris',price:225,image:'sutura-product-3.webp',sizes:['S','M','L'],categories:['experimental','outerwear']},
      ],
    }),
    defineBrand({
      id:'aro',name:'Aro',mark:'◯',order:100,identity:'jewel',motif:'Metal / cuerpo / luz',
      audience:'Para quien usa una sola pieza como gesto suficiente.',
      story:'Aro modela metal a escala del cuerpo, no del escaparate. Las superficies se cepillan a mano y conservan la huella del proceso.',
      chapter:'Peso de la luz',intro:'Una forma pequeña cambia el gesto.',
      note:'Plata cepillada, curvas asimétricas y reflejos contenidos sobre la piel.',
      products:[
        {id:'aro-0',name:'Pendientes Desfase',detail:'Plata cepillada · par asimétrico',price:118,image:'aro-product-1.webp',sizes:['Única'],categories:['accessories']},
        {id:'aro-1',name:'Brazalete Martillado',detail:'Plata reciclada · acabado manual',price:165,image:'aro-product-2.webp',sizes:['S','M'],categories:['accessories']},
        {id:'aro-2',name:'Aro de estudio',detail:'Volumen irregular · plata',price:96,image:'aro-product-3.webp',sizes:['Única'],categories:['accessories']},
      ],
    }),
  ],
};
