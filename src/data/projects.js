const projects = [
  {
    id: 1,
    title: "MCS Design Outcomes",
    slug: "mcs-design-outcomes",
    imageUrl: "https://cdn.myportfolio.com/519f7bbb-e55e-4372-8a59-fce548e099e1/49443d15-4f7c-43fa-b377-2e5aff072cd6_rwc_126x0x927x927x927.jpg?h=08852beca65d52b81c3f616e26bc109a"
  },
  {
    id: 2,
    title: "St Helens College – 2020 Prospectus",
    slug: "st-helens-college-2020-school-leaver-prospectus",
    imageUrl: "https://cdn.myportfolio.com/519f7bbb-e55e-4372-8a59-fce548e099e1/8741489d-6fcd-41cd-a2d5-ed925623d5a1_carw_202x158x32.jpg?h=17d6f4042ed25b32fa6eae702fd1c9f2"
  },
  {
    id: 3,
    title: "Arnold Excavation Hire",
    slug: "arnold-excavation-hire",
    imageUrl: "https://cdn.myportfolio.com/519f7bbb-e55e-4372-8a59-fce548e099e1/6c7cd8f6-7317-4f77-99b2-ea62acc1a707_carw_1x1x32.png?h=59cdc55086cee1d7df3ea2e59d00987e"
  },
  {
    id: 4,
    title: "Logofolio",
    slug: "logofolio",
    imageUrl: "https://cdn.myportfolio.com/519f7bbb-e55e-4372-8a59-fce548e099e1/c1a873d0-d4e0-4706-9bee-29caf55c2acd_rwc_0x0x1980x1980x32.jpg?h=8924068a962e3ea2a9dd04065a376d98"
  },
  {
    id: 5,
    title: "Yellow Door Artists",
    slug: "yellow-door-artists",
    imageUrl: "https://cdn.myportfolio.com/519f7bbb-e55e-4372-8a59-fce548e099e1/62ad6123-6c07-4bcb-ba2a-a8cbbb13d3b4_rwc_260x61x895x895x32.png?h=34b4c32b6bd605e7ce50ba7aa0a6c443"
  },
  {
    id: 6,
    title: "Energising Advice Report",
    slug: "energising-advice-report",
    imageUrl: "https://cdn.myportfolio.com/519f7bbb-e55e-4372-8a59-fce548e099e1/884e8f52-3f72-4613-b55c-d47f0289a791_carw_1x1x32.png?h=143d2056e59ff75a9be19e70b92ffcf8"
  },
  {
    id: 7,
    title: "St Helens & Knowsley College (Proposal)",
    slug: "st-helens-knowsley-college",
    imageUrl: "https://cdn.myportfolio.com/519f7bbb-e55e-4372-8a59-fce548e099e1/f6470f10-6494-49e6-b55d-ee0c23f5070d_rwc_744x193x1706x1706x32.png?h=353fe99ba9b4f25a5c9a18a5e7f5db81"
  },
  {
    id: 8,
    title: "Bleep Machine",
    slug: "bleep-machine",
    imageUrl: "https://cdn.myportfolio.com/519f7bbb-e55e-4372-8a59-fce548e099e1/d78829a5-8f56-4da1-a7d8-4025e0321c97_carw_202x158x32.png?h=46f8f4ead3753b95b551f2c8754a1848"
  },
  {
    id: 9,
    title: "St Helens College: 16-18 Recruitment Campaigns",
    slug: "st-helens-college-16-18-recruitment-campaigns",
    imageUrl: "https://cdn.myportfolio.com/519f7bbb-e55e-4372-8a59-fce548e099e1/f6082991-f41b-4885-8aaf-602b8bbdcabd_rwc_0x0x990x990x32.jpg?h=38096d7975724c908e7e044f6eca713e"
  },
  {
    id: 10,
    title: "Clay Brow Nano Brewery",
    slug: "clay-brow-nano-brewery",
    imageUrl: "https://cdn.myportfolio.com/519f7bbb-e55e-4372-8a59-fce548e099e1/6627c629-4f6f-48a0-8d3e-60c0f860ec4c_rwc_63x0x990x990x32.png?h=16b554612f3292244bfbe7083d388c27"
  },
  {
    id: 11,
    title: "CatHop Beers",
    slug: "cathop-beers",
    imageUrl: "https://cdn.myportfolio.com/519f7bbb-e55e-4372-8a59-fce548e099e1/38369d6a-795b-403e-bbc0-b47ed5a8ae2b_carw_202x158x32.png?h=7f0d045bfa4ae696b726172acdf2d727"
  },
  {
    id: 12,
    title: "Ashform",
    slug: "ashform",
    imageUrl: "https://cdn.myportfolio.com/519f7bbb-e55e-4372-8a59-fce548e099e1/70a02c1d-11d4-425a-b6e4-18ffb8e6cfb4_rwc_197x83x761x761x32.png?h=d45a3e31b5740ac06964d2eeaa3241a3"
  },
  {
    id: 13,
    title: "Happy Bunnies",
    slug: "happy-bunnies",
    imageUrl: "https://cdn.myportfolio.com/519f7bbb-e55e-4372-8a59-fce548e099e1/7b1be882-1181-446b-a55a-8860905d2866_rwc_225x0x1980x1980x32.png?h=48d880cb0a11eb2fdfcf957113709a0f"
  },
  {
    id: 14,
    title: "Money Management Team",
    slug: "money-management-team",
    imageUrl: "https://cdn.myportfolio.com/519f7bbb-e55e-4372-8a59-fce548e099e1/47a586cc-8c88-4670-b1b9-d6deaf5f6963_rwc_213x46x781x781x32.png?h=d8d9902ba776d782040743c43c806598"
  },
  {
    id: 15,
    title: "Ellis-Hall Publications",
    slug: "ellis-hall-publications",
    imageUrl: "https://cdn.myportfolio.com/519f7bbb-e55e-4372-8a59-fce548e099e1/a8b12899-3211-46a5-a7ce-afe78cbd0ffb_carw_202x158x32.png?h=06eaaabced91e42fdf4c6987475f4006"
  }
];

export default projects;
