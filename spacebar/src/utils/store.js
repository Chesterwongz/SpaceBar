const items = [
  {
    id: "item-1",
    title: "Learn how to cook",
  },
  {
    id: "item-2",
    title: "Make sandwich",
  },
  {
    id: "item-3",
    title: "Take the trash out",
  },
];

const data = {
  lists: {
    "list-1": {
      id: "list-1",
      title: "Todo",
      items,
    },
    "list-2": {
      id: "list-2",
      title: "Doing",
      items: [],
    },
    "list-3": {
      id: "list-3",
      title: "Review",
      items: [],
    },
    "list-4": {
      id: "list-4",
      title: "Done",
      items: [],
    },
  },
  listIds: ["list-1", "list-2", "list-3", "list-4"],
};

export default data;
