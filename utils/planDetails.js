const planDetails = [
  {
    id: 1,
    name: "Standard",
    price: 5,
    displayPrice: "$4.99",
    validMonths: 1,
    period: "month",
    periodName: "Monthly",
    description: "Token will expire after a month",
  },
  {
    id: 2,
    name: "Premium",
    price: 10,
    displayPrice: "$9.99",
    validMonths: 3,
    period: "3 months",
    periodName: "Quarterly",
    description: "Token will expire after 3 months",
  },
  {
    id: 3,
    name: "Pro",
    price: 20,
    displayPrice: "$19.99",
    validMonths: 12,
    period: "year",
    periodName: "Annual",
    description: "Token will expire after a year",
  },
];

module.exports = planDetails;
