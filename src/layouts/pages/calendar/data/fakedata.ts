import { TreeNode } from "primereact/treenode";

const mockData: TreeNode[] = [
  {
    key: "0",
    data: {
      userAppDtoWithoutPhoto: {
        firstName: "Ali",
        lastName: "Yılmaz",
      },
      customerRef: {
        name: "ABC Şirketi",
      },
    },
    children: [
      {
        key: "0-0",
        data: {
          name: "Toplantı",
          monday: "14:00 - 15:00",
          tuesday: "Yok",
          wednesday: "Yok",
          thursday: "Yok",
          friday: "10:00 - 11:00",
          saturday: "Yok",
          sunday: "Yok",
        },
      },
      {
        key: "0-1",
        data: {
          name: "Rapor Hazırlama",
          monday: "15:00 - 17:00",
          tuesday: "13:00 - 15:00",
          wednesday: "Yok",
          thursday: "Yok",
          friday: "14:00 - 16:00",
          saturday: "Yok",
          sunday: "Yok",
        },
      },
    ],
  },

  {
    key: "2",
    data: {
      userAppDtoWithoutPhoto: {
        firstName: "Mehmet",
        lastName: "Kara",
      },
      customerRef: {
        name: "Tekno Ltd.",
      },
    },
    children: [
      {
        key: "2-0",
        data: {
          name: "Saha Ziyareti",
          monday: "10:00 - 12:00",
          tuesday: "10:00 - 12:00",
          wednesday: "Yok",
          thursday: "Yok",
          friday: "10:00 - 12:00",
          saturday: "Yok",
          sunday: "Yok",
        },
      },
    ],
  },
  {
    key: "3",
    data: {
      userAppDtoWithoutPhoto: {
        firstName: "Zeynep",
        lastName: "Koç",
      },
      customerRef: {
        name: "Beta Bilişim",
      },
    },
    children: [
      {
        key: "3-0",
        data: {
          name: "Müşteri Görüşmesi",
          monday: "11:00 - 12:30",
          tuesday: "11:00 - 12:30",
          wednesday: "11:00 - 12:30",
          thursday: "11:00 - 12:30",
          friday: "11:00 - 12:30",
          saturday: "Yok",
          sunday: "Yok",
        },
      },
      {
        key: "3-1",
        data: {
          name: "Müşteri Görüşmesi",
          monday: "11:00 - 12:30",
          tuesday: "11:00 - 12:30",
          wednesday: "11:00 - 12:30",
          thursday: "11:00 - 12:30",
          friday: "11:00 - 12:30",
          saturday: "Yok",
          sunday: "Yok",
        },
      },
    ],
  },
];

export default mockData;

const test = {
  key: "0",
  userAppDtoWithoutPhoto: {
    firstName: "John",
    lastName: "Doe",
  },
  customerRef: {
    name: "ABC Şirketi",
  },

  children: [
    {
      key: "0-0",
      data: {
        name: "Toplantı",
        monday: true,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: true,
        saturday: false,
        sunday: false,
      },
    },
    {
      key: "0-1",
      data: {
        name: "Rapor Hazırlama",
        monday: true,
        tuesday: true,
        wednesday: false,
        thursday: false,
        friday: true,
        saturday: false,
        sunday: false,
      },
    },
  ],
};
