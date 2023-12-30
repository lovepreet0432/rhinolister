import Papa from 'papaparse';

export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateInNumber = (date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();

  // Add leading zero if month or day is less than 10
  const formattedMonth = month < 10 ? `0${month}` : `${month}`;
  const formattedDay = day < 10 ? `0${day}` : `${day}`;

  return `${formattedMonth}${formattedDay}${year}`;
}

export const exportCSV = (data) => {

  try {
    // Map the data to only include UPC, Title, and Price columns
    const csvData = data.map((record) => [
      record.scan_id,
      record.title,
      record.price,
      record.qty,
      record.created_at
    ]);

    const headers = ["UPC", "Title", "Price", "Qty", "Created At"];

    // Add the headers as the first row
    csvData.unshift(headers);

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'product_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('Your browser does not support downloading CSV files.');
    }
  } catch (error) {
    console.error('Error exporting CSV:', error);
    alert('An error occurred while exporting CSV.');
  }
}

export const calculateDiscountedPrice = (originalPrice, discount) => {
  const discountPercentage = parseFloat(discount);
  const discountAmount = (discountPercentage / 100) * originalPrice;
  const finalPrice = originalPrice - discountAmount;
  return finalPrice.toFixed(2);
}

export const currentDateInFormat = () => {
  // Get the current date
  const currentDate = new Date();
  const formattedDate = `${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}-${currentDate.getFullYear()}`;
  return formattedDate;
}

export const categories = [
  'Action Figures',
  'Antiques, Vintage & Ephemera',
  'Arts & Handmade',
  'Bags & Accessories',
  'Beauty',
  'Books',
  'Coins & Money',
  'Comics & Manga',
  'Disneyana',
  'Electronics',
  'Estate Sales & Storage Units',
  'Food & Drink',
  'Home & Garden',
  'Jewelry',
  'Kawaii',
  'Baby & Kids',
  "Men's Fashion",
  'Movies',
  'Music',
  'NFTs',
  'Rocks & Crystals',
  'Sneakers & Streetwear',
  'Sports Cards',
  'Sporting Gear',
  'Toys & Hobbies',
  'Trading Card Games',
  'Video Games',
  'Watches',
  "Women's Fashion",
  'and Whatnot',
];

export const hazmat = [
  'Not Hazmat',
  'Hazmat - Standard',
  'Hazmat - Lithium Battery'

]

export const type = [
  'Auction',
  'Buy It Now',
  'Giveaway'
]

export const shippingProfile = [
  '0-1 oz',
  '1-3 oz',
  '4-7 oz',
  '8-11 oz',
  '12-15 oz',
  '1 lb',
  '1-2 lbs',
  '2-3 lbs',
  '3-4 lbs',
  '4-6 lbs',
  '10-14 lbs',
  'Sports singles (3oz)',
  '0 to <100 grams',
  '100 to <250 grams',
  '250 to <500 grams',
  '500 to <750 grams',
  '750 grams to <1 KGs',
  '1 KGs to <2 KGs',
  '2 KGs to <3 KGs',
  '3 KGs to <5 KGs',
  '5 KGs to <7 KGs',
  '7 to <10 KGs'
]

export const getSubCategories = (category) => {
  const subCategoryMappings = {
    'Action Figures': ['Anime Figures', 'DC Figures', 'G.I. Joe Figures', 'Hot Toys',
      'Antiques, Vintage & Ephemera', 'Marvel Figures', 'Other Action Figures',
      'Power Rangers', 'Simpsons Figures', 'Star Wars Figures', 'TMNT Figures', 'Transformers Figures', 'Wrestling Figures'],
    'Antiques, Vintage & Ephemera': ['Antiques', 'Ephemera & Postcards', 'Stamps', 'Vintage Decor'],

    'Arts & Handmade': ['Art & Prints',
      'Jewelry Making Supplies',
      'Knitting, Crochet & Fiber Arts',
      'Other General & Craft Supplies',
      'Artisan & Handmade Goods & Decor',
      'Quilting, Sewing & Fabric',
      'Handmade & Upcycled Fashion & Accessories',
    ],
    'Bags & Accessories': ['Fashion & Thrift Bags',
      'Luxury Bags & Accessories',
      'Other Accessories',
    ],
    'Beauty': [
      'Fragrances',
      'Hair Products',
      'Makeup & Skincare',
      'Nails',
      'Other Beauty',
      'Skincare'
    ],
    'Books': ['Antiquarian & Collectible Books',
      "Children's Books",
      'Graphic Novels',
      'Other Books',
      'Romance Books',
      'Sci-Fi, Fantasy, & Horror Books',
    ],
    'Coins & Money': [
      'Coins & Bullion',
      'Collectible Coins',
      'Other Coins & Money',
      'Paper Money & Currency',
    ],
    'Comics & Manga': [
      'Anime & Manga',
      'Vintage Comics',
      'Comic Art',
      'Modern Age',
      'Other Comics',
      'Pop Culture Memorabilia',

    ],
    'Disneyana': [
      'Disney Accessories',
      'Disney Clothing',
      'Loungefly',
      'Disney Original & Animation Art',
      'Other Disneyana',
      'Disney Pins',
    ],
    'Electronics':
      [
        'Cameras, Lenses & Drones',
        'Car Electronics',
        'Everyday Electronics',
        'Mechanical Keyboards',
        'Other Electronics',
        'PC Parts & Components',
      ],
    'Estate Sales & Storage Units'
      : [
        'Estate Sales',
        'Garage Sales',
        'Other Estate Sales & Storage Units',
        'Return Pallets',
        'Storage Unit Finds',
      ],
    'Food & Drink':
      [
        'Coffee & Tea',
        'Other Food & Drink',
        'Snacks & Candy',
      ],
    'Home & Garden':
      [
        'Home Decor',
        'Kitchen & Dining',
        'Other Home & Garden',
        'Plants & Garden',
        'Tools',
      ],
    'Jewelry': [
      'Contemporary Costume',
      'Fine & Precious Metals',
      'Handcrafted & Artisan Jewelry',
      "Men's Jewelry",
      'Vintage & Antique Jewelry',
    ],
    'Kawaii': [

    ],
    'Baby & Kids': [

    ],
    "Men's Fashion": [
      "Men's Modern",
      "Men's Vintage Clothing",
      "Other Men's Fashion",
    ],
    'Movies': [
      'DVDs',
      'Movie Memorabilia',
      'VHS',
    ],
    'Music': [
      'CDs & Cassettes',
      'Instruments & Accessories',
      'Music Memorabilia',
      'Other Music',
      'Vinyl Records',
      '[DELETE] Instruments and Accessories',
    ],
    'NFTs':
      [
      ],
    'Rocks & Crystals': [
      'Crystals & Gems',
      'Fossils',
      'Other Rocks',
    ],
    'Sneakers & Streetwear': [
      'Sneakers',
      'Streetwear',
    ],
    'Sports Cards':
      [
        'Baseball Breaks',
        'Baseball Memorabilia',
        'Baseball Mystery',
        'Baseball Singles',
        'Basketball Breaks',
        'Basketball Memorabilia',
        'Basketball Mystery',
        'Basketball Singles',
        'F1 Cards',
        'Football Breaks',
        'Football Memorabilia',
        'Football Mystery',
        'Football Singles',
        'Hockey Breaks',
        'Hockey Mystery',
        'Hockey Singles',
        'NASCAR Cards',
        'Other Sports Memorabilia',
        'Other Sports Cards',
        'Soccer Breaks',
        'Soccer Memorabilia',
        'Soccer Mystery',
        'Soccer Singles',
        'UFC Breaks',
        'UFC Mystery',
        'UFC Singles',
        'Whatnot Sports Card Show',
        'Wrestling Breaks',
        'Wrestling Mystery',
        'Wrestling Singles',
      ],
    'Sporting Gear':
      [
        'Camping & Hiking',
        'Disc Golf',
        'Fishing',
        'Golf',
        'Hunting',
        'Other Sports Equipment',

      ],
    'Toys & Hobbies':
      [
        'Barbie',
        'Bearbrick',
        'Board Games',
        'D&D & Role-playing Games',
        'Diecast Cars',
        'Fast Food & Cereal Toys',
        'FigPin',
        'Funko Pop!',
        'Funko Soda',
        'Minifigures',
        'Models & Kits',
        'Monster High',
        'Other Designer Toys',
        'Other Diecast',
        'Other Dolls',
        'Other Funko Products',
        'Other LEGO',
        'Other Plush',
        'Other Tabletop Games',
        'Other Toys',
        'Puzzles',
        'Radio Control Vehicles & Toys',
        'Sets',
        'Slot Cars',
        'Squishmallows',
        'Vintage Toys',
        'Warhammer 40k & Wargames',

      ],
    'Trading Card Games':
      [
        'Akora',
        'DC Cards',
        'Digimon Cards',
        'Disney Cards',
        'Dragon Ball Cards',
        'Flesh & Blood',
        'Garbage Pail Kids',
        'Kryptik',
        'Magic: The Gathering',
        'Marvel Cards',
        'MetaZoo',
        'My Hero Academia Cards',
        'Naruto Cards',
        'One Piece Cards',
        'Kickstarter & Other Cards',
        'Pokémon Cards',
        'Star Wars Cards',
        'TCG Accessories',
        'Weiß Schwarz',
        'Yu-Gi-Oh! Cards',

      ],
    'Video Games':
      [
        'Consoles & Accessories',
        'Gamesgiving',
        'Modern Games',
        'Retro Games',
        'Strategy Guides, Manuals, Replacement Cases',

      ],
    'Watches':
      [

      ],
    "Women's Fashion": [
      "Other Women's Fashion",
      "Women's Activewear",
      "Women's Contemporary",
      "Women's True Vintage",
      "Y2K",
    ],
    'and Whatnot': [
      'Breweriana',
      'Cosplay Items',
      'Flags',
      'Magazines',
      'Maps',
      'Online 1-1 Experience',
      'Other',
      'Pet Supplies',
    ]
  };

  return subCategoryMappings[category] || [];
};
